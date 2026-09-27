/* Pinta el simulador del interpretador: las tres etapas de un programa del
   lenguaje de la sesión, y las tarjetas donde primero se predice el
   resultado y después se compara con lo que hizo el interpretador.

   Las respuestas no están escritas en ningún archivo: se calculan
   ejecutando el interpretador de interprete-lenguaje.js sobre el mismo
   programa que ve el estudiante. */
var MotorSimulador = (function () {
  "use strict";

  var CAMPOS = {
    valor:     { etiqueta: "El valor del programa", leer: function (r) { return r.valor; } },
    evalExp:   { etiqueta: "Llamadas a eval-expression", leer: function (r) { return r.cuenta.evalExp; } },
    applyPrim: { etiqueta: "Llamadas a apply-primitive", leer: function (r) { return r.cuenta.applyPrim; } },
    applyEnv:  { etiqueta: "Búsquedas en el ambiente", leer: function (r) { return r.cuenta.applyEnv; } },
    ambientes: { etiqueta: "Ambientes que se crean", leer: function (r) {
      return r.traza.filter(function (f) { return f.creacion; }).length; } },
    tokens:    { etiqueta: "Tokens que emite el scanner", leer: function (r) { return r.tokens.length; } }
  };

  function elemento(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    return d.firstElementChild;
  }

  /* --- Los tres paneles de una corrida ------------------------------ */
  function panelTokens(r) {
    var filas = r.tokens.map(function (t, i) {
      return "<tr><td>" + (i + 1) + "</td><td><code>" + t.lexema.replace(/</g, "&lt;") +
        "</code></td><td>" + t.clase + "</td></tr>";
    }).join("");
    return '<h3>1. El scanner: ' + r.tokens.length + ' tokens</h3>' +
      '<div class="envoltura-tabla"><table class="tabla-tokens"><thead><tr><th>#</th>' +
      "<th>Lexema</th><th>Clase</th></tr></thead><tbody>" + filas + "</tbody></table></div>";
  }

  function panelArbol(r) {
    var dibujo = (typeof DibujarArbol !== "undefined" && r.arbolTexto)
      ? DibujarArbol.svg(DibujarArbol.desdeTexto(r.arbolTexto))
      : "<code>" + (r.arbolTexto || "") + "</code>";
    return "<h3>2. El parser: el árbol de sintaxis abstracta</h3>" +
      '<figure class="arbol-simulador">' + dibujo + "</figure>" +
      '<pre class="codigo">' + (r.arbolTexto || "") + "</pre>";
  }

  function panelTraza(r) {
    var filas = r.traza.map(function (f, i) {
      if (f.creacion) {
        return '<tr class="fila-creacion"><td></td><td colspan="3">' + f.expresion + "</td></tr>";
      }
      return "<tr><td>" + (i + 1) + '</td><td style="padding-left:' + (0.4 + f.nivel * 0.9) + 'rem">' +
        "<code>" + f.expresion.replace(/</g, "&lt;") + "</code></td><td>" + f.ambiente +
        (f.consulta ? ' <span class="marca-ambiente">busca aquí</span>' : "") +
        "</td><td>" + f.valor + "</td></tr>";
    }).join("");
    return "<h3>3. El interpretador: una fila por llamada a <code>eval-expression</code></h3>" +
      '<div class="envoltura-tabla"><table class="tabla-traza"><thead><tr><th>#</th>' +
      "<th>Expresión</th><th>Ambiente</th><th>Valor</th></tr></thead><tbody>" + filas +
      "</tbody></table></div>" +
      '<p class="conteos"><strong>Valor: ' + r.valor + "</strong> · " +
      r.cuenta.evalExp + " llamadas a <code>eval-expression</code> · " +
      r.cuenta.applyPrim + " a <code>apply-primitive</code> · " +
      r.cuenta.applyEnv + " búsquedas en el ambiente</p>";
  }

  function panelError(r) {
    var donde = { scanner: "el scanner", parser: "el parser", interprete: "el interpretador" };
    return '<div class="veredicto mal">Se detuvo en ' + (donde[r.etapa] || "alguna etapa") +
      ": " + r.error + "</div>" +
      (r.tokens ? panelTokens(r) : "") +
      (r.arbolTexto ? panelArbol(r) : "");
  }

  function proceso(r) {
    if (r.error) { return panelError(r); }
    return panelTokens(r) + panelArbol(r) + panelTraza(r);
  }

  /* --- Tarjeta de predicción ---------------------------------------- */
  function pintarPrediccion(p) {
    var r = InterpreteLenguaje.ejecutar(p.programa);
    var campos = p.campos.map(function (c) { return { clave: c, def: CAMPOS[c] }; });
    var carta = elemento(
      '<div class="carta">' +
        "<h2>" + p.titulo + "</h2>" +
        (p.enunciado ? "<p>" + p.enunciado + "</p>" : "") +
        '<pre class="codigo programa-simulador">' + p.programa.replace(/</g, "&lt;") + "</pre>" +
        '<div class="campos-prediccion"></div>' +
        '<div class="botones">' +
          '<button class="primario" data-accion="comprobar">Comprobar</button>' +
          '<button data-accion="proceso" disabled>Ver el proceso</button>' +
        "</div>" +
        '<div class="veredicto" style="display:none"></div>' +
        '<div class="proceso" style="display:none"></div>' +
      "</div>");

    var zona = carta.querySelector(".campos-prediccion");
    campos.forEach(function (c) {
      zona.appendChild(elemento(
        '<label class="campo"><span>' + c.def.etiqueta + "</span>" +
        '<input type="text" inputmode="numeric" size="6" data-clave="' + c.clave + '"></label>'));
    });

    var veredicto = carta.querySelector(".veredicto");
    var zonaProceso = carta.querySelector(".proceso");
    var btnProceso = carta.querySelector('[data-accion="proceso"]');

    carta.querySelector('[data-accion="comprobar"]').addEventListener("click", function () {
      var lineas = [], todo = true;
      campos.forEach(function (c) {
        var entrada = carta.querySelector('input[data-clave="' + c.clave + '"]');
        var esperado = r.error ? null : c.def.leer(r);
        var dado = entrada.value.trim();
        var bien = dado !== "" && esperado !== null && Number(dado) === Number(esperado);
        if (!bien) { todo = false; }
        entrada.className = bien ? "bien" : "mal";
        lineas.push((bien ? "✓ " : "✗ ") + c.def.etiqueta + ": " +
          (r.error ? "el programa no llega a dar un valor" : esperado));
      });
      veredicto.innerHTML = lineas.join("<br>") +
        (todo ? "" : "<br>" + (p.pista || "Mire el proceso: la traza dice en qué orden se llamó a cada cosa."));
      veredicto.className = "veredicto " + (todo ? "bien" : "mal");
      veredicto.style.display = "block";
      btnProceso.disabled = false;
    });

    btnProceso.addEventListener("click", function () {
      zonaProceso.innerHTML = proceso(r);
      zonaProceso.style.display = "block";
      btnProceso.disabled = true;
    });

    return carta;
  }

  /* --- Consola libre ------------------------------------------------- */
  function montarLibre(id, ejemplos) {
    var caja = document.getElementById(id);
    if (!caja) { return; }
    var entrada = caja.querySelector("textarea");
    var salida = caja.querySelector(".proceso");
    var atajos = caja.querySelector(".ejemplos");

    function correr() {
      salida.innerHTML = proceso(InterpreteLenguaje.ejecutar(entrada.value.trim()));
      salida.style.display = "block";
    }
    caja.querySelector('[data-accion="correr"]').addEventListener("click", correr);
    entrada.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { correr(); }
    });
    (ejemplos || []).forEach(function (ej) {
      var b = elemento("<button>" + ej.replace(/</g, "&lt;") + "</button>");
      b.addEventListener("click", function () { entrada.value = ej; correr(); });
      atajos.appendChild(b);
    });
  }

  function montar(opciones) {
    var destino = document.getElementById(opciones.destino);
    if (destino) {
      opciones.predicciones.forEach(function (p) { destino.appendChild(pintarPrediccion(p)); });
    }
    montarLibre(opciones.libre, opciones.ejemplos);
  }

  return { montar: montar, proceso: proceso };
})();
