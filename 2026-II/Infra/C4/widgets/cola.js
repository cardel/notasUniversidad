if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* La Queue del ejemplo de la clase: cuadrados() pone num * num al final e
   imprimir_cola() saca el primero que entro. Aqui se agrega la capacidad:
   con maxsize el put bloquea al productor cuando la cola esta llena, y get
   bloquea al consumidor cuando esta vacia. Modelo del paso a paso: cuando un
   proceso queda detenido el otro avanza, y el detenido sigue en el momento en
   que la cola se lo permite. Solo uno puede estar esperando a la vez, porque
   una cola no puede estar llena y vacia al mismo tiempo.                    */

var EJEMPLO = { lista: [1, 2, 3, 4], salida: [1, 4, 9, 16] };

var CAPACIDADES = [
  { valor: 2, nombre: "maxsize=2" },
  { valor: 4, nombre: "maxsize=4" },
  { valor: 0, nombre: "sin límite" }
];

function nombreCapacidad(valor) {
  var c = CAPACIDADES.filter(function (x) { return x.valor === valor; })[0];
  return c ? c.nombre : "maxsize=" + Motor.num(valor);
}

/* El dato numero i es i * i, como los cuadrados de la clase. */
function dato(i) { return i * i; }

function put(i) { return { quien: "productor", op: "put", dato: dato(i) }; }
function get() { return { quien: "consumidor", op: "get" }; }

/* Todos los put y despues todos los get. */
function guionRapido(n) {
  var ops = [], i;
  for (i = 1; i <= n; i++) { ops.push(put(i)); }
  for (i = 0; i < n; i++) { ops.push(get()); }
  return ops;
}

/* Un get detras de cada put: el consumidor va al ritmo del productor. */
function guionAlternado(n) {
  var ops = [], i;
  for (i = 1; i <= n; i++) { ops.push(put(i)); ops.push(get()); }
  return ops;
}

/* El consumidor pide varias veces antes del primer put. */
function guionConsumidorPrimero(n, adelantados) {
  var ops = [], i;
  for (i = 0; i < adelantados; i++) { ops.push(get()); }
  for (i = 1; i <= n; i++) { ops.push(put(i)); }
  for (i = adelantados; i < n; i++) { ops.push(get()); }
  return ops;
}

var GUIONES = {
  rapido: { nombre: "productor rápido", ops: guionRapido(6) },
  alternado: { nombre: "alternado", ops: guionAlternado(6) },
  consumidor: { nombre: "consumidor primero", ops: guionConsumidorPrimero(6, 2) }
};

/* Recorre el guion y devuelve la traza. Cada entrada: paso, indice de la
   operacion en el guion, quien, op, dato, cola despues del paso, estado
   ok o bloquea, espera (quien quedo detenido), y en los pasos que retoman
   una operacion detenida, reanuda (paso del bloqueo) y libera (paso que le
   abrio el camino). capacidad <= 0 es una cola sin maxsize.                */
function simular(guion, capacidad) {
  var cola = [], traza = [], hechas = [], detenido = null, paso = 0, vueltas = 0;
  guion.forEach(function () { hechas.push(false); });

  function cabe() { return capacidad <= 0 || cola.length < capacidad; }
  function puede(op) { return op.op === "put" ? cabe() : cola.length > 0; }

  /* Primera operacion pendiente de un proceso que no este detenido. */
  function siguiente() {
    for (var i = 0; i < guion.length; i++) {
      if (hechas[i]) { continue; }
      if (detenido && guion[i].quien === detenido.quien) { continue; }
      return i;
    }
    return -1;
  }

  function ejecutar(i, reanuda, libera) {
    var op = guion[i], salio = null;
    if (op.op === "put") { cola.push(op.dato); } else { salio = cola.shift(); }
    hechas[i] = true;
    paso += 1;
    var e = {
      paso: paso, indice: i, quien: op.quien, op: op.op,
      dato: op.op === "put" ? op.dato : salio,
      cola: cola.slice(), estado: "ok",
      espera: detenido ? detenido.quien : null,
      reanuda: reanuda || null, libera: libera || null
    };
    traza.push(e);
    return e;
  }

  function bloquear(i) {
    var op = guion[i];
    detenido = { quien: op.quien, indice: i };
    paso += 1;
    traza.push({
      paso: paso, indice: i, quien: op.quien, op: op.op,
      dato: op.op === "put" ? op.dato : null,
      cola: cola.slice(), estado: "bloquea", espera: op.quien,
      motivo: op.op === "put" ? "cola llena" : "cola vacía",
      reanuda: null, libera: null
    });
  }

  function pasoDelBloqueo(indice) {
    var p = null;
    traza.forEach(function (e) { if (e.estado === "bloquea" && e.indice === indice) { p = e.paso; } });
    return p;
  }

  while (vueltas++ < 400) {
    var i = siguiente();
    if (i < 0) { break; }
    if (!puede(guion[i])) { bloquear(i); continue; }
    var hecho = ejecutar(i);
    /* La operacion que esperaba sigue en el acto si la cola ya se lo permite. */
    if (detenido && puede(guion[detenido.indice])) {
      var b = detenido;
      detenido = null;
      ejecutar(b.indice, pasoDelBloqueo(b.indice), hecho.paso);
    }
  }
  return traza;
}

