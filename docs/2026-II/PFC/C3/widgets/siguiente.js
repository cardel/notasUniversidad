/* Siguiente: la reducción de suma(cuadrado, suc, 1, 3) por sustitución,
   pero cada paso lo elige el estudiante entre tres expresiones. Los
   distractores cambian el valor o rompen el orden por valor. El resultado,
   14, sale de 09_traza.scala.

   La reducción se arma de arriba hacia abajo: cada paso resuelto queda con
   su regla debajo, y la pregunta siguiente se agrega al final de la lista. */
(function () {
  var B = 3;

  /* 1 + (4 + (centro)) para los valores ya resueltos [1, 4]. */
  function envolver(vals, centro) {
    var s = (vals.length > 0 && / \+ /.test(centro)) ? "(" + centro + ")" : centro, i;
    for (i = vals.length - 1; i >= 0; i = i - 1) {
      s = vals[i] + " + " + (i === vals.length - 1 ? s : "(" + s + ")");
    }
    return s;
  }

  function llamada(a) { return "suma(cuadrado, suc, " + a + ", " + B + ")"; }

  function pasos() {
    var P = [], vals = [], a = 1, ultimo, centro;
    P.push({ expr: llamada(1), tipo: "inicio" });
    while (a <= B) {
      P.push({ tipo: "cuerpo",
        expr: envolver(vals, "cuadrado(" + a + ") + suma(cuadrado, suc, suc(" + a + "), " + B + ")"),
        regla: "Se sustituye el cuerpo con a = " + a + ". Aparecen dos cosas por hacer: cuadrado(" + a + ") y la llamada.",
        malas: [
          { expr: envolver(vals, "cuadrado(" + a + ") + suma(cuadrado, suc, " + a + ", suc(" + B + "))"),
            msg: "prox avanza el término a; b es el tope y no se toca." },
          { expr: envolver(vals, "cuadrado(suc(" + a + ")) + suma(cuadrado, suc, suc(" + a + "), " + B + ")"),
            msg: "f se aplica al término de esta llamada, a = " + a + ". prox solo produce el de la siguiente." }
        ] });
      P.push({ tipo: "f",
        expr: envolver(vals, (a * a) + " + suma(cuadrado, suc, suc(" + a + "), " + B + ")"),
        regla: "Por valor, el operando izquierdo se reduce primero: cuadrado(" + a + ") = " + (a * a) + ".",
        malas: [
          { expr: envolver(vals, "cuadrado(" + a + ") + (cuadrado(suc(" + a + ")) + suma(cuadrado, suc, suc(suc(" + a + ")), " + B + "))"),
            msg: "Por valor no se sustituye un cuerpo sin reducir antes sus argumentos, y el operando izquierdo, cuadrado(" + a + "), va antes que la llamada de la derecha." },
          { expr: envolver(vals, ((a + 1) * (a + 1)) + " + suma(cuadrado, suc, suc(" + a + "), " + B + ")"),
            msg: "Ese es el cuadrado de " + (a + 1) + ". El término de esta llamada es " + a + "." }
        ] });
      P.push({ tipo: "arg",
        expr: envolver(vals, (a * a) + " + suma(cuadrado, suc, " + (a + 1) + ", " + B + ")"),
        regla: "El argumento suc(" + a + ") se reduce antes de entrar a la llamada: " + (a + 1) + ".",
        malas: [
          { expr: envolver(vals, (a * a) + " + suma(cuadrado, suc, " + a + ", " + B + ")"),
            msg: "suc(" + a + ") no es " + a + ". Sin avanzar, la misma llamada se repetiría hasta reventar la pila." },
          { expr: envolver(vals, (a * a) + " + suma(cuadrado, suc, " + (a + 2) + ", " + B + ")"),
            msg: "suc(" + a + ") es " + (a + 1) + ", no " + (a + 2) + ". Con ese salto se perdería un término." }
        ] });
      vals.push(a * a);
      a = a + 1;
    }
    P.push({ tipo: "base",
      expr: envolver(vals, "0"),
      regla: a + " > " + B + ": el caso base devuelve 0 sin llamar a nadie. Ahora la suma de más adentro tiene dos valores.",
      malas: [
        { expr: envolver(vals, "1"), msg: "El caso base de una suma es 0. Con 1, el total sale con uno de más: es sumaBaseUno." },
        { expr: envolver(vals, "cuadrado(" + a + ") + suma(cuadrado, suc, suc(" + a + "), " + B + ")"),
          msg: a + " > " + B + ": la condición se cumple y no hay más términos. Con esto la suma nunca pararía." }
      ] });
    centro = 0;
    while (vals.length > 0) {
      ultimo = vals[vals.length - 1];
      var resto = vals.slice(0, -1);
      var nuevo = ultimo + centro;
      var malas = [{ expr: envolver(resto, String(ultimo * centro)), msg: "Es una suma, no un producto: " + ultimo + " + " + centro + " = " + nuevo + "." }];
      if (vals.length >= 2) {
        malas.push({ expr: envolver([vals[0] + vals[1]].concat(vals.slice(2)), String(centro)),
          msg: "La suma de afuera todavía no tiene dos valores: su operando derecho es una expresión. Solo la más interna puede hacerse." });
      } else {
        malas.push({ expr: String(nuevo + 1), msg: ultimo + " + " + centro + " es " + nuevo + "." });
      }
      P.push({ tipo: "cierra", expr: envolver(resto, String(nuevo)),
        regla: "La suma más interna es la única con dos valores: " + ultimo + " + " + centro + " = " + nuevo + ".",
        malas: malas });
      vals = resto;
      centro = nuevo;
    }
    return P;
  }

  var PASOS = pasos();
  var API = { pasos: pasos, envolver: envolver, PASOS: PASOS };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var k = 1;
  var errores = 0;
  var mensajeMalo = "";

  function opcionesDe(paso, i) {
    var lista = [{ expr: paso.expr, ok: true }].concat(paso.malas.map(function (m) { return { expr: m.expr, ok: false, msg: m.msg }; }));
    /* Orden fijo por paso para que no siempre quede la correcta de primera. */
    var giro = i % lista.length;
    return lista.slice(giro).concat(lista.slice(0, giro));
  }

  function crear(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) { e.className = clase; }
    if (texto !== undefined) { e.textContent = texto; }
    return e;
  }

  /* Una línea de la reducción: flecha a la izquierda, expresión a la derecha. */
  function lineaExpr(texto, conFlecha, clase) {
    var fila = crear("div", "reduccion" + (clase ? " " + clase : ""));
    fila.appendChild(crear("span", "flecha-red", conFlecha ? "→" : ""));
    fila.appendChild(crear("code", "expr", texto));
    return fila;
  }

  function bloquePregunta(traza) {
    var paso = PASOS[k];
    var caja = crear("div", "paso pregunta");
    caja.appendChild(lineaExpr("¿cuál es el paso que sigue?", true, "incognita"));
    caja.appendChild(crear("div", "progreso", "Paso " + k + " de " + (PASOS.length - 1) + " · equivocaciones: " + errores));

    var ops = crear("div", "opciones-red");
    opcionesDe(paso, k).forEach(function (o) {
      var b = crear("button", null, o.expr);
      b.addEventListener("click", function () {
        if (o.ok) {
          k = k + 1;
          mensajeMalo = "";
        } else {
          errores = errores + 1;
          mensajeMalo = o.msg;
        }
        pintar();
      });
      ops.appendChild(b);
    });
    caja.appendChild(ops);

    if (mensajeMalo) {
      caja.appendChild(crear("div", "veredicto mal", mensajeMalo));
    }
    traza.appendChild(caja);
  }

  function bloqueCierre(traza) {
    var caja = crear("div", "paso");
    var v = crear("div", "veredicto bien",
      "Llegó a 14 en " + (PASOS.length - 1) + " pasos con " + errores + " equivocación(es). " +
      (errores === 0 ? "Sin una sola." : "Vuelva a mirar en cuáles: son las que el compilador no avisa."));
    caja.appendChild(v);
    traza.appendChild(caja);
    document.getElementById("carta-cierre").classList.remove("bloqueado");
  }

  function pintar() {
    var traza = document.getElementById("traza");
    var i, caja;
    traza.innerHTML = "";
    for (i = 0; i < k; i = i + 1) {
      caja = crear("div", "paso" + (i === k - 1 ? " nuevo" : ""));
      caja.appendChild(lineaExpr(PASOS[i].expr, i > 0, i === k - 1 ? "ultima" : null));
      if (i > 0) { caja.appendChild(crear("div", "regla", PASOS[i].regla)); }
      traza.appendChild(caja);
    }
    if (k < PASOS.length) { bloquePregunta(traza); } else { bloqueCierre(traza); }
  }

  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 1;
    errores = 0;
    mensajeMalo = "";
    document.getElementById("carta-cierre").classList.add("bloqueado");
    pintar();
  });
  pintar();
})();
