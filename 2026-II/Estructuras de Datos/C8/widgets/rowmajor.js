/* Ejercicio interactivo: la tabla en una sola calle (clase 8). */
var EJERCICIO = (function () {
  var BASE = 4000;
  var FILAS = 3;
  var COLUMNAS = 4;

  function valor(i, j) {
    return 10 * (i + 1) + j;
  }

  function direccion(i, j) {
    return BASE + (i * COLUMNAS + j) * 4;
  }

  return { base: BASE, filas: FILAS, columnas: COLUMNAS, valor: valor, direccion: direccion };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var OBJETIVOS = [[2, 1], [0, 3], [1, 2]];
    var turno = 0;

    function objetivoActual() {
      return turno < OBJETIVOS.length ? OBJETIVOS[turno] : null;
    }

    function pintarGrid() {
      var obj = objetivoActual();
      var i, j;
      for (i = 0; i < EJERCICIO.filas; i = i + 1) {
        for (j = 0; j < EJERCICIO.columnas; j = j + 1) {
          var c = document.getElementById("celda-" + i + "-" + j);
          c.classList.remove("actual");
          if (obj && obj[0] === i && obj[1] === j) {
            c.classList.add("actual");
          }
        }
      }
      var enunciado = document.getElementById("enunciado-objetivo");
      if (obj) {
        enunciado.innerHTML = "¿En qué dirección vive <b>M[" + obj[0] + "][" +
          obj[1] + "]</b> (la casilla marcada)?";
      } else {
        enunciado.textContent = "Las tres casillas ubicadas. Cierre con la " +
          "pregunta de abajo.";
        document.getElementById("carta-formula").style.display = "block";
      }
    }

    /* La matriz */
    var grid = document.getElementById("grid-matriz");
    var i, j;
    for (i = 0; i < EJERCICIO.filas; i = i + 1) {
      var fila = document.createElement("div");
      fila.className = "arreglo fila-arreglo";
      fila.style.margin = "0 0 4px 0";
      for (j = 0; j < EJERCICIO.columnas; j = j + 1) {
        var c = document.createElement("div");
        c.className = "caja";
        c.style.cursor = "default";
        c.id = "celda-" + i + "-" + j;
        var ind = document.createElement("span");
        ind.className = "indice";
        ind.style.whiteSpace = "nowrap";
        ind.textContent = "M[" + i + "][" + j + "]";
        c.appendChild(ind);
        c.appendChild(document.createTextNode(EJERCICIO.valor(i, j)));
        fila.appendChild(c);
      }
      grid.appendChild(fila);
    }

    /* La calle aplanada */
    var calle = document.getElementById("calle");
    for (i = 0; i < EJERCICIO.filas; i = i + 1) {
      for (j = 0; j < EJERCICIO.columnas; j = j + 1) {
        var pos = document.createElement("div");
        pos.className = "caja";
        pos.style.cursor = "default";
        pos.id = "calle-" + i + "-" + j;
        var ind2 = document.createElement("span");
        ind2.className = "indice";
        ind2.style.whiteSpace = "nowrap";
        ind2.textContent = String(EJERCICIO.direccion(i, j));
        pos.appendChild(ind2);
        pos.appendChild(document.createTextNode(EJERCICIO.valor(i, j)));
        calle.appendChild(pos);
      }
    }

    document.getElementById("btn-direccion").addEventListener("click", function () {
      var obj = objetivoActual();
      var v = document.getElementById("veredicto-direccion");
      if (!obj) {
        v.className = "veredicto bien";
        v.textContent = "Ya están las tres: siga con la pregunta de cierre.";
        return;
      }
      var fi = obj[0];
      var co = obj[1];
      var valor = parseInt(document.getElementById("prediccion-direccion").value, 10);
      var esperado = EJERCICIO.direccion(fi, co);
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba una dirección primero.";
      } else if (valor === esperado) {
        document.getElementById("calle-" + fi + "-" + co).classList.add("visitada");
        document.getElementById("celda-" + fi + "-" + co).classList.add("visitada");
        turno = turno + 1;
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + esperado + ". En la calle quedó iluminada " +
          "la posición que le corresponde.";
        document.getElementById("prediccion-direccion").value = "";
        pintarGrid();
      } else if (valor === EJERCICIO.base + (fi + co) * 4) {
        v.className = "veredicto mal";
        v.textContent = "Sumó fila y columna sin pesar la fila: antes de la " +
          "casilla hay " + fi + " filas completas de " + EJERCICIO.columnas +
          " casillas cada una.";
      } else if (valor === EJERCICIO.base + (co * EJERCICIO.filas + fi) * 4) {
        v.className = "veredicto mal";
        v.textContent = "Contó por columnas. En C las filas van una tras otra: " +
          "primero toda la fila 0, luego toda la fila 1.";
      } else if (valor === EJERCICIO.base + fi * EJERCICIO.columnas + co) {
        v.className = "veredicto mal";
        v.textContent = "Contó casillas y no bytes: cada casilla de int ocupa 4. " +
          "Multiplique el número de casillas por 4.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: cuente cuántas casillas hay antes " +
          "de la marcada (filas completas más las de su fila) y páselas a bytes.";
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-formula button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-formula");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: saltar i filas completas (i·m casillas), avanzar " +
            "j dentro de la fila, y pasar a bytes con el 4. Por eso llegar a " +
            "M[i][j] es una cuenta y no un recorrido: cuesta O(1). Y por eso " +
            "recorrer por filas camina la calle en orden, mientras que por " +
            "columnas salta de a m casillas.";
        } else if (op === "suma") {
          v.className = "veredicto mal";
          v.textContent = "Con esa fórmula M[0][3] y M[1][2] tendrían la misma " +
            "dirección. La fila necesita su peso.";
        } else if (op === "columnas") {
          v.className = "veredicto mal";
          v.textContent = "Esa es la calle contada por columnas. Compare con la " +
            "corrida de la clase: M[0][3] y M[1][0] son vecinas.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Multiplicar fila por columna no cuenta casillas: " +
            "M[2][0] daría la dirección base, encima de M[0][0].";
        }
      });
    });

    pintarGrid();
  })();
}
