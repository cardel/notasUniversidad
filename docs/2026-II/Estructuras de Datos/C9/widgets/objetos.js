/* Ejercicio interactivo: repaso de POO con la clase Cuenta (clase 9). */
var EJERCICIO = (function () {
  /* Reglas de la clase: consignar exige monto positivo; retirar exige
     monto positivo que no supere el saldo. */
  function saldoFinal(operaciones) {
    var saldo = 0;
    var i = 0;

    while (i < operaciones.length) {
      var op = operaciones[i];
      if (op[0] === "consignar" && op[1] > 0) {
        saldo = saldo + op[1];
      }
      if (op[0] === "retirar" && op[1] > 0 && op[1] <= saldo) {
        saldo = saldo - op[1];
      }
      i = i + 1;
    }
    return saldo;
  }

  return { saldoFinal: saldoFinal };
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
      ["class Cuenta {", ""],
      ["private:", "bloque-1"],
      ["    int numero;", ""],
      ["    double saldo;", ""],
      ["", ""],
      ["public:", "bloque-1"],
      ["    Cuenta(int n) {", ""],
      ["        numero = n;", ""],
      ["        saldo = 0;", ""],
      ["    }", ""],
      ["", ""],
      ["    void consignar(double monto) {", ""],
      ["        if (monto > 0) {", "bloque-2"],
      ["            saldo = saldo + monto;", ""],
      ["        }", ""],
      ["    }", ""],
      ["", ""],
      ["    void retirar(double monto) {", ""],
      ["        if (monto > 0 && monto <= saldo) {", "bloque-2"],
      ["            saldo = saldo - monto;", ""],
      ["        }", ""],
      ["    }", ""],
      ["", ""],
      ["    double consultar() {", ""],
      ["        return saldo;", "bloque-3"],
      ["    }", ""],
      ["};", ""]
    ]);

    pintarCodigo("codigo-saldo", [
      ["Cuenta c(501);", ""],
      ["", ""],
      ["c.consignar(80.0);", ""],
      ["c.retirar(30.0);", ""],
      ["c.consignar(-20.0);", "bloque-2"],
      ["printf(\"saldo: %.2f\\n\", c.consultar());", ""]
    ]);

    pintarCodigo("codigo-copia", [
      ["void cobrar_copia(Cuenta c) {", "bloque-1"],
      ["    c.retirar(25.0);", ""],
      ["}", ""],
      ["", ""],
      ["cobrar_copia(c);", ""],
      ["printf(\"tras cobrar_copia: %.2f\\n\", c.consultar());", ""]
    ]);

    pintarCodigo("codigo-referencia", [
      ["void cobrar(Cuenta &c) {", "bloque-1"],
      ["    c.retirar(25.0);", ""],
      ["}", ""],
      ["", ""],
      ["cobrar(c);", ""],
      ["printf(\"tras cobrar: %.2f\\n\", c.consultar());", ""]
    ]);

    pintarCodigo("codigo-privado", [
      ["int main() {", ""],
      ["    Cuenta c(501);", ""],
      ["", ""],
      ["    c.saldo = 1000000.0;", "bloque-2"],
      ["    return 0;", ""],
      ["}", ""]
    ]);

    pintarCodigo("codigo-error", [
      ["error: 'double Cuenta::saldo' is private", ""],
      ["       within this context", ""],
      ["   16 |     c.saldo = 1000000.0;", ""]
    ]);

    pintarCodigo("codigo-retiro", [
      ["Cuenta d(502);", ""],
      ["", ""],
      ["d.consignar(40.0);", ""],
      ["d.retirar(90.0);", "bloque-2"],
      ["printf(\"saldo: %.2f\\n\", d.consultar());", ""]
    ]);

    /* --- Tarjeta 1: el saldo -------------------------------------- */
    document.getElementById("btn-saldo").addEventListener("click", function () {
      var v = document.getElementById("veredicto-saldo");
      var valor = parseFloat(document.getElementById("pred-saldo").value);
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (Math.abs(valor - 50.0) < 0.005) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 80 entra, 30 sale y la consignación de " +
          "-20 no pasa la validación: monto > 0 falla y el método no toca " +
          "el saldo. Queda 50.00.";
      } else if (Math.abs(valor - 30.0) < 0.005) {
        v.className = "veredicto mal";
        v.textContent = "Restó la consignación negativa. Mire el if de " +
          "consignar: con monto -20, la condición monto > 0 falla y el " +
          "saldo no se toca.";
      } else if (Math.abs(valor - 130.0) < 0.005) {
        v.className = "veredicto mal";
        v.textContent = "Sumó las tres operaciones. La segunda es un " +
          "retiro: resta. Y la tercera ni entra: consignar valida el " +
          "monto antes de sumar.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: siga las tres llamadas en " +
          "orden y pregúntese, en cada una, si el if del método deja " +
          "pasar el monto.";
      }
    });

    /* --- Tarjeta 2: cobrar por copia ------------------------------ */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-copia button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-copia");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: la firma dice Cuenta c, sin &, así que " +
            "viaja una copia completa —número y saldo—. El retiro validó " +
            "contra el saldo de la copia, descontó en la copia, y la copia " +
            "murió con el marco. La cuenta de main sigue en 50.00.";
        } else if (op === "original") {
          v.className = "veredicto mal";
          v.textContent = "Eso pasaría si la cuenta viajara por referencia. " +
            "La firma dice Cuenta c, sin &: se copia el objeto entero, " +
            "como un int cualquiera.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Copiar un objeto es legal y no valida nada: la " +
            "copia nace con los mismos atributos, número incluido. La " +
            "pregunta es a cuál de las dos cuentas le cayó el retiro.";
        }
      });
    });

    /* --- Tarjeta 3: cobrar por referencia ------------------------- */
    document.getElementById("btn-referencia").addEventListener("click", function () {
      var v = document.getElementById("veredicto-referencia");
      var valor = parseFloat(document.getElementById("pred-referencia").value);
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (Math.abs(valor - 25.0) < 0.005) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: Cuenta &c es un alias del original, así " +
          "que el retiro cayó en la cuenta de main: 50 - 25 = 25.00. " +
          "Copiar un objeto copia todos sus atributos; la referencia " +
          "cuesta lo que una dirección. Por eso los objetos viajan por " +
          "referencia.";
      } else if (Math.abs(valor - 50.0) < 0.005) {
        v.className = "veredicto mal";
        v.textContent = "Esta vez la firma dice Cuenta &c: no hay copia, " +
          "la función trabaja sobre la cuenta original.";
      } else if (Math.abs(valor - 0.0) < 0.005) {
        v.className = "veredicto mal";
        v.textContent = "Contó también el retiro de cobrar_copia, pero ese " +
          "le cayó a la copia y murió con su marco: la cuenta llega aquí " +
          "con 50.00 y solo este retiro la toca.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide. Pista: ¿con cuánto llega la cuenta " +
          "de main a esta llamada, y esta vez el retiro le cae a quién?";
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
          v.textContent = "saldo está declarado bajo private: fuera de la " +
            "clase, ese nombre no se puede tocar, ni para leer ni para " +
            "escribir.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "No llega tan lejos: private se revisa al " +
            "compilar, no al ejecutar. Compare con leer A[4] en un " +
            "arreglo de 4, que compila y falla después.";
        }
      });
    });

    /* --- Tarjeta 5: el retiro que no avisa ------------------------ */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-retiro button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-retiro");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: imprime saldo: 40.00. El retiro no " +
            "ocurrió.";
          document.getElementById("cierre-retiro").style.display = "block";
        } else if (op === "sobregiro") {
          v.className = "veredicto mal";
          v.textContent = "retirar valida antes de restar: 90 no cabe en " +
            "40, la condición monto <= saldo falla y el método no hace " +
            "nada. El saldo no baja de cero.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "No hay nada que reviente: la condición del if " +
            "no se cumple y la función termina sin tocar el saldo. El " +
            "programa sigue como si nada.";
        }
      });
    });
  })();
}
