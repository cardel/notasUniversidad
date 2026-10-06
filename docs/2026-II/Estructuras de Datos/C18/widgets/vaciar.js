/* Ejercicio interactivo: el ultimo al vaciar la cola de nodos (clase 18). */
var EJERCICIO = (function () {
  var LINEAS_ROTO = [
    "void encolar(Elemento e) {",
    "  Nodo *nuevo = new Nodo;",
    "  nuevo->dato = e;",
    "  nuevo->siguiente = NULL;",
    "  if (ultimo == NULL) {",
    "    cabeza = nuevo;",
    "  } else {",
    "    ultimo->siguiente = nuevo;",
    "  }",
    "  ultimo = nuevo;",
    "  n = n + 1;",
    "}",
    "",
    "// exige !vacia()",
    "void desencolar() {",
    "  assert(!vacia());",
    "  Nodo *muerto = cabeza;",
    "  cabeza = cabeza->siguiente;",
    "  delete muerto;",
    "  n = n - 1;",
    "}"
  ];
  var LINEAS_DESENCOLAR = [
    "// exige !vacia()",
    "void desencolar() {",
    "  assert(!vacia());",
    "  Nodo *muerto = cabeza;",
    "  cabeza = cabeza->siguiente;",
    "  if (cabeza == NULL) {",
    "    ultimo = NULL;",
    "  }",
    "  delete muerto;",
    "  n = n - 1;",
    "}"
  ];
  var LLAMADAS = [
    { op: "encolar", valor: 3 },
    { op: "desencolar" },
    { op: "encolar", valor: 7 }
  ];
  var LIMITE = 12;

  /* Corre la secuencia sobre nodos marcados como liberados cuando se devuelven.
     conGuarda: desencolar devuelve ultimo a NULL al quedar la cola vacia.
     decideConUltimo: encolar escoge la rama mirando ultimo en vez de cabeza. */
  function corrida(conGuarda, decideConUltimo, llamadas) {
    var cabeza = null;
    var ultimo = null;
    var n = 0;
    var sobreLiberado = false;
    var nuevo = null;
    var k = 0;
    while (k < llamadas.length) {
      var o = llamadas[k];
      if (o.op === "encolar") {
        nuevo = { dato: o.valor, siguiente: null, liberado: false };
        var primera = decideConUltimo ? ultimo === null : cabeza === null;
        if (primera) {
          cabeza = nuevo;
        } else {
          if (ultimo.liberado) { sobreLiberado = true; }
          ultimo.siguiente = nuevo;
        }
        ultimo = nuevo;
        n = n + 1;
      } else {
        var muerto = cabeza;
        cabeza = cabeza.siguiente;
        if (conGuarda && cabeza === null) {
          ultimo = null;
        }
        muerto.liberado = true;
        n = n - 1;
      }
      k = k + 1;
    }
    var cadena = [];
    var alcanzable = false;
    var actual = cabeza;
    var vueltas = 0;
    while (actual !== null && vueltas < LIMITE) {
      cadena.push(actual.dato);
      if (actual === nuevo) { alcanzable = true; }
      actual = actual.siguiente;
      vueltas = vueltas + 1;
    }
    return { sobreLiberado: sobreLiberado, alcanzable: alcanzable,
             cabezaEnNull: cabeza === null, cadena: cadena, n: n };
  }

  /* Punteros de la clase que escribe desencolar: cabeza siempre, y ultimo
     solo cuando la cola se queda vacia. */
  function escriturasDesencolar(elementos) {
    var escrituras = 1;
    if (elementos === 1) {
      escrituras = escrituras + 1;
    }
    return escrituras;
  }

  /* Vaciar una cola de m elementos, un desencolar por elemento. */
  function escriturasAlVaciar(m) {
    var total = 0;
    var quedan = m;
    while (quedan > 0) {
      total = total + escriturasDesencolar(quedan);
      quedan = quedan - 1;
    }
    return total;
  }

  return { lineasRoto: LINEAS_ROTO, lineasDesencolar: LINEAS_DESENCOLAR,
           llamadas: LLAMADAS, corrida: corrida,
           escriturasDesencolar: escriturasDesencolar,
           escriturasAlVaciar: escriturasAlVaciar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      lineas.forEach(function (par, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (par[1] ? " " + par[1] : "");
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = par[0];
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }
    var logradas = { roto: false, escrituras: false, total: false };
    function revisar() {
      if (logradas.roto && logradas.escrituras && logradas.total) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var ROTO = EJERCICIO.corrida(false, true, EJERCICIO.llamadas);
    var SANO = EJERCICIO.corrida(true, true, EJERCICIO.llamadas);
    var CUATRO = 4;

    pintarCodigo("codigo-roto", EJERCICIO.lineasRoto.map(function (t, i) {
      var clase = "";
      if (i === 7) { clase = "bloque-2"; }
      if (i >= 14 && i <= 20) { clase = "bloque-1"; }
      return [t, clase];
    }));
    pintarCodigo("codigo-desencolar", EJERCICIO.lineasDesencolar.map(function (t, i) {
      return [t, i === 4 || i === 6 ? "bloque-3" : ""];
    }));

    var MENSAJES_ROTO = {
      escribe: null,
      nada: "cabeza sí quedó en NULL, pero esta versión no la consulta: la rama la decide ultimo, que vale la dirección del nodo liberado. Se va por el else y cabeza se queda como estaba.",
      dos: "El nodo del 3 ya se devolvió con delete: no hay dos elementos. Lo que queda es n diciendo 1 y una cadena a la que no se llega desde cabeza.",
      detiene: "Escribir sobre memoria devuelta no detiene el programa de forma confiable: el bloque suele seguir siendo del proceso, así que la escritura pasa y el daño aparece después, en otra parte y sin relación visible."
    };
    document.querySelectorAll("#opciones-roto button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-roto");
        var m = MENSAJES_ROTO[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto. ultimo vale la dirección del nodo del 3, que ya se liberó, así que la condición ultimo == NULL es falsa y se ejecuta ultimo->siguiente = nuevo sobre memoria devuelta. cabeza se queda en NULL, el nodo del 7 no aparece en la cadena que sale de cabeza y n dice " + ROTO.n +
            ". Con la línea que devuelve ultimo a NULL, el mismo encolar deja la cola con " + SANO.cadena.join(", ") + ".";
          logradas.roto = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    document.getElementById("btn-escrituras").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-escrituras");
      var esperadoUno = EJERCICIO.escriturasDesencolar(1);
      var esperadoVarios = EJERCICIO.escriturasDesencolar(3);
      var a = parseInt(document.getElementById("pred-uno").value, 10);
      var b = parseInt(document.getElementById("pred-varios").value, 10);
      if (a === esperadoUno && b === esperadoVarios) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + esperadoUno + " y " + esperadoVarios +
          ". cabeza se escribe siempre. ultimo se escribe solo cuando la cabeza nueva es NULL, que es justo el caso del único elemento.";
        logradas.escrituras = true; revisar();
      } else if (a === 3 || b === 2) {
        ver.className = "veredicto mal";
        ver.textContent = "muerto es un puntero local, no uno de los dos de la clase: se muere al salir de la función. Los que sobreviven a la llamada son cabeza y ultimo.";
      } else if (a === b) {
        ver.className = "veredicto mal";
        ver.textContent = "Los dos casos no cuestan igual: el if de la mitad solo entra en uno de los dos.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Cuente las asignaciones a cabeza y a ultimo que ejecuta la llamada en cada caso.";
      }
    });

    document.getElementById("btn-total").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-total");
      var esperado = EJERCICIO.escriturasAlVaciar(CUATRO);
      var dado = parseInt(document.getElementById("pred-total").value, 10);
      if (dado === esperado) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + esperado +
          ". Los tres primeros desencolar dejan cadena y escriben solo cabeza; el cuarto la deja vacía y escribe los dos. Son 3 · 1 + 2 = " + esperado + ", así que vaciar una cola de m elementos cuesta m + 1 escrituras: Θ(m), una por elemento.";
        logradas.total = true; revisar();
      } else if (dado === CUATRO) {
        ver.className = "veredicto mal";
        ver.textContent = "Una de las cuatro llamadas cuesta una escritura más: la que deja la cola vacía.";
      } else if (dado === 2 * CUATRO) {
        ver.className = "veredicto mal";
        ver.textContent = "El if no entra en todas: tres de las cuatro llamadas dejan cadena y ahí ultimo no se toca.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Sume lo que cuesta cada una de las cuatro llamadas con la cuenta de la tarjeta anterior.";
      }
    });
  })();
}
