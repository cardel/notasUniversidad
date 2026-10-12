/* ¿Cuánto mide la banda? La media banda 1,96/√n con la serie del curso y
   sus diferencias, un ruido blanco simulado con n y semilla elegibles, y la
   banda plana contra la de Bartlett que dibuja statsmodels. */
(function () {
  "use strict";

  function fmt(v, d) { return v.toFixed(d === undefined ? 3 : d).replace(".", ",").replace("-", "−"); }

  var NLAGS = 36;
  var n0 = SERIE.valores.length;
  var b0 = Series.banda(n0);
  var x11 = Series.diferenciar(SERIE.valores, 1, 1, 12);
  var n11 = x11.length, b11 = Series.banda(n11);
  var r11 = Series.acf(x11, NLAGS);
  var bart11 = r11.map(function (_, k) { return k === 0 ? 0 : Series.bandaBartlett(r11, k, n11); });

  function fueraDe(r, banda) {
    var f = [];
    for (var k = 1; k < r.length; k++) { if (Math.abs(r[k]) > banda(k)) { f.push(k); } }
    return f;
  }
  var fueraPlana = fueraDe(r11, function () { return b11; });
  var fueraBart = fueraDe(r11, function (k) { return bart11[k]; });
  var soloPlana = fueraPlana.filter(function (k) { return fueraBart.indexOf(k) < 0; });

  function ruido(n, semilla) {
    var g = Series.generador(semilla), w = [];
    for (var i = 0; i < n; i++) { w.push(g.normal()); }
    var r = Series.acf(w, Math.min(NLAGS, n - 1));
    var b = Series.banda(n), mayor = 0;
    for (var k = 1; k < r.length; k++) { mayor = Math.max(mayor, Math.abs(r[k])); }
    return { n: n, w: w, acf: r, banda: b, mayor: mayor, fuera: fueraDe(r, function () { return b; }) };
  }

  /* Cuántas barras salen, en promedio, en veinte sorteos con n = 110. */
  var totalFuera = 0;
  for (var s = 1; s <= 20; s++) { totalFuera += ruido(110, s).fuera.length; }
  var promedioFuera = totalFuera / 20;

  var chico = ruido(30, 1), grande = ruido(400, 1);

  var ANTES = {
    id: "antes",
    titulo: "1. Antes de mover nada",
    definicion: null,
    explicacion: "La serie del curso tiene " + n0 + " meses.",
    items: [
      { valor: "Con los " + n0 + " meses, ¿cuánto mide la media banda, 1,96/√n?",
        opciones: [fmt(1.96 / n0), fmt(b0), "0,5"], correcta: 1,
        razon: "1,96/√" + n0 + " = " + fmt(b0) + ". La primera opción divide entre n y no entre su raíz; con ruido blanco, el error estándar de una correlación estimada con n datos es 1/√n." },
      { valor: "Con d = 1 y D = 1 quedan " + n11 + " datos. ¿Qué le pasa a la banda?",
        opciones: ["Se angosta", "Se ensancha un poco", "No cambia"], correcta: b11 > b0 ? 1 : b11 < b0 ? 0 : 2,
        razon: "Pasa de " + fmt(b0) + " a " + fmt(b11) + ". Menos datos, más incertidumbre en cada correlación: diferenciar se paga también en la banda, no solo en los meses perdidos." },
      { valor: "¿Cuántos datos harían falta para que la banda midiera la mitad que con " + n0 + "?",
        opciones: [String(2 * n0), String(4 * n0), String(n0 * n0)], correcta: 1,
        razon: "Hacen falta " + 4 * n0 + ": la banda va con 1/√n, así que dividirla entre 2 pide multiplicar n por 4. Con " + 4 * n0 + " datos mide " + fmt(Series.banda(4 * n0)) + "." }
    ],
    cierre: "La banda depende solo de n y se angosta con su raíz."
  };

  var DESPUES = {
    id: "despues",
    titulo: "4. Con los controles",
    definicion: null,
    explicacion: "Responda moviendo n, la semilla y el tipo de banda.",
    items: [
      { valor: "En el ruido blanco, al pasar de n = 30 a n = 400, las barras…",
        opciones: ["Se encogen junto con la banda", "Quedan del mismo tamaño", "Crecen"],
        correcta: grande.mayor < chico.mayor ? 0 : 1,
        razon: "Con la semilla 1, la barra más alta mide " + fmt(chico.mayor) + " con n = 30 y " + fmt(grande.mayor) + " con n = 400. La autocorrelación verdadera es cero; lo que se ve es error de estimación, y ese error baja con √n al mismo ritmo que la banda." },
      { valor: "Con n = 110 y una banda del 95 %, ¿cuántas de las 36 barras de un ruido blanco espera ver fuera?",
        opciones: ["Ninguna", "Una o dos", "Cerca de diez"], correcta: 1,
        razon: "El 5 % de 36 es 1,8, y en la práctica salen menos. En las veinte semillas del control, con n = 110, salen en promedio " + fmt(promedioFuera, 1) + " por sorteo: la ACF de un rezago alto se calcula con menos pares y el estimador la acerca a cero. Una barra fuera no prueba que haya estructura." },
      { valor: "Con la banda plana salen " + fueraPlana.join(", ") + "; con la de Bartlett, " + fueraBart.join(", ") + ". ¿Por qué " + soloPlana.join(" y ") + " quedan dentro de la segunda?",
        opciones: ["La banda de Bartlett crece con k", "statsmodels usa otros datos", "statsmodels usa el 99 %"], correcta: 0,
        razon: "La de Bartlett suma las correlaciones de los rezagos anteriores. En k = 12 la barra vale " + fmt(r11[12], 2) + ", y desde ahí la banda pasa de " + fmt(bart11[12]) + " a " + fmt(bart11[soloPlana[0]]) + " en k = " + soloPlana[0] + ". Los datos y el nivel del 95 % son los mismos." }
    ],
    cierre: "La banda dice cuánto mide el azar con estos datos; leerla bien es mirar qué rezagos salen y si tienen sentido."
  };

  /* --- Interfaz ----------------------------------------------------- */
  if (typeof document === "undefined") {
    module.exports = { ANTES: ANTES, DESPUES: DESPUES, fueraPlana: fueraPlana, fueraBart: fueraBart, promedioFuera: promedioFuera };
    return;
  }

  var deslN = document.getElementById("n"), deslS = document.getElementById("semilla");

  function dibujarRuido() {
    var a = ruido(Number(deslN.value), Number(deslS.value));
    document.getElementById("n-valor").textContent = a.n;
    document.getElementById("semilla-valor").textContent = deslS.value;
    document.getElementById("lectura-ruido").innerHTML = "n = " + a.n + ": banda <b>±" + fmt(a.banda) +
      "</b>, barra más alta " + fmt(a.mayor) + ", <b>" + a.fuera.length + "</b> de " + (a.acf.length - 1) +
      " barras fuera" + (a.fuera.length ? " (k = " + a.fuera.join(", ") + ")" : "") + ".";
    document.getElementById("figura-ruido").innerHTML = Grafica.correlograma(a.acf, a.n, {
      titulo: "ACF de un ruido blanco", marcasX: [0, 6, 12, 18, 24, 30, 36]
    });
  }

  var tipo = "plana";
  function dibujarSerie() {
    var bandas = tipo === "plana" ? null : bart11;
    var fuera = tipo === "plana" ? fueraPlana : fueraBart;
    document.getElementById("lectura-serie").innerHTML = "d = 1, D = 1, " + n11 + " datos. Barras fuera: <b>k = " +
      fuera.join(", ") + "</b>.";
    document.getElementById("figura-serie").innerHTML = Grafica.correlograma(r11, n11, {
      titulo: "ACF de la serie con d = 1 y D = 1", bandas: bandas, marcasX: [0, 6, 12, 18, 24, 30, 36]
    });
  }

  deslN.addEventListener("input", dibujarRuido);
  deslS.addEventListener("input", dibujarRuido);
  document.querySelectorAll("#tipo-banda button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#tipo-banda button").forEach(function (o) { o.classList.remove("elegido"); });
      b.classList.add("elegido");
      tipo = b.getAttribute("data-banda");
      dibujarSerie();
    });
  });
  dibujarRuido();
  dibujarSerie();

  document.getElementById("cierre-tabla").innerHTML =
    "<table><thead><tr><th>serie</th><th>datos</th><th>media banda</th></tr></thead><tbody>" +
    [[0, 0], [1, 0], [0, 1], [1, 1]].map(function (c) {
      var n = Series.diferenciar(SERIE.valores, c[0], c[1], 12).length;
      return "<tr><td>d = " + c[0] + ", D = " + c[1] + "</td><td>" + n + "</td><td>" + fmt(Series.banda(n)) + "</td></tr>";
    }).join("") + "<tr><td>ruido con n = " + 4 * n0 + "</td><td>" + 4 * n0 + "</td><td>" + fmt(Series.banda(4 * n0)) + "</td></tr>" +
    "</tbody></table>";

  var pendientes = 2;
  function terminado() {
    pendientes--;
    if (pendientes === 0) { document.getElementById("carta-cierre").style.display = "block"; }
  }
  MotorDecisiones.montar({ bloques: [ANTES], destino: "antes", alTerminar: terminado });
  MotorDecisiones.montar({ bloques: [DESPUES], destino: "despues", alTerminar: terminado });
})();
