/* Ejercicio interactivo: stack y queue sobre distintos contenedores (clase 20). */
var EJERCICIO = (function () {
  /* El programa de la primera tarjeta, simulado con arreglos. */
  function correr() {
    var s = [];
    var q = [];
    var t = [];
    var x = 2;
    while (x <= 8) {
      s.push(x);
      q.push(x * x);
      t.push(x + 1);
      x = x + 3;
    }
    s.pop();
    q.shift();
    return [s[s.length - 1], q[0], q[q.length - 1], t[t.length - 1], s.length + q.length + t.length];
  }

  /* Declaraciones y si compilan con push, pop y la lectura de su extremo. */
  var DECLARACIONES = [
    { id: "stacklist", decl: "stack&lt;int, list&lt;int&gt; &gt;", compila: true },
    { id: "queuevector", decl: "queue&lt;int, vector&lt;int&gt; &gt;", compila: false },
    { id: "queuelist", decl: "queue&lt;int, list&lt;int&gt; &gt;", compila: true }
  ];

  function spec() {
    var R = correr();
    return {
      contenedor: "tarjetas",
      cierre: "Un adaptador no guarda nada por su cuenta: traduce su contrato a operaciones del contenedor de debajo. stack pide <code>back</code>, <code>push_back</code> y <code>pop_back</code>, que tienen vector, deque y list; queue pide además <code>front</code> y <code>pop_front</code>, que el vector no trae porque le costaría correr todo. El costo de cada operación es el del contenedor de debajo, O(1) en los tres casos válidos, y lo que cambia es la memoria: bloques en el deque, un arreglo que se duplica en el vector y un nodo con dos punteros por elemento en la list.",
      cartas: [
        { tipo: "respuesta", titulo: "La salida",
          html: "<pre class=\"fragmento\">stack&lt;int, list&lt;int&gt; &gt; s;\nqueue&lt;int&gt; q;\nstack&lt;int, vector&lt;int&gt; &gt; t;\nint x = 2;\nwhile (x &lt;= 8) {\n  s.push(x);\n  q.push(x * x);\n  t.push(x + 1);\n  x = x + 3;\n}\ns.pop();\nq.pop();\nprintf(\"%d %d %d %d %d\\n\", s.top(), q.front(), q.back(), t.top(),\n       (int) (s.size() + q.size() + t.size()));</pre><p>¿Qué cinco números imprime?</p>",
          campos: [{ rotulo: "salida:", esperado: R.join(" "), pista: "a b c d e", ancho: "10rem" }],
          bien: "Correcto: " + R.join(" ") + ". x toma 2, 5 y 8. s.pop() saca el 8, el último que entró, y q.pop() saca el 4, el primero. Que s guarde sus datos en una list y t en un vector no cambia lo que sale.",
          distractores: [
            { valores: ["2 25 64 9 7"], msg: "s es una pila: pop saca el último que entró, el 8, y el tope queda en el 5." },
            { valores: ["5 4 25 9 7"], msg: "q es una cola: pop saca el más viejo, el 4, y el frente pasa al 25." },
            { valores: ["5 25 64 9 9"], msg: "Los dos pop sacaron un elemento cada uno: quedan 2 + 2 + 3." }
          ],
          otro: "Anote el contenido de las tres después del ciclo, y aplique los dos pop." },
        { tipo: "opciones", titulo: "<code>" + DECLARACIONES[0].decl + "</code>", columna: true, correcta: "si",
          html: "<p>¿Compila un programa que declara <code>" + DECLARACIONES[0].decl + " p;</code> y usa <code>p.push(3)</code>, <code>p.top()</code> y <code>p.pop()</code>?</p>",
          opciones: [
            { op: "si", texto: "Sí, y cada operación es Θ(1)", msg: "Correcto. stack usa back, push_back y pop_back, y list los tiene en Θ(1). Cada elemento paga un nodo con dos punteros." },
            { op: "no", texto: "No: list no tiene índice y la pila lo necesita", msg: "La pila nunca usa índice: solo el último. Eso list lo da en Θ(1)." }
          ] },
        { tipo: "opciones", titulo: "<code>" + DECLARACIONES[1].decl + "</code> sin <code>pop</code>", columna: true, correcta: "si",
          html: "<p>Un programa declara <code>" + DECLARACIONES[1].decl + " c;</code> y solo llama <code>c.push(5)</code>, <code>c.push(6)</code> y <code>c.front()</code>. Nunca llama <code>c.pop()</code>. ¿Compila?</p>",
          opciones: [
            { op: "si", texto: "Sí: el error solo aparece si se llama <code>pop</code>", msg: "Correcto. Cada operación del adaptador se compila cuando se usa, y solo pop pide pop_front. Con push y front, el vector alcanza. En cuanto aparezca un c.pop(), el compilador se queja de que vector no tiene pop_front." },
            { op: "no", texto: "No: <code>queue</code> nunca acepta un <code>vector</code>", msg: "La declaración sola compila. Lo que falla es la operación que necesita pop_front, y solo cuando se usa." }
          ] },
        { tipo: "opciones", titulo: "Una cola sobre <code>list</code>", columna: true, correcta: "memoria",
          html: "<p>Se cambia <code>queue&lt;int&gt;</code> por <code>" + DECLARACIONES[2].decl + "</code> en un programa que encola y desencola un millón de enteros. ¿Qué cambia?</p>",
          opciones: [
            { op: "costo", texto: "push y pop pasan de O(1) a Θ(n)", msg: "list entra por el final y sale por el frente en Θ(1). Los costos asintóticos no cambian." },
            { op: "memoria", texto: "Los costos son los mismos; cada elemento ocupa un nodo con dos punteros", msg: "Correcto. Con el deque, los enteros van juntos en bloques; con la list, cada uno pide su new y carga dos punteros. Mismo contrato, más memoria y más reservas." },
            { op: "nada", texto: "Nada, el adaptador esconde el contenedor", msg: "Esconde las operaciones, no la memoria. El contenedor de debajo decide cuánto ocupa cada elemento y cuántas reservas se hacen." }
          ] },
        { tipo: "opciones", titulo: "Escoger lo de debajo", columna: true, correcta: "deque",
          html: "<p>Una pila de enteros que llega a diez millones. El programa responde en tiempo real y no puede permitir que un <code>push</code> suelto copie todos los elementos. ¿Qué contenedor va debajo?</p>",
          opciones: [
            { op: "vector", texto: "<code>vector&lt;int&gt;</code>", msg: "push es O(1) amortizado, no en cada llamada: el push que encuentra la capacidad llena reserva otro arreglo y copia todos los elementos. Ese es justo el pico que se quiere evitar." },
            { op: "list", texto: "<code>list&lt;int&gt;</code>", msg: "Nunca copia elementos, pero cada entero carga dos punteros y pide su propia reserva. El deque evita el pico sin ese gasto." },
            { op: "deque", texto: "<code>deque&lt;int&gt;</code>, el de por defecto", msg: "Correcto. Al crecer pide un bloque nuevo y, a lo sumo, copia el mapa de punteros a bloques, que es mucho más corto que los datos. Los elementos no se copian nunca, y van juntos en bloques, sin punteros por elemento." }
          ] }
      ]
    };
  }

  return { correr: correr, declaraciones: DECLARACIONES, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
