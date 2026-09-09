/* Ejercicio interactivo: la misma pregunta sobre las tres representaciones
   (clase 6). Se calculan los grados de todos los vertices. */
var EJERCICIO = (function () {
  var H1 = [[2, 3], [2, 5], [0, 1, 3, 4], [0, 2], [2, 5], [1, 4]];

  var CODIGO_LISTA = [
    { txt: "def grados_en_lista(G):", num: null },
    { txt: "    n = len(G)",          num: 1 },
    { txt: "    g = [0] * n",         num: 2 },
    { txt: "    u = 0",               num: 3 },
    { txt: "    while u < n:",        num: 4, bloque: 1 },
    { txt: "        g[u] = len(G[u])", num: 5, bloque: 1 },
    { txt: "        u = u + 1",       num: 6, bloque: 1 },
    { txt: "    return g",            num: 7 }
  ];

  var CODIGO_MATRIZ = [
    { txt: "def grados_en_matriz(m):",         num: null },
    { txt: "    n = len(m)",                   num: 1 },
    { txt: "    g = [0] * n",                  num: 2 },
    { txt: "    u = 0",                        num: 3 },
    { txt: "    while u < n:",                 num: 4, bloque: 1 },
    { txt: "        v = 0",                    num: 5, bloque: 1 },
    { txt: "        while v < n:",             num: 6, bloque: 2 },
    { txt: "            g[u] = g[u] + m[u][v]", num: 7, bloque: 2 },
    { txt: "            v = v + 1",            num: 8, bloque: 2 },
    { txt: "        u = u + 1",                num: 9, bloque: 1 },
    { txt: "    return g",                     num: 10 }
  ];

  var CODIGO_ARISTAS = [
    { txt: "def grados_en_aristas(n, E):",     num: null },
    { txt: "    g = [0] * n",                  num: 1 },
    { txt: "    for arista in E:",             num: 2, bloque: 1 },
    { txt: "        g[arista[0]] = g[arista[0]] + 1", num: 3, bloque: 1 },
    { txt: "        g[arista[1]] = g[arista[1]] + 1", num: 4, bloque: 1 },
    { txt: "    return g",                     num: 5 }
  ];

  function matrizDe(G) {
    var m = [];
    var u = 0;
    while (u < G.length) {
      var fila = [];
      var v = 0;
      while (v < G.length) { fila.push(0); v = v + 1; }
      m.push(fila);
      u = u + 1;
    }
    u = 0;
    while (u < G.length) {
      var i = 0;
      while (i < G[u].length) { m[u][G[u][i]] = 1; i = i + 1; }
      u = u + 1;
    }
    return m;
  }

  function aristasDe(G) {
    var e = [];
    var u = 0;
    while (u < G.length) {
      var i = 0;
      while (i < G[u].length) {
        if (u < G[u][i]) { e.push([u, G[u][i]]); }
        i = i + 1;
      }
      u = u + 1;
    }
    return e;
  }

  function simular(params) {
    var G = params.G;
    var pasos = [];
    var g = null, u = null, v = null, n = null;
    function snap(linea, extra) {
      var q = {
        linea: linea,
        u: u === null ? "–" : u,
        v: v === null ? "–" : v,
        g: g === null ? null : g.slice()
      };
      if (extra) { for (var c in extra) { q[c] = extra[c]; } }
      pasos.push(q);
    }
    if (params.forma === "lista") {
      n = G.length; snap(1);
      g = []; var t = 0;
      while (t < n) { g.push(0); t = t + 1; }
      snap(2);
      u = 0; snap(3);
      var sigue = true;
      while (sigue) {
        snap(4);
        if (u < n) {
          g[u] = G[u].length; snap(5);
          u = u + 1; snap(6);
        } else { sigue = false; }
      }
      u = null; snap(7);
    } else if (params.forma === "matriz") {
      var m = matrizDe(G);
      n = m.length; snap(1);
      g = []; var t2 = 0;
      while (t2 < n) { g.push(0); t2 = t2 + 1; }
      snap(2);
      u = 0; snap(3);
      var sigue2 = true;
      while (sigue2) {
        snap(4);
        if (u < n) {
          v = 0; snap(5);
          var dentro = true;
          while (dentro) {
            snap(6);
            if (v < n) {
              g[u] = g[u] + m[u][v]; snap(7);
              v = v + 1; snap(8);
            } else { dentro = false; }
          }
          v = null;
          u = u + 1; snap(9);
        } else { sigue2 = false; }
      }
      u = null; snap(10);
    } else {
      var E = aristasDe(G);
      n = G.length;
      g = []; var t3 = 0;
      while (t3 < n) { g.push(0); t3 = t3 + 1; }
      snap(1);
      var i = 0;
      while (i < E.length) {
        u = E[i][0]; v = E[i][1];
        snap(2);
        g[E[i][0]] = g[E[i][0]] + 1; snap(3);
        g[E[i][1]] = g[E[i][1]] + 1; snap(4);
        i = i + 1;
      }
      u = null; v = null;
      snap(5);
    }
    return pasos;
  }

  function gradosRef(G) {
    var g = [];
    var u = 0;
    while (u < G.length) { g.push(G[u].length); u = u + 1; }
    return g;
  }

  return { H1: H1, CODIGO_LISTA: CODIGO_LISTA, CODIGO_MATRIZ: CODIGO_MATRIZ,
           CODIGO_ARISTAS: CODIGO_ARISTAS, simular: simular, matrizDe: matrizDe,
           aristasDe: aristasDe, gradosRef: gradosRef };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { G: EJERCICIO.H1, forma: "lista",   codigo: EJERCICIO.CODIGO_LISTA,   clave: 5 },
      { G: EJERCICIO.H1, forma: "matriz",  codigo: EJERCICIO.CODIGO_MATRIZ,  clave: 7 },
      { G: EJERCICIO.H1, forma: "aristas", codigo: EJERCICIO.CODIGO_ARISTAS, clave: 3 }
    ];
    var medidas = { lista: null, matriz: null, aristas: null };

    function medir(p) {
      var pasos = EJERCICIO.simular(p);
      var cuenta = 0;
      var t = 0;
      while (t < pasos.length) {
        if (pasos[t].linea === p.clave) { cuenta = cuenta + 1; }
        t = t + 1;
      }
      return cuenta;
    }

    function alPintar(e) {
      var a = e.actual;
      document.getElementById("ver-g").textContent =
        a && a.g ? "[" + a.g.join(", ") + "]" : "–";
      var cuerpo = document.getElementById("cuerpo-medidas");
      cuerpo.innerHTML = "";
      var n = EJERCICIO.H1.length;
      var E = EJERCICIO.aristasDe(EJERCICIO.H1).length;
      var filas = [
        ["Lista de adyacencia", "lista", "$\\Theta(V)$", n],
        ["Matriz de adyacencia", "matriz", "V al cuadrado", n * n],
        ["Lista de aristas", "aristas", "E", E]
      ];
      var etiquetas = { lista: "V = " + n, matriz: "V² = " + (n * n), aristas: "E = " + E };
      var i = 0;
      while (i < filas.length) {
        var clave = filas[i][1];
        var tr = document.createElement("tr");
        var m = medidas[clave];
        tr.innerHTML = "<td style='text-align:left'>" + filas[i][0] + "</td><td>" +
          (m === null ? "<span class='pend'>ejecútela</span>" : m) + "</td><td>" +
          (m === null ? "<span class='pend'>—</span>" : etiquetas[clave]) + "</td>";
        cuerpo.appendChild(tr);
        i = i + 1;
      }
    }

    /* Re-iniciar el motor con otro programa exige soltar los escuchas
       viejos de los botones: se reemplazan por clones sin escuchas. */
    function evaluarPrediccion(valor, params) {
      var real = medir(params);
      var n = params.G.length;
      var E = EJERCICIO.aristasDe(params.G).length;
      if (valor === real) {
        medidas[params.forma] = real;
        Motor.repintar();
        return { ok: true, msg: "Correcto: " + real + " ejecuciones. Quedó " +
          "anotado en la tabla de abajo; complete las tres." };
      }
      if (valor === n) {
        return { ok: false, msg: "Ese es V. Solo la lista de adyacencia se " +
          "queda en V: mire cuántos ciclos anidados tiene el programa que está " +
          "viendo." };
      }
      if (valor === n * n) {
        return { ok: false, msg: "Ese es V². Es la cuenta de la matriz, que " +
          "recorre la fila completa de cada vértice, ceros incluidos." };
      }
      if (valor === E || valor === 2 * E) {
        return { ok: false, msg: "Va por el lado de E. Cuente exactamente " +
          "cuántas veces se ejecuta la línea marcada, no cuántas aristas hay." };
      }
      return { ok: false, msg: "No coincide. Ejecute con Auto y lea el contador " +
        "que queda al lado de la línea." };
    }

    function arrancar(k) {
      var ids = ["btn-paso", "btn-auto", "btn-fin", "btn-reiniciar", "btn-comprobar"];
      var t = 0;
      while (t < ids.length) {
        var b = document.getElementById(ids[t]);
        b.parentNode.replaceChild(b.cloneNode(true), b);
        t = t + 1;
      }
      Motor.iniciar({
        codigo: PRESETS[k].codigo,
        simular: EJERCICIO.simular,
        chips: [
          { campo: "u", rotulo: "u" },
          { campo: "v", rotulo: "v" }
        ],
        paramsIniciales: PRESETS[k],
        alPintar: alPintar
      });
      Motor.prediccionNumerica(evaluarPrediccion);
      document.getElementById("prediccion").value = "";
      Motor.limpiarVeredicto();
      document.getElementById("rotulo-clave").textContent = "línea " + PRESETS[k].clave;
    }

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        arrancar(parseInt(btn.getAttribute("data-preset"), 10));
      });
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cual button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "depende") {
          veredicto("veredicto-cual", true, "Ese es el punto de la clase. Para " +
            "los grados gana la lista de adyacencia y la de aristas queda " +
            "segunda, por delante de la matriz. Para preguntar si existe una " +
            "arista suelta el orden se invierte y gana la matriz. No hay una " +
            "mejor: hay una mejor <b>para cada pregunta</b>.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "lista") {
          veredicto("veredicto-cual", false, "Gana en esta pregunta y en los " +
            "recorridos, pero no siempre. Preguntar si existe la arista (u, v) " +
            "le cuesta recorrer los vecinos de u; a la matriz, una sola consulta.");
        } else if (op === "matriz") {
          veredicto("veredicto-cual", false, "Al contrario: es la más cara de " +
            "las tres para esta pregunta, porque suma también los ceros. " +
            "Compare 36 con 6.");
        } else {
          veredicto("veredicto-cual", false, "Es sorprendentemente buena aquí " +
            "—cada arista aporta dos grados y se recorre una vez—, pero es la " +
            "peor para preguntar por los vecinos de un vértice en particular.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "ralo") {
          veredicto("veredicto-p1", true, "Correcto: con V = 100000 y " +
            "E = 200000, V² son diez mil millones de posiciones y V + E son " +
            "trescientas mil. La diferencia deja de ser un detalle.");
          document.getElementById("paso-1").classList.add("hecho");
        } else if (op === "denso") {
          veredicto("veredicto-p1", false, "En un grafo denso E se acerca a V², " +
            "así que las dos cuentas se parecen y la matriz deja de ser un " +
            "problema. El caso incómodo es el otro.");
        } else {
          veredicto("veredicto-p1", false, "El tamaño sí importa: con seis " +
            "vértices la diferencia entre 6 y 36 no la nota nadie.");
        }
      });
    });

    arrancar(0);
  })();
}
