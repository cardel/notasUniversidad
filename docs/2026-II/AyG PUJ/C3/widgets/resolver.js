/* Recorrido guiado: resolver UVa 10341 (Solve It) con biseccion. */
var EJERCICIO = (function () {
  function hacerF(c) {
    return function (x) {
      return c.p * Math.exp(-x) + c.q * Math.sin(x) + c.r * Math.cos(x) +
             c.s * Math.tan(x) + c.t * x * x + c.u;
    };
  }

  function derivada(c, x) {
    return -c.p * Math.exp(-x) + c.q * Math.cos(x) - c.r * Math.sin(x) +
           c.s / (Math.cos(x) * Math.cos(x)) + 2 * c.t * x;
  }

  /* f es decreciente: hay solucion en [0,1] solo si f(0) >= 0 >= f(1) */
  function haySolucion(c) {
    var f = hacerF(c);
    return f(0) >= 0 && f(1) <= 0;
  }

  function resolver(c, eps) {
    var f = hacerF(c);
    var a = 0, b = 1;
    var vueltas = 0;
    var traza = [];
    while (b - a > eps) {
      var mitad = (a + b) / 2;
      var fm = f(mitad);
      traza.push({ a: a, b: b, mitad: mitad, fm: fm, sube: fm > 0 });
      if (fm > 0) { a = mitad; } else { b = mitad; }
      vueltas = vueltas + 1;
    }
    return { x: (a + b) / 2, vueltas: vueltas, traza: traza };
  }

  return { hacerF: hacerF, derivada: derivada, haySolucion: haySolucion,
           resolver: resolver };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var CASOS = [
      { p: 0, q: 0, r: 0, s: 0, t: -2, u: 1, etiqueta: "0 0 0 0 -2 1" },
      { p: 1, q: 0, r: 0, s: 0, t: -1, u: 2, etiqueta: "1 0 0 0 -1 2" },
      { p: 1, q: -1, r: 1, s: -1, t: -1, u: 1, etiqueta: "1 -1 1 -1 -1 1" }
    ];
    var caso = CASOS[0];
    var EPS = 1e-7;

    function num(x, d) {
      var k = Math.pow(10, d === undefined ? 4 : d);
      return Math.round(x * k) / k;
    }

    /* ---- paso 2: entrada y salida ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-entrada button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-entrada");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          d.className = "veredicto bien";
          d.textContent = "Correcto. Los seis enteros son los coeficientes, no la " +
            "incógnita: la x es lo que hay que hallar, y el enunciado ya dice dónde " +
            "vive, en [0, 1]. Leer bien esto ahorra media hora de código equivocado.";
        } else if (op === "x") {
          d.className = "veredicto mal";
          d.textContent = "No: la x es la salida, no la entrada. Si viniera dada no " +
            "habría nada que buscar.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "El rango no se lee de la entrada: el enunciado lo fija de " +
            "una vez para todos los casos, 0 ≤ x ≤ 1.";
        }
      });
    });

    /* ---- paso 3: la funcion objetivo ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-funcion button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-funcion");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          d.className = "veredicto bien";
          d.innerHTML = "Ese es el planteamiento. Aquí la función objetivo viene " +
            "regalada: es el lado izquierdo de la ecuación, y resolver " +
            "<b>f(x) = 0</b> es exactamente lo que se pide. En los problemas de " +
            "búsqueda sobre la respuesta hay que inventarla; en este hay que " +
            "reconocerla.";
          document.getElementById("carta-monotonia").classList.remove("bloqueado");
        } else if (op === "conteo") {
          d.className = "veredicto mal";
          d.textContent = "Esa es la forma que toma f cuando el problema pregunta " +
            "«¿alcanza con este valor?». Aquí la ecuación ya está escrita: no hay que " +
            "contar nada.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "La incógnita es x, así que f tiene que ser función de x. " +
            "Los coeficientes son constantes dentro de cada caso de prueba.";
        }
      });
    });

    /* ---- paso 4: la monotonia, termino a termino ---- */
    var TERMINOS = [
      { id: "t1", termino: "p · e⁻ˣ", derivada: "−p · e⁻ˣ", restriccion: "p ≥ 0",
        signo: "baja", razon: "e⁻ˣ decrece siempre, y p ≥ 0 no le cambia el signo." },
      { id: "t2", termino: "q · sen(x)", derivada: "q · cos(x)", restriccion: "q ≤ 0",
        signo: "baja", razon: "cos(x) > 0 en [0, 1] y q ≤ 0, así que el producto es ≤ 0." },
      { id: "t3", termino: "r · cos(x)", derivada: "−r · sen(x)", restriccion: "r ≥ 0",
        signo: "baja", razon: "sen(x) ≥ 0 en [0, 1] y r ≥ 0, así que −r·sen(x) ≤ 0." },
      { id: "t4", termino: "s · tan(x)", derivada: "s · sec²(x)", restriccion: "s ≤ 0",
        signo: "baja", razon: "sec²(x) > 0 siempre y s ≤ 0." },
      { id: "t5", termino: "t · x²", derivada: "2t · x", restriccion: "t ≤ 0",
        signo: "baja", razon: "x ≥ 0 en el rango y t ≤ 0. Ojo: si t pudiera ser positivo, este término subiría y el argumento se caería." },
      { id: "t6", termino: "u", derivada: "0", restriccion: "—",
        signo: "plana", razon: "Es una constante: no aporta pendiente, solo desplaza la curva." }
    ];
    var resueltos = {};

    function pintarTerminos() {
      var caja = document.getElementById("tabla-terminos");
      caja.innerHTML = "";
      TERMINOS.forEach(function (T) {
        var fila = document.createElement("div");
        fila.className = "fila-termino" + (resueltos[T.id] ? " resuelta" : "");
        var izq = document.createElement("div");
        izq.className = "termino";
        izq.innerHTML = "<code>" + T.termino + "</code>";
        fila.appendChild(izq);
        var mid = document.createElement("div");
        mid.className = "restriccion";
        mid.textContent = T.restriccion;
        fila.appendChild(mid);
        var der = document.createElement("div");
        der.className = "opciones-mini";
        if (resueltos[T.id]) {
          der.innerHTML = "<b>" + T.derivada + "</b> " +
            (T.signo === "plana" ? "≡ 0" : "≤ 0") + " &nbsp;<span class='razon'>" +
            T.razon + "</span>";
        } else {
          ["sube", "baja", "plana"].forEach(function (op) {
            var b = document.createElement("button");
            b.textContent = op === "sube" ? "sube" : (op === "baja" ? "baja" : "plana");
            b.addEventListener("click", function () {
              var d = document.getElementById("veredicto-monotonia");
              if (op === T.signo) {
                resueltos[T.id] = true;
                d.className = "veredicto bien";
                d.innerHTML = "<b>" + T.termino + "</b>: su derivada es <b>" +
                  T.derivada + "</b>. " + T.razon;
                pintarTerminos();
                if (Object.keys(resueltos).length === TERMINOS.length) {
                  document.getElementById("cierre-monotonia").style.display = "block";
                  document.getElementById("carta-rango").classList.remove("bloqueado");
                }
              } else {
                d.className = "veredicto mal";
                d.innerHTML = "<b>" + T.termino + "</b>: no. Derive el término y mire " +
                  "el signo que le imponen las restricciones del enunciado — la " +
                  "derivada es <b>" + T.derivada + "</b>.";
              }
            });
            der.appendChild(b);
          });
        }
        fila.appendChild(der);
        caja.appendChild(fila);
      });
    }
    pintarTerminos();

    /* ---- paso 5: el rango y la existencia ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-rango button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-rango");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          d.className = "veredicto bien";
          d.innerHTML = "Correcto: como f decrece, el mayor valor que toma es f(0) y " +
            "el menor es f(1). Si el cero no queda entre esos dos, no hay solución en " +
            "[0, 1] — y hay que imprimir <code>No solution</code> en vez de un número.";
          document.getElementById("carta-ejecutar").classList.remove("bloqueado");
        } else if (op === "cambio") {
          d.className = "veredicto mal";
          d.textContent = "Casi: la idea del cambio de signo es correcta, pero al revés. " +
            "f decrece, así que arranca alto y termina bajo: se necesita f(0) ≥ 0 ≥ f(1).";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Evaluar en la mitad no dice nada sobre si la solución existe: " +
            "podría ser negativa con f(0) también negativa. La comprobación va en los " +
            "extremos, antes de arrancar el ciclo.";
        }
      });
    });

    /* ---- paso 6: ejecutar sobre los casos del enunciado ---- */
    function pintarCaso() {
      var f = EJERCICIO.hacerF(caso);
      var existe = EJERCICIO.haySolucion(caso);
      var caja = document.getElementById("panel-ejecucion");
      caja.innerHTML = "";

      var eq = document.createElement("div");
      eq.className = "ecuacion";
      var partes = [];
      if (caso.p) { partes.push(caso.p + "·e⁻ˣ"); }
      if (caso.q) { partes.push(caso.q + "·sen(x)"); }
      if (caso.r) { partes.push("+ " + caso.r + "·cos(x)"); }
      if (caso.s) { partes.push(caso.s + "·tan(x)"); }
      if (caso.t) { partes.push(caso.t + "·x²"); }
      if (caso.u) { partes.push("+ " + caso.u); }
      eq.innerHTML = "f(x) = " + partes.join(" ").replace(/\+ -/g, "− ") + " = 0";
      caja.appendChild(eq);

      var extremos = document.createElement("div");
      extremos.className = "nota";
      extremos.innerHTML = "f(0) = <b>" + num(f(0), 4) + "</b> &nbsp;&nbsp; f(1) = <b>" +
        num(f(1), 4) + "</b> &nbsp;→ " + (existe
          ? "<span class='ok'>el cero queda encerrado: hay solución</span>"
          : "<span class='no'>el cero queda fuera: <code>No solution</code></span>");
      caja.appendChild(extremos);

      var tabla = document.getElementById("cuerpo-ejecucion");
      tabla.innerHTML = "";
      var pie = document.getElementById("pie-ejecucion");
      if (!existe) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<td colspan='4' class='pend'>No se ejecuta la bisección: " +
          "primero se comprueba que la solución existe.</td>";
        tabla.appendChild(tr);
        pie.innerHTML = "Salida esperada: <code>No solution</code>";
        return;
      }
      var res = EJERCICIO.resolver(caso, EPS);
      var vistas = res.traza.slice(0, 8);
      vistas.forEach(function (p) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>[" + num(p.a) + ", " + num(p.b) + "]</td><td>" +
          num(p.mitad) + "</td><td>" + num(p.fm) + "</td><td>" +
          (p.sube ? "f(mitad) &gt; 0: la raíz está a la derecha, sube a"
                  : "f(mitad) ≤ 0: la raíz está a la izquierda, baja b") + "</td>";
        tabla.appendChild(tr);
      });
      var tr2 = document.createElement("tr");
      tr2.innerHTML = "<td colspan='4' class='pend'>… " + (res.vueltas - vistas.length) +
        " vueltas más, hasta que el ancho baja de " + EPS + "</td>";
      tabla.appendChild(tr2);
      pie.innerHTML = "Salida esperada: <code>" + res.x.toFixed(4) + "</code> " +
        "&nbsp;(" + res.vueltas + " vueltas)";
    }
    pintarCaso();

    Array.prototype.forEach.call(document.querySelectorAll("#casos button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll("#casos button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        caso = CASOS[parseInt(btn.getAttribute("data-caso"), 10)];
        pintarCaso();
        document.getElementById("carta-eps").classList.remove("bloqueado");
      });
    });

    /* ---- paso 7: la tolerancia ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-eps button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-eps");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          d.className = "veredicto bien";
          d.innerHTML = "Correcto: piden 4 decimales, así que el error tiene que " +
            "quedar por debajo de 10⁻⁴; con ε = 10⁻⁷ sobra y cuesta apenas " +
            Math.ceil(Math.log2(1 / 1e-7)) + " vueltas — el logaritmo hace que afinar " +
            "sea casi gratis. También sirve fijar un número de vueltas: 100 " +
            "iteraciones dejan el intervalo en 2⁻¹⁰⁰, muy por debajo de lo que " +
            "distingue un <code>double</code>.";
          document.getElementById("carta-codigo").classList.remove("bloqueado");
          document.getElementById("carta-codigo2").classList.remove("bloqueado");
        } else if (op === "grande") {
          d.className = "veredicto mal";
          d.textContent = "Con ε = 10⁻³ el error puede llegar a 0.0005, que ya cambia " +
            "el cuarto decimal. El juez compara esa cifra.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "Un ε más fino que la precisión del double deja el ciclo " +
            "girando sin que el ancho baje: b − a se estanca y el programa no termina.";
        }
      });
    });

    /* ---- paso 8: errores ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-error button"), function (btn) {
      btn.addEventListener("click", function () {
        var d = document.getElementById("veredicto-error");
        var op = btn.getAttribute("data-op");
        if (op === "signo") {
          d.className = "veredicto bien";
          d.innerHTML = "Ese es el error que más veces cuesta el problema. La " +
            "bisección de la clase estaba escrita para f <b>creciente</b>: " +
            "<code>if f(mitad) &lt; v: a = mitad</code>. Aquí f <b>decrece</b>, así que " +
            "la comparación se invierte. Copiar la plantilla sin mirar la monotonía " +
            "da un programa que compila, corre y responde mal.";
        } else if (op === "eof") {
          d.className = "veredicto mal";
          d.textContent = "Cierto que hay que leer hasta EOF, pero eso es lectura de " +
            "entrada, no un error de la bisección. Y el juez lo señala con un veredicto " +
            "claro.";
        } else {
          d.className = "veredicto mal";
          d.textContent = "El rango lo fija el enunciado en [0, 1]: no hay nada que " +
            "acotar. Ese trabajo aparece en los problemas de búsqueda sobre la " +
            "respuesta, donde el rango hay que justificarlo.";
        }
      });
    });
  })();
}
