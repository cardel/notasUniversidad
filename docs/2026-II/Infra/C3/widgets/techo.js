if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* La ley de Amdahl aplicada a optimizar una funcion: si una fraccion p del
   tiempo se acelera k veces, S = 1 / ((1 - p) + p / k). El perfil es el
   del deck: 20 s repartidos en A 5 %, B 70 %, C 20 % y D 5 %.            */

var T = 20;
var FUNCIONES = [
  { nombre: "A", hace: "valida la entrada con expresiones regulares", p: 0.05, color: "var(--gris)" },
  { nombre: "B", hace: "el ciclo que recorre las filas y acumula", p: 0.70, color: "var(--azul)" },
  { nombre: "C", hace: "ordena el resultado", p: 0.20, color: "var(--ambar)" },
  { nombre: "D", hace: "escribe el archivo de salida", p: 0.05, color: "var(--verde)" }
];

/* Cuantas veces mas rapido queda el programa. */
function speedup(p, k) {
  return 1 / ((1 - p) + p / k);
}

/* Con k infinito la parte acelerada desaparece; queda lo que no se toca. */
function techo(p) {
  return 1 / (1 - p);
}

function tiempoNuevo(T, p, k) {
  return T * ((1 - p) + p / k);
}

/* Los dos tramos de la barra: lo que no se toca y lo que se acelera. */
function tramos(T, p, k) {
  var fijo = T * (1 - p);
  return { fijo: fijo, antes: T * p, despues: T * p / k, total: fijo + T * p / k };
}

/* Que pasa con el programa si cada funcion, por separado, va k veces mas rapido. */
function acelerarCada(funciones, T, k) {
  return funciones.map(function (f) {
    return { nombre: f.nombre, p: f.p, tiempo: tiempoNuevo(T, f.p, k),
             s: speedup(f.p, k), techo: techo(f.p) };
  });
}

