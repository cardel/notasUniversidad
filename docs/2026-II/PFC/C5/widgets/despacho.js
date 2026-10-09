/* despacho: qué implementación de pertenece corre en cada nodo.
   La jerarquía reproduce 06_conjent_clases.scala: abstract class ConjEnt con
   insertar y pertenece sin cuerpo, object Vacio con pertenece = false, y
   class NoVacio con la cadena if/else sobre elem. El árbol es el de
   Vacio.insertar(10).insertar(8).insertar(15).insertar(6).insertar(9)
   .insertar(13).insertar(16), cuyo recorrido en orden da
   List(6, 8, 9, 10, 13, 15, 16). Las filas correctas salen de la simulación,
   no de una lista escrita a mano. */
(function () {

  /* ---------- el modelo: Vacio como objeto único, NoVacio con tres campos ---------- */

  var VACIO = { clase: "Vacio" };

  function noVacio(elem, izq, der) {
    return { clase: "NoVacio", elem: elem, izq: izq, der: der };
  }

  function insertar(c, x) {
    if (c.clase === "Vacio") { return noVacio(x, VACIO, VACIO); }
    if (x < c.elem) { return noVacio(c.elem, insertar(c.izq, x), c.der); }
    if (x > c.elem) { return noVacio(c.elem, c.izq, insertar(c.der, x)); }
    return c;
  }

  function listaEnteros(c) {
    if (c.clase === "Vacio") { return []; }
    return listaEnteros(c.izq).concat([c.elem]).concat(listaEnteros(c.der));
  }

  var INSERCIONES = [10, 8, 15, 6, 9, 13, 16];

  var ARBOL = INSERCIONES.reduce(function (c, x) { return insertar(c, x); }, VACIO);

  /* ---------- el recorrido: un paso por nodo que recibe la llamada ---------- */

  /* ruta identifica al nodo desde la raíz: "" la raíz, "i" su hijo izquierdo,
     "id" el derecho de ese, y así. */
  function recorrido(c, x, ruta) {
    var r = ruta === undefined ? "" : ruta;
    if (c.clase === "Vacio") {
      return [{
        ruta: r, clase: "Vacio", elem: null,
        comparacion: "ninguna", rumbo: "fin-false", impl: "Vacio"
      }];
    }
    if (x < c.elem) {
      return [{
        ruta: r, clase: "NoVacio", elem: c.elem,
        comparacion: "menor", rumbo: "izq", impl: "NoVacio"
      }].concat(recorrido(c.izq, x, r + "i"));
    }
    if (x > c.elem) {
      return [{
        ruta: r, clase: "NoVacio", elem: c.elem,
        comparacion: "mayor", rumbo: "der", impl: "NoVacio"
      }].concat(recorrido(c.der, x, r + "d"));
    }
    return [{
      ruta: r, clase: "NoVacio", elem: c.elem,
      comparacion: "igual", rumbo: "fin-true", impl: "NoVacio"
    }];
  }

  function pertenece(c, x) {
    var pasos = recorrido(c, x);
    return pasos[pasos.length - 1].rumbo === "fin-true";
  }

  /* Cuántas veces corre cada implementación en un recorrido. */
  function cuentaImpl(pasos) {
    return {
      NoVacio: pasos.filter(function (p) { return p.impl === "NoVacio"; }).length,
      Vacio: pasos.filter(function (p) { return p.impl === "Vacio"; }).length
    };
  }

  /* ---------- disposición del dibujo: columna por recorrido en orden ---------- */

  /* Asigna a cada nodo, incluidos los Vacio, una columna en orden y una
     profundidad. Así el dibujo sale del árbol y no de coordenadas escritas. */
  function disponer(c) {
    var puestos = [];
    var columna = 0;

    function bajar(nodo, prof, ruta) {
      if (nodo.clase === "Vacio") {
        puestos.push({ ruta: ruta, clase: "Vacio", elem: null, col: columna, prof: prof });
        columna = columna + 1;
        return;
      }
      bajar(nodo.izq, prof + 1, ruta + "i");
      puestos.push({ ruta: ruta, clase: "NoVacio", elem: nodo.elem, col: columna, prof: prof });
      columna = columna + 1;
      bajar(nodo.der, prof + 1, ruta + "d");
    }

    bajar(c, 0, "");
    return puestos;
  }

  /* ---------- los dos recorridos que se piden ---------- */

  var EJERCICIOS = [
    {
      id: "siete", x: 7,
      titulo: "pertenece(7)",
      cierre: "La última llamada la recibe un subárbol vacío. Vacio.pertenece devuelve " +
        "false sin comparar nada, y ese false es el que sube por las tres llamadas " +
        "pendientes hasta la raíz."
    },
    {
      id: "nueve", x: 9,
      titulo: "pertenece(9)",
      cierre: "La tercera llamada cae en el nodo cuyo elem es el buscado. La tercera rama " +
        "del if/else devuelve true y la búsqueda no baja más: nunca llega a un Vacio."
    }
  ];

  function pasosDe(id) {
    var ej = null;
    EJERCICIOS.forEach(function (e) { if (e.id === id) { ej = e; } });
    return recorrido(ARBOL, ej.x);
  }

  /* ---------- rótulos de las cuatro columnas ---------- */

  var COMPARACIONES = ["menor", "mayor", "igual", "ninguna"];

  function rotuloComparacion(clave, x, elem) {
    var e = elem === null || elem === undefined ? "elem" : String(elem);
    if (clave === "menor") { return x + " < " + e; }
    if (clave === "mayor") { return x + " > " + e; }
    if (clave === "igual") { return x + " == " + e; }
    return "Vacio no compara nada";
  }

  var RUMBOS = [
    { clave: "izq", rotulo: "baja al subárbol izquierdo" },
    { clave: "der", rotulo: "baja al subárbol derecho" },
    { clave: "fin-true", rotulo: "no baja: devuelve true" },
    { clave: "fin-false", rotulo: "no baja: devuelve false" }
  ];

  var IMPLS = [
    { clave: "NoVacio", rotulo: "la de NoVacio" },
    { clave: "Vacio", rotulo: "la de Vacio" }
  ];

  function elementos() {
    return listaEnteros(ARBOL).map(String);
  }

  /* ---------- revisión de una fila ---------- */

  var PISTAS = {
    c1: "Esta llamada la recibe el subárbol al que apuntó la fila anterior. " +
      "La primera la recibe la raíz.",
    c2: "La comparación se evalúa entre el x de la llamada y el elem de este nodo, " +
      "y solo una de las tres ramas del if/else resulta verdadera.",
    c3: "El cuerpo de pertenece dice qué hace cada rama: la primera pasa la llamada a " +
      "izq, la segunda a der, y la tercera devuelve true sin bajar.",
    c4: "Mire qué objeto recibe la llamada. Un nodo con elemento y dos subárboles es un " +
      "NoVacio; un subárbol vacío es el object Vacio, y su pertenece devuelve false " +
      "sin mirar x."
  };

  function exito(paso, x) {
    if (paso.clase === "Vacio") {
      return "La llamada llegó a un subárbol vacío. Corre Vacio.pertenece, que devuelve " +
        "false con el cuerpo que tiene escrito, sin comparación y sin bajar más.";
    }
    if (paso.comparacion === "igual") {
      return "Corre NoVacio.pertenece y la comparación " + x + " == " + paso.elem +
        " hace verdadera la tercera rama: devuelve true y la búsqueda termina aquí.";
    }
    return "Corre NoVacio.pertenece sobre el nodo " + paso.elem + ": con " +
      rotuloComparacion(paso.comparacion, x, paso.elem) + " la llamada pasa al subárbol " +
      (paso.rumbo === "izq" ? "izquierdo" : "derecho") + ", y ese subárbol decide por su cuenta " +
      "cuál implementación corre.";
  }

  /* respuesta = {c1, c2, c3, c4} con las claves elegidas. */
  function revisarFila(id, indice, respuesta) {
    var pasos = pasosDe(id);
    var paso = pasos[indice];
    var correcto = {
      c1: paso.elem === null ? "vacio" : String(paso.elem),
      c2: paso.comparacion,
      c3: paso.rumbo,
      c4: paso.impl
    };
    var fallan = ["c1", "c2", "c3", "c4"].filter(function (k) {
      return respuesta[k] !== correcto[k];
    });
    if (fallan.length === 0) {
      return {
        ok: true, correcto: correcto, fallan: [],
        msg: exito(paso, EJERCICIOS.filter(function (e) { return e.id === id; })[0].x),
        termina: paso.rumbo === "fin-true" || paso.rumbo === "fin-false"
      };
    }
    return {
      ok: false, correcto: correcto, fallan: fallan,
      msg: fallan.map(function (k) { return PISTAS[k]; }).join(" "),
      termina: false
    };
  }

  var API = {
    VACIO: VACIO, noVacio: noVacio, insertar: insertar, listaEnteros: listaEnteros,
    INSERCIONES: INSERCIONES, ARBOL: ARBOL, recorrido: recorrido, pertenece: pertenece,
    cuentaImpl: cuentaImpl, disponer: disponer, EJERCICIOS: EJERCICIOS, pasosDe: pasosDe,
    COMPARACIONES: COMPARACIONES, rotuloComparacion: rotuloComparacion, RUMBOS: RUMBOS,
    IMPLS: IMPLS, elementos: elementos, revisarFila: revisarFila
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ================= la página ================= */

  var ANCHO_COL = 53;
  var ALTO_NIVEL = 72;
  var MARGEN = 30;

  var SVGNS = "http://www.w3.org/2000/svg";

  function cx(col) { return MARGEN + col * ANCHO_COL; }
  function cy(prof) { return 36 + prof * ALTO_NIVEL; }

  function buscarPuesto(puestos, ruta) {
    var hallado = null;
    puestos.forEach(function (p) { if (p.ruta === ruta) { hallado = p; } });
    return hallado;
  }

  function dibujar(destino, sufijo) {
    var puestos = disponer(ARBOL);
    var maxCol = 0;
    var maxProf = 0;
    puestos.forEach(function (p) {
      if (p.col > maxCol) { maxCol = p.col; }
      if (p.prof > maxProf) { maxProf = p.prof; }
    });
    var ancho = cx(maxCol) + MARGEN;
    var alto = cy(maxProf) + MARGEN;

    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + ancho + " " + alto);
    svg.setAttribute("class", "arbol");

    /* las aristas primero, para que los nodos queden encima */
    puestos.forEach(function (p) {
      if (p.clase !== "NoVacio") { return; }
      ["i", "d"].forEach(function (lado) {
        var hijo = buscarPuesto(puestos, p.ruta + lado);
        if (hijo === null) { return; }
        var l = document.createElementNS(SVGNS, "line");
        l.setAttribute("x1", cx(p.col));
        l.setAttribute("y1", cy(p.prof) + 18);
        l.setAttribute("x2", cx(hijo.col));
        l.setAttribute("y2", cy(hijo.prof) - (hijo.clase === "Vacio" ? 10 : 18));
        l.setAttribute("class", "arista");
        l.setAttribute("id", "arista-" + sufijo + "-" + p.ruta + lado);
        svg.appendChild(l);
      });
    });

    puestos.forEach(function (p) {
      var g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "nodo");
      g.setAttribute("id", "nodo-" + sufijo + "-" + (p.ruta === "" ? "raiz" : p.ruta));
      if (p.clase === "Vacio") {
        var rect = document.createElementNS(SVGNS, "rect");
        rect.setAttribute("x", cx(p.col) - 10);
        rect.setAttribute("y", cy(p.prof) - 10);
        rect.setAttribute("width", 20);
        rect.setAttribute("height", 20);
        rect.setAttribute("rx", 4);
        g.appendChild(rect);
      } else {
        var circ = document.createElementNS(SVGNS, "circle");
        circ.setAttribute("cx", cx(p.col));
        circ.setAttribute("cy", cy(p.prof));
        circ.setAttribute("r", 18);
        g.appendChild(circ);
        var t = document.createElementNS(SVGNS, "text");
        t.setAttribute("x", cx(p.col));
        t.setAttribute("y", cy(p.prof) + 5);
        t.setAttribute("text-anchor", "middle");
        t.textContent = String(p.elem);
        g.appendChild(t);
      }
      svg.appendChild(g);
    });

    destino.innerHTML = "";
    destino.appendChild(svg);
  }

  function marcar(sufijo, pasos, hasta) {
    pasos.forEach(function (p, i) {
      if (i >= hasta) { return; }
      var g = document.getElementById("nodo-" + sufijo + "-" + (p.ruta === "" ? "raiz" : p.ruta));
      if (g) {
        g.setAttribute("class", "nodo visitado" + (p.clase === "Vacio" ? " cierra" : ""));
      }
      var a = document.getElementById("arista-" + sufijo + "-" + p.ruta);
      if (a) { a.setAttribute("class", "arista recorrida"); }
    });
  }

  function opcion(valor, rotulo) {
    var o = document.createElement("option");
    o.value = valor;
    o.textContent = rotulo;
    return o;
  }

  function selectorElem() {
    var s = document.createElement("select");
    s.appendChild(opcion("", "elija…"));
    elementos().forEach(function (e) { s.appendChild(opcion(e, e)); });
    s.appendChild(opcion("vacio", "ninguno: es un subárbol vacío"));
    return s;
  }

  function selectorComparacion(x, elem) {
    var s = document.createElement("select");
    s.appendChild(opcion("", "elija…"));
    COMPARACIONES.forEach(function (c) {
      s.appendChild(opcion(c, rotuloComparacion(c, x, elem)));
    });
    return s;
  }

  function selectorDe(lista) {
    var s = document.createElement("select");
    s.appendChild(opcion("", "elija…"));
    lista.forEach(function (r) { s.appendChild(opcion(r.clave, r.rotulo)); });
    return s;
  }

  var estado = {};

  function filasResueltas() {
    var n = 0;
    EJERCICIOS.forEach(function (e) { n = n + estado[e.id].resueltas; });
    return n;
  }

  function cerrados() {
    var n = 0;
    EJERCICIOS.forEach(function (e) { if (estado[e.id].cerrado) { n = n + 1; } });
    return n;
  }

  function refrescarContador() {
    document.getElementById("contador").textContent =
      "filas correctas: " + filasResueltas() + " · recorridos cerrados: " +
      cerrados() + " de " + EJERCICIOS.length;
    if (cerrados() === EJERCICIOS.length) {
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  function agregarFila(ej) {
    var est = estado[ej.id];
    if (est.cerrado) { return; }
    var indice = est.resueltas;
    var cuerpo = document.getElementById("cuerpo-" + ej.id);

    var tr = document.createElement("tr");
    tr.id = "fila-" + ej.id + "-" + indice;

    var tdN = document.createElement("td");
    tdN.textContent = String(indice + 1);
    tr.appendChild(tdN);

    var sElem = selectorElem();
    var sComp = selectorComparacion(ej.x, null);
    var sRumbo = selectorDe(RUMBOS);
    var sImpl = selectorDe(IMPLS);

    [sElem, sComp, sRumbo, sImpl].forEach(function (s) {
      var td = document.createElement("td");
      td.appendChild(s);
      tr.appendChild(td);
    });

    var tdBtn = document.createElement("td");
    var btn = document.createElement("button");
    btn.textContent = "Comprobar";
    tdBtn.appendChild(btn);
    tr.appendChild(tdBtn);

    cuerpo.appendChild(tr);

    /* la comparación se reescribe con el elem elegido, para que el estudiante
       tenga que evaluarla con números concretos */
    sElem.addEventListener("change", function () {
      var elegido = sElem.value;
      var elem = elegido === "" || elegido === "vacio" ? null : parseInt(elegido, 10);
      var antes = sComp.value;
      sComp.innerHTML = "";
      sComp.appendChild(opcion("", "elija…"));
      COMPARACIONES.forEach(function (c) {
        sComp.appendChild(opcion(c, rotuloComparacion(c, ej.x, elem)));
      });
      sComp.value = antes;
    });

    btn.addEventListener("click", function () {
      var respuesta = {
        c1: sElem.value, c2: sComp.value, c3: sRumbo.value, c4: sImpl.value
      };
      var ver = document.getElementById("ver-" + ej.id);
      if (respuesta.c1 === "" || respuesta.c2 === "" ||
          respuesta.c3 === "" || respuesta.c4 === "") {
        ver.className = "veredicto mal";
        ver.textContent = "Llene las cuatro casillas de la fila antes de comprobar.";
        return;
      }
      var res = revisarFila(ej.id, indice, respuesta);
      [["c1", sElem], ["c2", sComp], ["c3", sRumbo], ["c4", sImpl]].forEach(function (par) {
        par[1].className = res.fallan.indexOf(par[0]) >= 0 ? "errada" : "";
      });
      if (!res.ok) {
        ver.className = "veredicto mal";
        ver.textContent = res.msg;
        return;
      }
      ver.className = "veredicto bien";
      ver.textContent = res.msg;
      [sElem, sComp, sRumbo, sImpl].forEach(function (s) { s.disabled = true; });
      btn.remove();
      tr.classList.add("listo");
      est.resueltas = indice + 1;
      marcar(ej.id, pasosDe(ej.id), est.resueltas);
      if (res.termina) {
        est.cerrado = true;
        var cierre = document.getElementById("cierre-" + ej.id);
        var cuenta = cuentaImpl(pasosDe(ej.id));
        cierre.className = "alerta";
        cierre.textContent = ej.titulo + " responde " +
          (res.correcto.c3 === "fin-true" ? "true" : "false") + ". Visitó " +
          est.resueltas + " nodos: " + cuenta.NoVacio + " con la implementación de NoVacio y " +
          (cuenta.Vacio === 0 ? "ninguno con la de Vacio" :
            cuenta.Vacio + " con la de Vacio") + ". " + ej.cierre;
      } else {
        agregarFila(ej);
      }
      refrescarContador();
    });
  }

  function construir() {
    var caja = document.getElementById("recorridos");
    EJERCICIOS.forEach(function (ej) {
      estado[ej.id] = { resueltas: 0, cerrado: false };

      var carta = document.createElement("div");
      carta.className = "recorrido";

      var h = document.createElement("h3");
      h.textContent = "c." + ej.titulo;
      carta.appendChild(h);

      var dib = document.createElement("div");
      dib.className = "dibujo";
      dib.id = "dibujo-" + ej.id;
      carta.appendChild(dib);

      var env = document.createElement("div");
      env.className = "envoltura-tabla";
      var tabla = document.createElement("table");
      var thead = document.createElement("thead");
      var trh = document.createElement("tr");
      ["#", "elem del nodo", "comparación", "qué hace la rama",
        "qué pertenece corre", ""].forEach(function (t) {
        var th = document.createElement("th");
        th.textContent = t;
        trh.appendChild(th);
      });
      thead.appendChild(trh);
      tabla.appendChild(thead);
      var tbody = document.createElement("tbody");
      tbody.id = "cuerpo-" + ej.id;
      tabla.appendChild(tbody);
      env.appendChild(tabla);
      carta.appendChild(env);

      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "ver-" + ej.id;
      carta.appendChild(ver);

      var cierre = document.createElement("div");
      cierre.id = "cierre-" + ej.id;
      carta.appendChild(cierre);

      caja.appendChild(carta);

      dibujar(dib, ej.id);
      agregarFila(ej);
    });
  }

  construir();
  refrescarContador();

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      if (b.getAttribute("data-razon") === "ok") {
        b.className = "primario";
        v.className = "veredicto bien";
        v.textContent = "Eso es. La llamada se escribe una sola vez, izq pertenece x, y el " +
          "cuerpo que corre lo aporta el objeto que esté en izq en ese momento: si es un " +
          "NoVacio, la cadena de comparaciones; si es Vacio, el false.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        b.className = "errada";
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
