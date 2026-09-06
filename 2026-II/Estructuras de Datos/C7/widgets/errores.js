/* Ejercicio interactivo: encuentre los errores de memoria (clase 7). */
var EJERCICIO = (function () {
  var LINEAS = [
    { txt: "int *a = malloc(n * sizeof(int));" },
    { txt: "int *b = malloc(n * sizeof(int));" },
    { txt: "a[0] = 1;" },
    { txt: "b[0] = 2;" },
    { txt: "b = malloc(2 * n * sizeof(int));" },
    { txt: "b[0] = 3;" },
    { txt: "free(a);" },
    { txt: "free(b);" }
  ];

  /* Indices (desde 0) donde nace cada error:
     2 = primer uso sin preguntar por NULL, 4 = la fuga. */
  var OBJETIVOS = [2, 4];

  return { lineas: LINEAS, objetivos: OBJETIVOS };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var hallados = {};

    var MENSAJES = {
      0: "El malloc en sí está bien pedido. El problema no es reservar: es lo " +
        "que se hace (o no se hace) justo después. Busque dónde se usa el bloque.",
      1: "Igual que el anterior: la reserva está bien. Siga la vida del bloque.",
      2: "Primer error: se usa a[0] sin haber preguntado si malloc devolvió " +
        "NULL. Si no había memoria, esta escritura cae en ninguna parte. Regla 1.",
      3: "También usa un bloque sin verificar, pero el pecado original está una " +
        "línea antes: señale la primera vez que ocurre.",
      4: "Segundo error: este malloc pisa la única dirección del bloque " +
        "anterior de b. Ese bloque queda sin dueño y ya nadie puede liberarlo: " +
        "una fuga. Regla 2.",
      5: "Esta escritura usa el bloque nuevo de b, que sí existe (aunque " +
        "tampoco se verificó su NULL: el error de fondo ya lo marcó en otra " +
        "línea). El otro error nació antes.",
      6: "Este free está bien: el bloque de a tiene su malloc y su free.",
      7: "Este free libera el bloque nuevo de b. El bloque que quedó perdido " +
        "es otro, y se perdió antes de llegar aquí."
    };

    function pintarEstado() {
      var total = Object.keys(hallados).length;
      var marcador = document.getElementById("marcador");
      marcador.textContent = "Errores encontrados: " + total + " de " +
        EJERCICIO.objetivos.length;
      if (total === EJERCICIO.objetivos.length) {
        document.getElementById("carta-arreglo").style.display = "block";
      }
    }

    EJERCICIO.lineas.forEach(function (l, idx) {
      var div = document.createElement("div");
      div.className = "linea";
      div.style.cursor = "pointer";
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = idx + 1;
      var txt = document.createElement("span");
      txt.className = "txt";
      txt.textContent = l.txt;
      div.appendChild(num);
      div.appendChild(txt);
      div.addEventListener("click", function () {
        var v = document.getElementById("veredicto-lineas");
        var esObjetivo = EJERCICIO.objetivos.indexOf(idx) >= 0;
        if (esObjetivo) {
          hallados[idx] = true;
          div.style.background = "var(--rojo-suave)";
          div.style.borderLeftColor = "var(--rojo)";
          v.className = "veredicto bien";
          v.textContent = MENSAJES[idx];
          pintarEstado();
        } else {
          v.className = "veredicto mal";
          v.textContent = MENSAJES[idx];
        }
      });
      document.getElementById("panel-lineas").appendChild(div);
    });

    pintarEstado();
  })();
}
