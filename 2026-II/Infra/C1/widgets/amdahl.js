/* Ley de Amdahl: speedup, eficiencia y el techo que impone la parte serial.
   El modelo es el del enunciado clasico: el trabajo total vale 1, una fraccion
   p se reparte entre n nucleos y el resto se queda como esta.            */
(function () {
  var p = 0.90;
  var n = 8;

  function num(x, d) {
    return x.toFixed(d).replace(".", ",");
  }

  function tiempo(pp, nn) {
    return (1 - pp) + pp / nn;
  }

  function speedup(pp, nn) {
    return 1 / tiempo(pp, nn);
  }

  function techo(pp) {
    return pp >= 1 ? Infinity : 1 / (1 - pp);
  }

  function barra(rotulo, serial, paralelo) {
    var ancho = 100;
    return '<div class="barra-fila">' +
      '<span class="rotulo">' + rotulo + '</span>' +
      '<span class="pista-barra" style="display:flex">' +
        '<span class="barra b1" style="width:' + (serial * ancho) + '%"></span>' +
        '<span class="barra b2" style="width:' + (paralelo * ancho) + '%"></span>' +
      '</span>' +
      '<span class="valor">' + num(serial + paralelo, 3) + '</span>' +
    '</div>';
  }

  function pintarBarras() {
    document.getElementById("panel-barras").innerHTML =
      barra("1 núcleo", 1 - p, p) +
      barra(n + (n === 1 ? " núcleo" : " núcleos"), 1 - p, p / n) +
      barra("infinitos", 1 - p, 0);
    document.getElementById("nota-n").textContent = n;
  }

  function pintarTabla() {
    var cuerpo = document.getElementById("cuerpo-tabla");
    var nucleos = [1, 2, 4, 8, 16, 32, 64];
    var html = "";
    nucleos.forEach(function (k, i) {
      var s = speedup(p, k);
      var previo = i === 0 ? null : speedup(p, nucleos[i - 1]);
      var ganancia = previo === null ? "—" : "× " + num(s / previo, 2);
      var marca = k === n ? ' style="background:var(--azul-suave);font-weight:700"' : "";
      html += "<tr" + marca + "><td>" + k + "</td><td>" + num(tiempo(p, k), 3) +
              "</td><td>" + num(s, 2) + "</td><td>" + num(100 * s / k, 1) +
              " %</td><td>" + ganancia + "</td></tr>";
    });
    var t = techo(p);
    html += '<tr><td>∞</td><td>' + num(1 - p, 3) + "</td><td>" +
            (isFinite(t) ? num(t, 2) : "∞") + "</td><td>0 %</td><td>—</td></tr>";
    cuerpo.innerHTML = html;

    var caja = document.getElementById("caja-techo");
    if (!isFinite(t)) {
      caja.innerHTML = "Con p = 1 no queda parte serial y el speedup crece sin " +
        "límite. Ese programa no existe: siempre hay algo que hacer una sola vez.";
    } else {
      caja.innerHTML = "Con p = " + num(p, 2) + " el techo es <b>" + num(t, 2) +
        "</b>. Con " + n + " núcleos ya va en " + num(speedup(p, n), 2) +
        ", es decir el " + num(100 * speedup(p, n) / t, 0) + " % de lo que " +
        "jamás podrá alcanzar.";
    }
  }

  function comprobar() {
    var caja = document.getElementById("veredicto");
    var v = parseFloat(document.getElementById("prediccion").value);
    var real = speedup(p, n);
    if (isNaN(v)) {
      caja.className = "veredicto mal";
      caja.textContent = "Escriba un número antes de comprobar.";
      return;
    }
    if (Math.abs(v - real) <= 0.05) {
      caja.className = "veredicto bien";
      caja.textContent = "Correcto: " + num(real, 2) + " veces más rápido. " +
        "El tiempo pasa de 1 a " + num(tiempo(p, n), 3) + ".";
    } else {
      caja.className = "veredicto mal";
      caja.innerHTML = "No es " + num(v, 2) + " sino <b>" + num(real, 2) +
        "</b>. El tiempo queda en (1 − " + num(p, 2) + ") + " + num(p, 2) +
        "/" + n + " = " + num(tiempo(p, n), 3) + ", y el speedup es 1 dividido " +
        "por eso." + (v > real ? " Cuidado: repartir la parte paralela no " +
        "toca la serial, que sigue costando " + num(1 - p, 2) + "." : "");
    }
  }

  var RAZONES = {
    correcta: [true, "El término p/n tiende a cero, así que el tiempo tiende a " +
      "(1 − p) y el speedup a 1/(1 − p). Con p = 0,90 el techo es 10."],
    np: [false, "n · p crece sin parar con n, y el speedup no: la parte serial " +
      "no se reparte y pone un tope."],
    unop: [false, "1/p va en el sentido contrario: con p grande daría un techo " +
      "pequeño, cuando es justo al revés."],
    infinito: [false, "Sí hay techo, y es lo que hace interesante a esta ley. " +
      "Mientras quede una parte serial, el tiempo nunca baja de ella."]
  };

  var INVERSA = {
    p90: [true, "1/(1 − 0,90) = 10. Justo alcanza, y solo con infinitos núcleos."],
    p50: [false, "1/(1 − 0,50) = 2. Ni con toda la máquina del mundo pasa de 2."],
    p95: [false, "1/(1 − 0,95) = 20. Alcanza de sobra, pero la pregunta pide el " +
      "mínimo que sirve."],
    p99: [false, "1/(1 − 0,99) = 100. Alcanza, y sobra mucho más todavía."]
  };

  function conectarOpciones(idCaja, idVeredicto, tabla) {
    var caja = document.getElementById(idCaja);
    var vista = document.getElementById(idVeredicto);
    caja.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        var r = tabla[b.dataset.op];
        vista.className = "veredicto " + (r[0] ? "bien" : "mal");
        vista.textContent = r[1];
      });
    });
  }

  function pintar() {
    document.getElementById("ver-p").textContent = num(p, 2);
    document.getElementById("ver-n").textContent = n;
    pintarBarras();
    pintarTabla();
  }

  document.getElementById("rango-p").addEventListener("input", function (e) {
    p = parseInt(e.target.value, 10) / 100;
    pintar();
  });
  document.getElementById("rango-n").addEventListener("input", function (e) {
    n = parseInt(e.target.value, 10);
    pintar();
  });
  document.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      p = parseInt(b.dataset.p, 10) / 100;
      document.getElementById("rango-p").value = b.dataset.p;
      pintar();
    });
  });
  document.querySelectorAll("[data-n]").forEach(function (b) {
    b.addEventListener("click", function () {
      n = parseInt(b.dataset.n, 10);
      document.getElementById("rango-n").value = b.dataset.n;
      pintar();
    });
  });
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);
  conectarOpciones("opciones-techo", "veredicto-techo", RAZONES);
  conectarOpciones("opciones-inversa", "veredicto-inversa", INVERSA);

  pintar();
})();
