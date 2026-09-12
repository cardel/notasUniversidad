/* Ejercicio interactivo: combinado (clase 5). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int combinado(int datos[], int n) {",             num: null },
    { txt: "    int mayor = datos[0];",                       num: 1,  bloque: 1 },
    { txt: "    int i = 1;",                                  num: 2,  bloque: 1 },
    { txt: "    while (i < n) {",                             num: 3,  bloque: 1 },
    { txt: "        if (datos[i] > mayor) {",                 num: 4,  bloque: 1 },
    { txt: "            mayor = datos[i];",                   num: 5,  bloque: 1 },
    { txt: "        }",                                       num: null, bloque: 1 },
    { txt: "        i = i + 1;",                              num: 6,  bloque: 1 },
    { txt: "    }",                                           num: null, bloque: 1 },
    { txt: "    int parejas = 0;",                            num: 7,  bloque: 2 },
    { txt: "    i = 0;",                                      num: 8,  bloque: 2 },
    { txt: "    while (i < n) {",                             num: 9,  bloque: 2 },
    { txt: "        int j = i + 1;",                          num: 10, bloque: 2 },
    { txt: "        while (j < n) {",                         num: 11, bloque: 2 },
    { txt: "            if (datos[i] + datos[j] > mayor) {",  num: 12, bloque: 2 },
    { txt: "                parejas = parejas + 1;",          num: 13, bloque: 2 },
    { txt: "            }",                                   num: null, bloque: 2 },
    { txt: "            j = j + 1;",                          num: 14, bloque: 2 },
    { txt: "        }",                                       num: null, bloque: 2 },
    { txt: "        i = i + 1;",                              num: 15, bloque: 2 },
    { txt: "    }",                                           num: null, bloque: 2 },
    { txt: "    int pasos = 0;",                              num: 16, bloque: 3 },
    { txt: "    int valor = 1;",                              num: 17, bloque: 3 },
    { txt: "    while (valor <= n) {",                        num: 18, bloque: 3 },
    { txt: "        pasos = pasos + 1;",                      num: 19, bloque: 3 },
    { txt: "        valor = valor * 2;",                      num: 20, bloque: 3 },
    { txt: "    }",                                           num: null, bloque: 3 },
    { txt: "    return parejas + pasos;",                     num: 21 }
  ];

  var BASE = [4, 7, 3, 1, 8, 5, 2, 6];

  function generarDatos(n) {
    var datos = [];
    var i;
    for (i = 0; i < n; i = i + 1) { datos.push(BASE[i % 8]); }
    return datos;
  }

  function simular(params) {
    var n = params.n;
    var datos = generarDatos(n);
    var lista = [];
    var mayor = null, i = null, j = null, parejas = null, pasos = null, valor = null;
    function snap(linea) {
      lista.push({
        linea: linea, i: i, j: j, mayor: mayor,
        parejas: parejas, valor: valor, pasos: pasos
      });
    }
    mayor = datos[0]; snap(1);
    i = 1; snap(2);
    var b1 = true;
    while (b1) {
      snap(3);
      if (i < n) {
        snap(4);
        if (datos[i] > mayor) { mayor = datos[i]; snap(5); }
        i = i + 1; snap(6);
      } else {
        b1 = false;
      }
    }
    parejas = 0; snap(7);
    i = 0; snap(8);
    var b2 = true;
    while (b2) {
      snap(9);
      if (i < n) {
        j = i + 1; snap(10);
        var interno = true;
        while (interno) {
          snap(11);
          if (j < n) {
            snap(12);
            if (datos[i] + datos[j] > mayor) { parejas = parejas + 1; snap(13); }
            j = j + 1; snap(14);
          } else {
            interno = false;
          }
        }
        i = i + 1; snap(15);
      } else {
        b2 = false;
      }
    }
    pasos = 0; snap(16);
    valor = 1; snap(17);
    var b3 = true;
    while (b3) {
      snap(18);
      if (valor <= n) {
        pasos = pasos + 1; snap(19);
        valor = valor * 2; snap(20);
      } else {
        b3 = false;
      }
    }
    snap(21);
    return lista;
  }

  /* Total de lineas ejecutadas por bloque, sin guardar los pasos
     (sirve para n grandes). */
  function totalesBloques(n) {
    var lista = simularLiviano(n);
    return lista;
  }

  function simularLiviano(n) {
    var datos = generarDatos(n);
    var t1 = 0, t2 = 0, t3 = 0;
    var mayor = datos[0]; t1 = t1 + 1;
    var i = 1; t1 = t1 + 1;
    var b1 = true;
    while (b1) {
      t1 = t1 + 1;
      if (i < n) {
        t1 = t1 + 1;
        if (datos[i] > mayor) { mayor = datos[i]; t1 = t1 + 1; }
        i = i + 1; t1 = t1 + 1;
      } else {
        b1 = false;
      }
    }
    var parejas = 0; t2 = t2 + 1;
    i = 0; t2 = t2 + 1;
    var b2 = true;
    while (b2) {
      t2 = t2 + 1;
      if (i < n) {
        var j = i + 1; t2 = t2 + 1;
        var interno = true;
        while (interno) {
          t2 = t2 + 1;
          if (j < n) {
            t2 = t2 + 1;
            if (datos[i] + datos[j] > mayor) { parejas = parejas + 1; t2 = t2 + 1; }
            j = j + 1; t2 = t2 + 1;
          } else {
            interno = false;
          }
        }
        i = i + 1; t2 = t2 + 1;
      } else {
        b2 = false;
      }
    }
    var pasos = 0; t3 = t3 + 1;
    var valor = 1; t3 = t3 + 1;
    var b3 = true;
    while (b3) {
      t3 = t3 + 1;
      if (valor <= n) {
        pasos = pasos + 1; t3 = t3 + 1;
        valor = valor * 2; t3 = t3 + 1;
      } else {
        b3 = false;
      }
    }
    return { t1: t1, t2: t2, t3: t3, resultado: parejas + pasos };
  }

  return {
    codigo: CODIGO, simular: simular,
    generarDatos: generarDatos, totalesBloques: totalesBloques
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var RANGOS = { 1: [1, 6], 2: [7, 15], 3: [16, 20] };
    var resueltaBloque = false;
    var NOMBRES = {
      1: "Bloque 1: el mayor",
      2: "Bloque 2: las parejas",
      3: "Bloque 3: duplicar"
    };

    function sumarBloque(conteos, bloque) {
      var total = 0;
      var num;
      for (num = RANGOS[bloque][0]; num <= RANGOS[bloque][1]; num = num + 1) {
        total = total + (conteos[num] || 0);
      }
      return total;
    }

    function alPintar(e) {
      var n = e.params.n;
      var finales = EJERCICIO.totalesBloques(n);
      var ejecutados = {
        1: sumarBloque(e.conteos, 1),
        2: sumarBloque(e.conteos, 2),
        3: sumarBloque(e.conteos, 3)
      };
      var escala = Math.max(finales.t1, finales.t2, finales.t3);

      var panel = document.getElementById("panel-barras");
      panel.innerHTML = "";
      [1, 2, 3].forEach(function (b) {
        var fila = document.createElement("div");
        fila.className = "barra-fila";
        var rot = document.createElement("span");
        rot.className = "rotulo";
        rot.textContent = NOMBRES[b];
        var pista = document.createElement("div");
        pista.className = "pista-barra";
        var barra = document.createElement("div");
        barra.className = "barra b" + b;
        barra.style.width = (escala > 0 ? (ejecutados[b] / escala) * 100 : 0) + "%";
        pista.appendChild(barra);
        var val = document.createElement("span");
        val.className = "valor";
        val.textContent = ejecutados[b];
        fila.appendChild(rot);
        fila.appendChild(pista);
        fila.appendChild(val);
        panel.appendChild(fila);
      });

      var mensaje = document.getElementById("mensaje-barras");
      if (e.terminado) {
        var totalTodos = ejecutados[1] + ejecutados[2] + ejecutados[3] + 1;
        mensaje.innerHTML = "Con n = " + n + ", el bloque 2 puso <b>" + ejecutados[2] +
          "</b> de los " + totalTodos + " pasos. Suba n y mire cómo se agranda esa ventaja.";
      } else {
        mensaje.textContent = "";
      }

      var cuerpoGrandes = document.getElementById("cuerpo-grandes");
      cuerpoGrandes.innerHTML = "";
      [10, 100, 1000].forEach(function (ene) {
        var t = EJERCICIO.totalesBloques(ene);
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + ene + "</td><td>" + t.t1 + "</td><td><b>" +
          t.t2 + "</b></td><td>" + t.t3 + "</td>";
        cuerpoGrandes.appendChild(tr);
      });
      var notaGrandes = document.getElementById("nota-grandes");
      if (resueltaBloque) {
        notaGrandes.textContent = "El bloque 1 es lineal, el bloque 2 cuadrático y el " +
          "bloque 3 logarítmico. El más costoso decide el nombre del crecimiento: esta " +
          "función es O(n²), aunque dos de sus tres bloques sean baratos.";
      } else {
        notaGrandes.textContent = "Compare cómo crece cada columna al multiplicar n por 10 " +
          "y responda la pregunta de la tarjeta 1.";
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "j", rotulo: "j" },
        { campo: "mayor", rotulo: "mayor" },
        { campo: "parejas", rotulo: "parejas", clase: "cuenta" },
        { campo: "pasos", rotulo: "pasos", clase: "cuenta" }
      ],
      paramsIniciales: { n: 6 },
      alPintar: alPintar
    });
    document.getElementById("ver-datos").textContent =
      "{" + EJERCICIO.generarDatos(6).join(", ") + "}";

    Array.prototype.forEach.call(document.querySelectorAll(".opciones button"), function (b) {
      b.addEventListener("click", function () {
        var eleccion = b.getAttribute("data-b");
        var v = document.getElementById("veredicto");
        if (eleccion === "2") {
          resueltaBloque = true;
          v.className = "veredicto bien";
          v.textContent = "Correcto: los dos ciclos anidados del bloque 2 crecen con n². " +
            "Los otros dos crecen con n y con log n: el cuadrático termina mandando. " +
            "Compruébelo con las barras y con la tabla de abajo.";
          Motor.repintar();
        } else if (eleccion === "1") {
          v.className = "veredicto mal";
          v.textContent = "El bloque 1 es lineal: un solo ciclo. Crece, pero el bloque de " +
            "las parejas tiene dos ciclos anidados y lo alcanza en seguida. Mire la tabla con n = 100.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "El bloque 3 es el más barato: duplicar el valor llega a n en " +
            "unas pocas vueltas (crecimiento logarítmico). Mire la tabla con n = 1000.";
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-analisis button"), function (b) {
      b.addEventListener("click", function () {
        var v = document.getElementById("veredicto-analisis");
        var op = b.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: los bloques van en secuencia, así que se suman: " +
            "(4n − 1) + (2n² + 2n + 3) + (3⌊log₂ n⌋ + 6) + 1. El término que manda es " +
            "n²: la función es O(n²).";
        } else if (op === "multiplica") {
          v.className = "veredicto mal";
          v.textContent = "Multiplicó los bloques, pero van uno después de otro, no uno " +
            "adentro de otro: los conteos en secuencia se suman.";
        } else if (op === "sinquad") {
          v.className = "veredicto mal";
          v.textContent = "Olvidó el bloque de las parejas, que es justamente el más caro. " +
            "Mire las barras: con n = 6 ya es el que más aporta.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "n² es el nombre del crecimiento, no el conteo. La pregunta pide " +
            "la fórmula completa, con todos los términos.";
        }
      });
    });

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      var n = parseInt(ev.target.value, 10);
      document.getElementById("ver-n").textContent = n;
      document.getElementById("ver-datos").textContent =
        "{" + EJERCICIO.generarDatos(n).join(", ") + "}";
      var v = document.getElementById("veredicto");
      v.className = "veredicto";
      v.textContent = "";
      Motor.reiniciar({ n: n });
    });
  })();
}
