/* Ejercicio interactivo: el extremo que se nombra tope (clase 17). */
var EJERCICIO = (function () {
  var N = 50;
  var TAMANOS = [10, 20, 50];
  var LINEAS = [
    ["// lista sobre arreglo: insertar corre hacia atras lo que ya hay", ""],
    ["int i = l.n;", "bloque-1"],
    ["while (i > p) {", "bloque-1"],
    ["  l.datos[i] = l.datos[i - 1];", "bloque-1"],
    ["  i = i - 1;", "bloque-1"],
    ["  tocados = tocados + 1;", "bloque-1"],
    ["}", ""],
    ["l.datos[p] = e;", ""],
    ["", ""],
    ["// lista enlazada: insertar camina hasta el nodo anterior", ""],
    ["Nodo *anterior = l.cabeza;", "bloque-2"],
    ["int i = 0;", "bloque-2"],
    ["while (i < p - 1) {", "bloque-2"],
    ["  anterior = anterior->siguiente;", "bloque-2"],
    ["  i = i + 1;", "bloque-2"],
    ["  tocados = tocados + 1;", "bloque-2"],
    ["}", ""],
    ["nuevo->siguiente = anterior->siguiente;", ""],
    ["anterior->siguiente = nuevo;", ""]
  ];

  /* La lista sobre arreglo: insertar corre hacia atras desde el final y
     eliminar corre hacia adelante desde p. Se cuenta cada elemento movido. */
  function listaArreglo() {
    return { datos: [], n: 0, tocados: 0 };
  }

  function insertarArreglo(l, p, e) {
    var i = l.n;
    while (i > p) {
      l.datos[i] = l.datos[i - 1];
      i = i - 1;
      l.tocados = l.tocados + 1;
    }
    l.datos[p] = e;
    l.n = l.n + 1;
  }

  function eliminarArreglo(l, p) {
    var i = p;
    while (i < l.n - 1) {
      l.datos[i] = l.datos[i + 1];
      i = i + 1;
      l.tocados = l.tocados + 1;
    }
    l.n = l.n - 1;
  }

  /* La lista enlazada: la posicion 0 no camina, cualquier otra visita p - 1
     nodos para llegar al anterior. */
  function listaEnlazada() {
    return { cabeza: null, n: 0, tocados: 0 };
  }

  function insertarEnlazada(l, p, e) {
    var nuevo = { dato: e, siguiente: null };
    if (p === 0) {
      nuevo.siguiente = l.cabeza;
      l.cabeza = nuevo;
    } else {
      var anterior = l.cabeza;
      var i = 0;
      while (i < p - 1) {
        anterior = anterior.siguiente;
        i = i + 1;
        l.tocados = l.tocados + 1;
      }
      nuevo.siguiente = anterior.siguiente;
      anterior.siguiente = nuevo;
    }
    l.n = l.n + 1;
  }

  function eliminarEnlazada(l, p) {
    if (p === 0) {
      l.cabeza = l.cabeza.siguiente;
    } else {
      var anterior = l.cabeza;
      var i = 0;
      while (i < p - 1) {
        anterior = anterior.siguiente;
        i = i + 1;
        l.tocados = l.tocados + 1;
      }
      anterior.siguiente = anterior.siguiente.siguiente;
    }
    l.n = l.n - 1;
  }

  /* Las cuatro combinaciones: apilar n veces y desapilar n veces. */
  function arregloAlFrente(n) {
    var l = listaArreglo();
    var k = 0;
    while (k < n) { insertarArreglo(l, 0, k); k = k + 1; }
    k = 0;
    while (k < n) { eliminarArreglo(l, 0); k = k + 1; }
    return l.tocados;
  }

  function arregloAlFinal(n) {
    var l = listaArreglo();
    var k = 0;
    while (k < n) { insertarArreglo(l, l.n, k); k = k + 1; }
    k = 0;
    while (k < n) { eliminarArreglo(l, l.n - 1); k = k + 1; }
    return l.tocados;
  }

  function enlazadaAlFrente(n) {
    var l = listaEnlazada();
    var k = 0;
    while (k < n) { insertarEnlazada(l, 0, k); k = k + 1; }
    k = 0;
    while (k < n) { eliminarEnlazada(l, 0); k = k + 1; }
    return l.tocados;
  }

  function enlazadaAlFinal(n) {
    var l = listaEnlazada();
    var k = 0;
    while (k < n) { insertarEnlazada(l, l.n, k); k = k + 1; }
    k = 0;
    while (k < n) { eliminarEnlazada(l, l.n - 1); k = k + 1; }
    return l.tocados;
  }

  function fila(n) {
    return { n: n, af: arregloAlFrente(n), aa: arregloAlFinal(n),
             ef: enlazadaAlFrente(n), ea: enlazadaAlFinal(n) };
  }

  return { n: N, tamanos: TAMANOS, lineas: LINEAS, fila: fila,
           arregloAlFrente: arregloAlFrente, arregloAlFinal: arregloAlFinal,
           enlazadaAlFrente: enlazadaAlFrente, enlazadaAlFinal: enlazadaAlFinal };
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
    var logradas = { cuatro: false, espejo: false };
    function revisar() {
      if (logradas.cuatro && logradas.espejo) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var ESPERADO = EJERCICIO.fila(EJERCICIO.n);
    pintarCodigo("codigo-contadores", EJERCICIO.lineas);

    document.getElementById("btn-cuatro").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-cuatro");
      var af = parseInt(document.getElementById("pred-af").value, 10);
      var aa = parseInt(document.getElementById("pred-aa").value, 10);
      var ef = parseInt(document.getElementById("pred-ef").value, 10);
      var ea = parseInt(document.getElementById("pred-ea").value, 10);
      if (af === ESPERADO.af && aa === ESPERADO.aa && ef === ESPERADO.ef && ea === ESPERADO.ea) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + ESPERADO.af + ", " + ESPERADO.aa + ", " + ESPERADO.ef + " y " + ESPERADO.ea + ". En el arreglo por el frente, la inserción número k corre los k elementos que ya estaban y cada eliminación corre los que quedan: 2·(49·50/2) = " + ESPERADO.af + ". En la enlazada por el final hay que caminar hasta el penúltimo nodo, y el primer elemento entra sin caminar: 2·(48·49/2) = " + ESPERADO.ea + ".";
        logradas.cuatro = true; revisar();
      } else if (aa === 0 && ef === 0 && (af !== ESPERADO.af || ea !== ESPERADO.ea)) {
        ver.className = "veredicto mal";
        ver.textContent = "Los dos ceros están bien. Para las otras dos sume lo que mueve cada operación: la inserción k-ésima toca k elementos y la eliminación toca los que quedan por delante.";
      } else if (af === 1225 || ea === 1176) {
        ver.className = "veredicto mal";
        ver.textContent = "Esa es la cuenta de las 50 inserciones. Faltan las 50 eliminaciones, que mueven otro tanto.";
      } else if (af === 2500 || af === 2450 * 2) {
        ver.className = "veredicto mal";
        ver.textContent = "La primera inserción sobre la lista vacía no corre nada, y la última corre 49, no 50: los sumandos van de 0 a n - 1.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Dos de las cuatro son cero: el extremo donde la estructura no tiene que mover nada. Las otras dos salen de sumar 0 + 1 + ... hasta el tamaño que tenía la lista en cada paso.";
      }
    });

    var vista = { i: 0 };
    function pintarTabla() {
      var cuerpo = document.getElementById("tabla-n");
      cuerpo.innerHTML = "";
      EJERCICIO.tamanos.forEach(function (n, k) {
        var r = document.createElement("tr");
        var visible = k < vista.i;
        var datos = visible ? EJERCICIO.fila(n) : null;
        var celdas = visible
          ? [n, datos.af, datos.aa, datos.ef, datos.ea]
          : [n, "?", "?", "?", "?"];
        celdas.forEach(function (v, j) {
          var c = document.createElement("td");
          if (!visible && j > 0) { c.className = "pend"; }
          c.textContent = String(v);
          r.appendChild(c);
        });
        cuerpo.appendChild(r);
      });
      document.getElementById("progreso-tabla").textContent =
        vista.i === 0
          ? "ninguna fila a la vista"
          : vista.i + " de " + EJERCICIO.tamanos.length + " filas";
      document.getElementById("btn-fila").disabled = vista.i === EJERCICIO.tamanos.length;
    }
    document.getElementById("btn-fila").addEventListener("click", function () {
      if (vista.i < EJERCICIO.tamanos.length) { vista.i = vista.i + 1; pintarTabla(); }
    });
    document.getElementById("btn-todo").addEventListener("click", function () {
      vista.i = EJERCICIO.tamanos.length; pintarTabla();
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarTabla();
    });
    pintarTabla();

    var MENSAJES = {
      acceso: null,
      memoria: "La memoria contigua explica por qué el arreglo calcula la dirección de cualquier casilla de una vez, y eso es lo que lo hace rápido por el final. Por el frente pierde: cada inserción tiene que correr todo para abrir el hueco, y ahí la enlazada gana por goleada.",
      tad: "El contrato de la pila no dice nada de costos. Las cuatro combinaciones cumplen el mismo contrato y dan las mismas salidas; lo que cambia es la estructura de abajo y el extremo escogido.",
      punteros: "Las dos escrituras de puntero son Θ(1) y no se acumulan con el tamaño: por eso la columna de la enlazada por el frente es cero. Lo que se acumula es caminar o correr, que depende de cuántos elementos haya."
    };
    document.querySelectorAll("#opciones-espejo button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-espejo");
        var m = MENSAJES[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto. El arreglo llega a cualquier casilla calculando su dirección, así que poner al final solo escribe datos[n]; abrir un hueco al frente obliga a correr los n elementos. La enlazada tiene la cabeza en una variable, así que insertar al frente son dos punteros; llegar al final obliga a seguir la cadena nodo por nodo. Cada estructura regala el extremo que tiene a la mano.";
          logradas.espejo = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
