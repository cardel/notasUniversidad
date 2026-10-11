/* Gráficas en SVG para las actividades del curso: líneas, correlogramas con
   su banda y diagramas de dispersión. Cada función devuelve el texto del SVG
   y la página lo pone en un contenedor con innerHTML. */
var Grafica = (function () {
  "use strict";

  var AZUL = "#1f5fa8", ROJO = "#b3261e", GRIS = "#6b7280", BANDA = "#cfe0f3";

  function extremos(arreglos) {
    var lo = Infinity, hi = -Infinity;
    arreglos.forEach(function (a) {
      a.forEach(function (v) { if (v < lo) { lo = v; } if (v > hi) { hi = v; } });
    });
    if (lo === hi) { lo -= 1; hi += 1; }
    var margen = (hi - lo) * 0.05;
    return [lo - margen, hi + margen];
  }

  /* Marcas legibles para un intervalo: pasos de 1, 2 o 5 por potencia de 10. */
  function marcas(lo, hi, cuantas) {
    var paso = (hi - lo) / (cuantas || 5);
    var pot = Math.pow(10, Math.floor(Math.log10(paso)));
    var base = paso / pot;
    paso = (base < 1.5 ? 1 : base < 3.5 ? 2 : base < 7.5 ? 5 : 10) * pot;
    var m = [];
    for (var v = Math.ceil(lo / paso) * paso; v <= hi + 1e-12; v += paso) {
      m.push(Math.abs(v) < paso * 1e-9 ? 0 : v);
    }
    return m;
  }

  function numero(v) {
    var t = Math.abs(v) >= 100 || v === Math.round(v) ? String(Math.round(v * 100) / 100) : v.toFixed(2);
    return t.replace(".", ",").replace("-", "−");
  }

  function lienzo(ancho, alto, cuerpo) {
    return '<svg class="grafica" viewBox="0 0 ' + ancho + " " + alto +
      '" width="100%" role="img" xmlns="http://www.w3.org/2000/svg">' + cuerpo + "</svg>";
  }

  function texto(x, y, t, extra) {
    return '<text x="' + x + '" y="' + y + '" ' + (extra || "") + ">" + t + "</text>";
  }

  /* Marco con ejes y marcas. Devuelve las funciones de escala y el SVG. */
  function marco(op, xlo, xhi, ylo, yhi) {
    var W = op.ancho || 640, H = op.alto || 240;
    var izq = 56, der = 12, arr = op.titulo ? 26 : 10, aba = op.etiquetaX ? 40 : 26;
    function sx(v) { return izq + (v - xlo) / (xhi - xlo) * (W - izq - der); }
    function sy(v) { return H - aba - (v - ylo) / (yhi - ylo) * (H - arr - aba); }
    var s = '<rect x="' + izq + '" y="' + arr + '" width="' + (W - izq - der) +
      '" height="' + (H - arr - aba) + '" fill="#fff" stroke="#d8dee6"/>';
    marcas(ylo, yhi, 4).forEach(function (v) {
      s += '<line x1="' + izq + '" x2="' + (W - der) + '" y1="' + sy(v) + '" y2="' + sy(v) +
        '" stroke="#eef1f5"/>';
      s += texto(izq - 6, sy(v) + 4, numero(v), 'text-anchor="end" font-size="11" fill="' + GRIS + '"');
    });
    (op.marcasX || marcas(xlo, xhi, 6)).forEach(function (v) {
      var rot = op.rotuloX ? op.rotuloX(v) : numero(v);
      s += texto(sx(v), H - aba + 15, rot, 'text-anchor="middle" font-size="11" fill="' + GRIS + '"');
    });
    if (op.titulo) {
      s += texto(izq, 17, op.titulo, 'font-size="13" font-weight="600" fill="#24292f"');
    }
    if (op.etiquetaX) {
      s += texto((izq + W - der) / 2, H - 6, op.etiquetaX, 'text-anchor="middle" font-size="11" fill="' + GRIS + '"');
    }
    if (op.etiquetaY) {
      s += texto(12, (arr + H - aba) / 2, op.etiquetaY,
        'text-anchor="middle" font-size="11" fill="' + GRIS + '" transform="rotate(-90 12 ' + (arr + H - aba) / 2 + ')"');
    }
    return { W: W, H: H, sx: sx, sy: sy, svg: s };
  }

  /* Una o varias líneas sobre el mismo eje x (0, 1, 2…). op.lineas es una
     lista de { valores, color }; op.cero dibuja la recta y = 0. */
  function lineas(op) {
    var largo = 0;
    op.lineas.forEach(function (l) { largo = Math.max(largo, l.valores.length); });
    var ys = extremos(op.lineas.map(function (l) { return l.valores; }).concat(op.cero ? [[0]] : []));
    var f = marco(op, 0, largo - 1, ys[0], ys[1]);
    var s = f.svg;
    if (op.cero) {
      s += '<line x1="' + f.sx(0) + '" x2="' + f.sx(largo - 1) + '" y1="' + f.sy(0) + '" y2="' + f.sy(0) +
        '" stroke="#24292f" stroke-width="0.8"/>';
    }
    op.lineas.forEach(function (l) {
      var desde = l.desde || 0;
      var pts = l.valores.map(function (v, i) { return f.sx(i + desde).toFixed(1) + "," + f.sy(v).toFixed(1); });
      s += '<polyline fill="none" stroke="' + (l.color || AZUL) + '" stroke-width="1.6" points="' + pts.join(" ") + '"/>';
    });
    return lienzo(f.W, f.H, s);
  }

  /* Correlograma: una barra por rezago desde k = 0 o k = 1, y la banda
     ±1,96/√n sombreada. Con op.bandas (un arreglo por rezago) la banda
     cambia con k, como la de Bartlett. Las barras fuera van en rojo. */
  function correlograma(valores, n, op) {
    op = op || {};
    var desde = op.desde === undefined ? 0 : op.desde;
    var ult = valores.length - 1, plana = 1.96 / Math.sqrt(n);
    function b(k) { return op.bandas ? op.bandas[k] : plana; }
    var f = marco({
      ancho: op.ancho || 640, alto: op.alto || 220, titulo: op.titulo,
      etiquetaX: op.etiquetaX === undefined ? "rezago k" : op.etiquetaX,
      marcasX: op.marcasX
    }, desde - 0.6, ult + 0.6, -1.05, 1.05);
    var s = f.svg, arriba = [], abajo = [];
    for (var j = Math.max(desde, 1); j <= ult; j++) {
      arriba.push(f.sx(j - 0.5).toFixed(1) + "," + f.sy(b(j)).toFixed(1), f.sx(j + 0.5).toFixed(1) + "," + f.sy(b(j)).toFixed(1));
      abajo.unshift(f.sx(j + 0.5).toFixed(1) + "," + f.sy(-b(j)).toFixed(1), f.sx(j - 0.5).toFixed(1) + "," + f.sy(-b(j)).toFixed(1));
    }
    s += '<polygon points="' + arriba.concat(abajo).join(" ") + '" fill="' + BANDA + '" opacity="0.7"/>';
    s += '<line x1="' + f.sx(desde - 0.6) + '" x2="' + f.sx(ult + 0.6) + '" y1="' + f.sy(0) + '" y2="' + f.sy(0) +
      '" stroke="#24292f" stroke-width="0.8"/>';
    for (var k = desde; k <= ult; k++) {
      var fuera = k > 0 && Math.abs(valores[k]) > b(k);
      var color = fuera ? ROJO : AZUL;
      s += '<line x1="' + f.sx(k) + '" x2="' + f.sx(k) + '" y1="' + f.sy(0) + '" y2="' + f.sy(valores[k]) +
        '" stroke="' + color + '" stroke-width="2"/>';
      s += '<circle cx="' + f.sx(k) + '" cy="' + f.sy(valores[k]) + '" r="2.6" fill="' + color + '"><title>k = ' + k +
        ": " + numero(valores[k]) + "</title></circle>";
    }
    return lienzo(f.W, f.H, s);
  }

  /* Dispersión de pares (x, y). op.colores, si llega, da el color de cada
     punto; op.leyenda es una lista de { color, texto }. */
  function dispersion(xs, ys, op) {
    op = op || {};
    var ex = extremos([xs]), ey = extremos([ys]);
    var f = marco({
      ancho: op.ancho || 520, alto: op.alto || 360, titulo: op.titulo,
      etiquetaX: op.etiquetaX, etiquetaY: op.etiquetaY
    }, ex[0], ex[1], ey[0], ey[1]);
    var s = f.svg;
    for (var i = 0; i < xs.length; i++) {
      var c = op.colores ? op.colores[i] : AZUL;
      s += '<circle cx="' + f.sx(xs[i]).toFixed(1) + '" cy="' + f.sy(ys[i]).toFixed(1) + '" r="3.2" fill="' + c +
        '" fill-opacity="0.75">' + (op.rotulos ? "<title>" + op.rotulos[i] + "</title>" : "") + "</circle>";
    }
    (op.leyenda || []).forEach(function (l, j) {
      var y = (op.titulo ? 40 : 24) + j * 16;
      s += '<circle cx="' + (f.W - 120) + '" cy="' + (y - 4) + '" r="4" fill="' + l.color + '"/>';
      s += texto(f.W - 110, y, l.texto, 'font-size="11" fill="#24292f"');
    });
    return lienzo(f.W, f.H, s);
  }

  return {
    lineas: lineas, correlograma: correlograma, dispersion: dispersion,
    numero: numero, AZUL: AZUL, ROJO: ROJO
  };
})();

if (typeof module !== "undefined") { module.exports = Grafica; }
