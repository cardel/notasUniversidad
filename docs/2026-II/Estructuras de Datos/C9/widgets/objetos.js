/* Ejercicio interactivo: repaso de POO con la clase Estudiante (clase 9). */
var EJERCICIO = (function () {
  var CUPO = 3;

  /* Promedio de las notas registradas, respetando el cupo. */
  function promedio(notas) {
    var suma = 0;
    var i = 0;
    var registradas = Math.min(notas.length, CUPO);

    while (i < registradas) {
      suma = suma + notas[i];
      i = i + 1;
    }
    return suma / registradas;
  }

  return { cupo: CUPO, promedio: promedio };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {

    /* --- Render de los bloques de codigo -------------------------- */
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      lineas.forEach(function (par, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (par[1] ? " " + par[1] : "");
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = par[0];
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }

    pintarCodigo("codigo-clase", [
      ["class Estudiante {", ""],
      ["private:", "bloque-1"],
      ["    int codigo;", ""],
      ["    double notas[3];", ""],
      ["    int registradas;", ""],
      ["", ""],
      ["public:", "bloque-1"],
      ["    Estudiante(int c) {", ""],
      ["        codigo = c;", ""],
      ["        registradas = 0;", ""],
      ["    }", ""],
      ["", ""],
      ["    void registrar_nota(double nota) {", ""],
      ["        if (registradas < 3) {", "bloque-2"],
      ["            notas[registradas] = nota;", ""],
      ["            registradas = registradas + 1;", ""],
      ["        }", ""],
      ["    }", ""],
      ["", ""],
      ["    double promedio() {", ""],
      ["        double suma = 0;", ""],
      ["        int i = 0;", ""],
      ["", ""],
      ["        while (i < registradas) {", ""],
      ["            suma = suma + notas[i];", ""],
      ["            i = i + 1;", ""],
      ["        }", ""],
      ["        return suma / registradas;", "bloque-3"],
      ["    }", ""],
      ["};", ""]
    ]);

    pintarCodigo("codigo-promedio", [
      ["Estudiante e(1023);", ""],
      ["", ""],
      ["e.registrar_nota(4.0);", ""],
      ["e.registrar_nota(3.0);", ""],
      ["printf(\"promedio: %.2f\\n\", e.promedio());", "bloque-1"]
    ]);

    pintarCodigo("codigo-copia", [
      ["void premiar_copia(Estudiante e) {", "bloque-1"],
      ["    e.registrar_nota(5.0);", ""],
      ["}", ""],
      ["", ""],
      ["premiar_copia(e);", ""],
      ["printf(\"tras premiar_copia: %.2f\\n\", e.promedio());", ""]
    ]);

    pintarCodigo("codigo-referencia", [
      ["void premiar(Estudiante &e) {", "bloque-1"],
      ["    e.registrar_nota(5.0);", ""],
      ["}", ""],
      ["", ""],
      ["premiar(e);", ""],
      ["printf(\"tras premiar: %.2f\\n\", e.promedio());", ""]
    ]);

    pintarCodigo("codigo-privado", [
      ["int main() {", ""],
      ["    Estudiante e(1023);", ""],
      ["", ""],
      ["    e.notas[0] = 5.0;", "bloque-2"],
      ["    return 0;", ""],
      ["}", ""]
    ]);

    pintarCodigo("codigo-error", [
      ["error: 'double Estudiante::notas [3]' is private", ""],
      ["       within this context", ""],
      ["   19 |     e.notas[0] = 5.0;", ""]
    ]);

    pintarCodigo("codigo-vacio", [
      ["Estudiante e(1023);", ""],
      ["", ""],
      ["printf(\"promedio sin notas: %.2f\\n\", e.promedio());", "bloque-2"]
    ]);

    /* --- Tarjeta 1: el promedio ----------------------------------- */
    document.getElementById("btn-promedio").addEventListener("click", function () {
      var v = document.getElementById("veredicto-promedio");
      var valor = parseFloat(document.getElementById("pred-promedio").value);
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (Math.abs(valor - 3.5) < 0.005) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: (4.0 + 3.0) / 2 = 3.50. El método divide " +
          "entre las registradas, que van en 2.";
      } else if (Math.abs(valor - 7.0) < 0.005) {
        v.className = "veredicto mal";
        v.textContent = "Esa es la suma. promedio() la divide entre las " +
          "notas registradas.";
      } else if (Math.abs(valor - 2.33) < 0.01) {
        v.className = "veredicto mal";
        v.textContent = "Dividió entre 3, el tamaño del arreglo. El divisor " +
          "es registradas, y el objeto lleva 2 notas.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: sume las notas registradas y " +
          "divida entre cuántas son.";
      }
    });

    /* --- Tarjeta 2: premiar por copia ----------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-copia button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-copia");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: la firma dice Estudiante e, sin &, así que " +
            "viaja una copia completa —código, notas y contador—. La nota " +
            "5.0 quedó en la copia, que murió con el marco. Sigue en 3.50.";
        } else if (op === "original") {
          v.className = "veredicto mal";
          v.textContent = "Eso pasaría si e viajara por referencia. La firma " +
            "dice Estudiante e, sin &: se copia el objeto entero, como un " +
            "int cualquiera.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "registrar_nota agrega, no reemplaza. Y antes de " +
            "eso: revise a quién le quedó la nota registrada.";
        }
      });
    });

    /* --- Tarjeta 3: premiar por referencia ------------------------ */
    document.getElementById("btn-referencia").addEventListener("click", function () {
      var v = document.getElementById("veredicto-referencia");
      var valor = parseFloat(document.getElementById("pred-referencia").value);
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (Math.abs(valor - 4.0) < 0.005) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: Estudiante &e es un alias del original, " +
          "así que la nota quedó en e: (4.0 + 3.0 + 5.0) / 3 = 4.00. Copiar " +
          "un objeto copia todos sus atributos; la referencia cuesta lo que " +
          "una dirección. Por eso los objetos viajan por referencia.";
      } else if (Math.abs(valor - 3.5) < 0.005) {
        v.className = "veredicto mal";
        v.textContent = "Esta vez la firma dice Estudiante &e: no hay copia, " +
          "la función trabaja sobre el objeto original.";
      } else if (Math.abs(valor - 4.25) < 0.01) {
        v.className = "veredicto mal";
        v.textContent = "Contó cuatro notas. La 5.0 de premiar_copia quedó " +
          "en la copia y murió con su marco: el original lleva 4.0, 3.0 y " +
          "la 5.0 de premiar.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: ¿cuántas notas tiene el " +
          "original después de las dos llamadas, y cuáles son?";
      }
    });

    /* --- Tarjeta 4: private --------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-privado button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-privado");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: el error se atrapa antes de ejecutar. " +
            "Abajo queda la respuesta del compilador.";
          document.getElementById("error-privado").style.display = "block";
        } else if (op === "compila") {
          v.className = "veredicto mal";
          v.textContent = "notas está declarada bajo private: fuera de la " +
            "clase, ese nombre no se puede tocar, ni para leer ni para " +
            "escribir.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "No llega tan lejos: private se revisa al " +
            "compilar, no al ejecutar. Compare con leer A[4] en un arreglo " +
            "de 4, que compila y falla después.";
        }
      });
    });

    /* --- Tarjeta 5: el promedio de nadie -------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-vacio button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-vacio");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: imprime promedio sin notas: -nan.";
          document.getElementById("cierre-vacio").style.display = "block";
        } else if (op === "cero") {
          v.className = "veredicto mal";
          v.textContent = "La suma sí es 0, pero el divisor también: 0/0 " +
            "con double no es 0, es otra cosa.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Con enteros, dividir entre 0 revienta el " +
            "programa; con double, la división produce un valor especial y " +
            "la ejecución sigue como si nada. Eso lo hace más difícil de " +
            "notar, no menos grave.";
        }
      });
    });
  })();
}
