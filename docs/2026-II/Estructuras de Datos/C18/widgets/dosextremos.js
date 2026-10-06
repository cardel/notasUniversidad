/* Ejercicio interactivo: la cola necesita los dos extremos (clase 18). */
var EJERCICIO = (function () {
  var N = 40;
  var TAMANOS = [5, 10, 20, 40];
  var LINEAS = [
    "void insertarArreglo(ListaArreglo &l, int p, Elemento e) {",
    "  int i = l.n;",
    "  while (i > p) {",
    "    l.datos[i] = l.datos[i - 1];",
    "    i = i - 1;",
    "    tocados = tocados + 1;",
    "  }",
    "  l.datos[p] = e;",
    "  l.n = l.n + 1;",
    "}",
    "",
    "void agregarCaminando(ListaEnlazada &l, Elemento e) {",
    "  Nodo *nuevo = new Nodo;",
    "  nuevo->dato = e;",
    "  nuevo->siguiente = NULL;",
    "  if (l.cabeza == NULL) {",
    "    l.cabeza = nuevo;",
    "  } else {",
    "    Nodo *actual = l.cabeza;",
    "    while (actual->siguiente != NULL) {",
    "      actual = actual->siguiente;",
    "      tocados = tocados + 1;",
    "    }",
    "    actual->siguiente = nuevo;",
    "  }",
    "  l.n = l.n + 1;",
    "}",
    "",
    "void agregarConUltimo(ListaEnlazada &l, Elemento e) {",
    "  Nodo *nuevo = new Nodo;",
    "  nuevo->dato = e;",
    "  nuevo->siguiente = NULL;",
    "  if (l.cabeza == NULL) {",
    "    l.cabeza = nuevo;",
    "  } else {",
    "    l.ultimo->siguiente = nuevo;",
    "  }",
    "  l.ultimo = nuevo;",
    "  l.n = l.n + 1;",
    "}"
  ];

  /* insertarArreglo: corre hacia atras todo lo que hay despues de p. */
  function corrimientosInsertar(usados, p) {
    var tocados = 0;
    var i = usados;
    while (i > p) {
      i = i - 1;
      tocados = tocados + 1;
    }
    return tocados;
  }

  /* eliminarArreglo: corre hacia adelante todo lo que hay despues de p. */
  function corrimientosEliminar(usados, p) {
    var tocados = 0;
    var i = p;
    while (i < usados - 1) {
      i = i + 1;
      tocados = tocados + 1;
    }
    return tocados;
  }

  /* Entra por el final, sale por el frente: el corrimiento lo paga desencolar. */
  function arregloEntraAlFinal(n) {
    var tocados = 0;
    var usados = 0;
    var k = 0;
    while (k < n) {
      tocados = tocados + corrimientosInsertar(usados, usados);
      usados = usados + 1;
      k = k + 1;
    }
    k = 0;
    while (k < n) {
      tocados = tocados + corrimientosEliminar(usados, 0);
      usados = usados - 1;
      k = k + 1;
    }
    return tocados;
  }

  /* Entra por el frente, sale por el final: el corrimiento lo paga encolar. */
  function arregloEntraAlFrente(n) {
    var tocados = 0;
    var usados = 0;
    var k = 0;
    while (k < n) {
      tocados = tocados + corrimientosInsertar(usados, 0);
      usados = usados + 1;
      k = k + 1;
    }
    k = 0;
    while (k < n) {
      tocados = tocados + corrimientosEliminar(usados, usados - 1);
      usados = usados - 1;
      k = k + 1;
    }
    return tocados;
  }

  /* Enlazada simple: agregar camina hasta el ultimo nodo, quitar del frente no. */
  function enlazadaSinUltimo(n) {
    var tocados = 0;
    var nodos = 0;
    var k = 0;
    while (k < n) {
      if (nodos > 0) {
        var actual = 1;
        while (actual < nodos) {
          actual = actual + 1;
          tocados = tocados + 1;
        }
      }
      nodos = nodos + 1;
      k = k + 1;
    }
    return tocados;
  }

  /* Enlazada con puntero al ultimo: ninguno de los dos extremos recorre. */
  function enlazadaConUltimo(n) {
    var tocados = 0;
    var k = 0;
    while (k < n) {
      k = k + 1;
    }
    return tocados;
  }

  function fila(n) {
    return {
      n: n,
      arregloFinal: arregloEntraAlFinal(n),
      arregloFrente: arregloEntraAlFrente(n),
      sinUltimo: enlazadaSinUltimo(n),
      conUltimo: enlazadaConUltimo(n)
    };
  }

  function filas(tamanos) {
    return tamanos.map(fila);
  }

  return { n: N, tamanos: TAMANOS, lineas: LINEAS,
           arregloEntraAlFinal: arregloEntraAlFinal,
           arregloEntraAlFrente: arregloEntraAlFrente,
           enlazadaSinUltimo: enlazadaSinUltimo,
           enlazadaConUltimo: enlazadaConUltimo,
           fila: fila, filas: filas };
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
      return texto.trim().split(/[\s,]+/)
                  .filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    var logradas = { cuatro: false, cero: false, arreglo: false };
    function revisar() {
      if (logradas.cuatro && logradas.cero && logradas.arreglo) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var F = EJERCICIO.fila(EJERCICIO.n);
    var ESPERADO = [F.arregloFinal, F.arregloFrente, F.sinUltimo, F.conUltimo];
    var FILAS = EJERCICIO.filas(EJERCICIO.tamanos);

    pintarCodigo("codigo-contadores", EJERCICIO.lineas.map(function (t) {
      var clase = "";
      if (t.indexOf("tocados = tocados + 1") !== -1) { clase = "bloque-2"; }
      if (t.indexOf("l.ultimo->siguiente = nuevo") !== -1) { clase = "bloque-3"; }
      return [t, clase];
    }));

    document.getElementById("btn-cuatro").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-cuatro");
      var dada = leerLista(document.getElementById("pred-cuatro").value);
      if (iguales(dada, ESPERADO)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + ESPERADO.join(", ") +
          ". Las dos primeras son 0 + 1 + ... + 39 = 39·40/2 = 780, porque el corrimiento recorre todo lo que hay. La enlazada simple camina hasta el último nodo al agregar, y con m nodos da m - 1 pasos: 0 + 1 + ... + 38 = 741. La última no recorre nada en ninguno de los dos extremos.";
        logradas.cuatro = true; revisar();
      } else if (dada.length === 4 && dada[3] !== 0) {
        ver.className = "veredicto mal";
        ver.textContent = "La cuarta columna no toca ningún elemento: agregarConUltimo escribe l.ultimo->siguiente sin buscar a nadie, y quitar del frente solo mueve l.cabeza.";
      } else if (dada.length === 4 && dada[2] === 780) {
        ver.className = "veredicto mal";
        ver.textContent = "La enlazada simple no da lo mismo que el arreglo: el primer agregar no camina nada porque la lista está vacía, así que los sumandos van de 0 a 38 y no de 0 a 39.";
      } else if (dada.length === 4 && (dada[0] === 1600 || dada[0] === 40)) {
        ver.className = "veredicto mal";
        ver.textContent = "No es n por n ni n: el corrimiento depende de cuántos elementos hay en ese momento, y eso va cambiando. Sume 0 + 1 + ... + 39.";
      } else if (dada.length !== 4) {
        ver.className = "veredicto mal";
        ver.textContent = "Cuatro números, uno por columna.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Cuente cuántos elementos corre o visita cada operación cuando la estructura tiene m elementos, y sume sobre las 40 llamadas. La tabla de abajo muestra los totales.";
      }
    });

    var vista = { i: 0 };
    function pintarTabla() {
      var cuerpo = document.getElementById("tabla-tocados");
      cuerpo.innerHTML = "";
      FILAS.forEach(function (f, k) {
        var tr = document.createElement("tr");
        var visible = k < vista.i;
        [String(f.n),
         visible ? String(f.arregloFinal) : "?",
         visible ? String(f.arregloFrente) : "?",
         visible ? String(f.sinUltimo) : "?",
         visible ? String(f.conUltimo) : "?"
        ].forEach(function (texto, c) {
          var td = document.createElement("td");
          if (!visible && c > 0) { td.className = "pend"; }
          td.textContent = texto;
          tr.appendChild(td);
        });
        cuerpo.appendChild(tr);
      });
      document.getElementById("progreso-tabla").textContent =
        vista.i === 0 ? "ninguna fila a la vista"
                      : vista.i + " de " + FILAS.length + " filas: la cuarta columna sigue en " +
                        FILAS[vista.i - 1].conUltimo;
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

    function conectar(grupo, clave, correcta, mensajes) {
      document.querySelectorAll("#" + grupo + " button").forEach(function (boton) {
        boton.addEventListener("click", function () {
          var ver = document.getElementById("veredicto-" + clave);
          var op = boton.dataset.op;
          if (op === correcta) {
            ver.className = "veredicto bien";
            ver.textContent = mensajes.bien;
            logradas[clave] = true; revisar();
          } else {
            ver.className = "veredicto mal";
            ver.textContent = mensajes[op];
          }
        });
      });
    }

    conectar("opciones-cero", "cero", "extremos", {
      bien: "Correcto. La cola pone por un extremo y quita por el otro, así que necesita los dos baratos a la vez. Insertar al final con el puntero al último son dos escrituras y eliminar del frente son dos más: ninguna recorre. En las otras tres, uno de los dos extremos exige llegar hasta allá.",
      arreglo: "La enlazada simple tampoco usa arreglos y toca " + F.sinUltimo + " nodos: lo que cuesta no es el arreglo, es tener que llegar al extremo por el que se opera.",
      memoria: "Guardar el último cuesta memoria, no la ahorra: es un puntero más en la estructura. Lo que ahorra es el recorrido hasta el final.",
      contador: "La enlazada simple también lleva l.n y paga " + F.sinUltimo + " nodos. El contador dice cuántos hay; no dice dónde está el último nodo, que es lo que agregar necesita."
    });

    conectar("opciones-arreglo", "arreglo", "reparto", {
      bien: "Correcto. Entrando por el final, insertar en la posición l.n no corre nada y eliminar del frente corre todo lo demás. Entrando por el frente es al revés. Las dos versiones suman 0 + 1 + ... + 39, solo cambia cuál de las dos operaciones lo paga.",
      coincidencia: "La tabla da el mismo número en las cuatro filas de n. No es coincidencia: las dos versiones suman los mismos sumandos.",
      mitad: "Ninguna de las dos reparte el trabajo: en cada versión una de las operaciones corre todo y la otra no corre nada. Mire el while de insertarArreglo con p = l.n, que no da ni una vuelta."
    });
  })();
}
