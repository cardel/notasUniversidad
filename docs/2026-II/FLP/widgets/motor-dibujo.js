/* Dibujar la cadena de ambientes. El estudiante escribe los eslabones que el
   programa crea, uno por línea y del más nuevo al más viejo, y la página los
   dibuja mientras escribe; al comprobar, los compara con la cadena que tenía
   el interpretador en ese momento y señala la primera diferencia.

   El ambiente inicial y el vacío los pone la página: lo que se pide es lo
   que el programa construye encima. */
var MotorDibujo = (function () {
  "use strict";

  function elemento(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    return d.firstElementChild;
  }
  function escapar(t) { return String(t).replace(/</g, "&lt;"); }

  /* --- Lo que escribe el estudiante --------------------------------- */
  function leerEslabones(texto) {
    return texto.split("\n").map(function (linea) {
      return linea.replace(/^\s*(env|ρ|p)\s*\d*\s*=\s*/i, "")   // «env2 =» al inicio
                  .replace(/\s*(env|ρ|p)\s*\d*\s*$/i, "")        // «env1» al final
                  .replace(/[→>-]+\s*$/, "")
                  .trim();
    }).filter(function (l) { return l !== ""; }).map(function (linea) {
      var dentro = linea.replace(/^\[|\]$/g, "");
      return dentro.split(",").map(function (par) {
        var t = par.split("=");
        return [(t[0] || "").trim(), (t.slice(1).join("=") || "").trim()];
      }).filter(function (p) { return p[0] !== ""; });
    });
  }

  /* Dos ligaduras son la misma si coinciden el nombre y el valor escrito.
     Para una clausura basta con decir que lo es. */
  function mismoValor(escrito, real) {
    var e = String(escrito).toLowerCase().replace(/\s+/g, "");
    var r = String(real).toLowerCase().replace(/\s+/g, "");
    if (e === r) { return true; }
    if (/^\(closure/.test(r)) { return /^(closure|proc|procedimiento|clausura)/.test(e); }
    return false;
  }

  function comparar(escritos, reales) {
    if (escritos.length !== reales.length) {
      return "Escribió " + escritos.length + " eslabón(es) y la cadena tiene " +
        reales.length + ", sin contar env0 ni el vacío.";
    }
    for (var i = 0; i < reales.length; i++) {
      var mio = escritos[i], suyo = reales[i].ligaduras;
      var cual = "El eslabón " + (i + 1) + ", contando desde el más nuevo, ";
      if (mio.length !== suyo.length) {
        return cual + "liga " + mio.length + " nombre(s) y debía ligar " + suyo.length + ".";
      }
      for (var k = 0; k < suyo.length; k++) {
        if (mio[k][0] !== suyo[k][0]) {
          return cual + "liga «" + mio[k][0] + "» donde va «" + suyo[k][0] + "».";
        }
        if (!mismoValor(mio[k][1], InterpreteClausuras.escribir(suyo[k][1]))) {
          return cual + "le da a «" + suyo[k][0] + "» el valor " + (mio[k][1] || "nada") +
            " y debía valer " + InterpreteClausuras.escribir(suyo[k][1]) + ".";
        }
      }
    }
    return null;
  }

  /* --- Dibujos ------------------------------------------------------ */
  function dibujar(eslabones, env0, destacar) {
    var cadena = eslabones.map(function (lig, i) {
      return { nombre: "ρ" + (eslabones.length - i), ligaduras: lig,
               destacado: destacar && i === 0 };
    });
    cadena.push({ nombre: "env0", ligaduras: env0.ligaduras });
    return '<div class="envoltura-ambientes">' +
      DibujarAmbientes.svg(cadena, { titulo: "cadena de ambientes" }) + "</div>";
  }

  function dibujarReal(reales, env0) {
    return dibujar(reales.map(function (e) {
      return e.ligaduras.map(function (l) {
        return [l[0], InterpreteClausuras.escribir(l[1])];
      });
    }), env0, true);
  }

  function pintar(ej) {
    var salida = InterpreteClausuras.ejecutar(ej.programa);
    var cadena = InterpreteClausuras.cadenaEn(salida, ej.momento);
    var env0 = cadena[cadena.length - 1];
    var reales = cadena.slice(0, cadena.length - 1);   // sin env0

    var carta = elemento(
      '<div class="carta">' +
        "<h2>" + ej.titulo + "</h2>" +
        (ej.enunciado ? "<p>" + ej.enunciado + "</p>" : "") +
        '<pre class="codigo programa-simulador">' + escapar(ej.programa) + "</pre>" +
        "<p>Dibuje la cadena tal como está <strong>en el momento en que se evalúa " +
          "<code>" + escapar(ej.momento) + "</code></strong>. Escriba un eslabón por " +
          "línea, del más nuevo al más viejo, con sus ligaduras entre corchetes. " +
          "<code>env0</code> y el ambiente vacío los pone la página.</p>" +
        '<textarea class="editor" rows="4" spellcheck="false" ' +
          'placeholder="[b=9]&#10;[a=3]"></textarea>' +
        '<div class="botones">' +
          '<button class="primario" data-accion="comprobar">Comprobar</button>' +
          '<button data-accion="ver">Ver la cadena</button>' +
        "</div>" +
        '<div class="dibujo-estudiante"></div>' +
        '<div class="veredicto" style="display:none"></div>' +
        '<div class="dibujo-real" style="display:none"></div>' +
      "</div>");

    var entrada = carta.querySelector("textarea");
    var mio = carta.querySelector(".dibujo-estudiante");
    var veredicto = carta.querySelector(".veredicto");
    var suyo = carta.querySelector(".dibujo-real");

    function repintar() {
      var escritos = leerEslabones(entrada.value);
      mio.innerHTML = escritos.length
        ? "<p class=\"rotulo-dibujo\">Lo que escribió:</p>" + dibujar(escritos, env0, true)
        : "";
    }
    entrada.addEventListener("input", repintar);

    carta.querySelector('[data-accion="comprobar"]').addEventListener("click", function () {
      repintar();
      var escritos = leerEslabones(entrada.value);
      if (!escritos.length) {
        veredicto.textContent = "Escriba al menos un eslabón: el programa crea alguno antes de llegar a esa expresión.";
        veredicto.className = "veredicto mal";
        veredicto.style.display = "block";
        return;
      }
      var falla = comparar(escritos, reales);
      veredicto.innerHTML = falla
        ? falla + "<br>" + (ej.pista || "")
        : "La cadena coincide, eslabón por eslabón.";
      veredicto.className = "veredicto " + (falla ? "mal" : "bien");
      veredicto.style.display = "block";
      if (!falla) {
        suyo.innerHTML = "<p class=\"rotulo-dibujo\">" + (ej.cierre || "") + "</p>";
        suyo.style.display = "block";
      }
    });

    carta.querySelector('[data-accion="ver"]').addEventListener("click", function () {
      suyo.innerHTML = "<p class=\"rotulo-dibujo\">La cadena del interpretador:</p>" +
        dibujarReal(reales, env0) + (ej.cierre ? '<div class="nota">' + ej.cierre + "</div>" : "");
      suyo.style.display = "block";
    });

    return carta;
  }

  function montar(opciones) {
    var destino = document.getElementById(opciones.destino);
    if (!destino) { return; }
    opciones.ejercicios.forEach(function (ej) { destino.appendChild(pintar(ej)); });
  }

  return { montar: montar, leerEslabones: leerEslabones, comparar: comparar };
})();

if (typeof module !== "undefined") { module.exports = MotorDibujo; }
