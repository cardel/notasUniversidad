/* Ejercicio interactivo: lo que cuesta correr elementos (clase 15). */
var EJERCICIO = (function () {
  var CAPACIDAD = 8;
  var OPERACIONES = [
    { texto: "agregar(3)", tipo: "agregar", e: 3 },
    { texto: "agregar(1)", tipo: "agregar", e: 1 },
    { texto: "agregar(8)", tipo: "agregar", e: 8 },
    { texto: "insertar(0, 6)", tipo: "insertar", p: 0, e: 6 },
    { texto: "insertar(2, 4)", tipo: "insertar", p: 2, e: 4 },
    { texto: "insertar(0, 9)", tipo: "insertar", p: 0, e: 9 }
  ];

  /* insertar(p, e) de la lista estatica: corre hacia la derecha lo que va de p
     en adelante y devuelve cuantas veces lo hizo. */
  function insertar(estado, p, e) {
    var corrimientos = 0;
    var i = estado.n;
    while (i > p) {
      estado.datos[i] = estado.datos[i - 1];
      i = i - 1;
      corrimientos = corrimientos + 1;
    }
    estado.datos[p] = e;
    estado.n = estado.n + 1;
    return corrimientos;
  }

  /* Corre la secuencia completa desde la lista vacia. */
  function correr(operaciones) {
    var estado = { datos: new Array(CAPACIDAD), n: 0 };
    var pasos = [];
    var total = 0;
    operaciones.forEach(function (op) {
      var p = op.tipo === "agregar" ? estado.n : op.p;
      var corrimientos = insertar(estado, p, op.e);
      total = total + corrimientos;
      pasos.push({
        texto: op.texto,
        destino: p,
        corrimientos: corrimientos,
        lista: estado.datos.slice(0, estado.n)
      });
    });
    return { pasos: pasos, total: total, final: estado.datos.slice(0, estado.n) };
  }

  /* Los corrimientos de las tres llamadas con posicion explicita. */
  function corrimientosDeInsertar(operaciones) {
    var pasos = correr(operaciones).pasos;
    var salida = [];
    pasos.forEach(function (paso, i) {
      if (operaciones[i].tipo === "insertar") { salida.push(paso.corrimientos); }
    });
    return salida;
  }

  return {
    capacidad: CAPACIDAD,
    operaciones: OPERACIONES,
    correr: correr,
    corrimientosDeInsertar: corrimientosDeInsertar
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      lineas.forEach(function (par, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (par[1] ? " " + par[1] : "");
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = par[0];
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }
    function leerLista(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    var logradas = { corr: false, final: false };
    function revisar() {
      if (logradas.corr && logradas.final) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var RESULTADO = EJERCICIO.correr(EJERCICIO.operaciones);
    var ESPERADOS = EJERCICIO.corrimientosDeInsertar(EJERCICIO.operaciones);

    pintarCodigo("codigo-insertar", [
      ["Elemento datos[CAPACIDAD];", ""],
      ["int n;", ""],
      ["", ""],
      ["void insertar(int p, Elemento e) {", "bloque-1"],
      ["  assert(0 <= p && p <= n && n < CAPACIDAD);", ""],
      ["  int i = n;", "bloque-2"],
      ["  while (i > p) {", "bloque-2"],
      ["    datos[i] = datos[i - 1];", "bloque-2"],
      ["    i = i - 1;", "bloque-2"],
      ["  }", ""],
      ["  datos[p] = e;", "bloque-3"],
      ["  n = n + 1;", "bloque-3"],
      ["}", ""]
    ]);

    document.getElementById("btn-corr").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-corr");
      var dada = leerLista(document.getElementById("pred-corr").value);
      if (iguales(dada, ESPERADOS)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 3, 2 y 5. El ciclo va de i = n hasta i = p + 1, así que hace n - p corrimientos con la n de ese momento: insertar(0, 6) sobre tres elementos corre los tres; insertar(2, 4) sobre cuatro corre los dos que estaban en 2 y 3; insertar(0, 9) sobre cinco corre los cinco. Los seis pasos suman " + RESULTADO.total + " corrimientos.";
        logradas.corr = true; revisar();
      } else if (iguales(dada, [4, 3, 6])) {
        ver.className = "veredicto mal";
        ver.textContent = "datos[p] = e escribe el elemento nuevo en el hueco que quedó: no mueve nada. Cuente solo las vueltas del while.";
      } else if (dada.length === 3 && dada[0] === ESPERADOS[0] && dada[2] === ESPERADOS[2]) {
        ver.className = "veredicto mal";
        ver.textContent = "La primera y la tercera están bien. Para insertar(2, 4) la lista tiene cuatro elementos y p es 2: se corren los que están en las casillas 2 y 3.";
      } else if (dada.length !== 3) {
        ver.className = "veredicto mal";
        ver.textContent = "Tres números, uno por cada insertar con posición explícita, en el orden en que se ejecutan.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Anote el tamaño de la lista justo antes de cada insertar: 3, 4 y 5. El ciclo corre n - p elementos.";
      }
    });

    document.getElementById("btn-final").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-final");
      var dada = leerLista(document.getElementById("pred-final").value);
      if (iguales(dada, RESULTADO.final)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 9 6 3 4 1 8. Los agregar dejan 3 1 8; insertar(0, 6) mete el 6 al principio y da 6 3 1 8; insertar(2, 4) parte esa lista entre el 3 y el 1 y da 6 3 4 1 8; insertar(0, 9) vuelve a meter al principio.";
        logradas.final = true; revisar();
      } else if (iguales(dada, [3, 1, 8, 6, 4, 9])) {
        ver.className = "veredicto mal";
        ver.textContent = "insertar(0, e) mete el elemento al principio, no al final: el que se agrega de último queda en la casilla 0.";
      } else if (iguales(dada, [6, 3, 4, 1, 8])) {
        ver.className = "veredicto mal";
        ver.textContent = "Faltó la última operación: insertar(0, 9) agrega un sexto elemento al frente.";
      } else if (dada.length !== 6) {
        ver.className = "veredicto mal";
        ver.textContent = "Seis operaciones insertan seis elementos y ninguna borra: la lista queda con seis.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Aplique las operaciones una a una y dibuje las casillas después de cada una. El paso a paso de abajo las muestra.";
      }
    });

    var vista = { i: 0 };
    function chip(padre, rotulo, valor, cuenta) {
      var d = document.createElement("div");
      d.className = "chip" + (cuenta ? " cuenta" : "");
      var b = document.createElement("b");
      b.textContent = rotulo + ": ";
      d.appendChild(b);
      d.appendChild(document.createTextNode(String(valor)));
      padre.appendChild(d);
    }
    function pintarVista() {
      var chips = document.getElementById("chips-corr");
      var caja = document.getElementById("arreglo-corr");
      chips.innerHTML = "";
      caja.innerHTML = "";
      var i = vista.i;
      var lista = i === 0 ? [] : RESULTADO.pasos[i - 1].lista;
      var texto = i === 0 ? "la lista vacía" : RESULTADO.pasos[i - 1].texto;
      var corr = i === 0 ? 0 : RESULTADO.pasos[i - 1].corrimientos;
      var destino = i === 0 ? -1 : RESULTADO.pasos[i - 1].destino;
      var acumulado = 0;
      var k = 0;
      while (k < i) { acumulado = acumulado + RESULTADO.pasos[k].corrimientos; k = k + 1; }
      chip(chips, "operación", texto, false);
      chip(chips, "n", lista.length, false);
      chip(chips, "corrimientos", corr, true);
      chip(chips, "acumulados", acumulado, true);
      lista.forEach(function (v, idx) {
        var c = document.createElement("div");
        c.className = "caja" + (idx === destino ? " actual" : "");
        var ind = document.createElement("span");
        ind.className = "indice";
        ind.textContent = idx;
        c.appendChild(ind);
        c.appendChild(document.createTextNode(String(v)));
        caja.appendChild(c);
      });
      document.getElementById("progreso-corr").textContent =
        i + " de " + RESULTADO.pasos.length + " operaciones";
      document.getElementById("btn-paso").disabled = i === RESULTADO.pasos.length;
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.i < RESULTADO.pasos.length) { vista.i = vista.i + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarVista();
    });
    pintarVista();
  })();
}
