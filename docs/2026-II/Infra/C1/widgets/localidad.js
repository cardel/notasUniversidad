/* Localidad temporal y espacial sobre la misma matriz.
   La matriz se guarda por filas, un double ocupa 8 bytes y una linea de cache
   son 64, asi que cada linea trae 8 elementos consecutivos.

   Cada acceso se clasifica en tres:
     fallo     la linea no estaba en cache;
     espacial  la linea es la misma del acceso anterior, es decir el dato vino
               de vecino en la linea que se acababa de traer;
     temporal  la linea estaba en cache pero no es la del acceso anterior, o
               sea que se reuso algo cargado tiempo atras.
   Esa division es la que separa las dos localidades: la espacial aprovecha al
   vecino, la temporal aprovecha lo ya visitado.                           */
(function () {
  var POR_LINEA = 8;           // 64 bytes / 8 bytes por double

  var n = 8;
  var recorrido = "filas";
  var capacidad = 4;
  var pasadas = 1;
  var accesos = [];
  var k = 0;
  var cuenta = { fallo: 0, espacial: 0, temporal: 0 };
  var cache = [];              // numeros de linea, del mas viejo al mas reciente
  var anterior = null;         // linea del acceso previo
  var estadoCelda = [];
  var temporizador = null;

  function posicion(i, j, tam) { return i * tam + j; }
  function lineaDe(pos) { return Math.floor(pos / POR_LINEA); }

  /* Devuelve true si la linea no estaba, y deja la cache al dia. LRU: usar una
     linea la vuelve la mas reciente y la que sale es la mas vieja. */
  function acceder(numeroLinea) {
    var donde = cache.indexOf(numeroLinea);
    if (donde >= 0) {
      cache.splice(donde, 1);
      cache.push(numeroLinea);
      return false;
    }
    cache.push(numeroLinea);
    if (cache.length > capacidad) { cache.shift(); }
    return true;
  }

  function clasificar(numeroLinea) {
    var fallo = acceder(numeroLinea);
    var tipo = fallo ? "fallo" : (numeroLinea === anterior ? "espacial" : "temporal");
    anterior = numeroLinea;
    return tipo;
  }

  function orden(tam, rec, veces) {
    var lista = [];
    for (var v = 0; v < veces; v++) {
      if (rec === "filas") {
        for (var i = 0; i < tam; i++) {
          for (var j = 0; j < tam; j++) {
            lista.push({ i: i, j: j, pos: posicion(i, j, tam), pasada: v + 1 });
          }
        }
      } else {
        for (var c = 0; c < tam; c++) {
          for (var f = 0; f < tam; f++) {
            lista.push({ i: f, j: c, pos: posicion(f, c, tam), pasada: v + 1 });
          }
        }
      }
    }
    lista.forEach(function (a) { a.linea = lineaDe(a.pos); });
    return lista;
  }

  function construir() {
    accesos = orden(n, recorrido, pasadas);
    k = 0;
    cuenta = { fallo: 0, espacial: 0, temporal: 0 };
    cache = [];
    anterior = null;
    estadoCelda = [];
    for (var t = 0; t < n * n; t++) { estadoCelda.push(""); }
  }

  /* Recuenta una configuracion entera sin animarla. Guarda y repone el estado
     de la animacion, porque comparte la misma cache y el mismo `anterior`. */
  function contar(tam, rec) {
    var gCache = cache, gAnterior = anterior;
    cache = [];
    anterior = null;
    var res = { fallo: 0, espacial: 0, temporal: 0 };
    orden(tam, rec, pasadas).forEach(function (a) { res[clasificar(a.linea)] += 1; });
    cache = gCache;
    anterior = gAnterior;
    return res;
  }

  function pintarMatriz() {
    var html = '<div class="escalera">';
    for (var i = 0; i < n; i++) {
      html += '<div class="fila-esc"><span class="rotulo">fila ' + i + "</span>";
      for (var j = 0; j < n; j++) {
        var idx = posicion(i, j, n);
        var clases = "celda";
        if (estadoCelda[idx] === "espacial") { clases += " llena"; }
        if (estadoCelda[idx] === "fallo") { clases += " espejo"; }
        var extra = estadoCelda[idx] === "temporal"
          ? ";background:var(--verde);border:1px solid var(--verde)" : "";
        if (k > 0 && accesos[k - 1].pos === idx) { extra += ";outline:3px solid var(--azul)"; }
        var ancho = n > 12 ? 15 : 20;
        html += '<span class="' + clases + '" style="width:' + ancho +
                "px;height:" + ancho + "px" + extra + '"></span>';
      }
      html += "</div>";
    }
    document.getElementById("panel-matriz").innerHTML = html + "</div>";

    document.getElementById("chips").innerHTML =
      '<span class="chip cuenta">fallos <b>' + cuenta.fallo + "</b></span>" +
      '<span class="chip">espaciales <b>' + cuenta.espacial + "</b></span>" +
      '<span class="chip">temporales <b>' + cuenta.temporal + "</b></span>";
    document.getElementById("ver-paso").textContent = k;
    document.getElementById("ver-total").textContent = accesos.length;
    document.getElementById("ver-pasada").textContent =
      k > 0 ? accesos[k - 1].pasada : 1;

    var fichas = "";
    for (var c = 0; c < Math.min(capacidad, 24); c++) {
      var l = cache[c];
      fichas += '<span class="ficha' + (l === undefined ? " tachada" : "") + '">' +
                (l === undefined ? "—" : "L" + l) + "</span>";
    }
    if (capacidad > 24) { fichas += '<span class="flecha">…</span>'; }
    document.getElementById("panel-cache").innerHTML = fichas;
  }

  function barra(rotulo, valor, total, clase, texto) {
    var pct = total > 0 ? (100 * valor / total) : 0;
    return '<div class="barra-fila"><span class="rotulo">' + rotulo + "</span>" +
      '<span class="pista-barra"><span class="barra ' + clase +
      '" style="width:' + pct.toFixed(1) + '%"></span></span>' +
      '<span class="valor">' + texto + "</span></div>";
  }

  function pintarMedidas() {
    var r = contar(n, recorrido);
    var total = r.fallo + r.espacial + r.temporal;
    document.getElementById("panel-medidas").innerHTML =
      barra("Aciertos espaciales", r.espacial, total, "b1",
            r.espacial + " (" + (100 * r.espacial / total).toFixed(0) + " %)") +
      barra("Aciertos temporales", r.temporal, total, "b3",
            r.temporal + " (" + (100 * r.temporal / total).toFixed(0) + " %)") +
      barra("Fallos", r.fallo, total, "b2",
            r.fallo + " (" + (100 * r.fallo / total).toFixed(0) + " %)");

    var porLinea = r.fallo > 0 ? (total / r.fallo) : total;
    document.getElementById("caja-lectura").innerHTML =
      "Cada línea traída sirvió para <b>" + porLinea.toFixed(2).replace(".", ",") +
      "</b> accesos, de los 8 elementos que trae. " +
      (r.espacial > r.temporal
        ? "Aquí manda la localidad espacial: el recorrido consume los vecinos " +
          "de la línea recién traída."
        : (r.temporal > 0
          ? "Aquí manda la localidad temporal: la caché alcanza a guardar lo " +
            "que el recorrido va a volver a pedir."
          : "No hay ninguna de las dos: cada acceso pide una línea distinta y " +
            "la caché no alcanza a guardarla para cuando se vuelva a ella."));
  }

  function pintarTabla() {
    var html = "";
    [["filas", "por filas"], ["columnas", "por columnas"]].forEach(function (par) {
      var r = contar(n, par[0]);
      var total = r.fallo + r.espacial + r.temporal;
      var marca = par[0] === recorrido
        ? ' style="background:var(--azul-suave);font-weight:700"' : "";
      html += "<tr" + marca + "><td>" + par[1] + "</td><td>" + total +
        "</td><td>" + r.fallo + "</td><td>" + r.espacial + "</td><td>" +
        r.temporal + "</td></tr>";
    });
    document.getElementById("cuerpo-tabla").innerHTML = html;
  }

  function unPaso() {
    if (k >= accesos.length) { return; }
    var a = accesos[k];
    var tipo = clasificar(a.linea);
    cuenta[tipo] += 1;
    estadoCelda[a.pos] = tipo;
    k += 1;
    var explica = {
      fallo: "<b>Fallo</b>: la línea L" + a.linea + " no estaba en la caché.",
      espacial: "<b>Acierto espacial</b>: L" + a.linea + " es la misma línea " +
                "del acceso anterior; el dato llegó de vecino.",
      temporal: "<b>Acierto temporal</b>: L" + a.linea + " se trajo antes y " +
                "todavía sigue en la caché."
    };
    document.getElementById("nota-paso").innerHTML =
      "A[" + a.i + "][" + a.j + "] está en la posición " + a.pos + ", línea L" +
      a.linea + ". " + explica[tipo];
    pintarMatriz();
  }

  function alFinal() { while (k < accesos.length) { unPaso(); } }

  function reiniciar() {
    if (temporizador) { clearInterval(temporizador); temporizador = null; }
    construir();
    document.getElementById("ver-n").textContent = n;
    document.getElementById("ver-cache").textContent = capacidad;
    document.getElementById("ver-pasadas").textContent = pasadas;
    document.getElementById("veredicto").className = "veredicto";
    document.getElementById("nota-paso").innerHTML =
      "Azul: acierto espacial. Verde: acierto temporal. Ámbar: fallo.";
    pintarMatriz();
    pintarMedidas();
    pintarTabla();
  }

  function comprobar() {
    var caja = document.getElementById("veredicto");
    var v = parseInt(document.getElementById("prediccion").value, 10);
    var r = contar(n, recorrido);
    if (isNaN(v)) {
      caja.className = "veredicto mal";
      caja.textContent = "Escriba un número antes de comprobar.";
      return;
    }
    if (v === r.fallo) {
      caja.className = "veredicto bien";
      caja.textContent = "Correcto: " + r.fallo + " fallos, " + r.espacial +
        " aciertos espaciales y " + r.temporal + " temporales.";
    } else {
      caja.className = "veredicto mal";
      caja.innerHTML = "Son <b>" + r.fallo + "</b>, no " + v + ". " +
        (recorrido === "filas"
          ? "Por filas los elementos llegan seguidos: una línea trae 8 y los 7 " +
            "siguientes ya están, así que los fallos son uno por línea y por pasada, " +
            "salvo que la caché alcance a guardarlas de una pasada a la otra."
          : "Por columnas el salto entre un elemento y el siguiente es de n " +
            "posiciones. Si la caché no guarda las n líneas de la columna hasta " +
            "que empiece la siguiente, cada acceso vuelve a fallar.");
    }
  }

  var FILAS = {
    espacial: [true, "Sí. Cada línea trae 8 elementos y el recorrido los usa a " +
      "los 8 antes de pasar a la siguiente: 7 de cada 8 accesos son aciertos " +
      "espaciales. La caché de 4 líneas no alcanza a guardar la matriz, así que " +
      "de reuso posterior no hay nada: los aciertos temporales son cero."],
    temporal: [false, "Los aciertos temporales están en cero. Con una sola " +
      "pasada nunca se vuelve a un dato, y con 4 líneas de caché tampoco " +
      "quedaría sitio para guardarlo."],
    ambas: [false, "Solo una de las dos está trabajando. Mire los contadores: " +
      "los temporales quedan en cero."],
    ninguna: [false, "Con 4 líneas la caché guarda 32 de los 64 elementos, la " +
      "mitad. Lo que salva al recorrido no es el tamaño sino el orden."]
  };

  var COLUMNAS = {
    temporal: [true, "Eso es. El orden de los accesos no cambió y los aciertos " +
      "espaciales siguen en cero: ningún dato llega de vecino. Lo que cambió es " +
      "que ahora las 8 líneas de la matriz caben, así que cuando la segunda " +
      "columna vuelve a la línea 0 todavía está ahí."],
    espacial: [false, "Los aciertos espaciales siguen en cero. El recorrido " +
      "salta de n en n y nunca usa dos elementos de la misma línea seguidos; " +
      "eso no lo arregla agrandar la caché."],
    orden: [false, "El orden es exactamente el mismo: columna 0 completa, " +
      "después la 1. Lo único que se movió fue la capacidad."],
    nada: [false, "Es el efecto que se busca mostrar: una vez que el conjunto " +
      "de trabajo cabe, el reuso deja de costar. Es la razón por la que la " +
      "multiplicación de matrices se hace por bloques."]
  };

  function conectar(idCaja, idVista, tabla) {
    document.querySelectorAll("#" + idCaja + " button").forEach(function (b) {
      b.addEventListener("click", function () {
        var res = tabla[b.dataset.op];
        var vista = document.getElementById(idVista);
        vista.className = "veredicto " + (res[0] ? "bien" : "mal");
        vista.textContent = res[1];
      });
    });
  }

  document.getElementById("rango-n").addEventListener("input", function (e) {
    n = parseInt(e.target.value, 10);
    reiniciar();
  });
  document.getElementById("rango-cache").addEventListener("input", function (e) {
    capacidad = parseInt(e.target.value, 10);
    reiniciar();
  });
  document.getElementById("rango-pasadas").addEventListener("input", function (e) {
    pasadas = parseInt(e.target.value, 10);
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
  conectar("opciones-filas", "veredicto-filas", FILAS);
  conectar("opciones-columnas", "veredicto-columnas", COLUMNAS);

  reiniciar();
})();
