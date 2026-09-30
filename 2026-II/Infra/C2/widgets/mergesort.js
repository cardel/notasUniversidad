if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Mergesort repartido con std::thread y corte por profundidad, como en
   mergesort.cpp: cada division lanza un hilo para la mitad izquierda, la
   mitad derecha la hace el hilo que ya venia, join y mezcla con un hilo.  */

var N = 20000000;
var MINIMO = 10000;

/* Tiempos del deck, medidos con taskset -c 0-3 (cuatro nucleos). */
var MEDICIONES = [
  { prof: 0, hilos: 1, ms: 2194 },
  { prof: 1, hilos: 2, ms: 1221 },
  { prof: 2, hilos: 4, ms: 774 },
  { prof: 3, hilos: 8, ms: 654 },
  { prof: 4, hilos: 16, ms: 640 }
];
var STD_SORT_MS = 1469;
var MEZCLA_NIVEL0_MS = 83;

/* Reproduce ordenar_par(ini, fin, prof): devuelve el arbol de llamadas.
   nuevoHilo dice si ese trozo corre en un hilo lanzado con std::thread;
   hoja dice si se ordena de corrido con la version secuencial.          */
function construir(ini, fin, prof, minimo, nuevoHilo) {
  var nodo = { ini: ini, fin: fin, prof: prof, hoja: false,
               nuevoHilo: nuevoHilo, izq: null, der: null };
  if (fin - ini < 2) { nodo.hoja = true; return nodo; }
  if (prof === 0 || fin - ini < minimo) { nodo.hoja = true; return nodo; }
  var med = ini + Math.floor((fin - ini) / 2);
  nodo.izq = construir(ini, med, prof - 1, minimo, true);   // thread izq(...)
  nodo.der = construir(med, fin, prof - 1, minimo, false);  // en este hilo
  return nodo;
}

function arbol(n, prof, minimo) {
  return construir(0, n, prof, minimo === undefined ? MINIMO : minimo, false);
}

function contar(nodo, cumple) {
  if (!nodo) { return 0; }
  return (cumple(nodo) ? 1 : 0) + contar(nodo.izq, cumple) + contar(nodo.der, cumple);
}

function hilosCreados(n, prof, minimo) {
  return contar(arbol(n, prof, minimo), function (nd) { return nd.nuevoHilo; });
}

function hojas(n, prof, minimo) {
  return contar(arbol(n, prof, minimo), function (nd) { return nd.hoja; });
}

/* Los nodos agrupados por nivel, de la raiz hacia abajo. */
function niveles(raiz) {
  var filas = [];
  function bajar(nd, nivel) {
    if (!nd) { return; }
    if (!filas[nivel]) { filas[nivel] = []; }
    filas[nivel].push(nd);
    bajar(nd.izq, nivel + 1);
    bajar(nd.der, nivel + 1);
  }
  bajar(raiz, 0);
  return filas;
}

/* Lo que ejecuta el hilo principal, en el orden del codigo: divide, lanza
   el hilo de la izquierda, resuelve la derecha en el mismo hilo (y ahi se
   mete en la recursion), join y mezcla. Los hilos lanzados repiten el
   mismo recorrido por su cuenta y no aparecen aqui.                      */
function pasos(n, prof, minimo) {
  var raiz = arbol(n, prof, minimo);
  var lista = [];
  var porNivel = niveles(raiz);

  function mezclasEnNivel(nivel) {
    return porNivel[nivel].filter(function (nd) { return !nd.hoja; }).length;
  }

  function recorrer(nd, nivel) {
    if (nd.hoja) { return; }
    var med = nd.izq.fin;
    lista.push({ tipo: "dividir", ini: nd.ini, fin: nd.fin, nivel: nivel, med: med });
    lista.push({ tipo: "lanzar", ini: nd.izq.ini, fin: nd.izq.fin, nivel: nivel + 1,
                 hoja: nd.izq.hoja, prof: nd.izq.prof });
    lista.push({ tipo: "resolver", ini: nd.der.ini, fin: nd.der.fin, nivel: nivel + 1,
                 hoja: nd.der.hoja, prof: nd.der.prof });
    recorrer(nd.der, nivel + 1);
    lista.push({ tipo: "join", ini: nd.ini, fin: nd.fin, nivel: nivel,
                 espera: { ini: nd.izq.ini, fin: nd.izq.fin } });
    lista.push({ tipo: "mezclar", ini: nd.ini, fin: nd.fin, nivel: nivel, med: med,
                 alTiempo: mezclasEnNivel(nivel) });
  }

  if (raiz.hoja) {
    // Con profundidad 0 no se reparte nada: un hilo ordena todo de corrido.
    lista.push({ tipo: "resolver", ini: raiz.ini, fin: raiz.fin, nivel: 0,
                 hoja: true, prof: raiz.prof });
    return lista;
  }
  recorrer(raiz, 0);
  return lista;
}

