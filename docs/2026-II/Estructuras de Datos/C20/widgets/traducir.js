/* Ejercicio interactivo: del TAD construido a mano al contenedor de la biblioteca (clase 20). */
var EJERCICIO = (function () {
  /* Cada linea: la version con los TAD del curso, la de la biblioteca y lo que hace. */
  var PROGRAMA = [
    { mano: "d.insertarFinal(6);", biblio: "d.push_back(6);", hacer: function (e) { e.d.push(6); } },
    { mano: "d.insertarFrente(2);", biblio: "d.push_front(2);", hacer: function (e) { e.d.unshift(2); } },
    { mano: "d.insertarFinal(9);", biblio: "d.push_back(9);", hacer: function (e) { e.d.push(9); } },
    { mano: "s.apilar(d.final());", biblio: "s.push(d.back());", hacer: function (e) { e.s.push(e.d[e.d.length - 1]); } },
    { mano: "d.eliminarFinal();", biblio: "d.pop_back();", hacer: function (e) { e.d.pop(); } },
    { mano: "s.apilar(d.frente());", biblio: "s.push(d.front());", hacer: function (e) { e.s.push(e.d[0]); } },
    { mano: "d.eliminarFrente();", biblio: "d.pop_front();", hacer: function (e) { e.d.shift(); } },
    { mano: "q.encolar(s.tope());", biblio: "q.push(s.top());", hacer: function (e) { e.q.push(e.s[e.s.length - 1]); } },
    { mano: "s.desapilar();", biblio: "s.pop();", hacer: function (e) { e.s.pop(); } },
    { mano: "q.encolar(d.frente());", biblio: "q.push(d.front());", hacer: function (e) { e.q.push(e.d[0]); } },
    { mano: "q.encolar(s.tope());", biblio: "q.push(s.top());", hacer: function (e) { e.q.push(e.s[e.s.length - 1]); } }
  ];

  /* Corre el programa y guarda el estado de los tres contenedores tras cada linea. */
  function correr() {
    var e = { d: [], s: [], q: [] };
    var estados = [];
    PROGRAMA.forEach(function (l) {
      l.hacer(e);
      estados.push({ d: e.d.slice(), s: e.s.slice(), q: e.q.slice() });
    });
    var salida = [e.q[0], e.q[e.q.length - 1], e.s[e.s.length - 1], e.d.length];
    return { estados: estados, salida: salida };
  }

  function texto(v) { return v.length === 0 ? "vacía" : v.join(" "); }

  function spec() {
    var R = correr();
    var mano = PROGRAMA.map(function (l) { return l.mano; }).join("\n");
    var pasos = [{ texto: "los tres contenedores arrancan vacíos",
                   html: "<p><code>d</code>: vacía · <code>s</code>: vacía · <code>q</code>: vacía</p>" }];
    R.estados.forEach(function (st, k) {
      pasos.push({
        texto: PROGRAMA[k].biblio,
        html: "<p><code>d</code>, del frente al final: " + texto(st.d) +
              " · <code>s</code>, del fondo al tope: " + texto(st.s) +
              " · <code>q</code>, del frente al final: " + texto(st.q) + "</p>"
      });
    });
    return {
      contenedor: "tarjetas",
      cierre: "Cada TAD construido a mano tiene su par en la biblioteca: la cola doble es <code>deque</code>, la pila es <code>stack</code> y la cola es <code>queue</code>, con los mismos costos, Θ(1) u O(1) en cada operación de este programa. Cambian los nombres y una costumbre: <code>pop</code> no devuelve el elemento, se lee antes con <code>top</code>, <code>front</code> o <code>back</code>. Y los adaptadores solo exponen su contrato: ni <code>s.pop_back()</code> ni <code>q.push_back()</code> existen, aunque el contenedor de debajo los tenga.",
      cartas: [
        { tipo: "opciones", titulo: "<code>d.insertarFrente(2)</code>", columna: true, correcta: "pf",
          html: "<p>El programa usa la cola doble <code>d</code>, la pila <code>s</code> y la cola <code>q</code> construidas a mano:</p><pre class=\"fragmento\">" + mano + "</pre><p>En la biblioteca, <code>d</code> es un <code>deque&lt;int&gt;</code>, <code>s</code> un <code>stack&lt;int&gt;</code> y <code>q</code> una <code>queue&lt;int&gt;</code>. ¿Cómo se escribe la segunda línea?</p>",
          opciones: [
            { op: "ins", texto: "<code>d.insert(0, 2);</code>", msg: "insert no recibe una posición entera: recibe un iterador, d.insert(d.begin(), 2). Y para el frente hay una operación propia, más directa." },
            { op: "pf", texto: "<code>d.push_front(2);</code>", msg: "Correcto. insertarFrente es push_front: O(1) en el deque, como Θ(1) en la cola doble sobre nodos." },
            { op: "push", texto: "<code>d.push(2);</code>", msg: "push es el nombre de los adaptadores stack y queue. El deque dice por qué extremo entra: push_front o push_back." }
          ] },
        { tipo: "opciones", titulo: "<code>s.apilar(d.final())</code>", columna: true, correcta: "back",
          opciones: [
            { op: "end", texto: "<code>s.push(d.end());</code>", msg: "end() es un iterador que señala una casilla después del último, no el dato. No compila: push espera un int." },
            { op: "back", texto: "<code>s.push(d.back());</code>", msg: "Correcto. final es back, y apilar es push en stack." },
            { op: "idx", texto: "<code>s.push(d[d.size()]);</code>", msg: "El último está en d[d.size() - 1]. d[d.size()] lee fuera del deque y el resultado no está definido." }
          ] },
        { tipo: "opciones", titulo: "<code>d.eliminarFrente()</code>", columna: true, correcta: "pf",
          opciones: [
            { op: "erase", texto: "<code>d.erase(0);</code>", msg: "erase también recibe un iterador, no una posición. d.erase(d.begin()) funcionaría, pero el deque trae la operación del extremo." },
            { op: "pf", texto: "<code>d.pop_front();</code>", msg: "Correcto: pop_front, O(1). Saca el frente y no lo devuelve." },
            { op: "pop", texto: "<code>d.pop();</code>", msg: "El deque no tiene pop a secas: tiene dos extremos y hay que decir cuál." }
          ] },
        { tipo: "opciones", titulo: "<code>s.desapilar()</code>", columna: true, correcta: "pop",
          opciones: [
            { op: "popb", texto: "<code>s.pop_back();</code>", msg: "stack no expone las operaciones del contenedor de debajo: solo push, pop, top, size y empty. No compila." },
            { op: "top", texto: "<code>s.top();</code>", msg: "top lee el tope sin sacarlo. La pila quedaría igual." },
            { op: "pop", texto: "<code>s.pop();</code>", msg: "Correcto. pop saca el tope y no lo devuelve; por eso la línea anterior lo leyó con top." }
          ] },
        { tipo: "opciones", titulo: "<code>q.encolar(d.frente())</code>", columna: true, correcta: "push",
          opciones: [
            { op: "pushb", texto: "<code>q.push_back(d.front());</code>", msg: "queue solo deja entrar con push. push_back es del deque que tiene adentro, y el adaptador no lo deja pasar." },
            { op: "push", texto: "<code>q.push(d.front());</code>", msg: "Correcto. En queue, push entra por el final y pop sale por el frente." },
            { op: "pushf", texto: "<code>q.push_front(d.front());</code>", msg: "Una cola no deja entrar por el frente: sería colarse. queue no tiene push_front." }
          ] },
        { tipo: "respuesta", titulo: "La salida",
          html: "<p>Al final, el programa imprime <code>q.front()</code>, <code>q.back()</code>, <code>s.top()</code> y <code>d.size()</code>. ¿Qué cuatro números salen?</p>",
          campos: [{ rotulo: "salida:", esperado: R.salida.join(" "), pista: "a b c d", ancho: "9rem" }],
          bien: "Correcto: " + R.salida.join(" ") + ". Al terminar, q tiene " + texto(R.estados[R.estados.length - 1].q) + ", s tiene " + texto(R.estados[R.estados.length - 1].s) + " y d tiene " + texto(R.estados[R.estados.length - 1].d) + ".",
          distractores: [
            { valores: ["9 2 9 1"], msg: "front y back están al revés: en q entró primero el 2, que es el frente." },
            { valores: ["2 9 2 1"], msg: "s.pop() sacó el 2, que era el tope; en s queda el 9." }
          ],
          otro: "Siga el paso a paso de abajo, línea por línea." },
        { tipo: "pasos", titulo: "Línea por línea", pasos: pasos }
      ]
    };
  }

  return { programa: PROGRAMA, correr: correr, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
