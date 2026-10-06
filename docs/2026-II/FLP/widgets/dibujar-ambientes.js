/* Dibuja en SVG una cadena de ambientes con la convención del curso: el
   ambiente vacío siempre aparece, en gris, al final de la cadena, y la
   flecha va del ambiente que extiende hacia el que extendió, es decir del
   más nuevo al más viejo.

   Recibe una lista de eslabones, del más nuevo al más viejo, cada uno
   { nombre, ligaduras: [[id, valor], …] }, y dibuja uno más por el vacío.
   Un eslabón con destacado: true se pinta con borde discontinuo, que es
   como el curso marca el ambiente que se acaba de crear. */
var DibujarAmbientes = (function () {
  "use strict";

  var ALTO_LINEA = 18, RELLENO = 10, SEPARACION = 46, ANCHO_CARACTER = 7.6;

  /* Cómo se escribe el valor de una ligadura. Quien dibuja puede dar su
     propia función: un valor del lenguaje no siempre es un número. */
  var comoTexto = function (v) { return String(v); };
  function textoLigadura(l) { return l[0] + " = " + comoTexto(l[1]); }

  function medir(eslabon) {
    var lineas = [eslabon.nombre].concat((eslabon.ligaduras || []).map(textoLigadura));
    var ancho = Math.max.apply(null, lineas.map(function (t) { return t.length; }));
    return { lineas: lineas,
             ancho: Math.max(64, ancho * ANCHO_CARACTER + 2 * RELLENO),
             alto: lineas.length * ALTO_LINEA + 2 * RELLENO };
  }

  function svg(cadena, opciones) {
    opciones = opciones || {};
    var eslabones = cadena.map(function (e) {
      var m = medir(e);
      return { datos: e, lineas: m.lineas, ancho: m.ancho, alto: m.alto };
    });
    eslabones.push({ datos: { nombre: "empty-env", vacio: true }, lineas: ["empty-env"],
                     ancho: 92, alto: ALTO_LINEA + 2 * RELLENO });

    var alto = Math.max.apply(null, eslabones.map(function (e) { return e.alto; })) + 24;
    var x = 4, partes = [];
    eslabones.forEach(function (e, i) {
      var y = (alto - e.alto) / 2;
      var clase = "amb-caja" + (e.datos.vacio ? " amb-vacio" : "") +
                  (e.datos.destacado ? " amb-nuevo" : "");
      partes.push('<rect class="' + clase + '" x="' + x + '" y="' + y +
                  '" width="' + e.ancho + '" height="' + e.alto + '" rx="8"/>');
      e.lineas.forEach(function (t, k) {
        partes.push('<text class="' + (k === 0 ? "amb-nombre" : "amb-ligadura") +
                    '" x="' + (x + e.ancho / 2) + '" y="' +
                    (y + RELLENO + ALTO_LINEA * k + 13) + '">' +
                    String(t).replace(/</g, "&lt;") + "</text>");
      });
      if (i > 0) {
        var desde = x - SEPARACION + 6, hasta = x - 6;
        partes.push('<line class="amb-flecha" x1="' + desde + '" y1="' + (alto / 2) +
                    '" x2="' + hasta + '" y2="' + (alto / 2) + '" marker-end="url(#puntaAmb)"/>');
        partes.push('<text class="amb-rotulo" x="' + ((desde + hasta) / 2) + '" y="' +
                    (alto / 2 - 7) + '">extiende</text>');
      }
      e.x = x;
      x += e.ancho + SEPARACION;
    });

    return '<svg class="diagrama-ambientes" viewBox="0 0 ' + (x - SEPARACION + 8) + " " + alto +
      '" width="' + Math.min(x - SEPARACION + 8, 980) + '" role="img" aria-label="' +
      (opciones.titulo || "cadena de ambientes") + '">' +
      '<defs><marker id="puntaAmb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" ' +
      'markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M 0 0 L 10 5 L 0 10 z" class="amb-punta"/></marker></defs>' +
      partes.join("") + "</svg>";
  }

  /* Convierte el ambiente del interpretador —{nombre, ligaduras, viejo}— en
     la lista que espera svg. El eslabón que se nombre en destacado se marca. */
  function desdeAmbiente(env, destacado, escribir) {
    comoTexto = escribir || function (v) { return String(v); };
    var cadena = [];
    while (env) {
      cadena.push({ nombre: env.nombre, ligaduras: env.ligaduras,
                    destacado: env.nombre === destacado });
      env = env.viejo;
    }
    return cadena;
  }

  return { svg: svg, desdeAmbiente: desdeAmbiente };
})();

if (typeof module !== "undefined") { module.exports = DibujarAmbientes; }
