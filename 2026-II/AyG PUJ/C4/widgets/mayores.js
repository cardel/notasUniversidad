/* Ejercicio interactivo: dosMayores (clase 4, varias variables a la vez). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def dosMayores(A):",          num: null },
    { txt: "    N = len(A)",              num: 1 },
    { txt: "    mayor = A[0]",            num: 2 },
    { txt: "    segundo = A[1]",          num: 3 },
    { txt: "    if A[1] > A[0]:",         num: 4 },
    { txt: "        mayor = A[1]",        num: 5 },
    { txt: "        segundo = A[0]",      num: 6 },
    { txt: "    i = 2",                   num: 7 },
    { txt: "    while i < N:",            num: 8,  bloque: 1 },
    { txt: "        if A[i] > mayor:",    num: 9,  bloque: 1 },
    { txt: "            segundo = mayor", num: 10, bloque: 1 },
    { txt: "            mayor = A[i]",    num: 11, bloque: 1 },
    { txt: "        else:",               num: null },
    { txt: "            if A[i] > segundo:", num: 12, bloque: 1 },
    { txt: "                segundo = A[i]", num: 13, bloque: 1 },
    { txt: "        i = i + 1",           num: 14, bloque: 1 },
    { txt: "    return segundo",          num: 15 }
  ];

  function simular(params) {
    var A = params.A;
    var pasos = [];
    var N = null, i = null, mayor = null, segundo = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, mayor: mayor, segundo: segundo };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    N = A.length; snap(1);
    mayor = A[0]; snap(2);
    segundo = A[1]; snap(3);
    snap(4);
    if (A[1] > A[0]) {
      mayor = A[1]; snap(5);
      segundo = A[0]; snap(6);
    }
    i = 2; snap(7);
    var corriendo = true;
    while (corriendo) {
      snap(8, { chequeo: true });
      if (i < N) {
        snap(9);
        if (A[i] > mayor) {
          segundo = mayor; snap(10);
          mayor = A[i]; snap(11);
        } else {
          snap(12);
          if (A[i] > segundo) {
            segundo = A[i]; snap(13);
          }
        }
        i = i + 1; snap(14);
      } else {
        corriendo = false;
      }
    }
    snap(15);
    return pasos;
  }

  /* Los dos primeros de A[0..k) ordenado de mayor a menor. */
  function dosDe(A, k) {
    var copia = [];
    var t = 0;
    while (t < k) {
      copia.push(A[t]);
      t = t + 1;
    }
    copia.sort(function (a, b) { return b - a; });
    return { mayor: copia[0], segundo: copia[1] };
  }

  function maximoDe(A) {
    var m = A[0];
    var t = 0;
    while (t < A.length) {
      if (A[t] > m) { m = A[t]; }
      t = t + 1;
    }
    return m;
  }

  return { codigo: CODIGO, simular: simular, dosDe: dosDe, maximoDe: maximoDe };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { A: [3, 9, 4, 1, 8, 2] },
      { A: [5, 5, 5, 5] },
      { A: [1, 2, 3, 4, 5] },
      { A: [7, 2] }
    ];
    var mayorOK = false;
    var segundoOK = false;
    var cotasOK = false;

    function pintarArreglo(A, i) {
      var panel = document.getElementById("panel-arreglo");
      panel.innerHTML = "";
      var caja = document.createElement("div");
      caja.className = "arreglo fila-arreglo";
      var t = 0;
      while (t < A.length) {
        var d = document.createElement("div");
        var clase = "caja";
        if (i !== null && t < i) { clase = clase + " leida"; }
        if (i !== null && t === i) { clase = clase + " actual"; }
        if (i !== null && t > i) { clase = clase + " pendiente"; }
        d.className = clase;
        d.innerHTML = "<span class='indice'>" + t + "</span>" + A[t];
        caja.appendChild(d);
        t = t + 1;
      }
      panel.appendChild(caja);
    }

    function alPintar(e) {
      var A = e.params.A;
      var actual = e.actual;
      pintarArreglo(A, actual ? actual.i : null);

      var cuerpo = document.getElementById("cuerpo-estados");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.chequeo) {
          fila = fila + 1;
          var patron;
          if (mayorOK && segundoOK) {
            var d = EJERCICIO.dosDe(A, p.i);
            patron = "máx A[0.." + p.i + ") = " + d.mayor + " ✓ · 2.º = " +
              d.segundo + " ✓";
          } else {
            patron = "…";
          }
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>" + p.i + "</td><td>" +
            p.mayor + "</td><td>" + p.segundo + "</td><td" +
            (mayorOK && segundoOK ? "" : " class='pend'") + ">" + patron + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='5' class='pend'>Ejecute: cada chequeo del while agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }
      document.getElementById("col-patron").textContent = (mayorOK && segundoOK)
        ? "I₁ e I₂ sobre A[0..i)"
        : "¿Qué se repite?";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "mayor", rotulo: "mayor", clase: "cuenta" },
        { campo: "segundo", rotulo: "segundo", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var A = params.A;
      var d = EJERCICIO.dosDe(A, A.length);
      if (valor === d.segundo) {
        return { ok: true, msg: "Correcto: el segundo mayor es " + d.segundo +
          ". Ahora ejecute y siga la terna (i, mayor, segundo) chequeo a chequeo." };
      }
      if (valor === d.mayor) {
        return { ok: false, msg: "Ese es el mayor. Se pide el que queda en la " +
          "segunda casilla al ordenar de mayor a menor." };
      }
      if (valor === A.length) {
        return { ok: false, msg: "Ese es el número de elementos, no un elemento." };
      }
      return { ok: false, msg: "No coincide. Ordene el arreglo de mayor a menor " +
        "en el papel y mire la segunda casilla; las repeticiones cuentan." };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    /* ---- tarjeta 4: el invariante conjunto ---- */
    function revisarDescubrimiento() {
      if (mayorOK && segundoOK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes, con " +
          "M = {{A[t] : 0 ≤ t &lt; i}} el multiconjunto de lo ya leído: " +
          "<b>I₀: 2 ≤ i ≤ N</b>, <b>I₁: mayor = máx M</b> e " +
          "<b>I₂: segundo = máx (M − {{mayor}})</b>, donde la resta quita una " +
          "sola copia. " +
          "El teorema a demostrar: <b>Teorema 1 — los invariantes I₀, I₁ e I₂ " +
          "se cumplen.</b>";
      }
    }

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-mayor button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          mayorOK = true;
          veredicto("veredicto-mayor", true, "Ese es I₁: en cada chequeo " +
            "<code>mayor</code> es el máximo de lo ya leído, ni más ni menos. " +
            "La tabla lo verifica fila por fila.");
          Motor.repintar();
          revisarDescubrimiento();
        } else if (op === "ultimo") {
          veredicto("veredicto-mayor", false, "Mire el chequeo con i = 3 del " +
            "primer arreglo: A[2] = 4 pero <code>mayor</code> marca 9. La " +
            "variable no guarda el último leído: guarda el mejor de todos.");
        } else if (op === "concreto") {
          veredicto("veredicto-mayor", false, "En <b>este</b> arreglo se cumple " +
            "en todas las filas, y aun así no es un invariante. Cambie al " +
            "preset [1, 2, 3, 4, 5]: el primer chequeo tiene mayor = 2. Un " +
            "invariante se escribe en términos de N, i y A, y debe valer para " +
            "cualquier entrada que cumpla la precondición.");
        } else {
          veredicto("veredicto-mayor", false, "Esa es la poscondición de " +
            "<code>mayor</code>, no su invariante. Con [1, 2, 3, 4, 5] el " +
            "primer chequeo tiene mayor = 2, no 5: solo en la última fila " +
            "coinciden.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-segundo button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          segundoOK = true;
          veredicto("veredicto-segundo", true, "Ese es I₂. Decirlo sobre la " +
            "lista ordenada de mayor a menor resuelve los empates sin casos " +
            "especiales: con [5, 5, 5, 5] las dos primeras casillas valen 5, " +
            "y eso es exactamente lo que devuelve el algoritmo.");
          Motor.repintar();
          revisarDescubrimiento();
        } else if (op === "sinmax") {
          veredicto("veredicto-segundo", false, "Pruebe el preset " +
            "[5, 5, 5, 5]: al quitar todas las copias del máximo no queda " +
            "nada y la frase no define ningún valor, pero el algoritmo sí " +
            "devuelve 5. El enunciado cuenta repeticiones.");
        } else {
          veredicto("veredicto-segundo", false, "Solo pasa eso cuando entra un " +
            "elemento más grande que todos. En el primer arreglo, del chequeo " +
            "i = 4 al i = 5 entra A[4] = 8: <code>mayor</code> sigue siendo 9 y " +
            "<code>segundo</code> pasa de 4 a 8, que no es ningún valor viejo " +
            "de <code>mayor</code>.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cotas button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          cotasOK = true;
          veredicto("veredicto-cotas", true, "Ese es I₀: el recorrido arranca " +
            "en 2 porque las líneas 2 a 6 ya consumieron A[0] y A[1], y el " +
            "último chequeo ocurre con i = N, cuando la condición por fin falla.");
          revisarDescubrimiento();
        } else if (op === "cero") {
          veredicto("veredicto-cotas", false, "Es cierto, pero de tan flojo " +
            "rompe a los otros dos: con i = 0 o i = 1 el rango A[0..i) tiene " +
            "menos de dos elementos y hablar de «el segundo de la lista " +
            "ordenada» no significa nada. La cota inferior 2 es la que hace " +
            "que I₂ tenga sentido.");
        } else {
          veredicto("veredicto-cotas", false, "Mire el último chequeo de la " +
            "tabla: i llega a N. Es justo ese chequeo el que hace terminar el " +
            "ciclo, y el invariante también tiene que cubrirlo — de él sale la " +
            "poscondición.");
        }
      });
    });

    /* ---- tarjeta 5: la demostración ---- */
    function completarPaso(idPaso, idSiguiente) {
      document.getElementById(idPaso).classList.add("hecho");
      if (idSiguiente) {
        document.getElementById(idSiguiente).classList.remove("bloqueado");
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("data-p1") === "dos") {
          veredicto("veredicto-p1", true, "Correcto: la línea 7 deja i = 2, y " +
            "las líneas 2 a 6 dejan en <code>mayor</code> y <code>segundo</code> " +
            "los dos primeros elementos puestos en orden.");
          completarPaso("paso-1", "paso-2");
        } else {
          veredicto("veredicto-p1", false, "Relea las líneas 2 a 7: antes de " +
            "entrar al while ya se consumieron dos elementos, y por eso i " +
            "arranca en 2.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-2 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p2");
        if (op === "tres") {
          veredicto("veredicto-p2", true, "Correcto: el nuevo elemento puede " +
            "quedar por encima de los dos, entre los dos, o por debajo de los " +
            "dos, y cada posición deja un estado distinto.");
          completarPaso("paso-2", "paso-3");
        } else if (op === "dos") {
          veredicto("veredicto-p2", false, "Casi: la rama del else se parte " +
            "otra vez en la línea 12. Cuando A[i] no supera a " +
            "<code>mayor</code> todavía falta decidir si supera a " +
            "<code>segundo</code>.");
        } else {
          veredicto("veredicto-p2", false, "Con eso se pierde el caso que " +
            "mueve solo a <code>segundo</code>. En el primer arreglo, el " +
            "chequeo i = 4 entra con mayor = 9 y segundo = 4: A[4] = 8 no " +
            "supera a <code>mayor</code>, y sin embargo <code>segundo</code> " +
            "cambia. Ese caso hay que demostrarlo aparte.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-3 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p3");
        if (op === "n") {
          veredicto("veredicto-p3", true, "Correcto, y fíjese en cómo se " +
            "obtiene: no se declara, se interseca. La condición rota da i ≥ N " +
            "y el invariante I₀ da i ≤ N; juntas dejan i = N.");
          completarPaso("paso-3", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "nm1") {
          veredicto("veredicto-p3", false, "Con i = N − 1 la condición i &lt; N " +
            "todavía se cumple y el ciclo da una vuelta más.");
        } else {
          veredicto("veredicto-p3", false, "Eso pasaría si la condición fuera " +
            "i ≤ N. Aquí es i &lt; N: mire el último chequeo de la tabla.");
        }
      });
    });
  })();
}
