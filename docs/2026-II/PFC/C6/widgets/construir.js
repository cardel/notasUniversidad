/* construir: los dos constructores de listas y las tres operaciones basicas.
   El codigo del panel sale literal de los frames "Los dos constructores de
   listas" y "Las tres operaciones basicas: head, tail, isEmpty" de
   ListasParte1.tex. La simulacion evalua las dos piezas en el orden en que el
   deck las escribe: primero la construccion de List(1, 2, 3) de derecha a
   izquierda, despues los selectores sobre frutas. */
(function () {

  /* ── El codigo del deck ────────────────────────────────────────── */

  var CODIGO = [
    { num: 1, txt: 'val paso1 = Nil              // List()', bloque: 1 },
    { num: 2, txt: 'val paso2 = 3 :: Nil         // List(3)', bloque: 1 },
    { num: 3, txt: 'val paso3 = 2 :: paso2       // List(2, 3)', bloque: 1 },
    { num: 4, txt: 'val paso4 = 1 :: paso3       // List(1, 2, 3)', bloque: 1 },
    { num: null, txt: '' },
    { num: 6, txt: 'val frutas = List("manzana", "lulo", "guayaba")', bloque: 2 },
    { num: null, txt: '' },
    { num: 8, txt: 'frutas.head          // "manzana"', bloque: 3 },
    { num: 9, txt: 'frutas.tail          // List("lulo", "guayaba")', bloque: 3 },
    { num: 10, txt: 'frutas.tail.head     // "lulo"', bloque: 3 },
    { num: 11, txt: 'frutas.isEmpty       // false', bloque: 3 },
    { num: 12, txt: 'Nil.isEmpty          // true', bloque: 3 }
  ];

  var PARAMS = { numeros: [1, 2, 3], frutas: ["manzana", "lulo", "guayaba"] };

  /* ── La simulacion ─────────────────────────────────────────────── */

  function mostrar(v) {
    return typeof v === "string" ? '"' + v + '"' : String(v);
  }

  function textoLista(xs) {
    return "List(" + xs.map(mostrar).join(", ") + ")";
  }

  function celdasDe(xs) {
    return xs.map(function (v) { return String(v); });
  }

  /* Un paso por cada expresion que se evalua. celdas es la cadena de nodos que
     el dibujo muestra, nueva el nodo que :: acaba de poner al frente y cabeza
     el nodo al que apunta head. */
  function simular(params) {
    var numeros = params.numeros;
    var frutas = params.frutas;
    var pasos = [];
    var acumulada = [];
    var cola = frutas.slice(1);
    var i;

    function anotar(linea, extra) {
      var p = {
        linea: linea, queda: null, tomado: null, devuelve: null,
        celdas: [], nueva: null, cabeza: null
      };
      Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
      pasos.push(p);
    }

    anotar(1, {
      queda: textoLista(acumulada),
      devuelve: textoLista(acumulada),
      celdas: []
    });

    for (i = numeros.length - 1; i >= 0; i = i - 1) {
      acumulada = [numeros[i]].concat(acumulada);
      anotar(numeros.length - i + 1, {
        queda: textoLista(acumulada),
        tomado: mostrar(numeros[i]),
        devuelve: textoLista(acumulada),
        celdas: celdasDe(acumulada),
        nueva: 0
      });
    }

    anotar(6, {
      queda: textoLista(frutas),
      devuelve: textoLista(frutas),
      celdas: celdasDe(frutas)
    });

    anotar(8, {
      queda: textoLista(frutas),
      tomado: mostrar(frutas[0]),
      devuelve: mostrar(frutas[0]),
      celdas: celdasDe(frutas),
      cabeza: 0
    });

    anotar(9, {
      queda: textoLista(cola),
      tomado: mostrar(frutas[0]),
      devuelve: textoLista(cola),
      celdas: celdasDe(cola)
    });

    anotar(10, {
      queda: textoLista(cola),
      devuelve: textoLista(cola),
      celdas: celdasDe(cola)
    });

    if (cola.length === 0) {
      anotar(10, {
        queda: "List()",
        devuelve: "NoSuchElementException",
        celdas: []
      });
    } else {
      anotar(10, {
        queda: textoLista(cola),
        tomado: mostrar(cola[0]),
        devuelve: mostrar(cola[0]),
        celdas: celdasDe(cola),
        cabeza: 0
      });
    }

    anotar(11, {
      queda: textoLista(frutas),
      devuelve: String(frutas.length === 0),
      celdas: celdasDe(frutas)
    });

    anotar(12, {
      queda: "List()",
      devuelve: "true",
      celdas: []
    });

    return pasos;
  }

  var API = {
    CODIGO: CODIGO, PARAMS: PARAMS,
    mostrar: mostrar, textoLista: textoLista, simular: simular
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ── El dibujo de la cadena ────────────────────────────────────── */

  /* Los dos rotulos que el deck pone encima de la cadena. */
  var ROTULOS = ["head", "tail.head"];

  function dibujarCadena(paso) {
    var caja = document.getElementById("cadena");
    var celdas = paso === null ? [] : paso.celdas;
    caja.innerHTML = "";

    celdas.forEach(function (valor, idx) {
      var grupo = document.createElement("div");
      var rotulo = document.createElement("div");
      var celda = document.createElement("div");
      var dato = document.createElement("span");
      var puntero = document.createElement("span");
      grupo.className = "grupo-celda";
      rotulo.className = "rotulo-celda" + (idx === 0 ? " primero" : "");
      rotulo.textContent = ROTULOS[idx] === undefined ? "" : ROTULOS[idx];
      celda.className = "celda-lista";
      if (paso.nueva === idx) { celda.className = celda.className + " nueva"; }
      if (paso.cabeza === idx) { celda.className = celda.className + " tomada"; }
      dato.className = "dato";
      dato.textContent = valor;
      puntero.className = "puntero";
      celda.appendChild(dato);
      celda.appendChild(puntero);
      grupo.appendChild(rotulo);
      grupo.appendChild(celda);
      caja.appendChild(grupo);

      var flecha = document.createElement("div");
      flecha.className = "flecha-cadena";
      flecha.textContent = "→";
      caja.appendChild(flecha);
    });

    var fin = document.createElement("div");
    var rotuloFin = document.createElement("div");
    var cajaNil = document.createElement("div");
    fin.className = "grupo-celda";
    rotuloFin.className = "rotulo-celda";
    rotuloFin.textContent = "";
    cajaNil.className = "celda-nil";
    cajaNil.textContent = "Nil";
    fin.appendChild(rotuloFin);
    fin.appendChild(cajaNil);
    caja.appendChild(fin);
  }

  function alPintar(e) {
    dibujarCadena(e.actual);
    document.getElementById("largo").textContent =
      e.actual === null ? "0" : String(e.actual.celdas.length);
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: PARAMS,
    simular: simular,
    chips: [
      { campo: "queda", rotulo: "lista" },
      { campo: "tomado", rotulo: "elemento tomado" },
      { campo: "devuelve", rotulo: "devuelve" }
    ],
    alPintar: alPintar
  });
})();
