/* mezclar: qué exige cada trait a la clase que lo mezcla. Los dos traits y el
   Rectangulo son los de 07_traits.scala: Plano con alto y ancho abstractos y
   area ya escrito a partir de los dos, Movible con mover abstracto. Las cinco
   declaraciones se compilaron con scala-cli (Scala 2.13.18); los mensajes de
   las que fallan son los que imprimió el compilador. r.area y
   r.mover(10, 5).area dan 12, y new Marco(3, 4).area da 10. */
(function () {

  var TRAITS = [
    "trait Plano {",
    "  def alto: Int",
    "  def ancho: Int",
    "  def area: Int = alto * ancho",
    "}",
    " ",
    "trait Movible {",
    "  def mover(dx: Int, dy: Int): Movible",
    "}"
  ];

  var DECLARACIONES = [
    {
      id: "cuadrado",
      titulo: "Solo Plano, sin alto ni ancho",
      codigo: [
        "class Cuadrado(val lado: Int) extends Plano"
      ],
      compila: false,
      mensaje: [
        "class Cuadrado needs to be abstract.",
        "Missing implementations for 2 members of trait Plano.",
        "  def alto: Int = ???",
        "  def ancho: Int = ???",
        "class Cuadrado(val lado: Int) extends Plano",
        "      ^^^^^^^^"
      ].join("\n"),
      exito: "Plano trae area escrito, y lo escribió a partir de alto y ancho, que no tienen " +
        "cuerpo. Mezclar el trait obliga a dar los dos: el val lado no sirve de nada, porque " +
        "los nombres que area usa son alto y ancho. Con def alto: Int = lado y " +
        "def ancho: Int = lado la clase compila y hereda area sin escribirla.",
      fallo: "Plano deja alto y ancho sin cuerpo, y la clase no los da. Lo único que aporta es " +
        "un val lado, que ningún miembro del trait nombra. El compilador cuenta dos miembros " +
        "sin implementar y exige que la clase se declare abstract o que los complete."
    },
    {
      id: "rectangulo",
      titulo: "Los dos traits, con todo implementado",
      codigo: [
        "class Rectangulo(val x: Int, val y: Int,",
        "                 val alto: Int, val ancho: Int)",
        "    extends Plano with Movible {",
        " ",
        "  def mover(dx: Int, dy: Int): Rectangulo =",
        "    new Rectangulo(x + dx, y + dy, alto, ancho)",
        "}"
      ],
      compila: true,
      mensaje: null,
      exito: "Los val alto y ancho de la cabecera cuentan como implementación de los dos def " +
        "abstractos de Plano, y mover cumple lo que pide Movible. De area no hay nada que " +
        "escribir: el trait ya lo definió, y con alto = 3 y ancho = 4 responde 12.",
      fallo: "Los parámetros declarados con val son miembros, y un val de tipo Int implementa " +
        "un def alto: Int sin cuerpo. Con mover escrito, las dos deudas quedan pagadas y no " +
        "hay nada más que pedir."
    },
    {
      id: "ficha",
      titulo: "Movible sin escribir mover",
      codigo: [
        "class Ficha(val alto: Int, val ancho: Int)",
        "    extends Plano with Movible"
      ],
      compila: false,
      mensaje: [
        "class Ficha needs to be abstract.",
        "Missing implementation for member of trait Movible:",
        "  def mover(dx: Int, dy: Int): Movible = ???",
        "class Ficha(val alto: Int, val ancho: Int)",
        "      ^^^^^"
      ].join("\n"),
      exito: "La parte de Plano está resuelta: los dos val de la cabecera implementan alto y " +
        "ancho, y area viene hecho. Lo que falta es mover, el único miembro de Movible y sin " +
        "cuerpo en el trait. Mezclar un trait no es declarar una intención: cada miembro " +
        "abstracto que se mezcla queda como deuda de la clase.",
      fallo: "Movible declara mover y no lo implementa. Al mezclarlo, Ficha hereda esa deuda y " +
        "no la paga, así que el compilador no la deja ser una clase concreta. El mensaje " +
        "nombra un solo miembro: la parte de Plano sí quedó cubierta por los dos val."
    },
    {
      id: "marco-override",
      titulo: "Redefinir area con override",
      codigo: [
        "class Marco(val alto: Int, val ancho: Int) extends Plano {",
        "  override def area: Int =",
        "    alto * ancho - (alto - 2) * (ancho - 2)",
        "}"
      ],
      compila: true,
      mensaje: null,
      exito: "area ya tenía cuerpo en Plano, y la clase pone otro en su lugar: eso es anular, y " +
        "se escribe con override. Un Marco de 3 por 4 responde 10 con esta definición, donde " +
        "el area heredada habría respondido 12. Las dos deudas de Plano, alto y ancho, las " +
        "pagan los val de la cabecera.",
      fallo: "override es justo lo que el compilador pide para reemplazar un miembro que ya " +
        "tiene cuerpo. Aquí está escrito, los tipos coinciden con los de Plano, y alto y " +
        "ancho quedan implementados por los val de la cabecera."
    },
    {
      id: "marco-sin-override",
      titulo: "Redefinir area sin override",
      codigo: [
        "class Marco(val alto: Int, val ancho: Int) extends Plano {",
        "  def area: Int =",
        "    alto * ancho - (alto - 2) * (ancho - 2)",
        "}"
      ],
      compila: false,
      mensaje: [
        "`override` modifier required to override concrete member:",
        "def area: Int (defined in trait Plano)",
        "  def area: Int = alto * ancho - (alto - 2) * (ancho - 2)",
        "      ^^^^"
      ].join("\n"),
      exito: "Es la misma clase de antes sin la palabra override, y eso basta para que el " +
        "compilador la rechace. Dar cuerpo a un miembro que no lo tenía se escribe sin nada " +
        "delante, como alto y ancho; reemplazar un cuerpo que ya existe exige override, y el " +
        "compilador no acepta que la diferencia se deje al descuido.",
      fallo: "El cuerpo de area ya estaba escrito en Plano. Sin override, el compilador no " +
        "distingue entre reemplazarlo a propósito y haber reusado el nombre por accidente, y " +
        "pide la palabra que lo declara."
    }
  ];

  function buscar(id) {
    var hallado = null;
    DECLARACIONES.forEach(function (d) { if (d.id === id) { hallado = d; } });
    return hallado;
  }

  /* elegido es "compila" o "noCompila". */
  function revisar(id, elegido) {
    var d = buscar(id);
    var esperado = d.compila ? "compila" : "noCompila";
    if (elegido === esperado) {
      return { ok: true, msg: d.exito, mensaje: d.mensaje };
    }
    return { ok: false, msg: d.fallo, mensaje: null };
  }

  function cuantasCompilan() {
    return DECLARACIONES.filter(function (d) { return d.compila; }).length;
  }

  /* ---------- el cierre: r.mover(10, 5).area ---------- */

  var CIERRE = {
    expr: "r.mover(10, 5).area",
    base: "val r = new Rectangulo(0, 0, 3, 4)",
    correcta: "12",
    opciones: ["12", "50", "117", "no compila: Movible no tiene area"],
    exito: "mover construye un Rectangulo con x e y corridos y las dimensiones intactas, " +
      "Rectangulo(en 10,5; 3x4), y area las multiplica: 3 por 4. Mover no cambia el área, y " +
      "el cuerpo que la calcula está escrito una sola vez, en el trait.",
    fallo: {
      "50": "El 10 y el 5 son el desplazamiento, y entran a x e y. Los que area multiplica son " +
        "alto y ancho, que mover pasa sin tocar: new Rectangulo(x + dx, y + dy, alto, ancho).",
      "117": "Los dos argumentos de mover no se suman a las dimensiones. Se suman a la posición: " +
        "x + dx y y + dy. alto y ancho viajan como estaban.",
      "no compila: Movible no tiene area": "Eso dependería de cómo se declare el tipo de " +
        "retorno de mover. Movible lo declara devolviendo Movible, y con ese tipo copiado en la " +
        "clase el compilador responde: value area is not a member of Movible. La clase declara " +
        "def mover(dx: Int, dy: Int): Rectangulo, un tipo más preciso que el del trait, y un " +
        "Rectangulo sí tiene area."
    }
  };

  var API = {
    TRAITS: TRAITS, DECLARACIONES: DECLARACIONES, buscar: buscar, revisar: revisar,
    cuantasCompilan: cuantasCompilan, CIERRE: CIERRE
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ================= la página ================= */

  var VEREDICTOS = [
    { clave: "compila", rotulo: "Compila" },
    { clave: "noCompila", rotulo: "No compila" }
  ];

  function panelCodigo(lineas) {
    var panel = document.createElement("div");
    panel.className = "codigo";
    lineas.forEach(function (texto, i) {
      var div = document.createElement("div");
      div.className = "linea";
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = String(i + 1);
      var txt = document.createElement("span");
      txt.className = "txt";
      txt.textContent = texto;
      div.appendChild(num);
      div.appendChild(txt);
      panel.appendChild(div);
    });
    return panel;
  }

  var resueltas = {};

  function contar() {
    var n = 0;
    DECLARACIONES.forEach(function (d) { if (resueltas[d.id]) { n = n + 1; } });
    return n;
  }

  function construir() {
    document.getElementById("traits").appendChild(panelCodigo(TRAITS));

    var caja = document.getElementById("declaraciones");
    DECLARACIONES.forEach(function (d, i) {
      var bloque = document.createElement("div");
      bloque.className = "declaracion";
      bloque.id = "decl-" + d.id;

      var h = document.createElement("h3");
      h.textContent = (i + 1) + ". " + d.titulo;
      bloque.appendChild(h);

      bloque.appendChild(panelCodigo(d.codigo));

      var ops = document.createElement("div");
      ops.className = "opciones";
      VEREDICTOS.forEach(function (v) {
        var b = document.createElement("button");
        b.textContent = v.rotulo;
        b.setAttribute("data-decl", d.id);
        b.setAttribute("data-veredicto", v.clave);
        ops.appendChild(b);
      });
      bloque.appendChild(ops);

      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "ver-" + d.id;
      bloque.appendChild(ver);

      var pre = document.createElement("pre");
      pre.className = "salida";
      pre.id = "salida-" + d.id;
      bloque.appendChild(pre);

      caja.appendChild(bloque);
    });
  }

  function alElegir(boton) {
    var id = boton.getAttribute("data-decl");
    var res = revisar(id, boton.getAttribute("data-veredicto"));
    var ver = document.getElementById("ver-" + id);
    var pre = document.getElementById("salida-" + id);
    var bloque = document.getElementById("decl-" + id);

    bloque.querySelectorAll("[data-decl]").forEach(function (o) { o.className = ""; });
    boton.className = res.ok ? "primario" : "errada";
    ver.className = res.ok ? "veredicto bien" : "veredicto mal";
    ver.textContent = res.msg;

    if (res.ok && res.mensaje !== null) {
      pre.textContent = res.mensaje;
      pre.classList.add("visible");
    } else {
      pre.textContent = "";
      pre.classList.remove("visible");
    }
    if (res.ok) {
      resueltas[id] = true;
      bloque.classList.add("listo");
    }
    document.getElementById("contador").textContent =
      "declaraciones clasificadas: " + contar() + " de " + DECLARACIONES.length;
    if (contar() === DECLARACIONES.length) {
      document.getElementById("carta-cierre").classList.remove("bloqueado");
      document.getElementById("cuantas").textContent =
        "De las cinco, " + cuantasCompilan() + " compilan.";
    }
  }

  function construirCierre() {
    var caja = document.getElementById("opciones-cierre");
    CIERRE.opciones.forEach(function (o) {
      var b = document.createElement("button");
      b.textContent = o;
      b.setAttribute("data-cierre", o);
      caja.appendChild(b);
    });
  }

  construir();
  construirCierre();
  document.getElementById("contador").textContent =
    "declaraciones clasificadas: 0 de " + DECLARACIONES.length;

  document.querySelectorAll("[data-veredicto]").forEach(function (b) {
    b.addEventListener("click", function () { alElegir(b); });
  });

  document.querySelectorAll("[data-cierre]").forEach(function (b) {
    b.addEventListener("click", function () {
      var elegida = b.getAttribute("data-cierre");
      var v = document.getElementById("veredicto-cierre");
      document.querySelectorAll("[data-cierre]").forEach(function (o) { o.className = ""; });
      if (elegida === CIERRE.correcta) {
        b.className = "primario";
        v.className = "veredicto bien";
        v.textContent = CIERRE.exito;
        document.getElementById("carta-final").classList.remove("bloqueado");
      } else {
        b.className = "errada";
        v.className = "veredicto mal";
        v.textContent = CIERRE.fallo[elegida];
      }
    });
  });
})();
