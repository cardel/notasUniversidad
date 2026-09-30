/* Ejercicio interactivo: los primeros algoritmos (clase 13). */
var EJERCICIO = (function () {
  var PERSONAS = [["Rosa", 21], ["Iván", 19], ["Elena", 21], ["Omar", 19], ["Beto", 23]];
  /* Valores verificados con g++: binary_search sobre {6, 3, 9, 2, 7} sin ordenar. */
  var SIN_ORDEN = { vector: [6, 3, 9, 2, 7], busca3: 0, busca9: 1 };
  var ORDENADO = [4, 8, 15, 16, 23, 42];

  /* Por edad de menor a mayor; en empate, por nombre de la Z a la A. */
  function antes(a, b) {
    var r = false;
    if (a[1] !== b[1]) { r = a[1] < b[1]; } else { r = a[0] > b[0]; }
    return r;
  }
  function ordenar(personas) {
    var v = personas.slice();
    v.sort(function (a, b) { return antes(a, b) ? -1 : (antes(b, a) ? 1 : 0); });
    return v.map(function (p) { return p[0]; });
  }
  /* find: posicion del primero igual, o -1 (end). */
  function find(v, x) {
    var i = 0;
    var r = -1;
    while (r === -1 && i < v.length) {
      if (v[i] === x) { r = i; }
      i = i + 1;
    }
    return r;
  }

  return { personas: PERSONAS, sinOrden: SIN_ORDEN, ordenado: ORDENADO, antes: antes, ordenar: ordenar, find: find };
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
    pintarCodigo("codigo-antes", [
      ["// personas: {Rosa 21} {Iván 19} {Elena 21} {Omar 19} {Beto 23}", ""],
      ["bool antes(Persona a, Persona b) {", ""],
      ["  bool r = false;", ""],
      ["  if (a.edad != b.edad) {", ""],
      ["    r = a.edad < b.edad;", "bloque-1"],
      ["  } else {", ""],
      ["    r = a.nombre > b.nombre;", "bloque-2"],
      ["  }", ""],
      ["  return r;", ""],
      ["}", ""],
      ["sort(g.begin(), g.end(), antes);", "bloque-3"]
    ]);
    pintarCodigo("codigo-bs", [
      ["vector<int> v = {6, 3, 9, 2, 7};   // sin ordenar", ""],
      ["printf(\"%d\\n\", (int) binary_search(v.begin(), v.end(), 3));", "bloque-2"],
      ["printf(\"%d\\n\", (int) binary_search(v.begin(), v.end(), 9));", "bloque-2"]
    ]);
    pintarCodigo("codigo-find", [
      ["vector<int> v = {4, 8, 15, 16, 23, 42};", ""],
      ["vector<int>::iterator it = find(v.begin(), v.end(), 16);", "bloque-1"],
      ["printf(\"%d\\n\", (int) (it - v.begin()));", "bloque-1"],
      ["it = find(v.begin(), v.end(), 5);", "bloque-2"],
      ["printf(\"%s\\n\", it == v.end() ? \"end\" : \"esta\");", "bloque-2"]
    ]);

    var logradas = { orden: false, bs: false, find: false };
    function revisar() {
      if (logradas.orden && logradas.bs && logradas.find) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    function leerNombres(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; })
        .map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase(); });
    }

    document.getElementById("btn-orden").addEventListener("click", function () {
      var v = document.getElementById("veredicto-orden");
      var esperado = EJERCICIO.ordenar(EJERCICIO.personas);
      var dado = leerNombres(document.getElementById("pred-orden").value);
      var igual = dado.length === esperado.length && dado.every(function (x, i) { return x === esperado[i]; });
      if (igual) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: Omar Iván Rosa Elena Beto. Los de 19 van primero, y entre ellos Omar antes que Iván porque el empate se resuelve con > en el nombre: de la Z a la A.";
        logradas.orden = true;
        revisar();
      } else if (dado.join(" ") === "Iván Omar Elena Rosa Beto") {
        v.className = "veredicto mal";
        v.textContent = "Las edades van bien, pero el empate usa a.nombre > b.nombre: va antes el nombre mayor, o sea el que está más cerca de la Z.";
      } else if (dado.length === 5 && dado[0] === "Beto") {
        v.className = "veredicto mal";
        v.textContent = "a.edad < b.edad pone antes al de menor edad. Beto, con 23, va de último.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Primero por edad ascendente; en empate, por nombre descendente. Escriba los cinco nombres en orden.";
      }
    });

    document.getElementById("btn-bs").addEventListener("click", function () {
      var v = document.getElementById("veredicto-bs");
      var b3 = parseInt(document.getElementById("pred-bs3").value, 10);
      var b9 = parseInt(document.getElementById("pred-bs9").value, 10);
      var c = EJERCICIO.sinOrden;
      if (b3 === c.busca3 && b9 === c.busca9) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 0 y 1. Los dos números están en el vector; binary_search pierde el 3 y encuentra el 9 por casualidad. Sin la precondición de orden, la respuesta no significa nada, y no avisa.";
        logradas.bs = true;
        revisar();
      } else if (b3 === 1 && b9 === 1) {
        v.className = "veredicto mal";
        v.textContent = "Los dos están, sí, pero binary_search no recorre: parte por la mitad suponiendo orden. Con {6, 3, 9, 2, 7} la mitad es 9; buscando 3 va hacia la izquierda, donde está el 6, y concluye que no está.";
      } else if (b3 === 0 && b9 === 0) {
        v.className = "veredicto mal";
        v.textContent = "Uno de los dos sí lo encuentra: el 9 está justo en la mitad, y la primera comparación acierta. Que acierte a veces es lo que lo hace peligroso.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Simule la búsqueda binaria sobre el vector tal como está: la mitad es la posición 2, que tiene un 9.";
      }
    });

    document.getElementById("btn-find").addEventListener("click", function () {
      var v = document.getElementById("veredicto-find");
      var p = parseInt(document.getElementById("pred-find16").value, 10);
      var e = document.getElementById("pred-find5").value.trim().toLowerCase();
      var pos = EJERCICIO.find(EJERCICIO.ordenado, 16);
      if (p === pos && e === "end") {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 3 y end. it - v.begin() convierte la posición en índice; y cuando no está, find devuelve v.end(), que no es un elemento sino la marca de después del último.";
        logradas.find = true;
        revisar();
      } else if (p === 4) {
        v.className = "veredicto mal";
        v.textContent = "Las posiciones empiezan en 0: 4 está en la 0, 8 en la 1, 15 en la 2, 16 en la 3.";
      } else if (e !== "end") {
        v.className = "veredicto mal";
        v.textContent = "El 5 no está. find devuelve v.end() y el programa imprime end.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "find recorre desde el principio y se detiene en el primer igual. Cuente desde 0.";
      }
    });
  })();
}
