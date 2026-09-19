/* Ejercicio interactivo: los cuatro errores que mas cuestan (clase 6).
   Cada caso corre las dos versiones y muestra la diferencia. */
var EJERCICIO = (function () {
  var ARISTAS = [[0, 2], [0, 3], [1, 2], [1, 5], [2, 3], [2, 4], [4, 5]];
  var N = 6;

  function construir(n, aristas, conVuelta) {
    var G = [];
    var u = 0;
    while (u < n) { G.push([]); u = u + 1; }
    var i = 0;
    while (i < aristas.length) {
      G[aristas[i][0]].push(aristas[i][1]);
      if (conVuelta) { G[aristas[i][1]].push(aristas[i][0]); }
      i = i + 1;
    }
    u = 0;
    while (u < n) { G[u].sort(function (a, b) { return a - b; }); u = u + 1; }
    return G;
  }

  /* Reproduce el efecto de G = [[]] * n en Python: n referencias a la
     misma lista. */
  function construirAliasado(n, aristas) {
    var unica = [];
    var G = [];
    var u = 0;
    while (u < n) { G.push(unica); u = u + 1; }
    var i = 0;
    while (i < aristas.length) {
      G[aristas[i][0]].push(aristas[i][1]);
      G[aristas[i][1]].push(aristas[i][0]);
      i = i + 1;
    }
    return G;
  }

  function dfsOrden(G, s) {
    var visitado = [];
    var t = 0;
    while (t < G.length) { visitado.push(false); t = t + 1; }
    var orden = [];
    function ir(u) {
      visitado[u] = true;
      orden.push(u);
      var i = 0;
      while (i < G[u].length) {
        if (!visitado[G[u][i]]) { ir(G[u][i]); }
        i = i + 1;
      }
    }
    ir(s);
    return orden;
  }

  function dfsCompleto(G) {
    var visitado = [];
    var t = 0;
    while (t < G.length) { visitado.push(false); t = t + 1; }
    var orden = [];
    function ir(u) {
      visitado[u] = true;
      orden.push(u);
      var i = 0;
      while (i < G[u].length) {
        if (!visitado[G[u][i]]) { ir(G[u][i]); }
        i = i + 1;
      }
    }
    var u = 0;
    while (u < G.length) {
      if (!visitado[u]) { ir(u); }
      u = u + 1;
    }
    return orden;
  }

  /* BFS correcta: marca al encolar. */
  function bfsBien(G, s) {
    var d = [];
    var t = 0;
    while (t < G.length) { d.push(-1); t = t + 1; }
    d[s] = 0;
    var cola = [s];
    var k = 0;
    var orden = [];
    var maxCola = 1;
    while (k < cola.length) {
      var u = cola[k];
      k = k + 1;
      orden.push(u);
      var i = 0;
      while (i < G[u].length) {
        if (d[G[u][i]] === -1) {
          d[G[u][i]] = d[u] + 1;
          cola.push(G[u][i]);
          if (cola.length - k > maxCola) { maxCola = cola.length - k; }
        }
        i = i + 1;
      }
    }
    return { orden: orden, d: d, encolados: cola.length, maxCola: maxCola };
  }

  /* BFS con la marca puesta al desencolar. */
  function bfsMal(G, s) {
    var visitado = [];
    var t = 0;
    while (t < G.length) { visitado.push(false); t = t + 1; }
    var d = [];
    t = 0;
    while (t < G.length) { d.push(-1); t = t + 1; }
    d[s] = 0;
    var cola = [s];
    var k = 0;
    var orden = [];
    var maxCola = 1;
    while (k < cola.length) {
      var u = cola[k];
      k = k + 1;
      if (!visitado[u]) {
        visitado[u] = true;
        orden.push(u);
        var i = 0;
        while (i < G[u].length) {
          if (!visitado[G[u][i]]) {
            if (d[G[u][i]] === -1) { d[G[u][i]] = d[u] + 1; }
            cola.push(G[u][i]);
            if (cola.length - k > maxCola) { maxCola = cola.length - k; }
          }
          i = i + 1;
        }
      }
      i = 0;
    }
    return { orden: orden, d: d, encolados: cola.length, maxCola: maxCola };
  }

  return { ARISTAS: ARISTAS, N: N, construir: construir,
           construirAliasado: construirAliasado, dfsOrden: dfsOrden,
           dfsCompleto: dfsCompleto, bfsBien: bfsBien, bfsMal: bfsMal };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function lista(a) { return "[" + a.join(", ") + "]"; }
    function listaDeListas(G) {
      var t = "[";
      var u = 0;
      while (u < G.length) {
        t = t + lista(G[u]) + (u < G.length - 1 ? ", " : "");
        u = u + 1;
      }
      return t + "]";
    }

    var N = EJERCICIO.N;
    var A = EJERCICIO.ARISTAS;
    var bien = EJERCICIO.construir(N, A, true);
    var sinVuelta = EJERCICIO.construir(N, A, false);
    var aliasado = EJERCICIO.construirAliasado(3, [[0, 1], [1, 2]]);
    var H3 = [[2, 3], [0], [4], [2, 5], [1], [4], [0]];

    var SALIDAS = {
      vuelta: function () {
        return "<b>Con el error:</b> <code>" + listaDeListas(sinVuelta) +
          "</code><br>Recorrido desde el 0: <code>" +
          lista(EJERCICIO.dfsOrden(sinVuelta, 0)) + "</code> — " +
          EJERCICIO.dfsOrden(sinVuelta, 0).length + " vértices.<br><br>" +
          "<b>Corregido:</b> <code>" + listaDeListas(bien) + "</code><br>" +
          "Recorrido desde el 0: <code>" + lista(EJERCICIO.dfsOrden(bien, 0)) +
          "</code> — " + EJERCICIO.dfsOrden(bien, 0).length + " vértices.";
      },
      alias: function () {
        return "<b>Con el error</b>, sobre un grafo de 3 vértices y las aristas " +
          "(0,1) y (1,2): <code>" + listaDeListas(aliasado) + "</code><br>" +
          "Las tres filas son la <b>misma</b> lista: cada <code>append</code> " +
          "las cambia todas.<br><br><b>Corregido</b> con un ciclo que agrega " +
          "una lista nueva por vértice: <code>" +
          listaDeListas(EJERCICIO.construir(3, [[0, 1], [1, 2]], true)) + "</code>";
      },
      marca: function () {
        var mal = EJERCICIO.bfsMal(bien, 0);
        var ok = EJERCICIO.bfsBien(bien, 0);
        return "<b>Con el error:</b> entran " + mal.encolados + " vértices a la " +
          "cola y llega a tener " + mal.maxCola + " a la vez.<br>" +
          "<b>Corregido:</b> entran " + ok.encolados + " y el máximo es " +
          ok.maxCola + ".<br><br>El orden y las distancias salen iguales en este " +
          "grafo —<code>" + lista(ok.orden) + "</code>, <code>" + lista(ok.d) +
          "</code>—, y por eso el error pasa las pruebas pequeñas. Lo que crece " +
          "es la cola: en un grafo grande esa diferencia es la memoria del " +
          "programa.";
      },
      externo: function () {
        return "<b>Con el error</b>, sobre H3 (7 vértices, dirigido): " +
          "<code>" + lista(EJERCICIO.dfsOrden(H3, 0)) + "</code> — " +
          EJERCICIO.dfsOrden(H3, 0).length + " vértices.<br>" +
          "<b>Corregido</b> con el ciclo externo: <code>" +
          lista(EJERCICIO.dfsCompleto(H3)) + "</code> — " +
          EJERCICIO.dfsCompleto(H3).length + " vértices.<br><br>" +
          "Al 6 no entra ninguna arista, así que ningún recorrido que arranque " +
          "en el 0 puede tocarlo.";
      }
    };

    var RESPUESTAS = {
      vuelta: {
        correcta: "b",
        pistas: {
          a: "El ciclo está bien: recorre las aristas una vez cada una.",
          b: "Correcto: en un grafo no dirigido la arista {u,v} tiene que " +
             "aparecer en las dos listas. Como está, el grafo quedó dirigido.",
          c: "Ordenar los vecinos no es obligatorio; solo fija el orden de " +
             "visita. El problema es otro."
        }
      },
      alias: {
        correcta: "c",
        pistas: {
          a: "El rango está bien: n listas para n vértices.",
          b: "No hace falta: la lista de un vértice sin aristas queda vacía y " +
             "eso es correcto.",
          c: "Correcto: <code>[[]] * n</code> repite la <b>misma</b> lista n " +
             "veces. Hay que crear una lista nueva por vértice."
        }
      },
      marca: {
        correcta: "a",
        pistas: {
          a: "Correcto: la marca va al encolar. Si se pone al desencolar, un " +
             "vértice con varios vecinos entra a la cola una vez por cada uno.",
          b: "La cola está bien usada: se saca por el frente, que es lo que " +
             "hace el recorrido por capas.",
          c: "La distancia se calcula bien; el problema es cuántas veces entra " +
             "cada vértice a la cola."
        }
      },
      externo: {
        correcta: "b",
        pistas: {
          a: "La recursión está bien planteada.",
          b: "Correcto: falta el ciclo que recorra todos los vértices y arranque " +
             "un recorrido nuevo en cada uno que siga sin marcar.",
          c: "Marcar al entrar es lo correcto; ese no es el problema."
        }
      }
    };

    Array.prototype.forEach.call(document.querySelectorAll(".caso"), function (caso) {
      var clave = caso.getAttribute("data-caso");
      Array.prototype.forEach.call(caso.querySelectorAll(".opciones button"), function (btn) {
        btn.addEventListener("click", function () {
          var op = btn.getAttribute("data-op");
          var v = caso.querySelector(".veredicto");
          var esCorrecta = op === RESPUESTAS[clave].correcta;
          v.className = esCorrecta ? "veredicto bien" : "veredicto mal";
          v.innerHTML = RESPUESTAS[clave].pistas[op];
          if (esCorrecta) {
            caso.querySelector(".salida").innerHTML = SALIDAS[clave]();
            caso.querySelector(".salida").style.display = "block";
          }
        });
      });
    });
  })();
}
