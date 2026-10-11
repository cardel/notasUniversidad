/* El mes contra el de k meses atrás. Dispersión de y(t) contra y(t-k) sobre
   la serie del curso, original o diferenciada, con su correlación. Calca la
   primera interactiva del notebook de la sesión 3; todos los números salen
   del cálculo sobre la serie. */
(function () {
  "use strict";

  function fmt(v, d) { return v.toFixed(d === undefined ? 2 : d).replace(".", ",").replace("-", "−"); }

  var original = SERIE.valores;
  var versiones = {
    original: { valores: original, meses: SERIE.meses },
    diferenciada: { valores: Series.diff(original, 1), meses: SERIE.meses.slice(1) }
  };

  function correlacion(version, k) {
    var p = Series.shift(versiones[version].valores, k);
    return Series.corr(p.previo, p.actual);
  }

  function nivel(c) { return Math.abs(c) < 0.25 ? 0 : Math.abs(c) < 0.75 ? 1 : 2; }

  /* Los números que usan las preguntas, calculados una vez. */
  var r1o = correlacion("original", 1), r1d = correlacion("diferenciada", 1);
  var r6o = correlacion("original", 6), r6d = correlacion("diferenciada", 6);
  var r12o = correlacion("original", 12), r12d = correlacion("diferenciada", 12);
  var ultimoAlto = 0;
  while (ultimoAlto < 24 && correlacion("original", ultimoAlto + 1) > 0.5) { ultimoAlto++; }
  var mejorK = 2, mejorR = -2;
  for (var k = 2; k <= 24; k++) {
    var r = correlacion("diferenciada", k);
    if (r > mejorR) { mejorR = r; mejorK = k; }
  }
  var candidatosK = [6, 12, 24];
  if (candidatosK.indexOf(mejorK) < 0) { candidatosK[1] = mejorK; }
  var opcionesAlto = [ultimoAlto - 4, ultimoAlto, ultimoAlto + 4].map(String);

  var NIVELES = ["Cerca de 0", "Alrededor de 0,5", "Cerca de 1"];

  var ANTES = {
    id: "antes",
    titulo: "1. Antes de mover el control",
    definicion: null,
    explicacion: "Prediga, sin mirar la gráfica, qué tan alta sale la correlación entre cada mes y el anterior.",
    opciones: NIVELES,
    items: [
      { valor: "Serie original, k = 1", correcta: nivel(r1o),
        razon: "Sale " + fmt(r1o, 3) + ". Los pasajeros de un mes casi repiten los del anterior: la nube queda pegada a una recta que sube." },
      { valor: "Serie diferenciada, k = 1", correcta: nivel(r1d),
        razon: "Sale " + fmt(r1d, 3) + ". Que un mes suba mucho no dice si el siguiente sube o baja: la nube del cambio mensual no tiene dirección." }
    ],
    cierre: "La misma serie da " + fmt(r1o) + " o " + fmt(r1d) + " en k = 1 según se mire el nivel o el cambio mensual."
  };

  var DESPUES = {
    id: "despues",
    titulo: "3. Con el control en la mano",
    definicion: null,
    explicacion: "Responda moviendo el rezago y cambiando de serie.",
    items: [
      { valor: "En la serie original, ¿hasta qué rezago la correlación se mantiene por encima de 0,5?",
        opciones: opcionesAlto, correcta: 1,
        razon: "Hasta k = " + ultimoAlto + ". Desde k = 1 la correlación baja despacio, un poco por mes, y no se va a cero ni a los dos años." },
      { valor: "En la serie original con k = 6, la correlación es " + fmt(r6o) + ", aunque junio y diciembre no se parecen. ¿Por qué?",
        opciones: ["La tendencia y la pandemia", "Un ciclo de seis meses", "Junio y diciembre tienen el mismo tráfico"], correcta: 0,
        razon: "Los años de mucho tráfico ponen meses altos frente a meses altos, y 2020 pone bajos frente a bajos: la nube se estira en diagonal por el nivel, no por el mes. En la diferenciada, k = 6 da " + fmt(r6d) + "." },
      { valor: "En la serie diferenciada, ¿en qué rezago entre 2 y 24 está la correlación más alta?",
        opciones: candidatosK.map(String), correcta: candidatosK.indexOf(mejorK),
        razon: "En k = " + mejorK + ", con " + fmt(mejorR) + ". El cambio de un mes se parece al cambio del mismo mes un año antes: en todos los años de la serie, diciembre sube frente a noviembre." }
    ],
    cierre: "La serie original dice que hay nivel; la diferenciada, que hay estacionalidad."
  };

  /* --- Interfaz ----------------------------------------------------- */
  if (typeof document === "undefined") {
    module.exports = { ANTES: ANTES, DESPUES: DESPUES, correlacion: correlacion };
    return;
  }

  var estado = { k: 1, version: "original" };
  var deslizador = document.getElementById("k");

  function dibujar() {
    var v = versiones[estado.version];
    var p = Series.shift(v.valores, estado.k);
    var meses = v.meses.slice(estado.k);
    var colores = meses.map(function (m) {
      return /^202[01]/.test(m) ? Grafica.ROJO : Grafica.AZUL;
    });
    var rotulos = meses.map(function (m, i) {
      return m + ": " + fmt(p.actual[i] / 1e6) + " frente a " + fmt(p.previo[i] / 1e6) + " millones";
    });
    var c = Series.corr(p.previo, p.actual);
    document.getElementById("k-valor").textContent = estado.k;
    document.getElementById("lectura").innerHTML = "Serie " + estado.version + ", k = " + estado.k +
      ": <b>correlación " + fmt(c, 3) + "</b> con " + p.actual.length + " pares de meses.";
    document.getElementById("figura").innerHTML = Grafica.dispersion(
      p.previo.map(function (x) { return x / 1e6; }),
      p.actual.map(function (x) { return x / 1e6; }),
      {
        titulo: "y(t) contra y(t−" + estado.k + "), millones de pasajeros",
        etiquetaX: "y(t−" + estado.k + ")", etiquetaY: "y(t)",
        colores: colores, rotulos: rotulos, ancho: 640, alto: 380,
        leyenda: [{ color: Grafica.AZUL, texto: "otros años" }, { color: Grafica.ROJO, texto: "2020 y 2021" }]
      });
  }

  deslizador.addEventListener("input", function () { estado.k = Number(deslizador.value); dibujar(); });
  document.querySelectorAll("#version button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#version button").forEach(function (o) { o.classList.remove("elegido"); });
      b.classList.add("elegido");
      estado.version = b.getAttribute("data-version");
      dibujar();
    });
  });
  dibujar();

  document.getElementById("cierre-tabla").innerHTML =
    "<table><thead><tr><th>rezago</th><th>original</th><th>diferenciada</th></tr></thead><tbody>" +
    "<tr><td>k = 1</td><td>" + fmt(r1o, 3) + "</td><td>" + fmt(r1d, 3) + "</td></tr>" +
    "<tr><td>k = 6</td><td>" + fmt(r6o, 3) + "</td><td>" + fmt(r6d, 3) + "</td></tr>" +
    "<tr><td>k = 12</td><td>" + fmt(r12o, 3) + "</td><td>" + fmt(r12d, 3) + "</td></tr>" +
    "</tbody></table>";

  var pendientes = 2;
  function terminado() {
    pendientes--;
    if (pendientes === 0) { document.getElementById("carta-cierre").style.display = "block"; }
  }
  MotorDecisiones.montar({ bloques: [ANTES], destino: "antes", alTerminar: terminado });
  MotorDecisiones.montar({ bloques: [DESPUES], destino: "despues", alTerminar: terminado });
})();
