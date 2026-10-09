/* orden: describir clasifica cualquier valor con seis casos, y el match se
   queda con el primero que casa. La simulacion guarda los casos en una lista
   ordenada, asi que reordenar el match es reordenar la lista y nada mas: el
   mismo recorrido de arriba abajo produce las dos tablas de salidas. La
   funcion sale de 09_pattern_matching.scala del deck de la sesion. */
(function () {
  /* Cada caso sabe con que valores casa y que devuelve cuando casa. */
  var CASOS = {
    constante: {
      id: "constante", patron: "case 0",
      casa: function (v) { return v.tipo === "Int" && v.valor === 0; },
      salida: function () { return "cero"; }
    },
    entero: {
      id: "entero", patron: "case n: Int",
      casa: function (v) { return v.tipo === "Int"; },
      salida: function (v) { return "entero: " + v.texto; }
    },
    cadena: {
      id: "cadena", patron: "case s: String",
      casa: function (v) { return v.tipo === "String"; },
      salida: function (v) { return "cadena: " + v.valor; }
    },
    tupla: {
      id: "tupla", patron: "case (a, b)",
      casa: function (v) { return v.tipo === "Tupla"; },
      salida: function (v) { return "tupla: (" + v.a + "," + v.b + ")"; }
    },
    lista: {
      id: "lista", patron: "case head :: tail",
      casa: function (v) { return v.tipo === "List" && v.valor.length > 0; },
      salida: function (v) { return "lista con cabeza: " + v.valor[0]; }
    },
    comodin: {
      id: "comodin", patron: "case _",
      casa: function () { return true; },
      salida: function () { return "otra cosa"; }
    }
  };

  var ORDEN_ESCRITO = ["constante", "entero", "cadena", "tupla", "lista", "comodin"];
  var ORDEN_CAMBIADO = ["entero", "constante", "cadena", "tupla", "lista", "comodin"];

  /* El match: prueba los casos en el orden recibido y se detiene en el primero
     que casa. */
  function describir(valor, orden) {
    var elegido = null;
    orden.forEach(function (id) {
      if (elegido === null && CASOS[id].casa(valor)) { elegido = CASOS[id]; }
    });
    return { caso: elegido.id, patron: elegido.patron, salida: elegido.salida(valor) };
  }

  function entero(n) { return { tipo: "Int", valor: n, texto: String(n) }; }
  function cadena(s) { return { tipo: "String", valor: s }; }
  function doble(t) { return { tipo: "Double", texto: t }; }
  function lista(xs) { return { tipo: "List", valor: xs }; }
  function tupla(a, b) { return { tipo: "Tupla", a: a, b: b }; }

  var ENTRADAS = [
    { id: "cero", expr: "describir(0)", valor: entero(0) },
    { id: "cuarentaydos", expr: "describir(42)", valor: entero(42) },
    { id: "hola", expr: "describir(\"hola\")", valor: cadena("hola") },
    { id: "decimal", expr: "describir(2.5)", valor: doble("2.5") },
    { id: "listaVacia", expr: "describir(List())", valor: lista([]) },
    { id: "listaDos", expr: "describir(List(1, 2))", valor: lista([1, 2]) }
  ];

  var SALIDAS = [
    "cero", "entero: 0", "entero: 42", "cadena: hola",
    "lista con cabeza: 1", "tupla: (true,ok)", "otra cosa"
  ];

  function buscar(id) {
    var hallada = null;
    ENTRADAS.forEach(function (e) { if (e.id === id) { hallada = e; } });
    return hallada;
  }

  function conOrdenEscrito(id) { return describir(buscar(id).valor, ORDEN_ESCRITO); }
  function conOrdenCambiado(id) { return describir(buscar(id).valor, ORDEN_CAMBIADO); }

  function cambia(id) {
    return conOrdenEscrito(id).salida !== conOrdenCambiado(id).salida;
  }

  function cualesCambian() {
    return ENTRADAS.filter(function (e) { return cambia(e.id); })
      .map(function (e) { return e.id; });
  }

  /* Mensajes propios de una entrada y una respuesta concreta. */
  var ESPECIFICOS = {
    cero: {
      "entero: 0": "case 0 está escrito arriba de case n: Int, y el match se detiene en el " +
        "primero que casa. El cero casa con la constante y la línea del entero no se prueba."
    },
    listaVacia: {
      "lista con cabeza: 1": "head :: tail separa una lista en su primer elemento y el resto, " +
        "así que pide al menos un elemento. List() es Nil: no hay cabeza que ligar a head."
    },
    decimal: {
      "entero: 42": "2.5 no es un Int. case n: Int es un patrón de tipo y solo casa con enteros; " +
        "2.5 es un Double."
    }
  };

  var GENERICOS = {
    cero: "El cero es un Int, y hay dos casos que casan con él. Decide el que está escrito " +
      "más arriba.",
    cuarentaydos: "42 no es cero, así que case 0 no casa. El siguiente caso es un patrón de " +
      "tipo y 42 sí es un Int: ahí se detiene.",
    hola: "Una cadena no casa con la constante 0 ni con el patrón de Int. El tercer caso es un " +
      "patrón de tipo sobre String y liga el valor a s.",
    decimal: "2.5 es un Double. Ningún caso lo nombra: no es el cero, no es un Int, no es una " +
      "cadena, no es una tupla y no es una lista. Llega hasta el último.",
    listaVacia: "List() es la lista vacía, Nil. El único caso de listas pide separarla en " +
      "cabeza y resto, y una lista sin elementos no se puede separar así.",
    listaDos: "La lista no casa con los casos de arriba y sí con head :: tail, que liga el 1 " +
      "a head y List(2) a tail."
  };

  function mensajeFallo(id, elegido) {
    var propio = ESPECIFICOS[id] && ESPECIFICOS[id][elegido];
    if (propio) { return propio; }
    return GENERICOS[id];
  }

  /* Las dos versiones del match, para pintar el panel de codigo. */
  function codigo(orden) {
    var lineas = ["def describir(x: Any): String = x match {"];
    var ancho = 0;
    orden.forEach(function (id) {
      if (CASOS[id].patron.length > ancho) { ancho = CASOS[id].patron.length; }
    });
    orden.forEach(function (id) {
      var p = CASOS[id].patron;
      while (p.length < ancho) { p = p + " "; }
      lineas.push("  " + p + " => " + CUERPO[id]);
    });
    lineas.push("}");
    return lineas;
  }

  var CUERPO = {
    constante: "\"cero\"",
    entero: "\"entero: \" + n",
    cadena: "\"cadena: \" + s",
    tupla: "\"tupla: (\" + a + \",\" + b + \")\"",
    lista: "\"lista con cabeza: \" + head",
    comodin: "\"otra cosa\""
  };

  var API = {
    CASOS: CASOS, ORDEN_ESCRITO: ORDEN_ESCRITO, ORDEN_CAMBIADO: ORDEN_CAMBIADO,
    ENTRADAS: ENTRADAS, SALIDAS: SALIDAS, CUERPO: CUERPO,
    describir: describir, entero: entero, cadena: cadena, doble: doble,
    lista: lista, tupla: tupla, buscar: buscar,
    conOrdenEscrito: conOrdenEscrito, conOrdenCambiado: conOrdenCambiado,
    cambia: cambia, cualesCambian: cualesCambian, mensajeFallo: mensajeFallo,
    codigo: codigo
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function pintarCodigo(idCaja, lineas, resaltar) {
    var caja = document.getElementById(idCaja);
    caja.innerHTML = "";
    lineas.forEach(function (t, i) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      div.className = "linea" + (resaltar.indexOf(i + 1) >= 0 ? " actual" : "");
      num.className = "num";
      num.textContent = String(i + 1);
      txt.className = "txt";
      txt.textContent = t;
      div.appendChild(num);
      div.appendChild(txt);
      caja.appendChild(div);
    });
  }

  function construirPredicciones() {
    var tabla = document.getElementById("tabla-predicciones");
    var cab = document.createElement("tr");
    ["llamada", "qué imprime"].forEach(function (t) {
      var th = document.createElement("th");
      th.textContent = t;
      cab.appendChild(th);
    });
    tabla.appendChild(cab);

    ENTRADAS.forEach(function (e) {
      var fila = document.createElement("tr");
      var tdExpr = document.createElement("td");
      var tdSel = document.createElement("td");
      var sel = document.createElement("select");
      var vacia = document.createElement("option");
      tdExpr.className = "expr";
      tdExpr.textContent = e.expr;
      sel.id = "sel-" + e.id;
      vacia.value = "";
      vacia.textContent = "elija…";
      sel.appendChild(vacia);
      SALIDAS.forEach(function (s) {
        var op = document.createElement("option");
        op.value = s;
        op.textContent = s;
        sel.appendChild(op);
      });
      tdSel.appendChild(sel);
      fila.appendChild(tdExpr);
      fila.appendChild(tdSel);
      tabla.appendChild(fila);
    });
  }

  function comprobarPredicciones() {
    var aciertos = 0, sinResponder = 0;
    var avisos = document.getElementById("avisos");
    avisos.innerHTML = "";

    ENTRADAS.forEach(function (e) {
      var sel = document.getElementById("sel-" + e.id);
      if (sel.value === "") {
        sinResponder = sinResponder + 1;
        sel.className = "";
        return;
      }
      if (sel.value === conOrdenEscrito(e.id).salida) {
        sel.className = "bien-celda";
        aciertos = aciertos + 1;
        return;
      }
      sel.className = "mal-celda";
      var caja = document.createElement("div");
      var titulo = document.createElement("b");
      caja.className = "aviso-celda";
      titulo.textContent = e.expr + ": ";
      caja.appendChild(titulo);
      caja.appendChild(document.createTextNode(mensajeFallo(e.id, sel.value)));
      avisos.appendChild(caja);
    });

    var contador = document.getElementById("contador");
    if (sinResponder > 0) {
      contador.textContent = "salidas acertadas: " + aciertos + " de " + ENTRADAS.length +
        " · quedan " + sinResponder + " sin elegir";
    } else {
      contador.textContent = "salidas acertadas: " + aciertos + " de " + ENTRADAS.length;
    }
    if (aciertos === ENTRADAS.length) {
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  function construirCambios() {
    var tabla = document.getElementById("tabla-cambios");
    var cab = document.createElement("tr");
    ["llamada", "cambia"].forEach(function (t) {
      var th = document.createElement("th");
      th.textContent = t;
      cab.appendChild(th);
    });
    tabla.appendChild(cab);

    ENTRADAS.forEach(function (e) {
      var fila = document.createElement("tr");
      var tdExpr = document.createElement("td");
      var tdChk = document.createElement("td");
      var chk = document.createElement("input");
      tdExpr.className = "expr";
      tdExpr.textContent = e.expr;
      chk.type = "checkbox";
      chk.id = "chk-" + e.id;
      tdChk.appendChild(chk);
      fila.appendChild(tdExpr);
      fila.appendChild(tdChk);
      tabla.appendChild(fila);
    });
  }

  function construirComparacion() {
    var tabla = document.getElementById("tabla-comparacion");
    tabla.innerHTML = "";
    var cab = document.createElement("tr");
    ["llamada", "con case 0 arriba", "con case n: Int arriba", "qué caso atrapa el valor"]
      .forEach(function (t) {
        var th = document.createElement("th");
        th.textContent = t;
        cab.appendChild(th);
      });
    tabla.appendChild(cab);

    ENTRADAS.forEach(function (e) {
      var antes = conOrdenEscrito(e.id);
      var despues = conOrdenCambiado(e.id);
      var fila = document.createElement("tr");
      var tdExpr = document.createElement("td");
      var tdAntes = document.createElement("td");
      var tdDespues = document.createElement("td");
      var tdCaso = document.createElement("td");
      tdExpr.className = "expr";
      tdExpr.textContent = e.expr;
      tdAntes.className = "salida-real";
      tdAntes.textContent = antes.salida;
      tdDespues.className = "salida-real" + (cambia(e.id) ? " cambia" : "");
      tdDespues.textContent = despues.salida;
      tdCaso.className = "patron-real";
      tdCaso.textContent = antes.patron === despues.patron
        ? antes.patron
        : antes.patron + " → " + despues.patron;
      fila.appendChild(tdExpr);
      fila.appendChild(tdAntes);
      fila.appendChild(tdDespues);
      fila.appendChild(tdCaso);
      tabla.appendChild(fila);
    });
  }

  function comprobarCambios() {
    var faltan = [], sobran = [];
    ENTRADAS.forEach(function (e) {
      var marcada = document.getElementById("chk-" + e.id).checked;
      if (cambia(e.id) && !marcada) { faltan.push(e.expr); }
      if (!cambia(e.id) && marcada) { sobran.push(e.expr); }
    });
    var v = document.getElementById("veredicto-cambios");
    if (faltan.length === 0 && sobran.length === 0) {
      v.className = "veredicto bien";
      v.textContent = "Eso es. Solo describir(0) cambia de respuesta, porque es el único valor " +
        "al que casaban los dos primeros casos. Las otras cinco llamadas ni tocaban case 0.";
      construirComparacion();
      document.getElementById("tras").classList.add("visible");
      document.getElementById("carta-cuatro").classList.remove("bloqueado");
      return;
    }
    v.className = "veredicto mal";
    if (sobran.length > 0) {
      v.textContent = "Revise " + sobran.join(", ") + ": para que el intercambio le cambie la " +
        "respuesta, el valor tendría que casar con los dos casos que se movieron, y solo el " +
        "cero casa con la constante.";
      return;
    }
    v.textContent = "Falta " + faltan.join(", ") + ": busque un valor que case con case 0 y " +
      "también con case n: Int, porque es el único al que le puede importar cuál de los dos " +
      "esté arriba.";
  }

  pintarCodigo("codigo-describir", codigo(ORDEN_ESCRITO), []);
  pintarCodigo("codigo-reordenado", codigo(ORDEN_CAMBIADO), [2, 3]);
  construirPredicciones();
  construirCambios();
  document.getElementById("contador").textContent =
    "salidas acertadas: 0 de " + ENTRADAS.length;
  document.getElementById("btn-comprobar").addEventListener("click", comprobarPredicciones);
  document.getElementById("btn-cambios").addEventListener("click", comprobarCambios);

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-cuatro");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. Dos patrones solo compiten cuando casan con el mismo valor, y " +
          "el único que atrapa un Double es el comodín. Por eso el caso nuevo puede ir en " +
          "cualquier línea anterior a él.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
