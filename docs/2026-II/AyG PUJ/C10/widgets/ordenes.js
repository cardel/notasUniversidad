/* Ejercicio interactivo: cuales listas son ordenes topologicos (clase 10).
   Los tiempos d y f son los de la funcion tiempos del codigo de la clase
   (el reloj avanza al entrar y al salir, de 1 a 2|V|). */
/* Dibujo de grafos dirigidos en SVG, con nombres de vertice y anotaciones. */
var DIB = (function () {
  var COL = {
    gris: "#6b7280", azul: "#1f5fa8", verde: "#2e7d32", rojo: "#b3261e",
    ambar: "#e8a13d", morado: "#6b3fa0", claro: "#c4cad3"
  };
  var RY = 16;

  function rxDe(nombre) {
    var r = 3.2 * nombre.length + 8;
    return r < 18 ? 18 : r;
  }

  /* o.pos, o.G, o.nombres; o.nodo(i) -> {relleno, borde, tinta, grueso, nota, notaColor};
     o.arista(u, v) -> {color, grueso, trazo}. */
  function dibujar(o) {
    var pos = o.pos, G = o.G, nom = o.nombres, n = pos.length;
    var ancho = 560, alto = o.alto || 300, mx = 56, my = 40;
    var minX = pos[0][0], maxX = pos[0][0], minY = pos[0][1], maxY = pos[0][1], i = 0;
    while (i < n) {
      if (pos[i][0] < minX) { minX = pos[i][0]; }
      if (pos[i][0] > maxX) { maxX = pos[i][0]; }
      if (pos[i][1] < minY) { minY = pos[i][1]; }
      if (pos[i][1] > maxY) { maxY = pos[i][1]; }
      i = i + 1;
    }
    function X(k) { return mx + (pos[k][0] - minX) / (maxX - minX) * (ancho - 2 * mx); }
    function Y(k) { return my + (maxY - pos[k][1]) / (maxY - minY) * (alto - 2 * my); }
    function existe(p, q) {
      var j = 0, hay = false;
      while (j < G[p].length) { if (G[p][j] === q) { hay = true; } j = j + 1; }
      return hay;
    }
    /* Distancia del centro al borde de la elipse en la direccion (ux, uy). */
    function borde(k, ux, uy) {
      var a = rxDe(nom[k]);
      return 1 / Math.sqrt((ux / a) * (ux / a) + (uy / RY) * (uy / RY));
    }

    var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:640px'>";
    svg += "<defs>";
    var c;
    for (c in COL) {
      svg += "<marker id='ah-" + c + "' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'>" +
             "<path d='M0,0 L0,6 L9,3 z' fill='" + COL[c] + "'/></marker>";
    }
    svg += "</defs>";

    var u = 0, j;
    while (u < n) {
      j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        var e = o.arista(u, v);
        var dash = e.trazo ? " stroke-dasharray='" + e.trazo + "'" : "";
        var x1 = X(u), y1 = Y(u), x2 = X(v), y2 = Y(v);
        var dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
        var pie = "' fill='none' stroke='" + COL[e.color] + "' stroke-width='" + e.grueso + "'" + dash +
                  " marker-end='url(#ah-" + e.color + ")'/>";
        if (existe(v, u)) {
          var cx = (x1 + x2) / 2 - dy / dd * 26, cy = (y1 + y2) / 2 + dx / dd * 26;
          var l1 = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1));
          var l2 = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));
          var a1 = borde(u, (cx - x1) / l1, (cy - y1) / l1) + 2;
          var a2 = borde(v, (cx - x2) / l2, (cy - y2) / l2) + 5;
          svg += "<path d='M" + (x1 + (cx - x1) / l1 * a1) + "," + (y1 + (cy - y1) / l1 * a1) +
                 " Q" + cx + "," + cy + " " + (x2 + (cx - x2) / l2 * a2) + "," + (y2 + (cy - y2) / l2 * a2) + pie;
        } else {
          var b1 = borde(u, dx / dd, dy / dd) + 2;
          var b2 = borde(v, -dx / dd, -dy / dd) + 5;
          svg += "<path d='M" + (x1 + dx / dd * b1) + "," + (y1 + dy / dd * b1) +
                 " L" + (x2 - dx / dd * b2) + "," + (y2 - dy / dd * b2) + pie;
        }
        j = j + 1;
      }
      u = u + 1;
    }
    u = 0;
    while (u < n) {
      var s = o.nodo(u);
      svg += "<ellipse cx='" + X(u) + "' cy='" + Y(u) + "' rx='" + rxDe(nom[u]) + "' ry='" + RY +
             "' fill='" + s.relleno + "' stroke='" + s.borde + "' stroke-width='" + (s.grueso || 2.2) + "'/>";
      svg += "<text x='" + X(u) + "' y='" + (Y(u) + 4) + "' text-anchor='middle' font-size='11.5' font-weight='700' fill='" +
             (s.tinta || "#24292f") + "'>" + nom[u] + "</text>";
      if (s.nota) {
        svg += "<text x='" + X(u) + "' y='" + (Y(u) - RY - 4) + "' text-anchor='middle' font-size='11' font-weight='700' fill='" +
               (s.notaColor || "#1f5fa8") + "'>" + s.nota + "</text>";
      }
      u = u + 1;
    }
    svg += "</svg>";
    return svg;
  }
  return { dibujar: dibujar, COL: COL };
})();

