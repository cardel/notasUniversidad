/* Ejercicio interactivo: computa (clase 2, invariantes de ciclo). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def computa(a, b):",   num: null },
    { txt: "    res = 0",          num: 1 },
    { txt: "    i = 1",            num: 2 },
    { txt: "    while i <= b:",    num: 3 },
    { txt: "        i = i + 1",    num: 4 },
    { txt: "        res = res + a", num: 5 },
    { txt: "    return res",       num: 6 }
  ];

  function simular(params) {
    var a = params.a;
    var b = params.b;
    var pasos = [];
    var i = null, res = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, res: res };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    res = 0; snap(1);
    i = 1; snap(2);
    var corriendo = true;
    while (corriendo) {
      snap(3, { chequeo: true });
      if (i <= b) {
        i = i + 1; snap(4);
        res = res + a; snap(5);
      } else {
        corriendo = false;
      }
    }
    snap(6);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var descubierto = false;

    function alPintar(e) {
      var a = e.params.a;
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
            ? a + " · (" + p.i + " − 1) = " + (a * (p.i - 1)) + " ✓"
            : "…";
          tr.innerHTML = "<td>" + fila + "</td><td>" + p.i + "</td><td>" +
            p.res + "</td><td" + (descubierto ? "" : " class='pend'") + ">" +
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
        ? "res = a · (i − 1)"
        : "¿Qué se repite?";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "res", rotulo: "res", clase: "cuenta" }
      ],
      paramsIniciales: { a: 2, b: 3 },
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var a = params.a;
      var b = params.b;
      if (valor === a * b) {
        return { ok: true, msg: "Correcto: computa(" + a + ", " + b + ") devuelve " +
          (a * b) + ". El ciclo suma a una vez por vuelta, y da b vueltas: multiplica " +
          "sumando. Ahora ejecute y busque qué más esconde la traza." };
      }
      if (valor === a + b) {
        return { ok: false, msg: "Sumó a una sola vez. El while repite la suma: " +
          "cuente cuántas vueltas caben antes de que i pase a b." };
      }
      if (valor === Math.pow(a, b)) {
        return { ok: false, msg: "Eso sería si el cuerpo multiplicara res por a. " +
          "Aquí suma: mire la línea 5." };
      }
      if (valor === b) {
        return { ok: false, msg: "Ese es el número de vueltas, no lo que acumula res. " +
          "En cada vuelta res crece en a." };
      }
      return { ok: false, msg: "No coincide. Ejecute paso a paso y mire cómo crece res." };
    });

    function actualizarEtiquetas() {
      var a = parseInt(document.getElementById("rango-a").value, 10);
      var b = parseInt(document.getElementById("rango-b").value, 10);
      document.getElementById("ver-a").textContent = a;
      document.getElementById("ver-b").textContent = b;
      document.getElementById("pred-a").textContent = a;
      document.getElementById("pred-b").textContent = b;
      Motor.limpiarVeredicto();
      Motor.reiniciar({ a: a, b: b });
    }
    document.getElementById("rango-a").addEventListener("input", actualizarEtiquetas);
    document.getElementById("rango-b").addEventListener("input", actualizarEtiquetas);

    /* ---- tarjeta 4: el patrón ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-patron button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-patron");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          descubierto = true;
          v.className = "veredicto bien";
          v.textContent = "Ese es el invariante: res = a · (i − 1) se cumple en cada " +
            "chequeo, desde (1, 0) hasta el último. La tabla de arriba ya lo verifica " +
            "fila por fila, y la tarjeta 5 quedó habilitada.";
          document.getElementById("paso-1").classList.remove("bloqueado");
          document.getElementById("nota-pasos").innerHTML = "La relación " +
            "<b>res = a · (i − 1)</b> es el invariante. Los cuatro pasos lo usan " +
            "para demostrar que el ciclo es correcto.";
          Motor.repintar();
        } else if (op === "ai") {
          v.className = "veredicto mal";
          v.textContent = "Mire la primera fila: i = 1 y res = 0, pero a · 1 no es 0. " +
            "La relación correcta corre una posición atrás.";
        } else if (op === "ii") {
          v.className = "veredicto mal";
          v.textContent = "Con a = 2 la fila (2, 2) parece confirmarla, pero mire la " +
            "fila i = 3: i · (i − 1) = 6 y res marca 4. Un invariante no admite excepciones.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "res = a · b es la meta: solo se cumple en la última fila. " +
            "El invariante debe cumplirse en todas, incluida la primera.";
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
        if (btn.getAttribute("data-p1") === "10") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: res = 0 y luego i = 1, así que la primera foto es (1, 0).";
          completarPaso("paso-1", "paso-2");
        } else {
          v.className = "veredicto mal";
          v.textContent = "Relea las líneas 1 y 2: res arranca en 0 e i arranca en 1.";
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
        if (op === "b1") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: la última fila de la tabla lo confirma.";
          completarPaso("paso-3", "paso-4");
        } else if (op === "b") {
          v.className = "veredicto mal";
          v.textContent = "Con i = b la condición i ≤ b todavía se cumple y el ciclo da " +
            "una vuelta más. Mire la última fila de la traza.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "a solo aparece en la suma; la condición del while únicamente " +
            "compara i con b.";
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-4 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-p4");
        var op = btn.getAttribute("data-p4");
        if (op === "sube") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: hay una cantidad que progresa hacia la salida en cada vuelta.";
          completarPaso("paso-4", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "res") {
          v.className = "veredicto mal";
          v.textContent = "res puede crecer sin límite; lo que decide la salida es i contra b.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Ojalá: while True: pass no termina nunca. La terminación " +
            "siempre hay que demostrarla.";
        }
      });
    });
  })();
}
