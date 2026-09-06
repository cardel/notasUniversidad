/* Ejercicio interactivo: comprimir (clase 4, cuando la salida es una lista). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def comprimir(A):",     num: null },
    { txt: "    N = len(A)",        num: 1 },
    { txt: "    res = []",          num: 2 },
    { txt: "    i = 0",             num: 3 },
    { txt: "    while i < N:",      num: 4,  bloque: 1 },
    { txt: "        nuevo = True",  num: 5,  bloque: 1 },
    { txt: "        if len(res) > 0:", num: 6, bloque: 1 },
    { txt: "            nuevo = A[i] != res[len(res) - 1]", num: 7, bloque: 1 },
    { txt: "        if nuevo:",     num: 8,  bloque: 1 },
    { txt: "            res.append(A[i])", num: 9, bloque: 1 },
    { txt: "        i = i + 1",     num: 10, bloque: 1 },
    { txt: "    return res",        num: 11 }
  ];

  function simular(params) {
    var A = params.A;
    var pasos = [];
    var N = null, i = null, res = null, nuevo = null;
    function snap(linea, extra) {
      var p = {
        linea: linea,
        i: i,
        res: res === null ? null : res.slice(),
        nuevo: nuevo === null ? null : (nuevo ? "True" : "False"),
        ultimo: (res !== null && res.length > 0) ? res[res.length - 1] : "–"
      };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    N = A.length; snap(1);
    res = []; snap(2);
    i = 0; snap(3);
    var corriendo = true;
    while (corriendo) {
      snap(4, { chequeo: true });
      if (i < N) {
        nuevo = true; snap(5);
        snap(6);
        if (res.length > 0) {
          nuevo = A[i] !== res[res.length - 1]; snap(7);
        }
        snap(8);
        if (nuevo) {
          res.push(A[i]); snap(9);
        }
        i = i + 1; snap(10);
      } else {
        corriendo = false;
      }
    }
    snap(11);
    return pasos;
  }

  /* A[0..k) sin repeticiones consecutivas. */
  function comprimirPrefijo(A, k) {
    var r = [];
    var t = 0;
    while (t < k) {
      if (r.length === 0 || r[r.length - 1] !== A[t]) {
        r.push(A[t]);
      }
      t = t + 1;
    }
    return r;
  }

  /* A[0..k) sin ningun repetido, en orden de aparicion. */
  function distintosPrefijo(A, k) {
    var r = [];
    var t = 0;
    while (t < k) {
      if (r.indexOf(A[t]) < 0) { r.push(A[t]); }
      t = t + 1;
    }
    return r;
  }

  return {
    codigo: CODIGO, simular: simular,
    comprimirPrefijo: comprimirPrefijo, distintosPrefijo: distintosPrefijo
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { A: [1, 1, 2, 2, 2, 3, 1, 1] },
      { A: [4, 4, 4, 4] },
      { A: [1, 2, 3] },
      { A: [] }
    ];
    var resOK = false;
    var ultimoOK = false;
    var cotasOK = false;

    function comoLista(a) {
      return a.length === 0 ? "[ ]" : "[" + a.join(", ") + "]";
    }

    function pintarArreglo(A, i) {
      var panel = document.getElementById("panel-arreglo");
      panel.innerHTML = "";
      if (A.length === 0) {
        panel.innerHTML = "<div class='vacia' style='margin-top:0.6rem'>A = [ ] &nbsp; (N = 0)</div>";
        return;
      }
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

    function pintarRes(res) {
      var panel = document.getElementById("panel-res");
      panel.innerHTML = "";
      var fila = document.createElement("div");
      fila.className = "secuencia";
      var rot = document.createElement("span");
      rot.className = "rotulo-lista";
      rot.textContent = "res =";
      fila.appendChild(rot);
      if (res === null || res.length === 0) {
        var v = document.createElement("span");
        v.className = "vacia";
        v.textContent = "[ ]";
        fila.appendChild(v);
      } else {
        var t = 0;
        while (t < res.length) {
          var f = document.createElement("span");
          f.className = "ficha" + (t === res.length - 1 ? " ultima" : "");
          f.textContent = res[t];
          fila.appendChild(f);
          t = t + 1;
        }
      }
      panel.appendChild(fila);
    }

    function alPintar(e) {
      var A = e.params.A;
      var actual = e.actual;
      pintarArreglo(A, actual ? actual.i : null);
      pintarRes(actual ? actual.res : null);

      var cuerpo = document.getElementById("cuerpo-estados");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.chequeo) {
          fila = fila + 1;
          var prefijo = A.slice(0, p.i);
          var patron;
          if (resOK && ultimoOK) {
            var esperado = EJERCICIO.comprimirPrefijo(A, p.i);
            var i2 = p.i === 0
              ? "I₂ no exige nada (i = 0)"
              : "último = A[" + (p.i - 1) + "] = " + A[p.i - 1];
            patron = "comprimir A[0.." + p.i + ") = " + comoLista(esperado) +
              " ✓ · " + i2;
          } else {
            patron = "…";
          }
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>" + p.i + "</td><td>" +
            comoLista(prefijo) + "</td><td>" + comoLista(p.res) + "</td><td" +
            (resOK && ultimoOK ? "" : " class='pend'") + ">" + patron + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='5' class='pend'>Ejecute: cada chequeo del while agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }
      document.getElementById("col-patron").textContent = (resOK && ultimoOK)
        ? "I₁ e I₂ sobre A[0..i)"
        : "¿Qué se repite?";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "nuevo", rotulo: "nuevo" },
        { campo: "ultimo", rotulo: "último de res", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var A = params.A;
      var esperado = EJERCICIO.comprimirPrefijo(A, A.length).length;
      var distintos = EJERCICIO.distintosPrefijo(A, A.length).length;
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: quedan " + esperado + ". Ahora " +
          "ejecute y mire la ficha ámbar —el último escrito— contra A[i−1]." };
      }
      if (valor === distintos) {
        return { ok: false, msg: "Ese es el número de valores <b>distintos</b>. " +
          "Aquí solo se colapsan las repeticiones consecutivas: un valor que " +
          "reaparece después de otro distinto vuelve a entrar." };
      }
      if (valor === A.length) {
        return { ok: false, msg: "Ese es N. Solo coincide cuando no hay dos " +
          "iguales seguidos; pruebe ese caso con el preset [1, 2, 3]." };
      }
      return { ok: false, msg: "No coincide. Cuente las rachas: cada bloque de " +
        "valores iguales seguidos aporta exactamente un elemento." };
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

    /* ---- tarjeta 4: los invariantes ---- */
    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    function revisarDescubrimiento() {
      if (resOK && ultimoOK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes, con " +
          "B = { t : 0 ≤ t &lt; i ∧ (t = 0 ∨ A[t] ≠ A[t−1]) } las posiciones " +
          "donde arranca una racha y b₀ &lt; b₁ &lt; … sus elementos en orden: " +
          "<b>I₀: 0 ≤ i ≤ N</b>, <b>I₁: len(res) = |B| ∧ ∀k, 0 ≤ k &lt; " +
          "len(res): res[k] = A[bₖ]</b> e <b>I₂: i &gt; 0 → " +
          "res[len(res) − 1] = A[i−1]</b>. " +
          "El teorema a demostrar: <b>Teorema 1 — los invariantes I₀, I₁ e I₂ " +
          "se cumplen.</b>";
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-res button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          resOK = true;
          veredicto("veredicto-res", true, "Ese es I₁, y fíjese en que dice " +
            "las dos cosas de un tirón: al decir <b>qué lista es</b> queda " +
            "fijado tanto su largo como el contenido de cada posición.");
          Motor.repintar();
          revisarDescubrimiento();
        } else if (op === "longitud") {
          veredicto("veredicto-res", false, "Solo se cumple cuando no hay dos " +
            "iguales seguidos. Con [4, 4, 4, 4], en el chequeo i = 3 la lista " +
            "tiene un elemento, no tres. Y aunque fuera cierto, un invariante " +
            "de longitud no dice qué hay adentro.");
        } else if (op === "distintos") {
          veredicto("veredicto-res", false, "Eso quitaría <b>todos</b> los " +
            "repetidos. Corra el primer arreglo hasta el final: el 1 aparece " +
            "de nuevo en A[6] después del 3, y vuelve a entrar. La respuesta " +
            "es [1, 2, 3, 1], con dos unos.");
        } else {
          veredicto("veredicto-res", false, "Es cierto, pero se queda a mitad " +
            "de camino: describe una propiedad de <code>res</code> sin " +
            "relacionarla con A. En la terminación hay que sustituir i = N y " +
            "obtener la poscondición, y de esa frase no sale.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-ultimo button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          ultimoOK = true;
          veredicto("veredicto-ultimo", true, "Ese es I₂, y es el puente: el " +
            "código compara A[i] con el último de <code>res</code>, pero el " +
            "enunciado habla de rachas, o sea de A[i] contra A[i−1]. I₂ dice " +
            "que las dos comparaciones son la misma.");
          Motor.repintar();
          revisarDescubrimiento();
        } else if (op === "nada") {
          veredicto("veredicto-ultimo", false, "Intente escribir la " +
            "estabilidad solo con I₁ y verá dónde se atasca: hay que " +
            "justificar que A[i] ≠ último(res) equivale a que A[i] empiece " +
            "una racha nueva, y para eso hace falta saber quién es " +
            "último(res) en términos de A.");
        } else {
          veredicto("veredicto-ultimo", false, "Falso, y además no serviría. " +
            "En el primer arreglo, en el chequeo i = 7 el último de " +
            "<code>res</code> es 1 y el mayor de A[0..7) es 3. La comparación " +
            "del código no tiene nada que ver con máximos.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cotas button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          cotasOK = true;
          veredicto("veredicto-cotas", true, "Ese es I₀. Pruebe el preset " +
            "vacío: con N = 0 el único chequeo ocurre con i = 0, y el " +
            "invariante lo cubre.");
          revisarDescubrimiento();
        } else if (op === "estricta") {
          veredicto("veredicto-cotas", false, "Mire el último chequeo: i llega " +
            "a N, y con el arreglo vacío ese es el único que hay. De ese " +
            "chequeo sale la poscondición, así que el invariante tiene que " +
            "cubrirlo.");
        } else {
          veredicto("veredicto-cotas", false, "Falso en cuanto haya una " +
            "repetición: con [4, 4, 4, 4], en el chequeo i = 3 la lista tiene " +
            "un solo elemento. Además, las cotas de un índice se escriben " +
            "contra el tamaño de la entrada, N, no contra otra variable que " +
            "también está cambiando.");
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
        var op = btn.getAttribute("data-p1");
        if (op === "vacuo") {
          veredicto("veredicto-p1", true, "Correcto: la implicación se cumple " +
            "cuando el antecedente es falso. Por eso I₂ se escribe con la " +
            "guarda i &gt; 0 en vez de afirmar sin más que res tiene último " +
            "elemento.");
          completarPaso("paso-1", "paso-2");
        } else if (op === "ultimo") {
          veredicto("veredicto-p1", false, "La lista vacía no tiene último " +
            "elemento, y A[−1] no existe. Mire cómo está escrito I₂: no " +
            "afirma nada cuando i = 0.");
        } else {
          veredicto("veredicto-p1", false, "Sí se cumple, y justamente por " +
            "cómo está escrito. Relea I₂: es una implicación con antecedente " +
            "i &gt; 0.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-2 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p2");
        if (op === "tres") {
          veredicto("veredicto-p2", true, "Correcto: el caso de la lista vacía " +
            "va aparte porque en él I₂ no da información, y es el único donde " +
            "la línea 7 no llega a ejecutarse.");
          completarPaso("paso-2", "paso-3");
        } else {
          veredicto("veredicto-p2", false, "Esos dos casos son la conclusión, " +
            "no la partición: para saber si A[t] entra hay que mirar antes si " +
            "<code>res</code> está vacía, porque solo entonces la línea 7 se " +
            "ejecuta. Son tres.");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-3 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p3");
        if (op === "interseccion") {
          veredicto("veredicto-p3", true, "Correcto, y el «de dónde sale» es " +
            "la mitad de la respuesta: el valor final no se declara, se " +
            "obtiene intersecando la condición rota con el invariante.");
          completarPaso("paso-3", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "declarado") {
          veredicto("veredicto-p3", false, "El valor es ese, pero «porque " +
            "recorre todo el arreglo» no es un argumento: es repetir la " +
            "conclusión. Hay que intersecar la negación de la condición con I₀.");
        } else {
          veredicto("veredicto-p3", false, "No: con [4, 4, 4, 4] el ciclo " +
            "termina con i = 4 y len(res) = 1. El índice se acota contra N.");
        }
      });
    });
  })();
}
