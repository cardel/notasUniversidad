/* Cuatro tareas con dependencias repartidas entre varios procesadores.
   El planificador es de lista: cada vez que un procesador queda libre toma la
   tarea mas larga de las que ya tienen resueltas sus dependencias.        */

var TAREAS = [
  { id: "A", dura: 8, depende: [], color: "var(--azul)" },
  { id: "B", dura: 2, depende: ["A"], color: "var(--ambar)" },
  { id: "C", dura: 3, depende: ["A"], color: "var(--verde)" },
  { id: "D", dura: 4, depende: [], color: "var(--rojo)" }
];

function buscar(tareas, id) {
  for (var i = 0; i < tareas.length; i++) {
    if (tareas[i].id === id) { return tareas[i]; }
  }
  return null;
}

function trabajoTotal(tareas) {
  return tareas.reduce(function (s, t) { return s + t.dura; }, 0);
}

/* El camino mas largo de la cadena de dependencias. Ningun reparto puede
   terminar antes, por muchos procesadores que se pongan.                  */
function caminoCritico(tareas) {
  var memoria = {};
  function largo(id) {
    if (memoria[id] !== undefined) { return memoria[id]; }
    var t = buscar(tareas, id);
    var previo = 0;
    for (var i = 0; i < t.depende.length; i++) {
      previo = Math.max(previo, largo(t.depende[i]));
    }
    memoria[id] = previo + t.dura;
    return memoria[id];
  }
  var peor = 0;
  for (var i = 0; i < tareas.length; i++) {
    peor = Math.max(peor, largo(tareas[i].id));
  }
  return peor;
}

function planificar(tareas, procesadores) {
  var fin = {};
  var libres = [];
  var i;
  for (i = 0; i < procesadores; i++) { libres.push(0); }
  var faltan = tareas.map(function (t) { return t.id; });
  var plan = [];

  while (faltan.length) {
    var p = 0;
    for (i = 1; i < libres.length; i++) {
      if (libres[i] < libres[p]) { p = i; }
    }
    var ahora = libres[p];

    var listas = faltan.filter(function (id) {
      return buscar(tareas, id).depende.every(function (d) {
        return fin[d] !== undefined && fin[d] <= ahora;
      });
    });

    if (!listas.length) {
      // Nada puede arrancar todavia: este procesador espera al proximo final.
      var siguiente = Infinity;
      libres.concat(Object.keys(fin).map(function (k) { return fin[k]; }))
        .forEach(function (t) {
          if (t > ahora && t < siguiente) { siguiente = t; }
        });
      if (siguiente === Infinity) { break; }
      libres[p] = siguiente;
      continue;
    }

    listas.sort(function (a, b) {
      var da = buscar(tareas, a).dura, db = buscar(tareas, b).dura;
      return db - da || (a < b ? -1 : 1);
    });
    var elegida = buscar(tareas, listas[0]);
    plan.push({ id: elegida.id, procesador: p,
                inicio: ahora, fin: ahora + elegida.dura });
    fin[elegida.id] = ahora + elegida.dura;
    libres[p] = ahora + elegida.dura;
    faltan.splice(faltan.indexOf(elegida.id), 1);
  }

  var duracion = 0;
  plan.forEach(function (b) { duracion = Math.max(duracion, b.fin); });
  return { plan: plan, duracion: duracion };
}

/* Con las tareas partibles cada una usa todos los procesadores, asi que
   ninguno queda ocioso y el reparto solo depende del trabajo total.       */
function fragmentado(tareas, procesadores) {
  return trabajoTotal(tareas) / procesadores;
}

function cota(tareas, procesadores) {
  return Math.max(trabajoTotal(tareas) / procesadores, caminoCritico(tareas));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TAREAS: TAREAS, planificar: planificar, fragmentado: fragmentado,
    caminoCritico: caminoCritico, trabajoTotal: trabajoTotal, cota: cota
  };
}