var EJERCICIO = (function () {
  function tiempos(G) {
    var n = G.length, color = [], d = [], f = [], reloj = 0, u = 0;
    while (u < n) { color.push(0); d.push(0); f.push(0); u = u + 1; }
    function visit(w) {
      color[w] = 1; reloj = reloj + 1; d[w] = reloj;
      var j = 0;
      while (j < G[w].length) { if (color[G[w][j]] === 0) { visit(G[w][j]); } j = j + 1; }
      color[w] = 2; reloj = reloj + 1; f[w] = reloj;
    }
    u = 0;
    while (u < n) { if (color[u] === 0) { visit(u); } u = u + 1; }
    return { d: d, f: f };
  }

  function posiciones(n, orden) {
    var pos = [], i = 0;
    while (i < n) { pos.push(-1); i = i + 1; }
    i = 0;
    while (i < orden.length) { pos[orden[i]] = i; i = i + 1; }
    return pos;
  }

  /* Primera flecha u -> v que queda al reves, o null si el orden sirve. */
  function violacion(G, orden) {
    var n = G.length, pos = posiciones(n, orden), u = 0, hallada = null;
    while (u < n && hallada === null) {
      var j = 0;
      while (j < G[u].length && hallada === null) {
        if (pos[u] > pos[G[u][j]]) { hallada = [u, G[u][j]]; }
        j = j + 1;
      }
      u = u + 1;
    }
    return hallada;
  }

  function esOrden(G, orden) {
    return orden.length === G.length && violacion(G, orden) === null;
  }

  function ordenarPor(n, clave, decreciente) {
    var v = [], i = 0;
    while (i < n) { v.push(i); i = i + 1; }
    v.sort(function (a, b) { return decreciente ? clave[b] - clave[a] : clave[a] - clave[b]; });
    return v;
  }

  /* Kahn: se quita una fuente a la vez; modo "menor" o "mayor" escoge entre las fuentes. */
  function kahn(G, modo) {
    var n = G.length, entra = [], i = 0, u, j;
    while (i < n) { entra.push(0); i = i + 1; }
    u = 0;
    while (u < n) { j = 0; while (j < G[u].length) { entra[G[u][j]] = entra[G[u][j]] + 1; j = j + 1; } u = u + 1; }
    var listas = [], orden = [];
    u = 0;
    while (u < n) { if (entra[u] === 0) { listas.push(u); } u = u + 1; }
    while (listas.length > 0) {
      listas.sort(function (a, b) { return a - b; });
      var w = modo === "menor" ? listas.shift() : listas.pop();
      orden.push(w);
      j = 0;
      while (j < G[w].length) {
        entra[G[w][j]] = entra[G[w][j]] - 1;
        if (entra[G[w][j]] === 0) { listas.push(G[w][j]); }
        j = j + 1;
      }
    }
    return orden;
  }

  function mismos(a, b) {
    var ok = a.length === b.length, i = 0;
    while (i < a.length && ok) { if (a[i] !== b[i]) { ok = false; } i = i + 1; }
    return ok;
  }

  /* Las seis propuestas de un grafo: {id, etiqueta, orden, valido, texto, arista}. */
  function propuestas(G, nom) {
    var n = G.length, t = tiempos(G), d = t.d, f = t.f;
    function lugar(orden, k) { return orden.indexOf(k) + 1; }
    var fdec = ordenarPor(n, f, true), res = [];

    res.push({ id: "fdec", etiqueta: "Por f decreciente", orden: fdec, valido: esOrden(G, fdec),
      texto: "Sí vale. Es lo que entrega la búsqueda: para toda flecha u → v se cumple f[u] > f[v]. Si v estaba blanco, termina dentro de u; si estaba negro, ya había terminado antes de que u termine; y gris no puede estar en un grafo sin ciclos.",
      arista: null });

    var fcre = ordenarPor(n, f, false), vf = violacion(G, fcre);
    res.push({ id: "fcre", etiqueta: "Por f creciente", orden: fcre, valido: vf === null,
      texto: vf === null ? "" :
        "No vale. Es el orden contrario al de f decreciente, y deja cada flecha al revés. Por ejemplo " + nom[vf[0]] + " → " + nom[vf[1]] +
        ": f[" + nom[vf[0]] + "] = " + f[vf[0]] + " es mayor que f[" + nom[vf[1]] + "] = " + f[vf[1]] +
        ", así que " + nom[vf[1]] + " queda en la posición " + lugar(fcre, vf[1]) + " y " + nom[vf[0]] + " en la " + lugar(fcre, vf[0]) + ".",
      arista: vf });

    var dcre = ordenarPor(n, d, false), vd = violacion(G, dcre);
    res.push({ id: "dcre", etiqueta: "Por d creciente", orden: dcre, valido: vd === null,
      texto: vd === null
        ? "Sí vale, pero solo en este grafo. Todas las flechas van de un vértice a un descendiente suyo, y un descendiente se descubre después que su ancestro, así que d[u] < d[v] en cada flecha. Una sola flecha cruzada, de un vértice que se descubre a otro que ya terminó, lo rompería: el orden por d no es un método general."
        : "No vale. La flecha " + nom[vd[0]] + " → " + nom[vd[1]] + " queda al revés: d[" + nom[vd[0]] + "] = " + d[vd[0]] +
          " es mayor que d[" + nom[vd[1]] + "] = " + d[vd[1]] + ", porque " + nom[vd[1]] +
          " ya había terminado cuando se descubrió " + nom[vd[0]] + " (flecha cruzada). El orden de descubrimiento no respeta las flechas que llegan a algo ya cerrado.",
      arista: vd });

    var ddec = ordenarPor(n, d, true), vdd = violacion(G, ddec);
    res.push({ id: "ddec", etiqueta: "Por d decreciente", orden: ddec, valido: vdd === null,
      texto: vdd === null ? "" :
        "No vale. La flecha " + nom[vdd[0]] + " → " + nom[vdd[1]] + " queda al revés: d[" + nom[vdd[0]] + "] = " + d[vdd[0]] +
        " y d[" + nom[vdd[1]] + "] = " + d[vdd[1]] + ". Un vértice se descubre antes que lo que descubre a partir de él, y el orden por d decreciente pone primero lo descubierto después.",
      arista: vdd });

    var kk = kahn(G, "menor");
    if (mismos(kk, fdec)) { kk = kahn(G, "mayor"); }
    var modo = mismos(kk, kahn(G, "menor")) ? "la de número más bajo" : "la de número más alto";
    var pd = 0;
    while (pd < n && kk[pd] === fdec[pd]) { pd = pd + 1; }
    res.push({ id: "kahn", etiqueta: "Un orden de Kahn", orden: kk, valido: esOrden(G, kk),
      texto: "Sí vale, aunque no sea el de la profundidad. Se obtiene quitando siempre una fuente, un vértice sin flechas de entrada, y escogiendo " + modo +
        " cuando hay varias. Un grafo sin ciclos suele tener varios órdenes topológicos: este difiere del de f decreciente en la posición " + (pd + 1) +
        ", donde aquí va " + nom[kk[pd]] + " y allá " + nom[fdec[pd]] + ". Lo único que se exige es que cada flecha apunte hacia la derecha.",
      arista: null });

    var sw = null, i = 0;
    while (i < n - 1 && sw === null) {
      var a = fdec[i], b = fdec[i + 1], j = 0, hay = false;
      while (j < G[a].length) { if (G[a][j] === b) { hay = true; } j = j + 1; }
      if (hay) { sw = i; }
      i = i + 1;
    }
    if (sw !== null) {
      var cam = fdec.slice(), tmp = cam[sw];
      cam[sw] = cam[sw + 1]; cam[sw + 1] = tmp;
      res.push({ id: "swap", etiqueta: "Por f decreciente, con dos vecinos intercambiados", orden: cam, valido: esOrden(G, cam),
        texto: "No vale. Es el de f decreciente con " + nom[fdec[sw]] + " y " + nom[fdec[sw + 1]] +
          " cambiados de lugar, y entre ellos hay la flecha " + nom[fdec[sw]] + " → " + nom[fdec[sw + 1]] +
          ", que ahora apunta hacia la izquierda. Basta una flecha al revés para que el orden no sirva.",
        arista: [fdec[sw], fdec[sw + 1]] });
    }
    return res;
  }

  return { tiempos: tiempos, esOrden: esOrden, violacion: violacion, kahn: kahn, propuestas: propuestas };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GRAFOS = [
      { boton: "Compilador, seis vértices",
        texto: "Etapas de un compilador: una flecha va de la etapa que entrega su resultado a la que lo recibe.",
        nombres: ["generador", "optimizador", "semántico", "lexer", "parser", "símbolos"],
        G: [[], [0], [1], [4, 5], [2], [1]],
        pos: [[6.2, 1.5], [4.2, 1.5], [2.8, 2.6], [0.0, 1.5], [1.4, 2.6], [2.0, 0.4]],
        perm: ["fcre", "kahn", "dcre", "fdec", "ddec", "swap"] },
      { boton: "Mudanza, siete",
        texto: "Una mudanza: una flecha va de la tarea que se termina antes a la que la espera.",
        nombres: ["cargar", "viajar", "empacar", "cajas", "camión", "descargar", "acomodar"],
        G: [[1], [5], [0, 6], [2], [0], [6], []],
        pos: [[2.6, 1.1], [3.8, 1.1], [1.3, 2.0], [0.0, 2.0], [1.3, 0.2], [5.0, 1.1], [5.0, 2.4]],
        perm: ["dcre", "fdec", "ddec", "kahn", "swap", "fcre"] },
      { boton: "Casa, ocho",
        texto: "La construcción de una casa: una flecha va del trabajo que va antes al que lo necesita.",
        nombres: ["cimientos", "muros", "plomería", "techo", "eléctrica", "pintura", "acabados", "entrega"],
        G: [[1, 2, 4], [3, 4], [], [5], [], [6, 7], [], []],
        pos: [[0.0, 1.5], [1.3, 2.6], [1.3, 0.4], [2.8, 2.6], [2.8, 1.5], [4.0, 2.6], [5.3, 3.3], [5.3, 1.9]],
        perm: ["ddec", "kahn", "fcre", "dcre", "swap", "fdec"] }
    ];
    var presetActual = 0, lista = [], resalte = null, comprobado = false;

    function g() { return GRAFOS[presetActual]; }

    function dibujar() {
      var p = g(), t = EJERCICIO.tiempos(p.G);
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: p.G, nombres: p.nombres,
        nodo: function (i) {
          return { relleno: "#e3edf8", borde: "#1f5fa8", tinta: "#24292f", grueso: 2.2, nota: t.d[i] + "/" + t.f[i] };
        },
        arista: function (u, v) {
          return resalte && resalte[0] === u && resalte[1] === v
            ? { color: "rojo", grueso: 3.6 } : { color: "gris", grueso: 1.6 };
        }
      });
    }

    function tabla() {
      var p = g(), t = EJERCICIO.tiempos(p.G), i = 0, h = "<tr><th></th>", a = "<tr><th><i>d</i></th>", b = "<tr><th><i>f</i></th>";
      while (i < p.nombres.length) {
        h += "<th>" + p.nombres[i] + "</th>"; a += "<td>" + t.d[i] + "</td>"; b += "<td>" + t.f[i] + "</td>";
        i = i + 1;
      }
      document.getElementById("tabla-tiempos").innerHTML = "<thead>" + h + "</tr></thead><tbody>" + a + "</tr>" + b + "</tr></tbody>";
    }

    function armar() {
      var p = g();
      var todas = EJERCICIO.propuestas(p.G, p.nombres), porId = {}, k = 0;
      while (k < todas.length) { porId[todas[k].id] = todas[k]; k = k + 1; }
      lista = [];
      k = 0;
      while (k < p.perm.length) { if (porId[p.perm[k]]) { lista.push(porId[p.perm[k]]); } k = k + 1; }
      resalte = null; comprobado = false;
      var h = "";
      k = 0;
      while (k < lista.length) {
        h += "<div class='prop' style='border:1px solid var(--borde);border-radius:8px;padding:0.5rem 0.7rem;margin-bottom:0.6rem'>" +
             "<label style='font-weight:600'><input type='checkbox' id='marca-" + k + "'> " + (k + 1) + ". " + lista[k].etiqueta + "</label>" +
             "<div class='secuencia'>" +
             lista[k].orden.map(function (v) { return "<span class='ficha'>" + p.nombres[v] + "</span>"; }).join("<span class='flecha'>›</span>") +
             "</div><div id='ver-" + k + "' class='veredicto'></div>" +
             "<div id='btn-ver-" + k + "' style='display:none;margin-top:0.4rem'><button data-k='" + k + "'>Ver la flecha en el dibujo</button></div></div>";
        k = k + 1;
      }
      document.getElementById("propuestas").innerHTML = h;
      document.getElementById("resumen").className = "veredicto";
      document.getElementById("resumen").textContent = "";
      document.getElementById("ver-texto").textContent = p.texto;
      Array.prototype.forEach.call(document.querySelectorAll("#propuestas button"), function (b) {
        b.addEventListener("click", function () {
          resalte = lista[parseInt(b.getAttribute("data-k"), 10)].arista;
          dibujar();
        });
      });
      dibujar();
      tabla();
    }

    function comprobar() {
      var aciertos = 0, k = 0;
      while (k < lista.length) {
        var marcada = document.getElementById("marca-" + k).checked;
        var ok = marcada === lista[k].valido;
        if (ok) { aciertos = aciertos + 1; }
        var v = document.getElementById("ver-" + k);
        v.className = ok ? "veredicto bien" : "veredicto mal";
        v.textContent = (ok ? "Acierto. " : "Error. ") + lista[k].texto;
        document.getElementById("btn-ver-" + k).style.display = lista[k].arista ? "block" : "none";
        k = k + 1;
      }
      var r = document.getElementById("resumen");
      r.className = aciertos === lista.length ? "veredicto bien" : "veredicto mal";
      r.textContent = aciertos + " de " + lista.length + " propuestas bien clasificadas.";
    }

    document.getElementById("btn-comprobar").addEventListener("click", comprobar);
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
