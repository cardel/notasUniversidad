/* mismoConjunto: el arbol binario ordenado de ConjEnt escrito dos veces, con
   class y con case class, y las cuatro lineas que se imprimen sobre cada uno.
   La estructura y las operaciones son las mismas en las dos versiones: lo que
   cambia es toString y equals, que en una hay que escribir y en la otra llegan
   generados. El codigo sale de 06_conjent_clases.scala y
   08_conjent_sealed_case.scala del deck de la sesion. */
(function () {
  var HASH = "67117f44";

  /* El arbol, una sola vez: las dos versiones guardan lo mismo. */
  function vacio() { return { forma: "Vacio" }; }

  function noVacio(elem, izq, der) {
    return { forma: "NoVacio", elem: elem, izq: izq, der: der };
  }

  function insertar(c, x) {
    if (c.forma === "Vacio") { return noVacio(x, vacio(), vacio()); }
    if (x < c.elem) { return noVacio(c.elem, insertar(c.izq, x), c.der); }
    if (x > c.elem) { return noVacio(c.elem, c.izq, insertar(c.der, x)); }
    return c;
  }

  function pertenece(c, x) {
    if (c.forma === "Vacio") { return false; }
    if (x < c.elem) { return pertenece(c.izq, x); }
    if (x > c.elem) { return pertenece(c.der, x); }
    return true;
  }

  /* El toString heredado: el nombre de la clase con los objetos que la
     encierran y una direccion en hexadecimal. No mira los campos. */
  function textoHeredado(c) {
    return "ConjentClases$" + c.forma + "@" + HASH;
  }

  /* El toString que genera case class: recorre los campos. */
  function textoEstructural(c) {
    if (c.forma === "Vacio") { return "Vacio()"; }
    return "NoVacio(" + c.elem + "," + textoEstructural(c.izq) + "," +
      textoEstructural(c.der) + ")";
  }

  /* == sin equals propio: compara el objeto, no el contenido. */
  function igualPorReferencia(a, b) { return a === b; }

  /* El equals que genera case class: campo por campo. */
  function igualPorEstructura(a, b) {
    if (a.forma !== b.forma) { return false; }
    if (a.forma === "Vacio") { return true; }
    return a.elem === b.elem &&
      igualPorEstructura(a.izq, b.izq) &&
      igualPorEstructura(a.der, b.der);
  }

  var VERSIONES = [
    {
      id: "clase",
      rotulo: "class",
      construye: "Vacio.insertar(5).insertar(3).insertar(8)",
      texto: textoHeredado,
      igual: igualPorReferencia
    },
    {
      id: "caso",
      rotulo: "case class",
      construye: "Vacio().insertar(5).insertar(3).insertar(8)",
      texto: textoEstructural,
      igual: igualPorEstructura
    }
  ];

  var INSERCIONES = [5, 3, 8];

  function conjuntoDelEjemplo() {
    return INSERCIONES.reduce(function (acc, x) { return insertar(acc, x); }, vacio());
  }

  var LINEAS = [
    { id: "imprime", expr: "println(c)", clase: "conjunto",
      evaluar: function (v, c) { return v.texto(c); } },
    { id: "tres", expr: "println(c.pertenece(3))", clase: "booleano",
      evaluar: function (v, c) { return String(pertenece(c, 3)); } },
    { id: "siete", expr: "println(c.pertenece(7))", clase: "booleano",
      evaluar: function (v, c) { return String(pertenece(c, 7)); } },
    { id: "igualdad", expr: "println(c == otroIgual)", clase: "booleano",
      evaluar: function (v, c, otro) { return String(v.igual(c, otro)); } }
  ];

  var SALIDAS = [
    "ConjentClases$NoVacio@" + HASH,
    "NoVacio(5,NoVacio(3,Vacio(),Vacio()),NoVacio(8,Vacio(),Vacio()))",
    "true",
    "false",
    "no compila"
  ];

  /* La celda correcta sale de la simulacion, no de una lista escrita aparte. */
  function correcta(versionId, lineaId) {
    var v = null, l = null, c, otro;
    VERSIONES.forEach(function (x) { if (x.id === versionId) { v = x; } });
    LINEAS.forEach(function (x) { if (x.id === lineaId) { l = x; } });
    c = conjuntoDelEjemplo();
    otro = conjuntoDelEjemplo();
    return l.evaluar(v, c, otro);
  }

  function salidaCompleta(versionId) {
    return LINEAS.map(function (l) { return correcta(versionId, l.id); }).join("\n");
  }

  /* Mensajes propios de cada celda; lo que no esté aquí lo cubre el generico. */
  var ESPECIFICOS = {
    clase: {
      imprime: {
        "NoVacio(5,NoVacio(3,Vacio(),Vacio()),NoVacio(8,Vacio(),Vacio()))":
          "Ese es el toString que genera case class. En esta columna nadie escribió uno, " +
          "así que responde el heredado, que imprime el nombre de la clase con los objetos " +
          "que la encierran y una dirección en hexadecimal."
      },
      igualdad: {
        "true": "Son dos árboles separados con el mismo contenido: cada insertar construyó nodos " +
          "nuevos. Sin un equals escrito a mano, == compara los objetos y no sus campos, " +
          "y estos son dos objetos distintos."
      }
    },
    caso: {
      imprime: {
        "ConjentClases$NoVacio@67117f44":
          "Ese es el toString heredado, el de la otra columna. case class genera uno que recorre " +
          "los campos: escribe el nombre de la forma y, entre paréntesis, el elemento y los dos " +
          "subárboles."
      },
      igualdad: {
        "false": "case class genera un equals que compara campo por campo. Los dos árboles tienen " +
          "el mismo 5 en la raíz y los mismos subárboles, así que == responde true aunque sean " +
          "dos objetos distintos."
      }
    }
  };

  var GENERICOS = {
    tres: "El 3 se insertó después del 5, y 3 < 5, así que quedó en el subárbol izquierdo de la " +
      "raíz. La búsqueda baja por ahí y lo encuentra.",
    siete: "El conjunto guarda 5, 3 y 8. Con 7 > 5 la búsqueda baja a la derecha y llega al nodo " +
      "con 8; con 7 < 8 sigue al subárbol izquierdo de ese nodo, que está vacío, y ahí pertenece " +
      "responde false."
  };

  /* Pistas por la forma de la respuesta elegida, no por su valor exacto. */
  function porLaForma(linea, elegido) {
    if (elegido === "no compila") {
      if (linea.clase === "booleano") {
        return "pertenece y == están disponibles en las dos columnas: el primero está declarado " +
          "en ConjEnt y el segundo lo tiene cualquier valor de Scala. La línea compila, y lo que " +
          "hay que decidir es qué responde.";
      }
      return "println acepta cualquier valor y llama a su toString, que toda clase hereda. La " +
        "línea compila en las dos columnas; lo que cambia es qué escribe ese toString.";
    }
    if (linea.clase === "booleano" && (elegido === "true" || elegido === "false")) {
      return null;
    }
    if (linea.clase === "booleano") {
      return "Esta línea imprime un Boolean: pertenece está declarado como " +
        "def pertenece(x: Int): Boolean y == también devuelve Boolean. El conjunto se imprime " +
        "en otra línea.";
    }
    return "Esta línea imprime el conjunto, que es un ConjEnt. Ningún true ni false sale de ahí: " +
      "los Boolean vienen de pertenece y de la comparación.";
  }

  function mensajeFallo(versionId, lineaId, elegido) {
    var linea = null, propio;
    LINEAS.forEach(function (x) { if (x.id === lineaId) { linea = x; } });
    propio = ESPECIFICOS[versionId] && ESPECIFICOS[versionId][lineaId] &&
      ESPECIFICOS[versionId][lineaId][elegido];
    if (propio) { return propio; }
    return porLaForma(linea, elegido) || GENERICOS[lineaId] ||
      "Vuelva a leer el cuerpo de pertenece: la búsqueda compara x con elem y baja por un solo lado.";
  }

  var CODIGO_CLASE = [
    "abstract class ConjEnt {",
    "  def insertar(x: Int): ConjEnt",
    "  def pertenece(x: Int): Boolean",
    "}",
    " ",
    "object Vacio extends ConjEnt {",
    "  def pertenece(x: Int): Boolean = false",
    "  def insertar(x: Int): ConjEnt =",
    "    new NoVacio(x, Vacio, Vacio)",
    "}",
    " ",
    "class NoVacio(elem: Int, izq: ConjEnt,",
    "              der: ConjEnt) extends ConjEnt {",
    "  def pertenece(x: Int): Boolean =",
    "    if (x < elem) izq.pertenece(x)",
    "    else if (x > elem) der.pertenece(x)",
    "    else true",
    " ",
    "  def insertar(x: Int): ConjEnt =",
    "    if (x < elem)",
    "      new NoVacio(elem, izq.insertar(x), der)",
    "    else if (x > elem)",
    "      new NoVacio(elem, izq, der.insertar(x))",
    "    else this",
    "}"
  ];

  var CODIGO_CASE = [
    "sealed abstract class ConjEnt {",
    "  def insertar(x: Int): ConjEnt",
    "  def pertenece(x: Int): Boolean",
    "}",
    " ",
    "case class Vacio() extends ConjEnt {",
    "  def pertenece(x: Int): Boolean = false",
    "  def insertar(x: Int): ConjEnt =",
    "    NoVacio(x, Vacio(), Vacio())",
    "}",
    " ",
    "case class NoVacio(elem: Int, izq: ConjEnt,",
    "                   der: ConjEnt) extends ConjEnt {",
    "  def pertenece(x: Int): Boolean =",
    "    if (x < elem) izq.pertenece(x)",
    "    else if (x > elem) der.pertenece(x)",
    "    else true",
    " ",
    "  def insertar(x: Int): ConjEnt =",
    "    if (x < elem)",
    "      NoVacio(elem, izq.insertar(x), der)",
    "    else if (x > elem)",
    "      NoVacio(elem, izq, der.insertar(x))",
    "    else this",
    "}"
  ];

  var CODIGO_MAIN = [
    "// en ConjentClases",
    "val c         = Vacio.insertar(5).insertar(3).insertar(8)",
    "val otroIgual = Vacio.insertar(5).insertar(3).insertar(8)",
    " ",
    "// en ConjentSealedCase",
    "val c         = Vacio().insertar(5).insertar(3).insertar(8)",
    "val otroIgual = Vacio().insertar(5).insertar(3).insertar(8)"
  ];

  var API = {
    vacio: vacio, noVacio: noVacio, insertar: insertar, pertenece: pertenece,
    textoHeredado: textoHeredado, textoEstructural: textoEstructural,
    igualPorReferencia: igualPorReferencia, igualPorEstructura: igualPorEstructura,
    conjuntoDelEjemplo: conjuntoDelEjemplo, correcta: correcta,
    salidaCompleta: salidaCompleta, mensajeFallo: mensajeFallo,
    VERSIONES: VERSIONES, LINEAS: LINEAS, SALIDAS: SALIDAS, HASH: HASH,
    CODIGO_CLASE: CODIGO_CLASE, CODIGO_CASE: CODIGO_CASE, CODIGO_MAIN: CODIGO_MAIN
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function pintarCodigo(idCaja, lineas) {
    var caja = document.getElementById(idCaja);
    caja.innerHTML = "";
    lineas.forEach(function (t) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      div.className = "linea";
      num.className = "num";
      num.textContent = "";
      txt.className = "txt";
      txt.textContent = t;
      div.appendChild(num);
      div.appendChild(txt);
      caja.appendChild(div);
    });
  }

  function construirTabla() {
    var tabla = document.getElementById("tabla-salidas");
    var encabezado = document.createElement("tr");
    ["línea impresa", "con class", "con case class"].forEach(function (t) {
      var th = document.createElement("th");
      th.textContent = t;
      encabezado.appendChild(th);
    });
    tabla.appendChild(encabezado);

    LINEAS.forEach(function (l) {
      var fila = document.createElement("tr");
      var celdaExpr = document.createElement("td");
      celdaExpr.className = "expr";
      celdaExpr.textContent = l.expr;
      fila.appendChild(celdaExpr);

      VERSIONES.forEach(function (v) {
        var td = document.createElement("td");
        var sel = document.createElement("select");
        var vacia = document.createElement("option");
        sel.id = "sel-" + v.id + "-" + l.id;
        vacia.value = "";
        vacia.textContent = "elija…";
        sel.appendChild(vacia);
        SALIDAS.forEach(function (s) {
          var op = document.createElement("option");
          op.value = s;
          op.textContent = s;
          sel.appendChild(op);
        });
        td.appendChild(sel);
        fila.appendChild(td);
      });
      tabla.appendChild(fila);
    });
  }

  function comprobar() {
    var aciertos = 0, sinResponder = 0;
    var avisos = document.getElementById("avisos");
    avisos.innerHTML = "";

    VERSIONES.forEach(function (v) {
      LINEAS.forEach(function (l) {
        var sel = document.getElementById("sel-" + v.id + "-" + l.id);
        var elegido = sel.value;
        if (elegido === "") {
          sinResponder = sinResponder + 1;
          sel.className = "";
          return;
        }
        if (elegido === correcta(v.id, l.id)) {
          sel.className = "bien-celda";
          aciertos = aciertos + 1;
          return;
        }
        sel.className = "mal-celda";
        var caja = document.createElement("div");
        var titulo = document.createElement("b");
        caja.className = "aviso-celda";
        titulo.textContent = l.expr + " con " + v.rotulo + ": ";
        caja.appendChild(titulo);
        caja.appendChild(document.createTextNode(mensajeFallo(v.id, l.id, elegido)));
        avisos.appendChild(caja);
      });
    });

    var total = VERSIONES.length * LINEAS.length;
    var contador = document.getElementById("contador");
    if (sinResponder > 0) {
      contador.textContent = "celdas acertadas: " + aciertos + " de " + total +
        " · quedan " + sinResponder + " sin elegir";
    } else {
      contador.textContent = "celdas acertadas: " + aciertos + " de " + total;
    }

    if (aciertos === total) {
      var salida = document.getElementById("salida-real");
      salida.textContent =
        "$ scala-cli run -S 2.13 sonda.scala\n" +
        salidaCompleta("clase") + "\n---\n" + salidaCompleta("caso");
      salida.style.display = "block";
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  pintarCodigo("codigo-clase", CODIGO_CLASE);
  pintarCodigo("codigo-case", CODIGO_CASE);
  pintarCodigo("codigo-main", CODIGO_MAIN);
  construirTabla();
  document.getElementById("contador").textContent =
    "celdas acertadas: 0 de " + (VERSIONES.length * LINEAS.length);
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. Las operaciones del conjunto son idénticas; lo que case class " +
          "aporta es el constructor sin new, un == que responde por el contenido y un toString " +
          "que lo muestra. Con eso una función escrita por fuera se puede construir sus casos y " +
          "revisar su resultado.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
