/* Ejercicio interactivo: lo que cobra cada forma de tener una pila (clase 17). */
var EJERCICIO = (function () {
  var CAPACIDAD = 500;
  var INTENTOS = 20000;
  var BYTES_NODO = 16;
  var LINEAS = [
    ["const int CAPACIDAD = 500;", ""],
    ["", ""],
    ["// La pila de arreglo no puede crecer mas alla de su capacidad.", ""],
    ["// Devuelve cuantos elementos alcanzo a apilar.", ""],
    ["int cabenEnElArreglo(int intentos) {", ""],
    ["  int n = 0;", "bloque-1"],
    ["  int k = 0;", "bloque-1"],
    ["  while (k < intentos) {", "bloque-1"],
    ["    if (n < CAPACIDAD) {", "bloque-1"],
    ["      n = n + 1;", "bloque-1"],
    ["    }", "bloque-1"],
    ["    k = k + 1;", "bloque-1"],
    ["  }", "bloque-1"],
    ["  return n;", ""],
    ["}", ""],
    ["", ""],
    ["// la enlazada pide su nodo cada vez y no tiene techo", ""],
    ["Nodo *nuevo = new Nodo;", "bloque-2"],
    ["long bytes = (long) p.tamano() * (long) sizeof(Nodo);", "bloque-2"]
  ];

  /* El mismo ciclo del programa de la sesion: el intento que no cabe no
     aumenta el contador. */
  function cabenEnElArreglo(intentos, capacidad) {
    var n = 0;
    var k = 0;
    while (k < intentos) {
      if (n < capacidad) {
        n = n + 1;
      }
      k = k + 1;
    }
    return n;
  }

  /* La enlazada no tiene techo: entra todo lo que se intente. */
  function cabenEnLaEnlazada(intentos) {
    return intentos;
  }

  /* La memoria de los nodos, en KiB enteros como la imprime el programa. */
  function memoriaKiB(nodos, bytesPorNodo) {
    return Math.floor(nodos * bytesPorNodo / 1024);
  }

  /* La implementacion que conviene a cada perfil. El perfil abierto tiene dos
     respuestas validas: las dos que no tienen techo y dan Theta(1). */
  var PERFILES = {
    techo: ["arreglo"],
    abierto: ["enlazada", "nodos"],
    millones: ["enlazada"]
  };

  return { capacidad: CAPACIDAD, intentos: INTENTOS, bytesNodo: BYTES_NODO,
           lineas: LINEAS, perfiles: PERFILES,
           cabenEnElArreglo: cabenEnElArreglo,
           cabenEnLaEnlazada: cabenEnLaEnlazada, memoriaKiB: memoriaKiB };
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
    var logradas = { techo: false, abierto: false, millones: false, cuentas: false };
    function revisar() {
      if (logradas.techo && logradas.abierto && logradas.millones && logradas.cuentas) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    function conectar(grupo, clave, mensajes) {
      document.querySelectorAll("#" + grupo + " button").forEach(function (boton) {
        boton.addEventListener("click", function () {
          var ver = document.getElementById("veredicto-" + clave);
          var op = boton.dataset.op;
          if (EJERCICIO.perfiles[clave].indexOf(op) !== -1) {
            ver.className = "veredicto bien";
            ver.textContent = mensajes[op];
            logradas[clave] = true; revisar();
          } else {
            ver.className = "veredicto mal";
            ver.textContent = mensajes[op];
          }
        });
      });
    }

    conectar("opciones-techo", "techo", {
      arreglo: "Correcto: el arreglo con tope. Con la cota conocida, CAPACIDAD = 200 basta y las tres operaciones son Θ(1). Guarda 200 enteros y nada más: la enlazada guardaría además 200 punteros, el triple de memoria para los mismos datos.",
      listaarreglo: "También reserva las 200 casillas y tampoco paga punteros, pero pone el tope en la posición 0: cada apilar corre los elementos que ya están y cada desapilar los devuelve. Es el mismo espacio por Θ(n) de tiempo.",
      enlazada: "Funciona y es Θ(1), pero cada elemento paga su dato más un puntero, y en un equipo con memoria escasa eso es el doble o el triple de lo que ocupa el arreglo. Lo que compra la enlazada es no tener techo, y aquí el techo ya se conoce.",
      nodos: "Da lo mismo que la enlazada en memoria: un puntero por elemento. Se escribe cuando no se sabe cuántos elementos llegan, y aquí el enunciado ya lo dice."
    });

    conectar("opciones-abierto", "abierto", {
      arreglo: "CAPACIDAD se fija al compilar y el assert detiene el programa en el elemento que no cabe. Sin cota, no hay número que escribir ahí: cualquiera que se ponga puede quedar corto.",
      listaarreglo: "Arrastra el mismo techo del arreglo y además cobra Θ(n) por operación. Es la peor de las cuatro para este perfil.",
      enlazada: "Correcto: la enlazada con el tope al frente. Cada elemento pide su nodo cuando llega, así que el límite lo pone la memoria disponible y no una constante del código, y las tres operaciones siguen en Θ(1). La directa sobre nodos también vale: hace lo mismo sin el salto de llamada.",
      nodos: "Correcto: la directa sobre nodos. Crece mientras haya memoria y las tres operaciones son Θ(1). La enlazada con el tope al frente también vale y reutiliza la lista que ya está escrita y probada; esta se escribe cuando no se va a usar nada más de la lista."
    });

    conectar("opciones-millones", "millones", {
      enlazada: "Correcto: la pila sobre el TAD Lista. Son seis llamadas que usan la lista que ya está ahí, con el tope en la posición 0: Θ(1) en las tres y sin tocar un solo puntero.",
      nodos: "Funciona y cuesta lo mismo por operación, pero exige copiar los elementos a una cadena nueva y volver a escribir el new, el delete y el destructor. El perfil pide justamente no hacer eso.",
      arreglo: "Obliga a copiar los elementos a un arreglo y devuelve el techo de CAPACIDAD que la lista no tenía.",
      listaarreglo: "Esa es la combinación cara: con el tope en la posición 0 de una lista sobre arreglo, cada apilar corre todos los elementos. Además la lista que ya existe es enlazada, no de arreglo."
    });

    pintarCodigo("codigo-techo", EJERCICIO.lineas);

    document.getElementById("btn-techo").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-cuentas");
      var ea = EJERCICIO.cabenEnElArreglo(EJERCICIO.intentos, EJERCICIO.capacidad);
      var ee = EJERCICIO.cabenEnLaEnlazada(EJERCICIO.intentos);
      var em = EJERCICIO.memoriaKiB(ee, EJERCICIO.bytesNodo);
      var a = parseInt(document.getElementById("pred-arreglo").value, 10);
      var e = parseInt(document.getElementById("pred-enlazada").value, 10);
      var m = parseInt(document.getElementById("pred-memoria").value, 10);
      if (a === ea && e === ee && m === em) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + ea + ", " + ee + " y " + em + " KiB. El arreglo se queda en CAPACIDAD y los 19500 intentos que siguen no entran. La enlazada admite los 20000 y cada nodo ocupa " + EJERCICIO.bytesNodo + " bytes: 4 del entero, 8 del puntero y 4 de relleno para que el puntero quede alineado. Son " + (ee * EJERCICIO.bytesNodo) + " bytes, que dividido por 1024 da " + em + " KiB.";
        logradas.cuentas = true; revisar();
        var nota = document.getElementById("nota-cuentas");
        nota.style.display = "block";
        nota.textContent = "El dato es la cuarta parte de lo que se guarda: los 20000 enteros son " + Math.floor(ee * 4 / 1024) + " KiB y el resto son punteros y relleno. El arreglo no paga nada de eso, y a cambio reserva sus " + EJERCICIO.capacidad + " casillas aunque la pila esté vacía.";
      } else if (a === EJERCICIO.intentos) {
        ver.className = "veredicto mal";
        ver.textContent = "El arreglo no admite los 20000: el if (n < CAPACIDAD) deja de aumentar el contador cuando llega a " + EJERCICIO.capacidad + ", y los intentos que siguen pasan sin efecto.";
      } else if (a === ea && e === ee && m === 320) {
        ver.className = "veredicto mal";
        ver.textContent = "Un KiB son 1024 bytes, no 1000: " + (ee * EJERCICIO.bytesNodo) + " entre 1024 da " + em + " con la división entera.";
      } else if (a === ea && e === ee && m === Math.floor(ee * 12 / 1024)) {
        ver.className = "veredicto mal";
        ver.textContent = "Un Nodo no ocupa 12 bytes: el compilador agrega 4 de relleno para que el puntero de 8 quede en una dirección múltiplo de 8. Son " + EJERCICIO.bytesNodo + " bytes por nodo.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "El arreglo se detiene en CAPACIDAD, la enlazada admite todo lo que se intente, y la memoria es el número de nodos por lo que ocupa un Nodo, dividido por 1024.";
      }
    });
  })();
}
