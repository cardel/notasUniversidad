/* Ejercicio interactivo: lo que cobra cada operacion (clase 13). */
var EJERCICIO = (function () {
  var CASOS = { insert: { n: 6, p: 2 }, revertir: { n: 5 } };

  /* insert en la posicion p de un vector de n elementos corre n - p. */
  function corridosInsert(n, p) { return n - p; }

  /* revertir con insert al frente: la k-esima insercion corre k elementos. */
  function corridosRevertir(n) {
    var total = 0;
    var k = 0;
    while (k < n) { total = total + k; k = k + 1; }
    return total;
  }

  return { casos: CASOS, corridosInsert: corridosInsert, corridosRevertir: corridosRevertir };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var logradas = { insert: false, revertir: false };
    function revisar() {
      if (logradas.insert && logradas.revertir) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    document.getElementById("btn-insert").addEventListener("click", function () {
      var v = document.getElementById("veredicto-insert");
      var c = EJERCICIO.casos.insert;
      var dado = parseInt(document.getElementById("pred-insert").value, 10);
      if (dado === EJERCICIO.corridosInsert(c.n, c.p)) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 4. Las posiciones 2, 3, 4 y 5 se corren una casilla a la derecha para abrir campo; las posiciones 0 y 1 no se tocan.";
        logradas.insert = true;
        revisar();
      } else if (dado === 6) {
        v.className = "veredicto mal";
        v.textContent = "No se corre todo el vector: lo que está antes de la posición 2 se queda quieto.";
      } else if (dado === 2 || dado === 3) {
        v.className = "veredicto mal";
        v.textContent = "Se corre lo que está desde la posición p hasta el final, incluida la posición p.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Dibuje seis casillas e inserte en la 2: cuente cuántas cambian de lugar.";
      }
    });
    document.getElementById("btn-revertir").addEventListener("click", function () {
      var v = document.getElementById("veredicto-revertir");
      var c = EJERCICIO.casos.revertir;
      var dado = parseInt(document.getElementById("pred-revertir").value, 10);
      if (dado === EJERCICIO.corridosRevertir(c.n)) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 0 + 1 + 2 + 3 + 4 = 10. Cada insert al frente corre todo lo que ya estaba. Con push_back desde el final no se corre nada: el contrato es el mismo y el costo no.";
        logradas.revertir = true;
        revisar();
      } else if (dado === 5) {
        v.className = "veredicto mal";
        v.textContent = "Cinco son las inserciones. La pregunta es cuántos elementos se corren en total: la primera corre 0, la segunda 1, la tercera 2...";
      } else if (dado === 15) {
        v.className = "veredicto mal";
        v.textContent = "Casi: la primera inserción corre 0 elementos, no 1, porque el vector está vacío.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Sume lo que corre cada inserción: al insertar el k-ésimo al frente, ya hay k − 1 elementos.";
      }
    });
  })();
}
