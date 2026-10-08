/* Ejercicio interactivo: leer un enunciado y decidir por donde se corta
   (clase 11). Cada enunciado se desarma en cuatro decisiones: quienes son los
   vertices, si lo que se quita es un vertice o una arista, cual comparacion lo
   decide y hasta donde hay que llegar. Cada opcion equivocada explica que se
   confundio. */
var EJERCICIO = (function () {
  var COMPARACIONES = {
    articulacion: "low[w] >= d[u], y la raíz aparte, por su número de hijos",
    puente: "low[w] > d[u], con desigualdad estricta",
    articulacionSinRaiz: "low[w] >= d[u] para todos, incluida la raíz",
    imposible: "low[u] > d[u]"
  };

  var ESCENARIOS = [
    {
      titulo: "Distrito de riego",
      enunciado: "Un distrito de riego tiene parcelas unidas por canales de doble sentido. Con todos los canales abiertos el agua llega de cualquier parcela a cualquier otra. Cuando un canal se tapona, las parcelas de un lado dejan de recibir agua. Por cada canal hay que imprimir cuántas parcelas quedan del lado que no tiene la bocatoma.",
      preguntas: [
        { texto: "¿Quiénes son los vértices y quiénes las aristas?",
          opciones: [
            { clave: "b", ok: false, texto: "Vértices: los canales. Aristas: las parcelas.",
              msg: "Al revés. Lo que se tapona es el canal, y el enunciado pregunta cuántas parcelas quedan: lo que se cuenta son vértices y lo que se rompe es una arista. Invertir los papeles obliga a construir el grafo de líneas, y ahí los puentes dejan de significar lo mismo." },
            { clave: "c", ok: false, texto: "Vértices: las parcelas y los canales, en un grafo con dos clases de vértice.",
              msg: "Eso resuelve el problema, pero cambia la pregunta: en ese grafo quitar un vértice de clase canal equivale a quitar la arista del grafo simple, y la cuenta de parcelas hay que filtrarla por clase. El modelo directo es más corto y es el que los dos criterios de la clase suponen." },
            { clave: "a", ok: true, texto: "Vértices: las parcelas. Aristas: los canales.",
              msg: "Correcto. El canal une dos parcelas y no tiene nada adentro, así que es una arista; la parcela es lo que queda a un lado o al otro, así que es un vértice. La bocatoma es una parcela más, la que decide cuál de los dos lados se cuenta." }
          ] },
        { texto: "¿El corte es por vértice o por arista?",
          opciones: [
            { clave: "b", ok: false, texto: "Por vértice: una parcela sin agua es como una parcela que se quita.",
              msg: "No. Una parcela sin agua sigue estando y sigue conectada con sus vecinas por los otros canales; lo que desaparece es el canal taponado. Resolver con el criterio de articulación da una respuesta razonable que el juez rechaza." },
            { clave: "a", ok: true, texto: "Por arista: el enunciado tapona un canal.",
              msg: "Correcto. Lo que se rompe es la conexión, no el punto, así que el criterio es el de puente." }
          ] },
        { texto: "¿Cuál comparación decide?",
          opciones: [
            { clave: "puente", ok: true, texto: COMPARACIONES.puente,
              msg: "Correcto. Con la igualdad la arista estaría en un ciclo: habría un retroceso desde el subárbol de w hasta u mismo, y ese salto cierra un ciclo que contiene la arista, de modo que taponarla no deja a nadie sin agua." },
            { clave: "imposible", ok: false, texto: COMPARACIONES.imposible,
              msg: "Esa comparación nunca se cumple: low[u] ≤ d[u] por definición, porque d[u] es uno de los términos de su mínimo. El que se compara es el low del hijo." },
            { clave: "articulacion", ok: false, texto: COMPARACIONES.articulacion,
              msg: "Esa es la de los puntos de articulación. Admite la igualdad porque el vértice u se quita y el retroceso que llega hasta u deja de servir; en el puente u se queda y ese mismo retroceso cierra un ciclo. Con ≥ saldrían canales de más." }
          ] },
        { texto: "¿Hasta dónde hay que llegar?",
          opciones: [
            { clave: "a", ok: false, texto: "Se para en la profundidad: la respuesta es una cuenta por vértice, en la misma pasada.",
              msg: "La respuesta es por canal, no por parcela, y además pide un tamaño, que no se lee de d ni de low. Hay que saber cuántos vértices quedan a cada lado, y eso sale del árbol." },
            { clave: "b", ok: false, texto: "Se para en la profundidad: la respuesta es la cantidad de aristas marcadas.",
              msg: "Eso contestaría cuántos canales críticos hay. Aquí se pide, por cada canal, el tamaño de uno de los lados, y para eso hace falta contraer." },
            { clave: "d", ok: false, texto: "Hay que calcular los componentes fuertemente conexos.",
              msg: "Los componentes fuertemente conexos son de grafos dirigidos. Este grafo no es dirigido: los canales van en los dos sentidos, y en un grafo no dirigido el equivalente son los componentes 2-arista-conexos." },
            { clave: "c", ok: true, texto: "Hay que contraer y recorrer el árbol de puentes.",
              msg: "Correcto. La pregunta no es local: pide un tamaño por cada lado. Cada nodo del árbol se queda con el número de vértices de su componente, y al quitar una arista del árbol los dos lados son los dos subárboles que resultan, que se miden con una pasada más." }
          ] }
      ]
    },
    {
      titulo: "Torres de radio",
      enunciado: "Una red de torres de radio, con un enlace por cada par de torres que se alcanzan. La red está enlazada de modo que cualquier mensaje llega de una torre a cualquier otra. Una tormenta puede tumbar una torre, y hay que decir, para cada una, en cuántos grupos incomunicados quedaría la red si cayera.",
      preguntas: [
        { texto: "¿Quiénes son los vértices y quiénes las aristas?",
          opciones: [
            { clave: "a", ok: true, texto: "Vértices: las torres. Aristas: los enlaces.",
              msg: "Correcto. La torre es lo que se tumba y lo que queda en un grupo o en otro; el enlace solo une dos torres." },
            { clave: "c", ok: false, texto: "Vértices: las torres, y el grafo es dirigido porque el mensaje viaja en un sentido.",
              msg: "El enunciado dice que el enlace sirve en los dos sentidos: si A alcanza a B, B alcanza a A. El grafo es no dirigido, y por eso vale el teorema que dice que ahí solo hay aristas de árbol y de retroceso." },
            { clave: "b", ok: false, texto: "Vértices: los enlaces. Aristas: las torres.",
              msg: "Al revés. Lo que cae es la torre, y los grupos que quedan son grupos de torres: lo que se quita y lo que se cuenta son vértices." }
          ] },
        { texto: "¿El corte es por vértice o por arista?",
          opciones: [
            { clave: "b", ok: false, texto: "Por arista: tumbar una torre es cortar todos sus enlaces.",
              msg: "Cortar todos los enlaces de una torre no es lo mismo que quitar una arista, y el criterio del puente no lo detecta. Una torre puede ser punto de articulación sin que ninguno de sus enlaces sea puente: pasa cuando dos ciclos se tocan en ella y solo en ella." },
            { clave: "a", ok: true, texto: "Por vértice: el enunciado tumba una torre.",
              msg: "Correcto. Al caer la torre se van con ella todos sus enlaces, así que el criterio es el de articulación." }
          ] },
        { texto: "¿Cuál comparación decide?",
          opciones: [
            { clave: "puente", ok: false, texto: COMPARACIONES.puente,
              msg: "Con la desigualdad estricta se pierden las torres cuyo hijo tiene un retroceso que llega hasta ellas mismas. El > es la prueba del puente, no la de la articulación." },
            { clave: "articulacionSinRaiz", ok: false, texto: COMPARACIONES.articulacionSinRaiz,
              msg: "La comparación es la correcta, la salvedad falta. Para la raíz d[u] = 1 es el valor más bajo que existe y low[w] ≥ 1 se cumple siempre: así la raíz saldría marcada aunque tenga un solo hijo y quitarla no separe nada. La raíz se cuenta por hijos en el árbol, no por vecinos." },
            { clave: "imposible", ok: false, texto: COMPARACIONES.imposible,
              msg: "Esa comparación nunca se cumple: low[u] ≤ d[u] siempre, porque d[u] entra en su propio mínimo. El que se compara es el low del hijo." },
            { clave: "articulacion", ok: true, texto: COMPARACIONES.articulacion,
              msg: "Correcto. La igualdad cuenta: si el subárbol de w vuelve a u pero no sube más, al quitar u ese subárbol queda suelto. Y la raíz se decide aparte porque para ella d[u] = 1 y la desigualdad se cumpliría siempre, con un hijo o con diez." }
          ] },
        { texto: "¿Hasta dónde hay que llegar?",
          opciones: [
            { clave: "b", ok: false, texto: "Se para en la profundidad: la respuesta es la cantidad de aristas marcadas.",
              msg: "Eso contestaría cuántos enlaces críticos hay. Aquí se pregunta por torres, y además por un número de grupos, no por un sí o un no." },
            { clave: "c", ok: false, texto: "Hay que contraer y recorrer el árbol de puentes.",
              msg: "El árbol de puentes corta por aristas y agrupa vértices: un punto de articulación no se ve ahí. Contraer no estorba, pero no responde: la cuenta sale de los hijos, en la misma pasada." },
            { clave: "a", ok: true, texto: "Se para en la profundidad: la respuesta es una cuenta por vértice, en la misma pasada.",
              msg: "Correcto. El número de grupos al quitar u es el número de hijos con low[w] ≥ d[u] más uno, el pedazo que se queda con el padre; para la raíz, su número de hijos. Todo eso se acumula al volver de cada hijo, en la misma profundidad, y no hay nada que contraer." },
            { clave: "d", ok: false, texto: "Hay que calcular los componentes biconexos.",
              msg: "Los componentes biconexos reparten las aristas y una torre que es punto de articulación queda en varios a la vez, así que de ahí no sale de una sola lectura en cuántos grupos se parte la red. La cuenta por hijos la da directa." }
          ] }
      ]
    },
    {
      titulo: "Dique de contención",
      enunciado: "Un dique de contención está formado por tramos que unen compuertas, y desde cualquier compuerta se llega a todas las demás recorriendo tramos. Hay que decir cuántos tramos son los únicos que mantienen unidas a sus dos compuertas, es decir cuántos, al romperse, parten el dique en dos.",
      preguntas: [
        { texto: "¿Quiénes son los vértices y quiénes las aristas?",
          opciones: [
            { clave: "b", ok: false, texto: "Vértices: los tramos. Aristas: las compuertas.",
              msg: "Al revés. Lo que se rompe es el tramo, que es lo que une dos cosas, y eso es una arista." },
            { clave: "a", ok: true, texto: "Vértices: las compuertas. Aristas: los tramos.",
              msg: "Correcto. El tramo une dos compuertas, y lo que se rompe es el tramo." },
            { clave: "c", ok: false, texto: "Vértices: las compuertas, con una arista por cada par de compuertas del dique.",
              msg: "Las aristas son los tramos que existen, no todos los pares posibles. Con el grafo completo nada es puente, porque entre cualquier par hay muchos caminos, y la respuesta saldría siempre cero." }
          ] },
        { texto: "¿El corte es por vértice o por arista?",
          opciones: [
            { clave: "a", ok: true, texto: "Por arista: el enunciado rompe un tramo.",
              msg: "Correcto. El tramo que al romperse parte el dique en dos es, palabra por palabra, la definición de puente." },
            { clave: "b", ok: false, texto: "Por vértice: una compuerta aislada es una compuerta que se quitó.",
              msg: "No. La compuerta se queda donde está; lo que desaparece es el tramo. El criterio es el del puente, con desigualdad estricta." }
          ] },
        { texto: "¿Cuál comparación decide?",
          opciones: [
            { clave: "articulacion", ok: false, texto: COMPARACIONES.articulacion,
              msg: "Esa es la de los puntos de articulación. Con ≥ se marcarían tramos que están en un ciclo: basta un retroceso desde el subárbol de w hasta u mismo para que el tramo tenga alternativa." },
            { clave: "imposible", ok: false, texto: COMPARACIONES.imposible,
              msg: "Esa comparación nunca se cumple: low[u] ≤ d[u] siempre. El que se compara es el low del hijo." },
            { clave: "puente", ok: true, texto: COMPARACIONES.puente,
              msg: "Correcto. Y con una advertencia: si el dique tuviera dos tramos entre las mismas dos compuertas, ninguno de los dos sería puente, porque forman un ciclo de longitud dos. Para que el código no se equivoque ahí, la arista de entrada se descarta comparando su identificador y no preguntando si el vecino es el padre." }
          ] },
        { texto: "¿Hasta dónde hay que llegar?",
          opciones: [
            { clave: "a", ok: false, texto: "Se para en la profundidad: la respuesta es una cuenta por vértice, en la misma pasada.",
              msg: "La pregunta es por tramos, no por compuertas. Una cuenta por vértice contestaría en cuántos pedazos se parte el dique al quitar una compuerta, que es otro problema." },
            { clave: "b", ok: true, texto: "Se para en la profundidad: la respuesta es la cantidad de aristas marcadas.",
              msg: "Correcto. La pregunta es cuántas, así que la única profundidad que marca los puentes ya la contesta. Contraer y armar el árbol daría el mismo número, las aristas del árbol, con dos pasadas de más." },
            { clave: "c", ok: false, texto: "Hay que contraer y recorrer el árbol de puentes.",
              msg: "Daría la respuesta correcta, porque las aristas del árbol son exactamente los puentes, pero cuesta dos pasadas más y ninguna aporta nada: nada se pregunta sobre caminos ni sobre tamaños." },
            { clave: "d", ok: false, texto: "Hay que ordenar los tramos y responder con el menor.",
              msg: "El enunciado pide cuántos, no cuál. Ordenar la lista sirve cuando el juez pide imprimirla, que no es el caso aquí." }
          ] }
      ]
    }
  ];

  /* La opcion correcta de una pregunta. */
  function correcta(escenario, pregunta) {
    var p = ESCENARIOS[escenario].preguntas[pregunta], cual = null, i = 0;
    while (i < p.opciones.length) {
      if (p.opciones[i].ok) { cual = p.opciones[i].clave; }
      i = i + 1;
    }
    return cual;
  }

  function evaluar(escenario, pregunta, clave) {
    var p = ESCENARIOS[escenario].preguntas[pregunta], elegida = null, i = 0;
    while (i < p.opciones.length) {
      if (p.opciones[i].clave === clave) { elegida = p.opciones[i]; }
      i = i + 1;
    }
    return { ok: elegida.ok, msg: elegida.msg };
  }

  return { escenarios: ESCENARIOS, comparaciones: COMPARACIONES,
           correcta: correcta, evaluar: evaluar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var actual = 0, aciertos = [];
    var e0 = 0;
    while (e0 < EJERCICIO.escenarios.length) {
      var fila = [], q0 = 0;
      while (q0 < EJERCICIO.escenarios[e0].preguntas.length) { fila.push(null); q0 = q0 + 1; }
      aciertos.push(fila);
      e0 = e0 + 1;
    }

    function pintar() {
      var e = EJERCICIO.escenarios[actual];
      document.getElementById("num-escenario").textContent =
        (actual + 1) + " de " + EJERCICIO.escenarios.length + ": " + e.titulo;
      document.getElementById("enunciado").textContent = e.enunciado;
      var h = "", q = 0;
      while (q < e.preguntas.length) {
        h += "<div class='pregunta'><b>" + (q + 1) + ". " + e.preguntas[q].texto + "</b>";
        h += "<div class='opciones' id='opciones-" + q + "'>";
        var k = 0;
        while (k < e.preguntas[q].opciones.length) {
          h += "<button type='button' data-pregunta='" + q + "' data-clave='" + e.preguntas[q].opciones[k].clave + "'>" +
               e.preguntas[q].opciones[k].texto + "</button>";
          k = k + 1;
        }
        h += "</div><div class='veredicto' id='veredicto-" + q + "'></div></div>";
        q = q + 1;
      }
      document.getElementById("preguntas").innerHTML = h;
      Array.prototype.forEach.call(document.querySelectorAll("#preguntas button"), function (b) {
        b.addEventListener("click", function () {
          var pq = parseInt(b.getAttribute("data-pregunta"), 10);
          var res = EJERCICIO.evaluar(actual, pq, b.getAttribute("data-clave"));
          var v = document.getElementById("veredicto-" + pq);
          v.className = res.ok ? "veredicto bien" : "veredicto mal";
          v.textContent = res.msg;
          if (aciertos[actual][pq] === null) { aciertos[actual][pq] = res.ok; }
          marcador();
        });
      });
      marcador();
    }

    function marcador() {
      var hechas = 0, buenas = 0, total = 0, i = 0;
      while (i < aciertos.length) {
        var j = 0;
        while (j < aciertos[i].length) {
          total = total + 1;
          if (aciertos[i][j] !== null) {
            hechas = hechas + 1;
            if (aciertos[i][j]) { buenas = buenas + 1; }
          }
          j = j + 1;
        }
        i = i + 1;
      }
      document.getElementById("marcador").textContent =
        "Aciertos a la primera: " + buenas + " de " + hechas + " respondidas, sobre " + total + " preguntas.";
    }

    document.getElementById("btn-anterior").addEventListener("click", function () {
      actual = (actual + EJERCICIO.escenarios.length - 1) % EJERCICIO.escenarios.length;
      pintar();
    });
    document.getElementById("btn-siguiente").addEventListener("click", function () {
      actual = (actual + 1) % EJERCICIO.escenarios.length;
      pintar();
    });
    pintar();
  })();
}
