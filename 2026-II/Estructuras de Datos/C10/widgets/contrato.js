/* Ejercicio interactivo: el contrato vigilado (clase 10). */
var EJERCICIO = (function () {
  /* Datos y respuestas de las tres cartas. */
  var ASSERT = { h: 26, m: 0, condicion: "h >= 0 && h < 24" };
  var VISITA = { h: 18, m: 75, hora: 19, minuto: 15 };
  var SELF = { corrida: "1:0" };

  function cumpleRango(m) {
    return m >= 0 && m < 60;
  }

  function respuestaAcomoda(h, m) {
    var total = h * 60 + m;
    return { hora: Math.floor(total / 60), minuto: total % 60 };
  }

  return {
    assert: ASSERT,
    visita: VISITA,
    self: SELF,
    cumpleRango: cumpleRango,
    respuestaAcomoda: respuestaAcomoda
  };
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

    pintarCodigo("codigo-assert", [
      ["Hora(int h, int m) {", ""],
      ["  assert(h >= 0 && h < 24);", "bloque-1"],
      ["  total = h * 60 + m;", ""],
      ["}", ""],
      ["", ""],
      ["Hora turno(26, 0);", "bloque-2"],
      ["printf(\"%d:%02d\\n\", turno.hora(), turno.minuto());", ""]
    ]);

    pintarCodigo("codigo-salida-assert", [
      ["hora: hora_assert.cpp:10: Hora::Hora(int, int): Assertion `h >= 0 && h < 24' failed.", "bloque-3"]
    ]);

    pintarCodigo("codigo-contratos", [
      ["// contrato E: exige el minuto en rango", ""],
      ["Hora(int h, int m) {", ""],
      ["  assert(m >= 0 && m < 60);", "bloque-1"],
      ["  total = h * 60 + m;", ""],
      ["}", ""],
      ["", ""],
      ["// contrato N: acepta cualquier minuto no negativo", ""],
      ["Hora(int h, int m) {", ""],
      ["  assert(m >= 0);", "bloque-2"],
      ["  total = h * 60 + m;", ""],
      ["}", ""]
    ]);

    pintarCodigo("codigo-self", [
      ["class Hora {", ""],
      ["  private:", ""],
      ["    int h;", "bloque-1"],
      ["    int m;", "bloque-1"],
      ["", ""],
      ["  public:", ""],
      ["    Hora(int h, int m) {", ""],
      ["      h = h;", "bloque-2"],
      ["      m = m;", "bloque-2"],
      ["    }", ""],
      ["", ""],
      ["    int hora()   { return h; }", ""],
      ["    int minuto() { return m; }", ""],
      ["};", ""],
      ["", ""],
      ["Hora r(9, 130);", ""],
      ["printf(\"%d:%d\\n\", r.hora(), r.minuto());", ""]
    ]);

    pintarCodigo("codigo-fix", [
      ["Hora(int h, int m) {", ""],
      ["  this->h = h;", "bloque-3"],
      ["  this->m = m;", "bloque-3"],
      ["}", ""]
    ]);

    /* --- Desbloqueo del cierre ------------------------------------ */
    var logradas = { asrt: false, contratos: false, self: false };

    function revisar() {
      if (logradas.asrt && logradas.contratos && logradas.self) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    /* --- Carta 1: la hora 26 -------------------------------------- */
    var MENSAJES_ASSERT = {
      literal: "La condición se evalúa antes de guardar nada: h vale 26, " +
        "h < 24 es falso y el programa no llega a la línea que imprime.",
      vuelta: "Dar la vuelta sería acomodar, y este contrato no eligió " +
        "acomodar: eligió exigir. Nada convierte el 26 en 2 por sí solo.",
      correcta: null
    };

    document.querySelectorAll("#opciones-assert button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-assert");
        var mensaje = MENSAJES_ASSERT[boton.dataset.op];
        if (mensaje === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto: la violación suena en el punto exacto " +
            "donde ocurrió. Abajo está la salida real de la corrida.";
          logradas.asrt = true;
          document.getElementById("salida-assert").style.display = "block";
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = mensaje;
        }
      });
    });

    /* --- Carta 2: exigir o acomodar ------------------------------- */
    var MENSAJES_CONTRATOS = {
      ambos: "Bajo E, 75 no cumple m < 60: la obligación era de quien " +
        "llama, no la cumplió, y el assert detiene el programa.",
      correcta: null,
      alreves: "Al revés: el contrato que exige es el que se detiene. El " +
        "que acomoda guarda 18 * 60 + 75 = 1155 y responde 19:15 gracias " +
        "a la división.",
      compila: "Los dos constructores compilan: la diferencia entre exigir " +
        "y acomodar no la ve el compilador, la ve quien corre el programa."
    };

    document.querySelectorAll("#opciones-contratos button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-contratos");
        var mensaje = MENSAJES_CONTRATOS[boton.dataset.op];
        if (mensaje === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto: E se detiene y N responde 19:15. Las " +
            "dos son contratos legítimos; cambia quién carga con el " +
            "desborde. Lo único ilegítimo es no decidirlo o no escribirlo.";
          logradas.contratos = true;
          document.getElementById("tabla-contratos").style.display = "block";
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = mensaje;
        }
      });
    });

    /* --- Carta 3: el this que falto ------------------------------- */
    var MENSAJES_SELF = {
      normaliza: "Para responder 11:10 los campos tendrían que haberse " +
        "escrito, y este constructor nunca los toca: h = h asigna el " +
        "parámetro sobre sí mismo.",
      nocompila: "Compila sin una sola advertencia, incluso con -Wall " +
        "-Wextra: dentro del constructor, h nombra al parámetro, que tapa " +
        "al campo del mismo nombre.",
      correcta: null
    };

    document.querySelectorAll("#opciones-self button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-self");
        var mensaje = MENSAJES_SELF[boton.dataset.op];
        if (mensaje === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto: los campos quedaron sin escribir y el " +
            "programa imprime lo que hubiera en esa memoria. En la corrida " +
            "de esta página salió 1:0; en otra máquina puede salir " +
            "cualquier cosa.";
          logradas.self = true;
          document.getElementById("detalle-this").style.display = "block";
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = mensaje;
        }
      });
    });
  })();
}