if (typeof document !== "undefined") (function () {
  var procesadores = 2;
  var partible = false;

  function num(x, d) {
    return x.toFixed(d).replace(".", ",").replace(/,0+$/, "");
  }

  function pintarTareas() {
    var filas = TAREAS.map(function (t) {
      return "<tr><td><b style=\"color:" + t.color + "\">" + t.id + "</b></td>" +
        "<td>" + t.dura + "</td><td>" +
        (t.depende.length ? t.depende.join(", ") : "nada") + "</td></tr>";
    }).join("");
    document.getElementById("cuerpo-tareas").innerHTML = filas;
  }

  function pintarGantt() {
    var r = partible ? null : planificar(TAREAS, procesadores);
    var caja = document.getElementById("panel-gantt");
    if (partible) {
      var t = fragmentado(TAREAS, procesadores);
      caja.innerHTML = "<p>Cada tarea se parte entre los " + procesadores +
        " procesadores, así que ninguno queda quieto: el trabajo total, " +
        trabajoTotal(TAREAS) + ", se reparte parejo.</p>" +
        "<div class=\"barra-fila\"><span class=\"rotulo\">los " + procesadores +
        "</span><span class=\"pista-barra\" style=\"display:flex\">" +
        "<span class=\"barra\" style=\"width:100%;background:var(--azul)\"></span>" +
        "</span><span class=\"valor\">" + num(t, 3) + "</span></div>";
      return;
    }
    var escala = r.duracion || 1;
    var html = "";
    for (var p = 0; p < procesadores; p++) {
      var bloques = r.plan.filter(function (b) { return b.procesador === p; })
                          .sort(function (a, b) { return a.inicio - b.inicio; });
      var dentro = "", reloj = 0;
      bloques.forEach(function (b) {
        if (b.inicio > reloj) {
          dentro += "<span style=\"flex:none;width:" +
            ((b.inicio - reloj) / escala * 100) + "%\"></span>";
        }
        dentro += "<span class=\"barra\" style=\"flex:none;width:" +
          ((b.fin - b.inicio) / escala * 100) + "%;background:" +
          buscar(TAREAS, b.id).color + ";color:#fff;text-align:center;" +
          "font-size:0.8rem;line-height:22px\">" + b.id + "</span>";
        reloj = b.fin;
      });
      html += "<div class=\"barra-fila\"><span class=\"rotulo\">P" + (p + 1) +
        "</span><span class=\"pista-barra\" style=\"display:flex\">" + dentro +
        "</span><span class=\"valor\">" + num(reloj, 0) + "</span></div>";
    }
    caja.innerHTML = html;
  }

  function pintarChips() {
    var t = partible ? fragmentado(TAREAS, procesadores)
                     : planificar(TAREAS, procesadores).duracion;
    document.getElementById("panel-chips").innerHTML =
      "<span class=\"chip\">termina en <b>" + num(t, 3) + "</b></span>" +
      "<span class=\"chip\">trabajo total <b>" + trabajoTotal(TAREAS) + "</b></span>" +
      "<span class=\"chip\">trabajo entre " + procesadores + " <b>" +
        num(trabajoTotal(TAREAS) / procesadores, 3) + "</b></span>" +
      "<span class=\"chip cuenta\">cadena más larga <b>" +
        caminoCritico(TAREAS) + "</b></span>";
  }

  function pintarTabla() {
    var filas = [1, 2, 4, 8].map(function (n) {
      var r = planificar(TAREAS, n);
      var f = fragmentado(TAREAS, n);
      return "<tr" + (n === procesadores ? " style=\"background:var(--resalte)\"" : "") +
        "><td>" + n + "</td><td>" + num(r.duracion, 0) + "</td><td>" +
        num(trabajoTotal(TAREAS) / r.duracion, 2) + "</td><td>" +
        num(cota(TAREAS, n), 3) + "</td><td>" + num(f, 3) + "</td></tr>";
    }).join("");
    document.getElementById("cuerpo-tabla").innerHTML = filas;
  }

  function pintar() {
    document.getElementById("ver-p").textContent = procesadores;
    pintarGantt();
    pintarChips();
    pintarTabla();
  }

  function comprobar() {
    var caja = document.getElementById("veredicto");
    var dicho = parseFloat(document.getElementById("prediccion").value
                            .replace(",", "."));
    var real = partible ? fragmentado(TAREAS, procesadores)
                        : planificar(TAREAS, procesadores).duracion;
    if (isNaN(dicho)) {
      caja.className = "veredicto mal";
      caja.textContent = "Escriba un número antes de comprobar.";
      return;
    }
    var bien = Math.abs(dicho - real) < 0.05;
    caja.className = "veredicto " + (bien ? "bien" : "mal");
    caja.textContent = bien
      ? "Sí: termina en " + num(real, 3) + "."
      : "Termina en " + num(real, 3) + ". El trabajo total es " +
        trabajoTotal(TAREAS) + " y la cadena más larga es A→C, que vale " +
        caminoCritico(TAREAS) + ".";
  }

  var RAZONES = {
    correcta: "Eso es. B y C esperan a que A termine, y A dura 8. Con dos " +
      "procesadores ya alcanza para adelantar D mientras A corre; el tercero " +
      "y el cuarto no tienen a quién adelantar.",
    trabajo: "El trabajo total sí se reparte mejor: 17 entre 8 da 2,125. Pero " +
      "el reparto no puede terminar antes que la cadena A→C, que vale 11.",
    pocas: "No es el número de tareas. Con las mismas cuatro tareas y sin " +
      "dependencias el tiempo sí bajaría: 8 con dos procesadores.",
    memoria: "La memoria no entra aquí. El límite es de orden entre las " +
      "tareas: B y C no pueden empezar antes de que A termine."
  };

  function conectar(idOpciones, idVeredicto, razones) {
    var caja = document.getElementById(idVeredicto);
    document.querySelectorAll("#" + idOpciones + " button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        caja.className = "veredicto " + (op === "correcta" ? "bien" : "mal");
        caja.textContent = razones[op];
      });
    });
  }

  document.querySelectorAll("[data-proc]").forEach(function (b) {
    b.addEventListener("click", function () {
      procesadores = parseInt(b.dataset.proc, 10);
      pintar();
    });
  });
  document.getElementById("partible").addEventListener("change", function (e) {
    partible = e.target.checked;
    pintar();
  });
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);
  conectar("opciones-tope", "veredicto-tope", RAZONES);

  pintarTareas();
  pintar();
})();
