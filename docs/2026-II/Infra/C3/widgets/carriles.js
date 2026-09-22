if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Carriles de un registro SIMD y los cinco patrones de encaje_simd.py:
   cuantos elementos caben por instruccion, cuantas instrucciones recorren
   el arreglo y cual de las cuatro condiciones rompe cada patron.          */

var REGISTROS = [
  { bits: 128, nombre: "SSE" },
  { bits: 256, nombre: "AVX" },
  { bits: 512, nombre: "AVX-512" }
];
var DATOS = [
  { bits: 32, nombre: "float32" },
  { bits: 64, nombre: "float64" }
];
var N = 5000000;

/* Las cuatro respuestas posibles; null es "no rompe ninguna". */
var CLAVES = ["ninguna", "regular", "bifurcacion", "independencia"];
var CONDICIONES = {
  ninguna: null,
  regular: "acceso regular",
  bifurcacion: "bifurcación por dato",
  independencia: "independencia entre elementos"
};

/* Tiempos medidos en el deck sobre 5.000.000 de float64, en ms. */
var PATRONES = [
  {
    id: "contiguo", nombre: "Contiguo", ms: 11.8, factor: 1, rompe: null,
    codigo: ["def contiguo():", "    return a * 2.5 + 1.0"],
    razones: {
      ninguna: "Ninguna. a * 2.5 + 1.0 hace la misma cuenta sobre elementos " +
        "independientes, recorridos en orden y sin condición: cumple las cuatro. " +
        "Tarda 11,8 ms y es la referencia, 1×, de las otras cuatro filas.",
      regular: "El acceso no puede ser más regular: a se recorre de principio a " +
        "fin con paso 1, y cada lectura llena el registro con cuatro double " +
        "seguidos. Por eso tarda 11,8 ms y sirve de referencia, 1×.",
      bifurcacion: "No hay if ni condición que dependa del dato: cada elemento " +
        "hace la misma multiplicación y la misma suma. Tarda 11,8 ms, la " +
        "referencia 1×.",
      independencia: "a[i] * 2.5 + 1.0 no mira ningún otro elemento, así que los " +
        "cuatro double de un registro se calculan a la vez. Tarda 11,8 ms, la " +
        "referencia 1×."
    }
  },
  {
    id: "disperso", nombre: "Índices dispersos", ms: 63.6, factor: 5.4,
    rompe: "acceso regular",
    codigo: ["def disperso():", "    return a[idx] * 2.5 + 1.0"],
    razones: {
      regular: "Acceso regular. idx es una permutación, así que a[idx] salta por " +
        "la memoria y trae un elemento por línea de caché: el registro no se " +
        "llena y el ancho de 256 bits queda desaprovechado. 63,6 ms, 5,4 veces " +
        "el contiguo.",
      ninguna: "La cuenta es la misma que en contiguo y sin embargo tarda 63,6 ms, " +
        "5,4 veces más. Lo que cambió es a[idx]: con los índices en desorden cada " +
        "lectura cae en otra línea de caché y la memoria no alcanza a llenar el " +
        "registro.",
      bifurcacion: "No hay condición: todos los elementos hacen * 2.5 + 1.0. El " +
        "sobrecosto, 63,6 ms contra 11,8, viene de leer a[idx] saltando por la " +
        "memoria en vez de avanzar con paso fijo.",
      independencia: "Cada a[idx[i]] * 2.5 + 1.0 se calcula solo, sin mirar al " +
        "anterior. Lo que rompe es el acceso: la permutación deja las lecturas " +
        "dispersas, un elemento por línea de caché, y el patrón tarda 63,6 ms, " +
        "5,4×."
    }
  },
  {
    id: "where", nombre: "np.where", ms: 21.2, factor: 1.8, rompe: null,
    codigo: ["def bifurcacion_vectorizada():",
             "    return np.where(a > 0.5, a * 2.5, -a)"],
    razones: {
      ninguna: "Ninguna. np.where evalúa las dos ramas, a * 2.5 y -a, sobre el " +
        "arreglo completo y con la máscara a > 0.5 elige por elemento: no hay " +
        "salto, así que vectoriza. Tarda 21,2 ms, 1,8 veces el contiguo, porque " +
        "hace el doble de trabajo.",
      bifurcacion: "Parece una bifurcación, pero np.where no salta: calcula las " +
        "dos ramas completas y la máscara escoge. Por eso vectoriza y tarda " +
        "21,2 ms (1,8×), no los 1.578,3 ms del mismo if escrito en un bucle.",
      regular: "Los tres arreglos, a > 0.5, a * 2.5 y -a, se recorren en orden " +
        "con paso 1. Los 21,2 ms (1,8×) salen de evaluar las dos ramas, no de la " +
        "memoria.",
      independencia: "Cada elemento decide con su propio a[i]; nada depende del " +
        "anterior. Lo que cuesta, 21,2 ms (1,8×), es calcular las dos ramas " +
        "antes de elegir."
    }
  },
  {
    id: "bucle", nombre: "if en bucle", ms: 1578.3, factor: 134,
    rompe: "bifurcación por dato",
    codigo: ["def bifurcacion_en_bucle():",
             "    s = np.empty(n)",
             "    for i in range(n):",
             "        s[i] = a[i] * 2.5 if a[i] > 0.5 else -a[i]",
             "    return s"],
    razones: {
      bifurcacion: "Bifurcación por dato. El if decide por cada a[i], y los cuatro " +
        "double de un registro no pueden tomar caminos distintos. Además el " +
        "for de Python devuelve el control al intérprete en cada elemento, que " +
        "empaqueta y desempaqueta cada valor: 1.578,3 ms, 134 veces el contiguo.",
      ninguna: "if a[i] > 0.5 decide por dato, y el patrón tarda 1.578,3 ms, 134 " +
        "veces el contiguo. Encima el for de Python saca cada elemento del " +
        "arreglo como objeto, así que ninguna rutina de NumPy alcanza a " +
        "vectorizar.",
      regular: "El índice i avanza de uno en uno: el acceso es regular. Lo que " +
        "rompe es el if que decide por dato, dentro de un for de Python que paga " +
        "el intérprete en cada vuelta: 1.578,3 ms, 134×.",
      independencia: "s[i] solo depende de a[i], no de s[i-1]; de hecho la misma " +
        "cuenta escrita con np.where baja a 21,2 ms. Lo que rompe es la " +
        "bifurcación por dato dentro de un for de Python: 1.578,3 ms, 134×."
    }
  },
  {
    id: "recurrencia", nombre: "Recurrencia", ms: 1681.6, factor: 143,
    rompe: "independencia entre elementos",
    codigo: ["def recurrencia():",
             "    s = np.empty(n)",
             "    s[0] = a[0]",
             "    for i in range(1, n):",
             "        s[i] = 0.99 * s[i - 1] + a[i]",
             "    return s"],
    razones: {
      independencia: "Independencia entre elementos. s[i] necesita s[i-1], así que " +
        "no hay cuatro valores que calcular a la vez. NumPy solo trae rutina " +
        "propia para recurrencias conocidas, como np.cumsum y np.cumprod; esta " +
        "no tiene forma vectorizada. 1.681,6 ms, 143 veces el contiguo.",
      ninguna: "Cada paso espera al anterior: s[i] = 0.99 * s[i - 1] + a[i]. Con " +
        "esa cadena no se llena un registro, y tampoco hay un operador de NumPy " +
        "que la reescriba: 1.681,6 ms, 143×.",
      regular: "El acceso va en orden, i de 1 a n - 1 con paso 1. Lo que impide " +
        "vectorizar es la cadena de s[i - 1] a s[i]: cada valor espera al " +
        "anterior. 1.681,6 ms, 143×.",
      bifurcacion: "No hay if: todos los elementos hacen la misma cuenta. La traba " +
        "es s[i - 1]: no se pueden calcular cuatro s a la vez porque cada uno " +
        "espera al anterior. 1.681,6 ms, 143×."
    }
  }
];

