if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* La razon operaciones por byte que decide si un calculo se mueve a la GPU.
   El enlace es PCIe 3.0 x16, cerca de 12 GB/s en la practica, y los dos casos
   son los de la clase: a * 2.5 + 1.0 sobre 5 M float64 (80 MB, 10 Mflop) y el
   producto de matrices 4000 x 4000 en float32 (192 MB, 128 Gflop).          */

var PCIE_GBS = 12;      // GB/s del enlace
var CPU_MS = 11.8;      // lo que tardo la CPU con NumPy en a * 2.5 + 1.0
var UMBRAL = 10;        // op/byte a partir de las cuales se mueve

/* Bytes que cruzan el enlace: n datos de bytesPorDato, en tantos arreglos. */
function bytes(n, bytesPorDato, arreglos) {
  return n * bytesPorDato * arreglos;
}

function opPorByte(ops, bytesTotales) {
  return ops / bytesTotales;
}

/* Milisegundos que tardan los bytes en cruzar a gbPorS. */
function viajeMs(bytesTotales, gbPorS) {
  return bytesTotales / (gbPorS * 1e9) * 1000;
}

/* Producto de dos matrices n x n: tres matrices viajan y hace 2 n^3 cuentas. */
function matmul(n, bytesPorDato) {
  var b = 3 * n * n * bytesPorDato;
  var ops = 2 * n * n * n;
  return { bytes: b, ops: ops, opPorByte: opPorByte(ops, b) };
}

function decide(opb, umbral) {
  if (umbral === undefined) { umbral = UMBRAL; }
  return opb >= umbral ? "gpu" : "cpu";
}

/* Cuantas operaciones encadenadas hacen falta para que la razon de una sola
   pase el umbral, con los bytes viajando una unica vez.                    */
function encadenadasParaUmbral(opbUnitario, umbral) {
  if (umbral === undefined) { umbral = UMBRAL; }
  return Math.ceil(umbral / opbUnitario);
}

function rotuloBytes(b) {
  return b >= 1e6 ? Motor.num(b / 1e6, 1) + " MB" : Motor.num(b / 1e3, 1) + " kB";
}

function rotuloOps(o) {
  if (o >= 1e9) { return Motor.num(o / 1e9, 1) + " Gflop"; }
  if (o >= 1e6) { return Motor.num(o / 1e6, 1) + " Mflop"; }
  return Motor.num(o) + " flop";
}

/* Por encima de 10 la razon se lee redondeada; por debajo, con decimales. */
function rotuloOpb(x) {
  return x >= 10 ? Motor.num(Math.round(x)) : Motor.num(x, 3);
}

var PRESETS = [
  {
    clave: "elemental",
    rotulo: "a * 2.5 + 1.0, 5 M float64",
    bytes: bytes(5e6, 8, 2),
    ops: 2 * 5e6,
    detalle: "Cinco millones de float64 son 5.000.000 × 8 bytes = 40 MB. El arreglo va a " +
      "la GPU y el resultado vuelve: 80 MB por el enlace. Del otro lado, una " +
      "multiplicación y una suma por elemento: 10 millones de operaciones. La CPU, con " +
      "NumPy, hizo todo en 11,8 ms."
  },
  {
    clave: "matmul4000",
    rotulo: "producto 4000 × 4000, float32",
    bytes: matmul(4000, 4).bytes,
    ops: matmul(4000, 4).ops,
    detalle: "Tres matrices de 4000 × 4000 en float32: 16.000.000 × 4 bytes = 64 MB cada " +
      "una, 192 MB entre A, B y el resultado. El producto hace 2·n³ operaciones: 128 mil " +
      "millones."
  },
  {
    clave: "matmul500",
    rotulo: "producto 500 × 500, float32",
    bytes: matmul(500, 4).bytes,
    ops: matmul(500, 4).ops,
    detalle: "Las mismas tres matrices, de 500 × 500: 1 MB cada una y 250 millones de " +
      "operaciones. La razón sale alta, pero el viaje dura una fracción de milisegundo y " +
      "la CPU hace este producto en unos pocos ms: solo se mueve si hay más operaciones " +
      "encadenadas sobre esas matrices."
  }
];

