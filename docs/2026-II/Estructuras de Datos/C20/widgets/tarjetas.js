/* Tarjetas comunes de los ejercicios interactivos (clase 20).
   Cada pagina arma una especificacion y llama Tarjetas.montar(spec).
   Tipos de tarjeta:
     respuesta  campos que se escriben y se comparan con lo esperado
     opciones   botones, cada uno con su retroalimentacion
     pasos      estados que se muestran uno por uno
     tabla      filas que se revelan una por una
   La carta de cierre aparece cuando todas las de respuesta y de opciones
   quedaron bien. */
var Tarjetas = (function () {
  function normalizar(texto) {
    return String(texto).trim().toLowerCase().split(/[\s,;]+/)
      .filter(function (x) { return x !== ""; }).join(" ");
  }

  /* Devuelve {bien, msg} para lo escrito en una tarjeta de respuesta. */
  function juzgar(carta, dadas) {
    var norm = dadas.map(normalizar);
    var esperadas = carta.campos.map(function (c) { return normalizar(c.esperado); });
    var res = null;
    if (norm.every(function (x, k) { return x === esperadas[k]; })) {
      res = { bien: true, msg: carta.bien };
    }
    var d = 0;
    while (res === null && carta.distractores && d < carta.distractores.length) {
      var dis = carta.distractores[d];
      var calza = dis.valores.every(function (v, k) {
        return v === null || normalizar(v) === norm[k];
      });
      if (calza) { res = { bien: false, msg: dis.msg }; }
      d = d + 1;
    }
    if (res === null) { res = { bien: false, msg: carta.otro }; }
    return res;
  }

  function montar(spec) {
    var raiz = document.getElementById(spec.contenedor);
    var pendientes = 0;
    var logradas = 0;
    var cierre = null;
    function anotar(carta) {
      if (!carta.lograda) {
        carta.lograda = true;
        logradas = logradas + 1;
        if (logradas === pendientes && cierre !== null) { cierre.style.display = "block"; }
      }
    }
    function nueva(clase) {
      var e = document.createElement("div");
      e.className = clase;
      return e;
    }
    function veredicto(ver, r) {
      ver.className = "veredicto " + (r.bien ? "bien" : "mal");
      ver.textContent = r.msg;
    }
    spec.cartas.forEach(function (carta, n) {
      var div = nueva("carta");
      var h = document.createElement("h2");
      h.innerHTML = (n + 1) + ". " + carta.titulo;
      div.appendChild(h);
      if (carta.html) {
        var cuerpo = nueva("cuerpo");
        cuerpo.innerHTML = carta.html;
        div.appendChild(cuerpo);
      }
      var ver = nueva("veredicto");
      if (carta.tipo === "respuesta") {
        pendientes = pendientes + 1;
        var fila = nueva("prediccion");
        var entradas = carta.campos.map(function (c) {
          var r = document.createElement("span");
          r.innerHTML = c.rotulo;
          fila.appendChild(r);
          var inp = document.createElement("input");
          inp.type = "text";
          inp.placeholder = c.pista || "?";
          inp.style.width = c.ancho || "6.5rem";
          fila.appendChild(inp);
          return inp;
        });
        var b = document.createElement("button");
        b.className = "primario";
        b.textContent = "Comprobar";
        b.addEventListener("click", function () {
          var r = juzgar(carta, entradas.map(function (e) { return e.value; }));
          veredicto(ver, r);
          if (r.bien) { anotar(carta); }
        });
        fila.appendChild(b);
        div.appendChild(fila);
        div.appendChild(ver);
      } else if (carta.tipo === "opciones") {
        pendientes = pendientes + 1;
        var ops = nueva("opciones" + (carta.columna ? " columna" : ""));
        carta.opciones.forEach(function (o) {
          var bo = document.createElement("button");
          bo.innerHTML = o.texto;
          bo.dataset.op = o.op;
          bo.addEventListener("click", function () {
            var bien = o.op === carta.correcta;
            veredicto(ver, { bien: bien, msg: o.msg });
            if (bien) { anotar(carta); }
          });
          ops.appendChild(bo);
        });
        div.appendChild(ops);
        div.appendChild(ver);
      } else if (carta.tipo === "pasos") {
        var vista = nueva("estado");
        var prog = nueva("progreso");
        var botones = nueva("botones");
        var sig = document.createElement("button");
        sig.className = "primario";
        sig.textContent = carta.boton || "Siguiente paso";
        var rei = document.createElement("button");
        rei.textContent = "Volver al principio";
        var k = { v: 0 };
        var pintar = function () {
          vista.innerHTML = carta.pasos[k.v].html;
          prog.textContent = "paso " + (k.v + 1) + " de " + carta.pasos.length + ": " + carta.pasos[k.v].texto;
          sig.disabled = k.v === carta.pasos.length - 1;
        };
        sig.addEventListener("click", function () {
          if (k.v < carta.pasos.length - 1) { k.v = k.v + 1; pintar(); }
        });
        rei.addEventListener("click", function () { k.v = 0; pintar(); });
        botones.appendChild(sig);
        botones.appendChild(rei);
        div.appendChild(vista);
        div.appendChild(prog);
        div.appendChild(botones);
        pintar();
      } else if (carta.tipo === "tabla") {
        var env = nueva("envoltura-tabla");
        var tabla = document.createElement("table");
        var cab = document.createElement("thead");
        var trc = document.createElement("tr");
        carta.cabecera.forEach(function (t) {
          var th = document.createElement("th");
          th.innerHTML = t;
          trc.appendChild(th);
        });
        cab.appendChild(trc);
        tabla.appendChild(cab);
        var cuerpoT = document.createElement("tbody");
        tabla.appendChild(cuerpoT);
        env.appendChild(tabla);
        var mostradas = { v: 0 };
        var bt = document.createElement("button");
        bt.className = "primario";
        bt.textContent = carta.boton || "Mostrar la fila siguiente";
        var pintarT = function () {
          cuerpoT.innerHTML = "";
          carta.filas.forEach(function (f, i) {
            var tr = document.createElement("tr");
            f.forEach(function (c, j) {
              var td = document.createElement("td");
              td.textContent = i < mostradas.v || j === 0 ? c : "";
              if (i >= mostradas.v) { td.className = "pend"; }
              tr.appendChild(td);
            });
            cuerpoT.appendChild(tr);
          });
          bt.disabled = mostradas.v === carta.filas.length;
        };
        bt.addEventListener("click", function () {
          if (mostradas.v < carta.filas.length) { mostradas.v = mostradas.v + 1; pintarT(); }
        });
        div.appendChild(env);
        var bts = nueva("botones");
        bts.appendChild(bt);
        div.appendChild(bts);
        if (carta.nota) {
          var nt = nueva("nota");
          nt.innerHTML = carta.nota;
          div.appendChild(nt);
        }
        pintarT();
      }
      raiz.appendChild(div);
    });
    cierre = nueva("carta");
    cierre.style.display = "none";
    cierre.id = "carta-cierre";
    var hc = document.createElement("h2");
    hc.textContent = "Lo que quedó";
    cierre.appendChild(hc);
    var nc = nueva("nota");
    nc.innerHTML = spec.cierre;
    cierre.appendChild(nc);
    raiz.appendChild(cierre);
    return { pendientes: pendientes };
  }

  return { montar: montar, juzgar: juzgar, normalizar: normalizar };
})();

if (typeof module !== "undefined") {
  module.exports = Tarjetas;
}
