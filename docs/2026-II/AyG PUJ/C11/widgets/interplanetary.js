/* Ejercicio interactivo: el recorrido que sube de influencia, Interplanetary
   (clase 11). Tarjan marca los puentes; el etiquetado que no los cruza da los
   componentes 2-arista-conexos y la influencia de cada uno; el recorrido desde
   el planeta de arranque cruza un puente solo hacia un componente de mas
   influencia. La simulacion reproduce bridgesAux, getCCAux y dfs de
   interplanetary.py. Los planetas van de 1 a n. */
var EJERCICIO = (function () {
  var GRAFOS = [
    { boton: "Diez planetas, dos salidas del sistema",
      texto: "Un sistema de tres planetas con dos salidas: por una se sube dos veces seguidas, y por la otra hay un vecino que iguala la influencia de partida y detrás de él el planeta más rico del mapa.",
      n: 10,
      aristas: [[1, 2], [2, 3], [1, 3], [1, 4], [4, 5], [5, 6], [6, 7], [7, 4], [5, 8], [2, 9], [9, 10]],
      infl: { 1: 4, 2: 3, 3: 3, 4: 5, 5: 4, 6: 3, 7: 2, 8: 20, 9: 10, 10: 30 },
      ini: 1,
      pos: { 1: [1.1, 1.6], 2: [0.3, 0.5], 3: [1.9, 0.4], 4: [2.0, 2.7], 5: [3.3, 2.9],
             6: [3.5, 1.7], 7: [2.2, 1.5], 8: [4.6, 3.3], 9: [-0.6, -0.6], 10: [-1.5, -1.5] } },
    { boton: "Nueve planetas, el recorrido no sale",
      texto: "Un anillo de cuatro planetas ricos y, en fila detrás de su única salida, dos vecindarios más pobres y el planeta de más influencia de todo el mapa.",
      n: 9,
      aristas: [[1, 2], [2, 3], [3, 4], [4, 1], [3, 5], [5, 6], [6, 7], [5, 7], [6, 8], [8, 9]],
      infl: { 1: 7, 2: 8, 3: 6, 4: 9, 5: 4, 6: 5, 7: 6, 8: 12, 9: 100 },
      ini: 1,
      pos: { 1: [0.0, 2.4], 2: [1.3, 2.6], 3: [1.5, 1.3], 4: [0.2, 1.1], 5: [2.8, 1.1],
             6: [3.8, 1.9], 7: [3.9, 0.4], 8: [4.9, 2.6], 9: [5.9, 3.3] } },
    { boton: "Once planetas, arranque en el medio",
      texto: "Una cadena de cuatro sistemas con el arranque en el segundo: hacia un lado la influencia baja y hacia el otro sube, y después de subir vuelve a bajar.",
      n: 11,
      aristas: [[1, 2], [2, 3], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4], [6, 8], [8, 9], [9, 10], [8, 10], [9, 11]],
      infl: { 1: 3, 2: 2, 3: 2, 4: 5, 5: 1, 6: 3, 7: 3, 8: 4, 9: 6, 10: 8, 11: 10 },
      ini: 5,
      pos: { 1: [-1.4, 2.4], 2: [-1.4, 1.0], 3: [-0.3, 1.7], 4: [0.9, 2.4], 5: [2.1, 2.6],
             6: [2.3, 1.3], 7: [1.0, 1.1], 8: [3.5, 0.7], 9: [4.6, 1.3], 10: [4.4, -0.1],
             11: [5.7, 2.2] } }
  ];

  function construir(n, aristas) {
    var G = [], i = 0;
    while (i <= n) { G.push([]); i = i + 1; }
    i = 0;
    while (i < aristas.length) {
      G[aristas[i][0]].push([aristas[i][1], i]);
      G[aristas[i][1]].push([aristas[i][0], i]);
      i = i + 1;
    }
    return G;
  }

  /* bridgesTarjan de interplanetary.py: la arista de arbol v--w es puente
     cuando low[w] > vis[v]. La arista de entrada se excluye por identificador. */
  function puentes(n, aristas) {
    var G = construir(n, aristas);
    var vis = [], low = [], esPuente = [], reloj = 0, i = 0;
    while (i <= n) { vis.push(0); low.push(0); i = i + 1; }
    i = 0;
    while (i < aristas.length) { esPuente.push(false); i = i + 1; }
    function aux(v, entrada) {
      reloj = reloj + 1;
      vis[v] = reloj;
      low[v] = reloj;
      var j = 0;
      while (j < G[v].length) {
        var w = G[v][j][0], idx = G[v][j][1];
        if (vis[w] === 0) {
          aux(w, idx);
          low[v] = Math.min(low[v], low[w]);
          if (low[w] > vis[v]) { esPuente[idx] = true; }
        } else if (idx !== entrada) {
          low[v] = Math.min(low[v], vis[w]);
        }
        j = j + 1;
      }
    }
    i = 1;
    while (i <= n) { if (vis[i] === 0) { aux(i, -1); } i = i + 1; }
    var lista = [];
    i = 0;
    while (i < aristas.length) { if (esPuente[i]) { lista.push(i); } i = i + 1; }
    return { esPuente: esPuente, lista: lista, vis: vis, low: low, G: G };
  }

  /* getCC de interplanetary.py: etiqueta sin cruzar puentes y suma influencia.
     Los componentes se numeran por el planeta menor que contienen. */
  function componentes(n, aristas, infl, P) {
    var G = P.G, ind = [], listas = [], suma = [], i = 0;
    while (i <= n) { ind.push(-1); i = i + 1; }
    i = 1;
    while (i <= n) {
      if (ind[i] === -1) {
        var k = listas.length, total = 0, pila = [i];
        listas.push([]);
        ind[i] = k;
        while (pila.length > 0) {
          var u = pila.pop(), j = 0;
          listas[k].push(u);
          total = total + infl[u];
          while (j < G[u].length) {
            var v = G[u][j][0], idx = G[u][j][1];
            if (ind[v] === -1 && !P.esPuente[idx]) { ind[v] = k; pila.push(v); }
            j = j + 1;
          }
        }
        suma.push(total);
      }
      i = i + 1;
    }
    i = 0;
    while (i < listas.length) { listas[i].sort(function (a, b) { return a - b; }); i = i + 1; }
    return { ind: ind, listas: listas, suma: suma, total: listas.length };
  }

  /* dfs de interplanetary.py: dentro del componente se anda libre, y el puente
     se cruza solo hacia un componente de mas influencia. */
  function recorrido(n, aristas, infl, P, C, ini) {
    var G = P.G, visto = [], alcanzados = [], i = 0;
    while (i <= n) { visto.push(false); i = i + 1; }
    function dfs(u) {
      visto[u] = true;
      alcanzados.push(u);
      var j = 0;
      while (j < G[u].length) {
        var w = G[u][j][0], idx = G[u][j][1];
        if (!visto[w] && (!P.esPuente[idx] || C.suma[C.ind[u]] < C.suma[C.ind[w]])) { dfs(w); }
        j = j + 1;
      }
    }
    dfs(ini);
    var lista = alcanzados.slice();
    lista.sort(function (a, b) {
      var sa = C.suma[C.ind[a]], sb = C.suma[C.ind[b]];
      return sa !== sb ? sa - sb : (infl[a] !== infl[b] ? infl[a] - infl[b] : a - b);
    });
    return { visto: visto, orden: alcanzados, lista: lista };
  }

  function resolver(p) {
    var P = puentes(p.n, p.aristas);
    var C = componentes(p.n, p.aristas, p.infl, P);
    var R = recorrido(p.n, p.aristas, p.infl, P, C, p.ini);
    return { P: P, C: C, R: R };
  }

  /* Un puente queda en una de tres situaciones: lo cruza el recorrido, lo mira
     y lo rechaza porque la influencia no sube, o nunca llega a mirarlo. */
  function clasificar(A, idx, aristas) {
    var u = aristas[idx][0], v = aristas[idx][1], cual;
    if (A.R.visto[u] && A.R.visto[v]) {
      cual = "cruza";
    } else if (A.R.visto[u] || A.R.visto[v]) {
      cual = "nosube";
    } else {
      cual = "nollega";
    }
    return cual;
  }

  /* El orden en que el recorrido se topa con los puentes: una amplitud sobre el
     arbol de puentes desde el componente del planeta de arranque. */
  function ordenPuentes(A, p) {
    var vecinos = [], i = 0;
    while (i < A.C.total) { vecinos.push([]); i = i + 1; }
    i = 0;
    while (i < A.P.lista.length) {
      var idx = A.P.lista[i];
      var a = A.C.ind[p.aristas[idx][0]], b = A.C.ind[p.aristas[idx][1]];
      vecinos[a].push([b, idx]);
      vecinos[b].push([a, idx]);
      i = i + 1;
    }
    var visto = [], cola = [A.C.ind[p.ini]], orden = [], j = 0;
    i = 0;
    while (i < A.C.total) { visto.push(false); i = i + 1; }
    visto[A.C.ind[p.ini]] = true;
    while (j < cola.length) {
      var c = cola[j], k = 0;
      while (k < vecinos[c].length) {
        if (!visto[vecinos[c][k][0]]) {
          visto[vecinos[c][k][0]] = true;
          orden.push(vecinos[c][k][1]);
          cola.push(vecinos[c][k][0]);
        }
        k = k + 1;
      }
      j = j + 1;
    }
    return orden;
  }

  function nombreComp(C, k) {
    return "{" + C.listas[k].join(", ") + "}";
  }

  /* Por que ese puente se cruza o no, con los dos numeros que lo deciden. */
  function explicarPuente(A, p, idx) {
    var u = p.aristas[idx][0], v = p.aristas[idx][1];
    var desde = A.R.visto[u] ? u : v, hacia = A.R.visto[u] ? v : u;
    var ca = A.C.ind[desde], cb = A.C.ind[hacia];
    var sa = A.C.suma[ca], sb = A.C.suma[cb], cual = clasificar(A, idx, p.aristas), texto;
    if (cual === "cruza") {
      texto = "El recorrido llega a " + desde + " con el componente " + nombreComp(A.C, ca) +
        " de influencia " + sa + ", y al otro lado está " + nombreComp(A.C, cb) + " con " + sb +
        ". Como " + sa + " < " + sb + ", lo cruza y entra a " + nombreComp(A.C, cb) + " entero.";
    } else if (cual === "nosube") {
      texto = "El recorrido llega a " + desde + ", mira el puente y ve " + sb + " al otro lado contra " + sa +
        " de este. La condición pide " + sa + " < " + sb + " y eso es falso" +
        (sa === sb ? ", porque los dos componentes valen lo mismo: la desigualdad es estricta y el empate no basta."
                   : ", así que se queda de este lado.") +
        " Los planetas de " + nombreComp(A.C, cb) + " no se alcanzan.";
    } else {
      var a = A.C.ind[u], b = A.C.ind[v];
      texto = "El recorrido nunca llega a este puente: ni " + nombreComp(A.C, a) + " ni " + nombreComp(A.C, b) +
        " se alcanzan, porque el camino hacia ellos pasa por otro puente que no se cruzó. La condición de este nunca se evalúa" +
        (Math.max(A.C.suma[a], A.C.suma[b]) >= A.C.suma[A.C.ind[p.ini]]
          ? ", y de nada sirve que al otro lado haya influencia de sobra." : ".");
    }
    return texto;
  }

  return { grafos: GRAFOS, construir: construir, puentes: puentes,
           componentes: componentes, recorrido: recorrido, resolver: resolver,
           clasificar: clasificar, ordenPuentes: ordenPuentes,
           nombreComp: nombreComp, explicarPuente: explicarPuente };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var presetActual = 0, A = null, marcaPuente = {}, puentesListos = false;
    var influenciasListas = false, decision = {}, decididos = false;

    function g() { return EJERCICIO.grafos[presetActual]; }

    var COLORES = ["#e3edf8", "#e7f2e8", "#fdf1dc", "#f3e8f8", "#e8f4f4", "#fbe9e7"];
    var BORDES = ["#1f5fa8", "#2e7d32", "#a86a12", "#7b4397", "#2f7a7a", "#b3261e"];

    function dibujar() {
      var p = g(), ancho = 580, alto = 300, r = 16;
      var claves = Object.keys(p.pos);
      var minX = p.pos[claves[0]][0], maxX = minX, minY = p.pos[claves[0]][1], maxY = minY, i = 0;
      while (i < claves.length) {
        var q = p.pos[claves[i]];
        if (q[0] < minX) { minX = q[0]; }
        if (q[0] > maxX) { maxX = q[0]; }
        if (q[1] < minY) { minY = q[1]; }
        if (q[1] > maxY) { maxY = q[1]; }
        i = i + 1;
      }
      var mx = 42, my = 40;
      var esc = Math.min((ancho - 2 * mx) / (maxX - minX), (alto - 2 * my) / (maxY - minY));
      var ox = (ancho - esc * (maxX - minX)) / 2, oy = (alto - esc * (maxY - minY)) / 2;
      function X(k) { return ox + (p.pos[k][0] - minX) * esc; }
      function Y(k) { return oy + (maxY - p.pos[k][1]) * esc; }

      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:620px'>";
      i = 0;
      while (i < p.aristas.length) {
        var u = p.aristas[i][0], v = p.aristas[i][1];
        var puente = puentesListos && A.P.esPuente[i];
        var trazo = "#9aa3ad", grosor = 2.4, guion = "";
        if (puente) {
          trazo = "#b3261e";
          grosor = 3;
          guion = " stroke-dasharray='6,4'";
          if (decididos && EJERCICIO.clasificar(A, i, p.aristas) === "cruza") { trazo = "#2e7d32"; guion = ""; }
        } else if (influenciasListas) {
          trazo = BORDES[A.C.ind[u] % BORDES.length];
          grosor = 2.8;
        }
        svg += "<line x1='" + X(u) + "' y1='" + Y(u) + "' x2='" + X(v) + "' y2='" + Y(v) +
          "' stroke='" + trazo + "' stroke-width='" + grosor + "'" + guion + "/>";
        svg += "<text x='" + ((X(u) + X(v)) / 2) + "' y='" + ((Y(u) + Y(v)) / 2 - 3) +
          "' text-anchor='middle' font-size='9.5' font-family='ui-monospace, monospace' fill='#6b7280' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" + i + "</text>";
        i = i + 1;
      }
      i = 0;
      while (i < claves.length) {
        var w = parseInt(claves[i], 10);
        var relleno = "#ffffff", borde = "#1f5fa8", grueso = 2.4;
        if (influenciasListas) {
          relleno = COLORES[A.C.ind[w] % COLORES.length];
          borde = BORDES[A.C.ind[w] % BORDES.length];
        }
        if (decididos) {
          if (!A.R.visto[w]) { relleno = "#f1f3f6"; borde = "#c8cdd4"; }
          else { grueso = 3.4; }
        }
        if (w === p.ini) { borde = "#b3261e"; grueso = 4; }
        svg += "<circle cx='" + X(w) + "' cy='" + Y(w) + "' r='" + r + "' fill='" + relleno +
          "' stroke='" + borde + "' stroke-width='" + grueso + "'/>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) + 5) + "' text-anchor='middle' font-size='13.5' font-weight='700' fill='#24292f'>" + w + "</text>";
        svg += "<text x='" + X(w) + "' y='" + (Y(w) - r - 5) + "' text-anchor='middle' font-size='10.5' font-family='ui-monospace, monospace' fill='#24292f' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
          p.infl[w] + "</text>";
        if (influenciasListas) {
          svg += "<text x='" + X(w) + "' y='" + (Y(w) + r + 13) + "' text-anchor='middle' font-size='10' fill='" +
            BORDES[A.C.ind[w] % BORDES.length] + "' stroke='#ffffff' stroke-width='3' paint-order='stroke'>" +
            A.C.suma[A.C.ind[w]] + "</text>";
        }
        i = i + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function armarPuentes() {
      var p = g(), h = "", i = 0;
      while (i < p.aristas.length) {
        h += "<div class='barra-fila'><span class='rotulo' style='width:6.5rem;font-family:ui-monospace,monospace'>" +
          i + ": " + p.aristas[i][0] + "–" + p.aristas[i][1] + "</span>" +
          "<span class='opciones' id='pu-" + i + "'>" +
          "<button type='button' data-ar='" + i + "' data-es='si'>es puente</button>" +
          "<button type='button' data-ar='" + i + "' data-es='no'>no es puente</button>" +
          "</span></div>";
        i = i + 1;
      }
      document.getElementById("lista-puentes").innerHTML = h;
      Array.prototype.forEach.call(document.querySelectorAll("#lista-puentes button"), function (b) {
        b.addEventListener("click", function () {
          var k = parseInt(b.getAttribute("data-ar"), 10);
          marcaPuente[k] = b.getAttribute("data-es");
          Array.prototype.forEach.call(document.querySelectorAll("#pu-" + k + " button"), function (x) { x.classList.remove("primario"); });
          b.classList.add("primario");
        });
      });
    }

    function comprobarPuentes() {
      var p = g(), v = document.getElementById("veredicto-puentes"), bien = 0, puestas = 0, h = "", i = 0;
      while (i < p.aristas.length) {
        if (marcaPuente[i] !== undefined) {
          puestas = puestas + 1;
          var ok = (marcaPuente[i] === "si") === A.P.esPuente[i];
          if (ok) { bien = bien + 1; }
          if (!ok) {
            h += "<div class='veredicto mal' style='display:block;margin-top:0.35rem'><b>" + i + ": " +
              p.aristas[i][0] + "–" + p.aristas[i][1] + "</b> " +
              (A.P.esPuente[i]
                ? "sí es puente: low[" + p.aristas[i][1] + "] y low[" + p.aristas[i][0] +
                  "] dicen que el subárbol del otro lado no tiene ninguna arista de retroceso que salte por encima de ella, y al quitarla el grafo se parte."
                : "no es puente: hay otro camino entre sus dos extremos, así que al quitarla el grafo sigue conexo.") + "</div>";
          }
          Array.prototype.forEach.call(document.querySelectorAll("#pu-" + i + " button"), function (x) {
            x.style.borderColor = ok ? "#2e7d32" : "#b3261e";
          });
        }
        i = i + 1;
      }
      if (puestas < p.aristas.length) {
        v.className = "veredicto mal";
        v.textContent = "Faltan " + (p.aristas.length - puestas) + " aristas por clasificar.";
      } else {
        v.className = bien === p.aristas.length ? "veredicto bien" : "veredicto mal";
        v.textContent = bien + " de " + p.aristas.length + " aristas correctas. Los puentes son " +
          A.P.lista.map(function (k) { return p.aristas[k][0] + "–" + p.aristas[k][1]; }).join(", ") + ".";
        if (bien === p.aristas.length) {
          puentesListos = true;
          armarInfluencias();
        }
      }
      document.getElementById("detalle-puentes").innerHTML = h;
      dibujar();
    }

    function armarInfluencias() {
      if (!puentesListos) {
        document.getElementById("entradas-infl").innerHTML =
          "<p class='nota' style='margin-top:0'>Primero clasifique las aristas de arriba.</p>";
      } else {
        var h = "", i = 0;
        while (i < A.C.total) {
          h += "<label class='campo-valor'><span class='mono'>" + EJERCICIO.nombreComp(A.C, i) + "</span>" +
            "<input type='number' id='infl-" + i + "' min='0'></label>";
          i = i + 1;
        }
        document.getElementById("entradas-infl").innerHTML = h;
      }
    }

    function comprobarInfluencias() {
      var v = document.getElementById("veredicto-infl");
      if (!puentesListos) {
        v.className = "veredicto mal";
        v.textContent = "Los componentes salen de los puentes, y los puentes todavía no están.";
      } else {
        var p = g(), bien = 0, vacios = 0, h = "", i = 0;
        while (i < A.C.total) {
          if (isNaN(parseInt(document.getElementById("infl-" + i).value, 10))) { vacios = vacios + 1; }
          i = i + 1;
        }
        if (vacios > 0) {
          v.className = "veredicto mal";
          v.textContent = "Faltan " + vacios + " totales por escribir.";
        } else {
          i = 0;
          while (i < A.C.total) {
            var campo = document.getElementById("infl-" + i);
            var dado = parseInt(campo.value, 10), ok = dado === A.C.suma[i];
            if (ok) { bien = bien + 1; }
            campo.style.borderColor = ok ? "#2e7d32" : "#b3261e";
            campo.style.background = ok ? "#e7f2e8" : "#fbe9e7";
            h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.35rem'><b>" +
              EJERCICIO.nombreComp(A.C, i) + "</b>: " +
              A.C.listas[i].map(function (x) { return p.infl[x]; }).join(" + ") + " = " + A.C.suma[i] +
              (ok ? "." : ", y usted escribió " + dado + ".") + "</div>";
            i = i + 1;
          }
          v.className = bien === A.C.total ? "veredicto bien" : "veredicto mal";
          v.textContent = bien + " de " + A.C.total + " componentes correctos. Bajo cada planeta queda la influencia de su componente.";
          document.getElementById("detalle-infl").innerHTML = h;
          if (bien === A.C.total) {
            influenciasListas = true;
            armarDecisiones();
          }
          dibujar();
        }
      }
    }

    function armarDecisiones() {
      if (!influenciasListas) {
        document.getElementById("decisiones").innerHTML =
          "<p class='nota' style='margin-top:0'>Primero escriba la influencia de cada componente.</p>";
      } else {
        var p = g(), orden = EJERCICIO.ordenPuentes(A, p), h = "", i = 0;
        decision = {};
        while (i < orden.length) {
          var idx = orden[i];
          h += "<div class='barra-fila'><span class='rotulo' style='width:6.5rem;font-family:ui-monospace,monospace'>" +
            p.aristas[idx][0] + "–" + p.aristas[idx][1] + "</span>" +
            "<span class='opciones' id='de-" + idx + "'>" +
            "<button type='button' data-ar='" + idx + "' data-q='cruza'>la cruza</button>" +
            "<button type='button' data-ar='" + idx + "' data-q='nosube'>la mira y no la cruza</button>" +
            "<button type='button' data-ar='" + idx + "' data-q='nollega'>no llega a mirarla</button>" +
            "</span></div>";
          i = i + 1;
        }
        document.getElementById("decisiones").innerHTML = h;
        Array.prototype.forEach.call(document.querySelectorAll("#decisiones button"), function (b) {
          b.addEventListener("click", function () {
            var k = parseInt(b.getAttribute("data-ar"), 10);
            decision[k] = b.getAttribute("data-q");
            Array.prototype.forEach.call(document.querySelectorAll("#de-" + k + " button"), function (x) { x.classList.remove("primario"); });
            b.classList.add("primario");
          });
        });
      }
    }

    function comprobarDecisiones() {
      var v = document.getElementById("veredicto-decisiones");
      if (!influenciasListas) {
        v.className = "veredicto mal";
        v.textContent = "La decisión se toma con la influencia de los dos componentes, y falta calcularla.";
      } else {
        var p = g(), bien = 0, puestas = 0, h = "", i = 0;
        while (i < A.P.lista.length) {
          var idx = A.P.lista[i], real = EJERCICIO.clasificar(A, idx, p.aristas);
          if (decision[idx] !== undefined) {
            puestas = puestas + 1;
            var ok = decision[idx] === real;
            if (ok) { bien = bien + 1; }
            h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.35rem'><b>" +
              p.aristas[idx][0] + "–" + p.aristas[idx][1] + "</b>: " +
              EJERCICIO.explicarPuente(A, p, idx) + "</div>";
          }
          i = i + 1;
        }
        v.className = puestas === A.P.lista.length && bien === A.P.lista.length ? "veredicto bien" : "veredicto mal";
        v.textContent = bien + " de " + A.P.lista.length + " puentes bien clasificados, con " + puestas + " respondidos. " +
          (puestas === A.P.lista.length
            ? "El recorrido alcanza " + A.R.orden.length + " de los " + p.n + " planetas; los que quedan en gris no se alcanzan."
            : "Falta decidir " + (A.P.lista.length - puestas) + ".");
        document.getElementById("detalle-decisiones").innerHTML = h;
        if (puestas === A.P.lista.length) { decididos = true; }
        dibujar();
      }
    }

    function comprobarSalida() {
      var v = document.getElementById("veredicto-salida"), p = g();
      var texto = document.getElementById("salida").value.trim();
      var dada = texto.length === 0 ? [] : texto.split(/[\s,]+/).map(function (x) { return parseInt(x, 10); });
      var esperada = A.R.lista, igual = dada.length === esperada.length, i = 0;
      while (i < esperada.length) { if (dada[i] !== esperada[i]) { igual = false; } i = i + 1; }
      var mismoConjunto = dada.length === esperada.length &&
        dada.slice().sort(function (a, b) { return a - b; }).join(",") === esperada.slice().sort(function (a, b) { return a - b; }).join(",");
      if (dada.some(isNaN) || dada.length === 0) {
        v.className = "veredicto mal";
        v.textContent = "Escriba los números de los planetas separados por espacios.";
      } else if (igual) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + esperada.join(" ") + ". " +
          esperada.map(function (x) { return x + " (" + A.C.suma[A.C.ind[x]] + ", " + p.infl[x] + ")"; }).join("  ") +
          ". Las parejas son la influencia del componente y la propia, y el número rompe los empates.";
      } else if (mismoConjunto) {
        v.className = "veredicto mal";
        v.textContent = "Los planetas son esos, pero el orden va por influencia del componente, después por influencia propia y al final por número: " +
          esperada.join(" ") + ". Dentro de un mismo componente todos comparten el primer campo, así que ahí manda la influencia propia.";
      } else {
        var sobran = dada.filter(function (x) { return esperada.indexOf(x) < 0; });
        var faltan = esperada.filter(function (x) { return dada.indexOf(x) < 0; });
        v.className = "veredicto mal";
        v.textContent = "No coincide. " +
          (sobran.length > 0 ? "Sobran " + sobran.join(", ") + ": el recorrido no llega allá. " : "") +
          (faltan.length > 0 ? "Faltan " + faltan.join(", ") + ". " : "") +
          "La lista es " + esperada.join(" ") + ".";
      }
    }

    function armar() {
      var p = g();
      A = EJERCICIO.resolver(p);
      marcaPuente = {};
      decision = {};
      puentesListos = false;
      influenciasListas = false;
      decididos = false;
      document.getElementById("ver-texto").textContent = p.texto;
      document.getElementById("ver-datos").textContent =
        p.n + " planetas y " + p.aristas.length + " rutas; arranque en el " + p.ini + ". Influencia: " +
        Object.keys(p.infl).map(function (k) { return k + ":" + p.infl[k]; }).join("  ");
      armarPuentes();
      armarInfluencias();
      armarDecisiones();
      document.getElementById("detalle-puentes").innerHTML = "";
      document.getElementById("detalle-infl").innerHTML = "";
      document.getElementById("detalle-decisiones").innerHTML = "";
      document.getElementById("salida").value = "";
      document.getElementById("prediccion").value = "";
      ["veredicto-prediccion", "veredicto-puentes", "veredicto-infl", "veredicto-decisiones", "veredicto-salida"].forEach(function (id) {
        var v = document.getElementById(id);
        v.className = "veredicto";
        v.textContent = "";
      });
      dibujar();
    }

    document.getElementById("btn-puentes").addEventListener("click", comprobarPuentes);
    document.getElementById("btn-infl").addEventListener("click", comprobarInfluencias);
    document.getElementById("btn-decisiones").addEventListener("click", comprobarDecisiones);
    document.getElementById("btn-salida").addEventListener("click", comprobarSalida);
    document.getElementById("btn-prediccion").addEventListener("click", function () {
      var valor = parseInt(document.getElementById("prediccion").value, 10);
      var v = document.getElementById("veredicto-prediccion"), p = g();
      var total = A.R.orden.length;
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (valor === total) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: " + total + " de " + p.n + ". El recorrido empieza en el componente del planeta " + p.ini +
          " y solo sale de él por puentes que llevan a más influencia.";
      } else if (valor === p.n) {
        v.className = "veredicto mal";
        v.textContent = "Ese es el total de planetas. El recorrido alcanza " + total +
          ": cada puente que no sube de influencia deja un trozo del mapa afuera, y con él todo lo que está detrás.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No coincide: son " + total + ". Agrupe los planetas que no quedan separados por un puente, sume la influencia de cada grupo y siga la cadena desde el " +
          p.ini + " hacia los grupos de más influencia.";
      }
    });
    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        armar();
      });
    });
    armar();
  })();
}