/* Cada bloqueo con el paso que lo retoma y la operacion que lo destrabo. */
function desbloquea(traza) {
  return traza.filter(function (e) { return e.estado === "bloquea"; }).map(function (b) {
    var r = null;
    traza.forEach(function (e) { if (e.estado === "ok" && e.reanuda === b.paso) { r = e; } });
    return {
      bloqueo: b.paso, quien: b.quien, op: b.op, motivo: b.motivo,
      reanuda: r ? r.paso : null, libera: r ? r.libera : null
    };
  });
}

/* Cuentas de los primeros pasos de la traza; sin hasta, de toda. */
function resumen(traza, hasta) {
  var vistos = traza.slice(0, hasta === undefined ? traza.length : hasta);
  var puestos = 0, sacados = 0, bloqueos = 0;
  vistos.forEach(function (e) {
    if (e.estado === "bloquea") { bloqueos += 1; }
    else if (e.op === "put") { puestos += 1; }
    else { sacados += 1; }
  });
  var ultimo = vistos[vistos.length - 1];
  return {
    puestos: puestos, sacados: sacados, bloqueos: bloqueos,
    cola: ultimo ? ultimo.cola.slice() : [],
    espera: ultimo ? ultimo.espera : null
  };
}

function maximoEnCola(traza) {
  return traza.reduce(function (m, e) { return Math.max(m, e.cola.length); }, 0);
}

/* Un guion queda colgado si termina con alguien todavia detenido. */
function colgado(traza) {
  var ultimo = traza[traza.length - 1];
  return !!ultimo && ultimo.estado === "bloquea";
}

function etiqueta(op, valor) {
  return op === "put" ? "put(" + Motor.num(valor) + ")" : "get()";
}

/* Estado de los dos procesos tras los primeros pasos. */
function estados(guion, traza, hasta) {
  var vistos = traza.slice(0, hasta === undefined ? traza.length : hasta);
  var total = { productor: 0, consumidor: 0 };
  var hechas = { productor: 0, consumidor: 0 };
  var espera = null, opEspera = null;
  guion.forEach(function (o) { total[o.quien] += 1; });
  vistos.forEach(function (e) {
    if (e.estado === "bloquea") { espera = e.quien; opEspera = e; return; }
    hechas[e.quien] += 1;
    if (espera === e.quien) { espera = null; opEspera = null; }
  });
  var salida = {};
  ["productor", "consumidor"].forEach(function (q) {
    var faltan = total[q] - hechas[q];
    if (espera === q) {
      salida[q] = {
        estado: "bloqueado",
        texto: "bloqueado en " + etiqueta(opEspera.op, opEspera.dato) + ", esperando " +
          (opEspera.op === "put" ? "un lugar libre" : "un elemento")
      };
    } else if (faltan <= 0) {
      salida[q] = { estado: "terminado", texto: "terminó sus " + Motor.num(total[q]) + " operaciones" };
    } else {
      salida[q] = {
        estado: "activo",
        texto: faltan === 1 ? "activo, le falta 1 operación"
          : "activo, le faltan " + Motor.num(faltan) + " operaciones"
      };
    }
  });
  return salida;
}

