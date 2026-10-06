/* Ejercicio interactivo: la cola de arreglo y el residuo (clase 18). */
var EJERCICIO = (function () {
  var CAPACIDAD = 5;
  var OPERACIONES = [
    { op: "encolar", valor: "a" },
    { op: "encolar", valor: "b" },
    { op: "encolar", valor: "c" },
    { op: "encolar", valor: "d" },
    { op: "desencolar" },
    { op: "desencolar" },
    { op: "encolar", valor: "e" },
    { op: "encolar", valor: "f" }
  ];
  var LINEAS = [
    "void encolar(Elemento e) {",
    "  assert(n < CAPACIDAD);",
    "  datos[(inicio + n) % CAPACIDAD] = e;",
    "  n = n + 1;",
    "}",
    "// exige !vacia()",
    "void desencolar() {",
    "  assert(n > 0);",
    "  inicio = (inicio + 1) % CAPACIDAD;",
    "  n = n - 1;",
    "}"
  ];

  /* Lo que sale de la cola, del frente al final: n casillas desde inicio. */
  function contenido(datos, capacidad, inicio, n) {
    var salida = [];
    var i = 0;
    while (i < n) {
      salida.push(datos[(inicio + i) % capacidad]);
      i = i + 1;
    }
    return salida;
  }

  /* Corre la secuencia y guarda una foto del arreglo tras cada operacion. */
  function corrida(capacidad, operaciones) {
    var datos = [];
    var i = 0;
    while (i < capacidad) {
      datos.push(null);
      i = i + 1;
    }
    var inicio = 0;
    var n = 0;
    var pasos = [];
    var casillas = [];
    var k = 0;
    while (k < operaciones.length) {
      var o = operaciones[k];
      var casilla = null;
      var texto = "";
      if (o.op === "encolar") {
        casilla = (inicio + n) % capacidad;
        datos[casilla] = o.valor;
        n = n + 1;
        texto = "encolar(" + o.valor + "): (" + inicio + " + " + (n - 1) +
                ") % " + capacidad + " = " + casilla;
        casillas.push(casilla);
      } else {
        inicio = (inicio + 1) % capacidad;
        n = n - 1;
        texto = "desencolar(): inicio pasa a " + inicio + " y n a " + n;
      }
      pasos.push({
        texto: texto,
        inicio: inicio,
        n: n,
        casilla: casilla,
        datos: datos.slice(),
        contenido: contenido(datos, capacidad, inicio, n)
      });
      k = k + 1;
    }
    return {
      pasos: pasos,
      casillas: casillas,
      inicioFinal: inicio,
      nFinal: n,
      contenidoFinal: contenido(datos, capacidad, inicio, n)
    };
  }

  return { capacidad: CAPACIDAD, operaciones: OPERACIONES, lineas: LINEAS,
           corrida: corrida, contenido: contenido };
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
    function leerPalabras(texto) {
      return texto.trim().toLowerCase().split(/[\s,]+/)
                  .filter(function (x) { return x !== ""; });
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    var logradas = { casillas: false, enteros: false, contenido: false };
    function revisar() {
      if (logradas.casillas && logradas.enteros && logradas.contenido) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var R = EJERCICIO.corrida(EJERCICIO.capacidad, EJERCICIO.operaciones);

    pintarCodigo("codigo-cola", EJERCICIO.lineas.map(function (t, i) {
      return [t, i < 5 ? "bloque-1" : (i > 5 ? "bloque-2" : "")];
    }));

    document.getElementById("btn-casillas").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-casillas");
      var dada = leerPalabras(document.getElementById("pred-casillas").value);
      var esperado = R.casillas.map(String);
      if (iguales(dada, esperado)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + esperado.join(", ") +
          ". Los cuatro primeros caen seguidos porque inicio vale 0. Tras los dos desencolar, inicio vale 2 y n vale 2, así que e cae en (2 + 2) % 5 = 4 y f en (2 + 3) % 5 = 0: la cola da la vuelta y vuelve a la casilla donde estaba a.";
        logradas.casillas = true; revisar();
      } else if (iguales(dada, ["0", "1", "2", "3", "4", "5"])) {
        ver.className = "veredicto mal";
        ver.textContent = "No hay casilla 5: con CAPACIDAD = 5 los índices van de 0 a 4 y el residuo trae el sexto de vuelta al principio.";
      } else if (iguales(dada, ["0", "1", "2", "3", "2", "3"])) {
        ver.className = "veredicto mal";
        ver.textContent = "El índice no es n, es (inicio + n) % CAPACIDAD. Los dos desencolar suben inicio a 2 y bajan n a 2, y la suma de los dos es lo que decide la casilla.";
      } else if (dada.length !== 6) {
        ver.className = "veredicto mal";
        ver.textContent = "Seis números, uno por cada encolar: a, b, c, d, e y f.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Lleve inicio y n en una tabla y evalúe (inicio + n) % 5 antes de cada escritura. El paso a paso de abajo los muestra.";
      }
    });

    var VACIO = [];
    (function () {
      var i = 0;
      while (i < EJERCICIO.capacidad) { VACIO.push(null); i = i + 1; }
    })();

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
      var chips = document.getElementById("chips-cola");
      var caja = document.getElementById("arreglo-cola");
      chips.innerHTML = "";
      caja.innerHTML = "";
      var i = vista.i;
      var estado = i === 0
        ? { inicio: 0, n: 0, casilla: null, datos: VACIO.slice(),
            contenido: [], texto: "la cola arranca vacía" }
        : R.pasos[i - 1];
      chip(chips, "inicio", estado.inicio, false);
      chip(chips, "n", estado.n, true);
      chip(chips, "frente", estado.n === 0 ? "la cola está vacía" : estado.datos[estado.inicio], false);
      var vivas = [];
      var k = 0;
      while (k < estado.n) {
        vivas.push((estado.inicio + k) % EJERCICIO.capacidad);
        k = k + 1;
      }
      var j = 0;
      while (j < EJERCICIO.capacidad) {
        var cel = document.createElement("div");
        var clases = "caja";
        if (vivas.indexOf(j) !== -1) { clases = clases + " visitada"; }
        if (estado.n > 0 && j === estado.inicio) { clases = clases + " actual"; }
        cel.className = clases;
        var idx = document.createElement("span");
        idx.className = "indice";
        idx.textContent = j;
        cel.appendChild(idx);
        cel.appendChild(document.createTextNode(estado.datos[j] === null ? "" : estado.datos[j]));
        caja.appendChild(cel);
        j = j + 1;
      }
      document.getElementById("progreso-cola").textContent =
        i === 0 ? "sin ejecutar ninguna operación"
                : "operación " + i + " de " + R.pasos.length + ": " + estado.texto;
      document.getElementById("btn-paso").disabled = i === R.pasos.length;
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.i < R.pasos.length) { vista.i = vista.i + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarVista();
    });
    pintarVista();

    document.getElementById("btn-enteros").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-enteros");
      var a = parseInt(document.getElementById("pred-inicio").value, 10);
      var b = parseInt(document.getElementById("pred-n").value, 10);
      if (a === R.inicioFinal && b === R.nFinal) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: inicio = " + R.inicioFinal + " y n = " + R.nFinal +
          ". Dos desencolar suben inicio de 0 a 2; n sube con los seis encolar y baja con los dos desencolar, así que queda en 6 - 2 = 4.";
        logradas.enteros = true; revisar();
      } else if (a === 0) {
        ver.className = "veredicto mal";
        ver.textContent = "inicio no vuelve a 0: cada desencolar lo adelanta una casilla y aquí hubo dos, sin que ningún encolar lo toque.";
      } else if (b === 6) {
        ver.className = "veredicto mal";
        ver.textContent = "n es cuántos elementos hay, no cuántos entraron: los dos desencolar lo bajan.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "inicio solo lo mueve desencolar y n lo mueven las dos operaciones, una hacia arriba y la otra hacia abajo.";
      }
    });

    document.getElementById("btn-contenido").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-contenido");
      var dada = leerPalabras(document.getElementById("pred-contenido").value);
      if (iguales(dada, R.contenidoFinal)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + R.contenidoFinal.join(", ") +
          ". Las casillas se leen desde inicio dando la vuelta: 2, 3, 4 y 0. a y b salieron en los dos desencolar, y f ocupa la casilla 0 donde había quedado a.";
        logradas.contenido = true; revisar();
      } else if (iguales(dada, ["f", "e", "d", "c"])) {
        ver.className = "veredicto mal";
        ver.textContent = "Ese es el orden de una pila. En la cola sale primero lo que entró primero, y de los que quedan el más viejo es c.";
      } else if (iguales(dada, ["c", "d", "e"]) || dada.length !== R.contenidoFinal.length) {
        ver.className = "veredicto mal";
        ver.textContent = "Quedan " + R.nFinal + " elementos: entraron seis y salieron dos.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Lea el arreglo desde la casilla inicio y siga n casillas, volviendo a la 0 al pasarse del final.";
      }
    });
  })();
}
