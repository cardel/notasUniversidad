/* Ejercicio interactivo: valores contra direcciones (clase 7). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int a = 10;",      num: 1 },
    { txt: "int b = 20;",      num: 2 },
    { txt: "int *p = &a;",     num: 3 },
    { txt: "int *q = &b;",     num: 4 },
    { txt: "*p = *q;",         num: 5 },
    { txt: "q = p;",           num: 6 },
    { txt: "*q = 30;",         num: 7 },
    { txt: "printf(\"a = %d, b = %d\\n\", a, b);", num: 8 }
  ];

  function simular() {
    var pasos = [];
    var a = null, b = null, p = null, q = null;
    function snap(linea) {
      pasos.push({ linea: linea, a: a, b: b, p: p, q: q });
    }
    a = 10; snap(1);
    b = 20; snap(2);
    p = "&a"; snap(3);
    q = "&b"; snap(4);
    a = b; snap(5);
    q = "&a"; snap(6);
    a = 30; snap(7);
    snap(8);
    return pasos;
  }

  function finales() {
    var pasos = simular();
    var ultimo = pasos[pasos.length - 1];
    return { a: ultimo.a, b: ultimo.b };
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
          linea.txt + "</td><td>" + paso.a + "</td><td>" + paso.b + "</td><td>" +
          (paso.p === null ? "–" : paso.p) + "</td><td>" +
          (paso.q === null ? "–" : paso.q) + "</td>";
        cuerpo.appendChild(tr);
      }
      var nota = document.getElementById("nota-traza");
      if (e.terminado) {
        var ultimo = e.pasos[e.pasos.length - 1];
        nota.innerHTML = "Salida: <b>a = " + ultimo.a + ", b = " + ultimo.b +
          "</b>. Desde la línea q = p, los dos punteros hablan de a y b queda " +
          "fuera de alcance.";
      } else {
        nota.textContent = "Ojo a la diferencia entre las líneas 5 y 6: una copia " +
          "un valor, la otra copia una dirección.";
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "a", rotulo: "a" },
        { campo: "b", rotulo: "b" },
        { campo: "p", rotulo: "p", clase: "cuenta" },
        { campo: "q", rotulo: "q", clase: "cuenta" }
      ],
      paramsIniciales: {},
      alPintar: alPintar
    });

    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var va = parseInt(document.getElementById("prediccion-a").value, 10);
      var vb = parseInt(document.getElementById("prediccion-b").value, 10);
      var v = document.getElementById("veredicto");
      var esperado = EJERCICIO.finales();
      if (isNaN(va) || isNaN(vb)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba los dos valores primero.";
      } else if (va === esperado.a && vb === esperado.b) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: a = " + esperado.a + ", b = " + esperado.b +
          ". Ejecute paso a paso y ubique la línea exacta en que b quedó fuera " +
          "del juego.";
      } else if (va === esperado.a && vb === 30) {
        v.className = "veredicto mal";
        v.textContent = "b no llega a 30: cuando corre *q = 30, q ya no guarda la " +
          "dirección de b. ¿Qué hizo la línea q = p?";
      } else if (va === 20 && vb === 20) {
        v.className = "veredicto mal";
        v.textContent = "Va bien hasta *p = *q, pero falta el final: *q = 30 " +
          "todavía escribe en alguna celda. ¿En cuál?";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: *p = *q mueve un valor entre celdas; " +
          "q = p mueve una dirección entre punteros. Son jugadas distintas.";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-final button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-final");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: q = p copia la dirección, y desde ahí q apunta a " +
            "a. El *q = 30 posterior ya no puede tocar a b.";
        } else if (op === "copia") {
          v.className = "veredicto mal";
          v.textContent = "*p = *q copia el valor 20 hacia a, pero q sigue " +
            "apuntando a b después de esa línea.";
        } else if (op === "treinta") {
          v.className = "veredicto mal";
          v.textContent = "*q = 30 escribe donde q apunte en ese momento; el " +
            "desvío ocurrió una línea antes.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Sí dejó de hablarle: al final b conserva su 20 porque " +
            "ningún puntero la alcanza. Busque la línea donde se rompió el enlace.";
        }
      });
    });
  })();
}
