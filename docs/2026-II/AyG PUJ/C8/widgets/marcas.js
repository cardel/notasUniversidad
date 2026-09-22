/* Ejercicio interactivo: las marcas de la busqueda en profundidad
   (clase 8, ejercicio 1). Cada vertice pasa por tres colores y recibe dos
   marcas de tiempo; toparse con un vertice gris es lo que delata un ciclo.
   Las dos versiones, recursiva y con pila explicita, dan las mismas marcas. */
var EJERCICIO = (function () {
  var CODIGO_REC = [
    { txt: "def dfs_marcas(G, u, color, d, f, reloj):", num: null },
    { txt: "    color[u] = GRIS",                      num: 1, bloque: 1 },
    { txt: "    reloj[0] = reloj[0] + 1",              num: 2, bloque: 1 },
    { txt: "    d[u] = reloj[0]",                      num: 3, bloque: 1 },
    { txt: "    hay = False",                          num: 4, bloque: 1 },
    { txt: "    for v in G[u]:",                       num: 5, bloque: 1 },
    { txt: "        if color[v] == GRIS:",             num: 6, bloque: 1 },
    { txt: "            hay = True",                   num: 7, bloque: 1 },
    { txt: "        elif color[v] == BLANCO:",         num: 8, bloque: 1 },
    { txt: "            if dfs_marcas(G, v, color, d, f, reloj):", num: 9, bloque: 1 },
    { txt: "                hay = True",               num: 10, bloque: 1 },
    { txt: "    color[u] = NEGRO",                     num: 11, bloque: 1 },
    { txt: "    reloj[0] = reloj[0] + 1",              num: 12, bloque: 1 },
    { txt: "    f[u] = reloj[0]",                      num: 13, bloque: 1 },
    { txt: "    return hay",                           num: 14, bloque: 1 }
  ];

  /* La misma funcion sin recursion: la pila guarda cada vertice abierto
     junto con cual de sus vecinos sigue. */
  var CODIGO_PILA = [
    { txt: "def dfs_marcas(G, s, color, d, f, reloj):", num: null },
    { txt: "    color[s] = GRIS",                       num: 1, bloque: 1 },
    { txt: "    reloj[0] = reloj[0] + 1",               num: 2, bloque: 1 },
    { txt: "    d[s] = reloj[0]",                       num: 3, bloque: 1 },
    { txt: "    hay = False",                           num: 4, bloque: 1 },
    { txt: "    pila = [[s, 0]]",                       num: 5, bloque: 1 },
    { txt: "    while len(pila) > 0:",                  num: 6, bloque: 2 },
    { txt: "        u = pila[-1][0]",                   num: 7, bloque: 2 },
    { txt: "        i = pila[-1][1]",                   num: 8, bloque: 2 },
    { txt: "        if i < len(G[u]):",                 num: 9, bloque: 2 },
    { txt: "            pila[-1][1] = i + 1",           num: 10, bloque: 2 },
    { txt: "            v = G[u][i]",                   num: 11, bloque: 2 },
    { txt: "            if color[v] == GRIS:",          num: 12, bloque: 2 },
    { txt: "                hay = True",                num: 13, bloque: 2 },
    { txt: "            elif color[v] == BLANCO:",      num: 14, bloque: 2 },
    { txt: "                color[v] = GRIS",           num: 15, bloque: 2 },
    { txt: "                reloj[0] = reloj[0] + 1",   num: 16, bloque: 2 },
    { txt: "                d[v] = reloj[0]",           num: 17, bloque: 2 },
    { txt: "                pila.append([v, 0])",       num: 18, bloque: 2 },
    { txt: "        else:",                             num: null, bloque: 2 },
    { txt: "            color[u] = NEGRO",              num: 19, bloque: 2 },
    { txt: "            reloj[0] = reloj[0] + 1",       num: 20, bloque: 2 },
    { txt: "            f[u] = reloj[0]",               num: 21, bloque: 2 },
    { txt: "            pila.pop()",                    num: 22, bloque: 2 },
    { txt: "    return hay",                            num: 23, bloque: 1 }
  ];

  var BLANCO = 0, GRIS = 1, NEGRO = 2;

  function nuevo(n, v) { var a = [], i = 0; while (i < n) { a.push(v); i = i + 1; } return a; }

  function simularRecursivo(params) {
    var G = params.G, n = G.length, s = params.inicio;
    var pasos = [];
    var color = nuevo(n, BLANCO), d = nuevo(n, 0), f = nuevo(n, 0);
    var reloj = 0, pila = [], u = null, v = null, hay = false;
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, v: v === null ? "–" : v, reloj: reloj,
                color: color.slice(), d: d.slice(), f: f.slice(), pila: pila.slice(), hay: hay };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    function visitar(w) {
      pila.push(w);
      u = w; v = null;
      color[w] = GRIS; snap(1, { abre: w });
      reloj = reloj + 1; snap(2);
      d[w] = reloj; snap(3, { marcaD: w });
      var miHay = false;
      hay = miHay; snap(4);
      var i = 0;
      while (i < G[w].length) {
        v = G[w][i]; u = w; hay = miHay;
        snap(5, { mira: [w, v] });
        snap(6, { mira: [w, v] });
        if (color[v] === GRIS) {
          miHay = true; hay = miHay;
          snap(7, { mira: [w, v], retroceso: [w, v] });
        } else {
          snap(8, { mira: [w, v] });
          if (color[v] === BLANCO) {
            snap(9, { mira: [w, v], baja: v });
            var sub = visitar(v);
            u = w; v = G[w][i];
            if (sub) { miHay = true; }
            hay = miHay;
            snap(10, { mira: [w, v], vuelve: v, sub: sub });
          }
        }
        i = i + 1;
      }
      v = null; u = w; hay = miHay;
      color[w] = NEGRO; snap(11, { cierra: w });
      reloj = reloj + 1; snap(12);
      f[w] = reloj; snap(13, { marcaF: w, cierraFila: w });
      snap(14, { retorna: miHay });
      pila.pop();
      return miHay;
    }
    var total = visitar(s);
    u = null; v = null; hay = total;
    snap(14, { fin: true, respuesta: total });
    return pasos;
  }

  function simularPila(params) {
    var G = params.G, n = G.length, s = params.inicio;
    var pasos = [];
    var color = nuevo(n, BLANCO), d = nuevo(n, 0), f = nuevo(n, 0);
    var reloj = 0, pila = [], u = null, v = null, hay = false;
    function verPila() { var r = [], i = 0; while (i < pila.length) { r.push(pila[i][0]); i = i + 1; } return r; }
    function snap(linea, extra) {
      var q = { linea: linea, u: u === null ? "–" : u, v: v === null ? "–" : v, reloj: reloj,
                color: color.slice(), d: d.slice(), f: f.slice(), pila: verPila(), hay: hay };
      if (extra) { for (var x in extra) { q[x] = extra[x]; } }
      pasos.push(q);
    }
    u = s;
    color[s] = GRIS; snap(1, { abre: s });
    reloj = reloj + 1; snap(2);
    d[s] = reloj; snap(3, { marcaD: s });
    snap(4);
    pila.push([s, 0]); snap(5);
    var sigue = true;
    while (sigue) {
      snap(6);
      if (pila.length > 0) {
        var marco = pila[pila.length - 1];
        u = marco[0]; v = null; snap(7);
        var i = marco[1]; snap(8);
        snap(9);
        if (i < G[u].length) {
          marco[1] = i + 1; snap(10);
          v = G[u][i]; snap(11, { mira: [u, v] });
          snap(12, { mira: [u, v] });
          if (color[v] === GRIS) {
            hay = true; snap(13, { mira: [u, v], retroceso: [u, v] });
          } else {
            snap(14, { mira: [u, v] });
            if (color[v] === BLANCO) {
              color[v] = GRIS; snap(15, { mira: [u, v], abre: v });
              reloj = reloj + 1; snap(16, { mira: [u, v] });
              d[v] = reloj; snap(17, { mira: [u, v], marcaD: v });
              pila.push([v, 0]); snap(18, { mira: [u, v] });
            }
          }
        } else {
          v = null;
          color[u] = NEGRO; snap(19, { cierra: u });
          reloj = reloj + 1; snap(20);
          f[u] = reloj; snap(21, { marcaF: u, cierraFila: u });
          pila.pop(); snap(22);
        }
      } else { sigue = false; }
    }
    u = null; v = null;
    snap(23, { fin: true, respuesta: hay });
    return pasos;
  }

  function simular(params) {
    return params.version === "pila" ? simularPila(params) : simularRecursivo(params);
  }

  function marcas(G, s) {
    var pasos = simularRecursivo({ G: G, inicio: s });
    var fin = pasos[pasos.length - 1];
    return { d: fin.d, f: fin.f, hay: fin.respuesta, reloj: fin.reloj };
  }

  function alcanzables(G, s) {
    var n = G.length, visto = nuevo(n, false), pila = [s], cuenta = 0;
    visto[s] = true;
    while (pila.length > 0) {
      var u = pila.pop(); cuenta = cuenta + 1;
      var i = 0;
      while (i < G[u].length) { if (!visto[G[u][i]]) { visto[G[u][i]] = true; pila.push(G[u][i]); } i = i + 1; }
    }
    return cuenta;
  }

  return { codigoRecursivo: CODIGO_REC, codigoPila: CODIGO_PILA, simular: simular,
           marcas: marcas, alcanzables: alcanzables };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function grafo(n, aristas) {
      var G = []; var i = 0; while (i < n) { G.push([]); i = i + 1; }
      i = 0; while (i < aristas.length) { G[aristas[i][0]].push(aristas[i][1]); i = i + 1; }
      return G;
    }
    var PRESETS = [
      { G: grafo(5, [[0, 1], [0, 2], [1, 3], [2, 4]]), inicio: 0,
        pos: [[2.1, 2.4], [0.7, 1.2], [3.5, 1.2], [0.7, 0], [3.5, 0]],
        nota: "Un árbol: cada vértice se alcanza por un solo camino." },
      { G: grafo(6, [[0, 1], [0, 3], [1, 2], [2, 3], [3, 4], [4, 5]]), inicio: 0,
        pos: [[0, 2.4], [1.4, 2.4], [2.8, 2.4], [1.4, 1.0], [2.8, 0], [4.2, 0]],
        nota: "El 3 se alcanza por dos caminos; cuando la segunda flecha llega, ya está negro." },
      { G: grafo(6, [[0, 1], [1, 2], [2, 3], [3, 1], [2, 4], [4, 5]]), inicio: 0,
        pos: [[0, 1.2], [1.4, 2.0], [2.8, 2.0], [2.1, 0.4], [4.2, 1.6], [4.2, 0]],
        nota: "Aquí hay un ciclo: 1 → 2 → 3 → 1." }
    ];
    var presetActual = 0;
    var version = "rec";
    var RELLENO = ["#ffffff", "#d0d5dd", "#3f4754"];
    var BORDE = ["#d8dee6", "#8b93a1", "#24292f"];
    var TINTA = ["#24292f", "#24292f", "#ffffff"];

    function paramsActuales() {
      return { G: PRESETS[presetActual].G, inicio: PRESETS[presetActual].inicio, version: version };
    }

    function dibujar(a) {
      var P = PRESETS[presetActual], G = P.G, pos = P.pos, n = G.length;
      var ancho = 470, alto = 250;
      function X(i) { return 45 + (pos[i][0] / 4.2) * (ancho - 90); }
      function Y(i) { return 35 + ((2.4 - pos[i][1]) / 2.4) * (alto - 70); }
      var svg = "<svg viewBox='0 0 " + ancho + " " + alto + "' width='100%' style='max-width:490px'>";
      svg += "<defs>";
      svg += "<marker id='fg' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#6b7280'/></marker>";
      svg += "<marker id='fa' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#1f5fa8'/></marker>";
      svg += "<marker id='fr' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#b3261e'/></marker>";
      svg += "</defs>";
      var mira = a && a.mira ? a.mira : null;
      var retro = a && a.retroceso ? a.retroceso : null;
      var u = 0, i;
      while (u < n) {
        i = 0;
        while (i < G[u].length) {
          var v = G[u][i];
          var esMira = mira !== null && mira[0] === u && mira[1] === v;
          var esRetro = retro !== null && retro[0] === u && retro[1] === v;
          var col = esRetro ? "#b3261e" : (esMira ? "#1f5fa8" : "#6b7280");
          var mk = esRetro ? "fr" : (esMira ? "fa" : "fg");
          var dx = X(v) - X(u), dy = Y(v) - Y(u), dd = Math.sqrt(dx * dx + dy * dy);
          svg += "<line x1='" + (X(u) + dx / dd * 18) + "' y1='" + (Y(u) + dy / dd * 18) + "' x2='" + (X(v) - dx / dd * 20) + "' y2='" + (Y(v) - dy / dd * 20) +
                 "' stroke='" + col + "' stroke-width='" + (esMira || esRetro ? 3 : 1.6) + "' marker-end='url(#" + mk + ")'/>";
          i = i + 1;
        }
        u = u + 1;
      }
      u = 0;
      while (u < n) {
        var c = a ? a.color[u] : 0;
        var enPila = a && a.pila.indexOf(u) >= 0;
        svg += "<circle cx='" + X(u) + "' cy='" + Y(u) + "' r='16' fill='" + RELLENO[c] + "' stroke='" + (enPila ? "#e8a13d" : BORDE[c]) + "' stroke-width='" + (enPila ? 4 : 2) + "'/>";
        svg += "<text x='" + X(u) + "' y='" + (Y(u) + 5) + "' text-anchor='middle' font-size='14' font-weight='700' fill='" + TINTA[c] + "'>" + u + "</text>";
        if (a && (a.d[u] > 0 || a.f[u] > 0)) {
          var etiqueta = (a.d[u] > 0 ? a.d[u] : "·") + "/" + (a.f[u] > 0 ? a.f[u] : "·");
          svg += "<text x='" + X(u) + "' y='" + (Y(u) - 21) + "' text-anchor='middle' font-size='12' font-weight='700' fill='#1f5fa8'>" + etiqueta + "</text>";
        }
        u = u + 1;
      }
      svg += "</svg>";
      document.getElementById("panel-grafo").innerHTML = svg;
    }

    function alPintar(e) {
      var a = e.actual;
      dibujar(a);
      document.getElementById("ver-reloj").textContent = a ? a.reloj : 0;
      document.getElementById("rotulo-pila").textContent = e.params.version === "pila" ? "Pila" : "Llamadas";
      document.getElementById("ver-pila").textContent = a && a.pila.length > 0
        ? (e.params.version === "pila" ? a.pila.join(", ") : a.pila.map(function (w) { return "dfs_marcas(" + w + ")"; }).join(" › "))
        : "vacía";
      document.getElementById("ver-hay").textContent = a ? (a.hay ? "True" : "False") : "–";
      var cuerpo = document.getElementById("cuerpo-marcas");
      cuerpo.innerHTML = "";
      var G = e.params.G, n = G.length, u = 0;
      while (u < n) {
        var dv = a ? a.d[u] : 0, fv = a ? a.f[u] : 0;
        var col = a ? a.color[u] : 0;
        var nombre = ["blanco", "gris", "negro"][col];
        var tr = document.createElement("tr");
        tr.innerHTML = "<td><b>" + u + "</b></td><td>" + nombre + "</td><td>" + (dv > 0 ? dv : "–") + "</td><td>" + (fv > 0 ? fv : "–") + "</td>";
        if (col === 1) { tr.style.background = "#fdf1dc"; }
        cuerpo.appendChild(tr);
        u = u + 1;
      }
      var aviso = document.getElementById("ver-retro");
      if (a && a.retroceso) {
        aviso.innerHTML = "La flecha " + a.retroceso[0] + " → " + a.retroceso[1] + " llega a un vértice <b>gris</b>: el " + a.retroceso[1] + " está abierto, así que hay camino de él hasta el " + a.retroceso[0] + ", y esta flecha lo cierra.";
      } else if (a && a.fin) {
        aviso.innerHTML = a.respuesta ? "Terminó con <b>True</b>: alguna flecha llegó a un vértice gris." : "Terminó con <b>False</b>: ninguna flecha llegó a un vértice gris.";
      } else { aviso.textContent = ""; }
    }

    function arrancar(reiniciarSolo) {
      if (reiniciarSolo) { Motor.reiniciar(paramsActuales()); return; }
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar", "btn-comprobar"];
      var t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      Motor.iniciar({
        codigo: version === "pila" ? EJERCICIO.codigoPila : EJERCICIO.codigoRecursivo,
        simular: EJERCICIO.simular,
        chips: [{ campo: "u", rotulo: "u" }, { campo: "v", rotulo: "v" }, { campo: "reloj", rotulo: "reloj" }],
        paramsIniciales: paramsActuales(), alPintar: alPintar
      });
      Motor.prediccionNumerica(evaluar);
      Motor.limpiarVeredicto();
    }

    function evaluar(valor, params) {
      var alc = EJERCICIO.alcanzables(params.G, params.inicio);
      var m = EJERCICIO.marcas(params.G, params.inicio);
      if (valor === m.reloj) {
        return { ok: true, msg: "Correcto: el reloj termina en " + m.reloj + ". Se alcanzan " + alc + " vértices desde el " + params.inicio + " y cada uno recibe dos marcas, la de entrada y la de salida: el reloj avanza exactamente dos veces por vértice visitado." };
      }
      if (valor === alc) { return { ok: false, msg: "Ese es el número de vértices que se visitan. Cada uno hace avanzar el reloj dos veces, no una: una al pintarse de gris y otra al pintarse de negro." }; }
      if (valor === params.G.length * 2) { return { ok: false, msg: "Esa sería la cuenta si se visitaran los " + params.G.length + " vértices, pero desde el " + params.inicio + " solo se alcanzan " + alc + ". El resto se queda blanco y sin marcas." }; }
      return { ok: false, msg: "No coincide. Cuente cuántos vértices se alcanzan desde el " + params.inicio + " y multiplique por dos: cada visita gasta un instante al abrir y otro al cerrar." };
    }

    Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-grafo button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        presetActual = parseInt(btn.getAttribute("data-preset"), 10);
        document.getElementById("nota-grafo").textContent = PRESETS[presetActual].nota;
        Motor.limpiarVeredicto();
        arrancar(true);
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#presets-version button"), function (b) { b.classList.remove("primario"); });
        btn.classList.add("primario");
        version = btn.getAttribute("data-version");
        arrancar(false);
      });
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id); v.className = ok ? "veredicto bien" : "veredicto mal"; v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-color button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "gris") {
          veredicto("veredicto-color", true, "Correcto: gris quiere decir que ese vértice está abierto, o sea que la búsqueda entró y todavía no ha salido de él. Si desde él se llegó hasta donde estamos, y ahora una flecha vuelve hacia él, el camino se cierra: eso es un ciclo. Ejecute el tercer grafo y mire la flecha roja.");
        } else if (op === "negro") {
          veredicto("veredicto-color", false, "Negro quiere decir que ese vértice ya terminó: la búsqueda salió de él y no hay camino de regreso desde donde estamos. Ejecute el segundo grafo: al volver al 0, su flecha 0 → 3 llega a un vértice negro, y ese grafo no tiene ciclos.");
        } else {
          veredicto("veredicto-color", false, "Blanco es un vértice que nadie ha tocado. Esa flecha no cierra nada: es por donde la búsqueda va a seguir.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-anidado button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "anidado") {
          veredicto("veredicto-anidado", true, "Correcto: o un intervalo está completamente dentro del otro, o los dos son ajenos. Nunca se cruzan a medias, porque un vértice no se cierra mientras tenga vecinos abiertos debajo. En el primer grafo, el intervalo del 0 contiene los cuatro restantes y los del 1 y el 2 son ajenos entre sí.");
        } else if (op === "cruzado") {
          veredicto("veredicto-anidado", false, "Pruebe a construir un cruce a medias con el primer grafo: para que el intervalo de u empiece dentro del de v y termine afuera, v tendría que cerrarse con u todavía abierto encima de él en la pila, y la pila se vacía de arriba abajo.");
        } else {
          veredicto("veredicto-anidado", false, "Los intervalos ajenos existen: mire el 1 y el 2 del primer grafo, que son hermanos. Lo que no existe es el cruce a medias.");
        }
      });
    });

    document.getElementById("nota-grafo").textContent = PRESETS[0].nota;
    arrancar(false);
  })();
}