/* Los put de un productor sobre una cola de capacidad fija, uno por fila. */
function tablaLlenado(capacidad, cuantos) {
  var filas = [], dentro = 0, frenado = false, i, estado;
  for (i = 1; i <= cuantos; i++) {
    if (frenado) { estado = "no llega a ejecutarse"; }
    else if (capacidad <= 0 || dentro < capacidad) { dentro += 1; estado = "entra"; }
    else { estado = "bloquea al productor"; frenado = true; }
    filas.push({ put: i, dato: dato(i), estado: estado, enCola: dentro });
  }
  return filas;
}

function putsQueEntran(capacidad, cuantos) {
  return tablaLlenado(capacidad, cuantos).filter(function (f) {
    return f.estado === "entra";
  }).length;
}

/* Texto del paso i de la traza, contando desde 0. */
function describirPaso(traza, i, capacidad) {
  var num = Motor.num;
  var e = traza[i];
  var tope = capacidad > 0 ? " de " + num(capacidad) : "";
  var s = "Paso " + num(e.paso) + ". ";
  if (e.estado === "bloquea") {
    if (e.op === "put") {
      return s + "El productor intenta " + etiqueta(e.op, e.dato) + " y la cola está llena, " +
        num(e.cola.length) + tope + ": el dato no entra y el proceso queda detenido en esa " +
        "línea hasta que un consumidor saque uno.";
    }
    return s + "El consumidor llama a get() con la cola vacía: no recibe None ni una " +
      "excepción, queda detenido hasta que alguien haga put.";
  }
  if (e.op === "put") {
    s += e.reanuda
      ? "El " + etiqueta(e.op, e.dato) + " que esperaba desde el paso " + num(e.reanuda) +
        " entra ahora: el get del paso " + num(e.libera) + " dejó un lugar libre. "
      : "El productor hace " + etiqueta(e.op, e.dato) + " y el dato entra al final. ";
    return s + "La cola queda con " + num(e.cola.length) +
      (capacidad > 0 ? tope : e.cola.length === 1 ? " elemento" : " elementos") + ".";
  }
  s += e.reanuda
    ? "El get() que esperaba desde el paso " + num(e.reanuda) + " recibe el " + num(e.dato) +
      ", que acaba de poner el put del paso " + num(e.libera) + ". "
    : "El consumidor hace get() y saca el " + num(e.dato) + ", el primero que entró. ";
  if (e.cola.length === 0) { return s + "La cola queda vacía."; }
  return s + (e.cola.length === 1 ? "Queda 1 elemento" : "Quedan " + num(e.cola.length) +
    " elementos") + " en la cola.";
}

/* Cierre cuando ya pasaron todos los pasos del guion. */
function describirCierre(traza, capacidad) {
  var num = Motor.num;
  var r = resumen(traza);
  var bl = desbloquea(traza);
  var deProd = bl.filter(function (b) { return b.quien === "productor"; });
  var deCons = bl.filter(function (b) { return b.quien === "consumidor"; });
  var tope = maximoEnCola(traza);
  var s = "Fin del guion: entraron " + num(r.puestos) + " elementos, salieron " +
    num(r.sacados) + " y la cola quedó " +
    (r.cola.length === 0 ? "vacía. " : "con " + num(r.cola.length) + ". ");
  if (deProd.length) {
    s += "El productor se detuvo " +
      (deProd.length === 1 ? "una vez" : num(deProd.length) + " veces") +
      " con la cola en su tope de " + num(capacidad) + " y siguió en cuanto un get dejó un " +
      "lugar libre: de ahí en adelante puso al ritmo del consumidor. ";
  } else if (capacidad > 0) {
    s += "El productor no se frenó: la cola llegó a tener " + num(tope) +
      (tope === 1 ? " elemento" : " elementos") + " y nunca tuvo que esperar un lugar libre. ";
  } else {
    s += "Sin maxsize el productor no se frena: la cola llegó a tener " + num(tope) +
      " elementos y el único límite es la memoria de la máquina. ";
  }
  if (deCons.length) {
    s += "El consumidor esperó " +
      (deCons.length === 1 ? "una vez" : num(deCons.length) + " veces") +
      " con la cola vacía y cada espera terminó con el put siguiente, sin una sola línea de " +
      "espera activa.";
  } else {
    s += "El consumidor nunca esperó: siempre había algo cuando llamó a get().";
  }
  if (colgado(traza)) {
    s += " El guion termina con el " + traza[traza.length - 1].quien + " todavía detenido: " +
      "nadie va a hacer la operación que lo destraba y el programa queda colgado.";
  }
  return s;
}

