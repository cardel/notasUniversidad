/* Ejercicio interactivo: aritmetica de punteros (clase 8). */
var EJERCICIO = (function () {
  var BASE = 2000;
  var VALORES = [2, 4, 6, 8, 10];

  function direccion(i) {
    return BASE + 4 * i;
  }

  /* p = A + 1; se pide *p + *(p + 2) = A[1] + A[3]. */
  function evaluar() {
    return VALORES[1] + VALORES[3];
  }

  return { base: BASE, valores: VALORES, direccion: direccion, evaluar: evaluar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {

    /* --- Tarjeta 1: p + 1 ---------------------------------------- */
    document.getElementById("btn-mas-uno").addEventListener("click", function () {
      var v = document.getElementById("veredicto-mas-uno");
      var valor = parseInt(document.getElementById("prediccion-mas-uno").value, 10);
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (valor === 2004) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: sumar 1 a un int * avanza una casilla completa, " +
          "4 bytes. El compilador multiplica por sizeof(int) por nosotros.";
      } else if (valor === 2001) {
        v.className = "veredicto mal";
        v.textContent = "Avanzó un byte. Un int ocupa 4: la casilla siguiente no " +
          "empieza en 2001.";
      } else if (valor === 2008) {
        v.className = "veredicto mal";
        v.textContent = "Eso es p + 2: dos casillas. Se pide una sola.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: p + k avanza k casillas del tipo " +
          "apuntado, y cada casilla de int mide 4 bytes.";
      }
    });

    /* --- Tarjeta 2: el arreglo y el puntero ----------------------- */
    var caja = document.getElementById("arreglo-cajas");
    EJERCICIO.valores.forEach(function (val, i) {
      var c = document.createElement("div");
      c.className = "caja";
      c.style.cursor = "default";
      c.style.width = "5.6rem";
      c.id = "caja-" + i;
      var ind = document.createElement("span");
      ind.className = "indice";
      ind.style.whiteSpace = "nowrap";
      ind.textContent = "A[" + i + "] · " + EJERCICIO.direccion(i);
      c.appendChild(ind);
      c.appendChild(document.createTextNode(val));
      caja.appendChild(c);
    });

    function resaltar(indices) {
      EJERCICIO.valores.forEach(function (ignorado, i) {
        var c = document.getElementById("caja-" + i);
        if (indices.indexOf(i) >= 0) {
          c.classList.add("visitada");
        } else {
          c.classList.remove("visitada");
        }
      });
    }

    document.getElementById("btn-expresion").addEventListener("click", function () {
      var v = document.getElementById("veredicto-expresion");
      var valor = parseInt(document.getElementById("prediccion-expresion").value, 10);
      var esperado = EJERCICIO.evaluar();
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (valor === esperado) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: p apunta a A[1] = 4 y p + 2 apunta a A[3] = 8; " +
          "la suma da " + esperado + ". Las casillas usadas quedan iluminadas.";
        resaltar([1, 3]);
        document.getElementById("tabla-expresion").style.display = "block";
      } else if (valor === 10) {
        v.className = "veredicto mal";
        v.textContent = "2 + 8: arrancó p en A[0], pero p es A + 1, una casilla " +
          "adentro.";
      } else if (valor === 14) {
        v.className = "veredicto mal";
        v.textContent = "6 + 8: corrió p una casilla de más. p es A + 1, no A + 2.";
      } else if (valor === 6) {
        v.className = "veredicto mal";
        v.textContent = "Sumó *p con *(p + 1). El segundo sumando salta dos " +
          "casillas desde p, no una.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: ubique primero a p en el dibujo y " +
          "desde ahí cuente 2 casillas para el segundo término.";
      }
    });

    /* --- Tarjeta 3: la resta ------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-resta button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-resta");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: entre dos punteros al mismo arreglo, q − p " +
            "cuenta casillas. De 2016 a 2004 hay 12 bytes, pero la resta da 3: " +
            "el compilador divide entre sizeof(int).";
        } else if (op === "bytes") {
          v.className = "veredicto mal";
          v.textContent = "Los bytes son 12, pero la resta de punteros no los " +
            "reporta: el compilador ya dividió entre el tamaño de la casilla.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Los valores no entran en esta cuenta: q − p opera " +
            "sobre direcciones. Para restar valores se escribe *q − *p.";
        }
      });
    });
  })();
}
