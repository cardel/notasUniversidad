/* insercion: insertar e iSort de los frames "La idea del Insertion Sort" y
   "Implementacion del Insertion Sort" de ListasParte1.tex. El panel traza
   insertar; las cuatro rondas son las cuatro llamadas a insertar que iSort
   dispara sobre List(8, 4, 11, 2), en el orden en que corren, y salen de
   rondasDe(), no de una lista escrita a mano. En cada ronda el estudiante
   predice la posicion en que queda x antes de ver la ejecucion. */
(function () {

  /* ── El codigo del deck ────────────────────────────────────────── */

  var CODIGO = [
    { num: 1, txt: "def insertar(x: Int, xs: List[Int]): List[Int] = xs match {" },
    { num: 2, txt: "  case Nil     => List(x)", bloque: 1 },
    { num: 3, txt: "  case y :: ys => if (x <= y) x :: xs", bloque: 2 },
    { num: 4, txt: "                  else y :: insertar(x, ys)", bloque: 3 },
    { num: 5, txt: "}" }
  ];

  var LISTA = [8, 4, 11, 2];

  function textoLista(xs) { return "List(" + xs.join(", ") + ")"; }

  /* ── insertar e iSort, con el cuerpo de los casos del deck ─────── */

  function insertar(x, xs) {
    if (xs.length === 0) { return [x]; }
    if (x <= xs[0]) { return [x].concat(xs); }
    return [xs[0]].concat(insertar(x, xs.slice(1)));
  }

  /* La posicion en que queda x: insertar salta las cabezas que no cumplen
     x <= y y lo coloca delante de la primera que si. */
  function posicionDe(x, xs) {
    var i = 0;
    while (i < xs.length && !(x <= xs[i])) { i = i + 1; }
    return i + 1;
  }

  /* Las llamadas a insertar que iSort dispara, de la mas interna a la mas
     externa, que es el orden en que corren. */
  function rondasDe(lista) {
    var acc = [];
    function orden(xs) {
      var cola, res;
      if (xs.length === 0) { return []; }
      cola = orden(xs.slice(1));
      res = insertar(xs[0], cola);
      acc.push({
        x: xs[0], xs: cola, resultado: res, posicion: posicionDe(xs[0], cola)
      });
      return res;
    }
    orden(lista);
    return acc;
  }

  function iSort(xs) {
    if (xs.length === 0) { return []; }
    return insertar(xs[0], iSort(xs.slice(1)));
  }

  var RONDAS = rondasDe(LISTA);

  /* ── El arbol de llamadas del frame de la idea ─────────────────── */

  function sangria(n) { return new Array(n + 1).join(" "); }

  function bajada(lista) {
    var lineas = ["iSort(" + textoLista(lista) + ")"];
    lista.forEach(function (v, i) {
      var resto = lista.slice(i + 1);
      lineas.push(sangria((i + 1) * 2) + "insertar " + v + " en iSort(" +
        textoLista(resto) + ")" + (resto.length === 0 ? " = List()" : ""));
    });
    return lineas;
  }

  function subida(lista, rondas) {
    var n = lista.length;
    return rondas.map(function (r, j) {
      if (j === 0) {
        return sangria(n * 2) + "=> " + textoLista(r.resultado);
      }
      return sangria((n - j) * 2) + "=> insertar " + r.x + " en " +
        textoLista(r.xs) + " => " + textoLista(r.resultado);
    });
  }

  /* ── La simulacion de una ronda ────────────────────────────────── */

  function simular(params) {
    var x = params.x;
    var original = params.xs;
    var pos0 = posicionDe(x, original) - 1;
    var pasos = [];
    var colocado = false;

    function retrato(prof, marcaActual) {
      var fila = [];
      var i;
      for (i = 0; i < original.length; i = i + 1) {
        if (colocado && i === pos0) {
          fila.push({ valor: x, estado: "insertado" });
        }
        fila.push({ valor: original[i], estado: estadoDe(i, prof, marcaActual) });
      }
      if (colocado && pos0 === original.length) {
        fila.push({ valor: x, estado: "insertado" });
      }
      return fila;
    }

    function estadoDe(i, prof, marcaActual) {
      if (colocado) { return i < pos0 ? "pasado" : "resto"; }
      if (i < prof - 1) { return "pasado"; }
      if (marcaActual && i === prof - 1) { return "actual"; }
      return "resto";
    }

    function anotar(linea, extra) {
      var p = {
        linea: linea, xs: null, y: null, compara: null,
        pendiente: null, devuelve: null, profundidad: null, vista: []
      };
      Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
      p.vista = retrato(p.profundidad, p.linea === 3);
      pasos.push(p);
    }

    function visitar(xs, prof) {
      var y, ys, cabe, interior, total, puesta;
      anotar(1, { xs: textoLista(xs), profundidad: prof });

      if (xs.length === 0) {
        colocado = true;
        anotar(2, {
          xs: "Nil", profundidad: prof, devuelve: textoLista([x])
        });
        anotar(5, {
          xs: "Nil", profundidad: prof, devuelve: textoLista([x])
        });
        return [x];
      }

      y = xs[0];
      ys = xs.slice(1);
      cabe = x <= y;
      puesta = [x].concat(xs);
      if (cabe) { colocado = true; }
      anotar(3, {
        xs: textoLista(xs), y: y, profundidad: prof,
        compara: x + " <= " + y + "? " + (cabe ? "Sí" : "No"),
        devuelve: cabe ? textoLista(puesta) : null
      });

      if (cabe) {
        anotar(5, {
          xs: textoLista(xs), y: y, profundidad: prof,
          compara: x + " <= " + y + "? Sí", devuelve: textoLista(puesta)
        });
        return puesta;
      }

      anotar(4, {
        xs: textoLista(xs), y: y, profundidad: prof,
        compara: x + " <= " + y + "? No", pendiente: y + " ::"
      });
      interior = visitar(ys, prof + 1);
      total = [y].concat(interior);
      anotar(5, {
        xs: textoLista(xs), y: y, profundidad: prof,
        pendiente: y + " ::", devuelve: textoLista(total)
      });
      return total;
    }

    visitar(original, 1);
    return pasos;
  }

  /* ── La prediccion ─────────────────────────────────────────────── */

  function razon(valor, params) {
    var x = params.x;
    var xs = params.xs;
    var buena = posicionDe(x, xs);
    var n = xs.length;
    if (valor < 1 || valor > n + 1) {
      return "La posición va de 1 a " + (n + 1) + ": el " + x + " puede quedar " +
        "antes de todos, entre dos de ellos o después de todos.";
    }
    if (valor < buena) {
      return "En la posición " + valor + " el " + x + " quedaría delante del " +
        xs[valor - 1] + ", y " + x + " <= " + xs[valor - 1] + " es falso. El caso " +
        "recursivo salta cada cabeza que no cumple la condición, así que el " + x +
        " pasa por encima de todas las menores que él. Cuente cuántos elementos de " +
        textoLista(xs) + " son menores que " + x + ".";
    }
    return "En la posición " + valor + " el " + x + " quedaría detrás del " +
      xs[valor - 2] + ", y " + x + " <= " + xs[valor - 2] + " es verdadero. Cuando " +
      "la condición se cumple, el caso devuelve x :: xs y deja de bajar: el " + x +
      " no llega hasta allá.";
  }

  function evaluar(valor, params) {
    var buena = posicionDe(params.x, params.xs);
    if (valor !== buena) {
      return { ok: false, msg: razon(valor, params) };
    }
    return {
      ok: true,
      msg: "Eso es: insertar(" + params.x + ", " + textoLista(params.xs) +
        ") devuelve " + textoLista(insertar(params.x, params.xs)) + ", con el " +
        params.x + " en la posición " + buena + " de " +
        (params.xs.length + 1) + ". Ahora avance paso por paso y mire la " +
        "comparación de cada marco."
    };
  }

  var API = {
    CODIGO: CODIGO, LISTA: LISTA, RONDAS: RONDAS,
    textoLista: textoLista, insertar: insertar, iSort: iSort,
    posicionDe: posicionDe, rondasDe: rondasDe,
    bajada: bajada, subida: subida,
    simular: simular, evaluar: evaluar, razon: razon
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ── La página ─────────────────────────────────────────────────── */

  var r = 0;
  var resueltas = 0;
  var BAJADA = bajada(LISTA);
  var SUBIDA = subida(LISTA, RONDAS);

  function pintarArbol() {
    var caja = document.getElementById("arbol");
    caja.innerHTML = "";
    BAJADA.forEach(function (t, i) {
      var div = document.createElement("div");
      div.className = "rama-arbol" +
        (i === LISTA.length - r ? " vigente" : "");
      div.textContent = t;
      caja.appendChild(div);
    });
    SUBIDA.forEach(function (t, j) {
      var div = document.createElement("div");
      if (j >= resueltas) { return; }
      div.className = "rama-arbol cerrada";
      div.textContent = t;
      caja.appendChild(div);
    });
  }

  function pintarVista(paso) {
    var caja = document.getElementById("vista");
    var fila = paso === null ? [] : paso.vista;
    caja.innerHTML = "";
    if (fila.length === 0) {
      caja.innerHTML = '<span class="ficha vacia">List()</span>';
      return;
    }
    fila.forEach(function (c) {
      var span = document.createElement("span");
      span.className = "ficha " + c.estado;
      span.textContent = c.valor;
      caja.appendChild(span);
    });
  }

  function pintarRonda() {
    var ronda = RONDAS[r];
    document.getElementById("llamada").textContent =
      "insertar(" + ronda.x + ", " + textoLista(ronda.xs) + ")";
    document.getElementById("rango").textContent =
      "1 a " + (ronda.xs.length + 1);
    document.getElementById("marcador").textContent =
      "inserciones resueltas: " + resueltas + " de " + RONDAS.length;
    document.getElementById("prediccion").value = "";
    document.getElementById("prediccion").max = String(ronda.xs.length + 1);
    document.getElementById("btn-seguir").style.display = "none";
    document.getElementById("botones").classList.add("bloqueado");
    Motor.limpiarVeredicto();
    pintarArbol();
  }

  function alPintar(e) {
    pintarVista(e.actual);
    document.getElementById("objetivo").textContent = String(e.params.x);
    document.getElementById("salida").textContent =
      e.terminado ? textoLista(insertar(e.params.x, e.params.xs)) : "–";
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: { x: RONDAS[0].x, xs: RONDAS[0].xs },
    simular: simular,
    chips: [
      { campo: "xs", rotulo: "xs" },
      { campo: "y", rotulo: "y" },
      { campo: "compara", rotulo: "x <= y" },
      { campo: "devuelve", rotulo: "devuelve" }
    ],
    alPintar: alPintar
  });

  Motor.prediccionNumerica(function (valor, params) {
    var res = evaluar(valor, params);
    if (res.ok && resueltas === r) {
      resueltas = resueltas + 1;
      document.getElementById("botones").classList.remove("bloqueado");
      document.getElementById("btn-seguir").style.display =
        r + 1 < RONDAS.length ? "inline-block" : "none";
      document.getElementById("marcador").textContent =
        "inserciones resueltas: " + resueltas + " de " + RONDAS.length;
      pintarArbol();
      if (resueltas === RONDAS.length) {
        document.getElementById("carta-cierre").classList.remove("bloqueado");
        document.getElementById("final").textContent = textoLista(iSort(LISTA));
      }
    }
    return res;
  });

  document.getElementById("btn-seguir").addEventListener("click", function () {
    r = r + 1;
    pintarRonda();
    Motor.reiniciar({ x: RONDAS[r].x, xs: RONDAS[r].xs });
  });

  pintarRonda();
})();