/* Veredicto de la prediccion: 6 put sobre una Queue(maxsize=4). */
function textoPut(bien, real, dicho) {
  var num = Motor.num;
  var s = bien ? "Sí, " + num(real) + ". " : "Son " + num(real) + ", no " + num(dicho) + ". ";
  return s + "Los cuatro primeros put entran y llenan la cola. El quinto no entra: deja al " +
    "productor detenido en esa línea hasta que un consumidor saque un elemento, y el sexto ni " +
    "siquiera se ejecuta, porque el proceso quedó parado en el quinto. La cola no crece sin " +
    "límite, y ese freno es lo que evita que el productor llene la memoria cuando corre más " +
    "rápido que el consumidor.";
}

var RAZONES_VACIA = {
  correcta: "El proceso queda detenido en esa línea hasta que otro haga put, y sigue con el " +
    "primer dato que llegue. Eso es lo que sincroniza al consumidor con el productor: no hay " +
    "que escribir un bucle que pregunte si ya llegó algo. En el ejemplo de la clase, " +
    "imprimir_cola pide cuatro elementos y los recibe en el orden en que cuadrados los pone.",
  none: "No devuelve nada: espera. Si una cola vacía devolviera None, el consumidor no podría " +
    "distinguir un dato que todavía no llega de un None puesto a propósito, y ese None es " +
    "justamente la marca de fin con la que el productor anuncia que terminó.",
  empty: "queue.Empty la lanzan get_nowait(), get(block=False) y get(timeout=5) cuando se " +
    "agotan los cinco segundos. El get sin argumentos no tiene plazo y no falla: se queda ahí.",
  ultimo: "get() saca el elemento y lo borra de la cola, así que no queda copia de lo que ya " +
    "salió. Después de los cuatro cuadrados del ejemplo, la cola no tiene nada que devolver."
};

