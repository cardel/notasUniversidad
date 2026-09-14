/* Pendientes: la versión lineal y la de cola corriendo lado a lado sobre la
   misma entrada. El chip que importa es cuántas operaciones esperan.
   Reproduce 01_factorial_recursivo, 02_factorial_iterativo y 03_suma_versiones. */
(function () {
  var CODIGO = [
    { txt: "def factorial(n: Int): Int =", num: null },
    { txt: "  if (n == 0) 1", num: 1 },
    { txt: "  else n * factorial(n - 1)", num: 2 },
    { txt: "", num: null },
    { txt: "def factIter(cont: Int, prod: Int, n: Int): Int =", num: null },
    { txt: "  if (cont > n) prod", num: 3 },
    { txt: "  else factIter(cont + 1, cont * prod, n)", num: 4 },
    { txt: "", num: null },
    { txt: "def sumaLineal(a: Int, b: Int): Int =", num: null },
    { txt: "  if (a == 0) b else suc(sumaLineal(pred(a), b))", num: 5 },
    { txt: "def sumaIter(a: Int, b: Int): Int =", num: null },
    { txt: "  if (a == 0) b else sumaIter(pred(a), suc(b))", num: 6 }
  ];

  function anidar(pend, centro) {
    var s = centro, i;
    for (i = pend.length - 1; i >= 0; i = i - 1) {
      s = pend[i] + " * " + (i === pend.length - 1 ? s : "(" + s + ")");
    }
    return s;
  }

  /* marcos: las llamadas abiertas en ese instante, de la más vieja a la
     más nueva. Cada uno dice qué tiene adentro: los de abajo esperan su
     multiplicación; el de arriba está entrando, o acaba de recibir el valor
     del que se cerró y hace su cuenta. */
  function marcosFact(n, hasta, cima) {
    var M = [], k;
    for (k = n; k >= hasta; k = k - 1) {
      var m = { rotulo: "factorial(" + k + ")", detalle: "espera " + k + " * ___" };
      if (k === hasta) {
        if (cima.modo === "entra") { m.detalle = k === 0 ? "entra con n = 0: caso base, devuelve 1" : "entra con n = " + k; }
        else { m.detalle = "recibe " + cima.recibe + ": hace " + k + " * " + cima.recibe + " = " + (k * cima.recibe); }
      }
      M.push(m);
    }
    return M;
  }

  function lineal(n) {
    var L = [], pend = [], k, prod;
    L.push({ expr: "factorial(" + n + ")", esperando: 0, linea: 2, marcos: marcosFact(n, n, { modo: "entra" }) });
    for (k = n; k >= 1; k = k - 1) {
      pend.push(k);
      L.push({ expr: anidar(pend, "factorial(" + (k - 1) + ")"), esperando: pend.length,
               linea: k - 1 === 0 ? 1 : 2, marcos: marcosFact(n, k - 1, { modo: "entra" }) });
    }
    L.push({ expr: anidar(pend, "1"), esperando: pend.length, linea: null,
             marcos: marcosFact(n, 1, { modo: "recibe", recibe: 1 }) });
    prod = 1;
    while (pend.length > 0) {
      var c = pend.pop(); var recibido = prod; prod = c * prod;
      L.push({ expr: anidar(pend, String(prod)), esperando: pend.length, linea: null,
               marcos: pend.length === 0 ? [] : marcosFact(n, c + 1, { modo: "recibe", recibe: prod }),
               devuelto: pend.length === 0 ? prod : null });
    }
    return L;
  }

  /* En la de cola la llamada nueva reemplaza a la vieja: el marco es uno
     solo y cambia de contenido. El detalle dice a quién reemplazó y qué
     cuenta hizo antes de llamar. */
  function cola(n) {
    var L = [], cont = 1, prod = 1;
    L.push({ expr: "fact(" + n + ")", esperando: 0, linea: null,
             marcos: [{ rotulo: "fact(" + n + ")", detalle: "entra y llama a factIter(1, 1, " + n + ")" }] });
    var anterior = "fact(" + n + ")";
    while (cont <= n) {
      var f = "factIter(" + cont + ", " + prod + ", " + n + ")";
      L.push({ expr: f, esperando: 0, linea: 4,
               marcos: [{ rotulo: f, detalle: "reemplaza a " + anterior + " · calcula " + cont + " * " + prod + " = " + (cont * prod) + " y llama" }] });
      anterior = f; prod = cont * prod; cont = cont + 1;
    }
    var ult = "factIter(" + cont + ", " + prod + ", " + n + ")";
    L.push({ expr: ult, esperando: 0, linea: 3,
             marcos: [{ rotulo: ult, detalle: "reemplaza a " + anterior + " · cont > n: devuelve prod" }] });
    L.push({ expr: String(prod), esperando: 0, linea: null, marcos: [], devuelto: prod });
    return L;
  }

  function envolver(n, centro) { var s = centro, i; for (i = 0; i < n; i = i + 1) { s = "suc(" + s + ")"; } return s; }

  function marcosSuma(a, hasta, b, cima) {
    var M = [], k;
    for (k = a; k >= hasta; k = k - 1) {
      var m = { rotulo: "sumaLineal(" + k + ", " + b + ")", detalle: "espera suc(___)" };
      if (k === hasta) {
        if (cima.modo === "entra") { m.detalle = k === 0 ? "entra con a = 0: caso base, devuelve " + b : "entra con a = " + k; }
        else { m.detalle = "recibe " + cima.recibe + ": hace suc(" + cima.recibe + ") = " + (cima.recibe + 1); }
      }
      M.push(m);
    }
    return M;
  }

  function sumaL(a, b) {
    var L = [], k, sucs = 0, v;
    L.push({ expr: "sumaLineal(" + a + ", " + b + ")", esperando: 0, linea: 5, marcos: marcosSuma(a, a, b, { modo: "entra" }) });
    for (k = a; k >= 1; k = k - 1) {
      sucs = sucs + 1;
      L.push({ expr: envolver(sucs, "sumaLineal(" + (k - 1) + ", " + b + ")"), esperando: sucs, linea: 5,
               marcos: marcosSuma(a, k - 1, b, { modo: "entra" }) });
    }
    L.push({ expr: envolver(sucs, String(b)), esperando: sucs, linea: null, marcos: marcosSuma(a, 1, b, { modo: "recibe", recibe: b }) });
    v = b;
    while (sucs > 0) {
      sucs = sucs - 1; v = v + 1;
      L.push({ expr: envolver(sucs, String(v)), esperando: sucs, linea: null,
               marcos: sucs === 0 ? [] : marcosSuma(a, a - sucs + 1, b, { modo: "recibe", recibe: v }),
               devuelto: sucs === 0 ? v : null });
    }
    return L;
  }

  function sumaI(a, b) {
    var L = [];
    var f0 = "sumaIter(" + a + ", " + b + ")";
    L.push({ expr: f0, esperando: 0, linea: 6, marcos: [{ rotulo: f0, detalle: "entra con a = " + a + ", b = " + b }] });
    var anterior = f0;
    while (a > 0) {
      var na = a - 1, nb = b + 1;
      var f = "sumaIter(" + na + ", " + nb + ")";
      L.push({ expr: f, esperando: 0, linea: 6,
               marcos: [{ rotulo: f, detalle: "reemplaza a " + anterior + " · pred(" + a + ") = " + na + ", suc(" + b + ") = " + nb }] });
      anterior = f; a = na; b = nb;
    }
    L.push({ expr: String(b), esperando: 0, linea: null, marcos: [], devuelto: b });
    return L;
  }

  var PRESETS = [
    { rotulo: "factorial(4) · fact(4)", izq: lineal(4), der: cola(4), tope: 5,
      nombres: ["factorial(4)", "fact(4)"] },
    { rotulo: "factorial(6) · fact(6)", izq: lineal(6), der: cola(6), tope: 7,
      nombres: ["factorial(6)", "fact(6)"] },
    { rotulo: "sumaLineal(3, 5) · sumaIter(3, 5)", izq: sumaL(3, 5), der: sumaI(3, 5), tope: 4,
      nombres: ["sumaLineal(3, 5)", "sumaIter(3, 5)"] }
  ];

  var API = { PRESETS: PRESETS, lineal: lineal, cola: cola, sumaL: sumaL, sumaI: sumaI };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function pintarColumna(id, lista, hasta) {
    var caja = document.getElementById(id);
    caja.innerHTML = "";
    var tope = Math.min(hasta, lista.length), i;
    for (i = 0; i < tope; i = i + 1) {
      var fila = document.createElement("div");
      fila.className = "reduccion" + (i === tope - 1 ? " ultima" : "");
      var flecha = document.createElement("span");
      flecha.className = "flecha-red"; flecha.textContent = i === 0 ? "" : "→";
      var texto = document.createElement("code");
      texto.className = "expr"; texto.textContent = lista[i].expr;
      fila.appendChild(flecha); fila.appendChild(texto); caja.appendChild(fila);
    }
    var pie = document.createElement("div");
    pie.className = "pie-columna" + (tope >= lista.length ? " bueno" : "");
    pie.textContent = tope >= lista.length ? "valor: " + lista[lista.length - 1].expr
      : "esperando: " + lista[tope - 1].esperando;
    caja.appendChild(pie);
  }

  /* La pila: un marco por caja, el más nuevo arriba, con su número de
     hondura y lo que tiene adentro. En la de cola la caja es la misma. */
  function pintarPila(id, lista, hasta, reemplaza) {
    var caja = document.getElementById(id);
    var paso = lista[Math.min(hasta, lista.length) - 1];
    var marcos = paso.marcos || [];
    caja.innerHTML = "";
    if (marcos.length === 0) {
      var vacio = document.createElement("div");
      vacio.className = "marco vacio";
      vacio.textContent = paso.devuelto !== null && paso.devuelto !== undefined
        ? "pila vacía: devolvió " + paso.devuelto : "pila vacía";
      caja.appendChild(vacio);
    }
    var i;
    for (i = marcos.length - 1; i >= 0; i = i - 1) {
      var m = document.createElement("div");
      m.className = "marco" + (i === marcos.length - 1 ? " cima" : "") + (reemplaza ? " reemplazado" : "");
      var ins = document.createElement("span"); ins.className = "ins"; ins.textContent = i + 1;
      var rot = document.createElement("span"); rot.textContent = marcos[i].rotulo;
      var det = document.createElement("span"); det.className = "detalle"; det.textContent = marcos[i].detalle;
      m.appendChild(ins); m.appendChild(rot); m.appendChild(det);
      caja.appendChild(m);
    }
    var cuenta = document.getElementById(id + "-cuenta");
    cuenta.textContent = marcos.length + (marcos.length === 1 ? " marco abierto" : " marcos abiertos");
  }

  function pintar(e) {
    var p = PRESETS[e.params];
    var hasta = e.k === 0 ? 1 : e.k;
    pintarColumna("col-izq", p.izq, hasta);
    pintarColumna("col-der", p.der, hasta);
    pintarPila("pila-izq", p.izq, hasta, false);
    pintarPila("pila-der", p.der, hasta, true);
    document.getElementById("nom-izq").textContent = p.nombres[0];
    document.getElementById("nom-der").textContent = p.nombres[1];
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "marIzq", rotulo: "marcos abiertos a la izquierda", clase: "alerta" },
      { campo: "marDer", rotulo: "marcos abiertos a la derecha" },
      { campo: "espIzq", rotulo: "esperando a la izquierda" }
    ],
    simular: function (preset) {
      var p = PRESETS[preset];
      var total = Math.max(p.izq.length, p.der.length), pasos = [], i;
      for (i = 0; i < total; i = i + 1) {
        var a = p.izq[Math.min(i, p.izq.length - 1)];
        var b = p.der[Math.min(i, p.der.length - 1)];
        pasos.push({ linea: i < p.izq.length ? a.linea : (i < p.der.length ? b.linea : null),
                     espIzq: a.esperando, espDer: b.esperando,
                     marIzq: (a.marcos || []).length, marDer: (b.marcos || []).length });
      }
      return pasos;
    },
    alPintar: pintar
  });

  Motor.prediccionNumerica(function (valor, preset) {
    var tope = PRESETS[preset].tope;
    if (valor === tope) {
      return { ok: true, msg: "Correcto: en el punto más hondo la izquierda tiene " + tope
        + " marcos abiertos al tiempo, uno por llamada incluido el caso base. La derecha nunca pasa de 1." };
    }
    if (valor === tope - 1) {
      return { ok: false, msg: "Casi. Son " + tope + ": las " + (tope - 1) + " que dejan algo esperando, más el marco "
        + "del caso base, que está abierto mientras devuelve. Es lo que midió la sesión: n + 1." };
    }
    return { ok: false, msg: "No. Son " + tope + " a la izquierda: cada llamada abre un marco y ninguno se cierra "
      + "hasta que el de abajo devuelve. A la derecha siempre 1, porque cada llamada reemplaza a la anterior." };
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
