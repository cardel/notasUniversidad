/* Ejercicio interactivo: el tiempo medido de insertar en la mitad (clase 20).
   Cifras de una corrida de medir20.cpp: clock(), g++ -Wall -Wextra sin optimizar,
   AMD Ryzen 5 3600. Tres corridas difirieron en menos del 10 % en las cifras
   mayores de 0,01 s. */
var EJERCICIO = (function () {
  var MEDIDAS = [
    [10000, 0.0015, 0.0148, 0.0007],
    [20000, 0.0053, 0.0544, 0.0015],
    [40000, 0.0231, 0.2137, 0.0032],
    [80000, 0.0920, 0.8211, 0.0068]
  ];
  var FACTORES = { vector: 4, deque: 4, list: 2 };

  function cifra(x) { return x.toFixed(4).replace(".", ","); }
  function miles(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  /* La simulación de la lista: el cursor queda en la posición size() / 2. */
  function mitadLista(n) {
    var l = [];
    var medio = 0;
    var i = 0;
    while (i < n) {
      var par = l.length % 2 === 0;
      l.splice(medio, 0, i);
      if (!par) { medio = medio + 1; }
      i = i + 1;
    }
    return l;
  }

  function mitadVector(n) {
    var v = [];
    var i = 0;
    while (i < n) {
      v.splice(Math.floor(v.length / 2), 0, i);
      i = i + 1;
    }
    return v;
  }

  function spec() {
    var u = MEDIDAS[MEDIDAS.length - 1];
    return {
      contenedor: "tarjetas",
      cierre: "En la mitad, vector y deque corren unos n/2 elementos por inserción: n inserciones dan del orden de n², y los dos multiplican su tiempo por cerca de 4 al duplicar n. El orden es el mismo, pero la constante no: el vector mueve un tramo seguido de memoria y el deque recorre casillas repartidas en bloques, y aquí tardó unas " + Math.round(u[2] / u[1]) + " veces más. La list inserta con el cursor en Θ(1) y lo corrige un paso cada dos inserciones: el total es lineal.",
      cartas: [
        { tipo: "respuesta", titulo: "Antes de ver los tiempos",
          html: "<p>Se insertan <code>n</code> enteros, cada uno en la posición <code>size() / 2</code>. El vector y el deque usan <code>insert(begin() + size() / 2, i)</code>. La list guarda un iterador <code>medio</code> en esa posición: inserta antes de él y, cuando el tamaño era par, lo retrocede un nodo.</p><pre class=\"fragmento\">bool par = l.size() % 2 == 0;\nl.insert(medio, i);\nif (par) {\n  --medio;\n}</pre><p>Los tres dejan la misma secuencia. Cuando <code>n</code> se duplica, ¿por cuánto se multiplica cada tiempo, aproximadamente?</p>",
          campos: [{ rotulo: "vector ×", esperado: String(FACTORES.vector) }, { rotulo: "deque ×", esperado: String(FACTORES.deque) }, { rotulo: "list ×", esperado: String(FACTORES.list) }],
          bien: "Correcto: 4, 4 y 2. De " + miles(MEDIDAS[2][0]) + " a " + miles(u[0]) + ", el vector pasó de " + cifra(MEDIDAS[2][1]) + " a " + cifra(u[1]) + " s, el deque de " + cifra(MEDIDAS[2][2]) + " a " + cifra(u[2]) + " s y la list de " + cifra(MEDIDAS[2][3]) + " a " + cifra(u[3]) + " s.",
          distractores: [
            { valores: [null, "2", null], msg: "El deque solo es O(1) en los extremos. En la mitad corre el lado corto, que mide n/2: lo mismo que el vector." },
            { valores: [null, null, "4"], msg: "La list no corre a nadie: insertar con el iterador es Θ(1) y corregir el cursor es un paso." }
          ],
          otro: "¿Cuántos elementos corre cada uno en una inserción en la mitad?" },
        { tipo: "opciones", titulo: "vector contra deque", columna: true, correcta: "vector",
          html: "<p>Los dos corren unos n/2 elementos por inserción. Con n = " + miles(u[0]) + ", ¿cuál tardó menos?</p>",
          opciones: [
            { op: "deque", texto: "El deque: corre el lado más corto", msg: "En la mitad los dos lados miden lo mismo, así que el deque no ahorra nada. Y tardó " + cifra(u[2]) + " s, contra " + cifra(u[1]) + " s del vector." },
            { op: "iguales", texto: "Los dos igual: corren lo mismo", msg: "Corren la misma cantidad, pero no de la misma forma. Tardaron " + cifra(u[1]) + " s el vector y " + cifra(u[2]) + " s el deque." },
            { op: "vector", texto: "El vector: mueve un tramo seguido de memoria", msg: "Correcto: " + cifra(u[1]) + " s contra " + cifra(u[2]) + " s, unas " + Math.round(u[2] / u[1]) + " veces menos. El vector corre un bloque contiguo de una vez; el deque avanza casilla por casilla y salta de bloque en bloque. El orden asintótico es el mismo y la constante no." }
          ] },
        { tipo: "opciones", titulo: "Si se duplica otra vez", columna: true, correcta: "x2",
          html: "<p>Con n = " + miles(u[0]) + " la list tardó " + cifra(u[3]) + " s. ¿Cuánto debería tardar con " + miles(2 * u[0]) + "?</p>",
          opciones: [
            { op: "x1", texto: "Cerca de " + cifra(u[3]) + " s", msg: "Cada inserción es O(1), pero hay el doble de inserciones." },
            { op: "x2", texto: "Cerca de " + cifra(2 * u[3]) + " s", msg: "Correcto: n inserciones de O(1), lineal." },
            { op: "x4", texto: "Cerca de " + cifra(4 * u[3]) + " s", msg: "Eso sería cuadrático. La list nunca corre elementos." }
          ] },
        { tipo: "tabla", titulo: "Los tiempos medidos",
          cabecera: ["n", "vector, insert", "deque, insert", "list, insert con cursor"],
          filas: MEDIDAS.map(function (m) { return [miles(m[0]), cifra(m[1]), cifra(m[2]), cifra(m[3])]; }),
          nota: "Segundos de procesador medidos con <code>clock()</code>, compilando con <code>g++ -Wall -Wextra</code> sin optimizar, en un AMD Ryzen 5 3600. Tres corridas difirieron en menos del 10 % en las cifras mayores de 0,01 s, y los tres contenedores terminaron con la misma secuencia." }
      ]
    };
  }

  return { medidas: MEDIDAS, factores: FACTORES, mitadLista: mitadLista, mitadVector: mitadVector, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
