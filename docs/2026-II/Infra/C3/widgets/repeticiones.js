if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* timeit como en la clase de profiling: fib(30) repetido number veces y un
   solo numero de vuelta, el total. Las mediciones ruidosas salen de un LCG
   con semilla fija, sin azar del navegador.                                      */

var FIB = { total: 15.8, number: 100 };                    // segundos, vueltas
var SETUP = { generar: 5, operacion: 0.2, number: 1000 };  // ms, ms, vueltas
var BASE = 158;          // ms por llamada a fib(30)
var SEMILLA = 5;
var REPETICIONES = 20;

/* timeit devuelve la suma; el promedio se saca dividiendo entre number. */
function promedio(total, number) {
  return total / number;
}

/* Con generar_datos dentro de stmt, cada vuelta paga las dos cosas. */
function totalConSetupDentro(setupMs, stmtMs, number) {
  return number * (setupMs + stmtMs);
}

/* Con setup, la preparacion corre una vez y fuera del cronometro. */
function totalConSetupFuera(setupMs, stmtMs, number) {
  return number * stmtMs;
}

/* n mediciones de base ms con ruido entre -15 % y +35 %. Por debajo casi
   no baja; por encima sube con cola larga: el sistema estorba hacia arriba. */
function medicionesRuidosas(base, n, semilla) {
  var s = semilla >>> 0, lista = [];
  for (var i = 0; i < n; i++) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;   // LCG de 32 bits, exacto
    var t = s / 4294967296 * 2 - 1;                 // en [-1, 1)
    var ruido = t < 0 ? -0.15 * Math.pow(-t, 5) : 0.35 * t * t;
    lista.push(base * (1 + ruido));
  }
  return lista;
}

function suma(lista) {
  return lista.reduce(function (a, b) { return a + b; }, 0);
}

function media(lista) {
  return suma(lista) / lista.length;
}

function mediana(lista) {
  var o = lista.slice().sort(function (a, b) { return a - b; });
  var m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
}

