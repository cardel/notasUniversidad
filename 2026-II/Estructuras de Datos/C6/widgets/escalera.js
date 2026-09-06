/* Ejercicio interactivo: la escalera de clases (clase 6, notacion O). */
var EJERCICIO = (function () {
  var COSTOS = [
    { id: "a", txt: "4n + 7", esperada: "n" },
    { id: "b", txt: "n(n − 1) / 2", esperada: "n2" },
    { id: "c", txt: "2⌊log₂ n⌋ + 1", esperada: "log" },
    { id: "d", txt: "17", esperada: "1" }
  ];

  var CLASES = [
    { clave: "1", rotulo: "O(1)" },
    { clave: "log", rotulo: "O(log n)" },
    { clave: "n", rotulo: "O(n)" },
    { clave: "n2", rotulo: "O(n²)" }
  ];

  function valor(clase, n) {
    var r = null;
    if (clase === "log") { r = Math.floor(Math.log(n) / Math.log(2)); }
    if (clase === "n") { r = n; }
    if (clase === "n2") { r = n * n; }
    if (clase === "n3") { r = n * n * n; }
    if (clase === "1") { r = 1; }
    return r;
  }

  return { costos: COSTOS, clases: CLASES, valor: valor };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var resueltos = {};

    var MENSAJES = {
      "b-n": "Expanda el producto antes de clasificar: n(n − 1)/2 es (n² − n)/2 y ahí " +
        "se esconde un cuadrático.",
      "b-1": "El costo sí depende de n: pruebe n = 10 y n = 100 y mire cuánto cambia.",
      "b-log": "Crece mucho más rápido que un logaritmo: con n = 1000 ya va en " +
        "499500.",
      "a-n2": "No hay término cuadrático: 4n + 7 es una recta. La constante 4 no " +
        "sube de clase.",
      "a-1": "Depende de n: duplicar n casi duplica el costo.",
      "a-log": "Crece como n, no como su logaritmo: con n = 1000 vale 4007, no " +
        "cerca de 10.",
      "c-n": "El logaritmo sube muchísimo más despacio: con n = 1000 este costo " +
        "apenas vale 19.",
      "c-1": "Sí depende de n, aunque despacio: de n = 10 a n = 1000 pasa de 7 a 19.",
      "c-n2": "Va en la dirección contraria: es de las clases que menos crecen.",
      "d-n": "17 no tiene n: vale lo mismo con 10 datos que con un millón.",
      "d-log": "No hay n que crezca: es constante.",
      "d-n2": "No hay n: el costo no se mueve."
    };

    function revelar() {
      document.getElementById("carta-escalera").style.display = "block";
      var cuerpo = document.getElementById("cuerpo-escalera");
      cuerpo.innerHTML = "";
      [["log", "≈ 3", "≈ 10", "≈ 20", "instantáneo"],
       ["n", "10", "1000", "10⁶", "un milisegundo"],
       ["n2", "100", "10⁶", "10¹²", "cerca de 17 minutos"],
       ["n3", "1000", "10⁹", "10¹⁸", "más de 30 años"]].forEach(function (fila) {
        var rotulos = { log: "log₂ n", n: "n", n2: "n²", n3: "n³" };
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + rotulos[fila[0]] + "</td><td>" + fila[1] + "</td><td>" +
          fila[2] + "</td><td>" + fila[3] + "</td><td>" + fila[4] + "</td>";
        cuerpo.appendChild(tr);
      });
    }

    EJERCICIO.costos.forEach(function (costo) {
      var fila = document.createElement("div");
      fila.className = "barra-fila";
      var rotulo = document.createElement("span");
      rotulo.className = "rotulo";
      rotulo.style.fontFamily = "ui-monospace, monospace";
      rotulo.textContent = costo.txt;
      fila.appendChild(rotulo);
      var opciones = document.createElement("span");
      opciones.className = "opciones";
      opciones.style.marginTop = "0";
      EJERCICIO.clases.forEach(function (clase) {
        var btn = document.createElement("button");
        btn.textContent = clase.rotulo;
        btn.addEventListener("click", function () {
          var v = document.getElementById("veredicto-clasificar");
          if (resueltos[costo.id]) { return; }
          if (clase.clave === costo.esperada) {
            resueltos[costo.id] = true;
            fila.style.background = "var(--verde-suave)";
            Array.prototype.forEach.call(opciones.querySelectorAll("button"), function (b) {
              b.disabled = b !== btn;
            });
            var total = Object.keys(resueltos).length;
            v.className = "veredicto bien";
            if (total === EJERCICIO.costos.length) {
              v.textContent = "Las cuatro clasificadas. Abajo quedó la escalera " +
                "traducida a números y a segundos de máquina.";
              revelar();
            } else {
              v.textContent = "Bien: " + costo.txt + " queda en " + clase.rotulo +
                ". Van " + total + " de " + EJERCICIO.costos.length + ".";
            }
          } else {
            v.className = "veredicto mal";
            v.textContent = MENSAJES[costo.id + "-" + clase.clave] ||
              "Esa clase no corresponde. Evalúe el costo en n = 10 y n = 1000 y " +
              "compare cuánto creció.";
          }
        });
        opciones.appendChild(btn);
      });
      fila.appendChild(opciones);
      document.getElementById("filas-clasificar").appendChild(fila);
    });
  })();
}
