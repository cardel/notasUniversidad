/* Ejercicio interactivo: la caja del TAD (clase 10). */
var EJERCICIO = (function () {
  /* Casos y respuestas correctas de cada carta. */
  var CASOS = {
    normal: { h: 9, m: 130, total: 670, hora: 11, minuto: 10 },
    total: { total: 500, hora: 8, minuto: 20 }
  };

  /* Lado correcto de cada linea de la carta de la barrera. */
  var BARRERA = ["area", "impl", "area", "impl", "area"];

  /* La pareja que responde la caja para crear(h, m). */
  function normaliza(h, m) {
    return { hora: h + Math.floor(m / 60), minuto: m % 60 };
  }

  return { casos: CASOS, barrera: BARRERA, normaliza: normaliza };
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

    pintarCodigo("codigo-espec", [
      ["TAD Hora", "bloque-1"],
      ["  valores: instantes del dia, desde la medianoche", ""],
      ["", ""],
      ["  crear   : Entero x Entero -> Hora   con h >= 0 y m >= 0", "bloque-1"],
      ["  hora    : Hora -> Entero", "bloque-1"],
      ["  minuto  : Hora -> Entero", "bloque-1"],
      ["", ""],
      ["  ecuaciones, para r = crear(h, m):", ""],
      ["    hora(r) * 60 + minuto(r) = h * 60 + m", "bloque-2"],
      ["    0 <= minuto(r) < 60", "bloque-2"]
    ]);

    pintarCodigo("codigo-normal", [
      ["Hora r(9, 130);", "bloque-2"],
      ["printf(\"%d:%02d\\n\", r.hora(), r.minuto());", ""]
    ]);

    pintarCodigo("codigo-total", [
      ["class Hora {", ""],
      ["  private:", ""],
      ["    int total;", "bloque-1"],
      ["", ""],
      ["  public:", ""],
      ["    Hora(int h, int m) {", ""],
      ["      total = h * 60 + m;", "bloque-1"],
      ["    }", ""],
      ["", ""],
      ["    int hora() {", ""],
      ["      return total / 60;", "bloque-2"],
      ["    }", ""],
      ["", ""],
      ["    int minuto() {", ""],
      ["      return total % 60;", "bloque-2"],
      ["    }", ""],
      ["};", ""],
      ["", ""],
      ["Hora t(0, 500);", "bloque-2"]
    ]);

    pintarCodigo("codigo-main-doble", [
      ["int main() {", ""],
      ["  Hora r(9, 130);", "bloque-2"],
      ["  printf(\"%d:%02d\\n\", r.hora(), r.minuto());", "bloque-2"],
      ["  return 0;", ""],
      ["}", ""]
    ]);

    /* --- Desbloqueos ---------------------------------------------- */
    var logradas = { normal: false, total: false, barrera: false, doble: false };

    function revisar() {
      if (logradas.normal && logradas.total && logradas.barrera && logradas.doble) {
        document.getElementById("carta-final").style.display = "block";
      }
    }

    /* --- Carta 1: la ecuacion decide ------------------------------ */
    function diagnosticoNormal(h, m) {
      var c = EJERCICIO.casos.normal;
      if (isNaN(h) || isNaN(m)) {
        return "Complete los dos valores primero.";
      }
      if (h === c.h && m === c.m) {
        return "Esa es la pareja que llegó, no una que la caja pueda " +
          "responder: 130 no cumple 0 <= minuto(r) < 60.";
      }
      if (m < 0 || m >= 60) {
        return "El minuto que responde la caja debe cumplir " +
          "0 <= minuto(r) < 60; a " + m + " todavía le sobran sesentas.";
      }
      if (h * 60 + m !== c.total) {
        return "La primera ecuación conserva el total: hora(r) * 60 + " +
          "minuto(r) debe valer 9 * 60 + 130 = 670.";
      }
      return null;
    }

    document.getElementById("btn-normal").addEventListener("click", function () {
      var h = parseInt(document.getElementById("pred-normal-h").value, 10);
      var m = parseInt(document.getElementById("pred-normal-m").value, 10);
      var v = document.getElementById("veredicto-normal");
      var mensaje = diagnosticoNormal(h, m);
      if (mensaje === null) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 11 y 10 son la única pareja que conserva " +
          "el total 670 con el minuto en rango. La ecuación no dice cómo se " +
          "guarda (9, 130): dice qué debe responder la caja.";
        logradas.normal = true;
        revisar();
      } else {
        v.className = "veredicto mal";
        v.textContent = mensaje;
      }
    });

    /* --- Carta 2: quinientos minutos ------------------------------ */
    function diagnosticoTotal(h, m) {
      var c = EJERCICIO.casos.total;
      if (isNaN(h) || isNaN(m)) {
        return "Complete los dos valores primero.";
      }
      if (h === 5 && m === 0) {
        return "500 son quinientos minutos desde la medianoche, no un reloj " +
          "que marca 5:00: la división entera 500 / 60 da las horas completas.";
      }
      if (h === 8 && m === 33) {
        return "El resto no es la parte decimal de 8,33: 500 % 60 cuenta los " +
          "minutos que sobran después de las 8 horas completas.";
      }
      if (m < 0 || m >= 60) {
        return "El operador % con divisor 60 nunca responde " + m + ": el " +
          "resto queda entre 0 y 59.";
      }
      if (h * 60 + m !== c.total) {
        return "Compruebe con la ecuación del contrato: hora(t) * 60 + " +
          "minuto(t) debe valer 500.";
      }
      return null;
    }

    document.getElementById("btn-total").addEventListener("click", function () {
      var h = parseInt(document.getElementById("pred-total-h").value, 10);
      var m = parseInt(document.getElementById("pred-total-m").value, 10);
      var v = document.getElementById("veredicto-total");
      var mensaje = diagnosticoTotal(h, m);
      if (mensaje === null) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 500 / 60 = 8 y 500 % 60 = 20. Esta clase " +
          "no guarda pareja alguna: la fabrica al responder, y la división " +
          "la entrega ya normalizada.";
        logradas.total = true;
        revisar();
      } else {
        v.className = "veredicto mal";
        v.textContent = mensaje;
      }
    });

    /* --- Carta 3: la barrera -------------------------------------- */
    var PISTA_BARRERA = [
      "r.hora() es un observador: esta línea habla con la interfaz y no toca ningún campo.",
      "total es un campo privado: solo el código de la clase puede escribirlo.",
      "Compara con observadores: no necesita saber qué guarda cada objeto por dentro.",
      "Devuelve el campo transformado: es la implementación respondiendo por la interfaz.",
      "Construir un valor es usar la interfaz: el constructor es la primera operación de la caja."
    ];
    var aciertosBarrera = [false, false, false, false, false];

    function marcarBarrera(i, lado, boton) {
      var v = document.getElementById("veredicto-linea-" + i);
      var botones = boton.parentNode.querySelectorAll("button");
      if (lado === EJERCICIO.barrera[i]) {
        v.className = "veredicto bien";
        v.textContent = "Así es. " + PISTA_BARRERA[i];
        aciertosBarrera[i] = true;
        botones.forEach(function (b) { b.disabled = true; });
        if (aciertosBarrera.every(function (x) { return x; })) {
          logradas.barrera = true;
          document.getElementById("cierre-barrera").style.display = "block";
          revisar();
        }
      } else {
        v.className = "veredicto mal";
        v.textContent = PISTA_BARRERA[i];
      }
    }

    document.querySelectorAll("[data-linea]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        marcarBarrera(parseInt(boton.dataset.linea, 10), boton.dataset.lado, boton);
      });
    });

    /* --- Carta 4: mismo main, dos clases -------------------------- */
    var MENSAJES_DOBLE = {
      pareja: "Ninguna de las dos deja ver (9, 130) desde main: main solo " +
        "pregunta hora() y minuto(), y las dos clases responden 11 y 10.",
      correcta: null,
      campos: "main nunca nombra campos: pide hora() y minuto(), y las dos " +
        "clases los ofrecen. Por eso la representación puede cambiar sin " +
        "tocar una línea de main."
    };

    document.querySelectorAll("#opciones-doble button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-doble");
        var mensaje = MENSAJES_DOBLE[boton.dataset.op];
        if (mensaje === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto: las dos corridas imprimen 11:10. El " +
            "contrato responde igual; solo cambió la memoria.";
          logradas.doble = true;
          document.getElementById("tabla-doble").style.display = "block";
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = mensaje;
        }
      });
    });
  })();
}
