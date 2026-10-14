/* reversa: la primera version del frame "Invertir una lista: reversa" de
   ListasParte1.tex, con la pila de marcos a la vista. La simulacion abre un
   marco por llamada, deja anotada la concatenacion pendiente de cada uno y la
   resuelve al desarmar la pila, en el orden en que el deck lo traza. celdas
   cuenta los nodos que ++ recorre: la lista izquierda de cada concatenacion. */
(function () {

  /* ── El codigo del deck ────────────────────────────────────────── */

  var CODIGO = [
    { num: 1, txt: "def reversa[T](lst: List[T]): List[T] = lst match {" },
    { num: 2, txt: "  case Nil     => Nil", bloque: 1 },
    { num: 3, txt: "  case x :: xs => reversa(xs) ++ List(x)", bloque: 2 },
    { num: 4, txt: "}", bloque: 3 }
  ];

  var PARAMS_INICIALES = [1, 2, 3];

  var PRESETS = [[], [1, 2], [1, 2, 3], [1, 2, 3, 4]];

  function textoLista(xs) { return "List(" + xs.join(", ") + ")"; }

  /* ── La simulacion ─────────────────────────────────────────────── */

  function simular(lista) {
    var pasos = [];
    var marcos = [];
    var celdas = 0;

    /* Los marcos abiertos, con el que esta corriendo marcado como activo. */
    function retrato(activa) {
      return marcos.map(function (m) {
        var estado = "abierto";
        if (m.valor !== null) { estado = "cerrado"; }
        else if (m.prof === activa) { estado = "activo"; }
        return {
          prof: m.prof, arg: m.arg, pendiente: m.pendiente,
          valor: m.valor, estado: estado
        };
      });
    }

    function anotar(linea, extra) {
      var p = {
        linea: linea, lst: null, profundidad: null, pendiente: null,
        devuelve: null, concat: null, celdas: celdas, marcos: []
      };
      Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
      p.celdas = celdas;
      p.marcos = retrato(p.profundidad);
      pasos.push(p);
    }

    function visitar(xs, prof) {
      var marco = {
        prof: prof, arg: textoLista(xs), pendiente: null, valor: null
      };
      var x, cola, interior, total;
      marcos.push(marco);
      anotar(1, { lst: textoLista(xs), profundidad: prof });

      if (xs.length === 0) {
        anotar(2, { lst: "Nil", profundidad: prof, devuelve: "List()" });
        marco.valor = "List()";
        anotar(4, { lst: "Nil", profundidad: prof, devuelve: "List()" });
        marcos.pop();
        return [];
      }

      x = xs[0];
      cola = xs.slice(1);
      marco.pendiente = "++ List(" + x + ")";
      anotar(3, {
        lst: textoLista(xs), profundidad: prof, pendiente: marco.pendiente
      });

      interior = visitar(cola, prof + 1);
      celdas = celdas + interior.length;
      total = interior.concat([x]);
      marco.valor = textoLista(total);
      anotar(4, {
        lst: textoLista(xs), profundidad: prof, pendiente: marco.pendiente,
        concat: textoLista(interior) + " ++ List(" + x + ")",
        devuelve: marco.valor
      });
      marcos.pop();
      return total;
    }

    visitar(lista, 1);
    return pasos;
  }

  /* El resultado, calculado con el mismo cuerpo del caso recursivo. */
  function reversa(xs) {
    if (xs.length === 0) { return []; }
    return reversa(xs.slice(1)).concat([xs[0]]);
  }

  var API = {
    CODIGO: CODIGO, PARAMS_INICIALES: PARAMS_INICIALES, PRESETS: PRESETS,
    textoLista: textoLista, simular: simular, reversa: reversa
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* ── La página ─────────────────────────────────────────────────── */

  function dibujarPila(paso) {
    var caja = document.getElementById("pila");
    var marcos = paso === null ? [] : paso.marcos;
    caja.innerHTML = "";
    if (marcos.length === 0) {
      caja.innerHTML = '<p class="nota" style="margin:0">La pila está vacía: ' +
        'ninguna llamada está abierta todavía.</p>';
      return;
    }
    marcos.forEach(function (m) {
      var fila = document.createElement("div");
      var prof = document.createElement("span");
      var cuerpo = document.createElement("span");
      var cola = document.createElement("span");
      fila.className = "marco " + m.estado;
      fila.style.marginLeft = (m.prof - 1) * 1.1 + "rem";
      prof.className = "prof";
      prof.textContent = m.prof;
      cuerpo.className = "llamada";
      cuerpo.textContent = "reversa(" + m.arg + ")";
      cola.className = "cola-marco";
      if (m.valor !== null) {
        cola.textContent = "= " + m.valor;
        cola.className = "cola-marco resuelta";
      } else if (m.pendiente !== null) {
        cola.textContent = m.pendiente + "  pendiente";
      } else {
        cola.textContent = "entrando al match";
      }
      fila.appendChild(prof);
      fila.appendChild(cuerpo);
      fila.appendChild(cola);
      caja.appendChild(fila);
    });
  }

  function alPintar(e) {
    dibujarPila(e.actual);
    document.getElementById("celdas").textContent =
      e.actual === null ? "0" : String(e.actual.celdas);
    document.getElementById("concat").textContent =
      e.actual === null || e.actual.concat === null ? "–" : e.actual.concat;
    document.getElementById("entrada").textContent = textoLista(e.params);
    document.getElementById("salida").textContent =
      e.terminado ? textoLista(reversa(e.params)) : "–";
  }

  function construirPresets() {
    var caja = document.getElementById("presets");
    PRESETS.forEach(function (p) {
      var b = document.createElement("button");
      b.textContent = textoLista(p);
      b.addEventListener("click", function () { Motor.reiniciar(p); });
      caja.appendChild(b);
    });
  }

  construirPresets();

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: PARAMS_INICIALES,
    simular: simular,
    chips: [
      { campo: "lst", rotulo: "lst" },
      { campo: "profundidad", rotulo: "profundidad", clase: "cuenta" },
      { campo: "pendiente", rotulo: "pendiente" },
      { campo: "devuelve", rotulo: "devuelve" }
    ],
    alPintar: alPintar
  });
})();
