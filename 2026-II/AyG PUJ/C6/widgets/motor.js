/* Motor comun de los ejercicios interactivos de conteo.
   Cada pagina define una configuracion y llama Motor.iniciar(cfg):
     cfg.codigo          arreglo de {txt, num, bloque?}; num null = linea sin conteo
     cfg.simular(params) devuelve la lista de pasos [{linea, ...variables}]
     cfg.chips           arreglo de {campo, rotulo, clase?} leidos del paso actual
     cfg.paramsIniciales parametros de la primera simulacion
     cfg.alPintar(e)     gancho con {pasos, k, conteos, actual, params, terminado} */
(function () {
  var cfg = null;
  var pasos = [];
  var k = 0;
  var params = null;
  var temporizador = null;

  function construirCodigo() {
    var panel = document.getElementById("panel-codigo");
    panel.innerHTML = "";
    cfg.codigo.forEach(function (l, idx) {
      var div = document.createElement("div");
      div.className = "linea" + (l.bloque ? " bloque-" + l.bloque : "");
      div.id = "linea-" + idx;
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = l.num === null ? "" : l.num;
      var txt = document.createElement("span");
      txt.className = "txt";
      txt.textContent = l.txt;
      div.appendChild(num);
      div.appendChild(txt);
      if (l.num !== null) {
        var cont = document.createElement("span");
        cont.className = "cont";
        cont.id = "cont-" + l.num;
        cont.textContent = "× 0";
        div.appendChild(cont);
      }
      panel.appendChild(div);
    });
  }

  function construirChips() {
    var caja = document.getElementById("chips");
    caja.innerHTML = "";
    cfg.chips.forEach(function (c) {
      var span = document.createElement("span");
      span.className = "chip" + (c.clase ? " " + c.clase : "");
      var b = document.createElement("b");
      b.id = "chip-" + c.campo;
      b.textContent = "–";
      span.appendChild(document.createTextNode(c.rotulo + " = "));
      span.appendChild(b);
      caja.appendChild(span);
    });
  }

  function indiceDeLinea(numLinea) {
    var idx = -1;
    cfg.codigo.forEach(function (l, i) { if (l.num === numLinea) { idx = i; } });
    return idx;
  }

  function pintar() {
    var conteos = {};
    var m;
    for (m = 0; m < k; m = m + 1) {
      var linea = pasos[m].linea;
      conteos[linea] = (conteos[linea] || 0) + 1;
    }
    var actual = k > 0 ? pasos[k - 1] : null;

    cfg.codigo.forEach(function (l, idx) {
      var div = document.getElementById("linea-" + idx);
      div.classList.remove("actual");
      if (l.num !== null) {
        var badge = document.getElementById("cont-" + l.num);
        var veces = conteos[l.num] || 0;
        badge.textContent = "× " + veces;
        badge.className = veces > 0 ? "cont activo" : "cont";
      }
    });
    if (actual) {
      var idxActual = indiceDeLinea(actual.linea);
      if (idxActual >= 0) {
        document.getElementById("linea-" + idxActual).classList.add("actual");
      }
    }

    cfg.chips.forEach(function (c) {
      var celda = document.getElementById("chip-" + c.campo);
      var valor = actual && actual[c.campo] !== null && actual[c.campo] !== undefined
        ? actual[c.campo] : "–";
      celda.textContent = valor;
    });
    document.getElementById("ver-paso").textContent = k;
    document.getElementById("ver-total").textContent = pasos.length;

    if (cfg.alPintar) {
      cfg.alPintar({
        pasos: pasos, k: k, conteos: conteos, actual: actual,
        params: params, terminado: k >= pasos.length
      });
    }
  }

  function detenerAuto() {
    if (temporizador !== null) {
      clearInterval(temporizador);
      temporizador = null;
      document.getElementById("btn-auto").textContent = "Auto";
    }
  }

  function reiniciar(nuevosParams) {
    detenerAuto();
    if (nuevosParams !== undefined) { params = nuevosParams; }
    pasos = cfg.simular(params);
    k = 0;
    pintar();
  }

  function iniciar(configuracion) {
    cfg = configuracion;
    params = cfg.paramsIniciales;
    construirCodigo();
    construirChips();
    document.getElementById("btn-paso").addEventListener("click", function () {
      detenerAuto();
      if (k < pasos.length) { k = k + 1; }
      pintar();
    });
    document.getElementById("btn-auto").addEventListener("click", function () {
      if (temporizador !== null) {
        detenerAuto();
      } else {
        document.getElementById("btn-auto").textContent = "Pausa";
        temporizador = setInterval(function () {
          if (k < pasos.length) {
            k = k + 1;
            pintar();
          } else {
            detenerAuto();
          }
        }, 130);
      }
    });
    document.getElementById("btn-fin").addEventListener("click", function () {
      detenerAuto();
      k = pasos.length;
      pintar();
    });
    document.getElementById("btn-reiniciar").addEventListener("click", function () {
      reiniciar();
    });
    reiniciar(params);
  }

  /* Cablea la tarjeta de prediccion numerica estandar.
     evaluar(valor, params) devuelve {ok, msg}. */
  function prediccionNumerica(evaluar) {
    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var campo = document.getElementById("prediccion");
      var v = document.getElementById("veredicto");
      var valor = parseInt(campo.value, 10);
      var res;
      if (isNaN(valor)) {
        res = { ok: false, msg: "Escriba un número primero." };
      } else {
        res = evaluar(valor, params);
      }
      v.className = res.ok ? "veredicto bien" : "veredicto mal";
      v.textContent = res.msg;
    });
  }

  function limpiarVeredicto() {
    var v = document.getElementById("veredicto");
    if (v) {
      v.className = "veredicto";
      v.textContent = "";
    }
  }

  window.Motor = {
    iniciar: iniciar,
    reiniciar: reiniciar,
    repintar: pintar,
    prediccionNumerica: prediccionNumerica,
    limpiarVeredicto: limpiarVeredicto
  };
})();
