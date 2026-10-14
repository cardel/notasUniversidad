/* msort: el merge sort del deck de listas y tuplas, con el arbol de llamadas
   que el frame "Idea del Merge Sort" dibuja para List(5, 2, 4, 1). El codigo
   sale literal del frame "Implementacion de Merge Sort (codigo)" y la traza
   reproduce la del frame "Traza de msort(List(5, 2, 4, 1))": la particion baja
   por el arbol y la mezcla sube. splitAt(n) con n = xs.length / 2 parte en el
   mismo punto que el deck. */
(function () {

  var CODIGO = [
    { num: null, txt: "def msort(xs: List[Int]): List[Int] = {" },
    { num: null, txt: "  def merge(l1: List[Int], l2: List[Int]): List[Int] =" },
    { num: 3, txt: "    (l1, l2) match {", bloque: 2 },
    { num: 4, txt: "      case (Nil, _) => l2", bloque: 2 },
    { num: 5, txt: "      case (_, Nil) => l1", bloque: 2 },
    { num: null, txt: "      case (m :: ms, n :: ns) =>", bloque: 2 },
    { num: 7, txt: "        if (m < n) m :: merge(ms, l2)", bloque: 2 },
    { num: 8, txt: "        else       n :: merge(l1, ns)", bloque: 2 },
    { num: null, txt: "    }" },
    { num: 10, txt: "  val n = xs.length / 2" },
    { num: 11, txt: "  if (n == 0) xs" },
    { num: null, txt: "  else {" },
    { num: 13, txt: "    val (izq, der) = xs.splitAt(n)", bloque: 1 },
    { num: 14, txt: "    merge(msort(izq), msort(der))", bloque: 3 },
    { num: 15, txt: "  }" },
    { num: null, txt: "}" }
  ];

  var LISTAS = [
    [5, 2, 4, 1],
    [8, 3, 5, 1, 9, 2],
    [1, 2, 3, 4],
    [4, 3, 2, 1]
  ];

  function textoLista(xs) {
    return xs.length === 0 ? "Nil" : "List(" + xs.join(", ") + ")";
  }

  /* El arbol de llamadas: un nodo por cada msort, con las dos mitades debajo.
     Los identificadores salen de un recorrido en preorden, el mismo que sigue
     la ejecucion, asi que el dibujo y la traza hablan de los mismos nodos. */
  function construirArbol(lista) {
    var estado = { siguiente: 0, slot: 0 };

    function nodo(xs, nivel) {
      var n = Math.floor(xs.length / 2);
      var c = {
        id: "c" + estado.siguiente, xs: xs, nivel: nivel, n: n,
        izq: null, der: null, slot: 0
      };
      estado.siguiente = estado.siguiente + 1;
      if (n > 0) {
        c.izq = nodo(xs.slice(0, n), nivel + 1);
        c.der = nodo(xs.slice(n), nivel + 1);
      }
      return c;
    }

    function ubicar(c) {
      if (c.izq === null) {
        c.slot = estado.slot + 0.5;
        estado.slot = estado.slot + 1;
        return;
      }
      ubicar(c.izq);
      ubicar(c.der);
      c.slot = (c.izq.slot + c.der.slot) / 2;
    }

    var raiz = nodo(lista, 0);
    ubicar(raiz);
    return raiz;
  }

  function hojas(c) {
    return c.izq === null ? 1 : hojas(c.izq) + hojas(c.der);
  }

  function profundidad(c) {
    return c.izq === null ? c.nivel : Math.max(profundidad(c.izq), profundidad(c.der));
  }

  /* Un paso por cada linea que se evalua, en el orden en que corren. */
  function simular(raiz) {
    var pasos = [];

    function anotar(linea, extra) {
      var p = {
        linea: linea, nodo: null, nivel: null, llamada: null, n: null,
        fase: null, mitades: null, mezcla: null, salida: null,
        comparacion: null, sale: null, caso: null, devuelve: null,
        textoNodo: null, resultado: null
      };
      Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
      pasos.push(p);
    }

    function anotarMezcla(linea, ctx, mezcla, extra) {
      var base = {
        nodo: ctx.nodo, nivel: ctx.nivel, llamada: ctx.llamada,
        fase: "mezclar", mezcla: mezcla, mitades: ctx.mitades,
        salida: textoLista(ctx.salida), textoNodo: textoLista(ctx.salida)
      };
      Object.keys(extra).forEach(function (k) { base[k] = extra[k]; });
      anotar(linea, base);
    }

    function mezclar(l1, l2, ctx) {
      var mezcla = "(" + textoLista(l1) + ", " + textoLista(l2) + ")";
      var m, n;

      anotarMezcla(3, ctx, mezcla, {});

      if (l1.length === 0) {
        ctx.salida = ctx.salida.concat(l2);
        anotarMezcla(4, ctx, mezcla, {
          caso: "(Nil, _)", comparacion: "l1 llegó a Nil",
          devuelve: textoLista(l2)
        });
        return l2;
      }

      if (l2.length === 0) {
        ctx.salida = ctx.salida.concat(l1);
        anotarMezcla(5, ctx, mezcla, {
          caso: "(_, Nil)", comparacion: "l2 llegó a Nil",
          devuelve: textoLista(l1)
        });
        return l1;
      }

      m = l1[0];
      n = l2[0];
      if (m < n) {
        ctx.salida = ctx.salida.concat([m]);
        anotarMezcla(7, ctx, mezcla, {
          caso: "(m :: ms, n :: ns)",
          comparacion: "m = " + m + " < n = " + n, sale: m
        });
        return [m].concat(mezclar(l1.slice(1), l2, ctx));
      }

      ctx.salida = ctx.salida.concat([n]);
      anotarMezcla(8, ctx, mezcla, {
        caso: "(m :: ms, n :: ns)",
        comparacion: "m = " + m + " < n = " + n + " es falso", sale: n
      });
      return [n].concat(mezclar(l1, l2.slice(1), ctx));
    }

    function ordenar(c) {
      var llamada = textoLista(c.xs);
      var mitades, ordIzq, ordDer, ctx, mezclada;

      anotar(10, {
        nodo: c.id, nivel: c.nivel, llamada: llamada, n: c.n,
        fase: "dividir", textoNodo: llamada
      });

      if (c.n === 0) {
        anotar(11, {
          nodo: c.id, nivel: c.nivel, llamada: llamada, n: c.n,
          fase: "ordenada", comparacion: "n == 0, la lista ya está ordenada",
          devuelve: llamada, textoNodo: llamada,
          resultado: c.nivel === 0 ? llamada : null
        });
        return c.xs.slice();
      }

      mitades = textoLista(c.izq.xs) + " y " + textoLista(c.der.xs);
      anotar(11, {
        nodo: c.id, nivel: c.nivel, llamada: llamada, n: c.n,
        fase: "dividir", comparacion: "n = " + c.n + ", hay que dividir",
        textoNodo: llamada
      });
      anotar(13, {
        nodo: c.id, nivel: c.nivel, llamada: llamada, n: c.n,
        fase: "dividir", mitades: mitades, textoNodo: llamada
      });

      ordIzq = ordenar(c.izq);
      ordDer = ordenar(c.der);

      anotar(14, {
        nodo: c.id, nivel: c.nivel, llamada: llamada, n: c.n,
        fase: "mezclar", mitades: mitades,
        mezcla: "(" + textoLista(ordIzq) + ", " + textoLista(ordDer) + ")",
        salida: "Nil", textoNodo: "Nil"
      });

      ctx = {
        nodo: c.id, nivel: c.nivel, llamada: llamada,
        mitades: mitades, salida: []
      };
      mezclada = mezclar(ordIzq, ordDer, ctx);

      anotar(15, {
        nodo: c.id, nivel: c.nivel, llamada: llamada, n: c.n,
        fase: "ordenada", mitades: mitades, devuelve: textoLista(mezclada),
        textoNodo: textoLista(mezclada),
        resultado: c.nivel === 0 ? textoLista(mezclada) : null
      });
      return mezclada;
    }

    ordenar(raiz);
    return pasos;
  }

  var API = {
    CODIGO: CODIGO, LISTAS: LISTAS, construirArbol: construirArbol,
    simular: simular, hojas: hojas, profundidad: profundidad,
    textoLista: textoLista
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var SVG = "http://www.w3.org/2000/svg";
  var ANCHO = 600;
  var raizActual = construirArbol(LISTAS[0]);

  function crear(nombre, atributos) {
    var el = document.createElementNS(SVG, nombre);
    Object.keys(atributos).forEach(function (k) { el.setAttribute(k, atributos[k]); });
    return el;
  }

  function dibujarArbol(raiz) {
    var svg = document.getElementById("arbol");
    var paso = ANCHO / hojas(raiz);
    var alto = 52 + profundidad(raiz) * 58;
    svg.innerHTML = "";
    svg.setAttribute("viewBox", "0 0 " + ANCHO + " " + alto);

    function posX(c) { return c.slot * paso; }
    function posY(c) { return 24 + c.nivel * 58; }

    function ramas(c) {
      if (c.izq === null) { return; }
      [c.izq, c.der].forEach(function (h) {
        svg.appendChild(crear("line", {
          x1: posX(c), y1: posY(c) + 12, x2: posX(h), y2: posY(h) - 12, class: "rama"
        }));
        ramas(h);
      });
    }

    function cajas(c) {
      var texto = textoLista(c.xs);
      var ancho = Math.max(46, texto.length * 7.2 + 14);
      svg.appendChild(crear("rect", {
        x: posX(c) - ancho / 2, y: posY(c) - 12, width: ancho, height: 24, rx: 5,
        class: "caja-llamada", id: "caja-" + c.id
      }));
      var t = crear("text", { x: posX(c), y: posY(c) + 4, id: "txt-" + c.id });
      t.textContent = texto;
      svg.appendChild(t);
      if (c.izq !== null) { cajas(c.izq); cajas(c.der); }
    }

    ramas(raiz);
    cajas(raiz);
  }

  var CLASES = {
    dividir: "caja-llamada dividida",
    mezclar: "caja-llamada mezclando",
    ordenada: "caja-llamada ordenada"
  };

  function pintarArbol(e) {
    var vistos = {};
    document.querySelectorAll("#arbol .caja-llamada").forEach(function (r) {
      r.setAttribute("class", "caja-llamada");
    });
    e.pasos.slice(0, e.k).forEach(function (p) {
      if (p.nodo === null) { return; }
      vistos[p.nodo] = p;
    });
    Object.keys(vistos).forEach(function (id) {
      var p = vistos[id];
      var caja = document.getElementById("caja-" + id);
      var txt = document.getElementById("txt-" + id);
      if (caja === null) { return; }
      caja.setAttribute("class", CLASES[p.fase]);
      if (p.textoNodo !== null) { txt.textContent = p.textoNodo; }
    });
    if (e.actual !== null && e.actual.nodo !== null) {
      var act = document.getElementById("caja-" + e.actual.nodo);
      if (act !== null) {
        act.setAttribute("class", act.getAttribute("class") + " activa");
      }
    }
  }

  function pintarTabla(e) {
    var tabla = document.getElementById("tabla-mezcla");
    var fila = 0;
    tabla.innerHTML = "";
    var cab = document.createElement("tr");
    ["paso", "nivel", "merge(l1, l2)", "qué decide", "sale", "salida parcial"]
      .forEach(function (t) {
        var th = document.createElement("th");
        th.textContent = t;
        cab.appendChild(th);
      });
    tabla.appendChild(cab);

    e.pasos.slice(0, e.k).forEach(function (p) {
      if ([4, 5, 7, 8].indexOf(p.linea) < 0) { return; }
      fila = fila + 1;
      var tr = document.createElement("tr");
      [String(fila), String(p.nivel), p.mezcla, p.comparacion,
        p.sale === null ? p.devuelve : String(p.sale), p.salida]
        .forEach(function (c, i) {
          var td = document.createElement("td");
          td.textContent = c;
          if (i >= 2) { td.className = "expr"; }
          tr.appendChild(td);
        });
      tabla.appendChild(tr);
    });

    if (fila === 0) {
      var vacia = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = 6;
      td.className = "pend";
      td.textContent = "la primera mezcla aparece cuando la partición toca fondo";
      vacia.appendChild(td);
      tabla.appendChild(vacia);
    }
  }

  function alPintar(e) {
    var resultado = "–";
    e.pasos.slice(0, e.k).forEach(function (p) {
      if (p.resultado !== null) { resultado = p.resultado; }
    });
    document.getElementById("resultado").textContent = resultado;
    pintarArbol(e);
    pintarTabla(e);
    if (e.terminado && e.k > 0) {
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    }
  }

  function construirPresets() {
    var caja = document.getElementById("presets");
    LISTAS.forEach(function (lista, i) {
      var b = document.createElement("button");
      b.textContent = "msort(" + textoLista(lista) + ")";
      b.id = "preset-" + i;
      b.addEventListener("click", function () {
        document.querySelectorAll("#presets button").forEach(function (o) {
          o.className = "";
        });
        b.className = "primario";
        document.getElementById("carta-cierre").classList.add("bloqueado");
        raizActual = construirArbol(lista);
        dibujarArbol(raizActual);
        Motor.reiniciar(raizActual);
      });
      caja.appendChild(b);
    });
  }

  construirPresets();
  document.getElementById("preset-0").className = "primario";
  dibujarArbol(raizActual);

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: raizActual,
    simular: simular,
    chips: [
      { campo: "fase", rotulo: "fase" },
      { campo: "llamada", rotulo: "msort" },
      { campo: "n", rotulo: "n" },
      { campo: "mitades", rotulo: "mitades" },
      { campo: "mezcla", rotulo: "merge" },
      { campo: "salida", rotulo: "salida", clase: "cuenta" }
    ],
    alPintar: alPintar
  });
})();
