/* Ejercicio interactivo: vector (clase 13). */
var EJERCICIO = (function () {
  var OPERACIONES = [
    ["push_back", 3], ["push_back", 9], ["insert", 1, 6], ["push_back", 4], ["erase", 0], ["set", 2, 1]
  ];

  /* Aplica las operaciones sobre un vector vacio y devuelve el estado tras cada una. */
  function simular(ops) {
    var v = [];
    var estados = [];
    ops.forEach(function (op) {
      if (op[0] === "push_back") { v.push(op[1]); }
      else if (op[0] === "insert") { v.splice(op[1], 0, op[2]); }
      else if (op[0] === "erase") { v.splice(op[1], 1); }
      else { v[op[1]] = op[2]; }
      estados.push(v.slice());
    });
    return { final: v.slice(), estados: estados };
  }

  /* Que responde cada acceso fuera de rango. */
  var ACCESO = { at: "excepcion", corchetes: "cualquiera" };

  /* Paso por valor: el vector de main no cambia. */
  var PASO = { original: [2, 4, 6], tamanoTrasCopia: 3, tamanoTrasReferencia: 4 };

  return { operaciones: OPERACIONES, simular: simular, acceso: ACCESO, paso: PASO };
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

    pintarCodigo("codigo-ops", [
      ["vector<int> v;", ""],
      ["v.push_back(3);", "bloque-1"],
      ["v.push_back(9);", "bloque-1"],
      ["v.insert(v.begin() + 1, 6);", "bloque-2"],
      ["v.push_back(4);", "bloque-1"],
      ["v.erase(v.begin() + 0);", "bloque-2"],
      ["v[2] = 1;", "bloque-3"],
      ["imprimir(v);", ""],
      ["printf(\"%d\\n\", (int) v.size());", ""]
    ]);

    pintarCodigo("codigo-at", [
      ["vector<int> v = {5, 1, 8};   // size 3", ""],
      ["printf(\"%d\\n\", v.at(3));", "bloque-2"]
    ]);
    pintarCodigo("codigo-corchetes", [
      ["vector<int> v = {5, 1, 8};   // size 3", ""],
      ["printf(\"%d\\n\", v[3]);", "bloque-2"]
    ]);

    pintarCodigo("codigo-paso", [
      ["void agregarCero(vector<int> v) {", "bloque-1"],
      ["  v.push_back(0);", ""],
      ["}", ""],
      ["", ""],
      ["int main() {", ""],
      ["  vector<int> v = {2, 4, 6};", ""],
      ["  agregarCero(v);", ""],
      ["  printf(\"%d\\n\", (int) v.size());", "bloque-2"],
      ["  return 0;", ""],
      ["}", ""]
    ]);

    var logradas = { ops: false, at: false, corchetes: false, paso: false };
    function revisar() {
      if (logradas.ops && logradas.at && logradas.corchetes && logradas.paso) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    function leerLista(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }

    /* --- Carta 1: operaciones ------------------------------------- */
    document.getElementById("btn-ops").addEventListener("click", function () {
      var v = document.getElementById("veredicto-ops");
      var r = EJERCICIO.simular(EJERCICIO.operaciones);
      var dada = leerLista(document.getElementById("pred-ops").value);
      var n = parseInt(document.getElementById("pred-ops-n").value, 10);
      if (iguales(dada, r.final) && n === r.final.length) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: < 6 9 1 > con tamaño 3. El insert en la posición 1 corrió al 9; el erase de la posición 0 corrió todo a la izquierda, y v[2] ya era el 4.";
        logradas.ops = true;
        document.getElementById("tabla-ops").style.display = "block";
        var cuerpo = document.getElementById("cuerpo-ops");
        r.estados.forEach(function (e, i) {
          var fila = document.createElement("tr");
          var op = EJERCICIO.operaciones[i];
          var texto = op[0] === "set" ? "v[" + op[1] + "] = " + op[2] : op[0] + "(" + op.slice(1).join(", ") + ")";
          [texto, "< " + e.join(" ") + " >"].forEach(function (c) {
            var td = document.createElement("td");
            td.textContent = c;
            fila.appendChild(td);
          });
          cuerpo.appendChild(fila);
        });
        revisar();
      } else if (iguales(dada, [6, 9, 4]) || iguales(dada, [3, 6, 9, 1])) {
        v.className = "veredicto mal";
        v.textContent = "Revise qué posición ocupa cada elemento después del erase: al quitar la posición 0, el 4 que estaba en la 3 pasa a la 2, y v[2] = 1 lo reemplaza.";
      } else if (iguales(dada, [3, 6, 9, 4]) || (dada.length === 4)) {
        v.className = "veredicto mal";
        v.textContent = "Falta aplicar el erase: erase(v.begin() + 0) quita el primer elemento, como eliminar(0).";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Es la traza del TAD Lista con otros nombres: push_back es agregar, insert(begin + p, e) es insertar(p, e), erase(begin + p) es eliminar(p).";
      }
    });

    /* --- Cartas 2 y 3: at y corchetes ----------------------------- */
    var MENSAJES_AT = {
      excepcion: null,
      basura: "Ese es el comportamiento de [], no de at. at comprueba el rango y detiene el programa con out_of_range.",
      cero: "at no inventa valores: comprueba 3 < size() y, como falla, lanza out_of_range y el programa termina."
    };
    document.querySelectorAll("#opciones-at button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-at");
        var m = MENSAJES_AT[boton.dataset.op];
        if (m === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto: termina con std::out_of_range y un mensaje que dice el índice (3) y el tamaño (3). Es el assert de lista.h, puesto por la biblioteca.";
          logradas.at = true;
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = m;
        }
      });
    });
    var MENSAJES_CORCHETES = {
      excepcion: "[] no comprueba nada: no hay excepción. Lee la memoria que sigue al vector, sea lo que sea.",
      cualquiera: null,
      cero: "No hay ninguna regla que ponga un 0 ahí. Puede salir 0, puede salir cualquier número, puede caerse más adelante."
    };
    document.querySelectorAll("#opciones-corchetes button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-corchetes");
        var m = MENSAJES_CORCHETES[boton.dataset.op];
        if (m === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto: [] no vigila. Compila, corre, imprime lo que haya en esa memoria y sigue. Por eso [] va dentro de ciclos que ya aseguraron el rango, y at donde no se sabe.";
          logradas.corchetes = true;
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = m;
        }
      });
    });

    /* --- Carta 4: paso por valor ---------------------------------- */
    document.getElementById("btn-paso").addEventListener("click", function () {
      var v = document.getElementById("veredicto-paso");
      var n = parseInt(document.getElementById("pred-paso").value, 10);
      if (n === EJERCICIO.paso.tamanoTrasCopia) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 3. Sin &, agregarCero recibió una copia completa de {2, 4, 6}, le agregó el 0 a la copia, y la copia murió al volver. Con vector<int> &v imprimiría 4.";
        logradas.paso = true;
        revisar();
      } else if (n === EJERCICIO.paso.tamanoTrasReferencia) {
        v.className = "veredicto mal";
        v.textContent = "Sería 4 si el parámetro fuera vector<int> &v. Sin el &, la función trabaja sobre una copia.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "El vector de main tenía 3 elementos. Decida si agregarCero lo tocó o tocó una copia.";
      }
    });
  })();
}
