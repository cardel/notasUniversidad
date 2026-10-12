/* La serie de análisis: una carta común a todas las actividades con los
   datos de la serie del curso, su gráfica, un resumen, el perfil por mes y
   la tabla completa. Cada página pide además las claves de análisis que le
   sirven para su ejercicio; las cifras salen del cálculo sobre SERIE. */
var Contexto = (function () {
  "use strict";

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  function millones(v, d) {
    return (v / 1e6).toFixed(d === undefined ? 2 : d).replace(".", ",").replace("-", "−");
  }
  function miles(v) {
    var s = Math.round(Math.abs(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (v < 0 ? "−" : "") + s;
  }
  function pct(v) { return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(0) + " %"; }
  function nombre(mes) {
    var p = mes.split("-");
    return MESES[+p[1] - 1] + " de " + p[0];
  }

  var v = SERIE.valores, meses = SERIE.meses;
  function anio(i) { return +meses[i].slice(0, 4); }
  function mesDe(i) { return +meses[i].slice(5, 7) - 1; }
  function pandemia(i) { return anio(i) === 2020 || anio(i) === 2021; }

  function mediaAnual(desde, hasta) {
    var s = 0, c = 0;
    for (var i = 0; i < v.length; i++) {
      if (anio(i) >= desde && anio(i) <= hasta) { s += v[i]; c++; }
    }
    return s / c;
  }

  /* Promedio por mes del calendario, fuera de 2020 y 2021, de la serie o
     de su cambio mensual. */
  function perfil(x, desplazamiento) {
    var s = [], c = [];
    for (var m = 0; m < 12; m++) { s.push(0); c.push(0); }
    for (var i = 0; i < x.length; i++) {
      var j = i + desplazamiento;
      if (!pandemia(j)) { s[mesDe(j)] += x[i]; c[mesDe(j)]++; }
    }
    return s.map(function (t, m) { return t / c[m]; });
  }
  var perfilNivel = perfil(v, 0);
  var cambio = Series.diff(v, 1);
  var perfilCambio = perfil(cambio, 1);

  function orden(p) {
    return p.map(function (x, m) { return m; }).sort(function (a, b) { return p[b] - p[a]; });
  }

  var iMin = 0, iMax = 0;
  for (var i = 1; i < v.length; i++) {
    if (v[i] < v[iMin]) { iMin = i; }
    if (v[i] > v[iMax]) { iMax = i; }
  }
  /* Primer mes después de 2020 que supera al mismo mes de 2019. */
  var iRecupera = -1;
  for (var t = 0; t < v.length && iRecupera < 0; t++) {
    if (anio(t) >= 2021 && v[t] > v[t - 12 * (anio(t) - 2019)]) { iRecupera = t; }
  }

  /* --- Claves de análisis, una por tema ------------------------------ */
  var CLAVES = {
    nivel: function () {
      var a = mediaAnual(2017, 2019), b = mediaAnual(2023, 2025);
      return "<b>Nivel.</b> Antes de la pandemia (2017 a 2019) el promedio fue " + millones(a) +
        " millones de pasajeros por mes; entre 2023 y 2025, " + millones(b) + " millones (" +
        pct(100 * (b - a) / a) + "). La serie crece, así que un mes cualquiera se parece más a los meses " +
        "cercanos que a los de hace años.";
    },
    estacional: function () {
      var o = orden(perfilNivel);
      return "<b>Estacionalidad.</b> Sin 2020 ni 2021, los meses más altos en promedio son " +
        MESES[o[0]] + " y " + MESES[o[1]] + ", y los más bajos, " + MESES[o[11]] + " y " + MESES[o[10]] +
        ". El patrón se repite cada doce meses: es el periodo m = 12.";
    },
    pandemia: function () {
      var abr19 = meses.indexOf("2019-04");
      return "<b>Pandemia.</b> En " + nombre(meses[iMin]) + " volaron " + miles(v[iMin]) +
        " pasajeros, frente a " + miles(v[abr19]) + " en abril de 2019. El tráfico volvió al nivel de 2019 en " +
        nombre(meses[iRecupera]) + ". Esos meses son atípicos y pesan en cualquier correlación que los incluya.";
    },
    cambio: function () {
      var o = orden(perfilCambio);
      return "<b>El cambio mensual.</b> Restar a cada mes el anterior quita el nivel. Sin 2020 ni 2021, el " +
        "cambio promedio es más alto en " + MESES[o[0]] + " (" + millones(perfilCambio[o[0]]) + " millones) y " +
        MESES[o[1]] + " (" + millones(perfilCambio[o[1]]) + "), y más bajo en " + MESES[o[11]] + " (" +
        millones(perfilCambio[o[11]]) + "). Si un mes sube todos los años, su cambio se parece al del mismo " +
        "mes del año anterior.";
    },
    transformaciones: function () {
      return "<b>Qué hace cada diferencia.</b> <code>diff()</code> resta a cada mes el anterior y quita la " +
        "tendencia. <code>diff(12)</code> le resta el mismo mes del año anterior y quita la estacionalidad. " +
        "Una diferencia con rezago k pierde los k primeros datos, porque no tienen con quién restarse.";
    },
    muestra: function () {
      return "<b>Cuántos datos hay.</b> La serie tiene " + v.length + " meses, de " + nombre(meses[0]) +
        " a " + nombre(meses[v.length - 1]) + ". Un correlograma se calcula con los datos que quedan " +
        "después de diferenciar, no con los originales.";
    },
    simulada: function () {
      return "<b>La serie de esta actividad.</b> El AR(1) no es la serie del curso: se simula con " +
        v.length + " datos, los mismos meses que tiene la serie, para que las bandas midan igual. En la " +
        "serie del curso, la tendencia y la estacionalidad tapan la firma de un AR; por eso la identificación " +
        "se hace sobre la serie diferenciada.";
    }
  };

  /* --- Piezas de la carta -------------------------------------------- */
  function resumen() {
    var filas = [
      ["Fuente", "Aerocivil, pasajeros nacionales e internacionales"],
      ["Periodo", nombre(meses[0]) + " a " + nombre(meses[v.length - 1])],
      ["Datos", v.length + " meses; " + SERIE.huecos.length + " sin dato en 2019 (" +
        SERIE.huecos.map(function (h) { return CORTOS[+h.slice(5) - 1]; }).join(", ") + "), rellenos por interpolación lineal"],
      ["Atípicos", "septiembre de 2018 (" + millones(v[meses.indexOf("2018-09")]) + " millones), dato incompleto en la fuente; marzo de 2020 a noviembre de 2021, la pandemia"],
      ["Media", millones(Series.media(v)) + " millones de pasajeros por mes"],
      ["Mínimo", miles(v[iMin]) + " en " + nombre(meses[iMin])],
      ["Máximo", miles(v[iMax]) + " en " + nombre(meses[iMax])]
    ];
    return "<table><tbody>" + filas.map(function (f) {
      return '<tr><th style="text-align:left">' + f[0] + '</th><td style="text-align:left">' + f[1] + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  function tablaPerfil() {
    var o = orden(perfilNivel), alto = [o[0], o[1]], bajo = [o[10], o[11]];
    var cab = CORTOS.map(function (c) { return "<th>" + c + "</th>"; }).join("");
    var cel = perfilNivel.map(function (x, m) {
      var estilo = alto.indexOf(m) >= 0 ? ' style="font-weight:700;color:var(--verde)"' :
        bajo.indexOf(m) >= 0 ? ' style="font-weight:700;color:var(--rojo)"' : "";
      return "<td" + estilo + ">" + millones(x) + "</td>";
    }).join("");
    return "<table><thead><tr>" + cab + "</tr></thead><tbody><tr>" + cel + "</tr></tbody></table>";
  }

  function tablaCompleta() {
    var cab = "<th>año</th>" + CORTOS.map(function (c) { return "<th>" + c + "</th>"; }).join("");
    var filas = {}, anios = [];
    for (var i = 0; i < v.length; i++) {
      var a = anio(i);
      if (!filas[a]) { filas[a] = []; anios.push(a); }
      var hueco = SERIE.huecos.indexOf(meses[i]) >= 0;
      filas[a][mesDe(i)] = "<td" + (hueco ? ' class="pend" title="relleno por interpolación"' : "") + ">" +
        millones(v[i]) + (hueco ? "*" : "") + "</td>";
    }
    return "<table><thead><tr>" + cab + "</tr></thead><tbody>" + anios.map(function (a) {
      var celdas = "";
      for (var m = 0; m < 12; m++) { celdas += filas[a][m] || "<td></td>"; }
      return "<tr><th>" + a + "</th>" + celdas + "</tr>";
    }).join("") + "</tbody></table>";
  }

  function grafica() {
    var marcas = [];
    for (var i = 0; i < meses.length; i++) { if (mesDe(i) === 0) { marcas.push(i); } }
    return Grafica.lineas({
      titulo: "Pasajeros por mes, en millones", alto: 220,
      lineas: [{ valores: v.map(function (x) { return x / 1e6; }) }],
      marcasX: marcas, rotuloX: function (i) { return meses[i].slice(0, 4); }
    });
  }

  /* opciones.claves: nombres de CLAVES; opciones.titulo y opciones.texto
     reemplazan el encabezado y la primera línea si la página lo necesita. */
  function mostrar(id, opciones) {
    opciones = opciones || {};
    var claves = (opciones.claves || []).map(function (c) { return "<li>" + CLAVES[c]() + "</li>"; }).join("");
    var html =
      "<h2>" + (opciones.titulo || "0. La serie de análisis") + "</h2>" +
      "<p>" + (opciones.texto || "Pasajeros aéreos por mes en Colombia, la serie del curso. Léala antes de " +
        "responder: las preguntas se resuelven con lo que se ve aquí.") + "</p>" +
      '<div class="figura">' + grafica() + "</div>" +
      '<div class="envoltura-tabla">' + resumen() + "</div>" +
      (claves ? "<h3>Claves para este ejercicio</h3><ul>" + claves + "</ul>" : "") +
      "<details><summary>Promedio de cada mes del año, sin 2020 ni 2021 (millones)</summary>" +
      '<div class="envoltura-tabla">' + tablaPerfil() + "</div>" +
      '<p class="nota">En verde, los dos meses más altos; en rojo, los dos más bajos.</p></details>' +
      "<details><summary>Todos los datos, en millones de pasajeros</summary>" +
      '<div class="envoltura-tabla">' + tablaCompleta() + "</div>" +
      '<p class="nota">* Mes sin dato en la fuente, relleno por interpolación lineal.</p></details>';
    var carta = document.getElementById(id);
    carta.className = "carta contexto";
    carta.innerHTML = html;
  }

  return { mostrar: mostrar, CLAVES: CLAVES };
})();

if (typeof module !== "undefined") { module.exports = Contexto; }
