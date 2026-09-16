/* Ejercicio interactivo: el costo de recorrer, segun la representacion
   (clase 6). */
var EJERCICIO = (function () {
  /* Operaciones que hace un recorrido completo sobre cada representacion.
     V vertices, E aristas no dirigidas (cada una da dos entradas en la
     lista de adyacencia). */
  function costos(V, E) {
    return {
      lista: V + 2 * E,
      matriz: V * V,
      aristas: V * E
    };
  }

  function aristasDe(V, grado) {
    var g = Math.min(grado, V - 1);
    if (g < 0) { g = 0; }
    return Math.round((V * g) / 2);
  }

  function segundos(ops) {
    return ops / 1e8;
  }

  function comoTiempo(ops) {
    var s = segundos(ops);
    if (s < 0.001) { return "menos de un milisegundo"; }
    if (s < 1) { return Math.round(s * 1000) + " ms"; }
    if (s < 60) { return s.toFixed(1) + " s"; }
    if (s < 3600) { return (s / 60).toFixed(1) + " min"; }
    if (s < 86400) { return (s / 3600).toFixed(1) + " horas"; }
    return (s / 86400).toFixed(1) + " días";
  }

  function conSeparador(n) {
    var t = Math.round(n).toString();
    var salida = "";
    var c = 0;
    var i = t.length - 1;
    while (i >= 0) {
      salida = t.charAt(i) + salida;
      c = c + 1;
      if (c % 3 === 0 && i > 0) { salida = " " + salida; }
      i = i - 1;
    }
    return salida;
  }

  return { costos: costos, aristasDe: aristasDe, comoTiempo: comoTiempo,
           conSeparador: conSeparador, segundos: segundos };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var V = 1000;
    var grado = 4;

    function pintar() {
      var E = EJERCICIO.aristasDe(V, grado);
      var c = EJERCICIO.costos(V, E);
      document.getElementById("valor-v").textContent = EJERCICIO.conSeparador(V);
      document.getElementById("valor-grado").textContent = Math.min(grado, V - 1);
      document.getElementById("valor-e").textContent = EJERCICIO.conSeparador(E);

      var maximo = Math.max(c.lista, c.matriz, c.aristas);
      var filas = [
        ["Lista de adyacencia", "V + 2E", c.lista, "b1"],
        ["Matriz de adyacencia", "V²", c.matriz, "b2"],
        ["Lista de aristas", "V · E", c.aristas, "b3"]
      ];
      var caja = document.getElementById("panel-barras");
      caja.innerHTML = "";
      var i = 0;
      while (i < filas.length) {
        var ancho = Math.max(0.4, (filas[i][2] / maximo) * 100);
        var div = document.createElement("div");
        div.className = "barra-fila";
        div.innerHTML = "<span class='rotulo'>" + filas[i][0] + "<br><small>" +
          filas[i][1] + "</small></span>" +
          "<span class='pista-barra'><span class='barra " + filas[i][3] +
          "' style='width:" + ancho + "%'></span></span>" +
          "<span class='valor'>" + EJERCICIO.conSeparador(filas[i][2]) + "</span>";
        caja.appendChild(div);
        i = i + 1;
      }

      var t = document.getElementById("cuerpo-tiempos");
      t.innerHTML = "";
      i = 0;
      while (i < filas.length) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<td style='text-align:left'>" + filas[i][0] + "</td><td>" +
          EJERCICIO.conSeparador(filas[i][2]) + "</td><td>" +
          EJERCICIO.comoTiempo(filas[i][2]) + "</td>";
        if (EJERCICIO.segundos(filas[i][2]) > 1) { tr.style.background = "var(--rojo-suave)"; }
        t.appendChild(tr);
        i = i + 1;
      }

      var razon = c.matriz / c.lista;
      document.getElementById("panel-razon").innerHTML =
        "La matriz hace <b>" + EJERCICIO.conSeparador(razon) + " veces</b> el " +
        "trabajo de la lista de adyacencia. Con este grado medio, E crece como " +
        "V y la lista se queda en $\\Theta(V)$ mientras la matriz sube como V².";
    }

    document.getElementById("rango-v").addEventListener("input", function () {
      var pot = parseInt(this.value, 10);
      V = Math.round(Math.pow(10, pot / 10));
      pintar();
    });
    document.getElementById("rango-grado").addEventListener("input", function () {
      grado = parseInt(this.value, 10);
      pintar();
    });

    function veredicto(id, ok, texto) {
      var v = document.getElementById(id);
      v.className = ok ? "veredicto bien" : "veredicto mal";
      v.innerHTML = texto;
    }

    document.getElementById("btn-comprobar").addEventListener("click", function () {
      var valor = parseInt(document.getElementById("prediccion").value, 10);
      var E = EJERCICIO.aristasDe(100000, 4);
      var c = EJERCICIO.costos(100000, E);
      var v = document.getElementById("veredicto");
      if (isNaN(valor)) {
        veredicto("veredicto", false, "Escriba un número primero.");
      } else if (valor === 100) {
        veredicto("veredicto", true, "Correcto: " +
          EJERCICIO.conSeparador(c.matriz) + " operaciones, unos " +
          EJERCICIO.comoTiempo(c.matriz) + " a cien millones de operaciones por " +
          "segundo. La lista hace " + EJERCICIO.conSeparador(c.lista) +
          " y termina en " + EJERCICIO.comoTiempo(c.lista) + ".");
      } else if (valor < 100) {
        veredicto("veredicto", false, "Se queda corto. V² con V = 100 000 son " +
          "diez mil millones de posiciones: divida eso por cien millones.");
      } else {
        veredicto("veredicto", false, "Se pasa. Son 100 000 × 100 000 = diez " +
          "mil millones de operaciones, divididas por cien millones por segundo.");
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-v button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-op");
        if (op === "aislados") {
          veredicto("veredicto-v", true, "Correcto: el ciclo externo pasa por " +
            "los V vértices aunque muchos no tengan una sola arista. Sin ese " +
            "término, un grafo de un millón de vértices y ninguna arista " +
            "costaría cero.");
          document.getElementById("paso-1").classList.remove("bloqueado");
        } else if (op === "cola") {
          veredicto("veredicto-v", false, "La cola y la pila guardan a lo sumo " +
            "V vértices, cierto, pero eso es memoria, no operaciones. El término " +
            "V del costo viene de otro lado.");
        } else {
          veredicto("veredicto-v", false, "Marcar es parte de visitar, y visitar " +
            "ya está contado. Piense en un grafo sin ninguna arista: ¿cuánto " +
            "trabajo hay que hacer y de dónde sale?");
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var op = btn.getAttribute("data-p1");
        if (op === "denso") {
          veredicto("veredicto-p1", true, "Correcto: si E es del orden de V², " +
            "entonces V + E también lo es y las dos cuentas se encuentran. La " +
            "matriz deja de ser un desperdicio, y encima contesta en O(1) si " +
            "existe una arista.");
          document.getElementById("paso-1").classList.add("hecho");
        } else {
          veredicto("veredicto-p1", false, "Suba el grado medio en el control de " +
            "arriba y mire las dos barras acercarse. ¿Qué tiene que pasar con E " +
            "para que V + 2E alcance a V²?");
        }
      });
    });

    pintar();
  })();
}
