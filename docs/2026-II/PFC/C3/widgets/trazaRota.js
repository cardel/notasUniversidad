/* TrazaRota: tres trazas escritas de suma(x => x + 1, x => x + 2, 1, 7).
   Dos vienen de las versiones equivocadas de 10_errores_parametro (una
   avanza de uno, otra cierra con 1) y una está sana. Hay que señalar el
   primer paso equivocado, o decir que no lo hay, y nombrar la versión.
   Los totales, 20, 35 y 21, salen de correr las tres. */
(function () {
  var A = 1, B = 7;
  function f(x) { return x + 1; }

  function envolver(vals, centro) {
    var s = (vals.length > 0 && / \+ /.test(centro)) ? "(" + centro + ")" : centro, i;
    for (i = vals.length - 1; i >= 0; i = i - 1) {
      s = vals[i] + " + " + (i === vals.length - 1 ? s : "(" + s + ")");
    }
    return s;
  }

  /* Genera la traza de una versión: paso (avance) y base (qué devuelve). */
  function traza(paso, base) {
    var T = [], vals = [], a = A;
    T.push({ expr: "suma(f, prox, " + a + ", " + B + ")", nota: "llamada inicial" });
    while (a <= B) {
      var sig = a + paso;
      T.push({ expr: envolver(vals, f(a) + " + suma(f, prox, " + sig + ", " + B + ")"),
        nota: "f(" + a + ") = " + f(a) + "; siguiente a = " + sig, a: a, sig: sig });
      vals.push(f(a));
      a = sig;
    }
    T.push({ expr: envolver(vals, String(base)), nota: a + " > " + B + ": devuelve " + base, base: base });
    var total = vals.reduce(function (s, v) { return s + v; }, base);
    T.push({ expr: String(total), nota: "se cierran las sumas" });
    return T;
  }

  var CASOS = [
    { id: 0, rotulo: "Traza A", version: "sumaBaseUno", pasos: traza(2, 1),
      rota: 5, explicacion: "Los avances están bien, 1, 3, 5, 7. Lo que falla es el cierre: con 9 > 7 la llamada devuelve 1 y no 0. Es sumaBaseUno, y el total sale con uno de más: 21." },
    { id: 1, rotulo: "Traza B", version: "suma", pasos: traza(2, 0),
      rota: -1, explicacion: "No hay ningún paso equivocado. Avanza de dos en dos, aplica f al término de cada llamada y cierra con 0. Es suma: 2 + 4 + 6 + 8 = 20." },
    { id: 2, rotulo: "Traza C", version: "sumaSinProx", pasos: traza(1, 0),
      rota: 1, explicacion: "Ya el primer paso está mal: de a = 1 pasa a 2, y prox era x + 2. Es sumaSinProx, que recibe prox y nunca lo usa. Todo lo que sigue es consistente con ese error, por eso el total 35 parece razonable." }
  ];

  var VERSIONES = [
    { id: "suma", txt: "suma: la buena" },
    { id: "sumaSinProx", txt: "sumaSinProx: avanza siempre de uno" },
    { id: "sumaBaseUno", txt: "sumaBaseUno: cierra con 1" }
  ];

  var API = { CASOS: CASOS, traza: traza, VERSIONES: VERSIONES };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0;
  var marcado = null;
  var resueltos = {};

  function pintar() {
    var c = CASOS[actual];
    var caja = document.getElementById("panel-traza");
    caja.innerHTML = "";
    c.pasos.forEach(function (p, i) {
      var fila = document.createElement("div");
      fila.className = "paso-traza" + (marcado === i ? " marcado" : "");
      var num = document.createElement("span");
      num.className = "num-paso";
      num.textContent = i === 0 ? "" : "→";
      var texto = document.createElement("code");
      texto.textContent = p.expr;
      fila.appendChild(num);
      fila.appendChild(texto);
      if (i > 0) {
        fila.addEventListener("click", function () { marcado = i; pintar(); });
      }
      caja.appendChild(fila);
    });
    document.getElementById("btn-ninguno").className = marcado === -1 ? "primario" : "";
    document.querySelectorAll("[data-caso]").forEach(function (b, i) {
      b.className = (i === actual ? "primario" : "") + (resueltos[i] ? " hecho" : "");
    });
    document.querySelectorAll("[data-version]").forEach(function (b) { b.className = ""; });
    var v = document.getElementById("veredicto");
    v.className = "veredicto"; v.textContent = "";
    document.getElementById("progreso").textContent = Object.keys(resueltos).length + " de " + CASOS.length + " resueltas";
  }

  document.querySelectorAll("[data-caso]").forEach(function (b) {
    b.addEventListener("click", function () {
      actual = parseInt(b.getAttribute("data-caso"), 10);
      marcado = null;
      pintar();
    });
  });
  document.getElementById("btn-ninguno").addEventListener("click", function () { marcado = -1; pintar(); });

  document.querySelectorAll("[data-version]").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = CASOS[actual];
      var v = document.getElementById("veredicto");
      var version = b.getAttribute("data-version");
      document.querySelectorAll("[data-version]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      if (marcado === null) {
        v.className = "veredicto mal";
        v.textContent = "Primero marque el paso equivocado, o diga que no hay ninguno.";
        return;
      }
      var pasoBien = marcado === c.rota;
      var versionBien = version === c.version;
      if (pasoBien && versionBien) {
        v.className = "veredicto bien";
        v.textContent = "Correcto. " + c.explicacion;
        resueltos[actual] = true;
        document.querySelectorAll("[data-caso]")[actual].className = "primario hecho";
        document.getElementById("progreso").textContent = Object.keys(resueltos).length + " de " + CASOS.length + " resueltas";
        if (Object.keys(resueltos).length === CASOS.length) {
          document.getElementById("carta-cierre").classList.remove("bloqueado");
        }
      } else if (!pasoBien && c.rota === -1) {
        v.className = "veredicto mal";
        v.textContent = "Ese paso está bien. Revise el avance y el cierre de cada uno: puede que no haya ningún error.";
      } else if (!pasoBien && marcado === -1) {
        v.className = "veredicto mal";
        v.textContent = "Sí hay uno. Compare en cada paso el a que entra con el prox del anterior, y mire qué devuelve la última llamada.";
      } else if (!pasoBien) {
        v.className = "veredicto mal";
        v.textContent = marcado < c.rota
          ? "Ese paso todavía está bien; el error viene después."
          : "Ese paso ya arrastra el error; el primero equivocado está antes.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "El paso es ese, pero la versión no. ¿Qué cambió en él: el avance o el valor de cierre?";
      }
    });
  });

  pintar();
})();
