/* Ejercicio interactivo: cuantas secuencias imprime UVa 732 (clase 17). */
var EJERCICIO = (function () {
  var PRIMERO = ["banana", "ananab"];
  var FAMILIA = [["nana", "nana"], ["nanana", "nanana"], ["nananana", "nananana"]];
  var ULTIMO = ["piano", "opina"];

  /* La busqueda del programa: se intenta meter antes que sacar, y sacar solo
     cuando el tope es la letra que la salida necesita. Devuelve las secuencias
     en el orden en que se imprimen, con los estados que se visitaron y los que
     no llevaron a nada. */
  function analizar(entrada, salida) {
    var largo = entrada.length;
    var pila = [];
    var jugadas = [];
    var secuencias = [];
    var cuenta = { estados: 0, callejones: 0 };

    function buscar(metidas, escritas) {
      cuenta.estados = cuenta.estados + 1;
      if (escritas === largo) {
        secuencias.push(jugadas.join(" "));
      } else {
        var abiertas = 0;
        if (metidas < largo) {
          abiertas = abiertas + 1;
          pila.push(entrada.charAt(metidas));
          jugadas.push("i");
          buscar(metidas + 1, escritas);
          jugadas.pop();
          pila.pop();
        }
        if (pila.length > 0 && pila[pila.length - 1] === salida.charAt(escritas)) {
          abiertas = abiertas + 1;
          var letra = pila[pila.length - 1];
          pila.pop();
          jugadas.push("o");
          buscar(metidas, escritas + 1);
          jugadas.pop();
          pila.push(letra);
        }
        if (abiertas === 0) {
          cuenta.callejones = cuenta.callejones + 1;
        }
      }
    }

    if (entrada.length === salida.length) {
      buscar(0, 0);
    }
    return { secuencias: secuencias, estados: cuenta.estados,
             callejones: cuenta.callejones };
  }

  function cuantas(entrada, salida) {
    return analizar(entrada, salida).secuencias.length;
  }

  /* Una fila por palabra de la familia: largo, secuencias, estados visitados y
     estados que no imprimieron nada. */
  function tabla() {
    return FAMILIA.map(function (par) {
      var r = analizar(par[0], par[1]);
      return { palabra: par[0], largo: par[0].length,
               secuencias: r.secuencias.length, estados: r.estados,
               callejones: r.callejones };
    });
  }

  return { primero: PRIMERO, familia: FAMILIA, ultimo: ULTIMO,
           analizar: analizar, cuantas: cuantas, tabla: tabla };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var logradas = { banana: false, familia: false, piano: false };
    function revisar() {
      if (logradas.banana && logradas.familia && logradas.piano) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var PRIMERO = EJERCICIO.analizar(EJERCICIO.primero[0], EJERCICIO.primero[1]);
    var ULTIMO = EJERCICIO.analizar(EJERCICIO.ultimo[0], EJERCICIO.ultimo[1]);
    var TABLA = EJERCICIO.tabla();

    document.getElementById("btn-banana").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-banana");
      var dado = parseInt(document.getElementById("pred-banana").value, 10);
      if (dado === PRIMERO.secuencias.length) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + PRIMERO.secuencias.length +
          ". La b se mete de primera y se escribe de última, así que pasa toda la búsqueda en el fondo. Las bifurcaciones las abren las tres a: cuando la salida necesita una a, puede ser la que ya está en el tope o una que todavía no se ha metido. El recorrido visitó " +
          PRIMERO.estados + " estados y " + PRIMERO.callejones +
          " de ellos no imprimieron nada. Las secuencias son: " +
          PRIMERO.secuencias.join("; ") + ".";
        logradas.banana = true; revisar();
      } else if (dado === 0) {
        ver.className = "veredicto mal";
        ver.textContent = "Hay al menos una: ananab es banana al revés, y meter las seis letras y sacarlas en bloque la escribe entera.";
      } else if (dado === 1) {
        ver.className = "veredicto mal";
        ver.textContent = "Esa es la cuenta con las letras todas distintas, donde el tope coincide con la letra que toca en un solo momento. banana tiene tres a y dos n, y cada repetición abre otra forma de servir la misma letra de la salida.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "No. Cuente por aperturas: la primera a de la salida la puede dar la a que ya está en el tope o una de las que faltan por meter, y cada elección deja un resto distinto para las letras que siguen. Son menos de diez.";
      }
    });

    function pintarTabla() {
      var caja = document.getElementById("tabla-familia");
      if (caja.dataset.lista === "si") {
        return;
      }
      caja.dataset.lista = "si";
      var t = document.createElement("table");
      var cab = document.createElement("tr");
      ["palabra", "letras", "secuencias", "estados visitados", "sin imprimir nada"]
        .forEach(function (r) {
          var th = document.createElement("th");
          th.textContent = r;
          cab.appendChild(th);
        });
      t.appendChild(cab);
      TABLA.forEach(function (f) {
        var tr = document.createElement("tr");
        [f.palabra, f.largo, f.secuencias, f.estados, f.callejones].forEach(function (v) {
          var td = document.createElement("td");
          td.textContent = String(v);
          tr.appendChild(td);
        });
        t.appendChild(tr);
      });
      caja.appendChild(t);
    }

    document.getElementById("btn-familia").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-familia");
      var seis = parseInt(document.getElementById("pred-seis").value, 10);
      var ocho = parseInt(document.getElementById("pred-ocho").value, 10);
      pintarTabla();
      if (seis === TABLA[1].secuencias && ocho === TABLA[2].secuencias) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + TABLA[1].secuencias + " y " +
          TABLA[2].secuencias + ". Cada par de letras que se agrega multiplica la cuenta por cuatro o más: " +
          TABLA[0].secuencias + ", " + TABLA[1].secuencias + ", " + TABLA[2].secuencias +
          ", y los estados visitados pasan de " + TABLA[0].estados + " a " + TABLA[2].estados + ".";
        logradas.familia = true; revisar();
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "No. La tabla trae la cuenta: " + TABLA[1].secuencias +
          " y " + TABLA[2].secuencias + ". Cada par de letras que se agrega no suma unas pocas secuencias: multiplica la cuenta por cuatro o más.";
      }
    });

    document.getElementById("btn-piano").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-piano");
      var dado = parseInt(document.getElementById("pred-piano").value, 10);
      if (dado === ULTIMO.secuencias.length) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: ninguna, y el bloque sale vacío aunque opina sea anagrama de piano. La o es la última letra de la entrada y la primera de la salida, así que escribirla obliga a meter las cinco: la pila queda o n a i p con la o en el tope. Sacada la o, lo único que la pila puede entregar es n a i p, y la salida pide p i n a. El recorrido se detiene ahí, tras " +
          ULTIMO.estados + " estados.";
        logradas.piano = true; revisar();
      } else if (dado === 1) {
        ver.className = "veredicto mal";
        ver.textContent = "Esa es la cuenta cuando la salida es la entrada al revés, y opina no es piano al revés: eso sería onaip. Mire en qué orden puede entregar la pila las cuatro letras que quedan después de escribir la o.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "No. Escribir la o de primera obliga a meter las cinco letras, porque la o es la última de piano. Con la pila ya llena y nada por meter, el orden en que salen las cuatro letras restantes está decidido: compárelo con lo que la salida pide.";
      }
    });
  })();
}