/* Las cuentas que muestra la carta 3 sobre lo medido. */
function resumen(lista) {
  return {
    n: lista.length,
    total: suma(lista),
    media: media(lista),
    mediana: mediana(lista),
    minimo: Math.min.apply(null, lista),
    maximo: Math.max.apply(null, lista)
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FIB: FIB, SETUP: SETUP, BASE: BASE, SEMILLA: SEMILLA, REPETICIONES: REPETICIONES,
    promedio: promedio, totalConSetupDentro: totalConSetupDentro,
    totalConSetupFuera: totalConSetupFuera, medicionesRuidosas: medicionesRuidosas,
    suma: suma, media: media, mediana: mediana, resumen: resumen
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var destapadaA = false, destapadaB = false;   // las tablas salen al comprobar
  var mediciones = [];   // lo medido en la carta 3
  var usadas = 0;        // cuantos valores del LCG se han gastado
  var modo = "";         // "time" o "timeit", segun el ultimo boton

  /* Un input type=number entrega el valor con punto decimal sin importar el
     teclado; se acepta tambien la coma y no se toca nada mas.               */
  function leerDecimal(id) {
    return parseFloat(String(document.getElementById(id).value).replace(",", "."));
  }

  /* Lee un parametro de la carta 2; si no es un numero util, el de la clase. */
  function leerParam(id, defecto) {
    var v = leerDecimal(id);
    return isNaN(v) || v <= 0 ? defecto : v;
  }

  /* Igual que la prediccion del motor, salvo que el numero se lee con
     leerDecimal: la respuesta de la carta 2 lleva un decimal y tiene que
     llegar entera.                                                          */
  function conectarPrediccion(ids, esperado, explicar) {
    var caja = document.getElementById(ids.veredicto);
    document.getElementById(ids.boton).addEventListener("click", function () {
      var dicho = leerDecimal(ids.entrada);
      var real = esperado();
      var v = Motor.veredictoNumerico(dicho, real);
      caja.className = "veredicto " + (v.bien ? "bien" : "mal");
      caja.textContent = isNaN(dicho) ? v.motivo : explicar(v.bien, real, dicho);
    });
  }

  function params() {
    return {
      generar: leerParam("costo-generar", SETUP.generar),
      operacion: leerParam("costo-operacion", SETUP.operacion),
      number: Math.round(leerParam("number-b", SETUP.number))
    };
  }

  function pintarTablaTotal() {
    var porLlamada = promedio(FIB.total, FIB.number);
    document.getElementById("cuerpo-total").innerHTML =
      "<tr><td>" + num(FIB.number) + "</td><td>" + num(FIB.total, 1) + " s</td>" +
      (destapadaA
        ? "<td>" + num(porLlamada, 3) + " s = " + num(porLlamada * 1000) + " ms</td>"
        : "<td class=\"pend\">?</td>") + "</tr>";
  }

  function pintarTablaSetup() {
    var p = params();
    var dentro = totalConSetupDentro(p.generar, p.operacion, p.number);
    var fuera = totalConSetupFuera(p.generar, p.operacion, p.number);
    var pend = "<td class=\"pend\">?</td>";
    var filaDentro = "<tr><td>dentro de stmt</td>" + (destapadaB
      ? "<td>" + num(p.generar, 1) + " + " + num(p.operacion, 1) + " ms</td><td>" +
        num(dentro, 1) + "</td><td>" + num(promedio(dentro, p.number), 1) + "</td>"
      : pend + pend + pend) + "</tr>";
    var filaFuera = "<tr><td>en setup</td>" + (destapadaB
      ? "<td>" + num(p.operacion, 1) + " ms</td><td>" + num(fuera, 1) + "</td><td>" +
        num(promedio(fuera, p.number), 1) + "</td>"
      : pend + pend + pend) + "</tr>";
    document.getElementById("cuerpo-setup").innerHTML = filaDentro + filaFuera;
    Motor.pintarChips("chips-setup", !destapadaB ? [] : [
      { texto: "generar_datos corre", valor: num(p.number) + " veces contra 1" },
      { texto: "la medición se infla", valor: num(dentro / fuera, 1) + " veces", cuenta: true }
    ]);
  }

  /* Escala fija de la grafica: desde 0,8 x base hasta 1,4 x base, para que
     el ruido se vea y las corridas se comparen entre clics.               */
  var PISO = BASE * 0.8, TOPE = BASE * 1.4, ALTO = 124;

  function altura(valor) {
    return (Math.max(0, valor - PISO) / (TOPE - PISO) * ALTO).toFixed(1);
  }

  /* Una linea horizontal punteada a la altura de valor; el rotulo va en el
     margen lateral que se le indique, fuera de las barras.               */
  function lineaH(valor, texto, color, lado) {
    return "<div class=\"linea-h\" style=\"bottom:" + altura(valor) + "px;border-color:" +
      color + "\"><span style=\"position:absolute;" + lado + ":0;bottom:2px;color:" + color +
      ";font-weight:600\">" + texto + "</span></div>";
  }

  function pintarMediciones() {
    var caja = document.getElementById("grafica");
    var progreso = document.getElementById("progreso");
    if (!mediciones.length) {
      caja.innerHTML = "";
      progreso.textContent = "Sin mediciones. Cada clic en Medir una vez es una corrida " +
        "con la carga que tenga el sistema en ese instante.";
      Motor.pintarChips("chips-sueltas", []);
      Motor.pintarChips("chips-medidas", []);
      return;
    }
    /* Con time cada corrida imprime su numero; timeit solo entrega la suma. */
    Motor.pintarChips("chips-sueltas", modo === "timeit" ? [] : mediciones.map(function (v, i) {
      return { texto: "corrida " + (i + 1), valor: num(v, 1) + " ms" };
    }));
    var r = resumen(mediciones);
    var barras = mediciones.map(function (v, i) {
      return "<span class=\"barra-v\" title=\"medición " + (i + 1) + ": " + num(v, 1) +
        " ms\" style=\"height:" + altura(v) + "px\"></span>";
    }).join("");
    caja.innerHTML = "<div class=\"barras-v\">" + barras +
      "<span style=\"position:absolute;top:0;right:0;font-size:0.72rem;color:var(--gris)\">eje: " +
      num(PISO, 1) + " a " + num(TOPE, 1) + " ms</span>" +
      lineaH(r.media, "media " + num(r.media, 1) + " ms", "var(--ambar)", "right") +
      lineaH(r.minimo, "mínimo " + num(r.minimo, 1) + " ms", "var(--verde)", "left") +
      "</div>";

    if (modo === "timeit") {
      progreso.textContent = "timeit sumó las " + num(r.n) + " repeticiones y devolvió " +
        num(r.total, 1) + " ms; entre " + num(r.n) + " da " + num(r.media, 1) +
        " ms por vuelta. Las barras son las corridas que timeit no muestra.";
    } else if (r.n === 1) {
      progreso.textContent = "Una medición suelta con time: " + num(r.minimo, 1) +
        " ms. Vuelva a medir y compare.";
    } else {
      progreso.textContent = num(r.n) + " mediciones sueltas con time, una corrida por clic: de " +
        num(r.minimo, 1) + " a " + num(r.maximo, 1) + " ms.";
    }

    var chips = [
      { texto: "mínimo", valor: num(r.minimo, 1) + " ms" },
      { texto: "mediana", valor: num(r.mediana, 1) + " ms" },
      { texto: "media", valor: num(r.media, 1) + " ms", cuenta: true },
      { texto: "máximo", valor: num(r.maximo, 1) + " ms" }
    ];
    if (modo === "timeit") {
      chips.unshift({ texto: "timeit devuelve", valor: num(r.total, 1) + " ms", cuenta: true });
    }
    Motor.pintarChips("chips-medidas", chips);
  }

  /* Los siguientes k valores del LCG, sin repetir los ya mostrados. */
  function siguientes(k) {
    var todas = medicionesRuidosas(BASE, usadas + k, SEMILLA);
    usadas += k;
    return todas.slice(usadas - k);
  }

  function explicarA(bien, real, dicho) {
    destapadaA = true;
    pintarTablaTotal();
    var porLlamada = promedio(FIB.total, FIB.number);
    return (bien ? "Sí: " + num(real) + " ms por llamada. "
                 : "No: son " + num(real) + " ms, no " + num(dicho) + ". ") +
      "El número que imprime timeit es la suma de las " + num(FIB.number) + " repeticiones, " +
      num(FIB.total, 1) + " s. El promedio sale al dividir entre number: " + num(FIB.total, 1) +
      " / " + num(FIB.number) + " = " + num(porLlamada, 3) + " s = " + num(real) +
      " ms; el programa de clase lo imprime redondeado como Promedio: 0,16 s. Desde la línea " +
      "de comandos, con -r 100, el reporte dice 158 msec per loop.";
  }

  function explicarB(bien, real, dicho) {
    destapadaB = true;
    pintarTablaSetup();
    var p = params();
    var dentro = totalConSetupDentro(p.generar, p.operacion, p.number);
    var fuera = totalConSetupFuera(p.generar, p.operacion, p.number);
    return (bien ? "Sí: " + num(real, 1) + " ms. "
                 : "No: son " + num(real, 1) + " ms, no " + num(dicho, 1) + ". ") +
      "Dentro de stmt, cada una de las " + num(p.number) + " vueltas paga " + num(p.generar, 1) +
      " + " + num(p.operacion, 1) + " = " + num(p.generar + p.operacion, 1) + " ms: total " +
      num(dentro, 1) + " ms y promedio " + num(real, 1) + " ms. Con setup, generar_datos corre " +
      "una sola vez antes de arrancar el cronómetro y cada vuelta paga solo los " +
      num(p.operacion, 1) + " ms de operacion: total " + num(fuera, 1) + " ms y promedio " +
      num(promedio(fuera, p.number), 1) + " ms. La medición sale inflada " +
      num(dentro / fuera, 1) + " veces y lo que se quería medir casi no se ve.";
  }

  var RAZONES = {
    correcta: "Eso es. Repetir el fragmento muchas veces y apagar el recolector de basura " +
      "es lo que hace que mida bien un fragmento aislado, y es lo que estorba a un " +
      "programa que está atendiendo usuarios: las repeticiones le quitan CPU y el " +
      "recolector apagado deja crecer la memoria. Ahí va perf_counter alrededor de la " +
      "operación real, con varias corridas y su desviación estándar.",
    estandar: "Está en la biblioteca estándar: from timeit import timeit, sin instalar " +
      "nada. También corre como python3 -m timeit desde la línea de comandos.",
    cpu: "Mide reloj de pared con el temporizador de mayor resolución que tenga el " +
      "sistema, perf_counter por defecto, no tiempo de CPU. Si el fragmento espera un " +
      "disco o la red, esa espera entra en la cuenta.",
    setup: "Sí lo acepta: el argumento setup en la API y la bandera -s en la línea de " +
      "comandos. La carta anterior muestra la diferencia entre ponerlo dentro y fuera."
  };

  ["costo-generar", "costo-operacion", "number-b"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      pintarTablaSetup();
      document.getElementById("veredicto-b").className = "veredicto";
    });
  });
  document.getElementById("btn-una").addEventListener("click", function () {
    if (modo === "timeit") { mediciones = []; }
    mediciones.push(siguientes(1)[0]);
    modo = "time";
    pintarMediciones();
  });
  document.getElementById("btn-veinte").addEventListener("click", function () {
    mediciones = siguientes(REPETICIONES);
    modo = "timeit";
    pintarMediciones();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    mediciones = []; usadas = 0; modo = "";
    pintarMediciones();
  });
  conectarPrediccion(
    { entrada: "prediccion-a", boton: "btn-comprobar-a", veredicto: "veredicto-a" },
    function () { return Math.round(promedio(FIB.total, FIB.number) * 1000); },
    explicarA);
  conectarPrediccion(
    { entrada: "prediccion-b", boton: "btn-comprobar-b", veredicto: "veredicto-b" },
    function () {
      var p = params();
      return promedio(totalConSetupDentro(p.generar, p.operacion, p.number), p.number);
    },
    explicarB);
  Motor.conectarOpciones("opciones-produccion", "veredicto-produccion", RAZONES);

  pintarTablaTotal();
  pintarTablaSetup();
  pintarMediciones();
})();
