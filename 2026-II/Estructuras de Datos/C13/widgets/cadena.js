/* Ejercicio interactivo: string (clase 13). */
var EJERCICIO = (function () {
  var CASOS = [
    { id: "reves", texto: "alReves(\"anilina\") == \"anilina\"", tipo: "bool" },
    { id: "menor", texto: "string(\"mapa\") < string(\"mano\")", tipo: "bool" },
    { id: "prefijo", texto: "string(\"cola\") < string(\"colar\")", tipo: "bool" },
    { id: "size", texto: "(string(\"pila\") + \" y cola\").size()", tipo: "int" }
  ];

  function alReves(s) {
    var r = "";
    var i = s.length - 1;
    while (i >= 0) { r = r + s[i]; i = i - 1; }
    return r;
  }

  /* Comparacion de cadenas como la hace string: letra a letra, y el prefijo va antes. */
  function menor(a, b) {
    var i = 0;
    var r = null;
    while (r === null && i < a.length && i < b.length) {
      if (a[i] < b[i]) { r = true; }
      else if (a[i] > b[i]) { r = false; }
      i = i + 1;
    }
    if (r === null) { r = a.length < b.length; }
    return r;
  }

  function respuesta(id) {
    var r = null;
    if (id === "reves") { r = alReves("anilina") === "anilina" ? 1 : 0; }
    else if (id === "menor") { r = menor("mapa", "mano") ? 1 : 0; }
    else if (id === "prefijo") { r = menor("cola", "colar") ? 1 : 0; }
    else { r = ("pila" + " y cola").length; }
    return r;
  }

  return { casos: CASOS, alReves: alReves, menor: menor, respuesta: respuesta };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PISTAS = {
      reves: { bien: "anilina se lee igual al revés: la comparación con == da 1.", mal: "Escriba anilina de atrás hacia adelante y compare letra a letra." },
      menor: { bien: "m = m, a = a, y en la tercera letra p > n: mapa no es menor que mano. Da 0.", mal: "string compara letra a letra desde la primera. Las dos primeras empatan; decide la tercera." },
      prefijo: { bien: "cola es prefijo de colar y el prefijo va antes: da 1.", mal: "Cuando una cadena se acaba y la otra no, la corta va antes: como en el diccionario." },
      size: { bien: "pila tiene 4, y  y cola tiene 7 contando el espacio inicial: 11.", mal: "Cuente también los espacios: \" y cola\" empieza con uno." }
    };
    var logradas = {};
    EJERCICIO.casos.forEach(function (c) {
      logradas[c.id] = false;
      document.getElementById("btn-" + c.id).addEventListener("click", function () {
        var v = document.getElementById("veredicto-" + c.id);
        var dado = parseInt(document.getElementById("pred-" + c.id).value, 10);
        if (dado === EJERCICIO.respuesta(c.id)) {
          v.className = "veredicto bien";
          v.textContent = "Correcto. " + PISTAS[c.id].bien;
          logradas[c.id] = true;
          if (EJERCICIO.casos.every(function (k) { return logradas[k.id]; })) {
            document.getElementById("carta-cierre").style.display = "block";
          }
        } else {
          v.className = "veredicto mal";
          v.textContent = PISTAS[c.id].mal;
        }
      });
    });
  })();
}
