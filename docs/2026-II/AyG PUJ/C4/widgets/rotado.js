/* Ejercicio interactivo: posicionDelMinimo en un arreglo rotado
   (clase 4, variantes de la busqueda binaria). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def posicionDelMinimo(A):",  num: null },
    { txt: "    N = len(A)",             num: 1 },
    { txt: "    l = 0",                  num: 2 },
    { txt: "    r = N",                  num: 3 },
    { txt: "    while l < r:",           num: 4, bloque: 1 },
    { txt: "        mitad = (l + r) // 2", num: 5, bloque: 1 },
    { txt: "        if A[mitad] > A[N - 1]:", num: 6, bloque: 1 },
    { txt: "            l = mitad + 1",  num: 7, bloque: 1 },
    { txt: "        else:",              num: null },
    { txt: "            r = mitad",      num: 8, bloque: 1 },
    { txt: "    return l",               num: 9 }
  ];

  function simular(params) {
    var A = params.A;
    var pasos = [];
    var N = null, l = null, r = null, mitad = null;
    function snap(linea, extra) {
      var p = { linea: linea, l: l, r: r, mitad: mitad };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    N = A.length; snap(1);
    l = 0; snap(2);
    r = N; snap(3);
    var corriendo = true;
    while (corriendo) {
      snap(4, { chequeo: true });
      if (l < r) {
        mitad = Math.floor((l + r) / 2); snap(5);
        var grande = A[mitad] > A[N - 1];
        snap(6, { grande: grande });
        if (grande) {
          l = mitad + 1; snap(7, { decision: "descarta A[l..mitad]" });
        } else {
          r = mitad; snap(8, { decision: "descarta A[mitad+1..r)" });
        }
      } else {
        corriendo = false;
      }
    }
    mitad = null;
    snap(9);
    return pasos;
  }

  function posicionDelMinimo(A) {
    var pos = 0;
    var t = 0;
    while (t < A.length) {
      if (A[t] < A[pos]) { pos = t; }
      t = t + 1;
    }
    return pos;
  }

  return { codigo: CODIGO, simular: simular, posicionDelMinimo: posicionDelMinimo };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { A: [4, 5, 6, 7, 0, 1, 2] },
      { A: [0, 1, 2, 3, 4] },
      { A: [5, 6, 7, 8, 9, 1] },
      { A: [3] }
    ];
    var predOK = false;
    var i1OK = false;
    var cotasOK = false;

    function pintarArreglo(A, p) {
      var panel = document.getElementById("panel-arreglo");
      panel.innerHTML = "";
      var caja = document.createElement("div");
      caja.className = "arreglo fila-arreglo";
      var N = A.length;
      var t = 0;
      while (t < N) {
        var d = document.createElement("div");
        var clase = "caja";
        if (p && p.l !== null && p.r !== null) {
          if (t < p.l || t >= p.r) {
            clase = clase + " descartada";
          } else {
            clase = clase + " viva";
          }
        }
        if (p && p.mitad !== null && p.mitad !== undefined && t === p.mitad) {
          clase = clase + " mitad";
        }
        d.className = clase;
        var etiqueta = A[t] > A[N - 1] ? "grande" : "pequeño";
        d.innerHTML = "<span class='indice'>" + t + "</span>" + A[t] +
          "<span class='pred'>" + etiqueta + "</span>";
        caja.appendChild(d);
        t = t + 1;
      }
      panel.appendChild(caja);
    }

    function alPintar(e) {
      var A = e.params.A;
      pintarArreglo(A, e.actual);

      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var filas = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.decision) {
          filas = filas + 1;
          var previo = e.pasos[m - 1];
          var ventana = "[" + (p.linea === 7 ? previo.l : p.l) + ".." +
            (p.linea === 7 ? p.r : previo.r) + ")";
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + ventana + "</td><td>" + p.mitad + "</td><td>" +
            A[p.mitad] + "</td><td>" + (p.linea === 7 ? "sí" : "no") +
            "</td><td>" + p.decision + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (filas === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='5' class='pend'>Ejecute: cada división agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "l", rotulo: "l" },
        { campo: "r", rotulo: "r" },
        { campo: "mitad", rotulo: "mitad", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var A = params.A;
      var pos = EJERCICIO.posicionDelMinimo(A);
      if (valor === pos) {
        return { ok: true, msg: "Correcto: el mínimo está en la posición " +
          pos + ". Ahora ejecute y mire las etiquetas de abajo: el algoritmo " +
          "no busca el valor, busca la frontera entre «grande» y «pequeño»." };
      }
      if (valor === A[pos]) {
        return { ok: false, msg: "Ese es el valor mínimo; se pide la posición " +
          "donde está." };
      }
      return { ok: false, msg: "No coincide. El mínimo es el primer elemento " +
        "del segundo tramo: busque dónde el arreglo deja de crecer." };
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

    /* ---- tarjeta 4: el predicado ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-pred button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          predOK = true;
          veredicto("veredicto-pred", true, "Ese es. Mire las etiquetas debajo " +
            "de las casillas: todos los «grande» quedan a la izquierda y todos " +
            "los «pequeño» a la derecha, sin mezclarse. El borde entre las dos " +
            "zonas es la posición del mínimo, y por eso la búsqueda binaria " +
            "sirve aunque el arreglo no esté ordenado.");
          var bloque = document.getElementById("bloque-inv");
          bloque.style.opacity = "1";
          bloque.style.pointerEvents = "auto";
          document.getElementById("nota-inv").innerHTML = "Con el predicado " +
            "p(t): A[t] ≤ A[N−1], los invariantes son los mismos de la clase.";
        } else if (op === "creciente") {
          veredicto("veredicto-pred", false, "Es verdadera en casi todas las " +
            "posiciones y falsa justo en una, la anterior al mínimo: verdadera, " +
            "falsa, verdadera otra vez. Eso no es monótono, y la búsqueda " +
            "binaria no puede usarlo.");
        } else if (op === "primero") {
          veredicto("veredicto-pred", false, "En un arreglo rotado es " +
            "verdadera en t = 0 (A[0] ≤ A[0]), falsa en el resto del primer " +
            "tramo y verdadera otra vez en el segundo. Va y viene: no sirve.");
        } else {
          veredicto("veredicto-pred", false, "Es verdadera en una sola " +
            "posición y falsa en todas las demás, incluidas las que vienen " +
            "después. Un predicado monótono, una vez que se vuelve verdadero, " +
            "no puede volver atrás.");
        }
      });
    });

    /* ---- tarjeta 5: los invariantes ---- */
    function revisarInvariantes() {
      if (i1OK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes: " +
          "<b>I₀: 0 ≤ l ≤ r ≤ N</b> e <b>I₁: toda posición t &lt; l cumple " +
          "A[t] &gt; A[N−1], y toda posición t ≥ r cumple A[t] ≤ A[N−1]</b>. " +
          "El teorema a demostrar: <b>Teorema 1 — los invariantes I₀ e I₁ se " +
          "cumplen.</b>";
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-i1 button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          i1OK = true;
          veredicto("veredicto-i1", true, "Ese es I₁, y note lo que dice: no " +
            "habla de la ventana sino de lo que quedó <b>fuera</b> de ella. La " +
            "ventana es lo indeciso; el invariante registra lo ya decidido.");
          revisarInvariantes();
        } else if (op === "encierra") {
          veredicto("veredicto-i1", false, "Es el error de modelo más común, y " +
            "se ve corriendo [0, 1, 2, 3, 4] hasta el final: la ventana termina " +
            "vacía, con l = r = 0, y el mínimo está en la posición 0, fuera de " +
            "A[l..r). Esta búsqueda no encierra la respuesta: separa las " +
            "posiciones que cumplen el predicado de las que no.");
        } else if (op === "ordenada") {
          veredicto("veredicto-i1", false, "Falso: el arreglo no está ordenado, " +
            "y la ventana tampoco tiene por qué estarlo. Corra el primer " +
            "arreglo y mire la ventana del segundo chequeo.");
        } else {
          veredicto("veredicto-i1", false, "Eso describe un instante de una " +
            "corrida concreta. Un invariante vale en todos los chequeos y para " +
            "toda entrada válida: se escribe con N, l, r y A.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cotas button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          cotasOK = true;
          veredicto("veredicto-cotas", true, "Ese es I₀. La ventana puede " +
            "quedar vacía —l = r— y de hecho así es como termina el ciclo: ese " +
            "es el chequeo del que sale la respuesta.");
          revisarInvariantes();
        } else if (op === "estricta") {
          veredicto("veredicto-cotas", false, "El último chequeo tiene l = r, " +
            "que es justo el que detiene el ciclo. Si el invariante lo excluye, " +
            "la terminación se queda sin nada que sustituir.");
        } else {
          veredicto("veredicto-cotas", false, "r arranca valiendo N, no N−1: " +
            "la línea 3 lo dice. Con un rango medio abierto [l..r) el extremo " +
            "derecho no es una posición del arreglo sino el final del tramo.");
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
        if (op === "vacio") {
          veredicto("veredicto-p1", true, "Correcto: las dos mitades de I₁ son " +
            "afirmaciones sobre conjuntos vacíos, y se cumplen sin exigir nada. " +
            "Es el mismo recurso de la suma sobre el rango vacío.");
          completarPaso("paso-1", "paso-2");
        } else if (op === "orden") {
          veredicto("veredicto-p1", false, "El arreglo no está ordenado: por " +
            "eso este problema es interesante. Mire de nuevo qué afirma I₁ " +
            "cuando l = 0 y r = N.");
        } else {
          veredicto("veredicto-p1", false, "Cierto, pero ese no es el " +
            "invariante que se está demostrando. Relea I₁: habla de las " +
            "posiciones fuera de la ventana.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-2 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p2");
        if (op === "una") {
          veredicto("veredicto-p2", true, "Correcto: descartar A[l..mitad] de " +
            "un golpe solo es legítimo porque la monotonía extiende el " +
            "resultado de una comparación a todo un tramo. Ahí es donde el " +
            "predicado paga.");
          completarPaso("paso-2", "paso-3");
        } else if (op === "mitad") {
          veredicto("veredicto-p2", false, "Se queda corto: hay que justificar " +
            "que <b>ninguna</b> de las posiciones descartadas era el mínimo, no " +
            "solo <code>mitad</code>. Son mitad − l + 1 posiciones de un tirón.");
        } else {
          veredicto("veredicto-p2", false, "Eso es parte de la terminación y " +
            "del costo, no de la estabilidad. La estabilidad pregunta si el " +
            "invariante sigue valiendo después del cuerpo.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-3 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p3");
        if (op === "borde") {
          veredicto("veredicto-p3", true, "Correcto. Y fíjese en que el valor " +
            "final de l no se declara: sale de intersecar la condición rota " +
            "(l ≥ r) con I₀ (l ≤ r).");
          completarPaso("paso-3", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "ventana") {
          veredicto("veredicto-p3", false, "La ventana termina <b>vacía</b>, no " +
            "con un elemento: l = r. Corra cualquiera de los presets hasta el " +
            "final y mírelo.");
        } else {
          veredicto("veredicto-p3", false, "Nunca se comparó A[l] con todos: " +
            "esa es justamente la gracia. Se hicieron unas lg N comparaciones, " +
            "todas contra A[N−1].");
        }
      });
    });
  })();
}
