/* Cola: de cinco variantes de factIter, marcar las que siguen siendo de
   cola. Todas dan 720 para n = 6; para n = 100000 solo dos terminan. Los
   resultados salieron de correr las cinco con scala-cli. */
(function () {
  var VARIANTES = [
    { id: "a", deCola: true,
      codigo: "def factIter(cont: Int, prod: Int, n: Int): Int =\n  if (cont > n) prod\n  else factIter(cont + 1, cont * prod, n)",
      en6: "720", en100000: "0 (termina)",
      porque: "La llamada es lo último que hace el cuerpo. No hay nada alrededor esperando su resultado. Con @tailrec compila." },
    { id: "b", deCola: false,
      codigo: "def factIter(cont: Int, prod: Int, n: Int): Int =\n  if (cont > n) prod\n  else 1 + factIter(cont + 1, cont * prod, n) - 1",
      en6: "720", en100000: "StackOverflowError",
      porque: "El 1 + ... - 1 no cambia el valor, pero la suma tiene que esperar a que la llamada vuelva. Cada vuelta deja un marco en la pila. Con @tailrec no compila: could not optimize @tailrec annotated method factIter: it contains a recursive call not in tail position." },
    { id: "c", deCola: false,
      codigo: "def factIter(cont: Int, prod: Int, n: Int): Int =\n  if (cont > n) prod\n  else factIter(cont + 1, prod, n) * cont",
      en6: "720", en100000: "StackOverflowError",
      porque: "La multiplicación por cont se hace después de que la llamada vuelve. Es factorial lineal disfrazada de factIter: prod nunca cambia. Con @tailrec no compila." },
    { id: "d", deCola: false,
      codigo: "def factIter(cont: Int, prod: Int, n: Int): Int =\n  if (cont > n) prod\n  else math.max(factIter(cont + 1, cont * prod, n), 0)",
      en6: "720", en100000: "StackOverflowError",
      porque: "La llamada está dentro del argumento de math.max, así que math.max espera. Envolver la llamada en cualquier función la saca de la cola. Con @tailrec no compila." },
    { id: "e", deCola: true,
      codigo: "def factIter(cont: Int, prod: Int, n: Int): Int =\n  if (cont > n) prod\n  else {\n    val p = cont * prod\n    factIter(cont + 1, p, n)\n  }",
      en6: "720", en100000: "0 (termina)",
      porque: "El val se calcula antes de llamar, y la llamada sigue siendo lo último. Un bloque con definiciones no rompe la cola: lo que la rompe es una operación pendiente después de la llamada. Con @tailrec compila." }
  ];

  var API = { VARIANTES: VARIANTES };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var marcadas = {};

  function pintarVariantes() {
    var caja = document.getElementById("variantes");
    caja.innerHTML = "";
    VARIANTES.forEach(function (v) {
      var ficha = document.createElement("div");
      ficha.className = "variante" + (marcadas[v.id] ? " marcada" : "");
      ficha.id = "var-" + v.id;
      var cab = document.createElement("div");
      cab.className = "cab";
      var chk = document.createElement("input");
      chk.type = "checkbox"; chk.id = "chk-" + v.id; chk.checked = !!marcadas[v.id];
      chk.addEventListener("change", function () { marcadas[v.id] = chk.checked; ficha.classList.toggle("marcada", chk.checked); });
      var lab = document.createElement("label");
      lab.htmlFor = "chk-" + v.id; lab.textContent = " Variante " + v.id.toUpperCase() + " es de cola";
      cab.appendChild(chk); cab.appendChild(lab);
      var pre = document.createElement("pre");
      pre.textContent = v.codigo;
      var res = document.createElement("div");
      res.className = "resultado"; res.id = "res-" + v.id;
      ficha.appendChild(cab); ficha.appendChild(pre); ficha.appendChild(res);
      caja.appendChild(ficha);
    });
  }

  document.getElementById("btn-comprobar").addEventListener("click", function () {
    var aciertos = 0;
    VARIANTES.forEach(function (v) {
      var dijo = !!marcadas[v.id];
      var bien = dijo === v.deCola;
      if (bien) { aciertos = aciertos + 1; }
      var res = document.getElementById("res-" + v.id);
      res.className = "resultado " + (bien ? "bien" : "mal");
      res.innerHTML = "<b>" + (v.deCola ? "Sí es de cola." : "No es de cola.") + "</b> " + v.porque
        + "<br><code>n = 6 → " + v.en6 + "</code> &nbsp; <code>n = 100000 → " + v.en100000 + "</code>";
    });
    var ver = document.getElementById("veredicto");
    if (aciertos === VARIANTES.length) {
      ver.className = "veredicto bien";
      ver.textContent = "Las cinco bien. Dos son de cola y tres no, y las cinco dan 720 para n = 6: el valor no delata nada.";
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    } else {
      ver.className = "veredicto mal";
      ver.textContent = aciertos + " de 5. Lea el porqué de las que fallaron: en todas la pregunta es la misma, qué queda esperando después de la llamada.";
    }
  });

  pintarVariantes();
})();
