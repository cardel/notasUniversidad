/* recorrido: listaEnteros sobre el arbol de siete nodos del deck. La
   simulacion evalua el cuerpo del caso NoVacio en el orden en que esta
   escrito, listaEnteros(izq) ++ List(elm) ++ listaEnteros(der), y de ahi sale
   tanto el orden en que cada nodo aporta su elemento como la lista final. El
   codigo y el arbol salen de 09_pattern_matching.scala del deck de la sesion. */
(function () {
  /* El arbol de conjA, con la posicion de cada nodo en el dibujo. */
  function vacio(id, x, y) { return { forma: "Vacio", id: id, x: x, y: y }; }

  function nodo(elem, x, y, izq, der) {
    return { forma: "NoVacio", id: "n" + elem, elem: elem, x: x, y: y, izq: izq, der: der };
  }

  function hoja(elem, x, y, idIzq, idDer) {
    return nodo(elem, x, y, vacio(idIzq, x - 35, y + 62), vacio(idDer, x + 35, y + 62));
  }

  var CONJ_A = nodo(10, 300, 38,
    nodo(8, 160, 100,
      hoja(6, 90, 162, "v1", "v2"),
      hoja(9, 230, 162, "v3", "v4")),
    nodo(15, 440, 100,
      hoja(13, 370, 162, "v5", "v6"),
      hoja(16, 510, 162, "v7", "v8")));

  /* Los nodos en el orden en que estan escritos en conjA. */
  var ESCRITOS = [10, 8, 6, 9, 15, 13, 16];

  var CODIGO = [
    { num: null, txt: "def listaEnteros(conj: ConjEnt): List[Int] =" },
    { num: 2, txt: "  conj match {" },
    { num: null, txt: "    case Vacio() =>" },
    { num: 4, txt: "      List()" },
    { num: null, txt: "    case NoVacio(elm, izq, der) =>" },
    { num: 6, txt: "      listaEnteros(izq) ++", bloque: 1 },
    { num: 7, txt: "      List(elm) ++", bloque: 2 },
    { num: 8, txt: "      listaEnteros(der)", bloque: 3 },
    { num: 9, txt: "  }" }
  ];

  function textoLista(xs) { return "List(" + xs.join(", ") + ")"; }

  function rotuloNodo(c) {
    return c.forma === "Vacio" ? "Vacio()" : "NoVacio(" + c.elem + ", …)";
  }

  /* Un paso por cada linea que se evalua. El contador de cierres avanza cuando
     un nodo construye su List(elm). */
  function simular(raiz) {
    var pasos = [];
    var estado = { cerrados: 0 };

    function anotar(linea, c, extra) {
      var p = {
        linea: linea, nodoId: c.id, nodo: rotuloNodo(c),
        aporte: null, devuelve: null, cerrados: estado.cerrados, orden: null
      };
      Object.keys(extra || {}).forEach(function (k) { p[k] = extra[k]; });
      pasos.push(p);
    }

    function visitar(c) {
      if (c.forma === "Vacio") {
        anotar(2, c, {});
        anotar(4, c, { devuelve: "List()" });
        anotar(9, c, { devuelve: "List()" });
        return [];
      }
      anotar(2, c, {});
      anotar(6, c, {});
      var izquierda = visitar(c.izq);
      estado.cerrados = estado.cerrados + 1;
      anotar(7, c, {
        aporte: "List(" + c.elem + ")",
        elemento: c.elem,
        orden: estado.cerrados,
        devuelve: textoLista(izquierda.concat([c.elem]))
      });
      anotar(8, c, {});
      var derecha = visitar(c.der);
      var total = izquierda.concat([c.elem], derecha);
      anotar(9, c, { devuelve: textoLista(total) });
      return total;
    }

    visitar(raiz);
    return pasos;
  }

  function listaFinal(raiz) {
    if (raiz.forma === "Vacio") { return []; }
    return listaFinal(raiz.izq).concat([raiz.elem], listaFinal(raiz.der));
  }

  /* El lugar en que cierra cada nodo: el orden en que aporta su elemento. */
  function ordenDeCierre(raiz) {
    var lista = listaFinal(raiz), mapa = {};
    lista.forEach(function (e, i) { mapa[e] = i + 1; });
    return mapa;
  }

  /* Cuantos nodos tiene el subarbol izquierdo de un elemento. */
  function nodosDe(c) {
    if (c.forma === "Vacio") { return 0; }
    return 1 + nodosDe(c.izq) + nodosDe(c.der);
  }

  function buscarNodo(c, elem) {
    if (c.forma === "Vacio") { return null; }
    if (c.elem === elem) { return c; }
    return buscarNodo(c.izq, elem) || buscarNodo(c.der, elem);
  }

  function pistaDeCierre(elem) {
    var n = buscarNodo(CONJ_A, elem);
    var cuantos = nodosDe(n.izq);
    if (cuantos === 0) {
      return "El nodo " + elem + " no tiene nada a su izquierda: la llamada de la línea 6 " +
        "devuelve List() de inmediato y el nodo aporta su elemento enseguida. Cuente cuántos " +
        "nodos aportaron antes de que la ejecución llegara hasta él.";
    }
    return "La línea 6 va antes que la 7, así que la llamada sobre el subárbol izquierdo " +
      "termina primero: los " + cuantos + " nodos que hay a la izquierda del " + elem +
      " aportan antes que él, y los de su derecha, después.";
  }

  /* Lee una lista escrita a mano: toma los enteros en el orden en que aparecen. */
  function enterosDe(texto) {
    var hallados = String(texto).match(/-?\d+/g);
    return hallados === null ? [] : hallados.map(Number);
  }

  function revisarLista(texto) {
    var dados = enterosDe(texto);
    var buena = listaFinal(CONJ_A);
    if (dados.length === 0) {
      return { ok: false, msg: "Escriba la lista, con los siete elementos en el orden en que " +
        "salen." };
    }
    if (dados.length !== buena.length) {
      return { ok: false, msg: "Cada nodo aporta exactamente un elemento y el conjunto tiene " +
        "siete nodos, así que la lista lleva siete elementos. Los conjuntos vacíos aportan " +
        "List(), que no agrega nada." };
    }
    if (dados.join(",") === buena.join(",")) {
      return { ok: true, msg: "Eso es: " + textoLista(buena) + ". Los siete elementos salen de " +
        "menor a mayor, y ningún paso del recorrido los ordenó." };
    }
    if (dados.slice().sort(function (a, b) { return a - b; }).join(",") === buena.join(",")) {
      return { ok: false, msg: "Están los siete elementos, en otro orden. Mire dónde queda " +
        "List(elm) en el cuerpo: entre la lista del subárbol izquierdo y la del derecho, así " +
        "que el elemento del nodo se ubica entre las dos." };
    }
    return { ok: false, msg: "Esos no son los elementos del conjunto. El recorrido no cambia " +
      "ningún valor: cada nodo aporta el entero que guarda." };
  }

  var LUGARES = [1, 2, 3, 4, 5, 6, 7];

  var API = {
    CONJ_A: CONJ_A, ESCRITOS: ESCRITOS, CODIGO: CODIGO, LUGARES: LUGARES,
    vacio: vacio, nodo: nodo, hoja: hoja,
    simular: simular, listaFinal: listaFinal, ordenDeCierre: ordenDeCierre,
    nodosDe: nodosDe, buscarNodo: buscarNodo, pistaDeCierre: pistaDeCierre,
    enterosDe: enterosDe, revisarLista: revisarLista,
    textoLista: textoLista, rotuloNodo: rotuloNodo
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var SVG = "http://www.w3.org/2000/svg";
  var CIERRES = ordenDeCierre(CONJ_A);

  function crear(nombre, atributos) {
    var el = document.createElementNS(SVG, nombre);
    Object.keys(atributos).forEach(function (k) { el.setAttribute(k, atributos[k]); });
    return el;
  }

  function dibujarArbol() {
    var svg = document.getElementById("arbol");
    svg.innerHTML = "";

    function ramas(c) {
      if (c.forma === "Vacio") { return; }
      [c.izq, c.der].forEach(function (h) {
        svg.appendChild(crear("line", {
          x1: c.x, y1: c.y, x2: h.x, y2: h.y, class: "rama"
        }));
        ramas(h);
      });
    }

    function figuras(c) {
      if (c.forma === "Vacio") {
        svg.appendChild(crear("rect", {
          x: c.x - 8, y: c.y - 8, width: 16, height: 16, rx: 3,
          class: "hueco", id: "fig-" + c.id
        }));
        return;
      }
      svg.appendChild(crear("circle", {
        cx: c.x, cy: c.y, r: 19, class: "nodo", id: "fig-" + c.id
      }));
      var t = crear("text", { x: c.x, y: c.y + 5 });
      t.textContent = String(c.elem);
      svg.appendChild(t);
      var o = crear("text", { x: c.x + 27, y: c.y - 13, class: "orden", id: "ord-" + c.id });
      o.textContent = "";
      svg.appendChild(o);
      figuras(c.izq);
      figuras(c.der);
    }

    ramas(CONJ_A);
    figuras(CONJ_A);
  }

  function limpiarArbol() {
    document.querySelectorAll("#arbol .nodo, #arbol .hueco").forEach(function (f) {
      f.setAttribute("class", f.classList.contains("hueco") ? "hueco" : "nodo");
    });
    document.querySelectorAll("#arbol .orden").forEach(function (t) { t.textContent = ""; });
  }

  function alPintar(e) {
    limpiarArbol();
    e.pasos.slice(0, e.k).forEach(function (p) {
      var fig = document.getElementById("fig-" + p.nodoId);
      if (fig === null) { return; }
      if (fig.classList.contains("hueco")) {
        fig.setAttribute("class", "hueco");
      } else if (p.orden !== null && p.orden !== undefined) {
        fig.setAttribute("class", "nodo cerrado");
        document.getElementById("ord-" + p.nodoId).textContent = p.orden;
      } else if (!fig.classList.contains("cerrado")) {
        fig.setAttribute("class", "nodo visitado");
      }
    });
    if (e.actual !== null) {
      var act = document.getElementById("fig-" + e.actual.nodoId);
      if (act !== null) {
        act.setAttribute("class", act.getAttribute("class") + " actual");
      }
    }
    var hasta = [];
    e.pasos.slice(0, e.k).forEach(function (p) {
      if (p.orden !== null && p.orden !== undefined) { hasta.push(p.elemento); }
    });
    document.getElementById("acumulada").textContent = textoLista(hasta);
  }

  function construirTabla() {
    var tabla = document.getElementById("tabla-orden");
    var cab = document.createElement("tr");
    ["nodo", "lugar en que cierra"].forEach(function (t) {
      var th = document.createElement("th");
      th.textContent = t;
      cab.appendChild(th);
    });
    tabla.appendChild(cab);

    ESCRITOS.forEach(function (elem) {
      var fila = document.createElement("tr");
      var tdNodo = document.createElement("td");
      var tdSel = document.createElement("td");
      var sel = document.createElement("select");
      var vacia = document.createElement("option");
      tdNodo.className = "expr";
      tdNodo.textContent = "NoVacio(" + elem + ", …)";
      sel.id = "sel-" + elem;
      vacia.value = "";
      vacia.textContent = "–";
      sel.appendChild(vacia);
      LUGARES.forEach(function (n) {
        var op = document.createElement("option");
        op.value = String(n);
        op.textContent = String(n);
        sel.appendChild(op);
      });
      tdSel.appendChild(sel);
      fila.appendChild(tdNodo);
      fila.appendChild(tdSel);
      tabla.appendChild(fila);
    });
  }

  function comprobar() {
    var aciertos = 0, sinResponder = 0;
    var avisos = document.getElementById("avisos");
    avisos.innerHTML = "";

    ESCRITOS.forEach(function (elem) {
      var sel = document.getElementById("sel-" + elem);
      if (sel.value === "") {
        sinResponder = sinResponder + 1;
        sel.className = "";
        return;
      }
      if (Number(sel.value) === CIERRES[elem]) {
        sel.className = "bien-celda";
        aciertos = aciertos + 1;
        return;
      }
      sel.className = "mal-celda";
      var caja = document.createElement("div");
      var titulo = document.createElement("b");
      caja.className = "aviso-celda";
      titulo.textContent = "nodo " + elem + ": ";
      caja.appendChild(titulo);
      caja.appendChild(document.createTextNode(pistaDeCierre(elem)));
      avisos.appendChild(caja);
    });

    var contador = document.getElementById("contador");
    if (sinResponder > 0) {
      contador.textContent = "lugares acertados: " + aciertos + " de 7 · quedan " +
        sinResponder + " sin asignar";
    } else {
      contador.textContent = "lugares acertados: " + aciertos + " de 7";
    }

    var res = revisarLista(document.getElementById("prediccion-lista").value);
    var v = document.getElementById("veredicto-lista");
    v.className = res.ok ? "veredicto bien" : "veredicto mal";
    v.textContent = res.msg;

    if (aciertos === 7 && res.ok) {
      document.getElementById("botones").classList.remove("bloqueado");
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    }
  }

  dibujarArbol();
  construirTabla();
  document.getElementById("contador").textContent = "lugares acertados: 0 de 7";
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: CONJ_A,
    simular: simular,
    chips: [
      { campo: "nodo", rotulo: "conj" },
      { campo: "aporte", rotulo: "aporta" },
      { campo: "devuelve", rotulo: "devuelve" },
      { campo: "cerrados", rotulo: "nodos cerrados", clase: "cuenta" }
    ],
    alPintar: alPintar
  });
})();
