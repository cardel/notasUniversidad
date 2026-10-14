/* mapFilter: map y filter sobre la misma lista. Las dos implementaciones
   simplificadas son las de los frames Transformando listas: map, Cómo funciona
   map por dentro, Filtrando listas: filter y Cómo funciona filter por dentro
   del deck ListasParte2. Las lambdas x => x * 2, x => x * x y
   x => x % 2 == 0 y las listas List(1,2,3,4), List(1,2,3) y
   List(2,4,7,3,8,1) también salen de esos frames y del de variaciones.
   Valores: map(x => x * 2) sobre List(1,2,3,4) da List(2,4,6,8) y
   filter(x => x % 2 == 0) sobre la misma lista da List(2,4). */
(function () {

  /* ── Las funciones que se le pasan a map ───────────────────────── */

  var FUNCIONES = {
    doble: {
      txt: "x => x * 2",
      aplicar: function (x) { return x * 2; },
      cuenta: function (x) { return x + " * 2"; }
    },
    cuadrado: {
      txt: "x => x * x",
      aplicar: function (x) { return x * x; },
      cuenta: function (x) { return x + " * " + x; }
    }
  };

  /* ── Los predicados que se le pasan a filter ────────────────────── */

  var PREDICADOS = {
    par: {
      txt: "x => x % 2 == 0",
      cumple: function (x) { return x % 2 === 0; },
      cuenta: function (x) { return x + " % 2 == 0"; }
    }
  };

  function textoLista(xs) {
    return xs.length === 0 ? "List()" : "List(" + xs.join(", ") + ")";
  }

  /* ── Las cuatro rondas ──────────────────────────────────────────── */

  var RONDAS = [
    { id: "r1", lista: [1, 2, 3, 4], mapa: "doble", filtro: "par" },
    { id: "r2", lista: [2, 4, 7, 3, 8, 1], mapa: "cuadrado", filtro: "par" },
    { id: "r3", lista: [1, 2, 3], mapa: "doble", filtro: "par" },
    { id: "r4", lista: [], mapa: "doble", filtro: "par" }
  ];

  function buscarRonda(id) {
    var hallada = null;
    RONDAS.forEach(function (r) { if (r.id === id) { hallada = r; } });
    return hallada;
  }

  function entradaDe(r) {
    return r.lista.length === 0 ? "List[Int]()" : textoLista(r.lista);
  }

  function llamadaMap(r) {
    return entradaDe(r) + ".map(" + FUNCIONES[r.mapa].txt + ")";
  }

  function llamadaFiltro(r) {
    return entradaDe(r) + ".filter(" + PREDICADOS[r.filtro].txt + ")";
  }

  /* ── Las dos funciones aplicadas, siguiendo el cuerpo del deck ──── */

  function aplicarMap(xs, f) {
    if (xs.length === 0) { return []; }
    return [f.aplicar(xs[0])].concat(aplicarMap(xs.slice(1), f));
  }

  function aplicarFiltro(xs, p) {
    if (xs.length === 0) { return []; }
    if (p.cumple(xs[0])) { return [xs[0]].concat(aplicarFiltro(xs.slice(1), p)); }
    return aplicarFiltro(xs.slice(1), p);
  }

  function salidaMap(r) { return aplicarMap(r.lista, FUNCIONES[r.mapa]); }
  function salidaFiltro(r) { return aplicarFiltro(r.lista, PREDICADOS[r.filtro]); }

  /* ── El panel de código ─────────────────────────────────────────── */

  var CODIGO = [
    { num: null, txt: "def map[U](f: T => U): List[U] = this match {" },
    { num: 2, txt: "  case Nil     => Nil", bloque: 1 },
    { num: 3, txt: "  case x :: xs => f(x) :: xs.map(f)", bloque: 1 },
    { num: null, txt: "}" },
    { num: null, txt: "" },
    { num: null, txt: "def filter(p: T => Boolean): List[T] = this match {" },
    { num: 7, txt: "  case Nil     => Nil", bloque: 2 },
    { num: null, txt: "  case x :: xs =>" },
    { num: 9, txt: "    if (p(x)) x :: xs.filter(p)", bloque: 2 },
    { num: 10, txt: "    else xs.filter(p)", bloque: 3 },
    { num: null, txt: "}" }
  ];

  /* ── La simulación: primero la pasada de map, despues la de filter ─ */

  function simular(idRonda) {
    var r = buscarRonda(idRonda);
    var f = FUNCIONES[r.mapa];
    var p = PREDICADOS[r.filtro];
    var pasos = [];
    var salida = [];
    var consumidos = 0;

    function anotar(linea, extra) {
      var paso = {
        linea: linea, fase: null, x: null, evalua: null, pasa: null,
        salida: textoLista(salida), largo: salida.length,
        consumidos: consumidos, resto: null
      };
      Object.keys(extra || {}).forEach(function (k) { paso[k] = extra[k]; });
      pasos.push(paso);
    }

    function pasarMap(xs) {
      var x, y;
      if (xs.length === 0) {
        anotar(2, { fase: "map", resto: "Nil", evalua: "Nil => Nil" });
        return;
      }
      x = xs[0];
      y = f.aplicar(x);
      salida.push(y);
      consumidos = consumidos + 1;
      anotar(3, {
        fase: "map", x: x, pasa: true,
        evalua: "f(" + x + ") = " + f.cuenta(x) + " = " + y,
        resto: textoLista(xs.slice(1))
      });
      pasarMap(xs.slice(1));
    }

    function pasarFiltro(xs) {
      var x, ok;
      if (xs.length === 0) {
        anotar(7, { fase: "filter", resto: "Nil", evalua: "Nil => Nil" });
        return;
      }
      x = xs[0];
      ok = p.cumple(x);
      if (ok) { salida.push(x); }
      consumidos = consumidos + 1;
      anotar(ok ? 9 : 10, {
        fase: "filter", x: x, pasa: ok,
        evalua: "p(" + x + "): " + p.cuenta(x) + " es " + (ok ? "true" : "false"),
        resto: textoLista(xs.slice(1))
      });
      pasarFiltro(xs.slice(1));
    }

    pasarMap(r.lista);
    salida = [];
    consumidos = 0;
    pasarFiltro(r.lista);
    return pasos;
  }

  /* ── Lectura de la lista que escribe el estudiante ───────────────── */

  function enterosDe(texto) {
    var hallados = String(texto).match(/-?\d+/g);
    return hallados === null ? [] : hallados.map(Number);
  }

  function escribioAlgo(texto) { return String(texto).trim() !== ""; }

  function mismaLista(a, b) {
    return a.length === b.length && a.join(",") === b.join(",");
  }

  function mismosElementos(a, b) {
    var x = a.slice().sort(function (m, n) { return m - n; });
    var y = b.slice().sort(function (m, n) { return m - n; });
    return x.join(",") === y.join(",");
  }

  /* El veredicto de la predicción de map. */
  function revisarMap(idRonda, texto) {
    var r = buscarRonda(idRonda);
    var buena = salidaMap(r);
    var dados = enterosDe(texto);
    var descartados = salidaFiltro(r);

    if (!escribioAlgo(texto)) {
      return { ok: false, msg: "Escriba la lista que devuelve map." };
    }
    if (/true|false/i.test(texto)) {
      return { ok: false, msg: "true y false saldrían de map con el predicado, " +
        "List(1,2,3,4).map(x => x % 2 == 0), que devuelve List[Boolean]. Aquí la " +
        "función que recibe map es " + FUNCIONES[r.mapa].txt + "." };
    }
    if (mismaLista(dados, buena) && r.lista.length === 0) {
      return { ok: true, msg: "Eso es: List(). El primer caso de map es " +
        "case Nil => Nil, y con la lista vacía ese es el único que corre." };
    }
    if (mismaLista(dados, buena)) {
      return { ok: true, msg: "Eso es: " + textoLista(buena) + ". map aplica " +
        FUNCIONES[r.mapa].txt + " a cada elemento y deja la lista con el mismo " +
        "número de elementos que la de entrada." };
    }
    if (mismaLista(dados, descartados)) {
      return { ok: false, msg: "Esa es la respuesta de filter: los elementos que " +
        "cumplen el predicado, sin tocarlos. map no descarta ninguno, aplica " +
        FUNCIONES[r.mapa].txt + " a los " + r.lista.length + "." };
    }
    if (mismaLista(dados, r.lista)) {
      return { ok: false, msg: "Esa es la lista de entrada. El cuerpo del caso " +
        "pone f(x) al frente, no x: lo que sale es " + FUNCIONES[r.mapa].txt +
        " evaluado en cada elemento." };
    }
    if (dados.length !== buena.length) {
      return { ok: false, msg: "map pone un elemento de salida por cada elemento " +
        "de entrada, así que la lista lleva " + buena.length + ". El caso " +
        "x :: xs construye f(x) :: xs.map(f) y no deja ninguno por fuera." };
    }
    if (mismosElementos(dados, buena)) {
      return { ok: false, msg: "Están los valores, en otro orden. f(x) queda al " +
        "frente de lo que devuelve xs.map(f), así que cada posición de la salida " +
        "corresponde a la misma posición de la entrada." };
    }
    return { ok: false, msg: "Revise elemento por elemento: la posición i de la " +
      "salida es " + FUNCIONES[r.mapa].txt + " evaluado en la posición i de la entrada." };
  }

  /* El veredicto de la predicción de filter. */
  function revisarFiltro(idRonda, texto) {
    var r = buscarRonda(idRonda);
    var buena = salidaFiltro(r);
    var dados = enterosDe(texto);
    var p = PREDICADOS[r.filtro];
    var noCumplen = r.lista.filter(function (x) { return !p.cumple(x); });
    var transformados = salidaMap(r);

    if (!escribioAlgo(texto)) {
      return { ok: false, msg: "Escriba la lista que devuelve filter." };
    }
    if (/true|false/i.test(texto)) {
      return { ok: false, msg: "filter usa el predicado para decidir y devuelve " +
        "List[T], los elementos mismos. Los true y false son lo que responde p(x) " +
        "en cada paso, no lo que queda en la lista." };
    }
    if (mismaLista(dados, buena) && r.lista.length === 0) {
      return { ok: true, msg: "Eso es: List(). El predicado no se evalúa ni una vez: " +
        "filter entra por case Nil => Nil y devuelve Nil." };
    }
    if (mismaLista(dados, buena)) {
      return { ok: true, msg: "Eso es: " + textoLista(buena) + ". De los " +
        r.lista.length + " elementos de la entrada pasaron " + buena.length +
        ", y los que pasaron salen tal como entraron." };
    }
    if (mismaLista(dados, transformados)) {
      return { ok: false, msg: "Esos son los valores transformados, que es lo que " +
        "hace map. filter no cambia ningún elemento: el caso x :: xs escribe " +
        "x :: xs.filter(p), con la x que recibió." };
    }
    if (mismaLista(dados, noCumplen)) {
      return { ok: false, msg: "Esos son los que no cumplen el predicado, que es " +
        "lo que devuelve xs.filterNot(p). filter conserva los que lo cumplen, los " +
        "que entran por la rama if (p(x))." };
    }
    if (mismaLista(dados, r.lista)) {
      return { ok: false, msg: "Esa es la lista completa. La rama else descarta: " +
        "cuando p(x) responde false el cuerpo devuelve xs.filter(p) y la x no " +
        "aparece en la salida." };
    }
    return { ok: false, msg: "Recorra la entrada y pregunte " + p.txt + " en cada " +
      "elemento: los que responden true salen en el mismo orden, los demás no salen." };
  }

  function resumenLargos() {
    return RONDAS.map(function (r) {
      return {
        id: r.id, entrada: r.lista.length,
        conMap: salidaMap(r).length, conFiltro: salidaFiltro(r).length
      };
    });
  }

  var API = {
    FUNCIONES: FUNCIONES, PREDICADOS: PREDICADOS, RONDAS: RONDAS, CODIGO: CODIGO,
    buscarRonda: buscarRonda, entradaDe: entradaDe,
    llamadaMap: llamadaMap, llamadaFiltro: llamadaFiltro,
    aplicarMap: aplicarMap, aplicarFiltro: aplicarFiltro,
    salidaMap: salidaMap, salidaFiltro: salidaFiltro,
    simular: simular, textoLista: textoLista, enterosDe: enterosDe,
    revisarMap: revisarMap, revisarFiltro: revisarFiltro, resumenLargos: resumenLargos
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ════════════════ la pagina ════════════════ */

  var resueltas = {};
  var rondaEnPanel = RONDAS[0].id;

  function panelListas(e) {
    var r = buscarRonda(rondaEnPanel);
    var fase = e.actual === null ? "map" : e.actual.fase;
    var cajaEntrada = document.getElementById("fila-entrada");
    var cajaSalida = document.getElementById("fila-salida");
    var vistos = e.actual === null ? 0 : e.actual.consumidos;
    var salida = e.actual === null ? "List()" : e.actual.salida;

    cajaEntrada.innerHTML = "";
    r.lista.forEach(function (v, i) {
      var caja = document.createElement("div");
      caja.className = "caja";
      caja.textContent = String(v);
      if (i < vistos - 1) { caja.className = "caja visitada"; }
      if (i === vistos - 1) { caja.className = "caja visitada actual"; }
      if (fase === "filter" && i <= vistos - 1) {
        caja.className = caja.className + " " +
          (PREDICADOS[r.filtro].cumple(v) ? "positivo" : "negativo");
      }
      cajaEntrada.appendChild(caja);
    });
    if (r.lista.length === 0) {
      cajaEntrada.appendChild(document.createTextNode("List() no tiene elementos"));
    }
    cajaSalida.textContent = salida;
    document.getElementById("rotulo-fase").textContent =
      fase === "map" ? "pasada de map con " + FUNCIONES[r.mapa].txt
        : "pasada de filter con " + PREDICADOS[r.filtro].txt;
  }

  function construirRondas() {
    var caja = document.getElementById("rondas");
    RONDAS.forEach(function (r, i) {
      var bloque = document.createElement("div");
      var h = document.createElement("h3");
      bloque.className = "ronda";
      bloque.id = "ronda-" + r.id;
      h.textContent = (i + 1) + ". " + entradaDe(r) + " con " +
        FUNCIONES[r.mapa].txt + " y " + PREDICADOS[r.filtro].txt;
      bloque.appendChild(h);

      [["map", llamadaMap(r)], ["filtro", llamadaFiltro(r)]].forEach(function (par) {
        var fila = document.createElement("div");
        var rot = document.createElement("span");
        var ent = document.createElement("input");
        fila.className = "fila-pred";
        rot.className = "llamada";
        rot.textContent = par[1] + "  =";
        ent.type = "text";
        ent.className = "lista";
        ent.id = "pred-" + r.id + "-" + par[0];
        ent.placeholder = "List(...)";
        ent.autocomplete = "off";
        ent.spellcheck = false;
        fila.appendChild(rot);
        fila.appendChild(ent);
        bloque.appendChild(fila);
      });

      var boton = document.createElement("button");
      boton.className = "primario";
      boton.textContent = "Comprobar";
      boton.setAttribute("data-ronda", r.id);
      bloque.appendChild(boton);

      ["map", "filtro"].forEach(function (cual) {
        var v = document.createElement("div");
        v.className = "veredicto";
        v.id = "ver-" + r.id + "-" + cual;
        bloque.appendChild(v);
      });

      caja.appendChild(bloque);
    });
  }

  function contar() {
    var n = 0;
    RONDAS.forEach(function (r) { if (resueltas[r.id]) { n = n + 1; } });
    return n;
  }

  function construirPresets() {
    var caja = document.getElementById("presets");
    RONDAS.forEach(function (r, i) {
      var b = document.createElement("button");
      b.textContent = (i + 1) + ". " + entradaDe(r);
      b.setAttribute("data-preset", r.id);
      caja.appendChild(b);
    });
  }

  function marcarPreset(id) {
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.className = b.getAttribute("data-preset") === id ? "primario" : "";
    });
  }

  function comprobar(id) {
    var resMap = revisarMap(id, document.getElementById("pred-" + id + "-map").value);
    var resFil = revisarFiltro(id, document.getElementById("pred-" + id + "-filtro").value);
    var vMap = document.getElementById("ver-" + id + "-map");
    var vFil = document.getElementById("ver-" + id + "-filtro");

    vMap.className = resMap.ok ? "veredicto bien" : "veredicto mal";
    vMap.textContent = "map: " + resMap.msg;
    vFil.className = resFil.ok ? "veredicto bien" : "veredicto mal";
    vFil.textContent = "filter: " + resFil.msg;

    document.getElementById("pred-" + id + "-map").className =
      resMap.ok ? "lista bien-celda" : "lista";
    document.getElementById("pred-" + id + "-filtro").className =
      resFil.ok ? "lista bien-celda" : "lista";

    if (resMap.ok && resFil.ok) {
      resueltas[id] = true;
      document.getElementById("ronda-" + id).classList.add("listo");
    }
    document.getElementById("contador").textContent =
      "rondas resueltas: " + contar() + " de " + RONDAS.length;

    if (contar() === RONDAS.length) {
      document.getElementById("botones").classList.remove("bloqueado");
      document.getElementById("presets").classList.remove("bloqueado");
      document.getElementById("carta-cierre").classList.remove("bloqueado");
      document.getElementById("tabla-largos").innerHTML = "";
      construirTablaLargos();
    }
  }

  function construirTablaLargos() {
    var tabla = document.getElementById("tabla-largos");
    var cab = document.createElement("tr");
    ["entrada", "elementos de entrada", "con map", "con filter"].forEach(function (t) {
      var th = document.createElement("th");
      th.textContent = t;
      cab.appendChild(th);
    });
    tabla.appendChild(cab);
    resumenLargos().forEach(function (fila, i) {
      var tr = document.createElement("tr");
      [entradaDe(RONDAS[i]), fila.entrada, fila.conMap, fila.conFiltro]
        .forEach(function (v, j) {
          var td = document.createElement("td");
          td.textContent = String(v);
          if (j === 0) { td.className = "expr"; }
          tr.appendChild(td);
        });
      tabla.appendChild(tr);
    });
  }

  construirRondas();
  construirPresets();
  marcarPreset(rondaEnPanel);
  document.getElementById("contador").textContent =
    "rondas resueltas: 0 de " + RONDAS.length;

  document.querySelectorAll("[data-ronda]").forEach(function (b) {
    b.addEventListener("click", function () { comprobar(b.getAttribute("data-ronda")); });
  });

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      rondaEnPanel = b.getAttribute("data-preset");
      marcarPreset(rondaEnPanel);
      Motor.reiniciar(rondaEnPanel);
    });
  });

  Motor.iniciar({
    código: CODIGO,
    paramsIniciales: rondaEnPanel,
    simular: simular,
    chips: [
      { campo: "fase", rotulo: "función" },
      { campo: "x", rotulo: "x" },
      { campo: "evalua", rotulo: "evalúa" },
      { campo: "salida", rotulo: "sale" },
      { campo: "largo", rotulo: "elementos", clase: "cuenta" }
    ],
    alPintar: panelListas
  });
})();
