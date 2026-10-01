/* Ejercicio interactivo: merge sort sobre la lista enlazada (clase 16). */
var EJERCICIO = (function () {
  var LISTA = [7, 3, 8, 1, 5, 2];
  var LINEAS_PARTIR = [
    "Nodo *partir(Nodo *cabeza) {",
    "  Nodo *lento = cabeza;",
    "  Nodo *rapido = cabeza->siguiente;",
    "  while (rapido != NULL && rapido->siguiente != NULL) {",
    "    lento = lento->siguiente;",
    "    rapido = rapido->siguiente->siguiente;",
    "  }",
    "  Nodo *segunda = lento->siguiente;",
    "  lento->siguiente = NULL;",
    "  return segunda;",
    "}"
  ];
  var LINEAS_MEZCLAR = [
    "while (a != NULL && b != NULL) {",
    "  comparaciones = comparaciones + 1;",
    "  if (a->dato <= b->dato) {",
    "    cola->siguiente = a;",
    "    a = a->siguiente;",
    "  } else {",
    "    cola->siguiente = b;",
    "    b = b->siguiente;",
    "  }",
    "  cola = cola->siguiente;",
    "}",
    "if (a != NULL) {",
    "  cola->siguiente = a;",
    "} else {",
    "  cola->siguiente = b;",
    "}"
  ];

  function cadena(datos) {
    var nodos = datos.map(function (d) { return { dato: d, siguiente: null }; });
    var i = 0;
    while (i < nodos.length - 1) {
      nodos[i].siguiente = nodos[i + 1];
      i = i + 1;
    }
    return nodos.length === 0 ? null : nodos[0];
  }

  function datos(cabeza) {
    var salida = [];
    var actual = cabeza;
    while (actual !== null) {
      salida.push(actual.dato);
      actual = actual.siguiente;
    }
    return salida;
  }

  /* Corta por la mitad con dos punteros a distinta velocidad. */
  function partir(cabeza, vueltas) {
    var lento = cabeza;
    var rapido = cabeza.siguiente;
    function anotar(vuelta) {
      if (vueltas !== null) {
        vueltas.push({
          vuelta: vuelta,
          lento: lento.dato,
          rapido: rapido === null ? "NULL" : String(rapido.dato),
          sigueRapido: rapido !== null && rapido.siguiente !== null
        });
      }
    }
    var vuelta = 0;
    anotar(vuelta);
    while (rapido !== null && rapido.siguiente !== null) {
      lento = lento.siguiente;
      rapido = rapido.siguiente.siguiente;
      vuelta = vuelta + 1;
      anotar(vuelta);
    }
    var segunda = lento.siguiente;
    lento.siguiente = null;
    return { segunda: segunda, corte: lento.dato };
  }

  /* Mezcla dos cadenas ordenadas empalmando nodos, contando comparaciones. */
  function mezclar(a, b) {
    var guia = { dato: 0, siguiente: null };
    var cola = guia;
    var comparaciones = 0;
    while (a !== null && b !== null) {
      comparaciones = comparaciones + 1;
      if (a.dato <= b.dato) {
        cola.siguiente = a;
        a = a.siguiente;
      } else {
        cola.siguiente = b;
        b = b.siguiente;
      }
      cola = cola.siguiente;
    }
    if (a !== null) {
      cola.siguiente = a;
    } else {
      cola.siguiente = b;
    }
    return { cabeza: guia.siguiente, comparaciones: comparaciones };
  }

  function ordenar(cabeza, nivel, eventos) {
    if (cabeza !== null && cabeza.siguiente !== null) {
      var corte = partir(cabeza, null);
      var izquierda = ordenar(cabeza, nivel + 1, eventos);
      var derecha = ordenar(corte.segunda, nivel + 1, eventos);
      var a = datos(izquierda);
      var b = datos(derecha);
      var r = mezclar(izquierda, derecha);
      eventos.push({
        nivel: nivel,
        a: a,
        b: b,
        resultado: datos(r.cabeza),
        comparaciones: r.comparaciones
      });
      cabeza = r.cabeza;
    }
    return cabeza;
  }

  /* La corrida completa: el primer partir, las mezclas y el total. */
  function correr() {
    var vueltas = [];
    var copia = cadena(LISTA);
    var primerCorte = partir(copia, vueltas);
    var primera = datos(copia);
    var segunda = datos(primerCorte.segunda);

    var eventos = [];
    var ordenada = ordenar(cadena(LISTA), 0, eventos);
    var total = 0;
    var i = 0;
    while (i < eventos.length) {
      total = total + eventos[i].comparaciones;
      i = i + 1;
    }
    return {
      vueltas: vueltas,
      corte: primerCorte.corte,
      primera: primera,
      segunda: segunda,
      mezclas: eventos,
      total: total,
      ordenada: datos(ordenada)
    };
  }

  return { lista: LISTA, lineasPartir: LINEAS_PARTIR,
           lineasMezclar: LINEAS_MEZCLAR, correr: correr };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas, marca) {
      var caja = document.getElementById(id);
      lineas.forEach(function (texto, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (marca.indexOf(i) === -1 ? "" : " bloque-1");
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
    function leerLista(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    var logradas = { mitades: false, total: false, razon: false };
    function revisar() {
      if (logradas.mitades && logradas.total && logradas.razon) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var R = EJERCICIO.correr();
    pintarCodigo("codigo-partir", EJERCICIO.lineasPartir, [3, 4, 5]);
    pintarCodigo("codigo-mezclar", EJERCICIO.lineasMezclar, [1, 11, 12, 13, 14, 15]);

    document.getElementById("btn-mitades").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-mitades");
      var p = leerLista(document.getElementById("pred-primera").value);
      var s = leerLista(document.getElementById("pred-segunda").value);
      if (iguales(p, R.primera) && iguales(s, R.segunda)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + R.primera.join(" ") + " y " + R.segunda.join(" ") +
          ". Se corta después del " + R.corte + ", donde quedó el lento, y ese nodo se cierra " +
          "con NULL: la cadena original deja de existir como una sola.";
        logradas.mitades = true; revisar();
      } else if (iguales(p, [7, 3]) && iguales(s, [8, 1, 5, 2])) {
        ver.className = "veredicto mal";
        ver.textContent = "El lento arranca en la cabeza y el rápido un nodo adelante, así que el lento alcanza a dar dos pasos: queda en el tercer nodo, no en el segundo.";
      } else if (p.length === 3 && s.length === 3 && iguales(p.concat(s).slice().sort(), R.primera.concat(R.segunda).slice().sort())) {
        ver.className = "veredicto mal";
        ver.textContent = "Los tamaños están bien, pero partir no reordena nada: las dos mitades conservan el orden en que venían los nodos.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Siga el lento y el rápido con la tabla de abajo: el corte queda justo después del nodo donde se detiene el lento.";
      }
    });

    var vueltas = { i: 0 };
    function pintarVueltas() {
      var cuerpo = document.getElementById("tabla-vueltas");
      cuerpo.innerHTML = "";
      R.vueltas.forEach(function (v, k) {
        var fila = document.createElement("tr");
        var visible = k < vueltas.i;
        [k === 0 ? "antes del ciclo" : String(v.vuelta),
         visible ? String(v.lento) : "?",
         visible ? v.rapido : "?"].forEach(function (texto, c) {
          var celda = document.createElement("td");
          if (!visible && c > 0) { celda.className = "pend"; }
          celda.textContent = texto;
          fila.appendChild(celda);
        });
        cuerpo.appendChild(fila);
      });
      var ultima = vueltas.i === 0 ? null : R.vueltas[vueltas.i - 1];
      document.getElementById("progreso-vueltas").textContent = ultima === null
        ? "sin entrar al ciclo"
        : (ultima.sigueRapido
            ? "el rápido todavía tiene un nodo después: el ciclo sigue"
            : "el rápido ya no tiene nodo después: el ciclo termina y el corte queda tras el " + ultima.lento);
      document.getElementById("btn-vuelta").disabled = vueltas.i === R.vueltas.length;
    }
    document.getElementById("btn-vuelta").addEventListener("click", function () {
      if (vueltas.i < R.vueltas.length) { vueltas.i = vueltas.i + 1; pintarVueltas(); }
    });
    document.getElementById("btn-reinicio-vueltas").addEventListener("click", function () {
      vueltas.i = 0; pintarVueltas();
    });
    pintarVueltas();

    document.getElementById("btn-total").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-total");
      var t = parseInt(document.getElementById("pred-total").value, 10);
      if (t === R.total) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + R.total + ". Son cinco mezclas: " +
          R.mezclas.map(function (m) {
            return m.a.join(" ") + " con " + m.b.join(" ") + " en " + m.comparaciones;
          }).join("; ") + ". La lista queda " + R.ordenada.join(" ") + ".";
        logradas.total = true; revisar();
      } else if (t === 15 || t === 12) {
        ver.className = "veredicto mal";
        ver.textContent = "Ninguna mezcla gasta una comparación por cada nodo que junta: en cuanto una de las dos cadenas se vacía, el resto de la otra se empalma sin comparar.";
      } else if (t === 6 || t === 5) {
        ver.className = "veredicto mal";
        ver.textContent = "Son cinco mezclas, no una: cada nivel de la recursión mezcla las mitades que ya ordenó el nivel de abajo. Sume las comparaciones de todas.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Baje hasta las cadenas de un nodo, mezcle de a dos y vaya sumando. La tabla de abajo muestra las mezclas en el orden en que ocurren.";
      }
    });

    var mezclas = { i: 0 };
    function pintarMezclas() {
      var cuerpo = document.getElementById("tabla-mezclas");
      cuerpo.innerHTML = "";
      var acumulado = 0;
      R.mezclas.forEach(function (m, k) {
        var fila = document.createElement("tr");
        var visible = k < mezclas.i;
        if (visible) { acumulado = acumulado + m.comparaciones; }
        [String(m.nivel),
         visible ? m.a.join(" ") : "?",
         visible ? m.b.join(" ") : "?",
         visible ? m.resultado.join(" ") : "?",
         visible ? String(m.comparaciones) : "?",
         visible ? String(acumulado) : "?"].forEach(function (texto, c) {
          var celda = document.createElement("td");
          if (!visible && c > 0) { celda.className = "pend"; }
          celda.textContent = texto;
          fila.appendChild(celda);
        });
        cuerpo.appendChild(fila);
      });
      document.getElementById("progreso-mezclas").textContent =
        mezclas.i + " de " + R.mezclas.length + " mezclas, " + acumulado +
        " comparaciones hasta aquí" +
        (mezclas.i === R.mezclas.length ? ". La lista queda " + R.ordenada.join(" ") + "." : "");
      document.getElementById("btn-mezcla").disabled = mezclas.i === R.mezclas.length;
    }
    document.getElementById("btn-mezcla").addEventListener("click", function () {
      if (mezclas.i < R.mezclas.length) { mezclas.i = mezclas.i + 1; pintarMezclas(); }
    });
    document.getElementById("btn-reinicio-mezclas").addEventListener("click", function () {
      mezclas.i = 0; pintarMezclas();
    });
    pintarMezclas();

    var ultima = R.mezclas[R.mezclas.length - 1];
    var MENSAJES_RAZON = {
      cola: null,
      orden: "El orden de la entrada cambia cuántas veces gana cada cadena, pero no quita el paso de comparar: la cuenta baja cuando el ciclo se acaba porque una cadena quedó vacía.",
      mitad: "Cada comparación mira un dato de cada cadena, a->dato contra b->dato: por eso el ciclo exige que las dos sigan teniendo nodos."
    };
    document.querySelectorAll("#opciones-razon button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-razon");
        var m = MENSAJES_RAZON[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto. El ciclo exige a != NULL && b != NULL: al llevarse el " +
            ultima.b[ultima.b.length - 1] + " la cadena " + ultima.b.join(" ") +
            " queda vacía y el ciclo sale con " + ultima.comparaciones +
            " comparaciones. Lo que falta de la otra cadena entra con una sola escritura, " +
            "cola->siguiente = a, y por eso mezclar cuesta a lo más n_a + n_b - 1 comparaciones.";
          logradas.razon = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}
