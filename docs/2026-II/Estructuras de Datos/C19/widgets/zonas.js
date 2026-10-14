/* Ejercicio interactivo: qué está mal en cada estado anotado de particionar (clase 19). */
var EJERCICIO = (function () {
  var ORIGINAL = [6, 1, 7, 3, 8, 2, 4];
  var INI = 0;
  var FIN = 6;

  /* Estados que alguien anotó al seguir particionar(a, 0, 6) sobre ORIGINAL,
     cada uno al revisar la condición del while. */
  var ESTADOS = [
    { i: 0, j: 3, a: [1, 6, 7, 3, 8, 2, 4] },
    { i: 1, j: 3, a: [1, 6, 7, 3, 8, 2, 4] },
    { i: 0, j: 4, a: [1, 6, 3, 7, 8, 2, 4] },
    { i: 1, j: 4, a: [1, 3, 7, 6, 4, 2, 8] },
    { i: 1, j: 4, a: [1, 3, 7, 7, 8, 2, 4] },
    { i: 2, j: 2, a: [1, 3, 2, 6, 8, 7, 4] }
  ];

  var CATEGORIAS = ["correcto", "mayor-en-menores", "menor-en-mayores",
                    "indices", "pivote", "valores"];

  function ordenados(v) {
    return v.slice().sort(function (u, w) { return u - w; }).join(",");
  }

  /* Lista de lo que el estado describe mal, con las mismas zonas del ciclo. */
  function problemas(estado, original, ini, fin) {
    var x = original[fin];
    var a = estado.a;
    var i = estado.i;
    var j = estado.j;
    var lista = [];
    var k = ini;
    var bien = true;
    while (k <= i) {
      if (a[k] > x) { bien = false; }
      k = k + 1;
    }
    if (!bien) { lista.push("mayor-en-menores"); }
    k = i + 1;
    bien = true;
    while (k <= j - 1) {
      if (a[k] <= x) { bien = false; }
      k = k + 1;
    }
    if (!bien) { lista.push("menor-en-mayores"); }
    if (!(ini - 1 <= i && i < j && j <= fin)) { lista.push("indices"); }
    if (a[fin] !== x) { lista.push("pivote"); }
    if (ordenados(a) !== ordenados(original)) { lista.push("valores"); }
    return lista;
  }

  /* La respuesta de cada estado: "correcto" o lo único que está mal. */
  function respuestas() {
    return ESTADOS.map(function (e) {
      var p = problemas(e, ORIGINAL, INI, FIN);
      return p.length === 0 ? "correcto" : p.join(" ");
    });
  }

  /* Zona de la casilla k según los i y j anotados. */
  function zona(k, i, j, fin) {
    var z = "sin";
    if (k === fin) { z = "pivote"; }
    else if (k <= i) { z = "menor"; }
    else if (k <= j - 1) { z = "mayor"; }
    return z;
  }

  return { original: ORIGINAL, ini: INI, fin: FIN, estados: ESTADOS,
           categorias: CATEGORIAS, problemas: problemas,
           respuestas: respuestas, zona: zona };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var RESP = EJERCICIO.respuestas();
    var ETIQUETA = {
      "correcto": "El estado es correcto",
      "mayor-en-menores": "Un valor mayor que el pivote quedó en la zona de menores o iguales",
      "menor-en-mayores": "Un valor menor o igual que el pivote quedó en la zona de mayores",
      "indices": "i quedó delante de j, o en la misma casilla",
      "pivote": "El pivote se movió antes de tiempo",
      "valores": "Se perdió o se duplicó un valor"
    };
    var EXPLICA = [
      {
        bien: "Correcto. La zona verde tiene el 1, la naranja el 6 y el 7, el 4 sigue en la última casilla y están los siete valores del principio. Es el estado real después de la tercera vuelta.",
        "mayor-en-menores": "La zona de menores o iguales es solo la casilla 0, con el 1, que no supera a 4.",
        "menor-en-mayores": "La zona de mayores son las casillas 1 y 2, con el 6 y el 7: los dos superan a 4.",
        "indices": "i = 0 está detrás de j = 3, como debe ser.",
        otro: "Revise cada zona con i = 0 y j = 3: todo está en su sitio."
      },
      {
        bien: "Correcto. Con i = 1 la zona de menores o iguales abarca las casillas 0 y 1, y en la 1 está el 6. Este estado sale cuando i avanza sin que se haga el cambio con a[j].",
        "menor-en-mayores": "La zona de mayores es solo la casilla 2, con el 7, que supera a 4. El valor fuera de lugar está en la zona verde.",
        "correcto": "Mire la zona verde con i = 1: ¿todos sus valores son menores o iguales que 4?",
        otro: "Mire qué valores quedaron entre ini e i."
      },
      {
        bien: "Correcto. La zona de mayores va de la casilla 1 a la 3 y en la 2 está el 3, que no supera a 4. Cuando j pasó por el 3 debió cambiarlo con el 6, y entonces i habría quedado en 1.",
        "mayor-en-menores": "La zona verde es solo la casilla 0, con el 1. El valor fuera de lugar está en la naranja.",
        "correcto": "Recorra la zona naranja, de i + 1 a j - 1: uno de sus valores no supera al pivote.",
        otro: "Mire los valores entre i + 1 y j - 1 con i = 0 y j = 4."
      },
      {
        bien: "Correcto. En la última casilla hay un 8 y el 4 está en la casilla 4. Dentro del ciclo j nunca llega a fin, así que el pivote solo se mueve en el cambio de después del ciclo.",
        "valores": "Están los siete valores del principio, en otro orden. Lo que cambió es dónde está el 4.",
        "correcto": "Mire la última casilla: ¿sigue ahí el 4?",
        otro: "Mire qué valor ocupa la casilla fin."
      },
      {
        bien: "Correcto. Falta el 6 y el 7 aparece dos veces. Es lo que deja un intercambio escrito sin temporal, que copia un valor encima del otro.",
        "menor-en-mayores": "La zona naranja tiene 7 y 7, los dos mayores que 4. El problema no es de zonas.",
        "correcto": "Compare con los valores del principio, 6, 1, 7, 3, 8, 2, 4: ¿están todos, una vez cada uno?",
        otro: "Cuente cuántas veces aparece cada valor."
      },
      {
        bien: "Correcto. i y j están en la misma casilla, la 2. i empieza una casilla detrás de j y cada vez que avanza también avanza j, así que nunca lo alcanza dentro del ciclo.",
        "menor-en-mayores": "Con i = j = 2 no hay casillas entre i + 1 y j - 1: la zona naranja está vacía.",
        "correcto": "Las zonas que hay están bien, pero mire dónde quedaron i y j.",
        otro: "Compare las posiciones de i y j."
      }
    ];

    function decir(id, bien, texto) {
      var ver = document.getElementById(id);
      ver.className = "veredicto " + (bien ? "bien" : "mal");
      ver.textContent = texto;
    }
    var logradas = RESP.map(function () { return false; });
    function revisar() {
      if (logradas.every(function (b) { return b; })) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    var contenedor = document.getElementById("estados");
    EJERCICIO.estados.forEach(function (e, n) {
      var carta = document.createElement("div");
      carta.className = "carta";
      var h = document.createElement("h2");
      h.textContent = "Estado " + (n + 1) + ": i = " + e.i + ", j = " + e.j;
      carta.appendChild(h);
      var fila = document.createElement("div");
      fila.className = "arreglo fila-arreglo con-marcas";
      e.a.forEach(function (v, k) {
        var cel = document.createElement("div");
        var z = EJERCICIO.zona(k, e.i, e.j, EJERCICIO.fin);
        var clases = "caja fija";
        if (z === "menor") { clases = clases + " zona-menor"; }
        if (z === "mayor") { clases = clases + " zona-mayor"; }
        if (z === "pivote") { clases = clases + " zona-pivote"; }
        cel.className = clases;
        var idx = document.createElement("span");
        idx.className = "indice";
        idx.textContent = k;
        cel.appendChild(idx);
        cel.appendChild(document.createTextNode(v));
        var marcas = [];
        if (k === e.i) { marcas.push("i"); }
        if (k === e.j) { marcas.push("j"); }
        if (marcas.length > 0) {
          var mk = document.createElement("span");
          mk.className = "marca";
          mk.textContent = marcas.join(" ");
          cel.appendChild(mk);
        }
        fila.appendChild(cel);
      });
      carta.appendChild(fila);
      var pregunta = document.createElement("p");
      pregunta.textContent = "¿Qué está mal en este estado?";
      carta.appendChild(pregunta);
      var ops = document.createElement("div");
      ops.className = "opciones";
      var idVer = "veredicto-" + n;
      EJERCICIO.categorias.forEach(function (o) {
        var b = document.createElement("button");
        b.textContent = ETIQUETA[o];
        b.addEventListener("click", function () {
          var ex = EXPLICA[n];
          if (o === RESP[n]) {
            decir(idVer, true, ex.bien);
            logradas[n] = true; revisar();
          } else {
            decir(idVer, false, ex[o] || ex.otro);
          }
        });
        ops.appendChild(b);
      });
      carta.appendChild(ops);
      var ver = document.createElement("div");
      ver.id = idVer;
      ver.className = "veredicto";
      carta.appendChild(ver);
      contenedor.appendChild(carta);
    });
  })();
}
