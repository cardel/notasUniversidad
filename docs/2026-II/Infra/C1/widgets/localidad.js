/* Localidad de cache: la misma matriz recorrida por filas y por columnas.
   La matriz se guarda por filas, un double ocupa 8 bytes y una linea de cache
   son 64, asi que cada linea trae 8 elementos consecutivos.               */
(function () {
  var POR_LINEA = 8;           // 64 bytes / 8 bytes por double

  var n = 8;
  var recorrido = "filas";
  var capacidad = 4;           // cuantas lineas caben en la cache simulada
  var accesos = [];            // {i, j, pos, linea}
  var k = 0;
  var fallos = 0;
  var cache = [];              // numeros de linea residentes
  var estadoCelda = [];        // "" | "leido" | "fallo"
  var temporizador = null;

  function posicion(i, j) { return i * n + j; }
  function lineaDe(pos) { return Math.floor(pos / POR_LINEA); }

  /* Decide si el acceso a `numeroLinea` es un fallo y deja `cache` al dia.
     Devuelve true cuando la linea no estaba y hubo que traerla. */
  function acceder(numeroLinea) {
    var donde = cache.indexOf(numeroLinea);
    if (donde >= 0) {
      cache.splice(donde, 1);   // LRU: usarla la vuelve la mas reciente
      cache.push(numeroLinea);
      return false;
    }
    cache.push(numeroLinea);
    if (cache.length > capacidad) { cache.shift(); }
    return true;
  }

  function construir() {
    accesos = [];
    if (recorrido === "filas") {
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          accesos.push({ i: i, j: j, pos: posicion(i, j), linea: lineaDe(posicion(i, j)) });
        }
      }
    } else {
      for (var c = 0; c < n; c++) {
        for (var f = 0; f < n; f++) {
          accesos.push({ i: f, j: c, pos: posicion(f, c), linea: lineaDe(posicion(f, c)) });
        }
      }
    }
    k = 0;
    fallos = 0;
    cache = [];
    estadoCelda = [];
    for (var t = 0; t < n * n; t++) { estadoCelda.push(""); }
  }

  /* Recuenta una configuracion entera sin animarla, con su propia cache. */
  function contar(nn, rec) {
    var guardaN = n, guardaCache = cache, guardaRec = recorrido;
    n = nn; recorrido = rec; cache = [];
    var lista = [];
    if (rec === "filas") {
      for (var i = 0; i < nn; i++) {
        for (var j = 0; j < nn; j++) { lista.push(lineaDe(i * nn + j)); }
      }
    } else {
      for (var c = 0; c < nn; c++) {
        for (var f = 0; f < nn; f++) { lista.push(lineaDe(f * nn + c)); }
      }
    }
    var total = 0;
    lista.forEach(function (l) { if (acceder(l)) { total += 1; } });
    n = guardaN; cache = guardaCache; recorrido = guardaRec;
    return total;
  }

  function pintarMatriz() {
    var html = '<div class="escalera">';
    for (var i = 0; i < n; i++) {
      html += '<div class="fila-esc"><span class="rotulo">fila ' + i + "</span>";
      for (var j = 0; j < n; j++) {
        var idx = posicion(i, j);
        var clases = "celda";
        if (estadoCelda[idx] === "leido") { clases += " llena"; }
        if (estadoCelda[idx] === "fallo") { clases += " espejo"; }
        var borde = (k > 0 && accesos[k - 1].pos === idx)
          ? ";outline:3px solid var(--azul)" : "";
        var ancho = n > 12 ? 15 : 20;
        html += '<span class="' + clases + '" style="width:' + ancho +
                "px;height:" + ancho + "px" + borde + '"></span>';
      }
      html += "</div>";
    }
    html += "</div>";
    document.getElementById("panel-matriz").innerHTML = html;

    var aciertos = k - fallos;
    document.getElementById("chips").innerHTML =
      '<span class="chip">accesos <b>' + k + "</b></span>" +
      '<span class="chip cuenta">fallos <b>' + fallos + "</b></span>" +
      '<span class="chip">aciertos <b>' + aciertos + "</b></span>";
    document.getElementById("ver-paso").textContent = k;
    document.getElementById("ver-total").textContent = accesos.length;

    var fichas = "";
    for (var c = 0; c < capacidad; c++) {
      var l = cache[c];
      fichas += '<span class="ficha' + (l === undefined ? " tachada" : "") + '">' +
                (l === undefined ? "—" : "L" + l) + "</span>";
    }
    document.getElementById("panel-cache").innerHTML = fichas;
  }

  function pintarTabla() {
    var html = "";
    [4, 8, 12, 16].forEach(function (nn) {
      var f = contar(nn, "filas");
      var c = contar(nn, "columnas");
      var marca = nn === n ? ' style="background:var(--azul-suave);font-weight:700"' : "";
      html += "<tr" + marca + "><td>" + nn + "</td><td>" + (nn * nn) +
              "</td><td>" + f + "</td><td>" + c + "</td><td>" +
              (f > 0 ? (c / f).toFixed(2).replace(".", ",") + " ×" : "—") +
              "</td></tr>";
    });
    document.getElementById("cuerpo-tabla").innerHTML = html;
    var ff = contar(n, "filas"), cc = contar(n, "columnas");
    document.getElementById("caja-lectura").innerHTML =
      "Con n = " + n + " y " + capacidad + " líneas de caché: " + ff +
      " fallos por filas y " + cc + " por columnas, sobre los mismos " +
      (n * n) + " accesos. Mueva la capacidad de la caché y mire cuándo " +
      "la diferencia se borra.";
  }

  function unPaso() {
    if (k >= accesos.length) { return; }
    var a = accesos[k];
    var fallo = acceder(a.linea);
    if (fallo) { fallos += 1; }
    estadoCelda[a.pos] = fallo ? "fallo" : "leido";
    k += 1;
    document.getElementById("nota-paso").innerHTML =
      "A[" + a.i + "][" + a.j + "] está en la posición " + a.pos +
      ", que cae en la línea L" + a.linea + ". " +
      (fallo ? "<b>Fallo</b>: hubo que traerla." : "Acierto: ya estaba.");
    pintarMatriz();
  }

  function alFinal() { while (k < accesos.length) { unPaso(); } }

  function reiniciar() {
    if (temporizador) { clearInterval(temporizador); temporizador = null; }
    construir();
    document.getElementById("ver-n").textContent = n;
    document.getElementById("ver-n2").textContent = n * n;
    document.getElementById("ver-cache").textContent = capacidad;
    document.getElementById("veredicto").className = "veredicto";
    document.getElementById("nota-paso").innerHTML =
      "Azul: leído con acierto. Ámbar: el acceso que provocó un fallo.";
    pintarMatriz();
    pintarTabla();
  }

  function comprobar() {
    var caja = document.getElementById("veredicto");
    var v = parseInt(document.getElementById("prediccion").value, 10);
    var real = contar(n, recorrido);
    if (isNaN(v)) {
      caja.className = "veredicto mal";
      caja.textContent = "Escriba un número antes de comprobar.";
      return;
    }
    if (v === real) {
      caja.className = "veredicto bien";
      caja.textContent = "Correcto: " + real + " fallos sobre " + (n * n) +
        " accesos.";
    } else {
      caja.className = "veredicto mal";
      caja.innerHTML = "Son <b>" + real + "</b>, no " + v + ". " +
        (recorrido === "filas"
          ? "Por filas los elementos llegan seguidos: una línea trae 8 y los 7 " +
            "siguientes ya están."
          : "Por columnas el salto entre un elemento y el siguiente es de n " +
            "posiciones, así que cada acceso cae en una línea distinta.");
    }
  }

  var SALTO = {
    n: [true, "Sí: A[i][j] está en la posición i·n + j, y A[i+1][j] en " +
      "(i+1)·n + j. La diferencia es n. Si n es 8 o más, cada elemento de la " +
      "columna cae en una línea distinta y la línea traída se aprovecha en un " +
      "solo elemento de los ocho."],
    uno: [false, "Uno es el salto del recorrido por filas, que es justamente el " +
      "que aprovecha la línea completa."],
    ocho: [false, "Ocho es lo que cabe en una línea, no el salto. El salto " +
      "depende de n, y por eso el problema empeora con matrices grandes."],
    n2: [false, "n² es el tamaño de la matriz entera. Entre dos elementos " +
      "consecutivos de una columna solo hay una fila de por medio."]
  };

  document.getElementById("rango-n").addEventListener("input", function (e) {
    n = parseInt(e.target.value, 10);
    reiniciar();
  });
  document.getElementById("rango-cache").addEventListener("input", function (e) {
    capacidad = parseInt(e.target.value, 10);
    reiniciar();
  });
  document.querySelectorAll("[data-n]").forEach(function (b) {
    b.addEventListener("click", function () {
      n = parseInt(b.dataset.n, 10);
      document.getElementById("rango-n").value = b.dataset.n;
      reiniciar();
    });
  });
  document.querySelectorAll("[data-rec]").forEach(function (b) {
    b.addEventListener("click", function () {
      recorrido = b.dataset.rec;
      document.querySelectorAll("[data-rec]").forEach(function (o) {
        o.className = (o === b) ? "primario" : "";
      });
      reiniciar();
    });
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
      if (k >= accesos.length) {
        clearInterval(temporizador);
        temporizador = null;
      } else {
        unPaso();
      }
    }, 60);
  });
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);
  document.querySelectorAll("#opciones-salto button").forEach(function (b) {
    b.addEventListener("click", function () {
      var res = SALTO[b.dataset.op];
      var vista = document.getElementById("veredicto-salto");
      vista.className = "veredicto " + (res[0] ? "bien" : "mal");
      vista.textContent = res[1];
    });
  });

  reiniciar();
})();
