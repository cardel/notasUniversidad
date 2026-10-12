/* Ejercicio interactivo: qué invariante falla en cada estado (clase 19). */
var EJERCICIO = (function () {
  var ORIGINAL = [6, 1, 7, 3, 8, 2, 4];
  var INI = 0;
  var FIN = 6;

  /* Estados que alguien anotó al seguir particionar(a, 0, 6) sobre ORIGINAL.
     Cada uno se revisa en la evaluación de la condición del while. */
  var ESTADOS = [
    { i: 0, j: 3, a: [1, 6, 7, 3, 8, 2, 4] },
    { i: 1, j: 3, a: [1, 6, 7, 3, 8, 2, 4] },
    { i: 0, j: 4, a: [1, 6, 3, 7, 8, 2, 4] },
    { i: 1, j: 4, a: [1, 3, 7, 6, 4, 2, 8] },
    { i: 1, j: 4, a: [1, 3, 7, 7, 8, 2, 4] },
    { i: 2, j: 2, a: [1, 3, 2, 6, 8, 7, 4] }
  ];

  function multiconjunto(v) {
    return v.slice().sort(function (u, w) { return u - w; }).join(",");
  }

  /* Devuelve la lista de invariantes que el estado no cumple. */
  function violados(estado, original, ini, fin) {
    var x = original[fin];
    var a = estado.a;
    var i = estado.i;
    var j = estado.j;
    var fallan = [];
    if (!(ini - 1 <= i && i < j && j <= fin)) {
      fallan.push("I1");
    }
    var k = ini;
    var cumple = true;
    while (k <= i) {
      if (!(a[k] <= x)) { cumple = false; }
      k = k + 1;
    }
    if (!cumple) { fallan.push("I2"); }
    k = i + 1;
    cumple = true;
    while (k <= j - 1) {
      if (!(a[k] > x)) { cumple = false; }
      k = k + 1;
    }
    if (!cumple) { fallan.push("I3"); }
    if (a[fin] !== x) { fallan.push("I4"); }
    if (multiconjunto(a) !== multiconjunto(original)) { fallan.push("I5"); }
    return fallan;
  }

  /* La respuesta de cada estado: "ninguno" o el único invariante que falla. */
  function respuestas() {
    return ESTADOS.map(function (e) {
      var f = violados(e, ORIGINAL, INI, FIN);
      return f.length === 0 ? "ninguno" : f.join(" ");
    });
  }

  return { original: ORIGINAL, ini: INI, fin: FIN, estados: ESTADOS,
           violados: violados, respuestas: respuestas };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var RESP = EJERCICIO.respuestas();
    var EXPLICA = [
      {
        bien: "Correcto: los cinco se cumplen. a[0] = 1 está en la zona de los menores, a[1..2] = 6, 7 en la de los mayores, el 4 sigue en fin y los valores son los del principio. Es el estado real después de la tercera vuelta.",
        I2: "a[0..0] = 1 cumple 1 <= 4: I2 vale.",
        I3: "La zona de los mayores es a[i + 1..j - 1] = a[1..2] = 6, 7, y los dos superan a 4: I3 vale.",
        otro: "Revise cada fórmula con i = 0 y j = 3. Todas se cumplen."
      },
      {
        bien: "Correcto: I2. Con i = 1 la zona de los menores es a[0..1] = 1, 6, y 6 > 4. Este estado aparece si i avanza sin que se haga el intercambio.",
        I3: "La zona de I3 es a[i + 1..j - 1] = a[2..2] = 7, que es mayor que 4. El problema está en la zona de los menores.",
        otro: "Evalúe I2 con i = 1: pide a[0] <= 4 y a[1] <= 4."
      },
      {
        bien: "Correcto: I3. La zona de los mayores es a[1..3] = 6, 3, 7, y 3 no es mayor que 4. Ese 3 debió cambiarse con el 6 cuando j pasó por él, y entonces i habría quedado en 1.",
        I2: "I2 solo mira a[0..0] = 1, que cumple. El valor fuera de lugar está entre i + 1 y j - 1.",
        ninguno: "Mire la zona a[i + 1..j - 1] con i = 0 y j = 4: tiene un valor que no supera al pivote.",
        otro: "Evalúe I3 con i = 0 y j = 4: pide a[1], a[2] y a[3] mayores que 4."
      },
      {
        bien: "Correcto: I4. El pivote 4 ya no está en a[6], que ahora vale 8. Ninguna vuelta del ciclo toca fin, porque j < fin; el pivote solo se mueve en el intercambio de después del ciclo.",
        I5: "Los valores son los mismos siete del principio, solo reordenados: I5 vale. Lo que cambió es dónde está el 4.",
        ninguno: "Mire a[fin]: I4 exige que siga valiendo x = 4.",
        otro: "Revise I4: a[fin] = x."
      },
      {
        bien: "Correcto: I5. Falta el 6 y el 7 aparece dos veces, así que el multiconjunto cambió. Es lo que deja un intercambio escrito sin temporal, que copia un valor encima del otro.",
        I3: "a[2..3] = 7, 7 son mayores que 4: I3 vale aunque haya un valor repetido.",
        ninguno: "Compare los valores con los del principio, 6, 1, 7, 3, 8, 2, 4: ¿están todos?",
        otro: "Compare el multiconjunto con el del principio."
      },
      {
        bien: "Correcto: I1. Exige i < j, y aquí i = j = 2. Las zonas de I2 e I3 se cumplen, pero un j que no supera a i no puede venir del ciclo: i empieza una casilla atrás y nunca la alcanza.",
        I3: "Con i = 2 y j = 2 el rango de I3 es a[3..1], vacío: I3 se cumple sin casos que revisar.",
        ninguno: "Revise las desigualdades de I1 con i = 2 y j = 2.",
        otro: "Revise I1: ini - 1 <= i < j <= fin."
      }
    ];

    function decir(id, bien, texto) {
      var ver = document.getElementById(id);
      ver.className = "veredicto " + (bien ? "bien" : "mal");
      ver.textContent = texto;
    }
    var logradas = RESP.map(function () { return false; });
    function revisar() {
      if (logradas.every(function (b) { return b; })) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    var OPCIONES = ["ninguno", "I1", "I2", "I3", "I4", "I5"];
    var contenedor = document.getElementById("estados");
    EJERCICIO.estados.forEach(function (e, n) {
      var carta = document.createElement("div");
      carta.className = "carta";
      var h = document.createElement("h2");
      h.textContent = "Estado " + (n + 1) + ": i = " + e.i + ", j = " + e.j;
      carta.appendChild(h);
      var fila = document.createElement("div");
      fila.className = "arreglo fila-arreglo";
      e.a.forEach(function (v, k) {
        var cel = document.createElement("div");
        cel.className = "caja fija" + (k === EJERCICIO.fin ? " zona-pivote" : "");
        var idx = document.createElement("span");
        idx.className = "indice";
        idx.textContent = k;
        cel.appendChild(idx);
        cel.appendChild(document.createTextNode(v));
        fila.appendChild(cel);
      });
      carta.appendChild(fila);
      var pregunta = document.createElement("p");
      pregunta.textContent = "¿Qué invariante no se cumple?";
      carta.appendChild(pregunta);
      var ops = document.createElement("div");
      ops.className = "opciones";
      var idVer = "veredicto-" + n;
      OPCIONES.forEach(function (o) {
        var b = document.createElement("button");
        b.textContent = o === "ninguno" ? "Ninguno: se cumplen los cinco" : o;
        b.addEventListener("click", function () {
          var ex = EXPLICA[n];
          if (o === RESP[n]) {
            decir(idVer, true, ex.bien);
            logradas[n] = true; revisar();
          } else {
            decir(idVer, false, ex[o] || ex.otro);
          }
        });
        ops.appendChild(b);
      });
      carta.appendChild(ops);
      var ver = document.createElement("div");
      ver.id = idVer;
      ver.className = "veredicto";
      carta.appendChild(ver);
      contenedor.appendChild(carta);
    });
  })();
}
