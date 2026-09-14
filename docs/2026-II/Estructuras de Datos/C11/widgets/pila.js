/* Ejercicio interactivo: TAD Pila (clase 11). */
var EJERCICIO = (function () {
  var OPERACIONES = [["apilar", 5], ["apilar", 2], ["tope"], ["desapilar"], ["apilar", 7], ["apilar", 4], ["desapilar"], ["tope"]];
  var CONTAR = { pila: [4, 9, 4, 4, 1], x: 4 };

  function simular(ops) {
    var p = [];
    var topes = [];
    ops.forEach(function (op) {
      if (op[0] === "apilar") { p.push(op[1]); }
      else if (op[0] === "desapilar") { p.pop(); }
      else { topes.push(p[p.length - 1]); }
    });
    return { topes: topes, tamano: p.length, pila: p.slice() };
  }
  /* Cuenta x dejando la pila como estaba; si restaurar es falso, olvida el segundo ciclo. */
  function contar(pila, x, restaurar) {
    var p = pila.slice();
    var aux = [];
    var c = 0;
    while (p.length > 0) {
      if (p[p.length - 1] === x) { c = c + 1; }
      aux.push(p.pop());
    }
    if (restaurar) { while (aux.length > 0) { p.push(aux.pop()); } }
    return { cuenta: c, pila: p };
  }
  return { operaciones: OPERACIONES, casoContar: CONTAR, simular: simular, contar: contar };
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
    function leerLista(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    pintarCodigo("codigo-ops", [
      ["Pila p;", ""],
      ["p.apilar(5);", "bloque-1"],
      ["p.apilar(2);", "bloque-1"],
      ["printf(\"%d\\n\", p.tope());", "bloque-3"],
      ["p.desapilar();", "bloque-2"],
      ["p.apilar(7);", "bloque-1"],
      ["p.apilar(4);", "bloque-1"],
      ["p.desapilar();", "bloque-2"],
      ["printf(\"%d %d\\n\", p.tope(), p.tamano());", "bloque-3"]
    ]);
    pintarCodigo("codigo-contar", [
      ["int contar(Pila &p, Elemento x) {", ""],
      ["  Pila aux;", ""],
      ["  int c = 0;", ""],
      ["  while (!p.vacia()) {", "bloque-2"],
      ["    if (p.tope() == x) { c = c + 1; }", ""],
      ["    aux.apilar(p.tope());", "bloque-2"],
      ["    p.desapilar();", "bloque-2"],
      ["  }", ""],
      ["  while (!aux.vacia()) {", "bloque-1"],
      ["    p.apilar(aux.tope());", "bloque-1"],
      ["    aux.desapilar();", "bloque-1"],
      ["  }", ""],
      ["  return c;", ""],
      ["}", ""]
    ]);

    var logradas = { ops: false, contar: false, olvido: false };
    function revisar() {
      if (logradas.ops && logradas.contar && logradas.olvido) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-ops").addEventListener("click", function () {
      var v = document.getElementById("veredicto-ops");
      var r = EJERCICIO.simular(EJERCICIO.operaciones);
      var t1 = parseInt(document.getElementById("pred-t1").value, 10);
      var t2 = parseInt(document.getElementById("pred-t2").value, 10);
      var n = parseInt(document.getElementById("pred-n").value, 10);
      if (t1 === r.topes[0] && t2 === r.topes[1] && n === r.tamano) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 2, y después 7 con tamaño 2. El 4 entró y salió; el 5 sigue abajo y nadie lo ha leído.";
        logradas.ops = true;
        revisar();
      } else if (t2 === 4) {
        v.className = "veredicto mal";
        v.textContent = "El 4 fue lo último apilado, sí, pero el desapilar que sigue lo quita. Lea el tope después de ese desapilar.";
      } else if (t2 === 5) {
        v.className = "veredicto mal";
        v.textContent = "El 5 está abajo de todo. Solo se lee el tope, que es lo último que quedó.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Dibuje la pila tras cada línea: apilar pone arriba, desapilar quita lo de arriba, tope lee sin quitar.";
      }
    });

    document.getElementById("btn-contar").addEventListener("click", function () {
      var v = document.getElementById("veredicto-contar");
      var c = EJERCICIO.casoContar;
      var r = EJERCICIO.contar(c.pila, c.x, true);
      var cuenta = parseInt(document.getElementById("pred-cuenta").value, 10);
      var tope = parseInt(document.getElementById("pred-tope").value, 10);
      if (cuenta === r.cuenta && tope === r.pila[r.pila.length - 1]) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: hay tres 4 y el tope sigue siendo 1. El primer ciclo vacía p hacia aux invirtiendo el orden; el segundo lo invierte de nuevo y p queda igual.";
        logradas.contar = true;
        document.getElementById("carta-olvido").style.display = "block";
        revisar();
      } else if (cuenta === r.cuenta) {
        v.className = "veredicto mal";
        v.textContent = "La cuenta va bien. Para el tope, siga el segundo ciclo: aux devuelve los elementos en el orden original.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "El primer ciclo mira cada elemento una vez, del tope hacia abajo, y cuenta los iguales a x.";
      }
    });

    var MENSAJES = {
      igual: "Sin el segundo ciclo nadie devuelve los elementos: se quedan en aux, que muere al terminar la función.",
      vacia: null,
      invertida: "Para que quedara invertida habría que devolver aux a p con un ciclo distinto. Sin ningún ciclo, p queda como la dejó el primero."
    };
    document.querySelectorAll("#opciones-olvido button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-olvido");
        var m = MENSAJES[boton.dataset.op];
        if (m === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto: p queda vacía. La cuenta sale bien (3) y el programa no viola ninguna precondición; el daño aparece después, cuando quien llamó vuelve a usar p.";
          logradas.olvido = true;
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = m;
        }
      });
    });
  })();
}