var RAZONES_CENTINELA = {
  correcta: "Una marca de fin por cada consumidor que haya: tres None detrás del último dato. " +
    "Cada consumidor saca el suyo, sale del while y termina, y el join() del padre retorna.",
  close: "q.close() anuncia que el proceso que la llama no enviará más datos y cierra su " +
    "extremo. Los tres consumidores siguen detenidos en get(), esperando algo que no va a " +
    "llegar, y el join() del padre nunca retorna.",
  vacia: "Una cola vacía no dice que no vengan más datos. Entre el put y el momento en que el " +
    "dato se ve del otro lado hay un hilo interno moviendo bytes, así que q.empty() puede " +
    "responder verdadero con dos elementos recién insertados: coordinar con while not " +
    "q.empty() pierde datos.",
  uno: "El primer consumidor que lo saque termina y los otros dos vuelven a get() sobre una " +
    "cola vacía, donde se quedan esperando para siempre. Un centinela lo consume un solo " +
    "proceso: hacen falta tantos como consumidores."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    EJEMPLO: EJEMPLO, CAPACIDADES: CAPACIDADES, GUIONES: GUIONES,
    RAZONES_VACIA: RAZONES_VACIA, RAZONES_CENTINELA: RAZONES_CENTINELA,
    dato: dato, nombreCapacidad: nombreCapacidad,
    guionRapido: guionRapido, guionAlternado: guionAlternado,
    guionConsumidorPrimero: guionConsumidorPrimero,
    simular: simular, desbloquea: desbloquea, resumen: resumen,
    maximoEnCola: maximoEnCola, colgado: colgado, etiqueta: etiqueta, estados: estados,
    tablaLlenado: tablaLlenado, putsQueEntran: putsQueEntran,
    describirPaso: describirPaso, describirCierre: describirCierre, textoPut: textoPut
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var capacidad = 4;
  var claveGuion = "rapido";
  var traza = simular(GUIONES.rapido.ops, capacidad);
  var k = 0;
  var vistaLlenado = false;

  function ops() { return GUIONES[claveGuion].ops; }
  function cuantas(cual) {
    return ops().filter(function (o) { return o.op === cual; }).length;
  }

  function pintarPresets() {
    document.querySelectorAll("[data-cap]").forEach(function (b) {
      b.classList.toggle("activo", parseInt(b.dataset.cap, 10) === capacidad);
    });
    document.querySelectorAll("[data-guion]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.guion === claveGuion);
    });
  }

  /* La tabla de la carta 2 tapa las dos columnas que dan la respuesta. */
  function pintarLlenado() {
    var pend = "<td class=\"pend\">?</td>";
    document.getElementById("cuerpo-llenado").innerHTML = tablaLlenado(4, 6)
      .map(function (f) {
        var celdas = vistaLlenado
          ? "<td>" + f.estado + "</td><td>" + num(f.enCola) + "</td>"
          : pend + pend;
        return "<tr><td>" + num(f.put) + "</td><td>" + num(f.dato) + "</td>" + celdas + "</tr>";
      }).join("");
  }

  function pintarCola() {
    var r = resumen(traza, k);
    var e = k > 0 ? traza[k - 1] : null;
    var entro = !!e && e.estado === "ok" && e.op === "put";
    var html = "", i;
    for (i = 0; i < r.cola.length; i++) {
      html += "<div class=\"caja" + (entro && i === r.cola.length - 1 ? " actual" : "") + "\">" +
        (i === 0 ? "<span class=\"indice\">get</span>" : "") + num(r.cola[i]) + "</div>";
    }
    var huecos = capacidad > 0 ? capacidad - r.cola.length : 1;
    for (i = 0; i < huecos; i++) {
      html += "<div class=\"caja hueco\">" +
        (i === 0 ? "<span class=\"indice\">put</span>" : "") +
        (capacidad <= 0 ? "…" : "") + "</div>";
    }
    document.getElementById("cola-caja").innerHTML = html;
  }

  function pintarEstados() {
    var e = estados(ops(), traza, k);
    document.getElementById("estado-procesos").innerHTML =
      [["productor", "Productor"], ["consumidor", "Consumidor"]].map(function (p) {
        var s = e[p[0]];
        return "<span class=\"" + (s.estado === "activo" ? "" : "dormido") + "\"><b>" +
          p[1] + ":</b> " + s.texto + "</span>";
      }).join("");
  }

  function pintarPaso() {
    var total = traza.length;
    var hecho = k >= total;
    document.getElementById("progreso").textContent = k === 0
      ? GUIONES[claveGuion].nombre + " con " + nombreCapacidad(capacidad) + ": " +
        num(cuantas("put")) + " put y " + num(cuantas("get")) + " get, " + num(total) +
        " pasos por recorrer."
      : "Paso " + num(k) + " de " + num(total) + " · " + GUIONES[claveGuion].nombre + " · " +
        nombreCapacidad(capacidad) + (hecho ? " · terminó" : "");
    document.getElementById("btn-siguiente").disabled = hecho;
    pintarCola();
    pintarEstados();
    var texto = k > 0 ? describirPaso(traza, k - 1, capacidad) : "";
    if (hecho) { texto += (texto ? " " : "") + describirCierre(traza, capacidad); }
    document.getElementById("paso-texto").textContent = texto;
    var r = resumen(traza, k);
    Motor.pintarChips("chips-cola", [
      { texto: "en la cola", valor: num(r.cola.length) +
        (capacidad > 0 ? " de " + num(capacidad) : "") },
      { texto: "puestos", valor: num(r.puestos) },
      { texto: "sacados", valor: num(r.sacados) },
      { texto: "bloqueos", valor: num(r.bloqueos), cuenta: r.bloqueos > 0 }
    ]);
  }

  function rehacer() {
    traza = simular(ops(), capacidad);
    k = 0;
    pintarPresets();
    pintarPaso();
  }

  document.querySelectorAll("[data-cap]").forEach(function (b) {
    b.addEventListener("click", function () {
      capacidad = parseInt(b.dataset.cap, 10);
      rehacer();
    });
  });
  document.querySelectorAll("[data-guion]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (GUIONES[b.dataset.guion]) { claveGuion = b.dataset.guion; rehacer(); }
    });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, traza.length); pintarPaso();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = traza.length; pintarPaso();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarPaso();
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion-put", boton: "btn-comprobar-put", veredicto: "veredicto-put" },
    function () { return putsQueEntran(4, 6); },
    function (bien, real, dicho) {
      vistaLlenado = true;
      pintarLlenado();
      return textoPut(bien, real, dicho);
    });
  Motor.conectarOpciones("opciones-vacia", "veredicto-vacia", RAZONES_VACIA);
  Motor.conectarOpciones("opciones-centinela", "veredicto-centinela", RAZONES_CENTINELA);

  pintarPresets();
  pintarLlenado();
  pintarPaso();
})();