/* Elementos que caben en el registro: 256 / 64 = 4 double. */
function carriles(bitsRegistro, bitsDato) {
  return bitsRegistro / bitsDato;
}

/* Instrucciones para recorrer n elementos de a `carriles`; la cola cuenta
   como una pasada mas.                                                    */
function instrucciones(n, carriles) {
  return Math.ceil(n / carriles);
}

/* Elementos que sobran al final y se hacen escalares. */
function cola(n, carriles) {
  return n % carriles;
}

function buscar(id) {
  for (var i = 0; i < PATRONES.length; i++) {
    if (PATRONES[i].id === id) { return PATRONES[i]; }
  }
  return null;
}

/* La condicion que rompe el patron, o null si cumple las cuatro. */
function clasificar(patron) {
  var p = buscar(patron);
  return p ? p.rompe : null;
}

/* La clave de CLAVES cuya condicion es la que rompe el patron. */
function claveCorrecta(p) {
  for (var i = 0; i < CLAVES.length; i++) {
    if (CONDICIONES[CLAVES[i]] === p.rompe) { return CLAVES[i]; }
  }
  return "ninguna";
}

/* Las razones del patron con la clave correcta renombrada a "correcta",
   que es lo que el motor pinta en verde.                                  */
function razonesPara(p) {
  var correcta = claveCorrecta(p);
  var salida = {};
  CLAVES.forEach(function (c) {
    salida[c === correcta ? "correcta" : c] = p.razones[c];
  });
  return salida;
}

