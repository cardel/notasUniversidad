/* Ejercicio interactivo: tres errores sobre cuadriculas (clase 7).
   Cada caso corre la version con el error y la correcta sobre el mismo
   laberinto y muestra las dos salidas. */
var EJERCICIO = (function () {
  var DR = [1, -1, 0, 0], DC = [0, 0, 1, -1];
  var LAB = ["S...", "#...", "#...", "#..C"];

  function buscar(lab, letra) {
    var i = 0;
    while (i < lab.length) { var j = lab[i].indexOf(letra); if (j >= 0) { return [i, j]; } i = i + 1; }
    return null;
  }
  function tabla(R, C, v) { var t = []; var i = 0; while (i < R) { t.push([]); var j = 0; while (j < C) { t[i].push(v); j = j + 1; } i = i + 1; } return t; }

  /* Python: lab[-1] es la ultima fila. Se imita el indice negativo. */
  function celdaPython(lab, r, c) {
    var R = lab.length, C = lab[0].length;
    if (r >= R || c >= C || r < -R || c < -C) { return null; }   // IndexError
    var rr = r < 0 ? R + r : r, cc = c < 0 ? C + c : c;
    return lab[rr].charAt(cc);
  }

  function bfs(lab, esLibre, limite) {
    var R = lab.length, C = lab[0].length;
    var s = buscar(lab, "S"), f = buscar(lab, "C");
    var d = tabla(R, C, -1);
    d[s[0]][s[1]] = 0;
    var cola = [s], h = 0, vueltas = 0;
    while (h < cola.length && vueltas < limite) {
      var r = cola[h][0], c = cola[h][1]; h = h + 1; vueltas = vueltas + 1;
      var k = 0;
      while (k < 4) {
        var nr = r + DR[k], nc = c + DC[k];
        if (esLibre(lab, nr, nc)) {
          var rr = nr < 0 ? R + nr : nr, cc = nc < 0 ? C + nc : nc;   // como lo haria Python
          if (d[rr][cc] === -1) { d[rr][cc] = d[r][c] + 1; cola.push([rr, cc]); }
        }
        k = k + 1;
      }
    }
    return { d: d, respuesta: d[f[0]][f[1]], vueltas: vueltas, agotada: h >= cola.length };
  }

  function libreBien(lab, r, c) {
    return r >= 0 && r < lab.length && c >= 0 && c < lab[0].length && lab[r].charAt(c) !== "#";
  }
  function libreSinRango(lab, r, c) {
    var ch = celdaPython(lab, r, c);
    return ch !== null && ch !== "#";
  }

  /* BFS que olvida la comprobacion de -1: cada celda vuelve a la cola. */
  function bfsSinMarca(lab, limite) {
    var R = lab.length, C = lab[0].length;
    var s = buscar(lab, "S"), f = buscar(lab, "C");
    var d = tabla(R, C, -1);
    d[s[0]][s[1]] = 0;
    var cola = [s], h = 0, vueltas = 0;
    while (h < cola.length && vueltas < limite) {
      var r = cola[h][0], c = cola[h][1]; h = h + 1; vueltas = vueltas + 1;
      var k = 0;
      while (k < 4) {
        var nr = r + DR[k], nc = c + DC[k];
        if (libreBien(lab, nr, nc)) { d[nr][nc] = d[r][c] + 1; cola.push([nr, nc]); }
        k = k + 1;
      }
    }
    return { respuesta: d[f[0]][f[1]], vueltas: vueltas, agotada: h >= cola.length, enCola: cola.length - h };
  }

  /* DFS que anota la profundidad de la primera llegada como si fuera distancia. */
  function dfsDistancia(lab) {
    var R = lab.length, C = lab[0].length;
    var s = buscar(lab, "S"), f = buscar(lab, "C");
    var d = tabla(R, C, -1);
    function ir(r, c, nivel) {
      d[r][c] = nivel;
      var k = 0;
      while (k < 4) {
        var nr = r + DR[k], nc = c + DC[k];
        if (libreBien(lab, nr, nc) && d[nr][nc] === -1) { ir(nr, nc, nivel + 1); }
        k = k + 1;
      }
    }
    ir(s[0], s[1], 0);
    return d[f[0]][f[1]];
  }

  return { LAB: LAB, bfs: bfs, libreBien: libreBien, libreSinRango: libreSinRango,
           bfsSinMarca: bfsSinMarca, dfsDistancia: dfsDistancia, buscar: buscar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var LAB = EJERCICIO.LAB;
    function lista(a) { return "[" + a.join(", ") + "]"; }
    var bien = EJERCICIO.bfs(LAB, EJERCICIO.libreBien, 100000);
    var SALIDAS = {
      rango: function () {
        var mal = EJERCICIO.bfs(LAB, EJERCICIO.libreSinRango, 100000);
        return "<b>Con el error:</b> el café queda a <b>" + mal.respuesta + "</b> pasos. Un índice −1 no falla en " +
          "Python: <code>lab[-1]</code> es la última fila y <code>lab[r][-1]</code> la última columna, así que el simio " +
          "sale por un borde y entra por el opuesto. Desde (0,0) pasa a (0,3) y de ahí a (3,3), el café.<br>" +
          "<b>Corregido:</b> <b>" + bien.respuesta + "</b> pasos. La comprobación de rango va antes de leer la celda, y " +
          "en Python no es opcional: un índice negativo no es un error, es otra celda.";
      },
      marca: function () {
        var mal = EJERCICIO.bfsSinMarca(LAB, 5000);
        return "<b>Con el error:</b> se detuvo por el tope de 5000 vueltas con " + mal.enCola + " celdas todavía en la cola, y " +
          "<code>d</code> se reescribe cada vez que una celda vuelve a entrar. Sin la comprobación de −1 el recorrido no termina.<br>" +
          "<b>Corregido:</b> " + bien.vueltas + " vueltas, una por celda alcanzable, y " + bien.respuesta + " pasos.";
      },
      dfs: function () {
        var mal = EJERCICIO.dfsDistancia(LAB);
        return "<b>Con el error:</b> la profundidad anota <b>" + mal + "</b> para el café: es la longitud del camino que la " +
          "profundidad tomó, no del más corto.<br><b>Corregido:</b> la amplitud da <b>" + bien.respuesta + "</b>. La profundidad " +
          "dice si se llega; cuántos pasos, solo la amplitud.";
      }
    };
    var RESPUESTAS = {
      rango: { correcta: "b", pistas: {
        a: "El != es correcto: la pared es el único carácter que bloquea.",
        b: "Correcto: falta comprobar 0 ≤ r < R y 0 ≤ c < C antes de leer la celda.",
        c: "La tabla de desplazamientos está bien: son los cuatro movimientos." } },
      marca: { correcta: "a", pistas: {
        a: "Correcto: sin preguntar si d[nr][nc] == -1, cada celda vuelve a entrar a la cola por cada vecino, sin fin.",
        b: "La cola se usa bien: se saca por el frente.",
        c: "La distancia se calcularía bien si el ciclo terminara; el problema es que no termina." } },
      dfs: { correcta: "c", pistas: {
        a: "La marca está bien puesta: al entrar.",
        b: "La recursión está bien planteada; llega a todo lo alcanzable.",
        c: "Correcto: la profundidad no recorre por capas, así que el nivel al que llega a una celda no es su distancia mínima." } }
    };
    Array.prototype.forEach.call(document.querySelectorAll(".caso"), function (caso) {
      var clave = caso.getAttribute("data-caso");
      Array.prototype.forEach.call(caso.querySelectorAll(".opciones button"), function (btn) {
        btn.addEventListener("click", function () {
          var op = btn.getAttribute("data-op");
          var v = caso.querySelector(".veredicto");
          var ok = op === RESPUESTAS[clave].correcta;
          v.className = ok ? "veredicto bien" : "veredicto mal";
          v.innerHTML = RESPUESTAS[clave].pistas[op];
          if (ok) { var s = caso.querySelector(".salida"); s.innerHTML = SALIDAS[clave](); s.style.display = "block"; }
        });
      });
    });
    document.getElementById("panel-lab").innerHTML = "<pre>" + LAB.join("\n") + "</pre>";
  })();
}
