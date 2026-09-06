/* Ejercicio interactivo: paso de parametros (clase 9). */
var EJERCICIO = (function () {
  /* Estado inicial de main y respuesta correcta por version. */
  var INICIAL = { x: 2, y: 10, z: 4 };
  var ESPERADO = {
    valor: { x: 3, y: 10, z: 7 },
    puntero: { x: 3, y: 3, z: 7 },
    referencia: { x: 3, y: 3, z: 7 }
  };

  /* La resta corre con a ya en 7: 10 - 7 en las tres versiones. */
  function retorno() {
    return INICIAL.y - (INICIAL.x + 5);
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
      ["int x = 2;", ""],
      ["int y = 10;", ""],
      ["int z = 4;", ""],
      ["int *w = &x;", "bloque-2"],
      ["", ""],
      ["printf(\"x = %d y = %d z = %d\\n\", x, y, z);", ""],
      ["z = z + ajuste(x, ...);", "bloque-2"],
      ["*w = *w + 1;", "bloque-2"],
      ["printf(\"x = %d y = %d z = %d\\n\", x, y, z);", ""]
    ]);

    pintarCodigo("codigo-valor", [
      ["int ajuste(int a, int b) {", "bloque-1"],
      ["    a = a + 5;", ""],
      ["    b = b - a;", ""],
      ["    return b;", ""],
      ["}", ""]
    ]);

    pintarCodigo("codigo-puntero", [
      ["int ajuste(int a, int *b) {", "bloque-1"],
      ["    a = a + 5;", ""],
      ["    *b = *b - a;", "bloque-1"],
      ["    return *b;", "bloque-1"],
      ["}", ""]
    ]);

    pintarCodigo("codigo-referencia", [
      ["int ajuste(int a, int &b) {", "bloque-1"],
      ["    a = a + 5;", ""],
      ["    b = b - a;", ""],
      ["    return b;", ""],
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
      if (z === EJERCICIO.inicial.z) {
        return "El retorno no se pierde: la línea dice z = z + ajuste(...), " +
          "así que lo retornado se le suma al 4 que z ya tenía.";
      }
      if (z === EJERCICIO.retorno()) {
        return "Casi: z = z + ajuste(...) suma el retorno al 4 que z ya " +
          "tenía, no lo reemplaza.";
      }
      if (z !== e.z) {
        return "Revise z: calcule primero qué retorna ajuste y luego mire " +
          "qué hace main con ese valor.";
      }
      if (x === EJERCICIO.inicial.x) {
        return "Es cierto que la función no alcanza a x, pero mire la línea " +
          "que sigue a la llamada: w guarda la dirección de x, y main " +
          "escribe ahí con *w.";
      }
      if (x === 7 || x === 8) {
        return "a viaja por valor en las tres firmas de esta página: el " +
          "a + 5 se quedó en el marco de ajuste y murió con él.";
      }
      if (x !== e.x) {
        return "Revise x: la función nunca recibe su dirección, y aun así " +
          "x termina distinta. La respuesta está en main.";
      }
      if (version === "valor" && y === 3) {
        return "b = b - a restó en la copia: con int b solo viaja el valor " +
          "de y, y la celda original no se entera.";
      }
      if (version !== "valor" && y === EJERCICIO.inicial.y) {
        if (version === "puntero") {
          return "Ahora b guarda la dirección de y: *b = *b - a viaja hasta " +
            "la celda original y y sí cambia.";
        }
        return "int &b no copia: b es otro nombre de y durante la llamada, " +
          "y b = b - a escribe en la celda de y.";
      }
      if (y === 8) {
        return "Cuidado con el orden: cuando llega la resta, a ya subió a 7.";
      }
      if (y !== e.y) {
        return "Siga la resta: a sube a 7 y la resta deja 10 - 7 = 3. " +
          "Pregúntese a qué celda le quedó ese 3 en esta versión.";
      }
      return null;
    }

    var EXITO = {
      valor: "Correcto: nada de lo que hizo ajuste salió de su marco —a y b " +
        "eran copias— y su única salida fue el retorno 3, que se sumó a z. " +
        "El cambio de x no fue de la función: fue main, escribiendo con *w.",
      puntero: "Correcto: *b llevó la resta hasta la celda de y (10 → 3), a " +
        "siguió siendo copia, y el retorno subió z a 7. Una misma firma " +
        "mezcló los dos modos: b por referencia, a por valor.",
      referencia: "Correcto, y con trampa doble: el resultado es el de la " +
        "versión con punteros, pero la llamada se lee como la versión por " +
        "valor. En C++ quien avisa es la firma: int &b."
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
