/* sustitucion: el modelo de sustitución aplicado a
   new Racional(1,2).menorQue(new Racional(2,3)). El estudiante produce cada
   reescritura antes de verla: primero la pareja de sustituciones, después la
   expresión con los selectores expandidos, los enteros, la aritmética y el
   Boolean. Cierra con r1 max r2, que elige entre r y this sin construir nada.
   El código y la traza de seis pasos salen de FuncionesDatos.tex, frames
   "Extendiendo el modelo de sustitución" y "Ejemplo: Evaluación paso a paso",
   con los métodos de 03_racional_simplificacion.scala. */
(function () {
  function mcd(a, b) {
    if (b === 0) { return a; }
    return mcd(b, a % b);
  }

  /* Un Racional como lo deja 03_racional_simplificacion.scala: el mcd se
     calcula una vez y numer/denom ya vienen divididos por él. */
  function racional(x, y) {
    var m = mcd(Math.abs(x), y);
    return {
      x: x,
      y: y,
      numer: x / m,
      denom: y / m,
      fuente: "new Racional(" + x + ", " + y + ")",
      texto: (x / m) + "/" + (y / m)
    };
  }

  function menorQue(r, s) {
    return r.numer * s.denom < r.denom * s.numer;
  }

  /* max no construye: devuelve r o devuelve this. */
  function maxDe(r, s) {
    if (menorQue(r, s)) { return { rama: "r", objeto: s }; }
    return { rama: "this", objeto: r };
  }

  var PRESETS = [
    { rotulo: "new Racional(1, 2).menorQue(new Racional(2, 3))", r1: racional(1, 2), r2: racional(2, 3) },
    { rotulo: "new Racional(3, 4).menorQue(new Racional(2, 3))", r1: racional(3, 4), r2: racional(2, 3) },
    { rotulo: "new Racional(2, 4).menorQue(new Racional(2, 3))", r1: racional(2, 4), r2: racional(2, 3) }
  ];

  /* Los cuatro enteros del paso 4, en el orden en que aparecen. */
  function enterosPaso4(p) {
    return [p.r1.numer, p.r2.denom, p.r1.denom, p.r2.numer];
  }

  /* Los dos productos del paso 5. */
  function productosPaso5(p) {
    return [p.r1.numer * p.r2.denom, p.r1.denom * p.r2.numer];
  }

  function resultado(p) {
    return menorQue(p.r1, p.r2);
  }

  /* La traza completa, una fila por reescritura. */
  function pasos(p) {
    var e = enterosPaso4(p);
    var q = productosPaso5(p);
    return [
      { n: 1, expr: "r1.menorQue(r2)",
        nota: "r1 = " + p.r1.fuente + ", r2 = " + p.r2.fuente },
      { n: 2, expr: "this.numer * r.denom < this.denom * r.numer",
        nota: "[r2/r][r1/this]" },
      { n: 3, expr: "r1.numer * r2.denom < r1.denom * r2.numer",
        nota: "expandiendo selectores" },
      { n: 4, expr: e[0] + " * " + e[1] + " < " + e[2] + " * " + e[3],
        nota: "evaluando los enteros" },
      { n: 5, expr: q[0] + " < " + q[1],
        nota: "operación aritmética" },
      { n: 6, expr: String(resultado(p)),
        nota: "resultado final" }
    ];
  }

  /* El arranque: new Racional(1,2).numer sobre la versión con def numer = x. */
  function ejemplo1(x, y) {
    return {
      pasos: [
        { n: 1, expr: "new Racional(" + x + "," + y + ").numer", nota: "—" },
        { n: 2, expr: "x", nota: "[" + x + "/x, " + y + "/y][new Racional(" + x + "," + y + ")/this]" },
        { n: 3, expr: String(x), nota: "resultado final" }
      ],
      valor: x
    };
  }

  var OPCIONES_ARRANQUE = [
    { txt: "x, con [1/x, 2/y][new Racional(1,2)/this]", ok: true },
    { txt: "1/2", ok: false,
      msg: "Así se imprime el racional completo. La sustitución reemplaza la llamada por el cuerpo del miembro, y el cuerpo de numer es x." },
    { txt: "new Racional(1,2).x", ok: false,
      msg: "El punto no alcanza a x: es el parámetro de la clase y vive dentro del cuerpo. Lo que queda tras la sustitución es ese cuerpo, x, y sobre él caen [1/x, 2/y]." }
  ];

  var OPCIONES_P2 = [
    { txt: "[r2/r][r1/this]", ok: true },
    { txt: "[r1/r][r2/this]", ok: false,
      msg: "Al revés. r es el parámetro de menorQue y recibe el argumento, que es r2; this es el objeto que está a la izquierda del punto, r1." },
    { txt: "[r2/r][r2/this]", ok: false,
      msg: "r2 entra como argumento, sí, pero el método lo ejecuta el objeto de la izquierda: this se reemplaza por r1." }
  ];

  var OPCIONES_P3 = [
    { txt: "r1.numer * r2.denom < r1.denom * r2.numer", ok: true },
    { txt: "r2.numer * r1.denom < r2.denom * r1.numer", ok: false,
      msg: "Esa versión pregunta si r2 es menor que r1. En el cuerpo this va primero en cada producto, y this quedó reemplazado por r1." },
    { txt: "r1.numer * r1.denom < r2.numer * r2.denom", ok: false,
      msg: "Ahí cada racional se multiplica consigo mismo. La comparación cruza los dos: el numerador de uno con el denominador del otro." }
  ];

  /* Las tres opciones del cierre: devolver r, devolver this, o construir. */
  function opcionesMax(p) {
    var m = maxDe(p.r1, p.r2);
    return [
      { txt: "Devuelve r, que es el objeto r2 (" + p.r2.texto + ").",
        ok: m.rama === "r",
        msg: "menorQue dio false, así que el if toma el else y devuelve this, el objeto r1 (" + p.r1.texto + ")." },
      { txt: "Devuelve this, que es el objeto r1 (" + p.r1.texto + ").",
        ok: m.rama === "this",
        msg: "menorQue dio true, así que el if toma la primera rama y devuelve r, el objeto r2 (" + p.r2.texto + ")." },
      { txt: "Construye un new Racional con el numerador y el denominador mayores.",
        ok: false,
        msg: "El cuerpo de max no tiene ningún new: su if elige entre dos expresiones, r y this, y las dos nombran objetos que ya existen." }
    ];
  }

  function cierreMax(p) {
    var m = maxDe(p.r1, p.r2);
    return {
      rama: m.rama,
      objeto: m.objeto.texto,
      resultado: resultado(p),
      expr: "r1 max r2",
      reduccion: resultado(p)
        ? "if (true) r else this  ->  r  ->  " + p.r2.texto
        : "if (false) r else this  ->  this  ->  " + p.r1.texto
    };
  }

  var API = {
    mcd: mcd, racional: racional, menorQue: menorQue, maxDe: maxDe,
    PRESETS: PRESETS, pasos: pasos, ejemplo1: ejemplo1,
    enterosPaso4: enterosPaso4, productosPaso5: productosPaso5,
    resultado: resultado, cierreMax: cierreMax, opcionesMax: opcionesMax,
    OPCIONES_ARRANQUE: OPCIONES_ARRANQUE, OPCIONES_P2: OPCIONES_P2, OPCIONES_P3: OPCIONES_P3
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0;
  var resueltos = 1;
  var abiertaTres = false;
  var abiertaCuatro = false;

  function veredicto(id, ok, texto) {
    var v = document.getElementById(id);
    v.className = "veredicto " + (ok ? "bien" : "mal");
    v.textContent = texto;
  }

  function limpiar(id) {
    var v = document.getElementById(id);
    v.className = "veredicto";
    v.textContent = "";
  }

  function celda(texto, clase) {
    var td = document.createElement("td");
    if (clase) { td.className = clase; }
    td.textContent = texto;
    return td;
  }

  function botonesOpcion(lista, manejar) {
    var caja = document.createElement("div");
    caja.className = "opciones-paso";
    lista.forEach(function (o, i) {
      var b = document.createElement("button");
      b.textContent = o.txt;
      b.addEventListener("click", function () { manejar(i, b); });
      caja.appendChild(b);
    });
    return caja;
  }

  function entrada(id) {
    var inp = document.createElement("input");
    inp.type = "number";
    inp.id = id;
    inp.placeholder = "?";
    return inp;
  }

  /* Los cuatro enteros del paso 4 y los dos del paso 5, como casillas. */
  function cajasNumericas(cuantas, separadores, idBase, comprobar) {
    var caja = document.createElement("div");
    caja.className = "casillas";
    var i;
    for (i = 0; i < cuantas; i = i + 1) {
      caja.appendChild(entrada(idBase + i));
      if (i < separadores.length) {
        caja.appendChild(document.createTextNode(" " + separadores[i] + " "));
      }
    }
    var b = document.createElement("button");
    b.className = "primario";
    b.textContent = "Comprobar";
    b.addEventListener("click", comprobar);
    caja.appendChild(b);
    return caja;
  }

  function revisarNumeros(idBase, esperados) {
    var malas = 0, vacias = 0, i, inp, v;
    for (i = 0; i < esperados.length; i = i + 1) {
      inp = document.getElementById(idBase + i);
      v = parseInt(inp.value, 10);
      if (isNaN(v)) {
        vacias = vacias + 1;
        inp.className = "";
      } else {
        inp.className = v === esperados[i] ? "bien" : "mal";
        if (v !== esperados[i]) { malas = malas + 1; }
      }
    }
    return { malas: malas, vacias: vacias };
  }

  function avanzar(texto) {
    resueltos = resueltos + 1;
    construirTabla();
    veredicto("veredicto-pasos", true, texto);
    if (resueltos === 6) {
      abiertaTres = true;
      construirCierre();
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  }

  function widgetPaso(n) {
    var p = PRESETS[actual];
    if (n === 2) {
      return botonesOpcion(OPCIONES_P2, function (i, b) {
        if (OPCIONES_P2[i].ok) {
          avanzar("Correcto. r recibe el argumento r2 y this es el objeto que ejecuta el método, r1.");
        } else {
          b.className = "marcado";
          veredicto("veredicto-pasos", false, OPCIONES_P2[i].msg);
        }
      });
    }
    if (n === 3) {
      return botonesOpcion(OPCIONES_P3, function (i, b) {
        if (OPCIONES_P3[i].ok) {
          avanzar("Correcto. Cada this quedó en r1 y cada r en r2, y los selectores siguen sin evaluarse.");
        } else {
          b.className = "marcado";
          veredicto("veredicto-pasos", false, OPCIONES_P3[i].msg);
        }
      });
    }
    if (n === 4) {
      return cajasNumericas(4, ["*", "<", "*"], "p4-", function () {
        var r = revisarNumeros("p4-", enterosPaso4(PRESETS[actual]));
        if (r.vacias > 0) {
          veredicto("veredicto-pasos", false, "Faltan " + r.vacias + " casillas.");
        } else if (r.malas === 0) {
          avanzar("Correcto. Cada selector se cambió por el valor del miembro, ya simplificado por el mcd del constructor.");
        } else {
          veredicto("veredicto-pasos", false,
            r.malas + " casilla(s) en rojo. El orden es numer de r1, denom de r2, denom de r1, numer de r2, y los cuatro valores salen de numer y denom, no de los números con que se escribió el new.");
        }
      });
    }
    if (n === 5) {
      return cajasNumericas(2, ["<"], "p5-", function () {
        var r = revisarNumeros("p5-", productosPaso5(PRESETS[actual]));
        if (r.vacias > 0) {
          veredicto("veredicto-pasos", false, "Faltan " + r.vacias + " casillas.");
        } else if (r.malas === 0) {
          avanzar("Correcto. Quedan dos enteros y un <.");
        } else {
          veredicto("veredicto-pasos", false, "Cada lado es el producto de los dos enteros de su lado del <.");
        }
      });
    }
    return botonesOpcion(
      [{ txt: "true", ok: resultado(p) }, { txt: "false", ok: !resultado(p) }],
      function (i, b) {
        var esTrue = i === 0;
        if (esTrue === resultado(PRESETS[actual])) {
          avanzar("Correcto. El < sobre dos Int devuelve un Boolean, y esa es la forma final de la expresión con que empezó la traza.");
        } else {
          b.className = "marcado";
          veredicto("veredicto-pasos", false,
            "Compare los dos enteros del paso anterior: el de la izquierda del < contra el de la derecha.");
        }
      }
    );
  }

  function construirTabla() {
    var p = PRESETS[actual];
    var filas = pasos(p);
    var cuerpo = document.getElementById("cuerpo-pasos");
    cuerpo.innerHTML = "";
    filas.forEach(function (f, i) {
      var tr = document.createElement("tr");
      var tdExpr, tdNota;
      tr.appendChild(celda(String(f.n)));
      if (i < resueltos) {
        tr.className = "lista";
        tr.appendChild(celda(f.expr, "expr"));
        tr.appendChild(celda(f.nota, "nota-paso"));
      } else if (i === resueltos) {
        tr.className = "activa";
        tdExpr = document.createElement("td");
        tdExpr.className = "expr";
        tdNota = document.createElement("td");
        tdNota.className = "nota-paso";
        if (f.n === 2) {
          tdExpr.textContent = f.expr;
          tdNota.appendChild(widgetPaso(2));
        } else {
          tdExpr.appendChild(widgetPaso(f.n));
          tdNota.textContent = f.nota;
        }
        tr.appendChild(tdExpr);
        tr.appendChild(tdNota);
      } else {
        tr.appendChild(celda("?", "expr pend"));
        tr.appendChild(celda("—", "nota-paso pend"));
      }
      cuerpo.appendChild(tr);
    });
    document.getElementById("progreso-pasos").textContent =
      "reescrituras producidas: " + (resueltos - 1) + " de 5";
  }

  function construirCierre() {
    var p = PRESETS[actual];
    var c = cierreMax(p);
    var caja = document.getElementById("opciones-max");
    var lista = opcionesMax(p);
    caja.innerHTML = "";
    document.getElementById("estado-menorque").textContent =
      "r1 menorQue r2 acaba de dar " + c.resultado + ".";
    document.getElementById("reduccion-max").textContent = "";
    caja.appendChild(botonesOpcion(lista, function (i, b) {
      if (lista[i].ok) {
        veredicto("veredicto-max", true,
          "Eso es. El if elige la rama " + c.rama + " y devuelve el objeto " + c.objeto +
          ", que ya estaba construido: en toda la reducción no aparece ningún new.");
        document.getElementById("reduccion-max").textContent = c.reduccion;
        if (!abiertaCuatro) {
          abiertaCuatro = true;
          document.getElementById("carta-cierre").classList.remove("bloqueado");
        }
      } else {
        b.className = "marcado";
        veredicto("veredicto-max", false, lista[i].msg);
      }
    }));
    limpiar("veredicto-max");
  }

  function reiniciarPasos() {
    resueltos = 1;
    construirTabla();
    limpiar("veredicto-pasos");
    if (abiertaTres) {
      abiertaTres = false;
      document.getElementById("carta-tres").classList.add("bloqueado");
      limpiar("veredicto-max");
      document.getElementById("reduccion-max").textContent = "";
    }
  }

  document.querySelectorAll("[data-arranque]").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = parseInt(b.getAttribute("data-arranque"), 10);
      var o = OPCIONES_ARRANQUE[i];
      document.querySelectorAll("[data-arranque]").forEach(function (x) { x.className = ""; });
      b.className = o.ok ? "primario" : "marcado";
      if (o.ok) {
        veredicto("veredicto-arranque", true,
          "El cuerpo de numer es x; sobre ese cuerpo caen [1/x, 2/y] y queda " +
          ejemplo1(1, 2).valor + ". Tres pasos y ninguna operación aritmética.");
      } else {
        veredicto("veredicto-arranque", false, o.msg);
      }
    });
  });

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      actual = parseInt(b.getAttribute("data-preset"), 10);
      document.getElementById("nota-preset").textContent = PRESETS[actual].rotulo;
      reiniciarPasos();
    });
  });

  document.getElementById("btn-reiniciar-pasos").addEventListener("click", reiniciarPasos);
  document.getElementById("nota-preset").textContent = PRESETS[actual].rotulo;
  construirTabla();
})();
