/* Ejercicio interactivo: lo que cobra cada operacion (clase 15). */
var EJERCICIO = (function () {
  var N = 20;

  /* Insertar n veces en la posicion 0 del arreglo: cada insercion corre todo
     lo que ya hay. */
  function movidasArreglo(n) {
    var movidas = 0;
    var usados = 0;
    var k = 0;
    while (k < n) {
      var i = usados;
      while (i > 0) {
        i = i - 1;
        movidas = movidas + 1;
      }
      usados = usados + 1;
      k = k + 1;
    }
    return movidas;
  }

  /* Insertar n veces al frente de la enlazada: dos punteros por insercion. */
  function escriturasEnlazada(n) {
    var escrituras = 0;
    var k = 0;
    while (k < n) {
      escrituras = escrituras + 2;
      k = k + 1;
    }
    return escrituras;
  }

  /* La implementacion que conviene a cada perfil de uso. */
  var PERFILES = {
    consultas: "estatica",
    frente: "enlazada",
    techo: "enlazada"
  };

  return { n: N, movidasArreglo: movidasArreglo,
           escriturasEnlazada: escriturasEnlazada, perfiles: PERFILES };
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
    var logradas = { consultas: false, frente: false, techo: false, cuentas: false };
    function revisar() {
      if (logradas.consultas && logradas.frente && logradas.techo && logradas.cuentas) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    function conectar(grupo, clave, mensajes) {
      document.querySelectorAll("#" + grupo + " button").forEach(function (boton) {
        boton.addEventListener("click", function () {
          var ver = document.getElementById("veredicto-" + clave);
          var op = boton.dataset.op;
          if (op === EJERCICIO.perfiles[clave]) {
            ver.className = "veredicto bien";
            ver.textContent = mensajes.bien;
            logradas[clave] = true; revisar();
          } else {
            ver.className = "veredicto mal";
            ver.textContent = mensajes[op];
          }
        });
      });
    }

    conectar("opciones-consultas", "consultas", {
      bien: "Correcto: la estática. obtener(p) calcula la dirección de la casilla y la lee: Θ(1), sin importar dónde esté p ni cuántos elementos haya. El millón de consultas cuesta un millón de sumas.",
      enlazada: "En la enlazada obtener(p) camina p nodos desde la cabeza. Con posiciones al azar, cada consulta recorre media lista en promedio, y eso por un millón de consultas.",
      igual: "Las dos guardan los mismos datos, pero el acceso por posición no cuesta lo mismo: en una se calcula la dirección y en la otra se sigue la cadena."
    });

    conectar("opciones-frente", "frente", {
      bien: "Correcto: la enlazada. insertar(0, e) escribe nuevo->siguiente y cabeza: dos punteros, Θ(1) cada vez, y el recorrido final pasa una vez por cada nodo, Θ(n). El programa no consulta por posición, que es lo único caro en esta implementación.",
      estatica: "Cada insertar(0, e) del arreglo corre todo lo que ya hay: las n inserciones suman n(n-1)/2 movidas. Es justo la operación que el arreglo cobra más cara.",
      igual: "El recorrido final cuesta lo mismo en las dos, pero las inserciones no: Θ(1) contra Θ(n) cada una."
    });

    conectar("opciones-techo", "techo", {
      bien: "Correcto: la enlazada. Cada elemento pide su nodo cuando llega, así que el tamaño lo limita la memoria disponible y no una constante escrita en el código.",
      estatica: "CAPACIDAD se fija al compilar y el assert detiene el programa en el elemento que no cabe. Cambiarla exige recompilar y adivinar otra vez cuántos datos van a llegar.",
      igual: "Una tiene techo y la otra no: ahí no hay empate. La enlazada paga un puntero por elemento, y ese es el precio de no reservar casillas de antemano."
    });

    pintarCodigo("codigo-frente", [
      ["// arreglo: cada insercion corre todo lo que ya hay", ""],
      ["int i = usados;", "bloque-1"],
      ["while (i > 0) {", "bloque-1"],
      ["  datos[i] = datos[i - 1];", "bloque-1"],
      ["  i = i - 1;", "bloque-1"],
      ["  movidas = movidas + 1;", "bloque-1"],
      ["}", ""],
      ["", ""],
      ["// enlazada: dos escrituras, sin importar el tamano", ""],
      ["nuevo->siguiente = cabeza;", "bloque-2"],
      ["cabeza = nuevo;", "bloque-2"],
      ["escrituras = escrituras + 2;", "bloque-2"]
    ]);

    document.getElementById("btn-cuentas").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-cuentas");
      var esperadoA = EJERCICIO.movidasArreglo(EJERCICIO.n);
      var esperadoE = EJERCICIO.escriturasEnlazada(EJERCICIO.n);
      var a = parseInt(document.getElementById("pred-arreglo").value, 10);
      var e = parseInt(document.getElementById("pred-enlazada").value, 10);
      if (a === esperadoA && e === esperadoE) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + esperadoA + " y " + esperadoE + ". La inserción número k corre los k elementos que ya estaban, así que el total es 0 + 1 + ... + 19 = 20·19/2 = 190. La enlazada escribe dos punteros cada vez: 2·20 = 40.";
        logradas.cuentas = true; revisar();
        var nota = document.getElementById("nota-cuentas");
        nota.style.display = "block";
        nota.textContent = "Con n = 200 el arreglo haría " + EJERCICIO.movidasArreglo(200) + " movidas y la enlazada " + EJERCICIO.escriturasEnlazada(200) + " escrituras: multiplicar n por 10 multiplica por 100 el trabajo de una y por 10 el de la otra.";
      } else if (a === esperadoA) {
        ver.className = "veredicto mal";
        ver.textContent = "Las movidas están bien. La enlazada escribe dos punteros por inserción, el del nodo nuevo y la cabeza, y no depende de cuántos elementos haya.";
      } else if (a === 400 || a === 200) {
        ver.className = "veredicto mal";
        ver.textContent = "La primera inserción no mueve nada y la vigésima mueve 19: los sumandos van de 0 a 19, no 20 veces lo mismo.";
      } else if (a === 210) {
        ver.className = "veredicto mal";
        ver.textContent = "La suma va de 0 a n - 1, no de 1 a n: la inserción sobre la lista vacía no corre ningún elemento.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Sume lo que corre cada inserción: 0, 1, 2, ..., 19. Es n(n-1)/2.";
      }
    });
  })();
}
