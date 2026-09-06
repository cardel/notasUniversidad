/* Modelo de sustitución: reducir una expresión hasta el valor.
   Cada paso reemplaza una sola cosa, y el widget resalta cuál. */
(function () {
  var CODIGO = [
    { txt: "def cuadrado(x: Int): Int = x * x", num: 1 },
    { txt: "", num: null },
    { txt: "def sumaDeCuadrados(x: Int, y: Int): Int =", num: null },
    { txt: "  cuadrado(x) + cuadrado(y)", num: 2 },
    { txt: "", num: null },
    { txt: "sumaDeCuadrados(3, 2 + 2)", num: 3 }
  ];

  /* Cada preset trae la reducción completa escrita a mano: es la única forma
     de que el resaltado señale exactamente el trozo que se reemplaza, que es
     lo que hay que mirar. `marca` es el fragmento a resaltar en `expr`. */
  var PRESETS = [
    {
      rotulo: "sumaDeCuadrados(3, 2 + 2)",
      pasos: [
        { expr: "sumaDeCuadrados(3, 2 + 2)", marca: "2 + 2", linea: 3,
          regla: "El argumento todavía no es un valor: primero se reduce." },
        { expr: "sumaDeCuadrados(3, 4)", marca: "sumaDeCuadrados(3, 4)", linea: 2,
          regla: "Ya son valores. Se reemplaza la llamada por el cuerpo, con x = 3 e y = 4." },
        { expr: "cuadrado(3) + cuadrado(4)", marca: "cuadrado(3)", linea: 1,
          regla: "Se reemplaza cuadrado(3) por su cuerpo, con x = 3." },
        { expr: "3 * 3 + cuadrado(4)", marca: "3 * 3", linea: null,
          regla: "Una multiplicación de valores se resuelve." },
        { expr: "9 + cuadrado(4)", marca: "cuadrado(4)", linea: 1,
          regla: "Se reemplaza cuadrado(4) por su cuerpo, con x = 4." },
        { expr: "9 + 4 * 4", marca: "4 * 4", linea: null,
          regla: "Otra multiplicación de valores." },
        { expr: "9 + 16", marca: "9 + 16", linea: null,
          regla: "La suma final." },
        { expr: "25", marca: "25", linea: null,
          regla: "Ya es un valor: no hay nada más que reducir." }
      ]
    },
    {
      rotulo: "cuadrado(2 + 3)",
      pasos: [
        { expr: "cuadrado(2 + 3)", marca: "2 + 3", linea: null,
          regla: "El argumento no es un valor todavía." },
        { expr: "cuadrado(5)", marca: "cuadrado(5)", linea: 1,
          regla: "Se reemplaza la llamada por el cuerpo, con x = 5." },
        { expr: "5 * 5", marca: "5 * 5", linea: null,
          regla: "Una multiplicación de valores." },
        { expr: "25", marca: "25", linea: null,
          regla: "Ya es un valor." }
      ]
    },
    {
      rotulo: "sumaDeCuadrados(2 + 1, 4)",
      pasos: [
        { expr: "sumaDeCuadrados(2 + 1, 4)", marca: "2 + 1", linea: 3,
          regla: "El primer argumento no es un valor." },
        { expr: "sumaDeCuadrados(3, 4)", marca: "sumaDeCuadrados(3, 4)", linea: 2,
          regla: "Se reemplaza la llamada por el cuerpo." },
        { expr: "cuadrado(3) + cuadrado(4)", marca: "cuadrado(3)", linea: 1,
          regla: "Se reemplaza cuadrado(3) por su cuerpo." },
        { expr: "3 * 3 + cuadrado(4)", marca: "3 * 3", linea: null,
          regla: "Multiplicación de valores." },
        { expr: "9 + cuadrado(4)", marca: "cuadrado(4)", linea: 1,
          regla: "Se reemplaza cuadrado(4) por su cuerpo." },
        { expr: "9 + 4 * 4", marca: "4 * 4", linea: null,
          regla: "Multiplicación de valores." },
        { expr: "9 + 16", marca: "9 + 16", linea: null, regla: "La suma final." },
        { expr: "25", marca: "25", linea: null, regla: "Ya es un valor." }
      ]
    }
  ];

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
      if (i === hasta - 1 && i < lista.length) {
        texto.appendChild(resaltar(lista[i].expr, lista[i].marca));
      } else {
        texto.textContent = lista[i].expr;
      }
      fila.appendChild(flecha);
      fila.appendChild(texto);
      caja.appendChild(fila);
    }
    var regla = document.getElementById("regla");
    var actual = lista[Math.min(hasta, lista.length) - 1];
    regla.textContent = actual ? actual.regla : "";
  }

  var cfg = {
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "expr", rotulo: "expresión" },
      { campo: "restantes", rotulo: "pasos que faltan" }
    ],
    simular: function (preset) {
      return PRESETS[preset].pasos.map(function (p, i, todos) {
        return {
          linea: p.linea,
          expr: p.expr,
          restantes: todos.length - 1 - i
        };
      });
    },
    alPintar: pintarReduccion
  };

  Motor.iniciar(cfg);

  Motor.prediccionNumerica(function (valor, preset) {
    var real = PRESETS[preset].pasos.length - 1;
    if (valor === real) {
      return { ok: true, msg: "Correcto: " + real + " reducciones hasta el valor." };
    }
    return {
      ok: false,
      msg: "No. Son " + real + " reducciones. Cuente una por cada flecha: "
        + "cada paso reemplaza una sola cosa."
    };
  });

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) {
        o.className = "";
      });
      b.className = "primario";
      Motor.limpiarVeredicto();
      document.getElementById("prediccion").value = "";
      Motor.reiniciar(parseInt(b.getAttribute("data-preset"), 10));
    });
  });

  /* Tarjeta de opción única: qué se reduce primero. */
  document.querySelectorAll("#opciones-orden button").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-orden");
      var op = b.getAttribute("data-op");
      if (op === "argumentos") {
        v.className = "veredicto bien";
        v.textContent = "Correcto. Con llamado por valor los argumentos se "
          + "reducen a valores antes de reemplazar la función por su cuerpo.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = "No. Mire el primer paso del preset: lo que cambia es "
          + "el argumento, no la llamada.";
      }
    });
  });
})();