/* respuestas: [{ id, primera }] con la primera clave que se pulso. */
function contarAciertos(respuestas) {
  return respuestas.filter(function (r) {
    var p = buscar(r.id);
    return p !== null && claveCorrecta(p) === r.primera;
  }).length;
}

function escapar(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    REGISTROS: REGISTROS, DATOS: DATOS, N: N, CLAVES: CLAVES,
    CONDICIONES: CONDICIONES, PATRONES: PATRONES,
    carriles: carriles, instrucciones: instrucciones, cola: cola,
    buscar: buscar, clasificar: clasificar, claveCorrecta: claveCorrecta,
    razonesPara: razonesPara, contarAciertos: contarAciertos, escapar: escapar
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;

  /* ---- Carta 1: el registro y sus carriles ---- */
  var reg = 256, dato = 64;
  var destapado = false;   // el registro se dibuja al comprobar

  function nombreReg(bits) {
    for (var i = 0; i < REGISTROS.length; i++) {
      if (REGISTROS[i].bits === bits) { return REGISTROS[i].nombre; }
    }
    return String(bits);
  }

  function nombreDato(bits) {
    for (var i = 0; i < DATOS.length; i++) {
      if (DATOS[i].bits === bits) { return DATOS[i].nombre; }
    }
    return String(bits);
  }

  function otroDato(bits) {
    for (var i = 0; i < DATOS.length; i++) {
      if (DATOS[i].bits !== bits) { return DATOS[i]; }
    }
    return DATOS[0];
  }

  function leerN() {
    var n = parseInt(document.getElementById("n").value, 10);
    return isNaN(n) || n < 1 ? 1 : n;
  }

  function actualizarPregunta() {
    document.getElementById("ver-reg").textContent = nombreReg(reg) + " (" + reg + " bits)";
    document.getElementById("ver-dato").textContent = nombreDato(dato);
    document.getElementById("ver-n").textContent = num(leerN());
  }

  function filaRegistro(rotulo, letra, clase, c) {
    var cajas = "";
    for (var i = 0; i < c; i++) {
      cajas += "<span class=\"caja " + clase + "\" title=\"carril " + i + "\">" +
        letra + i + "</span>";
    }
    return "<div class=\"fila-n\"><label style=\"width:2.6rem;text-align:right;" +
      "font-family:ui-monospace,monospace\">" + rotulo + "</label>" +
      "<div class=\"arreglo\" style=\"margin:0.25rem 0;gap:4px\">" + cajas + "</div></div>";
  }

  function pintarRegistro() {
    var panel = document.getElementById("panel-registro");
    var alerta = document.getElementById("alerta-corto");
    if (!destapado) {
      panel.innerHTML = "";
      Motor.pintarChips("chips-registro", []);
      alerta.hidden = true;
      return;
    }
    var c = carriles(reg, dato);
    var n = leerN();
    var q = cola(n, c);
    panel.innerHTML =
      filaRegistro("a", "a", "negativo", c) +
      filaRegistro("+ b", "b", "visitada", c) +
      filaRegistro("= c", "c", "positivo", c) +
      "<div class=\"progreso\">Un registro de " + reg + " bits: " + c + " carriles de " +
      dato + " bits. Una instrucción suma los " + c + " pares y produce los " + c +
      " valores de c.</div>";
    Motor.pintarChips("chips-registro", [
      { texto: "carriles", valor: num(c) },
      { texto: "instrucciones", valor: num(instrucciones(n, c)), cuenta: true },
      { texto: "cola", valor: num(q) + (q === 0 ? "" : q === 1 ? " escalar" : " escalares") }
    ]);
    alerta.hidden = n > 16;
  }

  function cambio() {
    destapado = false;
    actualizarPregunta();
    document.getElementById("veredicto").className = "veredicto";
    pintarRegistro();
  }

  function explicar(bien, real, dicho) {
    var c = carriles(reg, dato);
    var n = leerN();
    var q = cola(n, c);
    var otro = otroDato(dato);
    var otroC = carriles(reg, otro.bits);
    var t = bien ? "Sí, " + num(real) + ". " : "No: son " + num(real) + ", no " + num(dicho) + ". ";
    t += "Un registro de " + reg + " bits carga " + c + " " + nombreDato(dato) + " de " + dato +
      " bits, así que una instrucción atiende " + c + " elementos y el bucle avanza de " + c +
      " en " + c + ": " + num(n) + " / " + c + " = ";
    if (q === 0) {
      t += num(real) + ".";
    } else {
      t += num(n / c, 3) + ", redondeado hacia arriba: " + num(real - 1) +
        (real - 1 === 1 ? " registro lleno" : " registros llenos") + " y una pasada más para " +
        (q === 1 ? "el elemento que sobra, que va escalar."
                 : "los " + q + " que sobran, que van escalares.");
    }
    var otras = instrucciones(n, otroC);
    t += " El escalar hace " + num(n) + (n === 1 ? " instrucción, una por elemento" : " instrucciones, una por elemento") +
      ": el cociente es " + c + ". Con " + otro.nombre + " serían " + otroC + " por registro y " +
      num(otras) + (otras === 1 ? " instrucción." : " instrucciones.");
    destapado = true;
    pintarRegistro();
    return t;
  }

  document.querySelectorAll("[data-reg]").forEach(function (b) {
    b.addEventListener("click", function () {
      reg = parseInt(b.dataset.reg, 10);
      document.querySelectorAll("[data-reg]").forEach(function (o) { o.classList.remove("activo"); });
      b.classList.add("activo");
      cambio();
    });
  });
  document.querySelectorAll("[data-dato]").forEach(function (b) {
    b.addEventListener("click", function () {
      dato = parseInt(b.dataset.dato, 10);
      document.querySelectorAll("[data-dato]").forEach(function (o) { o.classList.remove("activo"); });
      b.classList.add("activo");
      cambio();
    });
  });
  document.getElementById("n").addEventListener("input", cambio);
  Motor.conectarPrediccion(
    { entrada: "prediccion", boton: "btn-comprobar", veredicto: "veredicto" },
    function () { return instrucciones(leerN(), carriles(reg, dato)); },
    explicar);

  /* ---- Carta 3: los cinco patrones, uno a la vez ---- */
  var indice = 0;
  var respuestas = [];
  // El motor lee este mismo objeto en cada clic; se rellena por patron.
  var razones = {};

  var botones = document.querySelectorAll("#opciones-patron button");
  var cajaPatron = document.getElementById("veredicto-patron");
  var btnSiguiente = document.getElementById("btn-siguiente");
  var btnOtra = document.getElementById("btn-otra");

  function actual() { return PATRONES[indice]; }

  function respondido(id) {
    return respuestas.some(function (r) { return r.id === id; });
  }

  function primera(id) {
    for (var i = 0; i < respuestas.length; i++) {
      if (respuestas[i].id === id) { return respuestas[i].primera; }
    }
    return null;
  }

  function terminado() { return respuestas.length >= PATRONES.length; }

  function mostrarPatron() {
    var p = actual();
    document.getElementById("progreso").textContent =
      "Patrón " + num(indice + 1) + " de " + num(PATRONES.length) + ": " + p.nombre;
    document.getElementById("codigo-patron").innerHTML = p.codigo.map(function (l, i) {
      return "<div class=\"linea bloque-1\"><span class=\"num\">" + (i + 1) +
        "</span><span class=\"txt\">" + escapar(l) + "</span></div>";
    }).join("");
    var nuevas = razonesPara(p);
    Object.keys(razones).forEach(function (k) { delete razones[k]; });
    Object.keys(nuevas).forEach(function (k) { razones[k] = nuevas[k]; });
    var correcta = claveCorrecta(p);
    botones.forEach(function (b) {
      b.dataset.op = b.dataset.clave === correcta ? "correcta" : b.dataset.clave;
    });
    cajaPatron.className = "veredicto";
    cajaPatron.textContent = "";
    btnSiguiente.hidden = true;
    pintarTabla();
  }

  function pintarTabla() {
    var filas = PATRONES.map(function (p, i) {
      var visto = respondido(p.id);
      var marca = i === indice && !terminado() ? " style=\"background:var(--resalte)\"" : "";
      if (!visto) {
        return "<tr" + marca + "><td>" + p.nombre + "</td><td class=\"pend\">?</td>" +
          "<td class=\"pend\">?</td><td class=\"pend\">?</td></tr>";
      }
      return "<tr" + marca + "><td>" + p.nombre + "</td><td>" + num(p.ms, 1) + " ms</td><td>" +
        num(p.factor, 1) + "×</td><td>" + (p.rompe === null ? "ninguna" : p.rompe) + "</td></tr>";
    }).join("");
    document.getElementById("cuerpo-patrones").innerHTML = filas;
  }

  function pintarMarcador() {
    if (!terminado()) { Motor.pintarChips("chips-patrones", []); return; }
    var aciertos = contarAciertos(respuestas);
    var fallados = PATRONES.filter(function (p) {
      return primera(p.id) !== claveCorrecta(p);
    }).map(function (p) { return p.nombre; });
    Motor.pintarChips("chips-patrones", [
      { texto: "a la primera", valor: num(aciertos) + " de " + num(PATRONES.length), cuenta: true }
    ]);
    document.getElementById("progreso").textContent = fallados.length === 0
      ? "Los cinco patrones respondidos a la primera."
      : "Los cinco patrones respondidos. Vuelva a leer la razón de: " + fallados.join(", ") + ".";
  }

  function terminar() {
    btnSiguiente.hidden = true;
    btnOtra.hidden = false;
    pintarTabla();
    pintarMarcador();
  }

  function reiniciar() {
    indice = 0;
    respuestas = [];
    btnOtra.hidden = true;
    mostrarPatron();
    pintarMarcador();
  }

  Motor.conectarOpciones("opciones-patron", "veredicto-patron", razones);

  botones.forEach(function (b) {
    b.addEventListener("click", function () {
      if (terminado()) { return; }
      var p = actual();
      if (!respondido(p.id)) {
        respuestas.push({ id: p.id, primera: b.dataset.clave });
        pintarTabla();
      }
      if (indice + 1 < PATRONES.length) {
        btnSiguiente.hidden = false;
      } else {
        terminar();
      }
    });
  });

  btnSiguiente.addEventListener("click", function () {
    if (!respondido(actual().id) || indice + 1 >= PATRONES.length) { return; }
    indice += 1;
    mostrarPatron();
  });

  btnOtra.addEventListener("click", reiniciar);

  /* ---- Carta 4: por que los dos bucles empatan ---- */
  var RAZONES_BUCLES = {
    correcta: "Eso es. Cada vuelta del for empaqueta el valor en un objeto de Python y " +
      "lo desempaqueta en la siguiente, cerca de 0,3 µs por elemento, y ese costo tapa " +
      "la diferencia entre 1.578 y 1.682 ms. Solo al reescribir con np.where una de " +
      "las dos se separa, 21,2 ms; la otra no tiene forma vectorizada.",
    misma: "Rompen condiciones distintas: el if en bucle rompe la bifurcación por dato " +
      "y la recurrencia rompe la independencia entre elementos. Si fuera la misma " +
      "condición, np.where no separaría a una de las dos, y sí lo hace: 21,2 ms " +
      "contra 1.681,6.",
    avx: "Lo tiene: __m256d carga 4 double por registro, y por eso el patrón contiguo, " +
      "que también es float64, tarda 11,8 ms. Los dos bucles no llegan a esa rutina " +
      "porque el for de Python devuelve el control al intérprete en cada elemento.",
    grande: "El tamaño ayuda a la versión vectorizada, no la castiga: con 5 millones el " +
      "costo fijo de cargar y descargar el registro se reparte. Lo que iguala a los " +
      "dos bucles es el intérprete, que cobra lo mismo por elemento sin importar " +
      "cuántos sean."
  };
  Motor.conectarOpciones("opciones-bucles", "veredicto-bucles", RAZONES_BUCLES);

  actualizarPregunta();
  pintarRegistro();
  mostrarPatron();
  pintarMarcador();
})();
