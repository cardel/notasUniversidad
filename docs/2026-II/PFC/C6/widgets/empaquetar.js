/* empaquetar: la solución con span de los frames Ejercicio guiado: empaquetar y
   Traza de empaquetar del deck ListasParte2. La simulación sigue el cuerpo del
   caso x :: _ tal como está escrito, con span(e => e == x) partiendo la lista
   en grupo y resto. Las cuatro listas de los atajos son las cuatro llamadas que
   aparecen en la traza del deck. Sobre
   List("a","a","a","b","c","c","a") devuelve
   List(List("a","a","a"), List("b"), List("c","c"), List("a")). */
(function () {

  var LISTA = ["a", "a", "a", "b", "c", "c", "a"];

  /* Las cuatro llamadas de la traza del deck. */
  var ATAJOS = [
    { id: "completa", lista: ["a", "a", "a", "b", "c", "c", "a"] },
    { id: "desde-b", lista: ["b", "c", "c", "a"] },
    { id: "desde-c", lista: ["c", "c", "a"] },
    { id: "ultima-a", lista: ["a"] }
  ];

  function textoLista(xs) {
    if (xs.length === 0) { return "Nil"; }
    return "List(" + xs.map(function (e) { return "\"" + e + "\""; }).join(", ") + ")";
  }

  function textoGrupos(gs) {
    if (gs.length === 0) { return "Nil"; }
    return "List(" + gs.map(textoLista).join(", ") + ")";
  }

  /* span tal como lo describe el deck: (takeWhile(p), dropWhile(p)). */
  function span(xs, p) {
    var cola;
    if (xs.length === 0 || !p(xs[0])) { return { grupo: [], resto: xs }; }
    cola = span(xs.slice(1), p);
    return { grupo: [xs[0]].concat(cola.grupo), resto: cola.resto };
  }

  function empaquetar(xs) {
    var par;
    if (xs.length === 0) { return []; }
    par = span(xs, function (e) { return e === xs[0]; });
    return [par.grupo].concat(empaquetar(par.resto));
  }

  function cuantosGrupos(xs) { return empaquetar(xs).length; }

  var CODIGO = [
    { num: null, txt: "def empaquetar[T](xs: List[T]): List[List[T]] =" },
    { num: 2, txt: "  xs match {" },
    { num: 3, txt: "    case Nil => Nil", bloque: 1 },
    { num: null, txt: "    case x :: _ =>" },
    { num: 5, txt: "      val (grupo, resto) = xs.span(e => e == x)", bloque: 2 },
    { num: 6, txt: "      grupo :: empaquetar(resto)", bloque: 3 },
    { num: 7, txt: "  }" }
  ];

  /* ── La simulación ──────────────────────────────────────────────── */

  function simular(lista) {
    var pasos = [];
    var cerrados = 0;

    function anotar(linea, extra) {
      var paso = {
        linea: linea, xs: null, x: null, grupo: null, resto: null,
        devuelve: null, grupos: cerrados, inicio: null, largoGrupo: null,
        restantes: null
      };
      Object.keys(extra || {}).forEach(function (k) { paso[k] = extra[k]; });
      pasos.push(paso);
    }

    function visitar(xs, inicio) {
      var x, par, cola, total;
      anotar(2, {
        xs: textoLista(xs), inicio: inicio, largoGrupo: 0,
        restantes: xs.length
      });
      if (xs.length === 0) {
        anotar(3, {
          xs: "Nil", devuelve: "Nil", inicio: inicio, largoGrupo: 0, restantes: 0
        });
        anotar(7, {
          xs: "Nil", devuelve: "Nil", inicio: inicio, largoGrupo: 0, restantes: 0
        });
        return [];
      }
      x = xs[0];
      par = span(xs, function (e) { return e === x; });
      anotar(5, {
        xs: textoLista(xs), x: "\"" + x + "\"",
        grupo: textoLista(par.grupo), resto: textoLista(par.resto),
        inicio: inicio, largoGrupo: par.grupo.length, restantes: xs.length
      });
      cerrados = cerrados + 1;
      anotar(6, {
        xs: textoLista(xs), x: "\"" + x + "\"",
        grupo: textoLista(par.grupo), resto: textoLista(par.resto),
        inicio: inicio, largoGrupo: par.grupo.length, restantes: xs.length
      });
      cola = visitar(par.resto, inicio + par.grupo.length);
      total = [par.grupo].concat(cola);
      anotar(7, {
        xs: textoLista(xs), devuelve: textoGrupos(total),
        inicio: inicio, largoGrupo: par.grupo.length, restantes: xs.length
      });
      return total;
    }

    visitar(lista, 0);
    return pasos;
  }

  function buscarAtajo(id) {
    var hallado = null;
    ATAJOS.forEach(function (a) { if (a.id === id) { hallado = a; } });
    return hallado;
  }

  /* ── La pregunta sobre el contador de la línea 5 ─────────────────── */

  var PREGUNTA = {
    enunciado: "Sobre " + textoLista(LISTA) + ", ¿cuántas veces corre la " +
      "línea 5, la del span?",
    correcta: String(cuantosGrupos(LISTA)),
    opciones: [
      {
        txt: String(cuantosGrupos(LISTA)) + ", una por cada grupo de la salida",
        clave: "grupos"
      },
      {
        txt: String(LISTA.length) + ", una por cada elemento de la lista",
        clave: "elementos"
      },
      {
        txt: "3, una por cada valor distinto que aparece",
        clave: "distintos"
      },
      {
        txt: String(cuantosGrupos(LISTA) + 1) + ", las llamadas con elementos " +
          "más la llamada sobre Nil",
        clave: "conNil"
      }
    ],
    exito: "Eso es. La línea 5 está en el caso x :: _, así que corre una vez por " +
      "cada llamada que recibe una lista con elementos, y cada una de esas " +
      "llamadas cierra exactamente un grupo. El contador de la línea 5 y el " +
      "número de grupos de la salida son el mismo número.",
    fallo: {
      elementos: "span mira varios elementos en una sola llamada: la primera se " +
        "lleva las tres primeras a de un golpe y devuelve el resto sin tocar. La " +
        "línea 5 corre una vez por llamada a empaquetar, no una por elemento.",
      distintos: "Los valores distintos son tres, a, b y c, y la salida tiene " +
        "cuatro grupos. La a aparece en dos grupos separados porque entre ellos " +
        "hay una b y dos c: el predicado e == x compara con la cabeza de la " +
        "llamada y se detiene en el primero que no coincide.",
      conNil: "La llamada sobre Nil entra por case Nil => Nil y devuelve de " +
        "inmediato, sin llegar a la línea 5. Ese contador queda en 1, y es el de " +
        "la línea 3."
    }
  };

  var API = {
    LISTA: LISTA, ATAJOS: ATAJOS, CODIGO: CODIGO, PREGUNTA: PREGUNTA,
    span: span, empaquetar: empaquetar, cuantosGrupos: cuantosGrupos,
    textoLista: textoLista, textoGrupos: textoGrupos,
    simular: simular, buscarAtajo: buscarAtajo
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ════════════════ la página ════════════════ */

  var atajoActual = ATAJOS[0].id;

  function pintarFichas(e) {
    var lista = buscarAtajo(atajoActual).lista;
    var caja = document.getElementById("fichas");
    var a = e.actual;
    var inicio = a === null ? -1 : a.inicio;
    var largo = a === null ? 0 : a.largoGrupo;

    caja.innerHTML = "";
    if (lista.length === 0) {
      caja.appendChild(document.createTextNode("Nil no tiene elementos"));
    }
    lista.forEach(function (v, i) {
      var f = document.createElement("span");
      f.className = "ficha";
      f.textContent = v;
      if (inicio >= 0 && i < inicio) { f.className = "ficha empacada"; }
      if (inicio >= 0 && i >= inicio && i < inicio + largo) { f.className = "ficha grupo"; }
      if (inicio >= 0 && i >= inicio + largo) { f.className = "ficha pendiente"; }
      caja.appendChild(f);
    });
    document.getElementById("acumulados").textContent =
      a === null ? "Nil" : (a.devuelve === null ? "sin cerrar todavía" : a.devuelve);
  }

  function construirAtajos() {
    var caja = document.getElementById("presets");
    ATAJOS.forEach(function (a) {
      var b = document.createElement("button");
      b.textContent = textoLista(a.lista);
      b.setAttribute("data-atajo", a.id);
      caja.appendChild(b);
    });
  }

  function marcarAtajo(id) {
    document.querySelectorAll("[data-atajo]").forEach(function (b) {
      b.className = b.getAttribute("data-atajo") === id ? "primario" : "";
    });
  }

  function construirPregunta() {
    var caja = document.getElementById("opciones");
    document.getElementById("enunciado").textContent = PREGUNTA.enunciado;
    PREGUNTA.opciones.forEach(function (o) {
      var b = document.createElement("button");
      b.textContent = o.txt;
      b.setAttribute("data-clave", o.clave);
      caja.appendChild(b);
    });
  }

  construirAtajos();
  marcarAtajo(atajoActual);
  construirPregunta();

  document.querySelectorAll("[data-atajo]").forEach(function (b) {
    b.addEventListener("click", function () {
      atajoActual = b.getAttribute("data-atajo");
      marcarAtajo(atajoActual);
      Motor.reiniciar(buscarAtajo(atajoActual).lista);
    });
  });

  document.querySelectorAll("[data-clave]").forEach(function (b) {
    b.addEventListener("click", function () {
      var clave = b.getAttribute("data-clave");
      var v = document.getElementById("veredicto");
      document.querySelectorAll("[data-clave]").forEach(function (o) { o.className = ""; });
      if (clave === "grupos") {
        b.className = "primario";
        v.className = "veredicto bien";
        v.textContent = PREGUNTA.exito;
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        b.className = "errada";
        v.className = "veredicto mal";
        v.textContent = PREGUNTA.fallo[clave];
      }
    });
  });

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: buscarAtajo(atajoActual).lista,
    simular: simular,
    chips: [
      { campo: "xs", rotulo: "xs" },
      { campo: "x", rotulo: "x" },
      { campo: "grupo", rotulo: "grupo" },
      { campo: "resto", rotulo: "resto" },
      { campo: "devuelve", rotulo: "devuelve" },
      { campo: "grupos", rotulo: "grupos cerrados", clase: "cuenta" }
    ],
    alPintar: pintarFichas
  });
})();
