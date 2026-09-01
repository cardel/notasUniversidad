/* Ejercicio interactivo: paso de parametros (clase 9). */
var EJERCICIO = (function () {
  /* Estado inicial de main y respuesta correcta por version. */
  var INICIAL = { x: 10, y: 2, z: 8 };
  var ESPERADO = {
    valor: { x: 10, y: 12, z: 8 },
    puntero: { x: 11, y: 12, z: 8 },
    referencia: { x: 11, y: 12, z: 8 }
  };

  /* ans se evalua antes de los aumentos: 10 + 2 en las tres versiones. */
  function retorno() {
    return INICIAL.x + INICIAL.y;
  }

  return { inicial: INICIAL, esperado: ESPERADO, retorno: retorno };
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

    pintarCodigo("codigo-main", [
      ["int x = 10;", ""],
      ["int y = 2;", ""],
      ["int z = 8;", ""],
      ["int *w = &y;", "bloque-2"],
      ["", ""],
      ["printf(\"x = %d y = %d z = %d\\n\", x, y, z);", ""],
      ["*w = algo(..., y);", "bloque-2"],
      ["printf(\"x = %d y = %d z = %d\\n\", x, y, z);", ""]
    ]);

    pintarCodigo("codigo-valor", [
      ["int algo(int a, int b) {", "bloque-1"],
      ["    int ans = a + b;", ""],
      ["", ""],
      ["    a = a + 1;", ""],
      ["    b = b - 1;", ""],
      ["    return ans;", ""],
      ["}", ""]
    ]);

    pintarCodigo("codigo-puntero", [
      ["int algo(int *a, int b) {", "bloque-1"],
      ["    int ans = *a + b;", "bloque-1"],
      ["", ""],
      ["    *a = *a + 1;", "bloque-1"],
      ["    b = b - 1;", ""],
      ["    return ans;", ""],
      ["}", ""]
    ]);

    pintarCodigo("codigo-referencia", [
      ["int algo(int &a, int b) {", "bloque-1"],
      ["    int ans = a + b;", ""],
      ["", ""],
      ["    a = a + 1;", ""],
      ["    b = b - 1;", ""],
      ["    return ans;", ""],
      ["}", ""]
    ]);

    /* --- Comprobacion por version --------------------------------- */
    var logradas = { valor: false, puntero: false, referencia: false };

    function leer(version, campo) {
      return parseInt(document.getElementById("pred-" + version + "-" + campo).value, 10);
    }

    function revisarDesbloqueo() {
      if (logradas.valor && logradas.puntero && logradas.referencia) {
        document.getElementById("carta-tabla").style.display = "block";
      }
    }

    /* Devuelve el mensaje de error mas informativo, o null si todo esta bien. */
    function diagnostico(version, x, y, z) {
      var e = EJERCICIO.esperado[version];
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        return "Complete los tres valores primero.";
      }
      if (z !== e.z) {
        return "Nadie escribió en z: no viaja a la función y main tampoco la toca.";
      }
      if (version === "valor" && x === 11) {
        return "a = a + 1 sumó en la copia. En esta versión a nace copiando " +
          "el 10 y vive en el marco de algo: x no se entera.";
      }
      if (version !== "valor" && x === 10) {
        if (version === "puntero") {
          return "Ahora a guarda la dirección de x: *a = *a + 1 viaja hasta " +
            "la celda original y x sí cambia.";
        }
        return "int &a no copia: a es otro nombre de x durante la llamada, " +
          "y a = a + 1 escribe en la celda de x.";
      }
      if (x !== e.x) {
        return "Revise x: pregúntese si esta versión le da a la función la " +
          "celda original o una copia.";
      }
      if (y === EJERCICIO.inicial.y) {
        return "Es cierto que b viaja por valor, pero mire la llamada " +
          "completa: w guarda la dirección de y, y main escribe ahí el " +
          "valor retornado con *w.";
      }
      if (y === 1) {
        return "El b = b - 1 ocurrió en la copia y murió con el marco. La " +
          "escritura visible sobre y viene de *w con el valor retornado.";
      }
      if (y === 13) {
        return "Revise el orden: ans se calcula antes del aumento, con el " +
          "10 original.";
      }
      if (y !== e.y) {
        return "Siga el retorno: ans = 10 + 2, y *w lo deja en la celda de y.";
      }
      return null;
    }

    var EXITO = {
      valor: "Correcto: el paso fue por valor de principio a fin y x quedó " +
        "intacta. Aun así y terminó en 12, porque main escribió el retorno " +
        "con *w: el puntero es asunto del llamador, no del paso.",
      puntero: "Correcto: *a alcanzó la celda de x (10 → 11) y el retorno 12 " +
        "llegó a y por *w. Una misma firma mezcló los dos modos: a por " +
        "referencia, b por valor.",
      referencia: "Correcto, y con trampa doble: el resultado es el de la " +
        "versión con punteros, pero la llamada se lee como la versión por " +
        "valor. En C++ quien avisa es la firma: int &a."
    };

    ["valor", "puntero", "referencia"].forEach(function (version) {
      document.getElementById("btn-" + version).addEventListener("click", function () {
        var v = document.getElementById("veredicto-" + version);
        var mensaje = diagnostico(version, leer(version, "x"), leer(version, "y"), leer(version, "z"));
        if (mensaje === null) {
          v.className = "veredicto bien";
          v.textContent = EXITO[version];
          logradas[version] = true;
          revisarDesbloqueo();
        } else {
          v.className = "veredicto mal";
          v.textContent = mensaje;
        }
      });
    });
  })();
}
