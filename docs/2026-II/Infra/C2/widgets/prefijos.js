/* Suma de prefijos en dos pasadas sobre tres bloques, con la logica de
   en_dos_pasadas de scan.cpp: cada bloque acumula lo suyo y reporta un
   total, los desplazamientos se encadenan, y cada bloque vuelve a
   recorrerse partiendo del desplazamiento que le toca.                   */

if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

var VALORES_BASE = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8];
var BLOQUES = 3;
var SEMILLA_INICIAL = 11;

/* La operacion que acumula y su elemento neutro: 0 para la suma y
   -Infinity para el maximo, que en pantalla se muestra como "ninguno".   */
var OPERACIONES = {
  suma:   { op: function (a, b) { return a + b; }, neutro: 0 },
  maximo: { op: function (a, b) { return Math.max(a, b); }, neutro: -Infinity }
};

/* Limites del bloque h; el ultimo se queda con el resto, como en el deck. */
function limites(n, bloques, h) {
  var paso = Math.floor(n / bloques);
  var ini = h * paso;
  return { ini: ini, fin: h === bloques - 1 ? n : ini + paso };
}

function secuencial(v, opNombre) {
  var o = OPERACIONES[opNombre];
  var acumulado = o.neutro, r = [];
  for (var i = 0; i < v.length; i++) {  // cada paso necesita el anterior
    acumulado = o.op(acumulado, v[i]);
    r[i] = acumulado;
  }
  return r;
}

/* Primera pasada: cada bloque acumula sus elementos y reporta el total. */
function primeraPasada(v, bloques, opNombre) {
  var o = OPERACIONES[opNombre];
  var totales = [];
  for (var h = 0; h < bloques; h++) {
    var l = limites(v.length, bloques, h);
    var s = o.neutro;
    for (var i = l.ini; i < l.fin; i++) { s = o.op(s, v[i]); }
    totales[h] = s;
  }
  return totales;
}

/* Cada bloque arranca donde terminan todos los anteriores. */
function desplazamientos(totales, opNombre) {
  var o = OPERACIONES[opNombre];
  var d = [o.neutro];
  for (var h = 1; h < totales.length; h++) {
    d[h] = o.op(d[h - 1], totales[h - 1]);
  }
  return d;
}

/* Segunda pasada: cada bloque vuelve a recorrerse desde su desplazamiento
   y escribe el acumulado en cada posicion.                               */
function segundaPasada(v, bloques, despl, opNombre) {
  var o = OPERACIONES[opNombre];
  var r = [];
  for (var h = 0; h < bloques; h++) {
    var l = limites(v.length, bloques, h);
    var acumulado = despl[h];
    for (var i = l.ini; i < l.fin; i++) {
      acumulado = o.op(acumulado, v[i]);
      r[i] = acumulado;
    }
  }
  return r;
}

/* Posiciones donde dos resultados no coinciden. */
function comparar(a, b) {
  var difieren = [];
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) { difieren.push(i); }
  }
  return difieren;
}

/* n enteros de 1 a 9 con el mismo generador lineal que usa peso(x) en el
   deck; devuelve tambien la semilla con la que sigue la proxima tanda.   */
function generar(semilla, n) {
  var valores = [];
  for (var i = 0; i < n; i++) {
    semilla = (semilla * 1103515245 + 12345) % 1000003;
    valores.push(1 + semilla % 9);
  }
  return { valores: valores, semilla: semilla };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    VALORES_BASE: VALORES_BASE, BLOQUES: BLOQUES, SEMILLA_INICIAL: SEMILLA_INICIAL,
    OPERACIONES: OPERACIONES, limites: limites, secuencial: secuencial,
    primeraPasada: primeraPasada, desplazamientos: desplazamientos,
    segundaPasada: segundaPasada, comparar: comparar, generar: generar
  };
}