/* Indice de la funcion que mas baja el total: la de mayor p. */
function mejor(funciones) {
  var m = 0;
  funciones.forEach(function (f, i) { if (f.p > funciones[m].p) { m = i; } });
  return m;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    T: T, FUNCIONES: FUNCIONES, speedup: speedup, techo: techo,
    tiempoNuevo: tiempoNuevo, tramos: tramos, acelerarCada: acelerarCada,
    mejor: mejor
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var destapado = false;   // las cuentas de la carta 3 aparecen al comprobar la prediccion
  var elegida = null;      // la tabla de la carta 4 se llena al escoger una funcion
  var B = FUNCIONES[mejor(FUNCIONES)];

  function leerP() { return parseInt(document.getElementById("rango-p").value, 10) / 100; }
  function leerK() { return parseInt(document.getElementById("rango-k").value, 10); }

  /* El valor de un input number siempre trae punto decimal, y Motor.leerNumero
     lo quita como separador de miles; aqui se lee directo y el veredicto lo
     da Motor.veredictoNumerico.                                             */
  function leerVeces(id) {
    var v = String(document.getElementById(id).value).trim().replace(",", ".");
    return v === "" ? NaN : parseFloat(v);
  }

  function conectarVeces(ids, esperado, explicar) {
    var caja = document.getElementById(ids.veredicto);
    document.getElementById(ids.boton).addEventListener("click", function () {
      var dicho = leerVeces(ids.entrada);
      var real = esperado();
      var v = Motor.veredictoNumerico(dicho, real);
      caja.className = "veredicto " + (v.bien ? "bien" : "mal");
      caja.textContent = isNaN(dicho) ? v.motivo : explicar(v.bien, real, dicho);
    });
  }

  function filasPerfil() {
    return FUNCIONES.map(function (f) {
      return "<tr><td><b>" + f.nombre + "</b></td><td style=\"text-align:left\">" + f.hace +
        "</td><td>" + num(T * f.p, 1) + " s</td><td>" + num(f.p * 100) + " %</td></tr>";
    }).join("");
  }

  function pintarPerfil() {
    // en una pantalla angosta el 5 % es una franja de pocos pixeles: sin rotulo
    var angosta = typeof window !== "undefined" && window.innerWidth < 600;
    Motor.pintarGantt("panel-perfil", FUNCIONES.map(function (f) {
      return {
        rotulo: f.nombre, valor: num(T * f.p, 1) + " s",
        bloques: [{ inicio: 0, fin: T * f.p, color: f.color,
                    texto: angosta && f.p < 0.10 ? "" : num(f.p * 100) + " %",
                    titulo: f.nombre + ": " + num(T * f.p, 1) + " s de " + num(T) }]
      };
    }), T);
    document.getElementById("cuerpo-perfil").innerHTML = filasPerfil();
    document.getElementById("cuerpo-perfil-2").innerHTML = filasPerfil();
    Motor.pintarChips("chips-perfil", [
      { texto: "el programa entero", valor: num(T, 1) + " s" },
      { texto: "la que más pesa", valor: B.nombre + ", " + num(B.p * 100) + " %", cuenta: true },
      { texto: "A y D juntas", valor: num(T * 0.10, 1) + " s" }
    ]);
  }

  function bloquesTramos(t, finAcelerado, rotuloAzul) {
    var b = [];
    if (t.fijo > 0) {
      b.push({ inicio: 0, fin: t.fijo, color: "var(--gris)",
               texto: t.fijo / T >= 0.2 ? "no se toca" : "",
               titulo: "no se toca: " + num(t.fijo, 1) + " s" });
    }
    if (finAcelerado > t.fijo) {
      b.push({ inicio: t.fijo, fin: finAcelerado, color: "var(--azul)",
               texto: (finAcelerado - t.fijo) / T >= 0.2 ? rotuloAzul : "",
               titulo: rotuloAzul + ": " + num(finAcelerado - t.fijo, 1) + " s" });
    }
    return b;
  }

  function pintarPerillas() {
    var p = leerP(), k = leerK();
    var t = tramos(T, p, k);
    document.getElementById("ver-p").textContent = num(p * 100) + " %";
    document.getElementById("ver-k").textContent = num(k) + "×";

    Motor.pintarGantt("panel-perillas", [
      { rotulo: "antes", valor: num(T, 1) + " s", bloques: bloquesTramos(t, T, "se acelera") },
      { rotulo: "después", valor: destapado ? num(t.total, 1) + " s" : "?",
        bloques: destapado ? bloquesTramos(t, t.total, "acelerada") : [] }
    ], T);

    if (!destapado) {
      Motor.pintarChips("chips-perillas", [
        { texto: "el programa queda", valor: "?", cuenta: true },
        { texto: "tiempo nuevo", valor: "?" },
        { texto: "techo con k infinito", valor: "?" }
      ]);
      document.getElementById("formula-perillas").textContent = "";
      return;
    }
    var s = speedup(p, k);
    Motor.pintarChips("chips-perillas", [
      { texto: "el programa queda", valor: num(s, 2) + "× más rápido", cuenta: true },
      { texto: "tiempo nuevo", valor: num(t.total, 1) + " s de " + num(T) },
      { texto: "techo con k infinito", valor: p >= 1 ? "sin techo" : num(techo(p), 2) + "×" }
    ]);
    document.getElementById("formula-perillas").textContent =
      "S = 1 / ((1 − " + num(p, 2) + ") + " + num(p, 2) + "/" + num(k) + ") = 1 / " +
      num((1 - p) + p / k, 3) + " = " + num(s, 2) +
      (p >= 1 ? "" : "; con k infinito, 1 / (1 − " + num(p, 2) + ") = " + num(techo(p), 2));
  }

  function pintarDiez() {
    var diez = acelerarCada(FUNCIONES, T, 10);
    document.getElementById("cuerpo-diez").innerHTML = diez.map(function (f, i) {
      var nombre = "<td><b>" + f.nombre + "</b> (" + num(f.p * 100) + " %)</td>";
      if (elegida === null) {
        return "<tr>" + nombre + "<td class=\"pend\">?</td><td class=\"pend\">?</td>" +
          "<td class=\"pend\">?</td></tr>";
      }
      var marcada = elegida === (i === mejor(FUNCIONES) ? "correcta" : f.nombre.toLowerCase());
      return "<tr" + (marcada ? " style=\"background:var(--resalte)\"" : "") + ">" + nombre +
        "<td>" + num(f.tiempo, 1) + " s</td><td>" + num(f.s, 2) + "×</td><td>" +
        num(f.techo, 2) + "×</td></tr>";
    }).join("");
  }

  function explicar(bien, real, dicho) {
    destapado = true;
    pintarPerillas();
    var t = tramos(T, B.p, 2);
    var texto = "B es el " + num(B.p * 100) + " % de los " + num(T) + " s, " + num(t.antes) +
      " s; el otro " + num((1 - B.p) * 100) + " % (" + num(t.fijo) + " s) no se movió. B pasa de " +
      num(t.antes) + " a " + num(t.despues) + " s y el programa de " + num(T) + " a " + num(T) +
      " × (" + num(1 - B.p, 2) + " + " + num(B.p / 2, 2) + ") = " + num(t.total, 1) + " s; " +
      num(T) + "/" + num(t.total, 1) + " = " + num(real, 2) + ". Acelerar B al doble no deja el " +
      "programa al doble: el 30 % que no se tocó sigue costando lo mismo.";
    return (bien ? "Sí: " + num(real, 2) + " veces. "
                 : "No: son " + num(real, 2) + " veces, no " + num(dicho, 2) + ". ") + texto;
  }

  var diez = acelerarCada(FUNCIONES, T, 10);
  var RAZONES_CUAL = {
    correcta: "B. Pesa el 70 % del tiempo: el programa pasa de " + num(T) + " a " + num(T) +
      " × (0,30 + 0,70/10) = " + num(diez[1].tiempo, 1) + " s, " + num(diez[1].s, 2) +
      " veces más rápido. Las otras tres, con la misma mejora, no lo bajan de " +
      num(diez[2].tiempo, 1) + " s.",
    a: "A se ve la más complicada, pero pesa el 5 %. Diez veces más rápida deja el programa en " +
      num(T) + " × (0,95 + 0,05/10) = " + num(diez[0].tiempo, 1) + " s, " + num(diez[0].s, 2) +
      " veces; y aunque quedara infinitamente rápida el techo es 1/0,95 = " +
      num(diez[0].techo, 2) + ". La función que se optimiza es la que pesa en el perfil, no " +
      "la que se ve difícil en el código.",
    c: "C pesa el 20 %: " + num(T) + " × (0,80 + 0,20/10) = " + num(diez[2].tiempo, 1) + " s, " +
      num(diez[2].s, 2) + " veces más rápido. B pesa el 70 % y con la misma mejora baja el " +
      "programa a " + num(diez[1].tiempo, 1) + " s.",
    d: "D pesa el 5 %, igual que A: " + num(diez[3].tiempo, 1) + " s y " + num(diez[3].s, 2) +
      " veces, con un techo de " + num(diez[3].techo, 2) + " aunque desapareciera del todo. " +
      "Con el 5 % no hay optimización que se note en el total."
  };

  var RAZONES_CUANDO = {
    correcta: "Se deja como está. Corre una vez y tarda 4 minutos; una tarde son unas cuatro " +
      "horas, sesenta veces lo que dura la corrida. Cuando optimizar cuesta más que correr el " +
      "programa tal como está, la mejora no se recupera nunca.",
    perfilar: "Perfilar es el primer paso de una optimización que aquí no se va a hacer. " +
      "Correrlo bajo cProfile son otros cuatro minutos o más, y leer la salida también toma " +
      "tiempo; el dato que salga no cambia que el script se corra una sola vez.",
    numpy: "Reescribirlo con NumPy es la tarde entera, más probar que limpia el archivo igual. " +
      "Aunque quedara 10 veces más rápido, 4 minutos pasan a menos de uno: se ahorran tres " +
      "minutos, una sola vez, a cambio de horas.",
    paralelo: "Repartirlo también es trabajo de una tarde y tiene la ley de Amdahl encima: leer " +
      "y escribir el archivo no se reparte, y si eso es la mitad del tiempo el techo es 2×. " +
      "Ahorrar dos minutos una sola vez no paga una tarde."
  };

  document.querySelectorAll("#rango-p, #rango-k").forEach(function (el) {
    el.addEventListener("input", pintarPerillas);
  });
  document.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.getElementById("rango-p").value = b.dataset.p;
      pintarPerillas();
    });
  });
  conectarVeces(
    { entrada: "prediccion", boton: "btn-comprobar", veredicto: "veredicto" },
    function () { return speedup(B.p, 2); },
    explicar);
  Motor.conectarOpciones("opciones-cual", "veredicto-cual", RAZONES_CUAL);
  document.querySelectorAll("#opciones-cual button").forEach(function (b) {
    b.addEventListener("click", function () { elegida = b.dataset.op; pintarDiez(); });
  });
  Motor.conectarOpciones("opciones-cuando", "veredicto-cuando", RAZONES_CUANDO);

  pintarPerfil();
  pintarPerillas();
  pintarDiez();
})();
