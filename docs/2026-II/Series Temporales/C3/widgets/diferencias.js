/* Diferenciar y mirar la ACF. Dos casillas, d y D, sobre la serie del curso:
   la serie diferenciada, su ACF hasta k = 36 con la banda ±1,96/√n y el
   valor p de ADF que dio statsmodels en la sesión 3. Calca la segunda
   interactiva del notebook de esa sesión. */
(function () {
  "use strict";

  function fmt(v, d) { return v.toFixed(d === undefined ? 2 : d).replace(".", ",").replace("-", "−"); }

  /* adfuller(x, regression="c", autolag="AIC") de statsmodels, sesión 3,
     slides/sesion03/codigo/salidas/act4_adf.txt. */
  var ADF = { "0,0": 0.394, "1,0": 0.122, "0,1": 0.368, "1,1": 0.022 };
  var NLAGS = 36;

  function version(d, D) {
    var y = Series.diferenciar(SERIE.valores, d, D, 12);
    var r = Series.acf(y, NLAGS);
    var b = Series.banda(y.length);
    var fuera = [];
    for (var k = 1; k <= NLAGS; k++) { if (Math.abs(r[k]) > b) { fuera.push(k); } }
    return { d: d, D: D, valores: y, n: y.length, acf: r, banda: b, fuera: fuera, p: ADF[d + "," + D] };
  }

  var V = { "0,0": version(0, 0), "1,0": version(1, 0), "0,1": version(0, 1), "1,1": version(1, 1) };

  function listaRezagos(f) {
    if (!f.length) { return "ninguno"; }
    /* Una racha de seguidos se escribe como intervalo. */
    var partes = [], i = 0;
    while (i < f.length) {
      var j = i;
      while (j + 1 < f.length && f[j + 1] === f[j] + 1) { j++; }
      partes.push(j - i >= 2 ? f[i] + " a " + f[j] : f.slice(i, j + 1).join(", "));
      i = j + 1;
    }
    return partes.join(", ");
  }

  var nombres = ["d = 0, D = 0", "d = 1, D = 0", "d = 0, D = 1", "d = 1, D = 1"];
  var claves = ["0,0", "1,0", "0,1", "1,1"];
  var conP = claves.filter(function (c) { return V[c].p < 0.05; });

  var ANTES = {
    id: "antes",
    titulo: "1. Antes de marcar las casillas",
    definicion: null,
    explicacion: "Prediga qué deja cada combinación. La serie original tiene " + V["0,0"].n + " meses.",
    items: [
      { valor: "Con d = 1 y D = 1, ¿cuántos datos quedan?",
        opciones: ["109", "98", String(V["1,1"].n)], correcta: 2,
        razon: "Quedan " + V["1,1"].n + ": la diferencia estacional no tiene con qué restar los doce primeros meses, y la regular pierde uno más. 109 es lo que deja d = 1 sola y 98 lo que deja D = 1 sola." },
      { valor: "¿Cuál combinación espera que pase la prueba ADF, con valor p por debajo de 0,05?",
        opciones: nombres, correcta: claves.indexOf(conP[0]),
        razon: "Solo " + nombres[claves.indexOf(conP[0])] + ", con p = " + fmt(V[conP[0]].p, 3) + ". Con una sola de las dos diferencias el valor p sigue por encima de 0,1." }
    ],
    cierre: "Diferenciar cuesta datos, y la serie del curso necesita las dos diferencias para que ADF rechace la raíz unitaria."
  };

  function nivel(c) { return Math.abs(c) < 0.25 ? 0 : Math.abs(c) < 0.75 ? 1 : 2; }
  var r10 = V["0,1"].acf[1], r12 = V["1,1"].acf[12];

  var DESPUES = {
    id: "despues",
    titulo: "3. Con las casillas",
    definicion: null,
    explicacion: "Responda mirando la ACF de cada combinación.",
    items: [
      { valor: "Con d = 0 y D = 1, ¿cómo queda la ACF en k = 1?",
        opciones: ["Cerca de 0", "Alrededor de 0,5", "Cerca de 1"], correcta: nivel(r10),
        razon: "Queda en " + fmt(r10) + ". Restar el mismo mes del año anterior deja el crecimiento interanual, y ese crecimiento se mueve despacio: cae en 2020, se recupera en 2021 y 2022, y cada mes se parece al anterior." },
      { valor: "Con d = 1 y D = 0, ¿qué rezagos salen de la banda?",
        opciones: [listaRezagos(V["0,0"].fuera), listaRezagos(V["1,0"].fuera), listaRezagos(V["1,1"].fuera)], correcta: 1,
        razon: "Salen " + listaRezagos(V["1,0"].fuera) + ". Sin el nivel, lo que queda es el año: los múltiplos de 12. La primera opción es la serie original, que sale en todos los rezagos cortos; la tercera es la de d = 1 y D = 1." },
      { valor: "Con d = 1 y D = 1, la barra en k = 12 es…",
        opciones: ["Positiva y fuera de la banda", "Negativa y fuera de la banda", "Pequeña, dentro de la banda"],
        correcta: r12 > V["1,1"].banda ? 0 : r12 < -V["1,1"].banda ? 1 : 2,
        razon: "Vale " + fmt(r12) + " con una banda de ±" + fmt(V["1,1"].banda, 3) + ". La diferencia estacional quitó el patrón anual y dejó una correlación negativa a doce meses: un mes que creció más de lo usual frente al año anterior suele ir seguido, un año después, por uno que crece menos." }
    ],
    cierre: "La ACF dice qué quitó cada diferencia y qué dejó."
  };

  /* --- Interfaz ----------------------------------------------------- */
  if (typeof document === "undefined") {
    module.exports = { V: V, ANTES: ANTES, DESPUES: DESPUES };
    return;
  }

  var casD = document.getElementById("d"), casE = document.getElementById("D");

  function dibujar() {
    var d = casD.checked ? 1 : 0, D = casE.checked ? 1 : 0;
    var v = V[d + "," + D];
    var meses = SERIE.meses.slice(SERIE.meses.length - v.n);
    document.getElementById("lectura").innerHTML =
      "d = " + d + ", D = " + D + ": <b>" + v.n + " datos</b>, banda ±" + fmt(v.banda, 3) +
      ", valor p de ADF <b>" + fmt(v.p, 3) + "</b>. Rezagos fuera de la banda: " + listaRezagos(v.fuera) + ".";
    var anios = [];
    meses.forEach(function (m, i) { if (/-01$/.test(m)) { anios.push(i); } });
    document.getElementById("figura-serie").innerHTML = Grafica.lineas({
      titulo: "La serie, millones de pasajeros", cero: true, alto: 210,
      lineas: [{ valores: v.valores.map(function (x) { return x / 1e6; }) }],
      marcasX: anios, rotuloX: function (i) { return meses[i].slice(0, 4); }
    });
    document.getElementById("figura-acf").innerHTML = Grafica.correlograma(v.acf, v.n, {
      titulo: "ACF", marcasX: [0, 6, 12, 18, 24, 30, 36], etiquetaX: "rezago k (meses)"
    });
  }

  casD.addEventListener("change", dibujar);
  casE.addEventListener("change", dibujar);
  dibujar();

  document.getElementById("cierre-tabla").innerHTML =
    "<table><thead><tr><th>d</th><th>D</th><th>datos</th><th>ACF k = 1</th><th>ACF k = 12</th><th>valor p de ADF</th></tr></thead><tbody>" +
    claves.map(function (c) {
      var v = V[c];
      return "<tr><td>" + v.d + "</td><td>" + v.D + "</td><td>" + v.n + "</td><td>" + fmt(v.acf[1]) +
        "</td><td>" + fmt(v.acf[12]) + "</td><td>" + fmt(v.p, 3) + "</td></tr>";
    }).join("") + "</tbody></table>";

  var pendientes = 2;
  function terminado() {
    pendientes--;
    if (pendientes === 0) { document.getElementById("carta-cierre").style.display = "block"; }
  }
  MotorDecisiones.montar({ bloques: [ANTES], destino: "antes", alTerminar: terminado });
  MotorDecisiones.montar({ bloques: [DESPUES], destino: "despues", alTerminar: terminado });
})();