if (typeof document !== "undefined") (function () {
  var valores = VALORES_BASE.slice();
  var opNombre = "suma";
  var semilla = SEMILLA_INICIAL;
  var CLASE_BLOQUE = ["b1", "b2", "b3"];
  var NOMBRE = { suma: "suma", maximo: "máximo" };
  var TIEMPOS = { secuencial: 2731, dosPasadas: 1636, hilos: 4 };

  function mostrar(x) { return x === -Infinity ? "ninguno" : Motor.num(x); }

  function bloqueDe(i) {
    for (var h = 0; h < BLOQUES; h++) {
      var l = limites(valores.length, BLOQUES, h);
      if (i >= l.ini && i < l.fin) { return h; }
    }
    return BLOQUES - 1;
  }

  function caja(valor, indice, clase) {
    return "<span class=\"caja " + clase + "\"><span class=\"indice\">" +
      indice + "</span>" + mostrar(valor) + "</span>";
  }

  /* "8, 9, 10 y 11" */
  function listar(indices) {
    if (indices.length === 1) { return String(indices[0]); }
    return indices.slice(0, -1).join(", ") + " y " + indices[indices.length - 1];
  }

  /* Los doce valores en tres grupos; con totales, un chip bajo cada grupo. */
  function pintarGrupos(idCaja, totales) {
    var html = "<div style=\"display:flex;gap:1.2rem;flex-wrap:wrap\">";
    for (var h = 0; h < BLOQUES; h++) {
      var l = limites(valores.length, BLOQUES, h);
      html += "<div><div class=\"progreso\">bloque " + (h + 1) +
        " · posiciones " + l.ini + " a " + (l.fin - 1) + "</div>" +
        "<div class=\"arreglo fila-arreglo\">";
      for (var i = l.ini; i < l.fin; i++) {
        html += caja(valores[i], i, CLASE_BLOQUE[h]);
      }
      html += "</div>";
      if (totales) {
        html += "<div class=\"chips\"><span class=\"chip\">" +
          (opNombre === "suma" ? "suma" : "máximo") + " del bloque <b>" +
          mostrar(totales[h]) + "</b></span></div>";
      }
      html += "</div>";
    }
    document.getElementById(idCaja).innerHTML = html + "</div>";
  }

  /* Una fila de doce cajas; las posiciones en rojo van sin color de bloque. */
  function pintarFila(rotulo, lista, rojas) {
    var html = "<div class=\"progreso\">" + rotulo + "</div>" +
      "<div class=\"arreglo fila-arreglo\" style=\"row-gap:1.4rem\">";
    for (var i = 0; i < lista.length; i++) {
      var roja = rojas.indexOf(i) >= 0;
      html += caja(lista[i], i, roja ? "negativo" : CLASE_BLOQUE[bloqueDe(i)]);
    }
    return html + "</div>";
  }

  function totalesActuales() {
    return primeraPasada(valores, BLOQUES, opNombre);
  }

  function limpiarAbajo() {
    document.getElementById("panel-totales").innerHTML = "";
    document.getElementById("panel-segunda").innerHTML = "";
    ["veredicto-despl", "veredicto-segunda"].forEach(function (id) {
      document.getElementById(id).className = "veredicto";
    });
    for (var h = 0; h < BLOQUES; h++) {
      var el = document.getElementById("despl-" + h);
      el.value = "";
      el.style.borderColor = "";
      el.style.background = "";
      el.disabled = false;
      el.placeholder = "su número";
    }
    if (opNombre === "maximo") {
      var primero = document.getElementById("despl-0");
      primero.disabled = true;
      primero.placeholder = "ninguno";
    }
  }

  function pintar() {
    document.getElementById("ver-op").textContent = NOMBRE[opNombre];
    document.getElementById("nombre-op").textContent = NOMBRE[opNombre];
    pintarGrupos("panel-valores", null);
    limpiarAbajo();
  }

  function pintarTotales() {
    pintarGrupos("panel-totales", totalesActuales());
  }

  /* Los desplazamientos con los que corre la segunda pasada: los que
     escribio el estudiante donde haya numero, los correctos en el resto. */
  function desplUsados() {
    var correctos = desplazamientos(totalesActuales(), opNombre);
    var usados = correctos.slice();
    var escribio = false;
    for (var h = opNombre === "maximo" ? 1 : 0; h < BLOQUES; h++) {
      var d = Motor.leerNumero("despl-" + h);
      if (!isNaN(d)) { usados[h] = d; escribio = true; }
    }
    return { usados: usados, escribio: escribio };
  }

  function explicarDespl(totales, esperados) {
    if (opNombre === "suma") {
      return "El primer bloque arranca en 0: antes de él no hay nada " +
        "acumulado. El segundo arranca donde termina el primero: " +
        mostrar(totales[0]) + ". El tercero, donde terminan los dos " +
        "anteriores: " + mostrar(totales[0]) + " + " + mostrar(totales[1]) +
        " = " + mostrar(esperados[2]) + ".";
    }
    return "El primer bloque arranca sin máximo previo. El segundo arranca " +
      "con el máximo del primero: " + mostrar(totales[0]) + ". El tercero, " +
      "con el mayor de los dos anteriores: máx(" + mostrar(totales[0]) + ", " +
      mostrar(totales[1]) + ") = " + mostrar(esperados[2]) + ".";
  }

  function comprobarDespl() {
    var totales = totalesActuales();
    var esperados = desplazamientos(totales, opNombre);
    var caja = document.getElementById("veredicto-despl");
    var bien = [], mal = [], vacias = [];
    for (var h = opNombre === "maximo" ? 1 : 0; h < BLOQUES; h++) {
      var el = document.getElementById("despl-" + h);
      var dicho = Motor.leerNumero("despl-" + h);
      var ok = dicho === esperados[h];
      el.style.borderColor = ok ? "var(--verde)" : "var(--rojo)";
      el.style.background = ok ? "var(--verde-suave)" : "var(--rojo-suave)";
      if (isNaN(dicho)) { vacias.push(h + 1); }
      (ok ? bien : mal).push(h + 1);
    }
    if (vacias.length === mal.length + bien.length) {
      caja.className = "veredicto mal";
      caja.textContent = "Escriba los desplazamientos antes de comprobar.";
      return;
    }
    var cabeza = mal.length === 0
      ? "Bien las " + bien.length + " casillas. "
      : (bien.length ? "Bien: bloque " + listar(bien) + ". " : "") +
        "Falla: bloque " + listar(mal) + ". ";
    caja.className = "veredicto " + (mal.length ? "mal" : "bien");
    caja.textContent = cabeza + explicarDespl(totales, esperados);
  }

  function pintarSegunda() {
    var d = desplUsados();
    var r = segundaPasada(valores, BLOQUES, d.usados, opNombre);
    var s = secuencial(valores, opNombre);
    var dif = comparar(r, s);
    var panel = document.getElementById("panel-segunda");
    panel.innerHTML =
      "<div class=\"chips\" style=\"margin-bottom:0.4rem\">" +
      "<span class=\"chip\">desplazamientos <b>" +
      d.usados.map(mostrar).join(", ") + "</b></span>" +
      "<span class=\"chip cuenta\">" +
      (d.escribio ? "los que escribió" : "los correctos, no escribió ninguno") +
      "</span></div>" +
      pintarFila("r, en dos pasadas", r, dif) +
      pintarFila("secuencial, de corrido", s, []);
    var caja = document.getElementById("veredicto-segunda");
    caja.className = "veredicto " + (dif.length ? "mal" : "bien");
    caja.textContent = dif.length
      ? "Difieren en las posiciones " + listar(dif) + ": un desplazamiento " +
        "equivocado da números plausibles y la comparación elemento a " +
        "elemento los delata."
      : "Coinciden las doce posiciones. El último valor, r[11] = " +
        mostrar(r[11]) + ", es el mismo que da el recorrido de corrido.";
  }

  var RAZONES = {
    correcta: "La secuencial. Sin peso(x), cada elemento cuesta una suma y " +
      "una escritura: la segunda pasada es puro movimiento de memoria, " +
      "20 millones de lecturas de más, y eso cuesta más de lo que ahorra " +
      "repartir entre 4 hilos.",
    span: "El span baja, sí, pero el trabajo total se duplica: las dos " +
      "pasadas leen los 20 millones de elementos dos veces. Con una suma " +
      "pelada ese trabajo es solo mover memoria, y mover memoria es lo que " +
      "limita.",
    empate: "No empatan: la de dos pasadas recorre los 20 millones de " +
      "elementos dos veces y la secuencial una sola. Sin cómputo que " +
      "repartir, nadie compensa esa pasada de más.",
    hilos: "Más hilos no arreglan un programa limitado por memoria: el " +
      "camino a la memoria es el mismo con 4 hilos que con 16, y la " +
      "segunda pasada sigue leyendo los 20 millones otra vez."
  };

  document.querySelectorAll("[data-operacion]").forEach(function (b) {
    b.addEventListener("click", function () {
      opNombre = b.dataset.operacion;
      pintar();
    });
  });
  document.getElementById("btn-otros").addEventListener("click", function () {
    var g = generar(semilla, valores.length);
    valores = g.valores;
    semilla = g.semilla;
    pintar();
  });
  document.getElementById("btn-base").addEventListener("click", function () {
    valores = VALORES_BASE.slice();
    pintar();
  });
  document.getElementById("btn-totales").addEventListener("click", pintarTotales);
  document.getElementById("btn-despl").addEventListener("click", comprobarDespl);
  document.getElementById("btn-segunda").addEventListener("click", pintarSegunda);
  Motor.conectarOpciones("opciones-medida", "veredicto-medida", RAZONES);

  Motor.pintarChips("chips-medida", [
    { texto: "speedup", valor: Motor.num(TIEMPOS.secuencial / TIEMPOS.dosPasadas, 2) },
    { texto: "eficiencia con " + TIEMPOS.hilos + " hilos",
      valor: Motor.num(TIEMPOS.secuencial / TIEMPOS.dosPasadas / TIEMPOS.hilos, 2),
      cuenta: true }
  ]);
  pintar();
})();
