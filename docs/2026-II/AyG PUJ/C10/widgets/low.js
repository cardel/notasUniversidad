/* Ejercicio interactivo: el valor low de cada vertice en el algoritmo de Tarjan (clase 10).
   La traza reproduce la version recursiva de tarjan: d y low se actualizan como en
   visit, y solo las flechas hacia vertices que siguen en la pila bajan low. */
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
  /* Corre tarjan (recursiva) sobre G y guarda, por vertice, cada termino de su min. */
  function traza(G) {
    var n = G.length, d = [], low = [], enPila = [], pila = [], reloj = 0;
    var terminos = [], tipo = [], comps = [], compDe = [], i = 0;
    while (i < n) {
      d.push(0); low.push(0); enPila.push(false); terminos.push([]); compDe.push(-1);
      tipo.push([]); i = i + 1;
    }
    function visit(u) {
      reloj = reloj + 1; d[u] = reloj; low[u] = reloj; pila.push(u); enPila[u] = true;
      var j = 0;
      while (j < G[u].length) {
        var v = G[u][j];
        if (d[v] === 0) {
          tipo[u].push("arbol");
          visit(v);
          terminos[u].push({ t: "hijo", v: v, val: low[v] });
          low[u] = Math.min(low[u], low[v]);
        } else if (enPila[v]) {
          tipo[u].push("pila");
          terminos[u].push({ t: "pila", v: v, val: d[v], lowv: low[v] });
          low[u] = Math.min(low[u], d[v]);
        } else {
          tipo[u].push("cerrada");
          terminos[u].push({ t: "cerrada", v: v, comp: compDe[v] });
        }
        j = j + 1;
      }
      if (low[u] === d[u]) {
        var comp = [], w = null;
        while (w !== u) { w = pila.pop(); enPila[w] = false; comp.push(w); }
        var c = 0;
        while (c < comp.length) { compDe[comp[c]] = comps.length; c = c + 1; }
        comps.push(comp);
      }
    }
    var u = 0;
    while (u < n) { if (d[u] === 0) { visit(u); } u = u + 1; }
    return { d: d, low: low, terminos: terminos, tipo: tipo, comps: comps, compDe: compDe };
  }

  function minDe(lista) {
    var m = lista[0], i = 1;
    while (i < lista.length) { if (lista[i] < m) { m = lista[i]; } i = i + 1; }
    return m;
  }

  /* Valores que darian tres errores tipicos, para diagnosticar la respuesta. */
  function candidatos(t, u) {
    var base = [t.d[u]], conCerradas = [t.d[u]], conLow = [t.d[u]], j = 0;
    while (j < t.terminos[u].length) {
      var x = t.terminos[u][j];
      if (x.t === "hijo") { base.push(x.val); conCerradas.push(x.val); conLow.push(x.val); }
      if (x.t === "pila") { base.push(x.val); conCerradas.push(x.val); conLow.push(x.lowv); }
      if (x.t === "cerrada") { conCerradas.push(t.d[x.v]); }
      j = j + 1;
    }
    return { soloD: t.d[u], conCerradas: minDe(conCerradas), conLow: minDe(conLow) };
  }

  function explicar(t, nom, u) {
    var partes = ["d[" + nom[u] + "] = " + t.d[u]], bajo = null, extra = [], j = 0;
    while (j < t.terminos[u].length) {
      var x = t.terminos[u][j];
      if (x.t === "hijo") {
        partes.push("low[" + nom[x.v] + "] = " + x.val + " (hijo " + nom[x.v] + ")");
        if (x.val < t.d[u] && (bajo === null || x.val < bajo.val)) { bajo = { val: x.val, por: "el hijo " + nom[x.v] }; }
      }
      if (x.t === "pila") {
        partes.push("d[" + nom[x.v] + "] = " + x.val + " (flecha " + nom[u] + " → " + nom[x.v] + ")");
        if (x.lowv < x.val) {
          extra.push("La flecha " + nom[u] + " → " + nom[x.v] + " no es de árbol y " + nom[x.v] + " sigue en la pila, así que aporta d[" + nom[x.v] + "] = " + x.val +
                     " y no low[" + nom[x.v] + "] = " + x.lowv + ".");
        }
        if (x.val < t.d[u] && (bajo === null || x.val < bajo.val)) { bajo = { val: x.val, por: "la flecha " + nom[u] + " → " + nom[x.v] }; }
      }
      if (x.t === "cerrada") {
        extra.push("La flecha " + nom[u] + " → " + nom[x.v] + " no cuenta: " + nom[x.v] + " ya salió de la pila con su componente {" +
                   t.comps[x.comp].map(function (k) { return nom[k]; }).join(", ") + "}, y de ahí no hay camino de vuelta.");
      }
      j = j + 1;
    }
    var texto = "low[" + nom[u] + "] = min(" + partes.join(", ") + ") = " + t.low[u] + ". ";
    if (bajo !== null && t.low[u] === bajo.val) { texto += "Lo bajó " + bajo.por + "."; }
    else if (t.low[u] === t.d[u]) { texto += "Nada lo baja."; }
    texto += " ";
    if (extra.length > 0) { texto += extra.join(" ") + " "; }
    if (t.low[u] === t.d[u]) {
      texto += "Como low = d, " + nom[u] + " es la raíz de su componente y lo saca de la pila: {" +
               t.comps[t.compDe[u]].map(function (k) { return nom[k]; }).join(", ") + "}.";
    } else {
      texto += "Como low < d, " + nom[u] + " sigue en la pila: alcanza un vértice más viejo.";
    }
    return texto;
  }

  function diagnostico(t, nom, u, valor) {
    if (valor === t.low[u]) { return null; }
    var c = candidatos(t, u);
    if (valor === c.soloD && t.low[u] !== t.d[u]) {
      return "Escribió d[" + nom[u] + "] y dejó sin mirar lo que lo baja: algún hijo o alguna flecha hacia la pila trae un valor menor.";
    }
    if (valor === c.conCerradas && c.conCerradas !== t.low[u]) {
      return "Contó una flecha hacia un vértice que ya salió de la pila. Esas no valen: su componente está cerrado.";
    }
    if (valor === c.conLow && c.conLow !== t.low[u]) {
      return "En una flecha que no es de árbol usó low del otro extremo. Con vértices en la pila se usa su d, no su low.";
    }
    return "No coincide. Mire los hijos de árbol, que aportan su low, y las demás flechas, que aportan el d del otro extremo solo si ese vértice sigue en la pila.";
  }

  return { traza: traza, explicar: explicar, diagnostico: diagnostico };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var GRAFOS = [
      { boton: "Servicios, seis vértices",
        texto: "Llamadas entre servicios: una flecha va del servicio que llama al llamado.",
        nombres: ["gw", "auth", "api", "db", "cache", "log"],
        G: [[1], [2], [3, 4], [1], [5], []],
        pos: [[0.0, 1.5], [1.3, 2.5], [2.6, 2.5], [1.95, 0.5], [3.9, 2.5], [5.2, 2.5]] },
      { boton: "Módulos, siete",
        texto: "Módulos de un programa: una flecha va del módulo que importa al importado.",
        nombres: ["main", "lex", "parse", "emit", "opt", "cfg", "ir"],
        G: [[1, 3], [2], [1], [1, 4], [0, 5], [6], [5]],
        pos: [[0.0, 1.5], [1.3, 2.8], [2.8, 2.8], [1.3, 0.4], [2.8, 0.4], [4.2, 0.4], [5.4, 0.4]] },
      { boton: "Mensajería, ocho",
        texto: "Colas y procesos de un sistema de mensajería: una flecha va del que publica al que recibe.",
        nombres: ["origen", "colaA", "colaB", "router", "filtro", "espejo", "archivo", "auditoría"],
        G: [[1, 2, 4, 6], [2], [3], [0], [2, 5], [4], [5, 7], []],
        pos: [[0.0, 1.6], [1.2, 2.9], [2.6, 2.9], [2.0, 0.4], [3.8, 1.6], [4.8, 2.9], [4.8, 0.4], [5.9, 1.6]] }
    ];
    var presetActual = 0, T = null, comprobado = false;
    function g() { return GRAFOS[presetActual]; }

    function dibujar() {
      var p = g();
      document.getElementById("panel-grafo").innerHTML = DIB.dibujar({
        pos: p.pos, G: p.G, nombres: p.nombres,
        nodo: function (i) {
          var s = { relleno: "#ffffff", borde: "#1f5fa8", tinta: "#24292f", grueso: 2.2, nota: "d = " + T.d[i] };
          if (comprobado) {
            s.nota = "d = " + T.d[i] + ", low = " + T.low[i];
            s.relleno = T.low[i] === T.d[i] ? "#e7f2e8" : "#fdf1dc";
          }
          return s;
        },
        arista: function (u, v) {
          var k = p.G[u].indexOf(v);
          return T.tipo[u][k] === "arbol"
            ? { color: "azul", grueso: 3.2 }
            : { color: "gris", grueso: 1.6, trazo: "6,4" };
        }
      });
    }

    function armar() {
      var p = g();
      T = EJERCICIO.traza(p.G); comprobado = false;
      var h = "", i = 0;
      while (i < p.nombres.length) {
        h += "<label style='display:flex;align-items:center;gap:0.4rem;border:1px solid var(--borde);border-radius:8px;padding:0.3rem 0.5rem'>" +
             "<span style='font-family:ui-monospace,monospace;white-space:nowrap'>low[" + p.nombres[i] + "]</span> " +
             "<span class='nota' style='margin:0;white-space:nowrap'>(d = " + T.d[i] + ")</span> " +
             "<input type='number' id='low-" + i + "' min='1' style='width:4rem;padding:0.3rem;border:1px solid var(--borde);border-radius:6px'></label>";
        i = i + 1;
      }
      document.getElementById("entradas").innerHTML = h;
      document.getElementById("explicaciones").innerHTML = "";
      var v = document.getElementById("veredicto"); v.className = "veredicto"; v.textContent = "";
      document.getElementById("ver-texto").textContent = p.texto;
      dibujar();
    }

    function comprobar() {
      var p = g(), n = p.nombres.length, i = 0, bien = 0, vacios = 0, h = "";
      var orden = [];
      while (i < n) { orden.push(i); i = i + 1; }
      orden.sort(function (a, b) { return T.d[a] - T.d[b]; });
      i = 0;
      while (i < n) {
        var campo = document.getElementById("low-" + i), val = parseInt(campo.value, 10);
        if (isNaN(val)) { vacios = vacios + 1; }
        i = i + 1;
      }
      var v = document.getElementById("veredicto");
      if (vacios > 0) {
        v.className = "veredicto mal"; v.textContent = "Faltan " + vacios + " valores por escribir.";
        return;
      }
      comprobado = true;
      var k = 0;
      while (k < n) {
        var u = orden[k], campo2 = document.getElementById("low-" + u), valor = parseInt(campo2.value, 10);
        var ok = valor === T.low[u];
        if (ok) { bien = bien + 1; }
        campo2.style.borderColor = ok ? "#2e7d32" : "#b3261e";
        campo2.style.background = ok ? "#e7f2e8" : "#fbe9e7";
        var diag = ok ? "" : "<br><i>" + EJERCICIO.diagnostico(T, p.nombres, u, valor) + "</i>";
        h += "<div class='veredicto " + (ok ? "bien" : "mal") + "' style='display:block;margin-top:0.4rem'><b>" + p.nombres[u] +
             "</b> (d = " + T.d[u] + "): " + (ok ? "correcto. " : "usted escribió " + valor + ". ") +
             EJERCICIO.explicar(T, p.nombres, u) + diag + "</div>";
        k = k + 1;
      }
      v.className = bien === n ? "veredicto bien" : "veredicto mal";
      v.textContent = bien + " de " + n + " valores correctos. Las explicaciones van en el orden en que se descubren los vértices.";
      document.getElementById("explicaciones").innerHTML = h;
      dibujar();
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
