/* Ejercicio interactivo: dónde cae cada elemento de un deque de bloques (clase 20).
   Modelo del ejercicio: bloques de B casillas y un mapa de punteros a bloques.
   - Vacío: un bloque en la ranura del medio del mapa, ini = 0.
   - El elemento i está en la ranura primera + (ini + i) / B, casilla (ini + i) % B.
   - push_back pide un bloque nuevo cuando la casilla cae en una ranura sin bloque.
   - push_front con ini = 0 pide un bloque en la ranura anterior y deja ini = B - 1.
   - Si la ranura que se necesita no existe, el mapa se copia a uno del doble de
     ranuras, con los bloques centrados: empiezan en la ranura (2M - k) / 2. */
var EJERCICIO = (function () {
  var B = 3;
  var M = 3;
  var OPERACIONES = [
    ["push_back", 5], ["push_back", 8], ["push_back", 1], ["push_back", 6],
    ["push_front", 9], ["push_front", 4], ["push_front", 7], ["push_front", 3],
    ["push_back", 2]
  ];

  function nuevo(b, m) {
    var mapa = [];
    var k = 0;
    while (k < m) { mapa.push(null); k = k + 1; }
    var medio = Math.floor((m - 1) / 2);
    mapa[medio] = bloque(b);
    return { B: b, mapa: mapa, primera: medio, ini: 0, n: 0, crecimientos: [], copiados: 0 };
  }

  function bloque(b) {
    var c = [];
    var k = 0;
    while (k < b) { c.push(null); k = k + 1; }
    return c;
  }

  /* Duplica el mapa y centra los k bloques; devuelve el corrimiento de las ranuras. */
  function crecer(dq) {
    var viejo = dq.mapa;
    var usados = [];
    var k = 0;
    while (k < viejo.length) {
      if (viejo[k] !== null) { usados.push(k); }
      k = k + 1;
    }
    var m2 = 2 * viejo.length;
    var desde = Math.floor((m2 - usados.length) / 2);
    var mapa = [];
    k = 0;
    while (k < m2) { mapa.push(null); k = k + 1; }
    usados.forEach(function (r, j) { mapa[desde + j] = viejo[r]; });
    var corrimiento = desde - usados[0];
    dq.mapa = mapa;
    dq.primera = dq.primera + corrimiento;
    dq.copiados = dq.copiados + usados.length;
    return usados.length;
  }

  function ubicar(dq, i) {
    var g = dq.ini + i;
    return { ranura: dq.primera + Math.floor(g / dq.B), casilla: g % dq.B };
  }

  function pushBack(dq, x) {
    var u = ubicar(dq, dq.n);
    var creció = null;
    if (u.ranura >= dq.mapa.length) {
      creció = crecer(dq);
      u = ubicar(dq, dq.n);
    }
    if (dq.mapa[u.ranura] === null) { dq.mapa[u.ranura] = bloque(dq.B); }
    dq.mapa[u.ranura][u.casilla] = x;
    dq.n = dq.n + 1;
    return { ranura: u.ranura, casilla: u.casilla, creció: creció };
  }

  function pushFront(dq, x) {
    var creció = null;
    if (dq.ini === 0) {
      if (dq.primera === 0) { creció = crecer(dq); }
      dq.primera = dq.primera - 1;
      dq.mapa[dq.primera] = bloque(dq.B);
      dq.ini = dq.B - 1;
    } else {
      dq.ini = dq.ini - 1;
    }
    dq.mapa[dq.primera][dq.ini] = x;
    dq.n = dq.n + 1;
    return { ranura: dq.primera, casilla: dq.ini, creció: creció };
  }

  function leer(dq, i) {
    var u = ubicar(dq, i);
    return dq.mapa[u.ranura][u.casilla];
  }

  function contenido(dq) {
    var v = [];
    var i = 0;
    while (i < dq.n) { v.push(leer(dq, i)); i = i + 1; }
    return v;
  }

  function copiar(dq) {
    return { mapa: dq.mapa.map(function (b) { return b === null ? null : b.slice(); }),
             primera: dq.primera, ini: dq.ini, n: dq.n, M: dq.mapa.length };
  }

  function correr(b, m, operaciones) {
    var dq = nuevo(b, m);
    var pasos = [];
    operaciones.forEach(function (o) {
      var r = o[0] === "push_back" ? pushBack(dq, o[1]) : pushFront(dq, o[1]);
      pasos.push({ op: o[0] + "(" + o[1] + ")", ranura: r.ranura, casilla: r.casilla,
                   creció: r.creció, estado: copiar(dq), contenido: contenido(dq) });
    });
    return { dq: dq, pasos: pasos };
  }

  function mapaHtml(st) {
    var h = "<div class=\"mapa\">";
    st.mapa.forEach(function (b, r) {
      h = h + "<div class=\"fila-mapa\"><span class=\"ranura" + (b !== null ? " usada" : "") + "\">ranura " + r + "</span>";
      if (b !== null) {
        b.forEach(function (v) {
          h = h + "<span class=\"caja fija" + (v === null ? " vacia" : "") + "\">" + (v === null ? "" : v) + "</span>";
        });
      }
      h = h + "</div>";
    });
    return h + "</div><p>primera ranura con datos: " + st.primera + " · ini = " + st.ini + " · n = " + st.n + " · el mapa tiene " + st.M + " ranuras</p>";
  }

  function spec() {
    var R = correr(B, M, OPERACIONES);
    var P = R.pasos;
    var crece = P.filter(function (p) { return p.creció !== null; });
    var d6 = ubicar(R.dq, 6);
    var lista = OPERACIONES.map(function (o) { return "d." + o[0] + "(" + o[1] + ");"; }).join("\n");
    var pasos = [{ texto: "el deque vacío: un bloque en la ranura del medio", html: mapaHtml(copiar(nuevo(B, M))) }];
    P.forEach(function (p) {
      pasos.push({ texto: p.op + " escribe en la ranura " + p.ranura + ", casilla " + p.casilla +
                          (p.creció !== null ? "; antes, el mapa crece y copia " + p.creció + " punteros" : ""),
                   html: mapaHtml(p.estado) });
    });
    return {
      contenedor: "tarjetas",
      cierre: "Leer <code>d[i]</code> son dos cuentas, <code>(ini + i) / B</code> y <code>(ini + i) % B</code>, y dos accesos, al mapa y al bloque: O(1) sin importar i. Entrar por un extremo escribe una casilla libre o pide un bloque, y ningún elemento se corre. Cuando el mapa se queda sin ranuras se copia, como el arreglo de un vector, pero lo que se copia son punteros a bloques, no los elementos. Con bloques de 128 enteros, como en la biblioteca de GCC, el mapa es 128 veces más corto que los datos.",
      cartas: [
        { tipo: "respuesta", titulo: "Dónde cae el cuarto <code>push_back</code>",
          html: "<p>Un deque de bloques de <code>B = 3</code> casillas, con un mapa de " + M + " ranuras. Vacío, tiene un bloque en la ranura 1 e <code>ini = 0</code>. El elemento <code>i</code> está en la ranura <code>primera + (ini + i) / B</code> y en la casilla <code>(ini + i) % B</code>. Si la ranura no tiene bloque, se pide uno; si la ranura no existe, el mapa se copia a uno del doble de ranuras, con los bloques centrados. Se ejecuta:</p><pre class=\"fragmento\">" + lista + "</pre><p>¿En qué ranura y en qué casilla escribe <code>push_back(6)</code>?</p>",
          campos: [{ rotulo: "ranura:", esperado: String(P[3].ranura) }, { rotulo: "casilla:", esperado: String(P[3].casilla) }],
          bien: "Correcto: ranura " + P[3].ranura + ", casilla " + P[3].casilla + ". El 6 es el elemento 3; (0 + 3) / 3 = 1 bloque después del primero, y (0 + 3) % 3 = 0. El bloque de la ranura 1 está lleno con 5, 8 y 1, así que se pide uno nuevo.",
          distractores: [
            { valores: ["1", "3"], msg: "Las casillas de un bloque de tres van de 0 a 2. La cuarta casilla es la 0 del bloque siguiente." }
          ],
          otro: "El 6 es el elemento 3. Calcule (ini + 3) / B y (ini + 3) % B con ini = 0." },
        { tipo: "respuesta", titulo: "<code>ini</code> después de <code>push_front(9)</code>",
          html: "<p>Antes del <code>push_front(9)</code>, <code>ini = 0</code>: el 5 ocupa la primera casilla del primer bloque. ¿En qué ranura queda el 9 y cuánto vale <code>ini</code>?</p>",
          campos: [{ rotulo: "ranura:", esperado: String(P[4].ranura) }, { rotulo: "ini =", esperado: String(P[4].estado.ini) }],
          bien: "Correcto: ranura " + P[4].ranura + " e ini = " + P[4].estado.ini + ". No hay casilla libre antes del 5 en su bloque, así que se pide un bloque en la ranura anterior y el 9 va en su última casilla. Ningún elemento se movió.",
          distractores: [
            { valores: [null, "0"], msg: "El 9 no puede ir en la casilla 0 del bloque nuevo: los elementos tienen que quedar seguidos, y detrás del 9 viene el 5, al comienzo del bloque siguiente." },
            { valores: [null, "-1"], msg: "ini es una casilla dentro del primer bloque, entre 0 y B − 1. Cuando no hay casilla antes, cambia el primer bloque." }
          ],
          otro: "El 9 va justo antes del 5. Si el 5 está en la casilla 0, ¿dónde queda el anterior?" },
        { tipo: "opciones", titulo: "Cuándo crece el mapa", correcta: "pf3",
          html: "<p>¿Cuál operación encuentra el mapa sin la ranura que necesita?</p>",
          opciones: [
            { op: "pb6", texto: "<code>push_back(6)</code>", msg: "El 6 necesita la ranura 2, que existe: el mapa tiene ranuras 0, 1 y 2." },
            { op: "pf9", texto: "<code>push_front(9)</code>", msg: "El 9 necesita la ranura 0, que existe y está libre." },
            { op: "pf3", texto: "<code>push_front(3)</code>", msg: "Correcto. Tras el 7, ini vuelve a 0 y el primer bloque está en la ranura 0: el 3 necesita la ranura −1. El mapa pasa de 3 a 6 ranuras, los tres bloques quedan en las ranuras 1, 2 y 3, y el bloque nuevo va en la 0." },
            { op: "pb2", texto: "<code>push_back(2)</code>", msg: "Cuando llega el 2, el mapa ya creció y su casilla cae en un bloque que tiene espacio." }
          ] },
        { tipo: "respuesta", titulo: "Lo que se copia al crecer",
          html: "<p>Cuando el mapa crece, el deque tiene siete elementos. ¿Cuántos punteros se copian al mapa nuevo, y cuántos elementos cambian de casilla?</p>",
          campos: [{ rotulo: "punteros:", esperado: String(crece[0].creció) }, { rotulo: "elementos:", esperado: "0" }],
          bien: "Correcto: " + crece[0].creció + " punteros y ningún elemento. Se copian los punteros a los bloques ocupados; los bloques no se mueven, así que los elementos siguen en la misma dirección de memoria.",
          distractores: [
            { valores: ["7", null], msg: "Se copian punteros a bloques, uno por bloque, no uno por elemento." },
            { valores: [null, "7"], msg: "Los bloques se quedan donde están: solo cambia en qué ranura se anota su dirección." }
          ],
          otro: "Cuente los bloques con datos antes del push_front(3)." },
        { tipo: "respuesta", titulo: "Leer <code>d[6]</code>",
          html: "<p>Al final, el deque tiene " + R.dq.n + " elementos, " + contenido(R.dq).join(" ") + ", con <code>ini = " + R.dq.ini + "</code> y la primera ranura con datos en " + R.dq.primera + ". ¿En qué ranura y casilla está <code>d[6]</code>, y cuánto vale?</p>",
          campos: [{ rotulo: "ranura:", esperado: String(d6.ranura) }, { rotulo: "casilla:", esperado: String(d6.casilla) }, { rotulo: "valor:", esperado: String(leer(R.dq, 6)) }],
          bien: "Correcto: (" + R.dq.ini + " + 6) / 3 = " + Math.floor((R.dq.ini + 6) / 3) + " y (" + R.dq.ini + " + 6) % 3 = " + ((R.dq.ini + 6) % 3) + ": ranura " + d6.ranura + ", casilla " + d6.casilla + ", donde está el " + leer(R.dq, 6) + ".",
          distractores: [
            { valores: ["2", "0", null], msg: "Con ini = 0 saldría así, pero el primer elemento está en la casilla " + R.dq.ini + " de su bloque, y esa diferencia se suma antes de dividir." }
          ],
          otro: "Sume ini a 6 antes de dividir entre B y de sacar el residuo." },
        { tipo: "pasos", titulo: "Operación por operación", pasos: pasos }
      ]
    };
  }

  return { B: B, M: M, operaciones: OPERACIONES, correr: correr, ubicar: ubicar,
           leer: leer, contenido: contenido, spec: spec };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  Tarjetas.montar(EJERCICIO.spec());
}
