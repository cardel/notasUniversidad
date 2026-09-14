/* Árbol: producto(i, j) parte el rango en dos y el proceso es un árbol
   binario. Se dibuja un nodo por paso, en el orden en que se llama.
   Reproduce 04_factorial_arbol.scala. */
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

  /* Recorre las llamadas en el orden en que ocurren y anota, por nodo, el
     índice de su último descendiente: cuando ese índice ya se mostró, el
     nodo tiene valor. */
  function llamadas(i, j) {
    var nodos = [];
    function visitar(i, j, hondura, padre) {
      var id = nodos.length;
      var nodo = { id: id, i: i, j: j, hondura: hondura, padre: padre, hoja: false, valor: null, ultimo: id };
      nodos.push(nodo);
      if (i >= j) { nodo.hoja = true; nodo.valor = 1; nodo.linea = 1; }
      else if (i === j - 1) { nodo.hoja = true; nodo.valor = i; nodo.linea = 2; }
      else {
        var m = i + Math.floor((j - i) / 2);
        nodo.linea = 3;
        var izq = visitar(i, m, hondura + 1, id);
        var der = visitar(m, j, hondura + 1, id);
        nodo.valor = izq.valor * der.valor;
        nodo.ultimo = der.ultimo;
      }
      return nodo;
    }
    visitar(i, j, 1, null);
    return nodos;
  }

  function simular(preset) {
    var p = PRESETS[preset];
    var nodos = llamadas(p.i, p.j);
    return nodos.map(function (n, k) {
      return { linea: n.linea, llamadas: k + 1, hondura: n.hondura,
               nodo: k, maxHondura: Math.max.apply(null, nodos.slice(0, k + 1).map(function (x) { return x.hondura; })) };
    });
  }

  var PRESETS = [
    { i: 1, j: 3, rotulo: "producto(1, 3)" },
    { i: 1, j: 5, rotulo: "producto(1, 5)" },
    { i: 1, j: 9, rotulo: "producto(1, 9)" }
  ];

  var API = { llamadas: llamadas, simular: simular, PRESETS: PRESETS };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function pintarArbol(e) {
    var p = PRESETS[e.params];
    var nodos = llamadas(p.i, p.j);
    var visibles = e.k;
    var caja = document.getElementById("arbol");
    caja.innerHTML = "";
    var maxH = Math.max.apply(null, nodos.map(function (n) { return n.hondura; }));
    var h;
    for (h = 1; h <= maxH; h = h + 1) {
      var fila = document.createElement("div");
      fila.className = "nivel";
      var rot = document.createElement("span");
      rot.className = "rot-nivel"; rot.textContent = "nivel " + h;
      fila.appendChild(rot);
      nodos.forEach(function (n) {
        if (n.hondura !== h) { return; }
        var caj = document.createElement("span");
        if (n.id >= visibles) { caj.className = "nodo oculto"; caj.textContent = "·"; }
        else {
          var resuelto = n.ultimo < visibles;
          caj.className = "nodo" + (n.hoja ? " hoja" : "") + (resuelto ? " resuelto" : "")
            + (n.id === visibles - 1 ? " actual" : "");
          caj.textContent = "producto(" + n.i + ", " + n.j + ")" + (resuelto ? " = " + n.valor : "");
        }
        fila.appendChild(caj);
      });
      caja.appendChild(fila);
    }
    var pie = document.getElementById("pie-arbol");
    if (visibles === 0) { pie.textContent = "Nadie ha llamado todavía."; return; }
    var n = nodos[visibles - 1];
    if (e.terminado) {
      pie.textContent = nodos.length + " llamadas en total, " + maxH + " niveles. Valor: " + nodos[0].valor + ".";
    } else if (n.hoja) {
      pie.textContent = "producto(" + n.i + ", " + n.j + ") es una hoja: devuelve " + n.valor + " sin partir nada.";
    } else {
      var m = n.i + Math.floor((n.j - n.i) / 2);
      pie.textContent = "producto(" + n.i + ", " + n.j + ") parte en m = " + m + ": producto(" + n.i + ", " + m + ") * producto(" + m + ", " + n.j + ").";
    }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 1,
    chips: [
      { campo: "llamadas", rotulo: "llamadas hechas" },
      { campo: "hondura", rotulo: "hondura actual" },
      { campo: "maxHondura", rotulo: "hondura máxima", clase: "alerta" }
    ],
    simular: simular,
    alPintar: pintarArbol
  });

  Motor.prediccionNumerica(function (valor, preset) {
    var p = PRESETS[preset];
    var total = llamadas(p.i, p.j).length;
    var n = p.j - p.i;
    if (valor === total) {
      return { ok: true, msg: "Correcto: " + total + " llamadas. Hay " + n + " hojas y " + (n - 1)
        + " nodos que parten, y " + n + " + " + (n - 1) + " = 2n − 1." };
    }
    if (valor === n) {
      return { ok: false, msg: "No. " + n + " son solo las hojas. Cada nodo que parte también es una llamada: en total 2n − 1 = " + total + "." };
    }
    return { ok: false, msg: "No. Son " + total + ". Avance y cuente: el contador de la línea del * cuenta los nodos que parten, "
      + "el de las hojas los que devuelven un número." };
  });

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      Motor.limpiarVeredicto();
      document.getElementById("prediccion").value = "";
      Motor.reiniciar(parseInt(b.getAttribute("data-preset"), 10));
    });
  });
})();
