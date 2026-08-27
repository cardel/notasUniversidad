/* Ejercicio interactivo: biseccion continua (clase 3). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def biseccion(v, a, b, eps):",         num: null },
    { txt: "    while b - a > eps:",               num: 1 },
    { txt: "        mitad = (a + b) / 2",          num: 2 },
    { txt: "        if f(mitad) < v:",             num: 3 },
    { txt: "            a = mitad",                num: 4 },
    { txt: "        else:",                        num: null },
    { txt: "            b = mitad",                num: 5 },
    { txt: "    return (a + b) / 2",               num: 6 }
  ];

  var FUNCIONES = {
    cubica: { f: function (x) { return x * x * x + x; }, texto: "f(x) = x³ + x" },
    raiz:   { f: function (x) { return Math.sqrt(x); }, texto: "f(x) = √x" },
    exp:    { f: function (x) { return Math.pow(2, x); }, texto: "f(x) = 2ˣ" }
  };

  function redondear(x) { return Math.round(x * 10000) / 10000; }

  function simular(params) {
    var f = FUNCIONES[params.funcion].f;
    var v = params.v;
    var a = params.a;
    var b = params.b;
    var eps = params.eps;
    var pasos = [];
    var mitad = null;
    function snap(linea, extra) {
      var p = { linea: linea, a: redondear(a), b: redondear(b),
                mitad: mitad === null ? null : redondear(mitad),
                ancho: redondear(b - a) };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    var corriendo = true;
    var vueltas = 0;
    while (corriendo && vueltas < 200) {
      snap(1, { chequeo: true });
      if (b - a > eps) {
        mitad = (a + b) / 2;
        snap(2);
        var fm = f(mitad);
        snap(3);
        if (fm < v) {
          a = mitad;
          snap(4, { evento: "f(" + redondear(mitad) + ") = " + redondear(fm) +
                            " < " + v + ": sube a", fmitad: redondear(fm) });
        } else {
          b = mitad;
          snap(5, { evento: "f(" + redondear(mitad) + ") = " + redondear(fm) +
                            " ≥ " + v + ": baja b", fmitad: redondear(fm) });
        }
        vueltas = vueltas + 1;
      } else {
        corriendo = false;
      }
    }
    mitad = null;
    snap(6, { respuesta: redondear((a + b) / 2), vueltas: vueltas });
    return pasos;
  }

  return { codigo: CODIGO, simular: simular, funciones: FUNCIONES };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { funcion: "cubica", v: 10, a: 0, b: 3, eps: 0.05 },
      { funcion: "raiz", v: 3, a: 0, b: 16, eps: 0.05 },
      { funcion: "exp", v: 100, a: 0, b: 10, eps: 0.05 }
    ];

    function alPintar(e) {
      var p = e.params;
      var f = EJERCICIO.funciones[p.funcion].f;
      var actual = e.actual;
      var a = actual ? actual.a : p.a;
      var b = actual ? actual.b : p.b;
      var mitad = actual ? actual.mitad : null;

      /* barra que representa el intervalo original, con la parte viva marcada */
      var panel = document.getElementById("panel-recta");
      panel.innerHTML = "";
      var ancho0 = p.b - p.a;
      var barra = document.createElement("div");
      barra.className = "recta";
      var vivo = document.createElement("div");
      vivo.className = "recta-viva";
      vivo.style.left = (100 * (a - p.a) / ancho0) + "%";
      vivo.style.width = Math.max(0.5, 100 * (b - a) / ancho0) + "%";
      barra.appendChild(vivo);
      if (mitad !== null) {
        var marca = document.createElement("div");
        marca.className = "recta-marca";
        marca.style.left = (100 * (mitad - p.a) / ancho0) + "%";
        barra.appendChild(marca);
      }
      panel.appendChild(barra);

      var pie = document.createElement("div");
      pie.className = "nota";
      pie.style.marginTop = "0.5rem";
      pie.innerHTML = EJERCICIO.funciones[p.funcion].texto +
        ", se busca <b>f(x) = " + p.v + "</b> con tolerancia " + p.eps +
        ".<br>Intervalo vivo: <b>[" + a + ", " + b + "]</b>, ancho " +
        (actual ? actual.ancho : Math.round((b - a) * 10000) / 10000) +
        ". &nbsp;Encierro: f(a) = " + Math.round(f(a) * 1000) / 1000 +
        " ≤ " + p.v + " ≤ " + Math.round(f(b) * 1000) / 1000 + " = f(b)";
      panel.appendChild(pie);

      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var antes = { a: p.a, b: p.b };
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var s = e.pasos[m];
        if (s.evento) {
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>[" + antes.a + ", " + antes.b + "]</td><td>" +
            s.mitad + "</td><td>" + s.fmitad + "</td><td>" + s.evento + "</td>";
          cuerpo.appendChild(tr);
          antes = { a: s.a, b: s.b };
        }
      }
      if (cuerpo.children.length === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='4' class='pend'>Todavía no se descarta ninguna mitad.</td>";
        cuerpo.appendChild(trv);
      }
      if (e.terminado && actual && actual.respuesta !== undefined) {
        var trf = document.createElement("tr");
        trf.innerHTML = "<td>[" + a + ", " + b + "]</td><td>—</td><td>—</td><td>" +
          "ancho ≤ " + p.eps + ": se devuelve <b>" + actual.respuesta +
          "</b> tras " + actual.vueltas + " vueltas</td>";
        cuerpo.appendChild(trf);
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "a", rotulo: "a" },
        { campo: "b", rotulo: "b" },
        { campo: "mitad", rotulo: "mitad" },
        { campo: "ancho", rotulo: "ancho", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var esperado = Math.ceil(Math.log((params.b - params.a) / params.eps) / Math.log(2));
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: el ancho arranca en " +
          (params.b - params.a) + " y se parte a la mitad cada vuelta, así que hay " +
          "que resolver (b−a)/2^k ≤ ε. Da k = ⌈log₂(" + (params.b - params.a) +
          "/" + params.eps + ")⌉ = " + esperado + "." };
      }
      if (valor > esperado && valor <= esperado + 3) {
        return { ok: false, msg: "Cerca. La fórmula exacta es " +
          "k = ⌈log₂((b−a)/ε)⌉; aquí da " + esperado + ". Ejecute y cuente las filas." };
      }
      return { ok: false, msg: "No coincide. Cada vuelta divide el ancho por 2: " +
        "de " + (params.b - params.a) + " pasa a " + ((params.b - params.a) / 2) +
        ", luego a " + ((params.b - params.a) / 4) + "… ¿cuántas veces hasta bajar de " +
        params.eps + "?" };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    /* ---- tarjeta 4: los invariantes ---- */
    var encierroOK = false;
    var cotasOK = false;
    function revisarDescubrimiento() {
      if (encierroOK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes: " +
          "<b>I₀: a′ ≤ a ≤ b ≤ b′</b> e <b>I₁: f(a) ≤ v ≤ f(b)</b>, con a′ y b′ " +
          "los extremos originales.";
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-encierro button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-encierro");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          encierroOK = true;
          d.className = "veredicto bien";
          d.textContent = "Ese es I₁: v queda encerrado entre f(a) y f(b) en cada " +
            "chequeo. Mire el pie de la ilustración: esa desigualdad nunca se rompe, " +
            "por más que el intervalo se encoja.";
          revisarDescubrimiento();
        } else if (op === "igual") {
          d.className = "veredicto mal";
          d.textContent = "Sobre los reales eso casi nunca pasa: f(mitad) llega " +
            "cerca de v, no exactamente. Por eso la salida es una aproximación.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Cierto, pero es la precondición sobre f, no algo que el " +
            "ciclo mantenga. Un invariante habla de a y b, que son lo que cambia.";
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cotas button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-cotas");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          cotasOK = true;
          d.className = "veredicto bien";
          d.textContent = "Ese es I₀: el intervalo vivo nunca se sale del original " +
            "ni se da vuelta. Sin a ≤ b, «el intervalo» dejaría de tener sentido.";
          revisarDescubrimiento();
        } else if (op === "estricta") {
          d.className = "veredicto mal";
          d.textContent = "El ciclo termina justo cuando el ancho baja de ε, y ahí " +
            "a y b siguen cumpliendo a ≤ b. Exigir a < b dejaría ese chequeo fuera.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Eso es lo que el ciclo busca lograr, no lo que conserva. " +
            "En las primeras vueltas el ancho es mucho mayor que ε.";
        }
      });
    });

    /* ---- tarjeta 5: la demostración ---- */
    function cablearPaso(idBoton, idPaso, idSiguiente, alFinal) {
      document.getElementById(idBoton).addEventListener("click", function () {
        document.getElementById(idPaso).classList.add("hecho");
        if (idSiguiente) {
          document.getElementById(idSiguiente).classList.remove("bloqueado");
        }
        if (alFinal) { alFinal(); }
      });
    }
    cablearPaso("btn-c1", "paso-1", "paso-2");
    cablearPaso("btn-c2", "paso-2", "paso-3");
    cablearPaso("btn-c3", "paso-3", null, function () {
      document.getElementById("conclusion").style.display = "block";
    });

    /* ---- tarjeta 6: que promete la salida ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-error button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-error");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          d.className = "veredicto bien";
          d.textContent = "Exacto: el intervalo final mide a lo sumo ε y contiene una " +
            "solución (por el teorema del valor intermedio, que necesita f continua). " +
            "Devolver el centro deja el error acotado por ε/2. Esa cota es parte del " +
            "enunciado del teorema: sobre los reales no hay otra cosa que prometer.";
        } else if (op === "exacta") {
          d.className = "veredicto mal";
          d.textContent = "En el arreglo la respuesta sí es exacta. Aquí no: los float " +
            "redondean y el intervalo nunca queda «de un elemento».";
        } else {
          d.className = "veredicto mal";
          d.textContent = "El error se mide desde el centro del intervalo, no desde un " +
            "extremo: por eso queda ε/2 y no ε.";
        }
      });
    });

    /* ---- tarjeta 7: la trampa ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-trampa button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-trampa");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          d.className = "veredicto bien";
          d.textContent = "Correcto: el algoritmo no avisa. Con f(a) ≤ v ≤ f(b) roto, " +
            "I₁ falla desde la inicialización y el ciclo converge al extremo cuyo f " +
            "queda más cerca de v. Por eso, al terminar, hay que comprobar que el " +
            "candidato de verdad cumple lo pedido.";
        } else if (op === "error") {
          d.className = "veredicto mal";
          d.textContent = "No hay ningún assert ni excepción en el código: el ciclo " +
            "corre igual y devuelve un número. Ese es justo el peligro.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "El ciclo sí termina: el ancho se parte a la mitad pase lo " +
            "que pase. Lo que falla no es la terminación, es la respuesta.";
        }
      });
    });
  })();
}
