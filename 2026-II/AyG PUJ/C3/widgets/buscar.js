/* Ejercicio interactivo: busqueda binaria (clase 3). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def buscar(lista, v):",                num: null },
    { txt: "    ini = 0",                          num: 1 },
    { txt: "    fin = len(lista)",                 num: 2 },
    { txt: "    while fin - ini > 1:",             num: 3 },
    { txt: "        mitad = (ini + fin) // 2",     num: 4 },
    { txt: "        if v < lista[mitad]:",         num: 5 },
    { txt: "            fin = mitad",              num: 6 },
    { txt: "        else:",                        num: null },
    { txt: "            ini = mitad",              num: 7 },
    { txt: "    return lista[ini] == v",           num: 8 }
  ];

  function simular(params) {
    var lista = params.lista;
    var v = params.v;
    var pasos = [];
    var ini = null, fin = null, mitad = null;
    function snap(linea, extra) {
      var p = { linea: linea, ini: ini, fin: fin, mitad: mitad,
                ancho: (ini === null || fin === null) ? null : fin - ini };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    ini = 0; snap(1);
    fin = lista.length; snap(2);
    var corriendo = true;
    while (corriendo) {
      snap(3, { chequeo: true });
      if (fin - ini > 1) {
        mitad = Math.floor((ini + fin) / 2);
        snap(4);
        snap(5);
        if (v < lista[mitad]) {
          fin = mitad;
          snap(6, { evento: v + " < " + lista[mitad] + ": mitad izquierda",
                    corte: "izquierda" });
        } else {
          ini = mitad;
          snap(7, { evento: v + " >= " + lista[mitad] + ": mitad derecha",
                    corte: "derecha" });
        }
      } else {
        corriendo = false;
      }
    }
    mitad = null;
    snap(8, { respuesta: lista[ini] === v });
    return pasos;
  }

  return { codigo: CODIGO, simular: simular };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { lista: [1, 4, 6, 8, 10, 13, 20, 22], v: 13 },
      { lista: [1, 4, 6, 8, 10, 13, 20, 22], v: 5 },
      { lista: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37], v: 31 }
    ];

    function alPintar(e) {
      var lista = e.params.lista;
      var v = e.params.v;
      var actual = e.actual;
      var ini = actual && actual.ini !== null ? actual.ini : 0;
      var fin = actual && actual.fin !== null ? actual.fin : lista.length;
      var mitad = actual ? actual.mitad : null;

      var panel = document.getElementById("panel-arreglo");
      panel.innerHTML = "";
      var fila = document.createElement("div");
      fila.className = "arreglo";
      lista.forEach(function (x, i) {
        var caja = document.createElement("div");
        var clases = "caja";
        if (i < ini || i >= fin) {
          clases = clases + " descartada";
        } else {
          clases = clases + " viva";
        }
        if (mitad !== null && i === mitad) { clases = clases + " actual"; }
        caja.className = clases;
        var idx = document.createElement("span");
        idx.className = "indice";
        idx.textContent = i;
        caja.appendChild(idx);
        caja.appendChild(document.createTextNode(x));
        fila.appendChild(caja);
      });
      panel.appendChild(fila);

      var pie = document.createElement("div");
      pie.className = "nota";
      pie.style.marginTop = "1.2rem";
      pie.innerHTML = "Se busca <b>v = " + v + "</b>. Ventana viva: " +
        "<b>[" + ini + ".." + fin + ")</b>, de ancho " + (fin - ini) +
        (mitad !== null ? "; mitad = <b>" + mitad + "</b>" : "");
      panel.appendChild(pie);

      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var antes = { ini: 0, fin: lista.length };
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.evento) {
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>[" + antes.ini + ".." + antes.fin + ")</td><td>" +
            p.mitad + "</td><td>" + lista[p.mitad] + "</td><td>" + p.evento + "</td>";
          cuerpo.appendChild(tr);
          antes = { ini: p.ini, fin: p.fin };
        }
      }
      if (cuerpo.children.length === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='4' class='pend'>Todavía no se descarta ninguna mitad.</td>";
        cuerpo.appendChild(trv);
      }
      if (e.terminado && actual && actual.respuesta !== undefined) {
        var trf = document.createElement("tr");
        trf.innerHTML = "<td>[" + ini + ".." + fin + ")</td><td>—</td><td>—</td><td>" +
          "caso base: lista[" + ini + "] = " + lista[ini] + " → <b>" +
          (actual.respuesta ? "True" : "False") + "</b></td>";
        cuerpo.appendChild(trf);
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "ini", rotulo: "ini" },
        { campo: "fin", rotulo: "fin" },
        { campo: "mitad", rotulo: "mitad" },
        { campo: "ancho", rotulo: "ancho", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var n = params.lista.length;
      var esperado = Math.ceil(Math.log(n) / Math.log(2));
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: con " + n + " posiciones hacen falta " +
          esperado + " divisiones para llegar a una sola, porque 2^" + esperado +
          " ≥ " + n + ". Ese es el lg n del costo." };
      }
      if (valor === n || valor === n - 1) {
        return { ok: false, msg: "Ese es el número de comparaciones de la búsqueda " +
          "lineal. Aquí cada comparación descarta la mitad, no un elemento." };
      }
      if (valor === Math.floor(n / 2)) {
        return { ok: false, msg: "Dividió una sola vez. La división se repite sobre " +
          "la mitad que sobrevive, y otra vez sobre la mitad de esa." };
      }
      return { ok: false, msg: "No coincide. Cuente: de " + n + " se pasa a " +
        Math.floor(n / 2) + ", luego a " + Math.floor(n / 4) + "… ¿cuántos pasos " +
        "hasta llegar a 1?" };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    /* ---- tarjeta 4: los dos invariantes ---- */
    var patronOK = false;
    var cotasOK = false;
    function revisarDescubrimiento() {
      if (patronOK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes: " +
          "<b>I₀: 0 ≤ ini &lt; fin ≤ N</b> e <b>I₁: la respuesta del arreglo " +
          "completo es la misma que la de la ventana lista[ini..fin)</b>.";
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-patron button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-patron");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          patronOK = true;
          d.className = "veredicto bien";
          d.textContent = "Ese es I₁. No dice dónde está v: dice que buscarlo en " +
            "la ventana da la misma respuesta que buscarlo en todo el arreglo. Ese " +
            "es justo el trabajo del algoritmo, encoger sin cambiar la respuesta.";
          revisarDescubrimiento();
        } else if (op === "esta") {
          d.className = "veredicto mal";
          d.textContent = "Falso cuando v no está en el arreglo: pruebe con v = 5. " +
            "El algoritmo igual funciona, así que el invariante no puede afirmar eso.";
        } else if (op === "ordenada") {
          d.className = "veredicto mal";
          d.textContent = "Cierto, pero es la precondición, no el invariante: el " +
            "arreglo llega ordenado y nadie lo modifica. Un invariante habla de lo " +
            "que cambia.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Esa es la poscondición: solo vale al final, cuando la " +
            "ventana ya quedó de una posición.";
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cotas button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-cotas");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          cotasOK = true;
          d.className = "veredicto bien";
          d.textContent = "Ese es I₀. La desigualdad estricta ini < fin importa: " +
            "garantiza que la ventana nunca queda vacía, y por eso lista[ini] " +
            "existe cuando el ciclo termina.";
          revisarDescubrimiento();
        } else if (op === "floja") {
          d.className = "veredicto mal";
          d.textContent = "Con ini ≤ fin la ventana podría quedar vacía, y entonces " +
            "lista[ini] de la última línea no tendría nada que leer.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Mire el último chequeo: el ciclo termina justo cuando el " +
            "ancho llega a 1. Exigir ancho > 1 dejaría ese chequeo fuera.";
        }
      });
    });

    /* ---- tarjeta 5: la demostración ---- */
    function cablearPaso(idBoton, idPaso, idSiguiente, alFinal) {
      document.getElementById(idBoton).addEventListener("click", function () {
        document.getElementById(idPaso).classList.add("hecho");
        if (idSiguiente) {
          document.getElementById(idSiguiente).classList.remove("bloqueado");
        }
        if (alFinal) { alFinal(); }
      });
    }
    cablearPaso("btn-b1", "paso-1", "paso-2");
    cablearPaso("btn-b2", "paso-2", "paso-3");
    cablearPaso("btn-b3", "paso-3", null, function () {
      document.getElementById("conclusion").style.display = "block";
    });

    /* ---- tarjeta 6: por que se puede descartar ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-descarte button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-descarte");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          d.className = "veredicto bien";
          d.textContent = "Exacto: si v ≥ lista[mitad] y hubiera un testigo p < mitad, " +
            "el orden daría v = lista[p] ≤ lista[mitad] ≤ v, o sea lista[mitad] = v; " +
            "entonces mitad mismo sirve de testigo y está en la mitad derecha. Nada " +
            "se pierde.";
        } else if (op === "unico") {
          d.className = "veredicto mal";
          d.textContent = "El valor puede repetirse: pruebe a imaginar [4, 4, 4]. El " +
            "argumento no necesita unicidad, necesita el orden.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Sin el orden no hay nada que garantice que la mitad " +
            "descartada no tenía a v. El orden es la única razón.";
        }
      });
    });

    /* ---- tarjeta 7: costo ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-costo button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-costo");
        var op = btn.getAttribute("data-op");
        if (op === "log") {
          d.className = "veredicto bien";
          d.textContent = "Correcto: T(n) = T(n/2) + Θ(1). Sobrevive una sola mitad y " +
            "decidir cuál cuesta una comparación, así que los niveles se acaban en " +
            "lg n pasos. Con un millón de elementos son 20 comparaciones.";
        } else if (op === "lineal") {
          d.className = "veredicto mal";
          d.textContent = "Ese es el costo de la búsqueda lineal, que no aprovecha el " +
            "orden. Mire la traza: aquí el ancho se parte a la mitad en cada vuelta.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Ese sería el costo si en cada vuelta hubiera que recorrer " +
            "la ventana. Aquí cada vuelta hace una comparación y nada más.";
        }
      });
    });
  })();
}
