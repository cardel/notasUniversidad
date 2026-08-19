/* Ejercicio interactivo: factorial (clase 2, invariantes de ciclo). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def factorial(n):",                    num: null },
    { txt: "    indice = 0",                       num: 1 },
    { txt: "    resultado = 1",                    num: 2 },
    { txt: "    while indice != n:",               num: 3 },
    { txt: "        indice = indice + 1",          num: 4 },
    { txt: "        resultado = resultado * indice", num: 5 },
    { txt: "    return resultado",                 num: 6 }
  ];

  function factorialDe(k) {
    var f = 1;
    var t = 1;
    while (t <= k) {
      f = f * t;
      t = t + 1;
    }
    return f;
  }

  function simular(params) {
    var n = params.n;
    var pasos = [];
    var indice = null, resultado = null;
    function snap(linea, extra) {
      var p = { linea: linea, indice: indice, resultado: resultado };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    indice = 0; snap(1);
    resultado = 1; snap(2);
    var corriendo = true;
    while (corriendo) {
      snap(3, { chequeo: true });
      if (indice !== n) {
        indice = indice + 1; snap(4);
        resultado = resultado * indice; snap(5);
      } else {
        corriendo = false;
      }
    }
    snap(6);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular, factorialDe: factorialDe };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var descubierto = false;

    function alPintar(e) {
      var cuerpo = document.getElementById("cuerpo-estados");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.chequeo) {
          fila = fila + 1;
          var tr = document.createElement("tr");
          var patron = descubierto
            ? p.indice + "! = " + EJERCICIO.factorialDe(p.indice) + " ✓"
            : "…";
          tr.innerHTML = "<td>" + fila + "</td><td>" + p.indice + "</td><td>" +
            p.resultado + "</td><td" + (descubierto ? "" : " class='pend'") + ">" +
            patron + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='4' class='pend'>Ejecute: cada chequeo del while agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }
      document.getElementById("col-patron").textContent = descubierto
        ? "resultado = indice!"
        : "¿Qué se repite?";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "indice", rotulo: "indice" },
        { campo: "resultado", rotulo: "resultado", clase: "cuenta" }
      ],
      paramsIniciales: { n: 4 },
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var n = params.n;
      var esperado = EJERCICIO.factorialDe(n);
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: factorial(" + n + ") = " + esperado +
          ". Ahora ejecute y fíjese en la pareja (indice, resultado) de cada vuelta." };
      }
      if (valor === n * (n - 1)) {
        return { ok: false, msg: "Multiplicó solo los dos últimos factores. El ciclo " +
          "acumula todos: 1 · 2 · … · n." };
      }
      if (valor === Math.pow(2, n)) {
        return { ok: false, msg: "Eso sería duplicar en cada vuelta. Aquí el factor " +
          "cambia: en la vuelta k se multiplica por k." };
      }
      if (valor === n) {
        return { ok: false, msg: "Ese es el número de vueltas. resultado acumula el " +
          "producto de todas." };
      }
      return { ok: false, msg: "No coincide. Recuerde: n! = 1 · 2 · … · n." };
    });

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      var n = parseInt(ev.target.value, 10);
      document.getElementById("ver-n").textContent = n;
      document.getElementById("pred-n").textContent = n;
      Motor.limpiarVeredicto();
      Motor.reiniciar({ n: n });
    });

    /* ---- tarjeta 4: el patrón ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-patron button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-patron");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          descubierto = true;
          v.className = "veredicto bien";
          v.textContent = "Ese es el invariante: en cada chequeo, resultado es " +
            "exactamente el factorial de indice. La tabla ya lo verifica fila por " +
            "fila y los cuatro pasos quedaron habilitados.";
          document.getElementById("paso-1").classList.remove("bloqueado");
          document.getElementById("nota-pasos").innerHTML = "Invariante: " +
            "<b>resultado = indice!</b>. Armemos la demostración.";
          Motor.repintar();
        } else if (op === "meta") {
          v.className = "veredicto mal";
          v.textContent = "Esa es la poscondición, la meta. En la primera fila " +
            "resultado vale 1, no n!: la meta solo se cumple al final.";
        } else if (op === "prod") {
          v.className = "veredicto mal";
          v.textContent = "Mire la primera fila: indice · (indice − 1) = 0 con " +
            "indice = 0, pero resultado vale 1. Se rompe de entrada.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Cierto en cada fila, pero no menciona a resultado: con " +
            "ese invariante el paso de éxito no entrega la poscondición. Un " +
            "invariante útil habla del acumulador.";
        }
      });
    });

    /* ---- tarjeta 5: los cuatro pasos ---- */
    function completarPaso(idPaso, idSiguiente) {
      document.getElementById(idPaso).classList.add("hecho");
      if (idSiguiente) {
        document.getElementById(idSiguiente).classList.remove("bloqueado");
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-p1");
        if (btn.getAttribute("data-p1") === "si") {
          v.className = "veredicto bien";
          v.textContent = "Correcto.";
          completarPaso("paso-1", "paso-2");
        } else {
          v.className = "veredicto mal";
          v.textContent = "0! se define como 1: el producto vacío. Por eso resultado " +
            "arranca en 1 y no en 0.";
        }
      });
    });

    document.getElementById("btn-p2").addEventListener("click", function () {
      completarPaso("paso-2", "paso-3");
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-3 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-p3");
        var op = btn.getAttribute("data-p3");
        if (op === "nf") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: invariante más estado final producen la poscondición.";
          completarPaso("paso-3", "paso-4");
        } else if (op === "n1") {
          v.className = "veredicto mal";
          v.textContent = "El invariante habla del indice actual, y al salir indice = n, " +
            "no n − 1. Mire la última fila de la traza.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Sí dice: resultado = indice!. Justo por eso elegimos un " +
            "invariante que menciona al acumulador.";
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-4 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-p4");
        var op = btn.getAttribute("data-p4");
        if (op === "pre") {
          v.className = "veredicto bien";
          v.textContent = "Correcto. Y la tarjeta 6 muestra qué pasa cuando esa " +
            "hipótesis falta.";
          completarPaso("paso-4", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "finitos") {
          v.className = "veredicto mal";
          v.textContent = "En matemáticas los enteros no se acaban, y la demostración " +
            "es sobre el algoritmo, no sobre los límites de la máquina.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "La invarianza dice que el invariante sobrevive, no que el " +
            "ciclo avance hacia la salida. Son pasos distintos por una razón.";
        }
      });
    });

    /* ---- tarjeta 6: n = -1 ---- */
    document.getElementById("btn-negativo").addEventListener("click", function () {
      var sec = document.getElementById("sec-negativo");
      sec.innerHTML = "";
      var valores = [[0, 1], [1, 1], [2, 2], [3, 6], [4, 24], [5, 120]];
      valores.forEach(function (par, idx) {
        var ficha = document.createElement("span");
        ficha.className = "ficha";
        ficha.textContent = "(" + par[0] + ", " + par[1] + ")";
        sec.appendChild(ficha);
        if (idx < valores.length - 1) {
          var flecha = document.createElement("span");
          flecha.className = "flecha";
          flecha.textContent = "→";
          sec.appendChild(flecha);
        }
      });
      var dots = document.createElement("span");
      dots.className = "flecha";
      dots.textContent = "→ … (sin final)";
      sec.appendChild(dots);
      document.getElementById("alerta-negativo").style.display = "block";
    });
  })();
}
