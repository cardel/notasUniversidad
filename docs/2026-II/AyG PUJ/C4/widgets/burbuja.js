/* Ejercicio interactivo: ordenarBurbuja (clase 4, ciclos anidados). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def ordenarBurbuja(A):",       num: null },
    { txt: "    N = len(A)",               num: 1 },
    { txt: "    i = 0",                    num: 2 },
    { txt: "    while i < N - 1:",         num: 3,  bloque: 1 },
    { txt: "        j = 0",                num: 4,  bloque: 1 },
    { txt: "        while j < N - 1 - i:", num: 5,  bloque: 2 },
    { txt: "            if A[j] > A[j + 1]:", num: 6, bloque: 2 },
    { txt: "                temporal = A[j]", num: 7, bloque: 2 },
    { txt: "                A[j] = A[j + 1]", num: 8, bloque: 2 },
    { txt: "                A[j + 1] = temporal", num: 9, bloque: 2 },
    { txt: "            j = j + 1",        num: 10, bloque: 2 },
    { txt: "        i = i + 1",            num: 11, bloque: 1 },
    { txt: "    return A",                 num: 12 }
  ];

  function simular(params) {
    var A = params.A.slice();
    var pasos = [];
    var N = null, i = null, j = null;
    var comparaciones = 0, intercambios = 0;
    function snap(linea, extra) {
      var p = {
        linea: linea, i: i, j: j,
        comparaciones: comparaciones, intercambios: intercambios,
        A: A.slice()
      };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    N = A.length; snap(1);
    i = 0; snap(2);
    var externo = true;
    while (externo) {
      snap(3, { chequeoExterno: true });
      if (i < N - 1) {
        j = 0; snap(4);
        var interno = true;
        while (interno) {
          snap(5, { chequeoInterno: true });
          if (j < N - 1 - i) {
            comparaciones = comparaciones + 1;
            snap(6);
            if (A[j] > A[j + 1]) {
              var temporal = A[j]; snap(7);
              A[j] = A[j + 1]; snap(8);
              A[j + 1] = temporal;
              intercambios = intercambios + 1;
              snap(9);
            }
            j = j + 1; snap(10);
          } else {
            interno = false;
          }
        }
        i = i + 1; snap(11);
      } else {
        externo = false;
      }
    }
    j = null;
    snap(12);
    return pasos;
  }

  function maximoEn(A, ini, fin) {
    var m = A[ini];
    var t = ini;
    while (t < fin) {
      if (A[t] > m) { m = A[t]; }
      t = t + 1;
    }
    return m;
  }

  function estaOrdenado(A, ini, fin) {
    var ok = true;
    var t = ini + 1;
    while (t < fin) {
      if (A[t - 1] > A[t]) { ok = false; }
      t = t + 1;
    }
    return ok;
  }

  return {
    codigo: CODIGO, simular: simular,
    maximoEn: maximoEn, estaOrdenado: estaOrdenado
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { A: [5, 1, 4, 2, 8] },
      { A: [1, 2, 3, 4] },
      { A: [4, 3, 2, 1] },
      { A: [2, 2, 2] }
    ];
    var j1OK = false;
    var j0OK = false;
    var i1OK = false;
    var i3OK = false;

    /* Verifica J₁ sobre el estado del arreglo en un chequeo del ciclo interno.
       Recibe A tal como está en ese chequeo y el índice j de ese chequeo.
       Devuelve true si J₁ se cumple ahí, false si no, o null si todavía no
       se decidió qué afirma J₁. */
    function cumpleJ1(A, j) {
      return A[j] === EJERCICIO.maximoEn(A, 0, j + 1);
    }

    function comoLista(a) {
      return a.length === 0 ? "[ ]" : "[" + a.join(", ") + "]";
    }

    function pintarArreglo(p, N) {
      var panel = document.getElementById("panel-arreglo");
      panel.innerHTML = "";
      var caja = document.createElement("div");
      caja.className = "arreglo fila-arreglo";
      var A = p ? p.A : PRESETS[0].A;
      var i = p ? p.i : null;
      var j = p ? p.j : null;
      var t = 0;
      while (t < A.length) {
        var d = document.createElement("div");
        var clase = "caja";
        if (i !== null && i !== undefined && t >= A.length - i) {
          clase = clase + " fijada";
        } else if (j !== null && j !== undefined && t < j) {
          clase = clase + " recorrida";
        }
        if (j !== null && j !== undefined && (t === j || t === j + 1)) {
          clase = clase + " par";
        }
        d.className = clase;
        d.innerHTML = "<span class='indice'>" + t + "</span>" + A[t];
        caja.appendChild(d);
        t = t + 1;
      }
      panel.appendChild(caja);
    }

    function alPintar(e) {
      var actual = e.actual;
      pintarArreglo(actual, e.params.A.length);
      document.getElementById("ver-i").textContent =
        (actual && actual.i !== null && actual.i !== undefined) ? actual.i : "–";

      var iMostrado = (actual && actual.i !== null && actual.i !== undefined)
        ? actual.i : null;
      var cuerpo = document.getElementById("cuerpo-estados");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.chequeoInterno && p.i === iMostrado) {
          fila = fila + 1;
          var prefijo = p.A.slice(0, p.j + 1);
          var patron = "…";
          if (j1OK) {
            var veredictoJ1 = cumpleJ1(p.A, p.j);
            if (veredictoJ1 === null) {
              patron = "…";
            } else {
              patron = "máx A[0.." + p.j + "] = " +
                EJERCICIO.maximoEn(p.A, 0, p.j + 1) +
                (veredictoJ1 ? " ✓" : " ✗");
            }
          }
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>" + p.j + "</td><td>" +
            comoLista(prefijo) + "</td><td>" + p.A[p.j] + "</td><td" +
            (j1OK ? "" : " class='pend'") + ">" + patron + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='5' class='pend'>Ejecute: cada chequeo del while de la línea 5 agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }
      document.getElementById("col-patron").textContent = j1OK
        ? "J₁ sobre A[0..j]"
        : "¿Qué se repite?";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "j", rotulo: "j" },
        { campo: "comparaciones", rotulo: "comparaciones", clase: "cuenta" },
        { campo: "intercambios", rotulo: "intercambios", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var N = params.A.length;
      var esperado = (N * (N - 1)) / 2;
      var pasos = EJERCICIO.simular(params);
      var intercambios = pasos[pasos.length - 1].intercambios;
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: " + esperado + " = N(N−1)/2, con " +
          "N = " + N + ". Y no depende de los datos: pruebe el arreglo ya " +
          "ordenado y verá la misma cuenta." };
      }
      if (valor === intercambios) {
        return { ok: false, msg: "Esas son las comparaciones que <b>sí</b> " +
          "terminan en intercambio (" + intercambios + "). La línea 6 se " +
          "ejecuta muchas más veces: la pregunta es por todas." };
      }
      if (valor === N || valor === N - 1) {
        return { ok: false, msg: "Ese es más o menos el número de pasadas. " +
          "Cada pasada hace varias comparaciones, y son menos cada vez." };
      }
      return { ok: false, msg: "No coincide. La pasada i hace N−1−i " +
        "comparaciones; sume para i = 0, 1, …, N−2." };
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

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    /* ---- tarjeta 4: el ciclo interno ---- */
    function revisarInterno() {
      if (j1OK && j0OK) {
        document.getElementById("caja-lema").style.display = "block";
        var bloque = document.getElementById("bloque-externo");
        bloque.classList.remove("bloqueado");
        bloque.style.opacity = "1";
        bloque.style.pointerEvents = "auto";
        document.getElementById("nota-externo").innerHTML = "Con el " +
          "<b>Lema 1</b> en la mano, el ciclo externo se demuestra sin volver " +
          "a mirar las líneas 5 a 10.";
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-j1 button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          j1OK = true;
          veredicto("veredicto-j1", true, "Ese es J₁: la pasada arrastra el " +
            "mayor de lo recorrido, y al llegar al final lo deja en su lugar. " +
            "La tabla ya lo verifica fila por fila.");
          Motor.repintar();
          revisarInterno();
        } else if (op === "ordenado") {
          veredicto("veredicto-j1", false, "Falso: la pasada no ordena lo " +
            "que va dejando atrás. Corra [5, 1, 4, 2, 8] hasta el chequeo " +
            "j = 3 de la primera pasada: A[0..3] = [1, 4, 2, 5], con el 2 " +
            "después del 4. Lo único que la pasada garantiza es dónde quedó " +
            "el mayor.");
        } else if (op === "concreto") {
          veredicto("veredicto-j1", false, "Eso describe un dato, no el " +
            "algoritmo. Cambie de arreglo y la frase deja de tener sentido. Un " +
            "invariante se escribe con N, i, j y A, y debe valer para toda " +
            "entrada que cumpla la precondición.");
        } else {
          veredicto("veredicto-j1", false, "Solo al final de la pasada. En el " +
            "primer chequeo, con j = 0, A[0] es el máximo de un solo elemento; " +
            "en [5, 1, 4, 2, 8] eso da 5, que no es el máximo del arreglo. El " +
            "invariante tiene que valer en <b>todos</b> los chequeos.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-j0 button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          j0OK = true;
          veredicto("veredicto-j0", true, "Ese es J₀, y fíjese en que la cota " +
            "depende de i: cada pasada recorre un tramo más corto que la " +
            "anterior. De aquí sale el valor con que termina el ciclo interno.");
          revisarInterno();
        } else if (op === "n") {
          veredicto("veredicto-j0", false, "Se pasa: la línea 6 mira A[j+1], " +
            "así que j nunca llega a N−1 siquiera. Además la cota tiene que " +
            "hablar de la pasada: el tramo se acorta con cada i.");
        } else {
          veredicto("veredicto-j0", false, "Mire el último chequeo del ciclo " +
            "interno: j llega a N−1−i, y es ese chequeo el que lo detiene. De " +
            "él sale el Lema 1, así que el invariante tiene que cubrirlo.");
        }
      });
    });

    /* ---- tarjeta 5: el ciclo externo ---- */
    function revisarExterno() {
      if (i1OK && i3OK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes del " +
          "ciclo externo: <b>I₀: 0 ≤ i ≤ N−1</b>, " +
          "<b>I₁: ∀a, b, N−i ≤ a &lt; b &lt; N: A[a] ≤ A[b]</b>, " +
          "<b>I₂: ∀a, b, 0 ≤ a &lt; N−i ≤ b &lt; N: A[a] ≤ A[b]</b> e " +
          "<b>I₃: {{A[t] : 0 ≤ t &lt; N}} = {{A₀[t] : 0 ≤ t &lt; N}}</b>, con A₀ el " +
          "arreglo recibido y {{·}} el multiconjunto. Se demuestra primero el " +
          "<b>Lema 1</b> y después el <b>Teorema 1</b>, que lo cita.";
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-i1 button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          i1OK = true;
          veredicto("veredicto-i1", true, "Correctos los dos: sin el segundo, " +
            "la cola podría estar ordenada y aun así contener elementos " +
            "menores que los del frente, y al agregar uno nuevo el orden se " +
            "rompería. Es el invariante que la estabilidad necesita.");
          revisarExterno();
        } else if (op === "prefijo") {
          veredicto("veredicto-i1", false, "La zona terminada de este " +
            "algoritmo está al <b>final</b>, no al principio: el máximo se " +
            "empuja hacia la derecha. Mire las casillas verdes.");
        } else if (op === "soloorden") {
          veredicto("veredicto-i1", false, "Se queda corto. Con eso solo, la " +
            "estabilidad no puede demostrar que el elemento que entra a la cola " +
            "no supere al que ya estaba; hace falta decir además que todo lo " +
            "del frente es ≤ todo lo de la cola.");
        } else {
          veredicto("veredicto-i1", false, "Esa es la poscondición: solo se " +
            "cumple al final. Con i = 0 el arreglo está como vino.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-i3 button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          i3OK = true;
          veredicto("veredicto-i3", true, "Ese es I₃. Sin él, un algoritmo que " +
            "llene el arreglo de ceros cumpliría todo lo demás: quedaría " +
            "ordenado y con la cola dominando al frente. Ordenar es reacomodar, " +
            "y eso hay que decirlo.");
          revisarExterno();
        } else if (op === "tamano") {
          veredicto("veredicto-i3", false, "El tamaño no cambia, cierto, pero " +
            "eso no impide que los valores se corrompan. Un arreglo de N ceros " +
            "tiene el tamaño correcto y no es el arreglo de entrada.");
        } else {
          veredicto("veredicto-i3", false, "Con el orden solo, escribir ceros " +
            "en todo el arreglo sería una solución válida. La poscondición pide " +
            "<b>los mismos elementos</b>, ordenados.");
        }
      });
    });

    /* ---- tarjeta 6: la demostración ---- */
    function completarPaso(idPaso, idSiguiente) {
      document.getElementById(idPaso).classList.add("hecho");
      if (idSiguiente) {
        document.getElementById(idSiguiente).classList.remove("bloqueado");
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "max") {
          veredicto("veredicto-p1", true, "Correcto, y note que el argumento " +
            "usa J₁ como hipótesis: sin saber que A[j] ya era el máximo de lo " +
            "recorrido, comparar solo con el vecino no probaría nada.");
          completarPaso("paso-1", "paso-2");
        } else if (op === "orden") {
          veredicto("veredicto-p1", false, "El cuerpo solo mira dos casillas " +
            "vecinas: no puede ordenar todo un tramo. Lo que garantiza es " +
            "mucho menos, y aun así alcanza.");
        } else {
          veredicto("veredicto-p1", false, "Solo intercambia cuando están al " +
            "revés. Corra [1, 2, 3, 4] y mire el contador de intercambios: " +
            "queda en cero y el invariante se cumple igual.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-2 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p2");
        if (op === "lema") {
          veredicto("veredicto-p2", true, "Correcto: el ciclo interno entra a " +
            "la demostración del externo por una sola puerta, el enunciado del " +
            "lema. Sus líneas ya no se vuelven a leer.");
          completarPaso("paso-2", "paso-3");
        } else if (op === "repite") {
          veredicto("veredicto-p2", false, "Eso es rehacer el trabajo. El lema " +
            "ya está demostrado para un i arbitrario: aquí se cita, no se " +
            "repite. Si hace falta repetirlo, el lema quedó mal enunciado.");
        } else {
          veredicto("veredicto-p2", false, "«Siempre empuja el mayor al final» " +
            "es justo lo que había que demostrar, y eso es el Lema 1. Nombrarlo " +
            "en una frase no es probarlo; citarlo, sí.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-3 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p3");
        if (op === "nm1") {
          veredicto("veredicto-p3", true, "Correcto, y sale de intersecar: la " +
            "condición rota da i ≥ N−1 y el invariante de cotas da i ≤ N−1.");
          completarPaso("paso-3", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "n") {
          veredicto("veredicto-p3", false, "Eso pasaría con la condición " +
            "i &lt; N. Aquí la última pasada es la de i = N−2, y el chequeo que " +
            "detiene el ciclo ocurre con i = N−1.");
        } else {
          veredicto("veredicto-p3", false, "Con i = N−2 la condición i &lt; N−1 " +
            "todavía se cumple y el ciclo da una pasada más.");
        }
      });
    });
  })();
}
