/* Los muros que frenaron la frecuencia de reloj.

   Potencia: la dinamica de un circuito CMOS crece con la capacitancia, el
   cuadrado del voltaje y la frecuencia. Subir la frecuencia obliga a subir el
   voltaje mas o menos en la misma proporcion, asi que el consumo termina
   creciendo con el cubo de la frecuencia.

   Memoria: entre 1980 y 2005 la velocidad del procesador crecio cerca de 52 %
   al año y la de la DRAM cerca de 7 %. La distancia entre las dos es la que se
   acumula.                                                                 */

var BASE_GHZ = 3;
var BASE_VATIOS = 80;
var PRESUPUESTO = 130;

var CPU_ANUAL = 1.52;
var DRAM_ANUAL = 1.07;
var AÑO_CERO = 1980;

function vatios(ghz) {
  return BASE_VATIOS * Math.pow(ghz / BASE_GHZ, 3);
}

function frecuenciaDelPresupuesto(presupuesto) {
  return BASE_GHZ * Math.pow(presupuesto / BASE_VATIOS, 1 / 3);
}

function brecha(año) {
  return Math.pow(CPU_ANUAL / DRAM_ANUAL, año - AÑO_CERO);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    vatios: vatios, frecuenciaDelPresupuesto: frecuenciaDelPresupuesto,
    brecha: brecha, BASE_GHZ: BASE_GHZ, BASE_VATIOS: BASE_VATIOS,
    PRESUPUESTO: PRESUPUESTO
  };
}

if (typeof document !== "undefined") (function () {
  var ghz = 3;
  var año = 1995;

  function num(x, d) {
    return x.toFixed(d).replace(".", ",");
  }

  function miles(x) {
    return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function pintarPotencia() {
    var w = vatios(ghz);
    var tope = 700;
    var ancho = Math.min(w / tope * 100, 100);
    var color = w > PRESUPUESTO ? "var(--rojo)" : "var(--verde)";
    document.getElementById("ver-ghz").textContent = num(ghz, 1);
    document.getElementById("panel-potencia").innerHTML =
      "<div class=\"barra-fila\"><span class=\"rotulo\">" + num(ghz, 1) +
      " GHz</span><span class=\"pista-barra\" style=\"display:flex\">" +
      "<span class=\"barra\" style=\"width:" + ancho + "%;background:" + color +
      "\"></span></span><span class=\"valor\">" + miles(w) + " W</span></div>" +
      "<div class=\"barra-fila\"><span class=\"rotulo\">lo que se puede " +
      "disipar</span><span class=\"pista-barra\" style=\"display:flex\">" +
      "<span class=\"barra\" style=\"width:" + (PRESUPUESTO / tope * 100) +
      "%;background:var(--gris)\"></span></span><span class=\"valor\">" +
      PRESUPUESTO + " W</span></div>";

    var caja = document.getElementById("aviso-potencia");
    if (w > PRESUPUESTO) {
      caja.className = "alerta";
      caja.innerHTML = "A " + num(ghz, 1) + " GHz el chip pide <b>" + miles(w) +
        " W</b> y solo se pueden sacar " + PRESUPUESTO + ". El silicio se " +
        "derrite antes de terminar el cálculo.";
    } else {
      caja.className = "nota";
      caja.innerHTML = "Cabe en el presupuesto térmico. El límite está en " +
        num(frecuenciaDelPresupuesto(PRESUPUESTO), 2) + " GHz.";
    }
  }

  function pintarMemoria() {
    var b = brecha(año);
    document.getElementById("ver-año").textContent = año;
    var filas = [1980, 1990, 2000, 2005].map(function (a) {
      return "<tr" + (a === año ? " style=\"background:var(--resalte)\"" : "") +
        "><td>" + a + "</td><td>" + miles(Math.pow(CPU_ANUAL, a - AÑO_CERO)) +
        "×</td><td>" + miles(Math.pow(DRAM_ANUAL, a - AÑO_CERO)) + "×</td><td>" +
        miles(brecha(a)) + "×</td></tr>";
    }).join("");
    document.getElementById("cuerpo-memoria").innerHTML = filas;
    document.getElementById("chips-memoria").innerHTML =
      "<span class=\"chip\">en " + año + " el procesador va <b>" +
      miles(Math.pow(CPU_ANUAL, año - AÑO_CERO)) + "×</b> más rápido que en 1980</span>" +
      "<span class=\"chip\">la memoria, <b>" +
      miles(Math.pow(DRAM_ANUAL, año - AÑO_CERO)) + "×</b></span>" +
      "<span class=\"chip cuenta\">la distancia entre las dos: <b>" +
      miles(b) + "×</b></span>";
  }

  function comprobar() {
    var caja = document.getElementById("veredicto");
    var dicho = parseFloat(document.getElementById("prediccion").value
                            .replace(",", "."));
    var real = frecuenciaDelPresupuesto(PRESUPUESTO);
    if (isNaN(dicho)) {
      caja.className = "veredicto mal";
      caja.textContent = "Escriba un número antes de comprobar.";
      return;
    }
    var bien = Math.abs(dicho - real) < 0.15;
    caja.className = "veredicto " + (bien ? "bien" : "mal");
    caja.textContent = bien
      ? "Sí: el presupuesto se agota cerca de " + num(real, 2) + " GHz."
      : "Se agota en " + num(real, 2) + " GHz. Desde los " + BASE_GHZ +
        " GHz y " + BASE_VATIOS + " W, duplicar la frecuencia multiplica el " +
        "consumo por ocho, no por dos.";
  }

  var RAZONES = {
    correcta: "Eso es. Subir la frecuencia dejó de ser viable por el consumo, " +
      "y sacarle más instrucciones por ciclo a un solo hilo también se " +
      "estancó. Lo que quedó disponible fue poner más núcleos, y eso ya no " +
      "acelera el programa solo: hay que escribirlo repartido.",
    litografia: "Los transistores sí siguieron encogiendo un buen tiempo, y " +
      "por eso caben más núcleos. Lo que se detuvo fue la frecuencia, por el " +
      "consumo, y el paralelismo que se le puede sacar a un hilo.",
    memoria: "La distancia con la memoria es real y por eso existen las " +
      "cachés, pero más núcleos no la arreglan: la agravan, porque ahora " +
      "varios compiten por el mismo bus.",
    demanda: "La demanda de cómputo creció, sí, pero eso explica por qué se " +
      "quería ir más rápido, no por qué se dejó de subir la frecuencia para " +
      "conseguirlo."
  };

  document.getElementById("rango-ghz").addEventListener("input", function (e) {
    ghz = parseInt(e.target.value, 10) / 10;
    pintarPotencia();
  });
  document.querySelectorAll("[data-ghz]").forEach(function (b) {
    b.addEventListener("click", function () {
      ghz = parseFloat(b.dataset.ghz);
      document.getElementById("rango-ghz").value = Math.round(ghz * 10);
      pintarPotencia();
    });
  });
  document.getElementById("rango-año").addEventListener("input", function (e) {
    año = parseInt(e.target.value, 10);
    pintarMemoria();
  });
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);

  var caja = document.getElementById("veredicto-final");
  document.querySelectorAll("#opciones-final button").forEach(function (b) {
    b.addEventListener("click", function () {
      var op = b.dataset.op;
      caja.className = "veredicto " + (op === "correcta" ? "bien" : "mal");
      caja.textContent = RAZONES[op];
    });
  });

  pintarPotencia();
  pintarMemoria();
})();
