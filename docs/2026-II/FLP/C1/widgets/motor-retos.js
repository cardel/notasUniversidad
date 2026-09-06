/* Motor común de los retos de código. Cada página aporta sus retos y este
   archivo los pinta, corre el código del estudiante sobre mini-scheme.js y
   arma el mensaje cuando una prueba falla.

   Un reto es un objeto con: id, titulo, enunciado, gramatica (o null),
   esqueleto, pruebas (llamada y esperado), pistas (una función que recibe la
   llamada que falló, lo esperado y lo obtenido, y devuelve una explicación o
   null) y cierre. */
var MotorRetos = (function () {
  "use strict";

  function correrRetoConCodigo(reto, codigo) {
    var sesion = MiniScheme.nuevaSesion();
    var carga = MiniScheme.correr(codigo, sesion);
    if (carga.error) {
      return { estado: "error", mensaje: "Su código no llegó a correr. " + carga.error };
    }
    for (var i = 0; i < reto.pruebas.length; i++) {
      var p = reto.pruebas[i];
      var r = MiniScheme.evaluarExpresion(p.llamada, sesion);
      if (r.error) {
        return { estado: "error", mensaje: p.llamada + " falló: " + r.error };
      }
      var obtenido = MiniScheme.escribir(r.valor);
      if (obtenido !== p.esperado) {
        return { estado: "falla", llamada: p.llamada, esperado: p.esperado, obtenido: obtenido };
      }
    }
    return { estado: "bien" };
  }

  function pintarReto(reto, alResolver) {
    var carta = document.createElement("div");
    carta.className = "carta";
    var gram = reto.gramatica
      ? '<div class="codigo gramatica">' + reto.gramatica + "</div>"
      : "";
    var marca = reto.opcional ? ' <span class="etiqueta">opcional</span>' : "";
    carta.innerHTML =
      "<h2>" + reto.titulo + marca + "</h2>" +
      "<p>" + reto.enunciado + "</p>" + gram +
      '<div class="casos"></div>' +
      '<textarea class="editor" spellcheck="false" rows="7"></textarea>' +
      '<div class="botones">' +
      '<button class="primario" data-accion="probar">Probar</button>' +
      '<button data-accion="reiniciar">Volver al esqueleto</button>' +
      "</div>" +
      '<div class="veredicto"></div>';

    var casos = carta.querySelector(".casos");
    casos.innerHTML = "<b>Debe cumplir:</b>";
    var ul = document.createElement("ul");
    ul.className = "casos-lista";
    reto.pruebas.forEach(function (p) {
      var li = document.createElement("li");
      li.innerHTML = "<code>" + p.llamada + "</code> → <code>" + p.esperado + "</code>";
      ul.appendChild(li);
    });
    casos.appendChild(ul);

    var editor = carta.querySelector(".editor");
    editor.value = reto.esqueleto;
    var veredicto = carta.querySelector(".veredicto");

    carta.querySelector('[data-accion="reiniciar"]').addEventListener("click", function () {
      editor.value = reto.esqueleto;
      veredicto.className = "veredicto";
    });

    carta.querySelector('[data-accion="probar"]').addEventListener("click", function () {
      if (/\?\?\?/.test(editor.value)) {
        veredicto.className = "veredicto mal";
        veredicto.textContent = "Quedan huecos sin llenar: reemplace cada ??? por una expresión.";
        return;
      }
      var r = correrRetoConCodigo(reto, editor.value);
      if (r.estado === "bien") {
        veredicto.className = "veredicto bien";
        veredicto.textContent = "Pasa las " + reto.pruebas.length + " pruebas. " + reto.cierre;
        alResolver(reto);
        return;
      }
      veredicto.className = "veredicto mal";
      if (r.estado === "error") {
        veredicto.textContent = r.mensaje;
        return;
      }
      var pista = reto.pistas(r.llamada, r.esperado, r.obtenido);
      veredicto.textContent =
        r.llamada + " dio " + r.obtenido + " y debía dar " + r.esperado + "." +
        (pista ? " " + pista : "");
    });

    return carta;
  }

  /* Los retos marcados como opcionales no retienen la carta de cierre: se
     resuelven después, y quien no llegue a ellos igual ve el resumen. */
  function montar(opciones) {
    var resueltos = {};
    var exigidos = opciones.retos.filter(function (r) { return !r.opcional; });

    function alResolver(reto) {
      resueltos[reto.id] = true;
      var faltan = exigidos.some(function (r) { return !resueltos[r.id]; });
      var cierre = document.getElementById(opciones.cierre);
      if (!faltan && cierre) { cierre.style.display = "block"; }
    }

    var destino = document.getElementById(opciones.destino);
    opciones.retos.forEach(function (reto) {
      destino.appendChild(pintarReto(reto, alResolver));
    });
  }

  /* Consola libre, para tantear una idea sin llenar ningún esqueleto. */
  function montarConsola() {
    var consola = document.getElementById("consola-entrada");
    var salida = document.getElementById("consola-salida");
    if (!consola || !salida) { return; }
    var sesionLibre = MiniScheme.nuevaSesion();

    function ejecutar() {
      var r = MiniScheme.correr(consola.value, sesionLibre);
      var lineas = [];
      if (r.salida) { lineas.push(r.salida.replace(/\n$/, "")); }
      if (r.error) {
        lineas.push("Error: " + r.error);
      } else {
        r.valores.forEach(function (v) {
          var t = MiniScheme.escribir(v);
          if (t !== "") { lineas.push(t); }
        });
      }
      salida.textContent = lineas.join("\n") ||
        (consola.value.trim() ? "Listo: la sesión quedó con las definiciones." : "");
      salida.className = "consola-salida" + (r.error ? " con-error" : "");
    }

    document.getElementById("btn-consola").addEventListener("click", ejecutar);
    document.getElementById("btn-limpiar").addEventListener("click", function () {
      sesionLibre = MiniScheme.nuevaSesion();
      salida.textContent = "Sesión reiniciada: se olvidaron las definiciones anteriores.";
      salida.className = "consola-salida";
    });
    consola.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { ejecutar(); }
    });
  }

  return { montar: montar, montarConsola: montarConsola, correr: correrRetoConCodigo };
})();

if (typeof module !== "undefined") { module.exports = MotorRetos; }
