/* Piezas que comparten los widgets de esta sesion: formato de numeros,
   veredicto de una prediccion, opciones con retroalimentacion por distractor
   y el Gantt por hilo. Cada widget carga este archivo antes del suyo.      */

var Motor = (function () {

  /* 1234.5 -> "1.234,5"; los enteros salen sin decimales. */
  function num(x, d) {
    var partes = x.toFixed(d === undefined ? 0 : d).split(".");
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var s = partes.join(",");
    return d ? s.replace(/,?0+$/, "") : s;
  }

  function leerNumero(id) {
    var el = document.getElementById(id);
    return parseFloat(String(el.value).replace(/\./g, "").replace(",", "."));
  }

  /* Decide si la prediccion del estudiante vale como acierto.
     Devuelve { bien: true|false, motivo: texto corto }.                    */
  function veredictoNumerico(dicho, esperado) {
    if (isNaN(dicho)) {
      return { bien: false, motivo: "Escriba un número antes de comprobar." };
    }
    // Un conteo (hilos, subrangos, elementos) solo vale exacto; un tiempo o
    // una relacion admite un 2 % de diferencia, que es lo que se pierde al
    // redondear de cabeza.
    if (Number.isInteger(esperado)) {
      return { bien: dicho === esperado, motivo: "" };
    }
    var margen = Math.max(Math.abs(esperado) * 0.02, 0.005);
    return { bien: Math.abs(dicho - esperado) <= margen, motivo: "" };
  }

  /* Conecta una caja de prediccion: el boton lee el numero, lo compara con
     lo que devuelva esperado() y escribe en la caja de veredicto el texto
     que arme explicar(bien, esperado, dicho).                              */
  function conectarPrediccion(ids, esperado, explicar) {
    var caja = document.getElementById(ids.veredicto);
    document.getElementById(ids.boton).addEventListener("click", function () {
      var dicho = leerNumero(ids.entrada);
      var real = esperado();
      var v = veredictoNumerico(dicho, real);
      caja.className = "veredicto " + (v.bien ? "bien" : "mal");
      caja.textContent = isNaN(dicho) ? v.motivo : explicar(v.bien, real, dicho);
    });
  }

  /* Botones con data-op dentro de #idOpciones; "correcta" pinta en verde y
     cualquier otra clave en rojo, con el texto que traiga razones[op].     */
  function conectarOpciones(idOpciones, idVeredicto, razones) {
    var caja = document.getElementById(idVeredicto);
    document.querySelectorAll("#" + idOpciones + " button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        caja.className = "veredicto " + (op === "correcta" ? "bien" : "mal");
        caja.textContent = razones[op];
      });
    });
  }

  /* filas: [{ rotulo, bloques: [{ inicio, fin, color, texto }] }]
     Los huecos entre bloques quedan vacios: es tiempo de espera.          */
  function pintarGantt(idCaja, filas, escala) {
    var html = "";
    filas.forEach(function (f) {
      var dentro = "", reloj = 0;
      f.bloques.slice().sort(function (a, b) { return a.inicio - b.inicio; })
        .forEach(function (b) {
          if (b.inicio > reloj) {
            dentro += "<span style=\"flex:none;width:" +
              ((b.inicio - reloj) / escala * 100) + "%\"></span>";
          }
          dentro += "<span class=\"barra\" title=\"" + (b.titulo || "") +
            "\" style=\"flex:none;width:" + ((b.fin - b.inicio) / escala * 100) +
            "%;background:" + b.color + ";color:#fff;text-align:center;" +
            "font-size:0.75rem;line-height:22px;overflow:hidden\">" +
            (b.texto || "") + "</span>";
          reloj = b.fin;
        });
      html += "<div class=\"barra-fila\"><span class=\"rotulo\">" + f.rotulo +
        "</span><span class=\"pista-barra\" style=\"display:flex\">" + dentro +
        "</span><span class=\"valor\">" + (f.valor !== undefined ? f.valor : num(reloj)) +
        "</span></div>";
    });
    document.getElementById(idCaja).innerHTML = html;
  }

  function pintarChips(idCaja, lista) {
    document.getElementById(idCaja).innerHTML = lista.map(function (c) {
      return "<span class=\"chip" + (c.cuenta ? " cuenta" : "") + "\">" +
        c.texto + " <b>" + c.valor + "</b></span>";
    }).join("");
  }

  return {
    num: num, leerNumero: leerNumero, veredictoNumerico: veredictoNumerico,
    conectarPrediccion: conectarPrediccion, conectarOpciones: conectarOpciones,
    pintarGantt: pintarGantt, pintarChips: pintarChips
  };
})();

if (typeof module !== "undefined" && module.exports) { module.exports = Motor; }
