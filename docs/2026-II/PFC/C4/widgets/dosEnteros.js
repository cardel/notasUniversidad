/* dosEnteros: cuatro candidatas para numR, todas de tipo Int y todas
   compilables. El código de las dos columnas es el del frame
   "Ejemplo motivacional: Números racionales" de FuncionesDatos.tex. */
(function () {
  /* Cada candidata arma numerador y denominador del resultado a partir de
     los cuatro enteros sueltos de a/b + c/d. */
  var CANDIDATAS = [
    {
      id: "propio",
      exprNum: "num1*den1 + num2*den2",
      exprDen: "den1 * den2",
      numer: function (a, b, c, d) { return a * b + c * d; },
      denom: function (a, b, c, d) { return b * d; }
    },
    {
      id: "cruzado",
      exprNum: "num1*den2 + num2*den1",
      exprDen: "den1 * den2",
      numer: function (a, b, c, d) { return a * d + c * b; },
      denom: function (a, b, c, d) { return b * d; }
    },
    {
      id: "tipos",
      exprNum: "num1*num2 + den1*den2",
      exprDen: "den1 * den2",
      numer: function (a, b, c, d) { return a * c + b * d; },
      denom: function (a, b, c, d) { return b * d; }
    },
    {
      id: "directo",
      exprNum: "num1 + num2",
      exprDen: "den1 + den2",
      numer: function (a, b, c, d) { return a + c; },
      denom: function (a, b, c, d) { return b + d; }
    }
  ];

  var PARES = [
    { txt: "1/2 + 2/3", a: 1, b: 2, c: 2, d: 3 },
    { txt: "3/4 + 5/7", a: 3, b: 4, c: 5, d: 7 },
    { txt: "2/5 + 7/3", a: 2, b: 5, c: 7, d: 3 },
    { txt: "1/2 + 1/2", a: 1, b: 2, c: 1, d: 2 }
  ];

  /* La suma de a/b + c/d, sin simplificar. */
  function suma(par) {
    return { num: par.a * par.d + par.c * par.b, den: par.b * par.d };
  }

  function mismaFraccion(x, y) {
    return x.num * y.den === y.num * x.den;
  }

  function valor(fr) {
    return fr.num / fr.den;
  }

  function buscar(id) {
    var hallada = null;
    CANDIDATAS.forEach(function (k) { if (k.id === id) { hallada = k; } });
    return hallada;
  }

  /* Qué entrega una candidata con un par concreto. */
  function evaluar(id, par) {
    var k = buscar(id);
    var fr = {
      num: k.numer(par.a, par.b, par.c, par.d),
      den: k.denom(par.a, par.b, par.c, par.d)
    };
    return {
      id: id,
      num: fr.num,
      den: fr.den,
      fraccion: fr.num + "/" + fr.den,
      valor: valor(fr),
      ok: mismaFraccion(fr, suma(par))
    };
  }

  /* Las cuatro candidatas con el mismo par. */
  function tabla(par) {
    return CANDIDATAS.map(function (k) { return evaluar(k.id, par); });
  }

  /* Dos candidatas distintas que entregan el mismo número con este par:
     ahí la elección no se puede decidir mirando el resultado. */
  function empates(par) {
    var filas = tabla(par);
    var pares = [];
    var i, j;
    for (i = 0; i < filas.length; i = i + 1) {
      for (j = i + 1; j < filas.length; j = j + 1) {
        if (filas[i].num === filas[j].num && filas[i].den === filas[j].den) {
          pares.push([filas[i].id, filas[j].id]);
        }
      }
    }
    return pares;
  }

  /* Nombres que hay que escribir para sumar k racionales en cadena:
     con enteros sueltos, 2k de entrada mas 2(k-1) de resultados;
     con un solo dato, k de entrada mas (k-1) de resultados. */
  function nombres(k) {
    return { sueltos: 4 * k - 2, abstraido: 2 * k - 1 };
  }

  var API = {
    CANDIDATAS: CANDIDATAS, PARES: PARES,
    suma: suma, evaluar: evaluar, tabla: tabla,
    empates: empates, nombres: nombres, mismaFraccion: mismaFraccion
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var PAR_DECK = PARES[0];

  var MENSAJES = {
    cruzado: "Eso es: 1*3 + 2*2 = 7, con denR = den1*den2 = 6, o sea 7/6. " +
      "Cada numerador se multiplicó por el denominador del OTRO racional, " +
      "y ese cruce es el que hay que acertar a mano cada vez.",
    propio: "1*2 + 2*3 = 8, y con denR = 6 queda 8/6, que es 4/3. " +
      "Esa expresión multiplica cada numerador por su propio denominador: " +
      "num1 con den1 y num2 con den2. Para sumar, el numerador de un " +
      "racional tiene que encontrarse con el denominador del otro.",
    tipos: "1*2 + 2*3 = 8 también, y no es coincidencia pequeña: den1 y " +
      "num2 valen 2 los dos, así que aquí las dos expresiones equivocadas " +
      "dan el mismo número. Esta junta numeradores con numeradores y " +
      "denominadores con denominadores: los tipos calzan, la suma no.",
    directo: "num1 + num2 = 3 y den1 + den2 = 5 dan 3/5 = 0,6, y " +
      "1/2 + 2/3 pasa de 1. Sumar por separado arriba y abajo es otra " +
      "operación; la fracción resultante no tiene esos denominadores."
  };

  var resuelta = false;
  var comparados = 0;

  function fijarVeredicto(id, clase, texto) {
    var v = document.getElementById(id);
    v.className = "veredicto " + clase;
    v.textContent = texto;
  }

  function celda(texto, clase) {
    var td = document.createElement("td");
    if (clase) { td.className = clase; }
    td.textContent = texto;
    return td;
  }

  function redondear(x) {
    return (Math.round(x * 1000) / 1000).toString().replace(".", ",");
  }

  function pintarTablaPares(par) {
    var cuerpo = document.getElementById("cuerpo-pares");
    var correcta = suma(par);
    cuerpo.innerHTML = "";
    tabla(par).forEach(function (f) {
      var tr = document.createElement("tr");
      if (f.ok) { tr.className = "doble"; }
      tr.appendChild(celda(buscar(f.id).exprNum, "expr"));
      tr.appendChild(celda(buscar(f.id).exprDen, "expr"));
      tr.appendChild(celda(f.fraccion));
      tr.appendChild(celda(redondear(f.valor)));
      tr.appendChild(celda(f.ok ? "sí" : "no", f.ok ? "si" : "no"));
      cuerpo.appendChild(tr);
    });
    document.getElementById("pie-pares").textContent =
      par.txt + " = " + correcta.num + "/" + correcta.den +
      " = " + redondear(valor(correcta)) + ".";
    var lista = empates(par);
    var falsosAciertos = tabla(par).filter(function (f) {
      return f.ok && f.id !== "cruzado";
    });
    var msg;
    if (lista.length === 0) {
      msg = "Con este par las cuatro candidatas dan cuatro números " +
        "distintos, y solo " + buscar("cruzado").exprNum + " llega a " +
        correcta.num + "/" + correcta.den + ".";
    } else {
      msg = "Con este par empatan " +
        lista.map(function (p) {
          return buscar(p[0]).exprNum + " y " + buscar(p[1]).exprNum;
        }).join("; ") +
        ": entregan el mismo número, así que el resultado solo no dice " +
        "cuál expresión es la de la suma.";
      if (falsosAciertos.length > 0) {
        msg = msg + " Y " + falsosAciertos.map(function (f) {
          return buscar(f.id).exprNum;
        }).join(", ") + " acierta aquí por los valores de este par, no " +
          "porque empareje bien.";
      }
    }
    fijarVeredicto("veredicto-pares", lista.length === 0 ? "bien" : "mal", msg);
  }

  function pintarTablaNombres() {
    var cuerpo = document.getElementById("cuerpo-nombres");
    var ks = [2, 3, 4];
    cuerpo.innerHTML = "";
    ks.forEach(function (k) {
      var n = nombres(k);
      var tr = document.createElement("tr");
      tr.appendChild(celda(String(k)));
      tr.appendChild(celda(String(n.sueltos)));
      tr.appendChild(celda(String(n.abstraido)));
      tr.appendChild(celda(String(n.sueltos - n.abstraido)));
      cuerpo.appendChild(tr);
    });
  }

  document.querySelectorAll("[data-cand]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      var id = boton.getAttribute("data-cand");
      var r = evaluar(id, PAR_DECK);
      document.querySelectorAll("[data-cand]").forEach(function (o) {
        o.className = "";
      });
      boton.className = r.ok ? "primario" : "";
      fijarVeredicto("veredicto-numr", r.ok ? "bien" : "mal", MENSAJES[id]);
      if (r.ok && !resuelta) {
        resuelta = true;
        document.getElementById("hueco").textContent = buscar("cruzado").exprNum;
        document.getElementById("carta-pares").classList.remove("bloqueado");
      }
    });
  });

  document.getElementById("btn-comparar").addEventListener("click", function () {
    var par = PARES[parseInt(document.getElementById("sel-par").value, 10)];
    pintarTablaPares(par);
    comparados = comparados + 1;
    if (comparados >= 1) {
      document.getElementById("carta-abstraccion").classList.remove("bloqueado");
    }
  });

  PARES.forEach(function (p, i) {
    var op = document.createElement("option");
    op.value = String(i);
    op.textContent = p.txt;
    document.getElementById("sel-par").appendChild(op);
  });
  pintarTablaNombres();
})();
