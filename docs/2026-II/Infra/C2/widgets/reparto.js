if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* El reparto en k trozos de con_hilos: paso = n / k entero, el hilo i
   recibe [i*paso, (i+1)*paso) y el ultimo se lleva ademas el residuo.     */

var COLORES = ["var(--azul)", "var(--ambar)", "var(--verde)", "var(--rojo)",
               "#7b4ea3", "#0f8b8d", "#c2185b", "#5d4037"];

/* La tabla del deck: 200 millones de enteros. */
var MEDIDO = [
  { hilos: 1, ms: 98 },
  { hilos: 2, ms: 51 },
  { hilos: 4, ms: 38 },
  { hilos: 8, ms: 38 }
];

function cortes(n, k) {
  var paso = Math.floor(n / k);
  var lista = [];
  for (var i = 0; i < k; i++) {
    var ini = i * paso;
    var fin = (i === k - 1) ? n : ini + paso;
    lista.push([ini, fin]);
  }
  return lista;
}

function tamanos(n, k) {
  return cortes(n, k).map(function (c) { return c[1] - c[0]; });
}

/* Cuantas veces el ideal n/k hace el hilo que mas recibe. */
function peor(n, k) {
  var t = tamanos(n, k);
  return Math.max.apply(null, t) / (n / k);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { COLORES: COLORES, MEDIDO: MEDIDO, cortes: cortes,
                     tamanos: tamanos, peor: peor };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var n = 10;
  var k = 4;

  function pintarBarra() {
    var lista = cortes(n, k);
    var html = "";
    if (n <= 40) {
      html = "<div class=\"arreglo fila-arreglo\">";
      lista.forEach(function (c, i) {
        for (var j = c[0]; j < c[1]; j++) {
          html += "<span class=\"caja\" style=\"border-color:" + COLORES[i] +
            ";color:" + COLORES[i] + "\"><span class=\"indice\">" + j +
            "</span>h" + i + "</span>";
        }
      });
      html += "</div>";
    } else {
      html = "<div class=\"barra-fila\"><span class=\"rotulo\">v[0 .. " + num(n) +
        ")</span><span class=\"pista-barra\" style=\"display:flex\">";
      lista.forEach(function (c, i) {
        html += "<span class=\"barra\" title=\"hilo " + i + ": [" + num(c[0]) + ", " +
          num(c[1]) + ")\" style=\"flex:none;width:" + ((c[1] - c[0]) / n * 100) +
          "%;background:" + COLORES[i] + ";color:#fff;text-align:center;" +
          "font-size:0.75rem;line-height:22px\">h" + i + "</span>";
      });
      html += "</span><span class=\"valor\"></span></div>";
    }
    document.getElementById("panel-barra").innerHTML = html;
  }

  function pintarTabla() {
    var filas = cortes(n, k).map(function (c, i) {
      return "<tr><td style=\"color:" + COLORES[i] + ";font-weight:700\">hilo " + i +
        "</td><td>" + num(c[0]) + "</td><td>" + num(c[1]) + "</td><td>" +
        num(c[1] - c[0]) + "</td></tr>";
    }).join("");
    document.getElementById("cuerpo-reparto").innerHTML = filas;
  }

  function pintarChips() {
    var t = tamanos(n, k);
    Motor.pintarChips("chips-reparto", [
      { texto: "paso = " + num(n) + " / " + k + " =", valor: num(Math.floor(n / k)) },
      { texto: "ideal n/k", valor: num(n / k, 2) },
      { texto: "el trozo mayor", valor: num(Math.max.apply(null, t)) },
      { texto: "el hilo más cargado hace", valor: num(peor(n, k), 2) + " veces el ideal",
        cuenta: true }
    ]);
  }

  function pintarMedido() {
    var base = MEDIDO[0].ms;
    document.getElementById("cuerpo-medido").innerHTML = MEDIDO.map(function (m) {
      return "<tr><td>" + m.hilos + "</td><td>" + num(m.ms) + " ms</td><td>" +
        num(base / m.ms, 1) + "</td></tr>";
    }).join("");
  }

  function pintar() {
    document.getElementById("ver-n").textContent = num(n);
    document.getElementById("ver-k").textContent = k;
    document.getElementById("pregunta-n").textContent = num(n);
    document.getElementById("pregunta-k").textContent = k;
    document.getElementById("veredicto").className = "veredicto";
    pintarBarra();
    pintarTabla();
    pintarChips();
  }

  function explicar(bien, real, dicho) {
    var t = tamanos(n, k);
    var residuo = n - Math.floor(n / k) * k;
    var cuenta = "paso = " + num(n) + " / " + k + " = " + num(Math.floor(n / k)) +
      " entero; los trozos quedan de " + t.join(", ") + ". " +
      (residuo ? "El residuo, " + residuo + (residuo === 1 ? " elemento" : " elementos") +
        ", se lo lleva el último hilo, y por eso termina de último."
       : "La división es exacta y ningún hilo carga de más.");
    if (bien) { return "Sí: " + num(real) + ". " + cuenta; }
    return "El último hilo recibe " + num(real) + ", no " + num(dicho) + ". " + cuenta;
  }

  var RAZONES = {
    correcta: "Sumar un entero cuesta un ciclo; traerlo de memoria, cientos. " +
      "Desde cuatro hilos el camino a la memoria ya está saturado y los " +
      "núcleos que se agregan esperan el dato igual que los anteriores: " +
      "38 ms con cuatro y 38 con ocho.",
    residuo: "Con 200 millones y ocho hilos el residuo es cero: cada hilo " +
      "recibe exactamente 25 millones. El reparto está parejo y el tiempo " +
      "no se mueve por otra razón.",
    falso: "Cada hilo acumula en una variable local y escribe parciales[i] " +
      "una sola vez al final. Una escritura por hilo no alcanza para que " +
      "la línea compartida cuente; el false sharing aparece cuando se " +
      "escribe millones de veces.",
    nucleos: "La máquina de la medición tiene seis núcleos. De cuatro a " +
      "ocho hilos sobran núcleos para dos hilos más y el tiempo no se " +
      "mueve: lo que falta no son núcleos."
  };

  document.querySelectorAll("[data-n]").forEach(function (b) {
    b.addEventListener("click", function () { n = parseInt(b.dataset.n, 10); pintar(); });
  });
  document.querySelectorAll("[data-k]").forEach(function (b) {
    b.addEventListener("click", function () { k = parseInt(b.dataset.k, 10); pintar(); });
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion", boton: "btn-comprobar", veredicto: "veredicto" },
    function () { var t = tamanos(n, k); return t[t.length - 1]; },
    explicar);
  Motor.conectarOpciones("opciones-memoria", "veredicto-memoria", RAZONES);

  pintarMedido();
  pintar();
})();
