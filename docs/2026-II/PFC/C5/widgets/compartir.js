/* compartir: cuántos nodos construye una inserción y cuántos quedan como los
   mismos objetos del árbol anterior. El modelo reproduce insertar de
   06_conjent_clases.scala: NoVacio devuelve un nodo nuevo con el subárbol que
   no cambió tal como estaba, y Vacio devuelve new NoVacio(x, Vacio, Vacio).
   El árbol es el de Vacio.insertar(10).insertar(8).insertar(15).insertar(6)
   .insertar(9).insertar(13).insertar(16), con recorrido en orden
   List(6, 8, 9, 10, 13, 15, 16). Lo compartido se decide por identidad de
   objeto, igual que la corrida instrumentada en Scala. */
(function () {

  var VACIO = { clase: "Vacio" };

  function noVacio(elem, izq, der) {
    return { clase: "NoVacio", elem: elem, izq: izq, der: der };
  }

  /* insertar sin instrumentar, el que se muestra en el panel */
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

  function nodos(c) {
    if (c.clase === "Vacio") { return []; }
    return [c].concat(nodos(c.izq)).concat(nodos(c.der));
  }

  var INSERCIONES = [10, 8, 15, 6, 9, 13, 16];

  var ARBOL = INSERCIONES.reduce(function (c, x) { return insertar(c, x); }, VACIO);

  /* ---------- la corrida instrumentada: una entrada por new NoVacio ---------- */

  function insertarConTraza(c, x) {
    var eventos = [];

    function bajar(nodo) {
      if (nodo.clase === "Vacio") {
        eventos.push({
          donde: "Vacio", elem: x,
          texto: "Vacio.insertar(" + x + ") construye new NoVacio(" + x + ", Vacio, Vacio)"
        });
        return noVacio(x, VACIO, VACIO);
      }
      if (x < nodo.elem) {
        var i = bajar(nodo.izq);
        eventos.push({
          donde: "NoVacio", elem: nodo.elem,
          texto: "en el nodo " + nodo.elem + ", " + x + " < " + nodo.elem +
            ": construye new NoVacio(" + nodo.elem + ", izq insertar " + x + ", der) y deja der como estaba"
        });
        return noVacio(nodo.elem, i, nodo.der);
      }
      if (x > nodo.elem) {
        var d = bajar(nodo.der);
        eventos.push({
          donde: "NoVacio", elem: nodo.elem,
          texto: "en el nodo " + nodo.elem + ", " + x + " > " + nodo.elem +
            ": construye new NoVacio(" + nodo.elem + ", izq, der insertar " + x + ") y deja izq como estaba"
        });
        return noVacio(nodo.elem, nodo.izq, d);
      }
      eventos.push({
        donde: "this", elem: nodo.elem,
        texto: "en el nodo " + nodo.elem + ", " + x + " == " + nodo.elem +
          ": devuelve this, y aquí no se construye nada"
      });
      return nodo;
    }

    var resultado = bajar(c);
    return {
      arbol: resultado,
      eventos: eventos,
      construcciones: eventos.filter(function (e) { return e.donde !== "this"; }).length
    };
  }

  /* Reparto por identidad de objeto entre el árbol viejo y el nuevo. */
  function reparto(viejo, nuevo) {
    var previos = nodos(viejo);
    var actuales = nodos(nuevo);
    function esPrevio(n) {
      return previos.some(function (p) { return p === n; });
    }
    return {
      total: actuales.length,
      compartidos: actuales.filter(esPrevio).map(function (n) { return n.elem; }),
      construidos: actuales.filter(function (n) { return !esPrevio(n); })
        .map(function (n) { return n.elem; })
    };
  }

  function informe(x) {
    var corrida = insertarConTraza(ARBOL, x);
    var r = reparto(ARBOL, corrida.arbol);
    return {
      x: x,
      arbol: corrida.arbol,
      eventos: corrida.eventos,
      construcciones: corrida.construcciones,
      construidos: r.construidos,
      compartidos: r.compartidos,
      nodosResultado: r.total,
      nodosOriginal: nodos(ARBOL).length,
      listaResultado: listaEnteros(corrida.arbol),
      listaOriginal: listaEnteros(ARBOL),
      raizNueva: corrida.arbol !== ARBOL
    };
  }

  var SIETE = informe(7);
  var NUEVE = informe(9);

  /* ---------- las dos predicciones numéricas ---------- */

  function revisarConstruidas(valor) {
    var buena = SIETE.construcciones;
    if (valor === buena) {
      return {
        ok: true,
        msg: "Son " + buena + ". La inserción baja 10 → 8 → 6 → subárbol vacío, y de " +
          "vuelta construye un nodo por cada paso de ese camino: el 7 que nace en Vacio, " +
          "y los nodos 6, 8 y 10 rehechos con el subárbol que cambió."
      };
    }
    if (valor === 1) {
      return {
        ok: false,
        msg: "El nodo 7 es el único que nace con un elemento nuevo, pero no es el único que " +
          "se construye: el padre no se puede modificar para que apunte al 7, así que el " +
          "padre también se construye, y el suyo, hasta la raíz."
      };
    }
    if (valor === SIETE.nodosResultado || valor === SIETE.nodosOriginal) {
      return {
        ok: false,
        msg: "Ese es el tamaño del árbol, no lo que cuesta la inserción. Los subárboles que " +
          "no están en el camino de la raíz al sitio del 7 entran al resultado tal como " +
          "estaban, sin volver a construirse."
      };
    }
    if (valor === 3) {
      return {
        ok: false,
        msg: "Faltó uno de los dos extremos del camino. Cuente el nodo nuevo que Vacio " +
          "construye y además cada nodo que ya existía y quedó rehecho, incluida la raíz."
      };
    }
    if (valor === 0) {
      return {
        ok: false,
        msg: "Sin construir nada no habría dónde poner el 7: los tres campos de un NoVacio se " +
          "fijan al construirlo y después nadie los cambia."
      };
    }
    return {
      ok: false,
      msg: "Siga el camino de la llamada desde la raíz hasta el subárbol vacío donde cae el 7 " +
        "y cuente un new NoVacio por cada nodo de ese camino, más el que nace en Vacio."
    };
  }

  function revisarCompartidas(valor) {
    var buena = SIETE.compartidos.length;
    if (valor === buena) {
      return {
        ok: true,
        msg: "Son " + buena + ": los nodos " + SIETE.compartidos.join(", ") +
          ". Ninguno está en el camino hacia el 7, así que entran al resultado como los " +
          "mismos objetos que ya tenía c."
      };
    }
    if (valor === 0) {
      return {
        ok: false,
        msg: "Si no se compartiera nada, cada inserción costaría copiar el árbol entero. " +
          "El subárbol que no cambia se pasa por donde está: new NoVacio(elem, izq insertar " +
          "x, der) entrega der sin tocarlo."
      };
    }
    if (valor === SIETE.nodosOriginal) {
      return {
        ok: false,
        msg: "Los siete nodos de c siguen existiendo, pero tres de ellos quedaron fuera del " +
          "resultado: el camino 10 → 8 → 6 se rehízo. Lo que se pregunta es cuántos nodos del " +
          "árbol nuevo son objetos del viejo."
      };
    }
    if (valor === SIETE.nodosResultado) {
      return {
        ok: false,
        msg: "Ese es el total de nodos del resultado, y entre ellos están los que acaba de " +
          "contar como construidos. Resta esos del total."
      };
    }
    return {
      ok: false,
      msg: "El resultado tiene " + SIETE.nodosResultado + " nodos NoVacio y usted contó " +
        SIETE.construcciones + " construidos. Los demás son los compartidos."
    };
  }

  function revisarNueve(valor) {
    var buena = NUEVE.construcciones;
    if (valor === buena) {
      return {
        ok: true,
        msg: "Son " + buena + ". La tercera rama devuelve this y el nodo 9 no se vuelve a " +
          "construir, pero las dos llamadas que quedaron esperando ya decidieron su rama: " +
          "el nodo 8 y la raíz 10 se construyen igual, con el mismo contenido. El resultado " +
          "tiene " + NUEVE.nodosResultado + " nodos, " + NUEVE.compartidos.length +
          " compartidos, y su recorrido en orden es " + NUEVE.listaResultado.join(", ") + "."
      };
    }
    if (valor === 0) {
      return {
        ok: false,
        msg: "El this de la tercera rama evita construir el nodo 9, y ahí se detiene el " +
          "ahorro: la llamada en el nodo 8 ya entró por la rama de " + NUEVE.x + " > 8 y su " +
          "cuerpo es un new NoVacio, aunque lo que reciba de der sea el mismo subárbol."
      };
    }
    if (valor === 3) {
      return {
        ok: false,
        msg: "El nodo 9 no se construye: la tercera rama devuelve this. Los que sí se " +
          "construyen son los de arriba, los que ya habían elegido rama antes de saber que " +
          "el elemento estaba."
      };
    }
    if (valor === 4) {
      return {
        ok: false,
        msg: "Con el 7 eran cuatro porque hacía falta un nodo nuevo. Con el 9 no nace ningún " +
          "elemento: mire cuántos nodos del camino quedan por encima del 9."
      };
    }
    return {
      ok: false,
      msg: "El camino es 10 → 8 → 9. Cuente en cuáles de esos tres nodos el cuerpo de " +
        "insertar llega a un new NoVacio."
    };
  }

  /* ---------- disposición del dibujo ---------- */

  function disponer(c) {
    var puestos = [];
    var columna = 0;

    function bajar(nodo, prof, ruta) {
      if (nodo.clase === "Vacio") {
        puestos.push({ ruta: ruta, clase: "Vacio", elem: null, col: columna, prof: prof, obj: nodo });
        columna = columna + 1;
        return;
      }
      bajar(nodo.izq, prof + 1, ruta + "i");
      puestos.push({ ruta: ruta, clase: "NoVacio", elem: nodo.elem, col: columna, prof: prof, obj: nodo });
      columna = columna + 1;
      bajar(nodo.der, prof + 1, ruta + "d");
    }

    bajar(c, 0, "");
    return puestos;
  }

  /* Cada puesto del árbol nuevo se marca comparando el objeto con los del viejo. */
  function marcas(viejo, nuevo) {
    var previos = nodos(viejo);
    return disponer(nuevo).map(function (p) {
      if (p.clase === "Vacio") {
        return { ruta: p.ruta, clase: "Vacio", elem: null, col: p.col, prof: p.prof, marca: "vacio" };
      }
      var compartido = previos.some(function (v) { return v === p.obj; });
      return {
        ruta: p.ruta, clase: "NoVacio", elem: p.elem, col: p.col, prof: p.prof,
        marca: compartido ? "compartido" : "construido"
      };
    });
  }

  var API = {
    VACIO: VACIO, noVacio: noVacio, insertar: insertar, listaEnteros: listaEnteros,
    nodos: nodos, INSERCIONES: INSERCIONES, ARBOL: ARBOL,
    insertarConTraza: insertarConTraza, reparto: reparto, informe: informe,
    SIETE: SIETE, NUEVE: NUEVE, revisarConstruidas: revisarConstruidas,
    revisarCompartidas: revisarCompartidas, revisarNueve: revisarNueve,
    disponer: disponer, marcas: marcas
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ================= la página ================= */

  var SVGNS = "http://www.w3.org/2000/svg";
  var ANCHO_COL = 47;
  var ALTO_NIVEL = 62;
  var MARGEN = 28;

  function cx(col) { return MARGEN + col * ANCHO_COL; }
  function cy(prof) { return 30 + prof * ALTO_NIVEL; }

  function buscar(puestos, ruta) {
    var hallado = null;
    puestos.forEach(function (p) { if (p.ruta === ruta) { hallado = p; } });
    return hallado;
  }

  function pintarArbol(destino, puestos, conMarca) {
    var maxCol = 0;
    var maxProf = 0;
    puestos.forEach(function (p) {
      if (p.col > maxCol) { maxCol = p.col; }
      if (p.prof > maxProf) { maxProf = p.prof; }
    });
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + (cx(maxCol) + MARGEN) + " " + (cy(maxProf) + MARGEN));
    svg.setAttribute("class", "arbol");

    puestos.forEach(function (p) {
      if (p.clase !== "NoVacio") { return; }
      ["i", "d"].forEach(function (lado) {
        var hijo = buscar(puestos, p.ruta + lado);
        if (hijo === null) { return; }
        var l = document.createElementNS(SVGNS, "line");
        l.setAttribute("x1", cx(p.col));
        l.setAttribute("y1", cy(p.prof) + 16);
        l.setAttribute("x2", cx(hijo.col));
        l.setAttribute("y2", cy(hijo.prof) - (hijo.clase === "Vacio" ? 9 : 16));
        l.setAttribute("class", "arista" +
          (conMarca && hijo.marca === "construido" ? " nueva" : ""));
        svg.appendChild(l);
      });
    });

    puestos.forEach(function (p) {
      var g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "nodo" + (conMarca ? " " + p.marca : ""));
      if (p.clase === "Vacio") {
        var rect = document.createElementNS(SVGNS, "rect");
        rect.setAttribute("x", cx(p.col) - 9);
        rect.setAttribute("y", cy(p.prof) - 9);
        rect.setAttribute("width", 18);
        rect.setAttribute("height", 18);
        rect.setAttribute("rx", 4);
        g.appendChild(rect);
      } else {
        var circ = document.createElementNS(SVGNS, "circle");
        circ.setAttribute("cx", cx(p.col));
        circ.setAttribute("cy", cy(p.prof));
        circ.setAttribute("r", 16);
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

  pintarArbol(document.getElementById("dibujo-original"), disponer(ARBOL), false);

  var acertadas = { construidas: false, compartidas: false };

  function leer(id) {
    var v = parseInt(document.getElementById(id).value, 10);
    return isNaN(v) ? null : v;
  }

  function responder(campo, idVer, res) {
    var v = document.getElementById(idVer);
    v.className = res.ok ? "veredicto bien" : "veredicto mal";
    v.textContent = res.msg;
    acertadas[campo] = res.ok;
    if (acertadas.construidas && acertadas.compartidas) {
      revelar();
    }
  }

  function revelar() {
    var carta = document.getElementById("carta-dibujo");
    carta.classList.remove("bloqueado");
    pintarArbol(document.getElementById("dibujo-nuevo"), marcas(ARBOL, SIETE.arbol), true);
    var traza = document.getElementById("traza");
    traza.innerHTML = "";
    SIETE.eventos.forEach(function (e) {
      var li = document.createElement("li");
      li.textContent = e.texto;
      traza.appendChild(li);
    });
    document.getElementById("listas").textContent =
      "val d = c insertar 7   ·   d en orden: " + SIETE.listaResultado.join(", ") +
      "   ·   c en orden: " + SIETE.listaOriginal.join(", ");
    document.getElementById("carta-nueve").classList.remove("bloqueado");
  }

  document.getElementById("btn-construidas").addEventListener("click", function () {
    var v = leer("pred-construidas");
    if (v === null) {
      responder("construidas", "ver-construidas",
        { ok: false, msg: "Escriba un número primero." });
      return;
    }
    responder("construidas", "ver-construidas", revisarConstruidas(v));
  });

  document.getElementById("btn-compartidas").addEventListener("click", function () {
    var v = leer("pred-compartidas");
    if (v === null) {
      responder("compartidas", "ver-compartidas",
        { ok: false, msg: "Escriba un número primero." });
      return;
    }
    responder("compartidas", "ver-compartidas", revisarCompartidas(v));
  });

  document.getElementById("btn-nueve").addEventListener("click", function () {
    var v = leer("pred-nueve");
    var ver = document.getElementById("ver-nueve");
    var res = v === null
      ? { ok: false, msg: "Escriba un número primero." }
      : revisarNueve(v);
    ver.className = res.ok ? "veredicto bien" : "veredicto mal";
    ver.textContent = res.msg;
    if (res.ok) {
      document.getElementById("carta-vieja").classList.remove("bloqueado");
    }
  });

  document.querySelectorAll("[data-vieja]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-vieja");
      document.querySelectorAll("[data-vieja]").forEach(function (o) { o.className = ""; });
      if (b.getAttribute("data-vieja") === "ok") {
        b.className = "primario";
        v.className = "veredicto bien";
        v.textContent = "Eso es. c.pertenece(7) sigue respondiendo false y el recorrido en " +
          "orden de c sigue siendo " + SIETE.listaOriginal.join(", ") + ". La inserción no " +
          "escribió en ningún nodo de c: construyó otros y reusó los que no cambiaban.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        b.className = "errada";
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
