/* Ejercicio interactivo: mezclar (clase 2, divide y venceras). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def mezclar(lista, ini, mitad, fin):",      num: null },
    { txt: "    izq = []",                              num: 1 },
    { txt: "    der = []",                              num: 2 },
    { txt: "    p = ini",                               num: 3 },
    { txt: "    while p <= mitad:",                     num: 4 },
    { txt: "        izq.append(lista[p])",              num: 5 },
    { txt: "        p = p + 1",                         num: 6 },
    { txt: "    while p <= fin:",                       num: 7 },
    { txt: "        der.append(lista[p])",              num: 8 },
    { txt: "        p = p + 1",                         num: 9 },
    { txt: "    i = 0",                                 num: 10 },
    { txt: "    j = 0",                                 num: 11 },
    { txt: "    k = ini",                               num: 12 },
    { txt: "    while i < len(izq) and j < len(der):",  num: 13 },
    { txt: "        if izq[i] <= der[j]:",              num: 14 },
    { txt: "            lista[k] = izq[i]",             num: 15 },
    { txt: "            i = i + 1",                     num: 16 },
    { txt: "        else:",                             num: null },
    { txt: "            lista[k] = der[j]",             num: 17 },
    { txt: "            j = j + 1",                     num: 18 },
    { txt: "        k = k + 1",                         num: 19 },
    { txt: "    while i < len(izq):",                   num: 20 },
    { txt: "        lista[k] = izq[i]",                 num: 21 },
    { txt: "        i = i + 1",                         num: 22 },
    { txt: "        k = k + 1",                         num: 23 },
    { txt: "    while j < len(der):",                   num: 24 },
    { txt: "        lista[k] = der[j]",                 num: 25 },
    { txt: "        j = j + 1",                         num: 26 },
    { txt: "        k = k + 1",                         num: 27 },
    { txt: "    return lista",                          num: 28 }
  ];

  function simular(params) {
    var lista = params.lista.slice();
    var ini = params.ini;
    var mitad = params.mitad;
    var fin = params.fin;
    var pasos = [];
    var izq = [], der = [];
    var i = null, j = null, k = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, j: j, k: k,
                escritos: k === null ? 0 : k - ini,
                lista: lista.slice(), izq: izq.slice(), der: der.slice() };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    var p;
    snap(1);
    snap(2);
    p = ini; snap(3);
    while (p <= mitad) {
      izq.push(lista[p]);
      snap(5);
      p = p + 1;
    }
    while (p <= fin) {
      der.push(lista[p]);
      snap(8);
      p = p + 1;
    }
    i = 0; snap(10);
    j = 0; snap(11);
    k = ini; snap(12);
    var corriendo = true;
    while (corriendo) {
      snap(13, { chequeo: true });
      if (i < izq.length && j < der.length) {
        snap(14);
        if (izq[i] <= der[j]) {
          lista[k] = izq[i];
          snap(15, { evento: izq[i] + " <= " + der[j] + ": se escribe " + izq[i] });
          i = i + 1; snap(16);
        } else {
          lista[k] = der[j];
          snap(17, { evento: izq[i] + " > " + der[j] + ": se escribe " + der[j] });
          j = j + 1; snap(18);
        }
        k = k + 1; snap(19);
      } else {
        corriendo = false;
      }
    }
    var sobraIzq = true;
    while (sobraIzq) {
      snap(20);
      if (i < izq.length) {
        lista[k] = izq[i];
        snap(21, { evento: "der agotada: se escribe " + izq[i] });
        i = i + 1; snap(22);
        k = k + 1; snap(23);
      } else {
        sobraIzq = false;
      }
    }
    var sobraDer = true;
    while (sobraDer) {
      snap(24);
      if (j < der.length) {
        lista[k] = der[j];
        snap(25, { evento: "izq agotada: se escribe " + der[j] });
        j = j + 1; snap(26);
        k = k + 1; snap(27);
      } else {
        sobraDer = false;
      }
    }
    snap(28);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { lista: [2, 4, 7, 1, 3, 6], ini: 0, mitad: 2, fin: 5 },
      { lista: [1, 2, 3, 7, 8, 9], ini: 0, mitad: 2, fin: 5 },
      { lista: [1, 4, 4, 9, 2, 4, 8], ini: 0, mitad: 3, fin: 6 }
    ];

    function filaFichas(rotulo, valores, tomados) {
      var fila = document.createElement("div");
      fila.className = "fila-listas";
      var rot = document.createElement("span");
      rot.className = "rotulo";
      rot.textContent = rotulo;
      fila.appendChild(rot);
      var sec = document.createElement("div");
      sec.className = "secuencia";
      sec.style.margin = "0";
      valores.forEach(function (v, idx) {
        var ficha = document.createElement("span");
        ficha.className = "ficha" + (idx < tomados ? " tachada" : "");
        ficha.textContent = v;
        sec.appendChild(ficha);
      });
      if (valores.length === 0) {
        var vacio = document.createElement("span");
        vacio.className = "flecha";
        vacio.textContent = "(vacía)";
        sec.appendChild(vacio);
      }
      fila.appendChild(sec);
      return fila;
    }

    function filaLista(rotulo, valores, escritas) {
      var fila = document.createElement("div");
      fila.className = "fila-listas";
      var rot = document.createElement("span");
      rot.className = "rotulo";
      rot.textContent = rotulo;
      fila.appendChild(rot);
      var sec = document.createElement("div");
      sec.className = "secuencia";
      sec.style.margin = "0";
      valores.forEach(function (v, idx) {
        var ficha = document.createElement("span");
        ficha.className = "ficha" + (idx < escritas ? " escrita" : "");
        ficha.textContent = v;
        sec.appendChild(ficha);
      });
      fila.appendChild(sec);
      return fila;
    }

    function alPintar(e) {
      var actual = e.actual;
      var i = actual && actual.i !== null ? actual.i : 0;
      var j = actual && actual.j !== null ? actual.j : 0;
      var escritos = actual ? actual.escritos : 0;
      var izq = actual ? actual.izq : [];
      var der = actual ? actual.der : [];
      var lista = actual ? actual.lista : e.params.lista;

      var panel = document.getElementById("panel-listas");
      panel.innerHTML = "";
      panel.appendChild(filaLista("lista", lista, escritos));
      panel.appendChild(filaFichas("izq (copia)", izq, i));
      panel.appendChild(filaFichas("der (copia)", der, j));

      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.evento) {
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + p.evento + "</td><td>" + p.k + "</td><td>[" +
            p.lista.join(", ") + "]</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (cuerpo.children.length === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='3' class='pend'>Todavía no se escribe ninguna posición.</td>";
        cuerpo.appendChild(trv);
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "j", rotulo: "j" },
        { campo: "k", rotulo: "k" },
        { campo: "escritos", rotulo: "escritas", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var n = params.mitad - params.ini + 1;
      var m = params.fin - params.mitad;
      if (valor === n + m) {
        return { ok: true, msg: "Correcto: " + n + " + " + m + " = " + (n + m) +
          ". Cada elemento de los dos tramos se escribe exactamente una vez. " +
          "Guarde ese dato: es la clave del costo." };
      }
      if (valor === n * m) {
        return { ok: false, msg: "Multiplicó los tamaños, como si cada elemento se " +
          "comparara con todos los del frente. La mezcla escribe cada posición una " +
          "sola vez." };
      }
      if (valor === Math.max(n, m)) {
        return { ok: false, msg: "Ese es el tamaño del tramo más largo; la mezcla " +
          "escribe el tramo completo, de ini a fin." };
      }
      return { ok: false, msg: "No coincide. ¿Alguna posición se queda sin escribir? " +
        "¿Alguna se escribe dos veces?" };
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

    /* ---- tarjeta 4: los dos invariantes ---- */
    var patronOK = false;
    var cotasOK = false;
    function revisarDescubrimiento() {
      if (patronOK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes: " +
          "<b>I₀: 0 ≤ i ≤ len(izq), 0 ≤ j ≤ len(der) y k = ini + i + j</b> e " +
          "<b>I₁: lista[ini..k) contiene, en orden, los i + j menores</b>.";
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-patron button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-patron");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          patronOK = true;
          v.className = "veredicto bien";
          v.textContent = "Ese es I₁. Dice tres cosas a la vez: cuántas " +
            "posiciones van escritas, qué elementos llevan y en qué orden " +
            "están. Con él, la demostración de la tarjeta 5 sale sola.";
          revisarDescubrimiento();
        } else if (op === "debil") {
          v.className = "veredicto mal";
          v.textContent = "Cierto, pero débil: no dice que estén ordenados ni que " +
            "sean los menores. Con ese invariante el paso de éxito no puede " +
            "concluir que el tramo queda ordenado.";
        } else if (op === "falsa") {
          v.className = "veredicto mal";
          v.textContent = "Mire la traza con el primer arreglo: en la primera " +
            "comparación pasa lo contrario (2 > 1). No es cierto en todas las vueltas.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Esa es la poscondición: solo vale al final. En las filas " +
            "intermedias todavía hay posiciones sin escribir.";
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cotas button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-cotas");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          cotasOK = true;
          v.className = "veredicto bien";
          v.textContent = "Ese es I₀: cada índice se mueve dentro de su propia " +
            "copia, k avanza con la suma de los dos, y en el último chequeo uno " +
            "de los índices llega justo a su tamaño.";
          revisarDescubrimiento();
        } else if (op === "estricta") {
          v.className = "veredicto mal";
          v.textContent = "Mire el último chequeo: el ciclo termina justo porque " +
            "uno de los índices llegó al tamaño de su copia. El invariante " +
            "también debe cubrir ese chequeo.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Cierto, pero flojo: no acota i ni j por su propia " +
            "copia, y la estabilidad necesita saber que izq[i] y der[j] son " +
            "posiciones válidas.";
        }
      });
    });

    /* ---- tarjeta 5: la demostración ---- */
    function cablearPaso(idBoton, idPaso, idSiguiente, alFinal) {
      document.getElementById(idBoton).addEventListener("click", function () {
        document.getElementById(idPaso).classList.add("hecho");
        if (idSiguiente) {
          document.getElementById(idSiguiente).classList.remove("bloqueado");
        }
        if (alFinal) { alFinal(); }
      });
    }
    cablearPaso("btn-m1", "paso-1", "paso-2");
    cablearPaso("btn-m2", "paso-2", "paso-3");
    cablearPaso("btn-m3", "paso-3", null, function () {
      document.getElementById("nota-clrs").style.display = "block";
      document.getElementById("conclusion").style.display = "block";
    });

    /* ---- tarjeta 6: costo ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-costo button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-costo");
        var op = btn.getAttribute("data-op");
        if (op === "lineal") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: cada vuelta escribe exactamente un elemento, y hay " +
            "n en total; las copias iniciales agregan otras n operaciones. Este Θ(n) " +
            "es la f(n) de la recurrencia del ordenamiento por mezcla: " +
            "T(n) = 2·T(n/2) + Θ(n).";
        } else if (op === "cuadrado") {
          v.className = "veredicto mal";
          v.textContent = "Eso sería si cada elemento se comparara con todos los " +
            "demás. La traza muestra a lo sumo una comparación por escritura.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Ese va a ser el costo del ordenamiento completo, no el de " +
            "una mezcla. La mezcla sola es más barata.";
        }
      });
    });
  })();
}
