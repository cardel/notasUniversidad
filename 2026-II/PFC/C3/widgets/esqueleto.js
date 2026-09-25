/* Esqueleto: tres sumas dadas en notación matemática; para cada una se
   escoge el par f / prox que la produce con suma. Los valores esperados
   salen de correr suma con scala-cli: 100, 40 y 31. */
(function () {
  var LITERALES = [
    { id: "id",   txt: "x => x",         f: function (x) { return x; } },
    { id: "suc",  txt: "x => x + 1",     f: function (x) { return x + 1; } },
    { id: "dos",  txt: "x => x + 2",     f: function (x) { return x + 2; } },
    { id: "tres", txt: "x => x + 3",     f: function (x) { return x + 3; } },
    { id: "dob",  txt: "x => x * 2",     f: function (x) { return x * 2; } },
    { id: "cubo", txt: "x => x * x * x", f: function (x) { return x * x * x; } }
  ];

  var SUMAS = [
    { id: 0, formula: "1³ + 2³ + 3³ + 4³", a: 1, b: 4, f: "cubo", prox: "suc", valor: 100,
      pista: "Los términos van de uno en uno; lo que cambia es qué se hace con cada uno." },
    { id: 1, formula: "2 + 5 + 8 + 11 + 14", a: 2, b: 14, f: "id", prox: "tres", valor: 40,
      pista: "Cada término se suma tal cual; lo que cambia es cuánto se avanza." },
    { id: 2, formula: "1 + 2 + 4 + 8 + 16", a: 1, b: 16, f: "id", prox: "dob", valor: 31,
      pista: "Avanzar no es siempre sumar algo: aquí cada término es el doble del anterior." }
  ];

  function literal(id) {
    var i;
    for (i = 0; i < LITERALES.length; i = i + 1) { if (LITERALES[i].id === id) { return LITERALES[i]; } }
    return null;
  }

  /* Los términos que genera prox desde a sin pasarse de b, con tope para
     un prox que no avanza. Devuelve {terminos, revienta}. */
  function terminos(proxId, a, b) {
    var p = literal(proxId).f, T = [], x = a, n = 0;
    while (x <= b && n < 40) { T.push(x); x = p(x); n = n + 1; }
    return { terminos: T, revienta: n >= 40 };
  }

  function evaluar(fId, proxId, a, b) {
    var t = terminos(proxId, a, b), f = literal(fId).f, s = 0, i;
    if (t.revienta) { return { revienta: true, terminos: t.terminos.slice(0, 6) }; }
    for (i = 0; i < t.terminos.length; i = i + 1) { s = s + f(t.terminos[i]); }
    return { revienta: false, valor: s, terminos: t.terminos, aplicados: t.terminos.map(f) };
  }

  /* Diagnóstico de una elección: qué está mal y por qué. */
  function diagnostico(suma, fId, proxId) {
    if (fId === suma.f && proxId === suma.prox) {
      return { ok: true, msg: "Correcto: f = " + literal(fId).txt + " y prox = " + literal(proxId).txt + ". Da " + suma.valor + "." };
    }
    var r = evaluar(fId, proxId, suma.a, suma.b);
    if (r.revienta) {
      return { ok: false, msg: "Con prox = " + literal(proxId).txt + " el término no avanza y a nunca pasa de b. Como suma deja f(a) + esperando en cada vuelta, la pila revienta." };
    }
    if (fId === suma.prox && proxId === suma.f) {
      return { ok: false, msg: "Están al revés. f dice qué se hace con cada término; prox dice cuál es el siguiente. Con estos, los términos serían " + r.terminos.join(", ") + " y daría " + r.valor + "." };
    }
    if (proxId !== suma.prox) {
      return { ok: false, msg: "El avance no es ese. Con prox = " + literal(proxId).txt + " los términos son " + r.terminos.join(", ") + ", no los de la fórmula." };
    }
    return { ok: false, msg: "Los términos sí son " + r.terminos.join(", ") + ", pero f = " + literal(fId).txt + " los convierte en " + r.aplicados.join(", ") + " y suma " + r.valor + ", no " + suma.valor + "." };
  }

  var API = { LITERALES: LITERALES, SUMAS: SUMAS, evaluar: evaluar, diagnostico: diagnostico, terminos: terminos };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var eleccion = {};
  var resueltas = {};

  function construir() {
    var caja = document.getElementById("sumas");
    caja.innerHTML = "";
    SUMAS.forEach(function (s) {
      var carta = document.createElement("div");
      carta.className = "suma-caso";
      carta.id = "suma-" + s.id;
      var enc = document.createElement("div");
      enc.className = "formula";
      enc.innerHTML = "<b>" + s.formula + "</b> <span class=\"rango\">= suma(f, prox, " + s.a + ", " + s.b + ")</span>";
      carta.appendChild(enc);
      ["f", "prox"].forEach(function (papel) {
        var fila = document.createElement("div");
        fila.className = "fila-lit";
        var rot = document.createElement("span");
        rot.className = "rotulo-lit";
        rot.textContent = papel + " =";
        fila.appendChild(rot);
        LITERALES.forEach(function (l) {
          var b = document.createElement("button");
          b.textContent = l.txt;
          b.setAttribute("data-suma", s.id);
          b.setAttribute("data-papel", papel);
          b.setAttribute("data-lit", l.id);
          b.addEventListener("click", function () {
            eleccion[s.id] = eleccion[s.id] || {};
            eleccion[s.id][papel] = l.id;
            fila.querySelectorAll("button").forEach(function (o) { o.className = ""; });
            b.className = "primario";
          });
          fila.appendChild(b);
        });
        carta.appendChild(fila);
      });
      var botones = document.createElement("div");
      botones.className = "botones";
      var comprobar = document.createElement("button");
      comprobar.className = "primario";
      comprobar.textContent = "Comprobar";
      var ver = document.createElement("div");
      ver.className = "veredicto";
      ver.id = "ver-" + s.id;
      comprobar.addEventListener("click", function () {
        var e = eleccion[s.id] || {};
        if (!e.f || !e.prox) {
          ver.className = "veredicto mal";
          ver.textContent = "Faltan f o prox.";
          return;
        }
        var d = diagnostico(s, e.f, e.prox);
        ver.className = "veredicto " + (d.ok ? "bien" : "mal");
        ver.textContent = d.msg;
        if (d.ok) {
          resueltas[s.id] = true;
          if (Object.keys(resueltas).length === SUMAS.length) {
            document.getElementById("carta-cierre").classList.remove("bloqueado");
          }
        }
      });
      botones.appendChild(comprobar);
      carta.appendChild(botones);
      carta.appendChild(ver);
      var pista = document.createElement("div");
      pista.className = "nota";
      pista.textContent = s.pista;
      carta.appendChild(pista);
      caja.appendChild(carta);
    });
  }

  construir();
})();
