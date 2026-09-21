/* Literales: cuatro preguntas donde el literal elegido tiene consecuencias
   sobre suma. Los valores (0, 9, 6, 14, 12, 8) y los dos que revientan la
   pila salen de correr suma con scala-cli. */
(function () {
  var PREGUNTAS = [
    { id: "cero", multiple: false,
      texto: "¿Con cuál f devuelve suma(f, x => x + 1, a, b) siempre 0, para cualquier a ≤ b?",
      opciones: [
        { txt: "x => 0", ok: true, msg: "Correcto. Cada término aporta 0 y el caso base también: la suma es 0 sin importar el rango." },
        { txt: "x => x", ok: false, msg: "No. Con x => x se suman los enteros del rango: suma(x => x, x => x + 1, 1, 3) da 6." },
        { txt: "x => 1", ok: false, msg: "No. Con x => 1 cada término aporta 1, así que suma cuenta los términos: para (1, 3) da 3." },
        { txt: "x => x - 1", ok: false, msg: "No. Solo se anula el término a = 1; los demás aportan a - 1. Para (1, 3) da 0 + 1 + 2 = 3." }
      ] },
    { id: "revienta", multiple: true,
      texto: "Marque todos los prox con los que suma(x => x, prox, 1, 3) revienta la pila (StackOverflowError).",
      opciones: [
        { txt: "x => x", ok: true, msg: "x => x no avanza: a se queda en 1, nunca pasa de 3, y cada vuelta deja un 1 + esperando. Como suma no es de cola, la pila se llena." },
        { txt: "x => x - 1", ok: true, msg: "x => x - 1 retrocede: a va 1, 0, −1, … y nunca pasa de 3. Misma pila, mismo final." },
        { txt: "x => x * 2", ok: false, msg: "x => x * 2 sí avanza: 1, 2, 4. Con 4 > 3 se detiene; da 1 + 2 = 3." },
        { txt: "x => x + 3", ok: false, msg: "x => x + 3 avanza de sobra: 1, 4. Se detiene enseguida y da 1." }
      ] },
    { id: "nueve", multiple: false,
      texto: "¿Cuál par (f, prox) hace que suma(f, prox, 1, 3) devuelva 9?",
      opciones: [
        { txt: "(x => x + 1, x => x + 1)", ok: true, msg: "Correcto: los términos son 1, 2, 3 y f los vuelve 2, 3, 4. Suma 9. El mismo literal hace dos trabajos distintos según la posición." },
        { txt: "(x => x, x => x + 1)", ok: false, msg: "No: 1 + 2 + 3 = 6." },
        { txt: "(x => x * x, x => x + 1)", ok: false, msg: "No: 1 + 4 + 9 = 14." },
        { txt: "(x => 2 * x, x => x + 1)", ok: false, msg: "No: 2 + 4 + 6 = 12." }
      ] },
    { id: "mismo", numerico: true, respuesta: 8,
      texto: "¿Cuánto vale suma(x => x + 2, x => x + 2, 1, 3)? Los dos literales son iguales y hacen cosas distintas.",
      bien: "Correcto: los términos son 1 y 3 (el 5 ya se pasa), y f los vuelve 3 y 5. Suma 8.",
      mal: "No. prox = x => x + 2 genera los términos 1 y 3; f = x => x + 2 los convierte en 3 y 5. Eso da 8." }
  ];

  var API = { PREGUNTAS: PREGUNTAS };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var resueltas = {};

  function terminar(id) {
    resueltas[id] = true;
    if (Object.keys(resueltas).length === PREGUNTAS.length) {
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    }
  }

  function construir() {
    var caja = document.getElementById("preguntas");
    PREGUNTAS.forEach(function (q, n) {
      var carta = document.createElement("div");
      carta.className = "carta";
      var h = document.createElement("h2");
      h.textContent = (n + 1) + ". " + q.texto;
      carta.appendChild(h);
      var ver = document.createElement("div");
      ver.className = "veredicto";
      if (q.numerico) {
        var fila = document.createElement("div");
        fila.className = "prediccion";
        var inp = document.createElement("input");
        inp.type = "number"; inp.placeholder = "su número";
        var b = document.createElement("button");
        b.className = "primario"; b.textContent = "Comprobar";
        b.addEventListener("click", function () {
          var v = parseInt(inp.value, 10);
          if (isNaN(v)) { ver.className = "veredicto mal"; ver.textContent = "Escriba un número primero."; return; }
          var bien = v === q.respuesta;
          ver.className = "veredicto " + (bien ? "bien" : "mal");
          ver.textContent = bien ? q.bien : q.mal;
          if (bien) { terminar(q.id); }
        });
        fila.appendChild(inp); fila.appendChild(b);
        carta.appendChild(fila);
      } else {
        var ops = document.createElement("div");
        ops.className = "opciones";
        var marcadas = {};
        q.opciones.forEach(function (o, i) {
          var b = document.createElement("button");
          b.textContent = o.txt;
          b.addEventListener("click", function () {
            if (!q.multiple) {
              ops.querySelectorAll("button").forEach(function (x) { x.className = ""; });
              b.className = o.ok ? "primario" : "";
              ver.className = "veredicto " + (o.ok ? "bien" : "mal");
              ver.textContent = o.msg;
              if (o.ok) { terminar(q.id); }
              return;
            }
            marcadas[i] = !marcadas[i];
            b.className = marcadas[i] ? "primario" : "";
            ver.className = "veredicto";
            ver.textContent = "";
          });
          ops.appendChild(b);
        });
        carta.appendChild(ops);
        if (q.multiple) {
          var comprobar = document.createElement("button");
          comprobar.className = "primario"; comprobar.textContent = "Comprobar las marcadas";
          comprobar.style.marginTop = "0.5rem";
          comprobar.addEventListener("click", function () {
            var faltan = [], sobran = [];
            q.opciones.forEach(function (o, i) {
              if (o.ok && !marcadas[i]) { faltan.push(o); }
              if (!o.ok && marcadas[i]) { sobran.push(o); }
            });
            if (faltan.length === 0 && sobran.length === 0) {
              ver.className = "veredicto bien";
              ver.textContent = "Correcto. " + q.opciones.filter(function (o) { return o.ok; }).map(function (o) { return o.msg; }).join(" ");
              terminar(q.id);
            } else if (sobran.length > 0) {
              ver.className = "veredicto mal";
              ver.textContent = sobran[0].msg;
            } else {
              ver.className = "veredicto mal";
              ver.textContent = "Falta uno. " + faltan[0].msg;
            }
          });
          carta.appendChild(comprobar);
        }
      }
      carta.appendChild(ver);
      caja.appendChild(carta);
    });
  }

  construir();
})();
