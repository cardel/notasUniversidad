/* Ejercicio interactivo: el tiempo medido de vaciar por el frente (clase 20).
   Cifras de una corrida de medir20.cpp: clock(), g++ -Wall -Wextra sin optimizar,
   AMD Ryzen 5 3600. Tres corridas difirieron en menos del 10 % en las cifras
   mayores de 0,01 s. */
var EJERCICIO = (function () {
  var MEDIDAS = [
    [20000, 0.0112, 0.0002, 0.0009],
    [40000, 0.0445, 0.0004, 0.0018],
    [80000, 0.1828, 0.0009, 0.0036],
    [160000, 0.7908, 0.0017, 0.0075]
  ];
  var FACTORES = { vector: 4, deque: 2, list: 2 };

  function cifra(x) { return x.toFixed(4).replace(".", ","); }
  function miles(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  function spec() {
    var u = MEDIDAS[MEDIDAS.length - 1];
    return {
      contenedor: "tarjetas",
      cierre: "Vaciar por el frente es n salidas por el frente. En el vector cada <code>erase(begin())</code> corre los que quedan, así que el total es del orden de n²/2 movimientos, y duplicar n multiplica el tiempo por cerca de 4. En el deque y en la list cada salida es O(1) y el total es lineal: duplicar n duplica el tiempo. Entre esos dos, el deque gana porque libera un bloque cada 128 enteros, y la list hace un <code>delete</code> por elemento.",
      cartas: [
        { tipo: "respuesta", titulo: "Antes de ver los tiempos",
          html: "<p>Se llena cada contenedor con <code>n</code> enteros usando <code>push_back</code> y se mide solo el tiempo de vaciarlo por el frente:</p><pre class=\"fragmento\">while (!v.empty()) { v.erase(v.begin()); }   // vector\nwhile (!d.empty()) { d.pop_front(); }         // deque\nwhile (!l.empty()) { l.pop_front(); }         // list</pre><p>Cuando <code>n</code> se duplica, ¿por cuánto se multiplica cada tiempo, aproximadamente?</p>",
          campos: [{ rotulo: "vector ×", esperado: String(FACTORES.vector) }, { rotulo: "deque ×", esperado: String(FACTORES.deque) }, { rotulo: "list ×", esperado: String(FACTORES.list) }],
          bien: "Correcto: 4, 2 y 2. Con n = 80 000 y con 160 000, el vector pasó de " + cifra(MEDIDAS[2][1]) + " a " + cifra(MEDIDAS[3][1]) + " s; el deque, de " + cifra(MEDIDAS[2][2]) + " a " + cifra(MEDIDAS[3][2]) + " s; la list, de " + cifra(MEDIDAS[2][3]) + " a " + cifra(MEDIDAS[3][3]) + " s.",
          distractores: [
            { valores: ["2", null, null], msg: "Cada erase(begin()) del vector corre todos los que quedan. Son n salidas de costo hasta n: el total crece como n²." },
            { valores: [null, "4", null], msg: "pop_front en el deque adelanta el frente dentro de un bloque, sin correr a nadie: O(1). n salidas cuestan del orden de n." },
            { valores: [null, null, "4"], msg: "pop_front en la list desengancha la cabeza: Θ(1). n salidas cuestan del orden de n." }
          ],
          otro: "Para cada uno, piense cuánto cuesta una salida y multiplique por n." },
        { tipo: "opciones", titulo: "El doble de lo más grande", columna: true, correcta: "x4",
          html: "<p>Con n = " + miles(u[0]) + ", el vector tardó " + cifra(u[1]) + " s. ¿Cuánto debería tardar con n = " + miles(2 * u[0]) + "?</p>",
          opciones: [
            { op: "x1", texto: "Cerca de " + cifra(u[1]) + " s", msg: "El tiempo crece con n: cada salida corre todos los que quedan." },
            { op: "x2", texto: "Cerca de " + cifra(2 * u[1]) + " s", msg: "Eso sería lineal. El vector corre lo que queda en cada salida: cuadrático." },
            { op: "x4", texto: "Cerca de " + cifra(4 * u[1]) + " s", msg: "Correcto: del orden de n², así que el doble de n da unas cuatro veces el tiempo." },
            { op: "x8", texto: "Cerca de " + cifra(8 * u[1]) + " s", msg: "Ocho veces sería n³. Son n salidas de costo hasta n, no más." }
          ] },
        { tipo: "opciones", titulo: "Los dos que son O(1)", columna: true, correcta: "deque",
          html: "<p>Con " + miles(u[0]) + " elementos, deque y list son los dos O(1) por salida. ¿Cuál tardó menos, y por qué?</p>",
          opciones: [
            { op: "iguales", texto: "Los dos igual: tienen el mismo orden", msg: "El mismo orden dice cómo crece el tiempo, no cuánto vale. Con " + miles(u[0]) + " elementos, el deque tardó " + cifra(u[2]) + " s y la list " + cifra(u[3]) + " s." },
            { op: "deque", texto: "El deque: libera un bloque cada 128 enteros, la list un nodo por elemento", msg: "Correcto: " + cifra(u[2]) + " s contra " + cifra(u[3]) + " s, unas " + Math.round(u[3] / u[2]) + " veces menos. Cada delete de la list es una llamada al administrador de memoria; el deque hace una cada 128 salidas." },
            { op: "list", texto: "La list: solo mueve un puntero", msg: "Mueve un puntero, pero también libera un nodo en cada salida. El deque libera mucho menos seguido." }
          ] },
        { tipo: "tabla", titulo: "Los tiempos medidos",
          cabecera: ["n", "vector, erase(begin())", "deque, pop_front", "list, pop_front"],
          filas: MEDIDAS.map(function (m) { return [miles(m[0]), cifra(m[1]), cifra(m[2]), cifra(m[3])]; }),
          nota: "Segundos de procesador medidos con <code>clock()</code>, compilando con <code>g++ -Wall -Wextra</code> sin optimizar, en un AMD Ryzen 5 3600. Tres corridas difirieron en menos del 10 % en las cifras mayores de 0,01 s." }
      ]
    };
  }

  return { medidas: MEDIDAS, factores: FACTORES, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