/* 20000000 -> "20 M", 12500000 -> "12,5 M", 10000 -> "10.000". */
function tam(x) {
  if (x >= 1e6) { return Motor.num(x / 1e6, 3) + " M"; }
  return Motor.num(x);
}

function rango(ini, fin) {
  return "[" + tam(ini) + ", " + tam(fin) + ")";
}

function aceleracion(ms) {
  return MEDICIONES[0].ms / ms;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    N: N, MINIMO: MINIMO, MEDICIONES: MEDICIONES,
    STD_SORT_MS: STD_SORT_MS, MEZCLA_NIVEL0_MS: MEZCLA_NIVEL0_MS,
    arbol: arbol, contar: contar, hilosCreados: hilosCreados, hojas: hojas,
    niveles: niveles, pasos: pasos, tam: tam, rango: rango,
    aceleracion: aceleracion
  };
}

if (typeof document !== "undefined") (function () {
  var prof = 2;
  var lista = pasos(N, prof, MINIMO);
  var k = -1;   // paso actual del recorrido; -1 antes de empezar

  var ESTILO = {
    nuevo: "background:var(--azul-suave);border-color:var(--azul);color:var(--azul)",
    mismo: "background:var(--ambar-suave);border-color:var(--ambar);color:var(--tinta)",
    hecha: "background:var(--verde-suave);border-color:var(--verde);color:var(--verde)"
  };

  function dentro(nd, r) { return nd.ini >= r.ini && nd.fin <= r.fin; }

  /* Rangos que ya quedaron ordenados tras los pasos 0..k: una hoja que
     resolvio este hilo, la mitad izquierda tras el join, el trozo entero
     tras la mezcla.                                                     */
  function rangosHechos(hasta) {
    var hechos = [];
    for (var i = 0; i <= hasta && i < lista.length; i++) {
      var p = lista[i];
      if (p.tipo === "resolver" && p.hoja) { hechos.push({ ini: p.ini, fin: p.fin }); }
      if (p.tipo === "join") { hechos.push(p.espera); }
      if (p.tipo === "mezclar") { hechos.push({ ini: p.ini, fin: p.fin }); }
    }
    return hechos;
  }

  function pintarArbol(idCaja, raiz, actual, hechos) {
    var filas = niveles(raiz);
    var html = "";
    filas.forEach(function (nodos, nivel) {
      var cajas = nodos.map(function (nd) {
        var hecha = hechos.some(function (r) { return dentro(nd, r); });
        var estilo = hecha ? ESTILO.hecha : (nd.nuevoHilo ? ESTILO.nuevo : ESTILO.mismo);
        estilo += ";border-style:" + (nd.hoja ? "dashed" : "solid") +
          ";border-width:" + (nd.hoja ? 2 : 1) + "px" +
          ";left:calc(" + (nd.ini / N * 100) + "% + 1px)" +
          ";width:calc(" + ((nd.fin - nd.ini) / N * 100) + "% - 2px)";
        var esActual = actual && actual.ini === nd.ini && actual.fin === nd.fin;
        var titulo = rango(nd.ini, nd.fin) + ": " + Motor.num(nd.fin - nd.ini) +
          " enteros, " + (nd.nuevoHilo ? "hilo nuevo" : "el hilo que ya venía") +
          (nd.hoja ? ", hoja: se ordena de corrido" : "");
        return "<span class=\"nodo" + (esActual ? " actual" : "") +
          "\" title=\"" + titulo + "\" style=\"" + estilo + "\">" +
          tam(nd.fin - nd.ini) + "</span>";
      }).join("");
      html += "<div class=\"barra-fila\"><span class=\"rotulo\" style=\"width:4.2rem\">nivel " +
        nivel + "</span><span class=\"pista-barra\" style=\"position:relative;height:32px\">" +
        cajas + "</span><span class=\"valor\">" + nodos.length +
        (nodos.length === 1 ? " hilo" : " hilos") + "</span></div>";
    });
    document.getElementById(idCaja).innerHTML = html;
  }

  function pintarCarta1() {
    var raiz = arbol(N, prof, MINIMO);
    document.getElementById("ver-prof").textContent = prof;
    pintarArbol("panel-arbol", raiz, null, []);
    var hojasN = hojas(N, prof, MINIMO);
    Motor.pintarChips("chips-arbol", [
      { texto: "hilos creados", valor: hilosCreados(N, prof, MINIMO), cuenta: true },
      { texto: "trozos, uno por hilo en las hojas", valor: hojasN },
      { texto: "tamaño de cada hoja", valor: tam(N / hojasN) }
    ]);
  }

  /* --- Paso a paso --- */

  function etiqueta(p) {
    var sangria = new Array(p.nivel + 1).join("  ");
    switch (p.tipo) {
      case "dividir":  return sangria + "dividir  " + rango(p.ini, p.fin);
      case "lanzar":   return sangria + "lanzar   hilo → " + rango(p.ini, p.fin);
      case "resolver": return sangria + (p.nivel === 0 ? "ordenar  " : "resolver ") +
                              rango(p.ini, p.fin) + " en este hilo";
      case "join":     return sangria + "join     espera " + rango(p.espera.ini, p.espera.fin);
      case "mezclar":  return sangria + "mezclar  " + rango(p.ini, p.fin) + "  nivel " + p.nivel;
    }
    return "";
  }

  function describir(p) {
    var r = rango(p.ini, p.fin);
    switch (p.tipo) {
      case "dividir":
        return "Parte " + r + " por la mitad: " + rango(p.ini, p.med) + " y " +
          rango(p.med, p.fin) + ". Mitades de " + tam(p.med - p.ini) + " cada una.";
      case "lanzar":
        return "Lanza un hilo nuevo para " + r + ". " + (p.hoja
          ? "Ese hilo la ordena de corrido con la versión secuencial y termina."
          : "Ese hilo repite el mismo recorrido por su cuenta, con profundidad " +
            p.prof + ": parte, lanza otro hilo, mezcla.");
      case "resolver":
        if (p.nivel === 0) {
          return "Con profundidad 0 no se reparte nada: un solo hilo ordena " + r +
            " de corrido, los " + Motor.num(N) + " enteros.";
        }
        return "La derecha, " + r + ", la hace este mismo hilo. " + (p.hoja
          ? "La ordena de corrido: " + (p.prof === 0
              ? "se acabó el presupuesto de profundidad."
              : "el trozo es más pequeño que el mínimo de " + Motor.num(MINIMO) + ".")
          : "Todavía tiene profundidad " + p.prof + ", así que vuelve a partirla.");
      case "join":
        return "join: espera a que el hilo de " + rango(p.espera.ini, p.espera.fin) +
          " termine. Las dos mitades de " + r + " tienen que estar ordenadas antes de mezclar.";
      case "mezclar":
        return "Mezcla " + r + " con un solo hilo, " + Motor.num(p.fin - p.ini) +
          " enteros. " + (p.nivel === 0
          ? "Es la mezcla del nivel 0 y corre sola: ningún otro hilo trabaja mientras tanto."
          : "En el nivel " + p.nivel + " hay " + p.alTiempo + " mezclas y pueden correr " +
            "al tiempo, cada una en su hilo.");
    }
    return "";
  }

  function pintarTraza() {
    var html = lista.map(function (p, i) {
      var clase = "linea" + (i === k ? " actual" : "") +
        (p.tipo === "lanzar" ? " bloque-1" : p.tipo === "resolver" ? " bloque-2" :
         p.tipo === "mezclar" ? " bloque-3" : "");
      var color = i > k ? " style=\"color:var(--gris)\"" : "";
      return "<div class=\"" + clase + "\"" + color + "><span class=\"num\">" + (i + 1) +
        "</span><span class=\"txt\">" + etiqueta(p) + "</span></div>";
    }).join("");
    document.getElementById("traza").innerHTML = html;
  }

  function pintarPasos() {
    var raiz = arbol(N, prof, MINIMO);
    var actual = k >= 0 ? lista[k] : null;
    pintarArbol("panel-arbol-pasos", raiz, actual, rangosHechos(k));
    pintarTraza();
    var progreso = document.getElementById("progreso");
    var texto = document.getElementById("paso-texto");
    if (k < 0) {
      progreso.textContent = "Profundidad " + prof + ": " + lista.length +
        (lista.length === 1 ? " paso" : " pasos") + " del hilo principal.";
      texto.textContent = "Presione Siguiente para ver el primer paso.";
    } else {
      progreso.textContent = "Paso " + (k + 1) + " de " + lista.length +
        " · profundidad " + prof + (k === lista.length - 1 ? " · recorrido completo" : "");
      texto.textContent = describir(lista[k]);
    }
    document.getElementById("btn-siguiente").disabled = k >= lista.length - 1;
  }

  function reiniciar() {
    lista = pasos(N, prof, MINIMO);
    k = -1;
    pintarPasos();
  }

  /* --- Mediciones --- */

  function pintarTabla() {
    var filas = MEDICIONES.map(function (m) {
      return "<tr" + (m.prof === prof ? " style=\"background:var(--resalte)\"" : "") +
        "><td>" + m.prof + "</td><td>" + m.hilos + "</td><td>" + Motor.num(m.ms) +
        " ms</td><td>" + Motor.num(aceleracion(m.ms), 2) + "</td></tr>";
    }).join("");
    document.getElementById("cuerpo-mediciones").innerHTML = filas;
  }

  function pintar() {
    pintarCarta1();
    reiniciar();
    pintarTabla();
  }

  /* --- Prediccion --- */

  function explicar(bien, real, dicho) {
    var cuenta = "Cada división lanza un hilo y no dos: la mitad derecha la hace " +
      "el hilo que ya venía. Son 1 + 2 + 4 = 2³ − 1 = " + real +
      "; con profundidad 4 serían 15.";
    if (bien) { return "Sí: " + real + " hilos. " + cuenta; }
    if (dicho === 8) {
      return "8 son los hilos que trabajan a la vez en las hojas, contando el " +
        "principal. Creados con std::thread son " + real + ". " + cuenta;
    }
    if (dicho === 14) {
      return "14 sería lanzar dos hilos por división. " + cuenta;
    }
    return "Se crean " + real + ", no " + Motor.num(dicho) + ". " + cuenta;
  }

  var RAZONES = {
    correcta: "Eso es. Con un nivel más de corte las mezclas intermedias, las " +
      "cuatro de 5 M y las dos de 10 M, quedan repartidas entre varios hilos en " +
      "lugar de caer en la parte que corre con uno solo. Lo único que nunca se " +
      "reparte es la mezcla de arriba: 83 ms con un hilo, y por eso de 3 a 4 " +
      "apenas se bajan 14 ms.",
    hardware: "taskset -c 0-3 amarra el proceso a cuatro núcleos: los ocho hilos " +
      "se turnan en cuatro. La ganancia de 774 a 654 ms no viene de núcleos extra.",
    arriba: "Esa nunca se reparte: la mezcla de [0, 20 M) la hace un solo hilo y " +
      "tarda 83 ms sea cual sea la profundidad. Ahí se detiene la ganancia: de " +
      "profundidad 3 a 4 solo se bajan 14 ms.",
    cache: "Los trozos de 1,25 M son los de profundidad 4, y de 3 a 4 apenas se " +
      "bajan 14 ms. Con 20 M de enteros, 80 MB, ningún nivel completo de este " +
      "árbol cabe en la L3; la ganancia viene del reparto de las mezclas."
  };

  document.querySelectorAll("[data-prof]").forEach(function (b) {
    b.addEventListener("click", function () {
      prof = parseInt(b.dataset.prof, 10);
      pintar();
    });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    if (k < lista.length - 1) { k++; pintarPasos(); }
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = lista.length - 1;
    pintarPasos();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", reiniciar);

  Motor.conectarPrediccion(
    { entrada: "prediccion", boton: "btn-comprobar", veredicto: "veredicto" },
    function () { return hilosCreados(N, 3, MINIMO); },
    explicar);
  Motor.conectarOpciones("opciones-medida", "veredicto-medida", RAZONES);

  pintar();
})();
