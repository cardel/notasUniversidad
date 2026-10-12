/* La serie del curso: pasajeros totales por mes en los vuelos de Colombia,
   nacionales más internacionales, de enero de 2017 a febrero de 2026
   (Aerocivil). Sale de la columna total de datos/serie_curso.csv del curso.
   Los cuatro meses sin dato de 2019 (2019-05, 2019-07, 2019-09, 2019-11) se rellenan por
   interpolación lineal, la misma decisión del curso en los notebooks. */
var SERIE = (function () {
  "use strict";
  var inicio = { anio: 2017, mes: 1 };
  var valores = [
    3285055, 2746322, 3007629, 3000735, 3000863, 3154109,
    3367384, 3326367, 2825363, 2765602, 2909388, 3208177,
    3141994, 2667505, 2967310, 2931985, 2948648, 3089437,
    3363476, 3323989, 1925848, 3362654, 3373078, 3630564,
    3619682, 2968176, 3318213, 3242384, 3400607.5, 3558831,
    3661083.5, 3763336, 3624400, 3485464, 3634452, 3783440,
    3578474, 3283883, 1939197, 11778, 20804, 31830,
    25481, 25108, 353375, 840640, 1188264, 1775275,
    1775836, 1523500, 1982838, 1673419, 1760857, 2514720,
    2877859, 2921254, 2842725, 3064535, 3562411, 4020754,
    3875292, 3258952, 3918609, 3985176, 3927295, 4082718,
    4458729, 4281907, 3962079, 4166152, 3997342, 4314432,
    4256420, 3614432, 3780937, 3519833, 3838910, 4090370,
    4507584, 4466162, 4066238, 4144305, 4482331, 4898151,
    4752906, 4127344, 4457178, 4290162, 4519642, 4783378,
    5064933, 5076582, 4661828, 4867640, 4817279, 5254238,
    5122884, 4162098, 4529624, 4419888, 4429479, 4826041,
    5172786, 5070220, 4645121, 4903941, 4837439, 5380412,
    5497320, 4542573
  ];
  var huecos = ["2019-05", "2019-07", "2019-09", "2019-11"];
  var meses = valores.map(function (_, i) {
    var m = inicio.mes - 1 + i;
    var anio = inicio.anio + Math.floor(m / 12);
    var mes = (m % 12) + 1;
    return anio + "-" + (mes < 10 ? "0" : "") + mes;
  });
  return { valores: valores, meses: meses, huecos: huecos, m: 12 };
})();

if (typeof module !== "undefined") { module.exports = SERIE; }
