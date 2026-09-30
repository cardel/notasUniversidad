/* Agotar: ante una llamada, decidir qué se acaba —el tiempo, el espacio o
   nada—. Los cuatro casos se corrieron con scala-cli; los resultados son los
   de 05_limite_de_pila, 02_factorial_iterativo, 08_cola_rota y el bucle de
   la sesión anterior. */
(function () {
  var CASOS = [
    {
      titulo: "factorial(100000)",
      codigo: "def factorial(n: Int): Int =\n  if (n == 0) 1\n  else n * factorial(n - 1)",
      correcta: "espacio",
      veredictos: {
        tiempo: "No. El tiempo alcanzaba: eran cien mil multiplicaciones, y la máquina hace millones por segundo. Lo que no alcanzó fue otra cosa.",
        espacio: "Correcto. Cada llamada deja una multiplicación esperando y la pila tiene un tope. A los pocos miles de marcos, StackOverflowError: se agotó el espacio antes de hacer la primera multiplicación.",
        nada: "No. Este sí revienta. Córralo: no imprime nada y muere con StackOverflowError."
      },
      salida: "factorial(100000): StackOverflowError"
    },
    {
      titulo: "fact(100000)",
      codigo: "@tailrec\ndef factIter(cont: Int, prod: Int, n: Int): Int =\n  if (cont > n) prod\n  else factIter(cont + 1, cont * prod, n)\n\ndef fact(n: Int): Int = factIter(1, 1, n)",
      correcta: "nada",
      veredictos: {
        tiempo: "No. Son las mismas cien mil vueltas que factorial, y terminan en un instante.",
        espacio: "No. Aquí no queda nada esperando alrededor de la llamada: el resultado viaja en prod. La pila no crece, así que no hay pila que agotar.",
        nada: "Correcto. Termina. El valor que imprime es 0, porque el producto de cien mil enteros desbordó el Int hace rato, pero eso es otro problema: el proceso llegó al final."
      },
      salida: "fact(100000) = 0"
    },
    {
      titulo: "factIterRota(1, 1, 100000)",
      codigo: "def factIterRota(cont: Int, prod: Int, n: Int): Int =\n  if (cont > n) prod\n  else 1 + factIterRota(cont + 1, cont * prod, n) - 1",
      correcta: "espacio",
      veredictos: {
        tiempo: "No. Las vueltas son las mismas que en fact. El problema no es cuántas, sino qué dejan detrás.",
        espacio: "Correcto. El 1 + ... - 1 no cambia el valor, pero sí el proceso: la suma queda esperando a que vuelva la llamada. Cien mil sumas esperando, y la pila revienta igual que en factorial. Con @tailrec encima ni siquiera compila: el compilador avisa que la llamada no está en posición de cola.",
        nada: "No. Parece fact con adorno, y da lo mismo para n = 6. Para cien mil, StackOverflowError: el adorno es lo que rompe la cola."
      },
      salida: "factIterRota(1, 1, 100000): StackOverflowError"
    },
    {
      titulo: "primero(1, bucle) con def bucle: Int = bucle",
      codigo: "def bucle: Int = bucle\ndef primero(x: Int, y: Int): Int = x",
      correcta: "tiempo",
      veredictos: {
        tiempo: "Correcto. Por valor hay que reducir bucle antes de entrar, y bucle nunca termina de reducirse. La pila no crece —la llamada a sí mismo no deja nada esperando— así que no revienta: gira para siempre. Hay que matarlo.",
        espacio: "No. Aquí la pila no crece, porque bucle no deja nada esperando alrededor de su llamada. Lo que se acaba es la paciencia: nunca devuelve.",
        nada: "No. Este nunca llega al final. Corrido con timeout de veinte segundos, muere con código 124 y sin haber impreso nada."
      },
      salida: "$ timeout 20 scala-cli run ...  →  $? = 124"
    }
  ];

  var API = { CASOS: CASOS };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0;
  var respondidos = {};

  function pintarCaso() {
    var c = CASOS[actual];
    document.getElementById("titulo-caso").textContent = c.titulo;
    document.getElementById("codigo-caso").textContent = c.codigo;
    document.getElementById("salida-caso").textContent = "";
    var v = document.getElementById("veredicto-caso");
    v.className = "veredicto";
    v.textContent = "";
    document.querySelectorAll("#opciones button").forEach(function (b) { b.className = ""; });
    document.querySelectorAll("[data-caso]").forEach(function (b, i) {
      b.className = (i === actual ? "primario" : "") + (respondidos[i] ? " hecho" : "");
    });
    document.getElementById("progreso-casos").textContent =
      Object.keys(respondidos).length + " de " + CASOS.length + " resueltos";
  }

  document.querySelectorAll("[data-caso]").forEach(function (b) {
    b.addEventListener("click", function () {
      actual = parseInt(b.getAttribute("data-caso"), 10);
      pintarCaso();
    });
  });

  document.querySelectorAll("#opciones button").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = CASOS[actual];
      var op = b.getAttribute("data-op");
      var v = document.getElementById("veredicto-caso");
      var bien = op === c.correcta;
      v.className = "veredicto " + (bien ? "bien" : "mal");
      v.textContent = c.veredictos[op];
      document.querySelectorAll("#opciones button").forEach(function (o) { o.className = ""; });
      b.className = bien ? "primario" : "";
      if (bien) {
        document.getElementById("salida-caso").textContent = c.salida;
        respondidos[actual] = true;
        pintarCaso();
        v.className = "veredicto bien";
        v.textContent = c.veredictos[op];
        b.className = "primario";
        if (Object.keys(respondidos).length === CASOS.length) {
          document.getElementById("carta-cierre").classList.remove("bloqueado");
        }
      }
    });
  });

  pintarCaso();
})();
