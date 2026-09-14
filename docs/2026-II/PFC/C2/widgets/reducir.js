/* Reducir: el modelo de sustitución sobre una función recursiva. Cada paso
   reemplaza una sola cosa y se resalta cuál. Las tres funciones son las de
   01_factorial_recursivo, 03_suma_versiones y 07_multiplicar_al_final. */
(function () {
  var CODIGO = [
    { txt: "def factorial(n: Int): Int =", num: null },
    { txt: "  if (n == 0) 1", num: 1 },
    { txt: "  else n * factorial(n - 1)", num: 2 },
    { txt: "", num: null },
    { txt: "def pred(a: Int): Int = a - 1", num: 3 },
    { txt: "def suc(a: Int): Int  = a + 1", num: 4 },
    { txt: "def sumaLineal(a: Int, b: Int): Int =", num: null },
    { txt: "  if (a == 0) b", num: 5 },
    { txt: "  else suc(sumaLineal(pred(a), b))", num: 6 },
    { txt: "", num: null },
    { txt: "def factorialAlFinal(n: Int): Int =", num: null },
    { txt: "  if (n == 0) 1", num: 7 },
    { txt: "  else factorialAlFinal(n - 1) * n", num: 8 }
  ];

  /* a * (b * (c * X)) para pendientes [a, b, c]. */
  function anidarDerecha(pendientes, centro) {
    var s = centro, i;
    for (i = pendientes.length - 1; i >= 0; i = i - 1) {
      s = pendientes[i] + " * " + (i === pendientes.length - 1 ? s : "(" + s + ")");
    }
    return s;
  }

  function factorialPasos(n) {
    var pasos = [], pend = [], k, prod;
    pasos.push({ expr: "factorial(" + n + ")", marca: "factorial(" + n + ")", linea: 2,
      regla: "Se reemplaza la llamada por el cuerpo, con n = " + n + ". El " + n + " * queda esperando." });
    for (k = n; k >= 1; k = k - 1) {
      pend.push(k);
      var sig = k - 1;
      pasos.push({ expr: anidarDerecha(pend, "factorial(" + sig + ")"),
        marca: "factorial(" + sig + ")", linea: sig === 0 ? 1 : 2,
        regla: sig === 0
          ? "Caso base: factorial(0) es 1, sin llamar a nadie. La pila está en su punto más alto."
          : "Otra llamada, otra multiplicación que espera. Ya son " + pend.length + "." });
    }
    pasos.push({ expr: anidarDerecha(pend, "1"), marca: "1", linea: null,
      regla: "factorial(0) se reemplaza por 1. Ahora sí hay una multiplicación entre dos valores." });
    prod = 1;
    while (pend.length > 0) {
      var c = pend.pop();
      var marca = c + " * " + prod;
      var nuevo = c * prod;
      pasos.push({ expr: anidarDerecha(pend, String(nuevo)), marca: String(nuevo), linea: null,
        regla: "La multiplicación más adentro es la única que ya se puede hacer: " + marca + " = " + nuevo + "." });
      prod = nuevo;
    }
    return pasos;
  }

  function sumaLinealPasos(a, b) {
    var pasos = [], k, sucs = 0;
    function envolver(n, centro) { var s = centro, i; for (i = 0; i < n; i = i + 1) { s = "suc(" + s + ")"; } return s; }
    pasos.push({ expr: "sumaLineal(" + a + ", " + b + ")", marca: "sumaLineal(" + a + ", " + b + ")", linea: 6,
      regla: "Cuerpo con a = " + a + ", b = " + b + ". El suc queda esperando." });
    for (k = a; k >= 1; k = k - 1) {
      sucs = sucs + 1;
      pasos.push({ expr: envolver(sucs, "sumaLineal(pred(" + k + "), " + b + ")"),
        marca: "pred(" + k + ")", linea: 3,
        regla: "Por valor: el argumento pred(" + k + ") se reduce antes de entrar." });
      var sig = k - 1;
      pasos.push({ expr: envolver(sucs, "sumaLineal(" + sig + ", " + b + ")"),
        marca: "sumaLineal(" + sig + ", " + b + ")", linea: sig === 0 ? 5 : 6,
        regla: sig === 0 ? "Caso base: sumaLineal(0, " + b + ") es " + b + "."
          : "Otra llamada, otro suc esperando. Ya son " + sucs + "." });
    }
    var valor = b;
    pasos.push({ expr: envolver(sucs, String(b)), marca: String(b), linea: null,
      regla: "sumaLineal(0, " + b + ") se reemplaza por " + b + ". Ahora el suc de adentro tiene un valor." });
    while (sucs > 0) {
      sucs = sucs - 1;
      valor = valor + 1;
      pasos.push({ expr: envolver(sucs, String(valor)), marca: String(valor), linea: 4,
        regla: "El suc más adentro se resuelve: " + (valor - 1) + " + 1 = " + valor + "." });
    }
    return pasos;
  }

  /* ((X * 1) * 2) * 3 para pendientes [3, 2, 1]: la multiplicación del otro lado. */
  function anidarIzquierda(pendientes, centro) {
    var s = centro, i;
    for (i = pendientes.length - 1; i >= 0; i = i - 1) {
      s = (i === pendientes.length - 1 ? s : "(" + s + ")") + " * " + pendientes[i];
    }
    return s;
  }

  function alFinalPasos(n) {
    var pasos = [], pend = [], k, prod;
    pasos.push({ expr: "factorialAlFinal(" + n + ")", marca: "factorialAlFinal(" + n + ")", linea: 8,
      regla: "Cuerpo con n = " + n + ". La multiplicación está del otro lado, y espera igual." });
    for (k = n; k >= 1; k = k - 1) {
      pend.push(k);
      var sig = k - 1;
      pasos.push({ expr: anidarIzquierda(pend, "factorialAlFinal(" + sig + ")"),
        marca: "factorialAlFinal(" + sig + ")", linea: sig === 0 ? 7 : 8,
        regla: sig === 0 ? "Caso base. " + pend.length + " multiplicaciones esperando, igual que en factorial."
          : "Da lo mismo de qué lado esté el * : sigue sin poderse hacer." });
    }
    pasos.push({ expr: anidarIzquierda(pend, "1"), marca: "1", linea: null,
      regla: "factorialAlFinal(0) se reemplaza por 1." });
    prod = 1;
    while (pend.length > 0) {
      var c = pend.pop();
      var nuevo = prod * c;
      pasos.push({ expr: anidarIzquierda(pend, String(nuevo)), marca: String(nuevo), linea: null,
        regla: "La más adentro: " + prod + " * " + c + " = " + nuevo + "." });
      prod = nuevo;
    }
    return pasos;
  }

  var PRESETS = [
    { rotulo: "factorial(3)", pasos: factorialPasos(3) },
    { rotulo: "sumaLineal(2, 5)", pasos: sumaLinealPasos(2, 5) },
    { rotulo: "factorialAlFinal(3)", pasos: alFinalPasos(3) },
    { rotulo: "factorial(5)", pasos: factorialPasos(5) }
  ];

  var API = { PRESETS: PRESETS, factorialPasos: factorialPasos,
    sumaLinealPasos: sumaLinealPasos, alFinalPasos: alFinalPasos };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function resaltar(expr, marca) {
    var i = expr.indexOf(marca);
    if (i < 0) { return document.createTextNode(expr); }
    var frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(expr.slice(0, i)));
    var b = document.createElement("span");
    b.className = "marca";
    b.textContent = marca;
    frag.appendChild(b);
    frag.appendChild(document.createTextNode(expr.slice(i + marca.length)));
    return frag;
  }

  function pintarReduccion(e) {
    var caja = document.getElementById("panel-reduccion");
    caja.innerHTML = "";
    var lista = PRESETS[e.params].pasos;
    var hasta = e.k === 0 ? 1 : e.k;
    var i;
    for (i = 0; i < hasta && i < lista.length; i = i + 1) {
      var fila = document.createElement("div");
      fila.className = "reduccion" + (i === hasta - 1 ? " ultima" : "");
      var flecha = document.createElement("span");
      flecha.className = "flecha-red";
      flecha.textContent = i === 0 ? "" : "→";
      var texto = document.createElement("code");
      texto.className = "expr";
      if (i === hasta - 1) { texto.appendChild(resaltar(lista[i].expr, lista[i].marca)); }
      else { texto.textContent = lista[i].expr; }
      fila.appendChild(flecha);
      fila.appendChild(texto);
      caja.appendChild(fila);
    }
    var actual = lista[Math.min(hasta, lista.length) - 1];
    document.getElementById("regla").textContent = actual ? actual.regla : "";
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "expr", rotulo: "expresión" },
      { campo: "restantes", rotulo: "pasos que faltan" }
    ],
    simular: function (preset) {
      return PRESETS[preset].pasos.map(function (p, i, todos) {
        return { linea: p.linea, expr: p.expr, restantes: todos.length - 1 - i };
      });
    },
    alPintar: pintarReduccion
  });

  Motor.prediccionNumerica(function (valor, preset) {
    var real = PRESETS[preset].pasos.length - 1;
    if (valor === real) {
      return { ok: true, msg: "Correcto: " + real + " reemplazos hasta el valor." };
    }
    return { ok: false, msg: "No. Son " + real + ". Cuente la bajada y la subida por separado: "
      + "la bajada abre una llamada por paso, la subida cierra una operación por paso." };
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
