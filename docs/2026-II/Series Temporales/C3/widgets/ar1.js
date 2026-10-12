/* El φ de un AR(1). Una serie simulada con semilla fija, su ACF y su PACF;
   el deslizador cambia φ y el ruido queda igual. Calca la tercera
   interactiva del notebook de la sesión 3. */
(function () {
  "use strict";

  function fmt(v, d) { return v.toFixed(d === undefined ? 2 : d).replace(".", ",").replace("-", "−"); }

  var N = 110, SEMILLA = 2026, NLAGS = 20, BANDA = Series.banda(N);

  function analizar(phi) {
    var y = Series.ar1(phi, N, SEMILLA);
    var r = Series.acf(y, NLAGS), p = Series.pacf(y, NLAGS);
    function fuera(v) {
      var f = [];
      for (var k = 1; k <= NLAGS; k++) { if (Math.abs(v[k]) > BANDA) { f.push(k); } }
      return f;
    }
    return { phi: phi, y: y, acf: r, pacf: p, fueraAcf: fuera(r), fueraPacf: fuera(p) };
  }

  function lista(f) {
    if (!f.length) { return "ninguno"; }
    var seguidos = f.every(function (k, i) { return k === f[0] + i; });
    return seguidos && f.length > 2 ? f[0] + " a " + f[f.length - 1] : f.join(", ");
  }

  function primeros(v, h) {
    return v.slice(1, h + 1).map(function (x) { return fmt(x); }).join("; ");
  }

  var a08 = analizar(0.8), an07 = analizar(-0.7), a05 = analizar(0.5), a099 = analizar(0.99);

  var formaPacf = a08.fueraPacf.length === 1 && a08.fueraPacf[0] === 1 ? 0 : a08.fueraPacf.length > 1 ? 1 : 2;

  var ANTES = {
    id: "antes",
    titulo: "1. Antes de mover φ",
    definicion: null,
    explicacion: "Piense en φ = 0,8: cada valor guarda el 80 % del anterior más un ruido nuevo.",
    items: [
      { valor: "¿Cómo baja la ACF?",
        opciones: ["Se corta después de k = 1", "Baja despacio, rezago a rezago", "Alterna de signo"], correcta: 1,
        razon: "De k = 1 a 4 vale " + primeros(a08.acf, 4) + ", y sale de la banda en los rezagos " + lista(a08.fueraAcf) + ". El valor de hoy carga con el de ayer, que cargaba con el de antier: la memoria se va gastando de a poco." },
      { valor: "¿Y la PACF?",
        opciones: ["Una sola barra fuera, en k = 1", "Muchas barras fuera", "Ninguna barra fuera"], correcta: formaPacf,
        razon: "Sale de la banda en " + lista(a08.fueraPacf) + ". Con el rezago 1 conocido, el 2 no agrega nada: el modelo solo mira un paso atrás." }
    ],
    cierre: "ACF que decae y PACF que se corta: así se ve un AR(1) con φ positivo."
  };

  var alterna = an07.acf[1] < 0 && an07.acf[2] > 0 && an07.acf[3] < 0;

  var DESPUES = {
    id: "despues",
    titulo: "3. Con el deslizador",
    definicion: null,
    explicacion: "Responda moviendo φ o con los botones.",
    items: [
      { valor: "Con φ = −0,7, ¿qué hace la ACF?",
        opciones: ["Alterna de signo", "Todas las barras son negativas", "Lo mismo que con 0,7"], correcta: alterna ? 0 : 1,
        razon: "De k = 1 a 4 vale " + primeros(an07.acf, 4) + ". Un valor por encima de cero anuncia uno por debajo, y ese, otro por encima: el signo de φ^k cambia con cada k." },
      { valor: "En teoría, ¿cuánto vale la ACF de un AR(1) en k = 1?",
        opciones: ["φ", "φ²", "1 − φ"], correcta: 0,
        razon: "Vale φ, y en el rezago k vale φ^k. Con 110 datos la estimada se aparta un poco: con φ = 0,5 esta serie da " + fmt(a05.acf[1]) + " y con φ = 0,8 da " + fmt(a08.acf[1]) + "." },
      { valor: "Con φ = 0,99, ¿cómo se ve la serie?",
        opciones: ["Vuelve a cero enseguida", "Se aleja de cero y tarda en volver", "Salta de un lado al otro del cero"], correcta: 1,
        razon: "Con φ casi 1 el modelo está al borde de la raíz unitaria: la ACF en k = 1 da " + fmt(a099.acf[1]) + " y sale de la banda en los rezagos " + lista(a099.fueraAcf) + ", como la serie del curso sin diferenciar." }
    ],
    cierre: "φ fija cuánto dura la memoria y su signo dice si los valores se siguen o se alternan."
  };

  /* --- Interfaz ----------------------------------------------------- */
  if (typeof document === "undefined") {
    module.exports = { analizar: analizar, ANTES: ANTES, DESPUES: DESPUES };
    return;
  }

  var deslizador = document.getElementById("phi");

  function dibujar() {
    var phi = Number(deslizador.value);
    var a = analizar(phi);
    document.getElementById("phi-valor").textContent = fmt(phi);
    document.getElementById("lectura").innerHTML =
      "ACF en k = 1: <b>" + fmt(a.acf[1]) + "</b> (en teoría, " + fmt(phi) + "). PACF en k = 1: <b>" + fmt(a.pacf[1]) +
      "</b>; en k = 2: <b>" + fmt(a.pacf[2]) + "</b>. Fuera de la banda ±" + fmt(BANDA, 3) +
      ": ACF en " + lista(a.fueraAcf) + "; PACF en " + lista(a.fueraPacf) + ".";
    document.getElementById("figura-serie").innerHTML = Grafica.lineas({
      titulo: "AR(1) con φ = " + fmt(phi), cero: true, alto: 200, etiquetaX: "t",
      lineas: [{ valores: a.y }]
    });
    var marcas = [0, 5, 10, 15, 20];
    document.getElementById("figura-acf").innerHTML = Grafica.correlograma(a.acf, N,
      { titulo: "ACF", ancho: 380, alto: 220, marcasX: marcas });
    document.getElementById("figura-pacf").innerHTML = Grafica.correlograma(a.pacf, N,
      { titulo: "PACF", ancho: 380, alto: 220, desde: 1, marcasX: [1, 5, 10, 15, 20] });
  }

  deslizador.addEventListener("input", dibujar);
  document.querySelectorAll("#presets button").forEach(function (b) {
    b.addEventListener("click", function () {
      deslizador.value = b.getAttribute("data-phi");
      dibujar();
    });
  });
  dibujar();

  document.getElementById("cierre-tabla").innerHTML =
    "<table><thead><tr><th>φ</th><th>ACF k = 1</th><th>ACF k = 2</th><th>PACF k = 1</th><th>PACF k = 2</th><th>PACF fuera de la banda</th></tr></thead><tbody>" +
    [an07, a05, a08, a099].map(function (a) {
      return "<tr><td>" + fmt(a.phi) + "</td><td>" + fmt(a.acf[1]) + "</td><td>" + fmt(a.acf[2]) + "</td><td>" +
        fmt(a.pacf[1]) + "</td><td>" + fmt(a.pacf[2]) + "</td><td>" + lista(a.fueraPacf) + "</td></tr>";
    }).join("") + "</tbody></table>";

  var pendientes = 2;
  function terminado() {
    pendientes--;
    if (pendientes === 0) { document.getElementById("carta-cierre").style.display = "block"; }
  }
  MotorDecisiones.montar({ bloques: [ANTES], destino: "antes", alTerminar: terminado });
  MotorDecisiones.montar({ bloques: [DESPUES], destino: "despues", alTerminar: terminado });
})();
