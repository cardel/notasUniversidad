/* ¿De cuál serie es este correlograma? Tres ACF de la serie del curso, en
   desorden: la original, diff() y diff(12). Las gráficas y las razones salen
   del cálculo sobre la serie. */
(function () {
  "use strict";

  function fmt(v, d) { return v.toFixed(d === undefined ? 2 : d).replace(".", ",").replace("-", "−"); }

  var NLAGS = 36;

  function version(nombre, d, D) {
    var y = Series.diferenciar(SERIE.valores, d, D, 12);
    var r = Series.acf(y, NLAGS), b = Series.banda(y.length), fuera = 0;
    for (var k = 1; k <= NLAGS; k++) { if (Math.abs(r[k]) > b) { fuera++; } }
    return { nombre: nombre, n: y.length, acf: r, banda: b, fuera: fuera };
  }

  /* El orden en que se muestran: A, B, C. */
  var LETRAS = ["A", "B", "C"];
  var MOSTRADOS = [version("diff(12)", 0, 1), version("la original", 0, 0), version("diff()", 1, 0)];

  function letra(nombre) {
    for (var i = 0; i < MOSTRADOS.length; i++) { if (MOSTRADOS[i].nombre === nombre) { return i; } }
    return -1;
  }

  function resumen(v) {
    return "k = 1 vale " + fmt(v.acf[1]) + ", k = 12 vale " + fmt(v.acf[12]) + " y k = 24 vale " + fmt(v.acf[24]);
  }

  var o = MOSTRADOS[letra("la original")], d1 = MOSTRADOS[letra("diff()")], d12 = MOSTRADOS[letra("diff(12)")];

  var menosFuera = 0;
  MOSTRADOS.forEach(function (v, i) { if (v.fuera < MOSTRADOS[menosFuera].fuera) { menosFuera = i; } });
  var negativo12 = 0;
  MOSTRADOS.forEach(function (v, i) { if (v.acf[12] < MOSTRADOS[negativo12].acf[12]) { negativo12 = i; } });

  var BLOQUES = [
    {
      id: "emparejar",
      titulo: "1. Empareje cada serie con su correlograma",
      definicion: null,
      explicacion: "Mire primero la barra de k = 1 y después la de k = 12.",
      opciones: LETRAS,
      items: [
        { valor: "La serie original", correcta: letra("la original"),
          razon: "Es " + LETRAS[letra("la original")] + ": " + resumen(o) + ". Empieza casi en 1 y baja despacio, sin cambiar de signo en los rezagos cortos: así se ve una tendencia." },
        { valor: "<code>diff()</code>", correcta: letra("diff()"),
          razon: "Es " + LETRAS[letra("diff()")] + ": " + resumen(d1) + ". Sin el nivel, la barra de k = 1 cae casi a cero y lo que queda son los picos de cada año." },
        { valor: "<code>diff(12)</code>", correcta: letra("diff(12)"),
          razon: "Es " + LETRAS[letra("diff(12)")] + ": " + resumen(d12) + ". Arranca casi tan alto como la original, porque el crecimiento interanual cambia despacio, pero en k = 12 la barra es negativa." }
      ],
      cierre: "La barra de k = 1 separa la original y diff(12) de diff(); la de k = 12 separa la original de diff(12)."
    },
    {
      id: "comparar",
      titulo: "2. Compare los tres",
      definicion: null,
      explicacion: "Cuente las barras rojas, las que salen de la banda.",
      opciones: LETRAS,
      items: [
        { valor: "¿Cuál tiene menos barras fuera de la banda?", correcta: menosFuera,
          razon: "Es " + LETRAS[menosFuera] + ", con " + MOSTRADOS[menosFuera].fuera + " de 36. Las otras dos tienen " +
            MOSTRADOS.filter(function (_, i) { return i !== menosFuera; }).map(function (v) { return v.fuera; }).join(" y ") +
            ". Ninguna es ruido blanco: con 36 rezagos y una banda del 95 %, en un ruido blanco salen por azar una o dos." },
        { valor: "¿En cuál la barra de k = 12 es más negativa?", correcta: negativo12,
          razon: "En " + LETRAS[negativo12] + ", " + MOSTRADOS[negativo12].nombre + ", con " + fmt(MOSTRADOS[negativo12].acf[12]) +
            ". Restar el mismo mes del año anterior deja una correlación negativa a doce meses: un año que crece de más suele ir seguido de uno que crece de menos." }
      ],
      cierre: "Ninguna de las tres basta sola: falta combinar las dos diferencias."
    }
  ];

  /* --- Interfaz ----------------------------------------------------- */
  if (typeof document === "undefined") {
    module.exports = { MOSTRADOS: MOSTRADOS, BLOQUES: BLOQUES };
    return;
  }

  document.getElementById("candidatos").innerHTML = MOSTRADOS.map(function (v, i) {
    return "<figure>" + Grafica.correlograma(v.acf, v.n, {
      ancho: 320, alto: 220, etiquetaX: "rezago k", marcasX: [0, 12, 24, 36]
    }) + "<figcaption>" + LETRAS[i] + "</figcaption></figure>";
  }).join("");

  document.getElementById("cierre-tabla").innerHTML =
    "<table><thead><tr><th></th><th>serie</th><th>datos</th><th>k = 1</th><th>k = 12</th><th>k = 24</th><th>barras fuera</th></tr></thead><tbody>" +
    MOSTRADOS.map(function (v, i) {
      return "<tr><td>" + LETRAS[i] + "</td><td>" + v.nombre + "</td><td>" + v.n + "</td><td>" + fmt(v.acf[1]) + "</td><td>" +
        fmt(v.acf[12]) + "</td><td>" + fmt(v.acf[24]) + "</td><td>" + v.fuera + "</td></tr>";
    }).join("") + "</tbody></table>";

  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
})();
