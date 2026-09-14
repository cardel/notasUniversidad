/* Árbol: producto(i, j) parte el rango en dos y el proceso es un árbol
   binario. Cada llamada produce dos pasos, uno al entrar y otro al salir,
   así que se ve cuántos marcos están abiertos al mismo tiempo. Reproduce
   04_factorial_arbol.scala. */
(function () {
  var CODIGO = [
    { txt: "def producto(i: Int, j: Int): Int =", num: null },
    { txt: "  if (i >= j) 1", num: 1 },
    { txt: "  else if (i == j - 1) i", num: 2 },
    { txt: "  else {", num: null },
    { txt: "    val m = i + (j - i) / 2", num: null },
    { txt: "    producto(i, m) * producto(m, j)", num: 3 },
    { txt: "  }", num: null }
  ];

  /* Los nodos en orden de llamada, con su valor y su hondura. */
  function llamadas(i, j) {
    var nodos = [];
    function visitar(i, j, hondura) {
      var id = nodos.length;
      var nodo = { id: id, i: i, j: j, hondura: hondura, hoja: false, valor: null, linea: 3 };
      nodos.push(nodo);
      if (i >= j) { nodo.hoja = true; nodo.valor = 1; nodo.linea = 1; }
      else if (i === j - 1) { nodo.hoja = true; nodo.valor = i; nodo.linea = 2; }
      else {
        var m = i + Math.floor((j - i) / 2);
        nodo.m = m;
        var izq = visitar(i, m, hondura + 1);
        var der = visitar(m, j, hondura + 1);
        nodo.valor = izq.valor * der.valor;
      }
      return nodo;
    }
    visitar(i, j, 1);
    return nodos;
  }

  /* Los eventos: entrar a una llamada abre un marco; salir lo cierra. La
     pila que se guarda en cada evento es la que queda después de él. */
  function eventos(i, j) {
    var nodos = llamadas(i, j), ev = [], pila = [];
    function recorrer(id) {
      var n = nodos[id];
      pila.push(id);
      ev.push({ tipo: "entra", nodo: id, pila: pila.slice() });
      if (!n.hoja) {
        // los hijos son los dos nodos que siguen en el orden de llamada
        var izq = id + 1;
        recorrer(izq);
        var der = ultimoDe(izq) + 1;
        recorrer(der);
      }
      pila.pop();
      ev.push({ tipo: "sale", nodo: id, pila: pila.slice(), valor: n.valor });
    }
    function ultimoDe(id) {
      var n = nodos[id];
      if (n.hoja) { return id; }
      var izq = id + 1;
      var der = ultimoDe(izq) + 1;
      return ultimoDe(der);
    }
    recorrer(0);
    return { nodos: nodos, eventos: ev };
  }

  var PRESETS = [
    { i: 1, j: 3, rotulo: "producto(1, 3)" },
    { i: 1, j: 5, rotulo: "producto(1, 5)" },
    { i: 1, j: 9, rotulo: "producto(1, 9)" }
  ];

  function simular(preset) {
    var p = PRESETS[preset];
    var r = eventos(p.i, p.j);
    var entradas = 0, maxAb = 0;
    return r.eventos.map(function (e) {
      if (e.tipo === "entra") { entradas = entradas + 1; }
      maxAb = Math.max(maxAb, e.pila.length);
      return { linea: e.tipo === "entra" ? r.nodos[e.nodo].linea : null,
               llamadas: entradas, abiertos: e.pila.length, maxAbiertos: maxAb,
               tipo: e.tipo, nodo: e.nodo, pila: e.pila };
    });
  }

  var API = { llamadas: llamadas, eventos: eventos, simular: simular, PRESETS: PRESETS, posiciones: posiciones };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function etiqueta(n) { return "producto(" + n.i + ", " + n.j + ")"; }

  /* Posiciones: las hojas se reparten de izquierda a derecha en el orden en
     que aparecen; cada nodo interno se centra sobre sus hijos. */
  function posiciones(nodos) {
    var hijos = {};
    nodos.forEach(function (n) { hijos[n.id] = []; });
    // los hijos de un nodo interno son el siguiente y el que sigue al último descendiente del siguiente
    function ultimoDe(id) {
      var n = nodos[id];
      if (n.hoja) { return id; }
      var izq = id + 1, der = ultimoDe(izq) + 1;
      return ultimoDe(der);
    }
    nodos.forEach(function (n) {
      if (!n.hoja) { var izq = n.id + 1; hijos[n.id] = [izq, ultimoDe(izq) + 1]; }
    });
    var x = {}, siguiente = 0;
    function colocar(id) {
      var n = nodos[id];
      if (n.hoja) { x[id] = siguiente; siguiente = siguiente + 1; return; }
      hijos[id].forEach(colocar);
      x[id] = (x[hijos[id][0]] + x[hijos[id][1]]) / 2;
    }
    colocar(0);
    return { x: x, hijos: hijos, hojas: siguiente };
  }

  var SVG = "http://www.w3.org/2000/svg";
  function el(nombre, attrs) {
    var e = document.createElementNS(SVG, nombre);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  function pintar(e) {
    var p = PRESETS[e.params];
    var r = eventos(p.i, p.j);
    var nodos = r.nodos, pasos = e.pasos, k = e.k, actual = e.actual;

    // estado de cada nodo según los eventos ya ocurridos
    var estado = {}, ordenEntrada = {}, ordenSalida = {}, nEnt = 0, nSal = 0, m;
    for (m = 0; m < k; m = m + 1) {
      if (pasos[m].tipo === "entra") { nEnt = nEnt + 1; estado[pasos[m].nodo] = "abierto"; ordenEntrada[pasos[m].nodo] = nEnt; }
      else { nSal = nSal + 1; estado[pasos[m].nodo] = "resuelto"; ordenSalida[pasos[m].nodo] = nSal; }
    }
    var enPila = {};
    (actual ? actual.pila : []).forEach(function (id) { enPila[id] = true; });

    // el dibujo
    var pos = posiciones(nodos);
    var ANCHO = 150, ALTO = 74, MARGEN = 14;
    var maxH = Math.max.apply(null, nodos.map(function (n) { return n.hondura; }));
    var w = pos.hojas * ANCHO + MARGEN * 2, h = maxH * ALTO + MARGEN;
    var svg = document.getElementById("arbol-svg");
    svg.innerHTML = "";
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    function cx(id) { return MARGEN + pos.x[id] * ANCHO + ANCHO / 2; }
    function cy(id) { return MARGEN + (nodos[id].hondura - 1) * ALTO + 22; }

    // ramas primero, para que queden debajo de los nodos
    nodos.forEach(function (n) {
      pos.hijos[n.id].forEach(function (hid) {
        var visible = !!estado[hid];
        var camino = enPila[n.id] && enPila[hid];
        var clase = "rama" + (visible ? "" : " futura") + (camino ? " camino" : "");
        svg.appendChild(el("line", { x1: cx(n.id), y1: cy(n.id) + 18, x2: cx(hid), y2: cy(hid) - 18, "class": clase }));
      });
    });

    nodos.forEach(function (n) {
      var est = estado[n.id] || "oculto";
      var g = el("g", { "class": "nodo " + est + (n.hoja ? " hoja" : "") + (enPila[n.id] ? " en-pila" : "")
        + (actual && actual.nodo === n.id ? " actual" : ""), transform: "translate(" + cx(n.id) + "," + cy(n.id) + ")" });
      g.appendChild(el("rect", { x: -66, y: -18, width: 132, height: 36, rx: 8 }));
      var txt = el("text", { y: est === "resuelto" ? -3 : 5, "text-anchor": "middle", "class": "rotulo" });
      txt.textContent = est === "oculto" ? "·" : etiqueta(n);
      g.appendChild(txt);
      if (est === "resuelto") {
        var val = el("text", { y: 12, "text-anchor": "middle", "class": "valor" });
        val.textContent = "= " + n.valor;
        g.appendChild(val);
      }
      if (est !== "oculto") {
        // la insignia con el orden en que se abrió
        g.appendChild(el("circle", { cx: -66, cy: -18, r: 10, "class": "insignia" }));
        var num = el("text", { x: -66, y: -14, "text-anchor": "middle", "class": "insignia-num" });
        num.textContent = ordenEntrada[n.id];
        g.appendChild(num);
      }
      svg.appendChild(g);
    });

    // la pila de marcos abiertos, el más nuevo arriba, con la misma insignia
    var pila = document.getElementById("pila");
    pila.innerHTML = "";
    var abiertos = actual ? actual.pila : [];
    if (abiertos.length === 0) {
      var v = document.createElement("div"); v.className = "marco vacio"; v.textContent = "pila vacía"; pila.appendChild(v);
    }
    var q;
    for (q = abiertos.length - 1; q >= 0; q = q - 1) {
      var id = abiertos[q], nn = nodos[id];
      var mm = document.createElement("div");
      mm.className = "marco" + (q === abiertos.length - 1 ? " cima" : "");
      var ins = document.createElement("span"); ins.className = "ins"; ins.textContent = ordenEntrada[id];
      var lab = document.createElement("span"); lab.textContent = etiqueta(nn);
      var det = document.createElement("span"); det.className = "detalle";
      if (nn.hoja) { det.textContent = "devuelve " + nn.valor; }
      else {
        var izq = pos.hijos[id][0], der = pos.hijos[id][1];
        var vi = estado[izq] === "resuelto" ? nodos[izq].valor : "___";
        var vd = estado[der] === "resuelto" ? nodos[der].valor : "___";
        det.textContent = "espera " + vi + " * " + vd;
      }
      mm.appendChild(ins); mm.appendChild(lab); mm.appendChild(det);
      pila.appendChild(mm);
    }
    document.getElementById("pila-cuenta").textContent = abiertos.length
      + (abiertos.length === 1 ? " marco abierto" : " marcos abiertos");

    // el pie
    var pie = document.getElementById("pie-arbol");
    if (!actual) { pie.textContent = "Nadie ha llamado todavía."; return; }
    var n = nodos[actual.nodo];
    if (e.terminado) {
      pie.textContent = nodos.length + " llamadas en total, y nunca más de " + actual.maxAbiertos
        + " marcos abiertos al tiempo. Valor: " + nodos[0].valor + ".";
    } else if (actual.tipo === "entra" && n.hoja) {
      pie.textContent = "Se abre el marco " + ordenEntrada[n.id] + ", " + etiqueta(n) + ": es una hoja y devuelve " + n.valor + " de inmediato.";
    } else if (actual.tipo === "entra") {
      pie.textContent = "Se abre el marco " + ordenEntrada[n.id] + ", " + etiqueta(n) + ", y parte en m = " + n.m
        + ". Queda esperando a sus dos hijos.";
    } else {
      pie.textContent = "Se cierra el marco " + ordenEntrada[n.id] + ", " + etiqueta(n) + ", con " + n.valor
        + ". La pila baja a " + actual.pila.length + ".";
    }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 1,
    chips: [
      { campo: "llamadas", rotulo: "llamadas hechas" },
      { campo: "abiertos", rotulo: "marcos abiertos ahora", clase: "alerta" },
      { campo: "maxAbiertos", rotulo: "máximo abierto hasta aquí" }
    ],
    simular: simular,
    alPintar: pintar
  });

  /* Predicción principal: el máximo de marcos abiertos al tiempo. */
  Motor.prediccionNumerica(function (valor, preset) {
    var p = PRESETS[preset];
    var r = eventos(p.i, p.j);
    var maxH = Math.max.apply(null, r.nodos.map(function (n) { return n.hondura; }));
    var total = r.nodos.length;
    if (valor === maxH) {
      return { ok: true, msg: "Correcto: nunca hay más de " + maxH + " marcos abiertos al tiempo, uno por nivel del árbol. "
        + "Las " + total + " llamadas no están abiertas todas a la vez: cada rama se cierra antes de abrir la siguiente." };
    }
    if (valor === total) {
      return { ok: false, msg: "No. " + total + " es el total de llamadas, pero no están abiertas todas a la vez. "
        + "Cuando la rama izquierda termina, sus marcos ya se cerraron antes de abrir la derecha. El máximo es " + maxH + "." };
    }
    return { ok: false, msg: "No. Es " + maxH + ": la hondura del árbol. Avance y mire la pila: sube por una rama, "
      + "vuelve a bajar, y solo entonces sube por la otra." };
  });

  /* Segunda predicción: el total de llamadas. */
  document.getElementById("btn-comprobar-llamadas").addEventListener("click", function () {
    var campo = document.getElementById("prediccion-llamadas");
    var v = document.getElementById("veredicto-llamadas");
    var valor = parseInt(campo.value, 10);
    var preset = parseInt(document.querySelector("[data-preset].primario").getAttribute("data-preset"), 10);
    var p = PRESETS[preset];
    var total = llamadas(p.i, p.j).length, n = p.j - p.i;
    if (isNaN(valor)) { v.className = "veredicto mal"; v.textContent = "Escriba un número primero."; return; }
    if (valor === total) {
      v.className = "veredicto bien";
      v.textContent = "Correcto: " + total + " llamadas. " + n + " hojas y " + (n - 1) + " nodos que parten, 2n − 1.";
    } else if (valor === n) {
      v.className = "veredicto mal";
      v.textContent = "No. " + n + " son solo las hojas. Los nodos que parten también son llamadas: 2n − 1 = " + total + ".";
    } else {
      v.className = "veredicto mal";
      v.textContent = "No. Son " + total + ". El contador de la línea del * cuenta los que parten; el de las hojas, los que devuelven un número.";
    }
  });

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      Motor.limpiarVeredicto();
      document.getElementById("prediccion").value = "";
      document.getElementById("prediccion-llamadas").value = "";
      var vl = document.getElementById("veredicto-llamadas"); vl.className = "veredicto"; vl.textContent = "";
      Motor.reiniciar(parseInt(b.getAttribute("data-preset"), 10));
    });
  });
})();
