/* patrones: cual de los cuatro casos de describir corresponde con una lista
   dada. El codigo y los cuatro patrones, en ese orden, salen del frame "Mas
   patrones utiles" de ListasParte1.tex; los dos patrones basicos, Nil y
   x :: xs, salen del frame "Los patrones fundamentales de listas". La opcion
   correcta de cada ronda la decide casar(), que baja por los casos en el orden
   escrito y para en el primero que corresponde, igual que el match. */
(function () {

  /* ── Los cuatro casos del match, en el orden del deck ──────────── */

  var CASOS = [
    { patron: "Nil", cuerpo: '"Lista vacia"' },
    { patron: "x :: Nil", cuerpo: 's"Un solo elemento: $x"' },
    { patron: "x :: y :: Nil", cuerpo: 's"Exactamente dos: $x y $y"' },
    { patron: "x :: xs", cuerpo: 's"Empieza con $x, quedan ${xs.length} mas"' }
  ];

  var CODIGO = [
    { txt: "def describir(lst: List[Int]): String = lst match {", caso: null },
    { txt: '  case Nil          => "Lista vacia"', caso: 0 },
    { txt: '  case x :: Nil     => s"Un solo elemento: $x"', caso: 1 },
    { txt: '  case x :: y :: Nil => s"Exactamente dos: $x y $y"', caso: 2 },
    { txt: '  case x :: xs      => s"Empieza con $x, quedan ${xs.length} mas"', caso: 3 },
    { txt: "}", caso: null }
  ];

  /* Las cuatro llamadas del deck, mas una lista larga. */
  var RONDAS = [[], [42], [1, 2], [1, 2, 3], [4, 8, 15, 16]];

  function textoLista(xs) { return "List(" + xs.join(", ") + ")"; }

  /* ── Las reglas de correspondencia ─────────────────────────────── */

  /* La forma que pide cada patron: Nil ninguna cabeza, x :: Nil una,
     x :: y :: Nil dos, x :: xs una o mas. */
  function ajusta(i, lista) {
    if (i === 0) { return lista.length === 0; }
    if (i === 1) { return lista.length === 1; }
    if (i === 2) { return lista.length === 2; }
    return lista.length >= 1;
  }

  /* El caso que corre: el primero de arriba abajo que corresponde. */
  function casar(lista) {
    var hallado = -1;
    CASOS.forEach(function (c, i) {
      if (hallado < 0 && ajusta(i, lista)) { hallado = i; }
    });
    return hallado;
  }

  /* Lo que devuelve describir, calculado con el cuerpo del caso que corre. */
  function describir(lista) {
    var i = casar(lista);
    if (i === 0) { return "Lista vacia"; }
    if (i === 1) { return "Un solo elemento: " + lista[0]; }
    if (i === 2) { return "Exactamente dos: " + lista[0] + " y " + lista[1]; }
    return "Empieza con " + lista[0] + ", quedan " + (lista.length - 1) + " mas";
  }

  function plural(n, singular, varios) {
    return n === 1 ? "1 " + singular : n + " " + varios;
  }

  /* Por que el patron elegido no es el que corre: o la forma no corresponde,
     o corresponde pero hay un caso escrito antes que tambien corresponde. */
  function motivo(i, lista) {
    var gana = casar(lista);
    var n = lista.length;
    if (ajusta(i, lista)) {
      return "La forma corresponde, pero case " + CASOS[gana].patron + " está " +
        "escrito más arriba y también corresponde con " + textoLista(lista) + ". " +
        "El match baja por los casos en el orden en que están escritos y para en " +
        "el primero, así que corre ese y el de " + CASOS[i].patron + " queda sin usar.";
    }
    if (i === 0) {
      return "Nil no liga ningún nombre: corresponde solo cuando la lista no tiene " +
        "cabeza. " + textoLista(lista) + " empieza con el " + lista[0] + ", así que " +
        "su forma es la de un ::. El patrón mira la forma del dato, no lo que guarda.";
    }
    if (i === 1) {
      if (n === 0) {
        return "x :: Nil pide una cabeza que ligar a x, y List() no tiene ninguna: " +
          "no hay un :: del que sacarla. Los patrones con :: dejan fuera la lista vacía.";
      }
      return "x :: Nil pide que la cola sea exactamente Nil, o sea una lista de un " +
        "solo elemento. " + textoLista(lista) + " tiene " + plural(n, "elemento", "elementos") +
        ", así que después de la cabeza queda " + textoLista(lista.slice(1)) +
        " y eso no es Nil.";
    }
    if (i === 2) {
      if (n === 0) {
        return "x :: y :: Nil pide dos cabezas, una para x y otra para y, y List() " +
          "no tiene ninguna. Los patrones con :: dejan fuera la lista vacía.";
      }
      if (n === 1) {
        return "x :: y :: Nil pide cabeza, segundo elemento y después Nil: " +
          "exactamente dos. " + textoLista(lista) + " tiene uno, así que no hay nada " +
          "que ligar a y.";
      }
      return "x :: y :: Nil pide que después del segundo elemento venga Nil. En " +
        textoLista(lista) + " después del " + lista[1] + " queda " +
        textoLista(lista.slice(2)) + ", que no es Nil.";
    }
    return "x :: xs pide una cabeza que ligar a x, y List() no tiene ninguna. " +
      "La lista vacía corresponde solo con Nil, que es el otro constructor.";
  }

  function acierto(lista) {
    var i = casar(lista);
    if (i === 3 && lista.length > 2) {
      return "Eso es. xs es la cola, " + textoLista(lista.slice(1)) + ", y el caso " +
        "devuelve " + describir(lista) + ". Los tres casos de arriba piden una " +
        "longitud fija, así que este recoge todo lo que sea más largo.";
    }
    if (i === 3) {
      return "Eso es: " + describir(lista) + ".";
    }
    if (i === 0) {
      return "Eso es. List() es Nil, y es la única lista que no tiene cabeza: los " +
        "tres patrones con :: la dejan fuera. Devuelve " + describir(lista) + ".";
    }
    return "Eso es. El patrón fija la longitud y liga los elementos por su posición; " +
      "describir devuelve " + describir(lista) + ".";
  }

  var API = {
    CASOS: CASOS, CODIGO: CODIGO, RONDAS: RONDAS,
    ajusta: ajusta, casar: casar, describir: describir,
    motivo: motivo, acierto: acierto, textoLista: textoLista
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ── La página ─────────────────────────────────────────────────── */

  var k = 0;
  var errores = 0;
  var resueltas = [];
  var destacado = null;

  function construirCodigo() {
    var panel = document.getElementById("panel-codigo");
    CODIGO.forEach(function (l, idx) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      var cont;
      div.className = "linea";
      div.id = "linea-" + idx;
      num.className = "num";
      num.textContent = String(idx + 1);
      txt.className = "txt";
      txt.textContent = l.txt;
      div.appendChild(num);
      div.appendChild(txt);
      if (l.caso !== null) {
        cont = document.createElement("span");
        cont.className = "cont";
        cont.id = "cont-" + l.caso;
        cont.textContent = "× 0";
        div.appendChild(cont);
      }
      panel.appendChild(div);
    });
  }

  function pintarCodigo() {
    var cuenta = {};
    resueltas.forEach(function (i) { cuenta[i] = (cuenta[i] || 0) + 1; });
    CODIGO.forEach(function (l, idx) {
      var div = document.getElementById("linea-" + idx);
      var veces;
      div.classList.remove("actual");
      if (l.caso === null) { return; }
      veces = cuenta[l.caso] || 0;
      document.getElementById("cont-" + l.caso).textContent = "× " + veces;
      document.getElementById("cont-" + l.caso).className =
        veces > 0 ? "cont activo" : "cont";
      if (l.caso === destacado) { div.classList.add("actual"); }
    });
  }

  function pintarHistoria() {
    var caja = document.getElementById("historia");
    caja.innerHTML = "";
    resueltas.forEach(function (i, j) {
      var fila = document.createElement("div");
      var izq = document.createElement("span");
      var der = document.createElement("span");
      fila.className = "resuelta";
      izq.className = "llamada";
      izq.textContent = "describir(" + textoLista(RONDAS[j]) + ")";
      der.className = "salida";
      der.textContent = "case " + CASOS[i].patron + "  →  " +
        '"' + describir(RONDAS[j]) + '"';
      fila.appendChild(izq);
      fila.appendChild(der);
      caja.appendChild(fila);
    });
  }

  function pintarMarcador() {
    document.getElementById("marcador").textContent =
      "listas resueltas: " + resueltas.length + " de " + RONDAS.length +
      "    ·    patrones mal elegidos: " + errores;
  }

  function pintarOpciones() {
    var caja = document.getElementById("opciones");
    var rotulo = document.getElementById("rotulo-opciones");
    var ver = document.getElementById("veredicto");
    caja.innerHTML = "";
    ver.className = "veredicto";
    ver.textContent = "";
    if (k >= RONDAS.length) {
      rotulo.textContent = "Las cinco listas quedaron asignadas.";
      document.getElementById("carta-tres").classList.remove("bloqueado");
      return;
    }
    rotulo.innerHTML = "¿Qué caso corre con <code>describir(" +
      textoLista(RONDAS[k]) + ")</code>?";
    CASOS.forEach(function (c, i) {
      var b = document.createElement("button");
      b.textContent = "case " + c.patron + " => " + c.cuerpo;
      b.addEventListener("click", function () { elegir(i, b); });
      caja.appendChild(b);
    });
  }

  function elegir(i, boton) {
    var ver = document.getElementById("veredicto");
    var lista = RONDAS[k];
    if (i === casar(lista)) {
      resueltas.push(i);
      destacado = i;
      ver.className = "veredicto bien";
      ver.textContent = acierto(lista);
      pintarCodigo();
      pintarHistoria();
      pintarMarcador();
      k = k + 1;
      document.getElementById("btn-seguir").style.display =
        k >= RONDAS.length ? "none" : "inline-block";
      document.getElementById("opciones").classList.add("bloqueado");
      if (k >= RONDAS.length) {
        pintarOpciones();
        ver.className = "veredicto bien";
        ver.textContent = acierto(lista);
      }
      return;
    }
    errores = errores + 1;
    boton.className = "errada";
    boton.disabled = true;
    ver.className = "veredicto mal";
    ver.textContent = motivo(i, lista);
    pintarMarcador();
  }

  construirCodigo();
  pintarCodigo();
  pintarHistoria();
  pintarOpciones();
  pintarMarcador();
  document.getElementById("btn-seguir").style.display = "none";

  document.getElementById("btn-seguir").addEventListener("click", function () {
    destacado = null;
    document.getElementById("opciones").classList.remove("bloqueado");
    document.getElementById("btn-seguir").style.display = "none";
    pintarOpciones();
    pintarCodigo();
  });

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. Con x :: xs arriba, las cuatro listas no vacías " +
          "caen ahí y los dos patrones de longitud fija dejan de alcanzarse: " +
          "List(42) devolvería Empieza con 42, quedan 0 mas, y List(1, 2), " +
          "Empieza con 1, quedan 1 mas.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
