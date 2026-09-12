/* Ejercicio interactivo: la traza de punteros (clase 7). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int x = 3;",       num: 1 },
    { txt: "int y = 8;",       num: 2 },
    { txt: "int *p;",          num: 3 },
    { txt: "p = &x;",          num: 4 },
    { txt: "*p = 7;",          num: 5 },
    { txt: "p = &y;",          num: 6 },
    { txt: "*p = *p + 1;",     num: 7 },
    { txt: "printf(\"x = %d, y = %d\\n\", x, y);", num: 8 }
  ];

  function simular() {
    var pasos = [];
    var x = null, y = null, p = null;
    function snap(linea) {
      pasos.push({ linea: linea, x: x, y: y, p: p });
    }
    x = 3; snap(1);
    y = 8; snap(2);
    p = "?"; snap(3);
    p = "&x"; snap(4);
    x = 7; snap(5);
    p = "&y"; snap(6);
    y = y + 1; snap(7);
    snap(8);
    return pasos;
  }

  function finales() {
    var pasos = simular();
    var ultimo = pasos[pasos.length - 1];
    return { x: ultimo.x, y: ultimo.y };
  }

  return { codigo: CODIGO, simular: simular, finales: finales };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {

    function alPintar(e) {
      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var paso = e.pasos[m];
        var linea = EJERCICIO.codigo[paso.linea - 1];
        var tr = document.createElement("tr");
        tr.innerHTML = "<td style='text-align:left;font-family:ui-monospace,monospace'>" +
          linea.txt + "</td><td>" + paso.x + "</td><td>" + paso.y + "</td><td>" +
          (paso.p === null ? "–" : paso.p) + "</td>";
        cuerpo.appendChild(tr);
      }
      var nota = document.getElementById("nota-traza");
      if (e.terminado) {
        nota.innerHTML = "La traza completa. La salida del programa: " +
          "<b>x = " + e.pasos[e.pasos.length - 1].x + ", y = " +
          e.pasos[e.pasos.length - 1].y + "</b>.";
      } else {
        nota.textContent = "Cada paso agrega una fila: una columna por variable, " +
          "como en el tablero.";
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "x", rotulo: "x" },
        { campo: "y", rotulo: "y" },
        { campo: "p", rotulo: "p", clase: "cuenta" }
      ],
      paramsIniciales: {},
      alPintar: alPintar
    });

    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var vx = parseInt(document.getElementById("prediccion-x").value, 10);
      var vy = parseInt(document.getElementById("prediccion-y").value, 10);
      var v = document.getElementById("veredicto");
      var esperado = EJERCICIO.finales();
      if (isNaN(vx) || isNaN(vy)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba los dos valores primero.";
      } else if (vx === esperado.x && vy === esperado.y) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: x = " + esperado.x + ", y = " + esperado.y +
          ". Recorra la ejecución paso a paso y confirme en qué línea cambió cada una.";
      } else if (vx === 3 && vy === esperado.y) {
        v.className = "veredicto mal";
        v.textContent = "La y va bien, pero x no se quedó en 3: la línea *p = 7 " +
          "escribe en la celda a la que apunta p en ese momento. ¿A quién apuntaba?";
      } else if (vx === esperado.x && vy === 8) {
        v.className = "veredicto mal";
        v.textContent = "La x va bien, pero y no se quedó en 8: después de p = &y, " +
          "el mismo *p habla de otra variable.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: siga p con el dedo; *p siempre toca la " +
          "celda a la que p apunta en ese momento, no la de antes.";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-final button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-final");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: en ese momento p vale &y, así que *p lee y " +
            "escribe la celda de y. Qué toca *p depende del valor de p en ese " +
            "instante, no de su historia.";
        } else if (op === "x") {
          v.className = "veredicto mal";
          v.textContent = "A x la tocó la línea anterior (*p = 7), cuando p todavía " +
            "guardaba &x. Después de p = &y, x queda fuera del alcance de *p.";
        } else if (op === "p") {
          v.className = "veredicto mal";
          v.textContent = "*p no cambia a p: cambia la celda a la que p apunta. " +
            "Para mover a p se asigna sin asterisco (p = ...).";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Una sola celda: *p toca exactamente una dirección, la " +
            "que p guarda en ese momento.";
        }
      });
    });
  })();
}
