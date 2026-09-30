/* Motor común de los bloques de decisión. Cada página aporta sus bloques y
   este archivo los pinta y califica cada respuesta en el momento.

   Un bloque es un objeto con: id, titulo, definicion (código que encabeza el
   bloque, o null), explicacion, opciones (los rótulos de los botones, en
   orden), items y cierre. Cada item lleva valor (lo que se juzga, admite
   HTML), correcta (el índice de la opción correcta) y razon (la explicación
   que aparece al responder, se acierte o no). Un item puede traer sus propias
   opciones cuando difieren de las del bloque. */
var MotorDecisiones = (function () {
  "use strict";

  function pintarBloque(bloque, alResolver) {
    var carta = document.createElement("div");
    carta.className = "carta";
    var def = bloque.definicion
      ? '<div class="codigo gramatica">' + bloque.definicion + "</div>"
      : "";
    carta.innerHTML =
      "<h2>" + bloque.titulo + "</h2>" + def +
      "<p>" + bloque.explicacion + "</p>" +
      '<div class="lista-items"></div>' +
      '<div class="veredicto"></div>';

    var contenedor = carta.querySelector(".lista-items");
    var veredicto = carta.querySelector(".veredicto");
    var acertados = 0;

    bloque.items.forEach(function (item) {
      var opciones = item.opciones || bloque.opciones;
      var fila = document.createElement("div");
      fila.className = "item";
      var botones = opciones.map(function (rotulo, k) {
        return '<button data-opcion="' + k + '">' + rotulo + "</button>";
      }).join("");
      fila.innerHTML =
        '<span class="valor">' + item.valor + "</span>" +
        '<span class="opciones">' + botones + "</span>" +
        '<span class="marca"></span>' +
        '<span class="razon"></span>';

      var marca = fila.querySelector(".marca");
      var razon = fila.querySelector(".razon");
      var listo = false;

      fila.querySelectorAll("[data-opcion]").forEach(function (boton) {
        boton.addEventListener("click", function () {
          var elegida = Number(boton.getAttribute("data-opcion"));
          var correcto = elegida === item.correcta;
          fila.querySelectorAll("[data-opcion]").forEach(function (b) {
            b.classList.remove("elegido");
          });
          boton.classList.add("elegido");
          marca.textContent = correcto ? "✓" : "✗";
          marca.className = "marca " + (correcto ? "bien" : "mal");
          razon.textContent = item.razon;
          razon.className = "razon " + (correcto ? "bien" : "mal");
          if (correcto && !listo) {
            listo = true;
            acertados++;
            if (acertados === bloque.items.length) {
              veredicto.className = "veredicto bien";
              veredicto.textContent = bloque.cierre;
              alResolver(bloque);
            }
          }
        });
      });

      contenedor.appendChild(fila);
    });

    return carta;
  }

  function montar(opciones) {
    var resueltos = {};

    function alResolver(bloque) {
      resueltos[bloque.id] = true;
      var faltan = opciones.bloques.some(function (b) { return !resueltos[b.id]; });
      var cierre = document.getElementById(opciones.cierre);
      if (!faltan && cierre) { cierre.style.display = "block"; }
    }

    var destino = document.getElementById(opciones.destino);
    opciones.bloques.forEach(function (bloque) {
      destino.appendChild(pintarBloque(bloque, alResolver));
    });
  }

  return { montar: montar };
})();

if (typeof module !== "undefined") { module.exports = MotorDecisiones; }
