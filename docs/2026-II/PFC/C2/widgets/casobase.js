/* Caso base: cuatro versiones de producto que difieren solo en los casos
   base. Los valores de cada una salieron de correrlas con scala-cli sobre
   (1, 5), (1, 2), (3, 3) y (2, 4). */
(function () {
  var VARIANTES = [
    { id: "a", correcta: true,
      base: "if (i >= j) 1\n  else if (i == j - 1) i",
      valores: { "(1, 5)": "24", "(1, 2)": "1", "(3, 3)": "1", "(2, 4)": "6" },
      porque: "Dos casos base y los dos hacen falta: el rango vacío vale 1 —el producto de nada— y el rango de un solo número vale ese número. Es la que usa la sesión." },
    { id: "b", correcta: false,
      base: "if (i >= j) 1",
      valores: { "(1, 5)": "StackOverflowError", "(1, 2)": "StackOverflowError", "(3, 3)": "1", "(2, 4)": "StackOverflowError" },
      porque: "Falta el caso del rango de uno. producto(1, 2) parte en m = 1 y se llama a sí mismo con (1, 2) otra vez, para siempre. Solo termina cuando el rango ya viene vacío." },
    { id: "c", correcta: false,
      base: "if (i >= j) 1\n  else if (i == j - 1) j",
      valores: { "(1, 5)": "120", "(1, 2)": "2", "(3, 3)": "1", "(2, 4)": "12" },
      porque: "Termina, pero cada hoja devuelve el número de afuera del rango en vez del de adentro: producto(1, 2) da 2 y no 1. El árbol multiplica 2·3·4·5 en lugar de 1·2·3·4, y el resultado sale multiplicado por 5." },
    { id: "d", correcta: false,
      base: "if (i >= j) 0\n  else if (i == j - 1) i",
      valores: { "(1, 5)": "24", "(1, 2)": "1", "(3, 3)": "0", "(2, 4)": "6" },
      porque: "Da 24 en (1, 5), igual que la correcta, porque con i < j el caso del rango vacío no se alcanza nunca al partir. Se delata en producto(3, 3): el producto de ningún número tiene que ser 1, y esta devuelve 0. Un caso base que casi nunca se ejecuta puede estar mal sin que ninguna prueba lo note." }
  ];

  var API = { VARIANTES: VARIANTES };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var resto = "  else {\n    val m = i + (j - i) / 2\n    producto(i, m) * producto(m, j)\n  }";

  function pintar() {
    var caja = document.getElementById("variantes");
    caja.innerHTML = "";
    VARIANTES.forEach(function (v) {
      var ficha = document.createElement("div");
      ficha.className = "variante"; ficha.id = "var-" + v.id;
      var b = document.createElement("button");
      b.textContent = "Variante " + v.id.toUpperCase() + " es la correcta";
      b.setAttribute("data-op", v.id);
      var pre = document.createElement("pre");
      pre.textContent = "def producto(i: Int, j: Int): Int =\n  " + v.base + "\n" + resto;
      var res = document.createElement("div");
      res.className = "resultado"; res.id = "res-" + v.id;
      ficha.appendChild(pre); ficha.appendChild(b); ficha.appendChild(res);
      caja.appendChild(ficha);
    });
    document.querySelectorAll("[data-op]").forEach(function (b) {
      b.addEventListener("click", function () { responder(b.getAttribute("data-op")); });
    });
  }

  function tabla(v) {
    var s = "<table class=\"valores\"><tr>";
    Object.keys(v.valores).forEach(function (k) { s += "<th>producto" + k + "</th>"; });
    s += "</tr><tr>";
    Object.keys(v.valores).forEach(function (k) {
      var val = v.valores[k];
      s += "<td class=\"" + (val.indexOf("Stack") >= 0 ? "soe" : "") + "\">" + val + "</td>";
    });
    return s + "</tr></table>";
  }

  function responder(op) {
    var elegida = VARIANTES.filter(function (v) { return v.id === op; })[0];
    var ver = document.getElementById("veredicto");
    document.querySelectorAll("[data-op]").forEach(function (b) { b.className = b.getAttribute("data-op") === op ? "primario" : ""; });
    if (elegida.correcta) {
      ver.className = "veredicto bien";
      ver.textContent = "Correcto. Ahora mire qué hace cada una de las otras tres: ninguna falla igual.";
      VARIANTES.forEach(function (v) {
        var res = document.getElementById("res-" + v.id);
        res.className = "resultado " + (v.correcta ? "bien" : "mal");
        res.innerHTML = "<b>" + (v.correcta ? "Correcta." : "Incorrecta.") + "</b> " + v.porque + tabla(v);
      });
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    } else {
      ver.className = "veredicto mal";
      ver.textContent = "No. " + elegida.porque;
      var res = document.getElementById("res-" + op);
      res.className = "resultado mal";
      res.innerHTML = tabla(elegida);
    }
  }

  pintar();
})();
