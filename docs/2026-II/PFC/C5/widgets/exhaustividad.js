/* exhaustividad: el mismo eval con cuatro de los cinco casos de Expr, con la
   jerarquia cerrada por sealed y con la jerarquia abierta. La simulacion hace
   dos cosas separadas: la revision del compilador, que solo puede contar las
   formas del tipo cuando la jerarquia esta cerrada, y la evaluacion del match,
   que es la misma en las dos versiones. El tipo Expr y las dos funciones salen
   de 10_expresiones.scala del deck de la sesion. */
(function () {
  /* Las cinco formas del tipo, con cuantas partes lleva cada una. */
  var FORMAS = [
    { nombre: "Numero", partes: 1 },
    { nombre: "Suma", partes: 2 },
    { nombre: "Resta", partes: 2 },
    { nombre: "Prod", partes: 2 },
    { nombre: "Div", partes: 2 }
  ];

  /* Los casos que el match sí escribió. */
  var PATRONES = ["Numero", "Suma", "Resta", "Prod"];

  var VERSION = {
    sellada: { id: "sellada", rotulo: "con sealed", objeto: "Sellada",
      archivo: "sellada.scala", cerrada: true, linea3: "  sealed trait Expr" },
    abierta: { id: "abierta", rotulo: "sin sealed", objeto: "SinSellar",
      archivo: "sinsellar.scala", cerrada: false, linea3: "  trait Expr" }
  };

  var LINEA_MATCH = 10;
  var COLUMNA_MATCH = 28;
  var LINEA_DIV = 19;
  var FUENTE_MATCH = "  def eval(e: Expr): Int = e match {";
  var SCALA = "Scala 2.13.18, JVM (17)";

  function numero(n) { return { forma: "Numero", valor: n }; }
  function binaria(forma, e1, e2) { return { forma: forma, e1: e1, e2: e2 }; }

  function partesDe(nombre) {
    var n = 0;
    FORMAS.forEach(function (f) { if (f.nombre === nombre) { n = f.partes; } });
    return n;
  }

  /* El toString de una case class, sin espacios entre las partes. */
  function texto(e) {
    if (e.forma === "Numero") { return "Numero(" + e.valor + ")"; }
    return e.forma + "(" + texto(e.e1) + "," + texto(e.e2) + ")";
  }

  /* El patron con que el compilador nombra una forma sin cubrir. */
  function patronComodin(nombre) {
    var huecos = [], i;
    for (i = 0; i < partesDe(nombre); i = i + 1) { huecos.push("_"); }
    return nombre + "(" + huecos.join(", ") + ")";
  }

  function sinCubrir() {
    return FORMAS.filter(function (f) { return PATRONES.indexOf(f.nombre) < 0; })
      .map(function (f) { return f.nombre; });
  }

  /* Lo que el compilador puede decir. Con la jerarquia abierta no conoce la
     lista de formas, asi que no tiene con que comparar los patrones. */
  function compilar(version) {
    var falta = sinCubrir();
    if (!version.cerrada || falta.length === 0) {
      return { compila: true, advertencia: null };
    }
    return {
      compila: true,
      advertencia: {
        archivo: "./" + version.archivo,
        linea: LINEA_MATCH,
        columna: COLUMNA_MATCH,
        mensaje: "match may not be exhaustive.",
        detalle: "It would fail on the following input: " +
          falta.map(patronComodin).join(", "),
        fuente: FUENTE_MATCH
      }
    };
  }

  function FalloMatch(valor, clase) {
    this.tipo = "scala.MatchError";
    this.valor = valor;
    this.clase = clase;
  }

  /* eval con los cuatro casos escritos: lo que no casa con ninguno cae. */
  function evaluar(e, version) {
    if (PATRONES.indexOf(e.forma) < 0) {
      throw new FalloMatch(texto(e), version.objeto + "$" + e.forma);
    }
    if (e.forma === "Numero") { return e.valor; }
    if (e.forma === "Suma") { return evaluar(e.e1, version) + evaluar(e.e2, version); }
    if (e.forma === "Resta") { return evaluar(e.e1, version) - evaluar(e.e2, version); }
    return evaluar(e.e1, version) * evaluar(e.e2, version);
  }

  var MAIN = [
    { linea: 18, expr: binaria("Suma", numero(3), numero(4)) },
    { linea: LINEA_DIV, expr: binaria("Div", numero(10), numero(2)) }
  ];

  /* La corrida: imprime hasta que un match se queda sin patron. */
  function correr(version) {
    var impreso = [], fallo = null;
    MAIN.some(function (p) {
      try {
        impreso.push(String(evaluar(p.expr, version)));
        return false;
      } catch (f) {
        fallo = {
          tipo: f.tipo, valor: f.valor, clase: f.clase,
          pila: [
            version.objeto + "$.eval(" + version.archivo + ":" + LINEA_MATCH + ")",
            version.objeto + "$.main(" + version.archivo + ":" + p.linea + ")",
            version.objeto + ".main(" + version.archivo + ")"
          ]
        };
        return true;
      }
    });
    return { impreso: impreso, fallo: fallo };
  }

  /* Las dos respuestas que el estudiante tiene que elegir. */
  function veredictoCompilacion(version) {
    var r = compilar(version);
    if (!r.compila) { return "rechaza"; }
    return r.advertencia === null ? "silencio" : "advierte";
  }

  function veredictoCorrida(version) {
    var r = correr(version);
    if (r.fallo === null) { return "termina"; }
    return "matchError";
  }

  /* El texto que escribe scala-cli, armado desde la simulacion. */
  function lineaCaret(fuente, columna) {
    var espacios = new Array(columna).join(" ");
    return espacios + "^";
  }

  function consola(version) {
    var r = compilar(version);
    var c = correr(version);
    var fuera = [];
    fuera.push({ clase: "cmd", txt: "$ scala-cli run -S 2.13 " + version.archivo });
    fuera.push({ clase: "", txt: "Compiling project (" + SCALA + ")" });
    if (r.advertencia !== null) {
      fuera.push({ clase: "w", txt: "[warn] " + r.advertencia.archivo + ":" +
        r.advertencia.linea + ":" + r.advertencia.columna });
      fuera.push({ clase: "w", txt: "[warn] " + r.advertencia.mensaje });
      fuera.push({ clase: "w", txt: "[warn] " + r.advertencia.detalle });
      fuera.push({ clase: "w", txt: "[warn] " + r.advertencia.fuente });
      fuera.push({ clase: "w", txt: "[warn] " +
        lineaCaret(r.advertencia.fuente, r.advertencia.columna) });
    }
    fuera.push({ clase: "", txt: "Compiled project (" + SCALA + ")" });
    c.impreso.forEach(function (t) { fuera.push({ clase: "", txt: t }); });
    if (c.fallo !== null) {
      fuera.push({ clase: "e", txt: "Exception in thread \"main\" " + c.fallo.tipo +
        ": " + c.fallo.valor + " (of class " + c.fallo.clase + ")" });
      c.fallo.pila.forEach(function (p) {
        fuera.push({ clase: "e", txt: "\tat " + p });
      });
    }
    return fuera;
  }

  function consolaTexto(version) {
    return consola(version).map(function (l) { return l.txt; }).join("\n");
  }

  var MOMENTOS = [
    {
      id: "compilar", rotulo: "al compilar",
      veredicto: veredictoCompilacion,
      opciones: [
        { clave: "silencio", rotulo: "compila y no escribe ningún mensaje" },
        { clave: "advierte", rotulo: "compila y deja una advertencia: el match puede no ser exhaustivo" },
        { clave: "rechaza", rotulo: "no compila: el compilador rechaza el archivo" }
      ]
    },
    {
      id: "correr", rotulo: "al correr",
      veredicto: veredictoCorrida,
      opciones: [
        { clave: "termina", rotulo: "imprime 7, después 5, y termina" },
        { clave: "matchError", rotulo: "imprime 7 y se detiene con scala.MatchError" },
        { clave: "noCorre", rotulo: "no llega a correr: no hubo compilación" }
      ]
    }
  ];

  var RETRO = {
    sellada: {
      compilar: {
        silencio: "La jerarquía está cerrada: las cinco formas de Expr se declaran en este " +
          "archivo y el compilador las cuenta. Al comparar esa lista con los cuatro patrones " +
          "del match encuentra una sin cubrir y lo escribe.",
        rechaza: "Lo que llega es una advertencia, no un error. El archivo compila, el programa " +
          "queda armado y la decisión de correrlo o no queda en manos de quien compila."
      },
      correr: {
        termina: "Para que imprima 5 tendría que existir el case Div, que es justo el que falta. " +
          "eval recorre los cuatro patrones y ninguno casa con Div(Numero(10),Numero(2)).",
        noCorre: "El archivo compiló, con advertencia incluida. La primera línea del main alcanza " +
          "a imprimir su resultado y la caída llega en la segunda."
      }
    },
    abierta: {
      compilar: {
        advierte: "Sin sealed, cualquier archivo del proyecto puede declarar otra forma de Expr. " +
          "El compilador no conoce la lista completa, así que no tiene con qué medir si el match " +
          "la cubre, y compila en silencio.",
        rechaza: "Un match con cuatro casos es código válido en las dos versiones. Lo que cambia " +
          "al quitar sealed es si el compilador dice algo, no si acepta el archivo."
      },
      correr: {
        termina: "El case Div falta en las dos versiones. Quitar sealed cambia lo que el " +
          "compilador alcanza a revisar, no lo que el match hace con el valor que llega.",
        noCorre: "Compiló sin un solo mensaje, y por eso el hueco aparece hasta la corrida: esa " +
          "es la diferencia que trae la otra versión."
      }
    }
  };

  function revisar(versionId, momentoId, elegido) {
    var version = VERSION[versionId], momento = null;
    MOMENTOS.forEach(function (m) { if (m.id === momentoId) { momento = m; } });
    var buena = momento.veredicto(version);
    if (elegido === buena) { return { ok: true, msg: "" }; }
    return { ok: false, msg: RETRO[versionId][momentoId][elegido] };
  }

  var CODIGO = [
    "object Sellada {",
    " ",
    "  sealed trait Expr",
    "  case class Numero(valor: Int)              extends Expr",
    "  case class Suma(e1: Expr, e2: Expr)        extends Expr",
    "  case class Resta(e1: Expr, e2: Expr)       extends Expr",
    "  case class Prod(e1: Expr, e2: Expr)        extends Expr",
    "  case class Div(e1: Expr, e2: Expr)         extends Expr",
    " ",
    FUENTE_MATCH,
    "    case Numero(n)      => n",
    "    case Suma(e1, e2)   => eval(e1) + eval(e2)",
    "    case Resta(e1, e2)  => eval(e1) - eval(e2)",
    "    case Prod(e1, e2)   => eval(e1) * eval(e2)",
    "  }",
    " ",
    "  def main(args: Array[String]): Unit = {",
    "    println(eval(Suma(Numero(3), Numero(4))))",
    "    println(eval(Div(Numero(10), Numero(2))))",
    "  }",
    "}"
  ];

  var API = {
    FORMAS: FORMAS, PATRONES: PATRONES, VERSION: VERSION, MOMENTOS: MOMENTOS,
    CODIGO: CODIGO, RETRO: RETRO,
    numero: numero, binaria: binaria, texto: texto, patronComodin: patronComodin,
    sinCubrir: sinCubrir, compilar: compilar, evaluar: evaluar, correr: correr,
    veredictoCompilacion: veredictoCompilacion, veredictoCorrida: veredictoCorrida,
    consola: consola, consolaTexto: consolaTexto, revisar: revisar
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function pintarCodigo(idCaja, lineas, desde, resaltar) {
    var caja = document.getElementById(idCaja);
    caja.innerHTML = "";
    lineas.forEach(function (t, i) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      div.className = "linea" + (resaltar === desde + i ? " actual" : "");
      num.className = "num";
      num.textContent = String(desde + i);
      txt.className = "txt";
      txt.textContent = t;
      div.appendChild(num);
      div.appendChild(txt);
      caja.appendChild(div);
    });
  }

  function construirTabla() {
    var tabla = document.getElementById("tabla-casos");
    var cab = document.createElement("tr");
    var th0 = document.createElement("th");
    th0.textContent = "versión";
    cab.appendChild(th0);
    MOMENTOS.forEach(function (m) {
      var th = document.createElement("th");
      th.textContent = m.rotulo;
      cab.appendChild(th);
    });
    tabla.appendChild(cab);

    ["sellada", "abierta"].forEach(function (vid) {
      var fila = document.createElement("tr");
      var td0 = document.createElement("td");
      td0.className = "izquierda";
      td0.innerHTML = "<code>" + VERSION[vid].linea3.trim() + "</code>";
      fila.appendChild(td0);
      MOMENTOS.forEach(function (m) {
        var td = document.createElement("td");
        var sel = document.createElement("select");
        var vacia = document.createElement("option");
        sel.id = "sel-" + vid + "-" + m.id;
        vacia.value = "";
        vacia.textContent = "elija…";
        sel.appendChild(vacia);
        m.opciones.forEach(function (o) {
          var op = document.createElement("option");
          op.value = o.clave;
          op.textContent = o.rotulo;
          sel.appendChild(op);
        });
        td.appendChild(sel);
        fila.appendChild(td);
      });
      tabla.appendChild(fila);
    });
  }

  function mostrarSalidas() {
    var caja = document.getElementById("salidas");
    caja.innerHTML = "";
    ["sellada", "abierta"].forEach(function (vid) {
      var h = document.createElement("h3");
      var pre = document.createElement("pre");
      h.textContent = VERSION[vid].rotulo + " · " + VERSION[vid].archivo;
      pre.className = "consola";
      consola(VERSION[vid]).forEach(function (l) {
        var span = document.createElement("span");
        if (l.clase !== "") { span.className = l.clase; }
        span.textContent = l.txt + "\n";
        pre.appendChild(span);
      });
      caja.appendChild(h);
      caja.appendChild(pre);
    });
    var nota = document.createElement("p");
    nota.className = "nota";
    nota.textContent = "En ámbar, lo que escribe el compilador; en rojo, lo que " +
      "escribe la corrida. El 7 entre los dos es la primera línea del main, que " +
      "alcanza a imprimirse en las dos versiones.";
    caja.appendChild(nota);
    caja.classList.add("visible");
  }

  function comprobar() {
    var aciertos = 0, sinResponder = 0;
    var avisos = document.getElementById("avisos");
    avisos.innerHTML = "";

    ["sellada", "abierta"].forEach(function (vid) {
      MOMENTOS.forEach(function (m) {
        var sel = document.getElementById("sel-" + vid + "-" + m.id);
        if (sel.value === "") {
          sinResponder = sinResponder + 1;
          sel.className = "";
          return;
        }
        var res = revisar(vid, m.id, sel.value);
        if (res.ok) {
          sel.className = "bien-celda";
          aciertos = aciertos + 1;
          return;
        }
        sel.className = "mal-celda";
        var caja = document.createElement("div");
        var titulo = document.createElement("b");
        caja.className = "aviso-celda";
        titulo.textContent = VERSION[vid].rotulo + ", " + m.rotulo + ": ";
        caja.appendChild(titulo);
        caja.appendChild(document.createTextNode(res.msg));
        avisos.appendChild(caja);
      });
    });

    var contador = document.getElementById("contador");
    if (sinResponder > 0) {
      contador.textContent = "casillas acertadas: " + aciertos + " de 4 · quedan " +
        sinResponder + " sin elegir";
    } else {
      contador.textContent = "casillas acertadas: " + aciertos + " de 4";
    }
    if (aciertos === 4) {
      mostrarSalidas();
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  pintarCodigo("codigo-archivo", CODIGO, 1, LINEA_MATCH);
  pintarCodigo("codigo-sellada", [VERSION.sellada.linea3], 3, null);
  pintarCodigo("codigo-abierta", [VERSION.abierta.linea3], 3, null);
  construirTabla();
  document.getElementById("contador").textContent = "casillas acertadas: 0 de 4";
  document.getElementById("btn-comprobar").addEventListener("click", comprobar);

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = b.getAttribute("data-razon") === "ok" ? "primario" : "errada";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. El match falla igual en las dos versiones; lo que sealed " +
          "cambia es que el compilador alcanza a contar las formas del tipo y a nombrar la que " +
          "quedó sin cubrir antes de que el programa corra.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
