/* punto2d: seis expresiones sobre class Punto(val x: Double, val y: Double).
   El estudiante escribe el tipo y el valor de cada una antes de ver la
   corrida, y después sigue paso a paso qué cuerpo se ejecuta. El código y los
   valores salen de 05_punto2d.scala y del frame "Otro ejemplo: Clase Punto
   en 2D" de FuncionesDatos.tex. */
(function () {
  var CODIGO = [
    { txt: "class Punto(val x: Double, val y: Double) {", num: 1, bloque: 1 },
    { txt: "  def +(p: Punto): Punto = new Punto(x + p.x, y + p.y)", num: 2, bloque: 2 },
    { txt: " ", num: null },
    { txt: "  def distancia(p: Punto): Double = {", num: 3, bloque: 3 },
    { txt: "    val dx = x - p.x", num: 4, bloque: 3 },
    { txt: "    val dy = y - p.y", num: 5, bloque: 3 },
    { txt: "    math.sqrt(dx * dx + dy * dy)", num: 6, bloque: 3 },
    { txt: "  }", num: null, bloque: 3 },
    { txt: " ", num: null },
    { txt: "  override def toString: String = \"(\" + x + \", \" + y + \")\"", num: 7 },
    { txt: "}", num: null }
  ];

  /* Como escribe Scala un Double: 5 sale 5.0, y 2.5 sale 2.5. */
  function textoDouble(v) {
    if (isFinite(v) && v === Math.floor(v)) { return v.toFixed(1); }
    return String(v);
  }

  function nuevoPunto(x, y) { return { x: x, y: y }; }

  function mas(a, b) { return nuevoPunto(a.x + b.x, a.y + b.y); }

  function distancia(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function comoTexto(p) { return "(" + textoDouble(p.x) + ", " + textoDouble(p.y) + ")"; }

  var P1 = nuevoPunto(1, 2);
  var P2 = nuevoPunto(4, 6);
  var SUMA = mas(P1, P2);

  var FILAS = [
    { expr: "p1.x", tipo: "Double", esperado: textoDouble(P1.x),
      que: "lee el campo de la cabecera" },
    { expr: "p1 + p2", tipo: "Punto", esperado: comoTexto(SUMA),
      que: "el método +, y el toString del resultado" },
    { expr: "p1 distancia p2", tipo: "Double", esperado: textoDouble(distancia(P1, P2)),
      que: "dx y dy desde p1" },
    { expr: "p2 distancia p1", tipo: "Double", esperado: textoDouble(distancia(P2, P1)),
      que: "dx y dy desde p2" },
    { expr: "(p1 + p2).x", tipo: "Double", esperado: textoDouble(mas(P1, P2).x),
      que: "el + otra vez, y después el campo x" },
    { expr: "p1", tipo: "Punto", esperado: comoTexto(P1),
      que: "toString, después de haber sumado" }
  ];

  var TIPOS = ["Int", "Double", "Punto", "no compila"];

  function normalizar(t) { return String(t).replace(/\s+/g, ""); }

  function sinCeroDecimal(t) { return normalizar(t).replace(/\.0(?!\d)/g, ""); }

  /* bien: escrito como lo escribe Scala. casi: los números son los correctos
     pero van sin el decimal. mal: otro valor. */
  function revisar(i, texto) {
    var esperado = FILAS[i].esperado;
    var n = normalizar(texto);
    if (n === "") { return "vacio"; }
    if (n === normalizar(esperado)) { return "bien"; }
    if (sinCeroDecimal(n) === sinCeroDecimal(esperado)) { return "casi"; }
    return "mal";
  }

  /* Un paso por cuerpo que se ejecuta. fila es la expresión a la que
     pertenece el paso; cierra es la expresión cuyo valor queda listo. */
  function simular() {
    var pasos = [];
    var dxA = P1.x - P2.x, dyA = P1.y - P2.y;
    var dxB = P2.x - P1.x, dyB = P2.y - P1.y;
    var nuevo = "new Punto(" + textoDouble(SUMA.x) + ", " + textoDouble(SUMA.y) + ")";

    function paso(o) {
      pasos.push({
        linea: o.linea,
        fila: o.fila === undefined ? null : o.fila,
        cierra: o.cierra === undefined ? null : o.cierra,
        evaluando: o.evaluando,
        dx: o.dx === undefined ? null : textoDouble(o.dx),
        dy: o.dy === undefined ? null : textoDouble(o.dy),
        valor: o.valor === undefined ? null : o.valor,
        nota: o.nota
      });
    }

    paso({ linea: 1, evaluando: "new Punto(1, 2)", valor: comoTexto(P1),
      nota: "val p1 = new Punto(1, 2). Los parámetros son Double, así que el 1 entra como "
        + textoDouble(P1.x) + " y el 2 como " + textoDouble(P1.y) + "." });
    paso({ linea: 1, evaluando: "new Punto(4, 6)", valor: comoTexto(P2),
      nota: "val p2 = new Punto(4, 6): x vale " + textoDouble(P2.x) + " y y vale "
        + textoDouble(P2.y) + "." });
    paso({ linea: 1, fila: 0, cierra: 0, evaluando: "p1.x", valor: textoDouble(P1.x),
      nota: "p1.x no ejecuta ningún cuerpo: lee el campo que declaró la cabecera. Responde "
        + textoDouble(P1.x) + ", de tipo Double." });

    paso({ linea: 2, fila: 1, evaluando: "p1 + p2",
      nota: "El método + suma componente a componente: x + p.x = " + textoDouble(P1.x)
        + " + " + textoDouble(P2.x) + ", y + p.y = " + textoDouble(P1.y) + " + "
        + textoDouble(P2.y) + "." });
    paso({ linea: 1, fila: 1, evaluando: nuevo, valor: comoTexto(SUMA),
      nota: "El + construye un Punto nuevo. p1 y p2 quedan como estaban." });
    paso({ linea: 7, fila: 1, cierra: 1, evaluando: "p1 + p2", valor: comoTexto(SUMA),
      nota: "El REPL escribe el resultado con toString: " + comoTexto(SUMA)
        + ", de tipo Punto." });

    paso({ linea: 3, fila: 2, evaluando: "p1 distancia p2",
      nota: "p1 distancia p2 es p1.distancia(p2): el x de adentro es el de p1, y p.x es "
        + "el de p2." });
    paso({ linea: 4, fila: 2, dx: dxA, evaluando: "p1 distancia p2",
      nota: "dx = " + textoDouble(P1.x) + " - " + textoDouble(P2.x) + " = "
        + textoDouble(dxA) + "." });
    paso({ linea: 5, fila: 2, dx: dxA, dy: dyA, evaluando: "p1 distancia p2",
      nota: "dy = " + textoDouble(P1.y) + " - " + textoDouble(P2.y) + " = "
        + textoDouble(dyA) + "." });
    paso({ linea: 6, fila: 2, dx: dxA, dy: dyA, cierra: 2,
      valor: textoDouble(distancia(P1, P2)), evaluando: "p1 distancia p2",
      nota: "math.sqrt(" + textoDouble(dxA * dxA) + " + " + textoDouble(dyA * dyA) + ") = "
        + textoDouble(distancia(P1, P2)) + "." });

    paso({ linea: 3, fila: 3, evaluando: "p2 distancia p1",
      nota: "La misma llamada al revés: ahora el x de adentro es el de p2, y p.x es el de p1." });
    paso({ linea: 4, fila: 3, dx: dxB, evaluando: "p2 distancia p1",
      nota: "dx = " + textoDouble(P2.x) + " - " + textoDouble(P1.x) + " = " + textoDouble(dxB)
        + ", el opuesto del anterior." });
    paso({ linea: 5, fila: 3, dx: dxB, dy: dyB, evaluando: "p2 distancia p1",
      nota: "dy = " + textoDouble(P2.y) + " - " + textoDouble(P1.y) + " = "
        + textoDouble(dyB) + "." });
    paso({ linea: 6, fila: 3, dx: dxB, dy: dyB, cierra: 3,
      valor: textoDouble(distancia(P2, P1)), evaluando: "p2 distancia p1",
      nota: "Los cuadrados borran el signo: " + textoDouble(dxB * dxB) + " + "
        + textoDouble(dyB * dyB) + " es la misma suma de antes, y la raíz da "
        + textoDouble(distancia(P2, P1)) + "." });

    paso({ linea: 2, fila: 4, evaluando: "(p1 + p2).x",
      nota: "El paréntesis obliga a correr el + primero: el método entra por segunda vez." });
    paso({ linea: 1, fila: 4, evaluando: nuevo, valor: comoTexto(SUMA),
      nota: "Vuelve a construirse " + comoTexto(SUMA) + ", un objeto distinto al de la "
        + "corrida anterior." });
    paso({ linea: 1, fila: 4, cierra: 4, evaluando: "(p1 + p2).x", valor: textoDouble(SUMA.x),
      nota: "Sobre ese Punto, .x lee el campo: " + textoDouble(SUMA.x)
        + ". El resultado es un Double, no un Punto." });

    paso({ linea: 7, fila: 5, cierra: 5, evaluando: "p1", valor: comoTexto(P1),
      nota: "p1 se escribe otra vez y sigue en " + comoTexto(P1)
        + ": el + construyó, no modificó." });

    return pasos;
  }

  var API = {
    CODIGO: CODIGO, FILAS: FILAS, TIPOS: TIPOS,
    textoDouble: textoDouble, nuevoPunto: nuevoPunto, mas: mas,
    distancia: distancia, comoTexto: comoTexto,
    P1: P1, P2: P2, revisar: revisar, simular: simular
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function construirTabla() {
    var cuerpo = document.getElementById("cuerpo-tabla");
    cuerpo.innerHTML = "";
    FILAS.forEach(function (f, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;

      var tdExpr = document.createElement("td");
      tdExpr.className = "expr";
      tdExpr.textContent = f.expr;
      tr.appendChild(tdExpr);

      var tdTipo = document.createElement("td");
      var sel = document.createElement("select");
      sel.id = "tipo-" + i;
      var vacia = document.createElement("option");
      vacia.value = "";
      vacia.textContent = "?";
      sel.appendChild(vacia);
      TIPOS.forEach(function (t) {
        var op = document.createElement("option");
        op.value = t;
        op.textContent = t;
        sel.appendChild(op);
      });
      tdTipo.appendChild(sel);
      tr.appendChild(tdTipo);

      var tdValor = document.createElement("td");
      var inp = document.createElement("input");
      inp.type = "text";
      inp.id = "valor-" + i;
      inp.placeholder = "?";
      tdValor.appendChild(inp);
      var real = document.createElement("span");
      real.className = "real";
      real.id = "real-" + i;
      tdValor.appendChild(real);
      tr.appendChild(tdValor);

      var tdQue = document.createElement("td");
      tdQue.className = "que";
      tdQue.textContent = f.que;
      tr.appendChild(tdQue);

      cuerpo.appendChild(tr);
    });
  }

  function comprobar() {
    var vacias = 0, malTipo = 0, malValor = 0, casiValor = 0;
    FILAS.forEach(function (f, i) {
      var sel = document.getElementById("tipo-" + i);
      var inp = document.getElementById("valor-" + i);
      var estado = revisar(i, inp.value);
      if (sel.value === "") {
        vacias = vacias + 1;
        sel.className = "";
      } else if (sel.value === f.tipo) {
        sel.className = "bien";
      } else {
        sel.className = "mal";
        malTipo = malTipo + 1;
      }
      if (estado === "vacio") {
        vacias = vacias + 1;
        inp.className = "";
      } else {
        inp.className = estado;
        if (estado === "mal") { malValor = malValor + 1; }
        if (estado === "casi") { casiValor = casiValor + 1; }
      }
    });

    var v = document.getElementById("veredicto");
    var partes = [];
    if (vacias > 0) {
      v.className = "veredicto mal";
      v.textContent = "Faltan " + vacias + " casillas.";
      return;
    }
    if (malTipo === 0 && malValor === 0 && casiValor === 0) {
      v.className = "veredicto bien";
      v.textContent = "Correcto, con los decimales incluidos. p1.x responde " + FILAS[0].esperado
        + " porque la cabecera declara val x: Double, y las dos distancias dan "
        + FILAS[2].esperado + " porque dx y dy solo cambian de signo.";
    } else {
      if (casiValor > 0) {
        partes.push(casiValor + " valor(es) en ámbar: el número es el que es, y lo que falta "
          + "es el decimal. x e y son Double, así que el literal 1 entra convertido y el REPL "
          + "escribe 1.0.");
      }
      if (malTipo > 0) {
        partes.push(malTipo + " tipo(s) en rojo: p1.x y (p1 + p2).x leen un campo Double; "
          + "p1 + p2 y p1 son Punto, y lo que se ve de ellos es su toString.");
      }
      if (malValor > 0) {
        partes.push(malValor + " valor(es) en rojo: dx y dy salen del punto de la izquierda "
          + "menos el de la derecha, y el + construye un Punto nuevo sin tocar a p1.");
      }
      v.className = "veredicto mal";
      v.textContent = partes.join(" ");
    }
    document.getElementById("carta-racional").classList.remove("bloqueado");
  }

  function pintar(e) {
    var revelados = {}, m, p;
    for (m = 0; m < e.k; m = m + 1) {
      p = e.pasos[m];
      if (p.cierra !== null) { revelados[p.cierra] = p.valor; }
    }
    FILAS.forEach(function (f, i) {
      var tr = document.getElementById("fila-" + i);
      var real = document.getElementById("real-" + i);
      if (!tr || !real) { return; }
      if (e.actual && e.actual.fila === i) {
        tr.classList.add("actual");
      } else {
        tr.classList.remove("actual");
      }
      real.textContent = revelados[i] === undefined ? "" : "= " + revelados[i];
    });
    document.getElementById("pie").textContent = e.actual
      ? e.actual.nota
      : "La corrida crea los dos puntos y después evalúa las seis expresiones de la tabla, "
        + "en el mismo orden.";
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: null,
    chips: [
      { campo: "evaluando", rotulo: "evaluando" },
      { campo: "dx", rotulo: "dx" },
      { campo: "dy", rotulo: "dy" },
      { campo: "valor", rotulo: "valor", clase: "cuenta" }
    ],
    simular: simular,
    alPintar: pintar
  });

  document.getElementById("btn-comprobar").addEventListener("click", comprobar);
  construirTabla();
  Motor.repintar();

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-racional");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. El val de la cabecera de Punto declara el campo y lo deja "
          + "público; la cabecera de Racional no lo lleva, y x vive solo dentro del cuerpo de "
          + "la clase. Hacia afuera, Racional ofrece numer y denom.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });
})();
