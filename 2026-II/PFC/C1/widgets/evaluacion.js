/* Llamado por valor contra llamado por nombre, lado a lado.
   Las dos columnas avanzan a la vez; la que termina antes se queda quieta. */
(function () {
  var CODIGO = [
    { txt: "def cuadrado(x: Int): Int = x * x", num: 1 },
    { txt: "def sumaDeCuadrados(x: Int, y: Int): Int =", num: null },
    { txt: "  cuadrado(x) + cuadrado(y)", num: 2 },
    { txt: "def primero(x: Int, y: Int): Int = x", num: 3 },
    { txt: "def bucle: Int = bucle", num: 4 }
  ];

  var PRESETS = [
    {
      rotulo: "sumaDeCuadrados(3, 2 + 2)",
      cbv: [
        { expr: "sumaDeCuadrados(3, 2 + 2)", marca: "2 + 2", linea: null },
        { expr: "sumaDeCuadrados(3, 4)", marca: "sumaDeCuadrados(3, 4)", linea: 2 },
        { expr: "cuadrado(3) + cuadrado(4)", marca: "cuadrado(3)", linea: 1 },
        { expr: "3 * 3 + cuadrado(4)", marca: "3 * 3", linea: null },
        { expr: "9 + cuadrado(4)", marca: "cuadrado(4)", linea: 1 },
        { expr: "9 + 4 * 4", marca: "4 * 4", linea: null },
        { expr: "9 + 16", marca: "9 + 16", linea: null },
        { expr: "25", marca: "25", linea: null }
      ],
      cbn: [
        { expr: "sumaDeCuadrados(3, 2 + 2)", marca: "sumaDeCuadrados(3, 2 + 2)", linea: 2 },
        { expr: "cuadrado(3) + cuadrado(2 + 2)", marca: "cuadrado(3)", linea: 1 },
        { expr: "3 * 3 + cuadrado(2 + 2)", marca: "3 * 3", linea: null },
        { expr: "9 + cuadrado(2 + 2)", marca: "cuadrado(2 + 2)", linea: 1 },
        { expr: "9 + (2 + 2) * (2 + 2)", marca: "(2 + 2)", linea: null },
        { expr: "9 + 4 * (2 + 2)", marca: "(2 + 2)", linea: null },
        { expr: "9 + 4 * 4", marca: "4 * 4", linea: null },
        { expr: "9 + 16", marca: "9 + 16", linea: null },
        { expr: "25", marca: "25", linea: null }
      ],
      nota: "Mismo valor, distinto camino. Por nombre, 2 + 2 se reduce dos "
        + "veces: el argumento entró sin evaluar y quedó copiado en los dos "
        + "lugares donde aparece y."
    },
    {
      rotulo: "cuadrado(2 + 3)",
      cbv: [
        { expr: "cuadrado(2 + 3)", marca: "2 + 3", linea: null },
        { expr: "cuadrado(5)", marca: "cuadrado(5)", linea: 1 },
        { expr: "5 * 5", marca: "5 * 5", linea: null },
        { expr: "25", marca: "25", linea: null }
      ],
      cbn: [
        { expr: "cuadrado(2 + 3)", marca: "cuadrado(2 + 3)", linea: 1 },
        { expr: "(2 + 3) * (2 + 3)", marca: "(2 + 3)", linea: null },
        { expr: "5 * (2 + 3)", marca: "(2 + 3)", linea: null },
        { expr: "5 * 5", marca: "5 * 5", linea: null },
        { expr: "25", marca: "25", linea: null }
      ],
      nota: "El caso más corto donde se ve la duplicación: x aparece dos veces "
        + "en el cuerpo de cuadrado, así que por nombre el argumento se reduce "
        + "dos veces."
    },
    {
      rotulo: "primero(1, bucle)",
      cbv: [
        { expr: "primero(1, bucle)", marca: "bucle", linea: 4 },
        { expr: "primero(1, bucle)", marca: "bucle", linea: 4 },
        { expr: "primero(1, bucle)", marca: "bucle", linea: 4 },
        { expr: "primero(1, bucle)", marca: "bucle", linea: 4 },
        { expr: "…", marca: "…", linea: null, infinito: true }
      ],
      cbn: [
        { expr: "primero(1, bucle)", marca: "primero(1, bucle)", linea: 3 },
        { expr: "1", marca: "1", linea: null }
      ],
      nota: "Aquí las dos estrategias no coinciden. Por valor hay que reducir "
        + "bucle antes de entrar a primero, y bucle se reduce a sí mismo para "
        + "siempre. Por nombre el argumento nunca se mira, porque el cuerpo de "
        + "primero no lo usa."
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

  function pintarColumna(id, lista, hasta) {
    var caja = document.getElementById(id);
    caja.innerHTML = "";
    var tope = Math.min(hasta, lista.length);
    var i;
    for (i = 0; i < tope; i = i + 1) {
      var fila = document.createElement("div");
      var esUltima = i === tope - 1;
      fila.className = "reduccion" + (esUltima ? " ultima" : "")
        + (lista[i].infinito ? " infinita" : "");
      var flecha = document.createElement("span");
      flecha.className = "flecha-red";
      flecha.textContent = i === 0 ? "" : "→";
      var texto = document.createElement("code");
      texto.className = "expr";
      if (esUltima && !lista[i].infinito) {
        texto.appendChild(resaltar(lista[i].expr, lista[i].marca));
      } else {
        texto.textContent = lista[i].expr;
      }
      fila.appendChild(flecha);
      fila.appendChild(texto);
      caja.appendChild(fila);
    }
    var pie = document.createElement("div");
    pie.className = "pie-columna";
    if (tope >= lista.length) {
      pie.textContent = lista[lista.length - 1].infinito
        ? "no termina" : "valor: " + lista[lista.length - 1].expr;
      pie.className += lista[lista.length - 1].infinito ? " malo" : " bueno";
    } else {
      pie.textContent = "reduciendo…";
    }
    caja.appendChild(pie);
  }

  function pintar(e) {
    var p = PRESETS[e.params];
    var hasta = e.k === 0 ? 1 : e.k;
    pintarColumna("col-cbv", p.cbv, hasta);
    pintarColumna("col-cbn", p.cbn, hasta);
    document.getElementById("nota-preset").textContent = e.terminado ? p.nota : "";
  }

  var cfg = {
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "pasosCbv", rotulo: "pasos por valor" },
      { campo: "pasosCbn", rotulo: "pasos por nombre" }
    ],
    simular: function (preset) {
      var p = PRESETS[preset];
      var total = Math.max(p.cbv.length, p.cbn.length);
      var salida = [];
      var i;
      for (i = 0; i < total; i = i + 1) {
        var deCbv = p.cbv[Math.min(i, p.cbv.length - 1)];
        salida.push({
          linea: i < p.cbv.length ? deCbv.linea : null,
          pasosCbv: Math.min(i + 1, p.cbv.length) + (p.cbv[p.cbv.length - 1].infinito ? "+" : ""),
          pasosCbn: Math.min(i + 1, p.cbn.length)
        });
      }
      return salida;
    },
    alPintar: pintar
  };

  Motor.iniciar(cfg);

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) {
        o.className = "";
      });
      b.className = "primario";
      Motor.reiniciar(parseInt(b.getAttribute("data-preset"), 10));
    });
  });

  document.querySelectorAll("#opciones-resultado button").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-resultado");
      var op = b.getAttribute("data-op");
      if (op === "termina") {
        v.className = "veredicto bien";
        v.textContent = "Correcto. Cuando las dos terminan dan el mismo valor; "
          + "la diferencia aparece cuando una de las dos no termina.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else if (op === "siempre") {
        v.className = "veredicto mal";
        v.textContent = "No. Pruebe el preset primero(1, bucle): por nombre "
          + "da 1 y por valor no termina nunca.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "No. En los dos primeros presets el valor final es el "
          + "mismo, 25; lo que cambia es el número de pasos.";
      }
    });
  });
})();
