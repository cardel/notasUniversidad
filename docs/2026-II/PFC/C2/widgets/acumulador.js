/* Acumulador: la traza de factIter como tabla, una fila por llamada. El
   estudiante llena la columna prod antes de ver la ejecución.
   Reproduce 02_factorial_iterativo.scala. */
(function () {
  var CODIGO = [
    { txt: "@tailrec", num: null },
    { txt: "def factIter(cont: Int, prod: Int, n: Int): Int =", num: null },
    { txt: "  if (cont > n) prod", num: 1 },
    { txt: "  else factIter(cont + 1, cont * prod, n)", num: 2 },
    { txt: "", num: null },
    { txt: "def fact(n: Int): Int = factIter(1, 1, n)", num: 3 }
  ];

  /* Una fila por llamada: (cont, prod, n). La última es la que devuelve. */
  function filas(n) {
    var F = [], cont = 1, prod = 1;
    while (cont <= n) {
      F.push({ cont: cont, prod: prod, n: n, devuelve: false });
      prod = cont * prod; cont = cont + 1;
    }
    F.push({ cont: cont, prod: prod, n: n, devuelve: true });
    return F;
  }

  function simular(n) {
    var pasos = [{ linea: 3, cont: null, prod: null, fila: -1 }];
    filas(n).forEach(function (f, i) {
      pasos.push({ linea: f.devuelve ? 1 : 2, cont: f.cont, prod: f.prod, fila: i });
    });
    return pasos;
  }

  var API = { filas: filas, simular: simular, CODIGO: CODIGO };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var nActual = 4;

  function construirTabla(n) {
    var cuerpo = document.getElementById("cuerpo-tabla");
    cuerpo.innerHTML = "";
    filas(n).forEach(function (f, i) {
      var tr = document.createElement("tr");
      tr.id = "fila-" + i;
      var c1 = document.createElement("td"); c1.textContent = f.cont;
      var c2 = document.createElement("td");
      if (i === 0) {
        c2.textContent = f.prod;
        c2.className = "dada";
      } else {
        var inp = document.createElement("input");
        inp.type = "number"; inp.id = "prod-" + i; inp.placeholder = "?";
        c2.appendChild(inp);
        var real = document.createElement("span");
        real.className = "real"; real.id = "real-" + i;
        c2.appendChild(real);
      }
      var c3 = document.createElement("td"); c3.textContent = f.n;
      var c4 = document.createElement("td");
      c4.className = "que";
      c4.textContent = f.devuelve ? "cont > n: devuelve prod" : "cont * prod → siguiente";
      tr.appendChild(c1); tr.appendChild(c2); tr.appendChild(c3); tr.appendChild(c4);
      cuerpo.appendChild(tr);
    });
    document.getElementById("veredicto-tabla").className = "veredicto";
    document.getElementById("veredicto-tabla").textContent = "";
  }

  function pintar(e) {
    var F = filas(e.params);
    F.forEach(function (f, i) {
      var tr = document.getElementById("fila-" + i);
      if (!tr) { return; }
      tr.classList.toggle("actual", e.actual && e.actual.fila === i);
      var real = document.getElementById("real-" + i);
      if (real) {
        real.textContent = (e.actual && e.actual.fila >= i) ? "= " + f.prod : "";
      }
    });
    var pie = document.getElementById("pie-tabla");
    if (!e.actual || e.actual.fila < 0) {
      pie.textContent = "fact(" + e.params + ") arranca con cont = 1 y prod = 1.";
    } else if (e.terminado) {
      pie.textContent = "cont pasó de n: se devuelve prod = " + e.actual.prod + ". Nunca hubo nada esperando.";
    } else {
      var f = F[e.actual.fila];
      pie.textContent = "Llamada con cont = " + f.cont + ", prod = " + f.prod
        + ". La siguiente recibe prod = " + f.cont + " * " + f.prod + " = " + (f.cont * f.prod) + ".";
    }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: nActual,
    chips: [
      { campo: "cont", rotulo: "cont" },
      { campo: "prod", rotulo: "prod", clase: "alerta" }
    ],
    simular: simular,
    alPintar: pintar
  });

  document.getElementById("btn-comprobar-tabla").addEventListener("click", function () {
    var F = filas(nActual), malas = 0, vacias = 0;
    F.forEach(function (f, i) {
      if (i === 0) { return; }
      var inp = document.getElementById("prod-" + i);
      var v = parseInt(inp.value, 10);
      if (isNaN(v)) { vacias = vacias + 1; inp.className = ""; return; }
      inp.className = v === f.prod ? "bien" : "mal";
      if (v !== f.prod) { malas = malas + 1; }
    });
    var ver = document.getElementById("veredicto-tabla");
    if (vacias > 0) {
      ver.className = "veredicto mal";
      ver.textContent = "Faltan " + vacias + " casillas.";
    } else if (malas === 0) {
      ver.className = "veredicto bien";
      ver.textContent = "Correcto. Cada fila multiplica el cont de la anterior por su prod: el resultado se va armando en el parámetro.";
    } else {
      ver.className = "veredicto mal";
      ver.textContent = malas + " casilla(s) en rojo. Regla: el prod de una fila es cont × prod de la fila de arriba, no de la misma.";
    }
  });

  construirTabla(nActual);
  Motor.repintar();

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      nActual = parseInt(b.getAttribute("data-preset"), 10);
      construirTabla(nActual);
      Motor.reiniciar(nActual);
    });
  });
})();
