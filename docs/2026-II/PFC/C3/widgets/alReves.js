/* AlReves: tres implementaciones ocultas y sus salidas para tres llamadas;
   hay que deducir cuál es cuál. Las salidas salen de correr suma,
   sumaSinProx y sumaBaseUno con scala-cli. */
(function () {
  var LLAMADAS = [
    { id: 0, txt: "X(x => x, x => x + 2, 1, 10)", suma: 25, sumaSinProx: 55, sumaBaseUno: 26 },
    { id: 1, txt: "X(x => x * x, x => x + 1, 1, 4)", suma: 30, sumaSinProx: 30, sumaBaseUno: 31 },
    { id: 2, txt: "X(x => 1, x => x + 3, 1, 10)", suma: 4, sumaSinProx: 10, sumaBaseUno: 5 }
  ];
  /* Qué versión se esconde detrás de cada letra. */
  var LETRAS = { A: "sumaBaseUno", B: "suma", C: "sumaSinProx" };
  var VERSIONES = ["suma", "sumaSinProx", "sumaBaseUno"];

  function salida(letra, llamada) { return llamada[LETRAS[letra]]; }

  /* La llamada en la que dos versiones coinciden: prox = x + 1 hace
     invisible a sumaSinProx. */
  function coinciden(llamada) {
    var pares = [], i, j;
    for (i = 0; i < VERSIONES.length; i = i + 1) {
      for (j = i + 1; j < VERSIONES.length; j = j + 1) {
        if (llamada[VERSIONES[i]] === llamada[VERSIONES[j]]) { pares.push([VERSIONES[i], VERSIONES[j]]); }
      }
    }
    return pares;
  }

  var API = { LLAMADAS: LLAMADAS, LETRAS: LETRAS, salida: salida, coinciden: coinciden };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function construirTabla() {
    var cuerpo = document.getElementById("cuerpo-salidas");
    cuerpo.innerHTML = "";
    LLAMADAS.forEach(function (l) {
      var tr = document.createElement("tr");
      var td = document.createElement("td"); td.className = "llamada"; td.textContent = l.txt; tr.appendChild(td);
      ["A", "B", "C"].forEach(function (letra) {
        var c = document.createElement("td"); c.textContent = salida(letra, l); tr.appendChild(c);
      });
      cuerpo.appendChild(tr);
    });
  }

  document.getElementById("btn-comprobar").addEventListener("click", function () {
    var v = document.getElementById("veredicto");
    var elegidas = {}, repetidas = false, malas = [];
    ["A", "B", "C"].forEach(function (letra) {
      var sel = document.getElementById("sel-" + letra).value;
      if (elegidas[sel]) { repetidas = true; }
      elegidas[sel] = true;
      if (sel !== LETRAS[letra]) { malas.push(letra); }
    });
    if (repetidas) {
      v.className = "veredicto mal";
      v.textContent = "Hay una versión asignada a dos letras. Son tres versiones distintas.";
      return;
    }
    if (malas.length === 0) {
      v.className = "veredicto bien";
      v.textContent = "Correcto. A cierra con 1 (26, 31 y 5: siempre uno más que B). C ignora prox: 55 es 1 + 2 + … + 10, y 10 es diez unos. Y B es la buena: 1 + 3 + 5 + 7 + 9 = 25.";
      document.getElementById("carta-dos").classList.remove("bloqueado");
    } else {
      v.className = "veredicto mal";
      v.textContent = "Fallan " + malas.join(" y ") + ". Pistas: una versión da siempre exactamente uno más que otra en las tres llamadas; otra da lo mismo que la buena solo cuando prox es x + 1.";
    }
  });

  document.querySelectorAll("[data-llamada]").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = parseInt(b.getAttribute("data-llamada"), 10);
      var v = document.getElementById("veredicto-dos");
      document.querySelectorAll("[data-llamada]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      var pares = coinciden(LLAMADAS[i]);
      if (pares.length > 0) {
        v.className = "veredicto bien";
        v.textContent = "Esa. Con prox = x => x + 1, avanzar de uno y usar prox es lo mismo, así que suma y sumaSinProx dan 30 las dos. Una prueba con ese prox nunca atrapa el error.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = "En esa llamada las tres salidas son distintas: separa a las tres versiones. Busque la llamada donde dos columnas coinciden.";
      }
    });
  });

  construirTabla();
})();
