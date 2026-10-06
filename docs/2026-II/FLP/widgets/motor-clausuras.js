/* Pinta las actividades del interpretador con procedimientos: tarjetas donde
   primero se predice qué hará el interpretador y después se abre su proceso
   —la traza con el ambiente de cada paso, la cadena de ambientes dibujada y
   las clausuras con el ambiente que capturaron—, y la comparación del mismo
   programa bajo alcance estático y bajo alcance dinámico.

   Las respuestas no están escritas: se calculan ejecutando el interpretador
   de interprete-clausuras.js sobre el programa que ve el estudiante. */
var MotorClausuras = (function () {
  "use strict";

  var CAMPOS = {
    valor:     { etiqueta: "El valor del programa", leer: function (r) { return r.texto; } },
    valueOf:   { etiqueta: "Llamadas a value-of", leer: function (r) { return r.cuenta.valueOf; } },
    applyProc: { etiqueta: "Procedimientos aplicados", leer: function (r) { return r.cuenta.applyProc; } },
    variables: { etiqueta: "Variables que se evalúan", leer: function (r) { return r.cuenta.variables; } },
    ambientes: { etiqueta: "Ambientes que se crean", leer: function (r) { return r.cuenta.ambientes; } },
    clausuras: { etiqueta: "Clausuras que se crean", leer: function (r) { return r.cuenta.clausuras; } }
  };

  function elemento(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    return d.firstElementChild;
  }
  function escapar(t) { return String(t).replace(/</g, "&lt;"); }

  function cadena(env, destacado, titulo) {
    if (typeof DibujarAmbientes === "undefined") { return ""; }
    var eslabones = DibujarAmbientes.desdeAmbiente(env, destacado, InterpreteClausuras.escribir);
    return '<div class="envoltura-ambientes">' +
      DibujarAmbientes.svg(eslabones, { titulo: titulo }) + "</div>";
  }

  function panelTraza(r) {
    var paso = 0;
    var filas = r.traza.map(function (f) {
      if (f.creacion) {
        return '<tr class="fila-creacion"><td></td><td colspan="3">' + escapar(f.expresion) + "</td></tr>";
      }
      paso++;
      return "<tr><td>" + paso + "</td><td><code>" + escapar(f.expresion) + "</code></td><td>" +
        f.ambiente + (f.consulta ? ' <span class="marca-ambiente">busca aquí</span>' : "") +
        "</td><td><code>" + escapar(f.valor) + "</code></td></tr>";
    }).join("");
    return "<h3>La traza, una fila por llamada a <code>value-of</code></h3>" +
      '<div class="envoltura-tabla"><table class="tabla-traza"><thead><tr><th>#</th>' +
      "<th>Expresión</th><th>Ambiente</th><th>Valor</th></tr></thead><tbody>" + filas +
      "</tbody></table></div>" +
      '<p class="conteos"><strong>Valor: ' + escapar(r.texto) + "</strong> · " +
      r.cuenta.valueOf + " llamadas a <code>value-of</code> · " +
      r.cuenta.applyProc + " procedimientos aplicados · " +
      r.cuenta.variables + " variables evaluadas · " +
      r.cuenta.ambientes + " ambientes creados</p>";
  }

  function panelAmbientes(r) {
    var partes;
    if (r.ultimaLlamada) {
      partes = ["<h3>La cadena donde se evaluó el cuerpo del último procedimiento aplicado</h3>",
                cadena(r.ultimaLlamada, r.ultimaLlamada.nombre, "cadena de ambientes")];
    } else {
      partes = ["<h3>La cadena de ambientes, en su punto más hondo</h3>",
                cadena(r.masProfundo, r.masProfundo.nombre, "cadena de ambientes")];
    }
    if (r.clausuras && r.clausuras.length) {
      partes.push("<h3>Las clausuras y el ambiente que cada una capturó</h3>");
      r.clausuras.forEach(function (c) {
        partes.push('<p class="clausura"><code>' + escapar(c.texto) + "</code></p>" +
                    cadena(c.env, c.env.nombre, "ambiente de la clausura"));
      });
    }
    return partes.join("");
  }

  /* Un programa puede detenerse en vez de dar un valor. Cuando eso pasa, la
     respuesta correcta es decirlo, y se acepta escrita de cualquier manera. */
  var DICE_ERROR = /error|detiene|detener|falla|fallo|no existe|no hay|no da|indefinid|nada|ningun|libre|sin ligar/;

  function diceError(dado) {
    return DICE_ERROR.test(dado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  }

  var AVISO_ERROR =
    '<p class="aviso-campos">Si cree que el programa se detiene en vez de dar ' +
    'un valor, escriba <code>error</code>.</p>';

  function proceso(r) {
    if (r.error) {
      var donde = { lectura: "al leer el programa", parser: "en el parser", evaluador: "al evaluar" };
      return '<div class="veredicto mal">Se detuvo ' + (donde[r.etapa] || "") + ": " +
        escapar(r.error) + "</div>";
    }
    return panelTraza(r) + panelAmbientes(r);
  }

  function pintarPrediccion(p) {
    var r = InterpreteClausuras.ejecutar(p.programa);
    var carta = elemento(
      '<div class="carta">' +
        "<h2>" + p.titulo + "</h2>" +
        (p.enunciado ? "<p>" + p.enunciado + "</p>" : "") +
        '<pre class="codigo programa-simulador">' + escapar(p.programa) + "</pre>" +
        '<div class="campos-prediccion"></div>' + AVISO_ERROR +
        '<div class="botones">' +
          '<button class="primario" data-accion="comprobar">Comprobar</button>' +
          '<button data-accion="proceso" disabled>Ver el proceso</button>' +
        "</div>" +
        '<div class="veredicto" style="display:none"></div>' +
        '<div class="proceso" style="display:none"></div>' +
      "</div>");

    var zona = carta.querySelector(".campos-prediccion");
    p.campos.forEach(function (c) {
      zona.appendChild(elemento('<label class="campo"><span>' + CAMPOS[c].etiqueta + "</span>" +
        '<input type="text" size="8" data-clave="' + c + '"></label>'));
    });

    var veredicto = carta.querySelector(".veredicto");
    var zonaProceso = carta.querySelector(".proceso");
    var btnProceso = carta.querySelector('[data-accion="proceso"]');

    carta.querySelector('[data-accion="comprobar"]').addEventListener("click", function () {
      var lineas = [], todo = true;
      p.campos.forEach(function (c) {
        var entrada = carta.querySelector('input[data-clave="' + c + '"]');
        var esperado = r.error ? null : CAMPOS[c].leer(r);
        var dado = entrada.value.trim();
        var bien = dado !== "" && (r.error
          ? diceError(dado)
          : String(esperado) === dado || String(esperado) === dado.replace(/\s+/g, ""));
        if (!bien) { todo = false; }
        entrada.className = bien ? "bien" : "mal";
        lineas.push((bien ? "✓ " : "✗ ") + CAMPOS[c].etiqueta + ": " +
          (r.error ? "el programa se detiene antes de dar un valor" : escapar(esperado)));
      });
      veredicto.innerHTML = lineas.join("<br>") + (todo ? "" : "<br>" + (p.pista || ""));
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

  /* --- Los dos alcances, lado a lado -------------------------------- */
  function pintarAlcance(p) {
    var estatico = InterpreteClausuras.ejecutar(p.programa);
    var dinamico = InterpreteClausuras.ejecutar(p.programa, { dinamico: true });
    var carta = elemento(
      '<div class="carta">' +
        "<h2>" + p.titulo + "</h2>" +
        (p.enunciado ? "<p>" + p.enunciado + "</p>" : "") +
        '<pre class="codigo programa-simulador">' + escapar(p.programa) + "</pre>" +
        '<div class="campos-prediccion">' +
          '<label class="campo"><span>Con alcance estático</span>' +
          '<input type="text" size="8" data-clave="est"></label>' +
          '<label class="campo"><span>Con alcance dinámico</span>' +
          '<input type="text" size="8" data-clave="din"></label>' +
        "</div>" + AVISO_ERROR +
        '<div class="botones">' +
          '<button class="primario" data-accion="comprobar">Comprobar</button>' +
          '<button data-accion="proceso" disabled>Ver las dos trazas</button>' +
        "</div>" +
        '<div class="veredicto" style="display:none"></div>' +
        '<div class="proceso" style="display:none"></div>' +
      "</div>");

    var veredicto = carta.querySelector(".veredicto");
    var zonaProceso = carta.querySelector(".proceso");
    var btnProceso = carta.querySelector('[data-accion="proceso"]');
    function resultado(r) { return r.error ? "se detiene: " + r.error : r.texto; }

    carta.querySelector('[data-accion="comprobar"]').addEventListener("click", function () {
      var lineas = [], todo = true;
      [["est", estatico, "Con alcance estático"], ["din", dinamico, "Con alcance dinámico"]]
        .forEach(function (par) {
          var entrada = carta.querySelector('input[data-clave="' + par[0] + '"]');
          var esperado = par[1].error ? null : par[1].texto;
          var dado = entrada.value.trim();
          var bien = dado !== "" && (par[1].error
            ? diceError(dado)
            : dado === String(esperado));
          if (!bien) { todo = false; }
          entrada.className = bien ? "bien" : "mal";
          lineas.push((bien ? "✓ " : "✗ ") + par[2] + ": " + escapar(resultado(par[1])));
        });
      veredicto.innerHTML = lineas.join("<br>") +
        (estatico.texto === dinamico.texto && !estatico.error
          ? "<br>Las dos reglas coinciden en este programa: " + p.razonIguales
          : "<br>" + (p.pista || ""));
      veredicto.className = "veredicto " + (todo ? "bien" : "mal");
      veredicto.style.display = "block";
      btnProceso.disabled = false;
    });

    btnProceso.addEventListener("click", function () {
      zonaProceso.innerHTML =
        "<h3>Con alcance estático, el del lenguaje</h3>" + proceso(estatico) +
        "<h3>Con alcance dinámico, para comparar</h3>" + proceso(dinamico);
      zonaProceso.style.display = "block";
      btnProceso.disabled = true;
    });
    return carta;
  }

  function montarLibre(id, ejemplos) {
    var caja = document.getElementById(id);
    if (!caja) { return; }
    var entrada = caja.querySelector("textarea");
    var salida = caja.querySelector(".proceso");
    var marca = caja.querySelector('input[type="checkbox"]');

    function correr() {
      var r = InterpreteClausuras.ejecutar(entrada.value.trim(),
                                           { dinamico: marca && marca.checked });
      salida.innerHTML = proceso(r);
      salida.style.display = "block";
    }
    caja.querySelector('[data-accion="correr"]').addEventListener("click", correr);
    entrada.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { correr(); }
    });
    var atajos = caja.querySelector(".ejemplos");
    (ejemplos || []).forEach(function (ej) {
      var b = elemento("<button>" + escapar(ej.length > 46 ? ej.slice(0, 44) + "…" : ej) + "</button>");
      b.title = ej;
      b.addEventListener("click", function () { entrada.value = ej; correr(); });
      atajos.appendChild(b);
    });
  }

  function montar(opciones) {
    var destino = document.getElementById(opciones.destino);
    if (destino) {
      (opciones.predicciones || []).forEach(function (p) {
        destino.appendChild(p.alcances ? pintarAlcance(p) : pintarPrediccion(p));
      });
    }
    if (opciones.libre) { montarLibre(opciones.libre, opciones.ejemplos); }
  }

  return { montar: montar, proceso: proceso };
})();
