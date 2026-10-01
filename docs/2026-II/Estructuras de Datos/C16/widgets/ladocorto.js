/* Ejercicio interactivo: llegar a la posicion por el lado corto (clase 16). */
var EJERCICIO = (function () {
  var N = 12;
  var P = 10;
  var LINEAS = [
    "Nodo *nodoEn(int p) {",
    "  Nodo *actual = cabeza;",
    "  if (p <= n / 2) {",
    "    int i = 0;",
    "    while (i < p) {",
    "      actual = actual->siguiente;",
    "      i = i + 1;",
    "    }",
    "  } else {",
    "    int i = n;",
    "    while (i > p) {",
    "      actual = actual->anterior;",
    "      i = i - 1;",
    "    }",
    "  }",
    "  return actual;",
    "}"
  ];

  /* Siempre con siguiente: p pasos. */
  function deFrente(p) {
    var pasos = 0;
    var i = 0;
    while (i < p) {
      i = i + 1;
      pasos = pasos + 1;
    }
    return pasos;
  }

  /* Escogiendo el lado: hacia adelante en la primera mitad, hacia atras en la otra. */
  function porElLadoCorto(n, p) {
    var pasos = 0;
    if (p <= Math.floor(n / 2)) {
      var i = 0;
      while (i < p) {
        i = i + 1;
        pasos = pasos + 1;
      }
    } else {
      var j = n;
      while (j > p) {
        j = j - 1;
        pasos = pasos + 1;
      }
    }
    return pasos;
  }

  function sentido(n, p) {
    return p <= Math.floor(n / 2) ? "hacia adelante" : "hacia atras";
  }

  function tabla(n) {
    var filas = [];
    var p = 0;
    while (p < n) {
      filas.push({
        p: p,
        frente: deFrente(p),
        corto: porElLadoCorto(n, p),
        sentido: sentido(n, p)
      });
      p = p + 1;
    }
    return filas;
  }

  function totales(n) {
    var frente = 0;
    var corto = 0;
    var p = 0;
    while (p < n) {
      frente = frente + deFrente(p);
      corto = corto + porElLadoCorto(n, p);
      p = p + 1;
    }
    return { frente: frente, corto: corto };
  }

  /* El peor caso de cada version. */
  function peorCaso(n) {
    return { frente: n - 1, corto: Math.ceil(n / 2) };
  }

  return { n: N, p: P, lineas: LINEAS, deFrente: deFrente,
           porElLadoCorto: porElLadoCorto, tabla: tabla, totales: totales,
           peorCaso: peorCaso };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      lineas.forEach(function (texto, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (i >= 2 && i <= 7 ? " bloque-1" : (i >= 8 && i <= 13 ? " bloque-2" : ""));
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = texto;
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }
    var logradas = { diez: false, totales: false, cota: false };
    function revisar() {
      if (logradas.diez && logradas.totales && logradas.cota) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var N = EJERCICIO.n;
    var FILAS = EJERCICIO.tabla(N);
    var TOTALES = EJERCICIO.totales(N);
    var PEOR = EJERCICIO.peorCaso(N);
    pintarCodigo("codigo-nodoen", EJERCICIO.lineas);

    document.getElementById("btn-diez").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-diez");
      var f = parseInt(document.getElementById("pred-frente").value, 10);
      var c = parseInt(document.getElementById("pred-corto").value, 10);
      var ef = EJERCICIO.deFrente(EJERCICIO.p);
      var ec = EJERCICIO.porElLadoCorto(N, EJERCICIO.p);
      if (f === ef && c === ec) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + ef + " de frente y " + ec + " por el lado corto. " +
          "Con p = 10 y n = 12 la condición p <= n / 2 es falsa, así que el contador arranca en " +
          "12 y baja hasta 10: cabeza->anterior es la posición 11 y un paso más es la 10.";
        logradas.diez = true; revisar();
      } else if (f === ef && c === 6) {
        ver.className = "veredicto mal";
        ver.textContent = "Seis es el tope, el peor caso. Para una posición concreta los pasos hacia atrás son n - p, y aquí eso da menos.";
      } else if (f === 10 && c === 10) {
        ver.className = "veredicto mal";
        ver.textContent = "El camino hacia atrás no da los mismos pasos: la posición 11 está a un paso de la cabeza por detrás, y la 10 a dos.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "De frente son p pasos. Hacia atrás, el ciclo arranca en i = n y baja hasta p: cuente cuántas veces resta uno.";
      }
    });

    var vista = { i: 0 };
    function pintarTabla() {
      var cuerpo = document.getElementById("tabla-pasos");
      cuerpo.innerHTML = "";
      FILAS.forEach(function (f, k) {
        var fila = document.createElement("tr");
        var visible = k < vista.i;
        [String(f.p),
         visible ? String(f.frente) : "?",
         visible ? String(f.corto) : "?",
         visible ? (f.sentido === "hacia adelante" ? "hacia adelante" : "hacia atrás") : "?"
        ].forEach(function (texto, c) {
          var celda = document.createElement("td");
          if (!visible && c > 0) { celda.className = "pend"; }
          celda.textContent = texto;
          fila.appendChild(celda);
        });
        cuerpo.appendChild(fila);
      });
      var sumaF = 0;
      var sumaC = 0;
      var k = 0;
      while (k < vista.i) {
        sumaF = sumaF + FILAS[k].frente;
        sumaC = sumaC + FILAS[k].corto;
        k = k + 1;
      }
      document.getElementById("progreso-tabla").textContent =
        vista.i + " de " + FILAS.length + " posiciones: " + sumaF +
        " pasos de frente y " + sumaC + " por el lado corto hasta aquí";
      document.getElementById("btn-fila").disabled = vista.i === FILAS.length;
    }
    document.getElementById("btn-fila").addEventListener("click", function () {
      if (vista.i < FILAS.length) { vista.i = vista.i + 1; pintarTabla(); }
    });
    document.getElementById("btn-todo").addEventListener("click", function () {
      vista.i = FILAS.length; pintarTabla();
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarTabla();
    });
    pintarTabla();

    document.getElementById("btn-totales").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-totales");
      var f = parseInt(document.getElementById("pred-total-frente").value, 10);
      var c = parseInt(document.getElementById("pred-total-corto").value, 10);
      if (f === TOTALES.frente && c === TOTALES.corto) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + TOTALES.frente + " y " + TOTALES.corto +
          ". De frente la suma es 0 + 1 + ... + 11 = 12·11/2. Por el lado corto la columna " +
          "sube hasta 6 y vuelve a bajar: ningún recorrido pasa de ⌈n/2⌉ = " + PEOR.corto + " pasos.";
        logradas.totales = true; revisar();
      } else if (f === TOTALES.frente) {
        ver.className = "veredicto mal";
        ver.textContent = "El total de frente está bien. Para el otro sume la columna del lado corto, que sube 0, 1, ..., 6 y después baja 5, 4, ..., 1.";
      } else if (f === 78) {
        ver.className = "veredicto mal";
        ver.textContent = "Los sumandos van de 0 a 11, no de 1 a 12: la posición 0 es la cabeza y no cuesta ningún paso.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Sume las dos columnas de la tabla de arriba. El botón de mostrar todas las deja a la vista.";
      }
    });

    var MENSAJES_COTA = {
      n: null,
      media: "Θ(n/2) y Θ(n) son la misma clase: la constante 1/2 se absorbe en el testigo c de la definición. Lo que baja es el número de pasos, no la clase.",
      log: "Θ(log n) exige descartar la mitad de lo que queda en cada paso, y para eso hay que poder saltar: aquí cada paso avanza un nodo. Escoger el lado se decide una vez, al principio.",
      uno: "Θ(1) sería calcular la dirección del nodo sin caminar, como en el arreglo. La lista no la calcula: sigue enlaces, uno por paso."
    };
    document.querySelectorAll("#opciones-cota button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-cota");
        var m = MENSAJES_COTA[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: sigue siendo Θ(n). El peor caso baja de n - 1 pasos a ⌈n/2⌉, " +
            "que con n = " + N + " es " + PEOR.frente + " contra " + PEOR.corto +
            ", y el total de recorrer todas las posiciones baja de " + TOTALES.frente +
            " a " + TOTALES.corto + ". Es la mitad del trabajo dentro de la misma clase asintótica.";
          logradas.cota = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