function buscarPreset(clave) {
  for (var i = 0; i < PRESETS.length; i++) {
    if (PRESETS[i].clave === clave) { return PRESETS[i]; }
  }
  return PRESETS[0];
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PCIE_GBS: PCIE_GBS, CPU_MS: CPU_MS, UMBRAL: UMBRAL, PRESETS: PRESETS,
    bytes: bytes, opPorByte: opPorByte, viajeMs: viajeMs, matmul: matmul,
    decide: decide, encadenadasParaUmbral: encadenadasParaUmbral,
    rotuloBytes: rotuloBytes, rotuloOps: rotuloOps, rotuloOpb: rotuloOpb,
    buscarPreset: buscarPreset
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var preset = PRESETS[0];
  // Las dos cuentas que piden las predicciones quedan en "?" hasta comprobarlas.
  var destapado = { viaje: false, opbyte: false };

  function leerK() {
    var k = parseInt(document.getElementById("k").value, 10);
    return isNaN(k) || k < 1 ? 1 : k;
  }

  function pintarViaje() {
    document.getElementById("detalle").textContent = preset.detalle;
    Motor.pintarChips("chips-viaje", [
      { texto: "bytes que viajan", valor: rotuloBytes(preset.bytes) },
      { texto: "operaciones", valor: rotuloOps(preset.ops) },
      { texto: "op/byte", cuenta: true,
        valor: destapado.opbyte ? rotuloOpb(opPorByte(preset.ops, preset.bytes)) : "?" },
      { texto: "viaje a " + num(PCIE_GBS) + " GB/s", cuenta: true,
        valor: destapado.viaje ? num(viajeMs(preset.bytes, PCIE_GBS), 2) + " ms" : "?" }
    ]);
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.preset === preset.clave);
    });
  }

  /* La tabla de la clase; la fila del producto se destapa al comprobar B. */
  function pintarTabla() {
    var filas = PRESETS.slice(0, 2).map(function (p, i) {
      var opb = opPorByte(p.ops, p.bytes);
      var oculto = i === 1 && !destapado.opbyte;
      return "<tr><td>" + p.rotulo + "</td><td>" + rotuloBytes(p.bytes) + "</td><td>" +
        rotuloOps(p.ops) + "</td>" +
        (oculto ? "<td class=\"pend\">?</td><td class=\"pend\">?</td>"
                : "<td>" + rotuloOpb(opb) + "</td><td>" +
                  (decide(opb) === "gpu" ? "Sí" : "No") + "</td>") + "</tr>";
    }).join("");
    document.getElementById("cuerpo-tabla").innerHTML = filas;
  }

  function pintarEncadenadas() {
    var k = leerK();
    var base = opPorByte(PRESETS[0].ops, PRESETS[0].bytes);
    var opb = base * k;
    document.getElementById("ver-k").textContent = num(k);
    Motor.pintarChips("chips-k", [
      { texto: "op/byte", valor: num(base, 3) + " × " + num(k) + " = " + rotuloOpb(opb) },
      { texto: "corte", valor: num(UMBRAL) + " op/byte" },
      { texto: "lo pasa con k =", valor: num(encadenadasParaUmbral(base, UMBRAL)) },
      { texto: "viaje, una sola vez",
        valor: destapado.viaje ? num(viajeMs(PRESETS[0].bytes, PCIE_GBS), 2) + " ms" : "?" },
      { texto: "decisión", cuenta: true,
        valor: decide(opb) === "gpu" ? "se mueve a la GPU" : "sigue en la CPU" }
    ]);
  }

  /* El viaje solo contra lo que tardo la CPU; aparece al comprobar A. */
  function pintarBarras() {
    var caja = document.getElementById("panel-viaje");
    caja.hidden = !destapado.viaje;
    if (!destapado.viaje) { return; }
    var ida = viajeMs(PRESETS[0].bytes / 2, PCIE_GBS);
    Motor.pintarGantt("panel-viaje", [
      { rotulo: "CPU con NumPy", valor: num(CPU_MS, 1) + " ms", bloques: [
        { inicio: 0, fin: CPU_MS, color: "var(--azul)", texto: "a * 2.5 + 1.0",
          titulo: "la operación completa en la CPU: " + num(CPU_MS, 1) + " ms" }
      ] },
      { rotulo: "viaje por PCIe", valor: num(2 * ida, 2) + " ms", bloques: [
        { inicio: 0, fin: ida, color: "var(--ambar)", texto: "ida, 40 MB",
          titulo: "40 MB a 12 GB/s: " + num(ida, 2) + " ms" },
        { inicio: ida, fin: 2 * ida, color: "color-mix(in srgb, var(--ambar) 78%, white)",
          texto: "vuelta, 40 MB", titulo: "40 MB a 12 GB/s: " + num(ida, 2) + " ms" }
      ] }
    ], CPU_MS);
  }

  function explicarA(bien, real, dicho) {
    destapado.viaje = true;
    pintarViaje();
    pintarEncadenadas();
    pintarBarras();
    var ida = viajeMs(PRESETS[0].bytes / 2, PCIE_GBS);
    return (bien ? "Sí, " + num(real, 2) + " ms. " : "Son " + num(real, 2) + " ms, no " +
      num(dicho, 2) + ". ") + "40 MB de ida y 40 MB de vuelta: 80 MB a 12 GB/s son " +
      num(real, 2) + " ms, " + num(ida, 2) + " por trayecto. La CPU hizo la operación " +
      "completa en " + num(CPU_MS, 1) + " ms, así que el viaje solo ya se lleva el " +
      num(Math.round(real / CPU_MS * 100)) + " % de ese tiempo, y la GPU aún no ha " +
      "calculado nada.";
  }

  function explicarB(bien, real, dicho) {
    destapado.opbyte = true;
    pintarViaje();
    pintarTabla();
    var m = matmul(4000, 4);
    var base = opPorByte(PRESETS[0].ops, PRESETS[0].bytes);
    return (bien ? "Sí, " + num(real) + ". " : "Son " + num(real) + ", no " + num(dicho) +
      ". ") + "Tres matrices de 4000 × 4000 en float32, 64 MB cada una: " +
      rotuloBytes(m.bytes) + " en total. El producto hace 2·n³ = " + rotuloOps(m.ops) +
      ", y " + rotuloOps(m.ops) + " entre " + rotuloBytes(m.bytes) + " son " + num(real) +
      " op/byte, más de " + num(Math.floor(real / base / 1000) * 1000) + " veces los " +
      num(base, 3) + " de a * 2.5 + 1.0. Sí se mueve: cada byte que cruza paga cientos " +
      "de cuentas del otro lado.";
  }

  var RAZONES = {
    correcta: "Eso es. La línea retorna apenas encola el trabajo en la GPU, y perf_counter " +
      "midió esos 40 µs de encolar, no el cálculo. Se llama torch.cuda.synchronize() " +
      "antes de leer el cronómetro por segunda vez, o se mide con nsys o torch.profiler, " +
      "que sí ven lo que corre en la tarjeta. Con la sincronización el número sube a " +
      "milisegundos.",
    rapida: "Son 50 millones de float32: 200 MB que la GPU tiene que leer y otros 200 MB " +
      "que escribir en su memoria. Hacerlo en 40 µs serían 10 TB/s, más de veinte veces " +
      "los 448 GB/s que da la RTX 3060 Ti. La operación tarda milisegundos; el cronómetro " +
      "se detuvo antes de que empezara.",
    cprofile: "cProfile le habría atribuido los mismos microsegundos: ve la llamada de " +
      "Python, que retorna al encolar, y no el trabajo en la GPU. Lo mismo Pyinstrument. " +
      "Los dos perfiladores miden el intérprete, y el intérprete ya siguió adelante.",
    perf: "perf_counter sí sirve: es el reloj de pared, y la GPU gasta tiempo de pared " +
      "como cualquier otro dispositivo. Lo que falta es esperar a que termine, con " +
      "torch.cuda.synchronize(), antes de leerlo; con eso el número pasa de 40 µs a " +
      "milisegundos."
  };

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      preset = buscarPreset(b.dataset.preset);
      pintarViaje();
    });
  });
  document.getElementById("k").addEventListener("input", pintarEncadenadas);

  // La caja A admite decimales. El .value de un input numerico trae punto
  // decimal y Motor.leerNumero lo quita como separador de miles (6.7 -> 67),
  // asi que aqui se lee directo y se juzga con Motor.veredictoNumerico.
  document.getElementById("btn-comprobar-a").addEventListener("click", function () {
    var caja = document.getElementById("veredicto-a");
    var dicho = parseFloat(String(document.getElementById("prediccion-a").value).replace(",", "."));
    var real = viajeMs(PRESETS[0].bytes, PCIE_GBS);
    var v = Motor.veredictoNumerico(dicho, real);
    caja.className = "veredicto " + (v.bien ? "bien" : "mal");
    caja.textContent = isNaN(dicho) ? v.motivo : explicarA(v.bien, real, dicho);
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion-b", boton: "btn-comprobar-b", veredicto: "veredicto-b" },
    function () { return Math.round(matmul(4000, 4).opPorByte); },
    explicarB);
  Motor.conectarOpciones("opciones-medir", "veredicto-medir", RAZONES);

  pintarViaje();
  pintarTabla();
  pintarEncadenadas();
  pintarBarras();
})();
