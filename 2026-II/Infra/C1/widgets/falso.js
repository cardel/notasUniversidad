/* False sharing: cuatro hilos escriben en su propia posicion y aun asi la
   linea de cache viaja entre nucleos. El modelo cuenta un viaje cada vez que
   un nucleo escribe en una linea que no es suya, que es lo que el protocolo
   de coherencia paga de verdad.                                          */
(function () {
  var LONGS_POR_LINEA = 8;     // 64 bytes / 8 bytes por long
  var LINEAS = 4;
  var HILOS = 4;
  var COLORES = ["b1", "b2", "b3", "b1"];

  var relleno = false;
  var orden = "inter";
  var r = 5;
  var escrituras = [];
  var k = 0;
  var duenos = [];             // dueno actual de cada linea, -1 si nadie
  var viajes = 0;
  var temporizador = null;

  /* Posicion del acumulador de cada hilo, en numero de long desde el inicio.
     Sin relleno van pegados y caen los cuatro en la linea 0; con relleno cada
     uno arranca en una linea propia. */
  function ranura(hilo) {
    return relleno ? hilo * LONGS_POR_LINEA : hilo;
  }

  function linea(hilo) {
    return Math.floor(ranura(hilo) / LONGS_POR_LINEA);
  }

  function construir() {
    escrituras = [];
    if (orden === "inter") {
      for (var v = 0; v < r; v++) {
        for (var h = 0; h < HILOS; h++) { escrituras.push(h); }
      }
    } else {
      for (var h2 = 0; h2 < HILOS; h2++) {
        for (var v2 = 0; v2 < r; v2++) { escrituras.push(h2); }
      }
    }
    k = 0;
    viajes = 0;
    duenos = [];
    for (var i = 0; i < LINEAS; i++) { duenos.push(-1); }
  }

  /* Cuenta los viajes de una configuracion completa, sin animarla. */
  function contar(conRelleno, conOrden) {
    var d = [-1, -1, -1, -1];
    var total = 0;
    var lista = [];
    if (conOrden === "inter") {
      for (var v = 0; v < r; v++) {
        for (var h = 0; h < HILOS; h++) { lista.push(h); }
      }
    } else {
      for (var h2 = 0; h2 < HILOS; h2++) {
        for (var v2 = 0; v2 < r; v2++) { lista.push(h2); }
      }
    }
    lista.forEach(function (h) {
      var l = conRelleno ? h : 0;
      if (d[l] !== h) { total += 1; d[l] = h; }
    });
    return total;
  }

  function pintarMemoria() {
    var panel = document.getElementById("panel-memoria");
    var html = "";
    for (var l = 0; l < LINEAS; l++) {
      html += '<div class="fila-esc"><span class="rotulo">línea ' + l + '</span>';
      for (var c = 0; c < LONGS_POR_LINEA; c++) {
        var pos = l * LONGS_POR_LINEA + c;
        var hilo = -1;
        for (var h = 0; h < HILOS; h++) { if (ranura(h) === pos) { hilo = h; } }
        var clases = "caja";
        var texto = "";
        if (hilo >= 0) {
          texto = "s" + hilo;
          clases += " positivo";
          if (k > 0 && escrituras[k - 1] === hilo) { clases += " actual"; }
        }
        if (duenos[l] >= 0) { clases += " visitada"; }
        html += '<span class="' + clases + '" style="width:38px;height:34px;' +
                'font-size:0.8rem;cursor:default">' + texto + "</span>";
      }
      html += '<span class="rotulo" style="width:auto;margin-left:0.6rem">' +
              (duenos[l] >= 0 ? "la tiene el hilo " + duenos[l] : "en memoria") +
              "</span></div>";
    }
    panel.innerHTML = '<div class="escalera">' + html + "</div>";

    var chips = "";
    for (var t = 0; t < HILOS; t++) {
      var mia = duenos[linea(t)] === t;
      chips += '<span class="chip' + (mia ? " cuenta" : "") + '">hilo ' + t +
               " → línea " + linea(t) + " <b>" + (mia ? "suya" : "ajena") +
               "</b></span>";
    }
    document.getElementById("chips-nucleos").innerHTML = chips;
    document.getElementById("ver-paso").textContent = k;
    document.getElementById("ver-total").textContent = escrituras.length;
    document.getElementById("ver-viajes").textContent = viajes;
  }

  function pintarTabla() {
    var filas = [[false, "inter"], [false, "bloque"], [true, "inter"], [true, "bloque"]];
    var html = "";
    filas.forEach(function (f) {
      var total = contar(f[0], f[1]);
      var marca = (f[0] === relleno && f[1] === orden)
        ? ' style="background:var(--azul-suave);font-weight:700"' : "";
      html += "<tr" + marca + "><td>" + (f[0] ? "con relleno" : "sin relleno") +
        "</td><td>" + (f[1] === "inter" ? "intercaladas" : "por bloques") +
        "</td><td>" + total + "</td><td>" +
        (total / (r * HILOS)).toFixed(2).replace(".", ",") + "</td></tr>";
    });
    document.getElementById("cuerpo-tabla").innerHTML = html;
    document.getElementById("caja-lectura").innerHTML =
      "Sin relleno e intercaladas, la línea viaja en <b>cada</b> escritura: " +
      contar(false, "inter") + " de " + (r * HILOS) + ". Con relleno bastan " +
      contar(true, "inter") + ", una por hilo, y son las de traerla de memoria " +
      "la primera vez.";
  }

  function unPaso() {
    if (k >= escrituras.length) { return; }
    var hilo = escrituras[k];
    var l = linea(hilo);
    if (duenos[l] !== hilo) {
      viajes += 1;
      duenos[l] = hilo;
      document.getElementById("nota-paso").innerHTML =
        "El hilo " + hilo + " escribe en <code>s" + hilo + "</code>. La línea " +
        l + " no era suya: hay que traérsela e invalidar la copia del otro " +
        "núcleo. <b>Viaje número " + viajes + "</b>.";
    } else {
      document.getElementById("nota-paso").innerHTML =
        "El hilo " + hilo + " escribe en <code>s" + hilo + "</code>. Ya tenía " +
        "la línea " + l + ": la escritura no sale del núcleo y no cuesta nada.";
    }
    k += 1;
    pintarMemoria();
  }

  function alFinal() {
    while (k < escrituras.length) { unPaso(); }
  }

  function reiniciar() {
    if (temporizador) { clearInterval(temporizador); temporizador = null; }
    construir();
    document.getElementById("nota-paso").innerHTML =
      "Cada celda es un <code>long</code> de 8 bytes. Una fila es una línea de caché.";
    document.getElementById("veredicto").className = "veredicto";
    pintarMemoria();
    pintarTabla();
  }

  function comprobar() {
    var caja = document.getElementById("veredicto");
    var v = parseInt(document.getElementById("prediccion").value, 10);
    var real = contar(relleno, orden);
    if (isNaN(v)) {
      caja.className = "veredicto mal";
      caja.textContent = "Escriba un número antes de comprobar.";
      return;
    }
    if (v === real) {
      caja.className = "veredicto bien";
      caja.textContent = "Correcto: " + real + " viajes sobre " +
        (r * HILOS) + " escrituras.";
    } else {
      caja.className = "veredicto mal";
      caja.innerHTML = "Son <b>" + real + "</b>, no " + v + ". " +
        (relleno
          ? "Con relleno cada hilo tiene su línea: la pide una vez y después " +
            "escribe sin molestar a nadie."
          : (orden === "inter"
            ? "Sin relleno los cuatro comparten la línea 0, y como se turnan, " +
              "cada escritura se la quita al que la tenía."
            : "Sin relleno comparten la línea, pero cada hilo hace todas sus " +
              "escrituras seguidas: solo paga la primera."));
    }
  }

  var LECTURA = {
    concurrencia: [true, "Eso es. Compartir la línea es condición necesaria, no " +
      "suficiente: lo que cuesta es que dos núcleos se turnen para escribirla. " +
      "Por eso acumular en una variable local y escribir una sola vez al final " +
      "arregla el problema sin tocar la disposición en memoria."],
    siempre: [false, "La tabla dice que no: sin relleno y por bloques cuestan " +
      "los mismos viajes que con relleno. Falta que las escrituras se " +
      "intercalen."],
    carrera: [false, "No hay carrera: cada hilo escribe en su propia posición y " +
      "el resultado es correcto siempre. El problema es de rendimiento, no de " +
      "corrección, y por eso no lo detecta un depurador de concurrencia."],
    relleno: [false, "El relleno funciona, pero no es la única salida. Acumular " +
      "en una variable local y escribir una vez al final elimina el " +
      "intercalado, que es la causa real."]
  };

  document.querySelectorAll("[data-pad]").forEach(function (b) {
    b.addEventListener("click", function () {
      relleno = b.dataset.pad === "1";
      document.querySelectorAll("[data-pad]").forEach(function (o) {
        o.className = (o === b) ? "primario" : "";
      });
      reiniciar();
    });
  });
  document.querySelectorAll("[data-orden]").forEach(function (b) {
    b.addEventListener("click", function () {
      orden = b.dataset.orden;
      document.querySelectorAll("[data-orden]").forEach(function (o) {
        o.className = (o === b) ? "primario" : "";
      });
      reiniciar();
    });
  });
  document.getElementById("rango-r").addEventListener("input", function (e) {
    r = parseInt(e.target.value, 10);
    document.getElementById("ver-r").textContent = r;
    reiniciar();
  });
  document.getElementById("btn-paso").addEventListener("click", unPaso);
  document.getElementById("btn-fin").addEventListener("click", alFinal);
  document.getElementById("btn-reiniciar").addEventListener("click", reiniciar);
  document.getElementById("btn-auto").addEventListener("click", function () {
    if (temporizador) {
      clearInterval(temporizador);
      temporizador = null;
      return;
    }
    temporizador = setInterval(function () {
      if (k >= escrituras.length) {
        clearInterval(temporizador);
        temporizador = null;
      } else {
        unPaso();
      }
    }, 450);
  });
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);
  document.querySelectorAll("#opciones-lectura button").forEach(function (b) {
    b.addEventListener("click", function () {
      var res = LECTURA[b.dataset.op];
      var vista = document.getElementById("veredicto-lectura");
      vista.className = "veredicto " + (res[0] ? "bien" : "mal");
      vista.textContent = res[1];
    });
  });

  reiniciar();
})();
