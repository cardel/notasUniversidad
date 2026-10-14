/* merge: la funcion interna de msort, sacada del frame "Implementacion de
   Merge Sort (codigo)" y presentada sola. El codigo es el del deck con dos
   espacios menos de sangria, porque alli vive dentro de msort. En cada paso el
   estudiante decide cual de las dos cabezas sale, y la simulacion es la que
   dice si acerto: las opciones salen de la misma recursion, no de una lista
   escrita a mano. La primera pareja es la del frame "Traza de
   msort(List(5, 2, 4, 1))": merge(List(2, 5), List(1, 4)). */
(function () {

  var CODIGO = [
    { num: null, txt: "def merge(l1: List[Int], l2: List[Int]): List[Int] =" },
    { num: 2, txt: "  (l1, l2) match {" },
    { num: 3, txt: "    case (Nil, _) => l2" },
    { num: 4, txt: "    case (_, Nil) => l1" },
    { num: null, txt: "    case (m :: ms, n :: ns) =>" },
    { num: 6, txt: "      if (m < n) m :: merge(ms, l2)" },
    { num: 7, txt: "      else       n :: merge(l1, ns)" },
    { num: null, txt: "  }" }
  ];

  /* Las dos listas de cada pareja llegan ordenadas, que es la condicion con
     que msort llama a merge. */
  var PAREJAS = [
    { l1: [2, 5], l2: [1, 4] },
    { l1: [1, 4], l2: [2, 3, 9] },
    { l1: [3, 6, 8], l2: [1, 2] },
    { l1: [1, 2, 3], l2: [4, 5, 6] }
  ];

  function textoLista(xs) {
    return xs.length === 0 ? "Nil" : "List(" + xs.join(", ") + ")";
  }

  function textoMezcla(l1, l2) {
    return "merge(" + textoLista(l1) + ", " + textoLista(l2) + ")";
  }

  function conPrefijo(salida, cola) {
    return salida.map(String).concat([cola]).join(" :: ");
  }

  function opcionesCabezas(l1, l2) {
    var m = l1[0], n = l2[0], gana = m < n;
    return [
      {
        txt: "sale m = " + m + ", la cabeza de l1",
        ok: gana,
        msg: gana
          ? "Sale m = " + m + ". La condición m < n es verdadera, así que corre " +
            "la rama del if y merge sigue con la cola de l1 y con l2 entera."
          : "El if compara m < n, y con m = " + m + " y n = " + n + " la condición " +
            "es falsa: corre el else y sale n = " + n + ". El " + m + " se queda al " +
            "frente de l1 y vuelve a competir en el paso siguiente."
      },
      {
        txt: "sale n = " + n + ", la cabeza de l2",
        ok: !gana,
        msg: !gana
          ? "Sale n = " + n + ". La condición m < n es falsa, así que corre el else " +
            "y merge sigue con l1 entera y con la cola de l2."
          : "La condición m < n es verdadera con m = " + m + " y n = " + n + ", " +
            "así que el que sale es m = " + m + ". El " + n + " espera su turno al " +
            "frente de l2."
      }
    ];
  }

  function opcionesBase(l1, l2) {
    var vacia = l1.length === 0 ? "l1" : "l2";
    var resto = l1.length === 0 ? l2 : l1;
    var caso = l1.length === 0 ? "(Nil, _)" : "(_, Nil)";
    var cuerpo = l1.length === 0 ? "l2" : "l1";
    return [
      {
        txt: "se devuelve " + cuerpo + " completo: " + textoLista(resto),
        ok: true,
        msg: "Eso es. Con " + vacia + " en Nil coincide el caso " + caso + ", y su " +
          "cuerpo es " + cuerpo + ": lo que queda ya viene ordenado y no hay con qué " +
          "compararlo, así que pasa entero a la salida."
      },
      {
        txt: "se devuelve Nil, porque una de las dos listas se acabó",
        ok: false,
        msg: "El caso " + caso + " coincide porque " + vacia + " es Nil, pero lo que " +
          "devuelve es " + cuerpo + ". Devolver Nil perdería los elementos que todavía " +
          "quedan en " + cuerpo + "."
      },
      {
        txt: "sale solo la cabeza de " + cuerpo + " y merge se vuelve a llamar",
        ok: false,
        msg: "Eso es lo que hacen los dos últimos casos, los que comparan cabezas. " +
          "Cuando una lista llega a Nil la recursión termina: el caso " + caso + " " +
          "entrega " + cuerpo + " de una vez y no vuelve a llamar merge."
      }
    ];
  }

  /* Un paso por cada linea que se evalua. Los pasos que aplican un caso con
     cuerpo llevan sus opciones; los demas van sin pregunta. */
  function simular(pareja) {
    var pasos = [];

    function anotar(linea, extra) {
      var p = {
        linea: linea, mezcla: null, l1: null, l2: null, salida: null,
        salidaDespues: null, caso: null, comparacion: null, sale: null,
        devuelve: null, expr: null, opciones: null
      };
      Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
      pasos.push(p);
    }

    function paso(l1, l2, salida) {
      var mezcla = textoMezcla(l1, l2);
      var m, n, nuevaSalida;
      anotar(2, {
        mezcla: mezcla, l1: textoLista(l1), l2: textoLista(l2),
        salida: textoLista(salida)
      });

      if (l1.length === 0 || l2.length === 0) {
        var resto = l1.length === 0 ? l2 : l1;
        nuevaSalida = salida.concat(resto);
        anotar(l1.length === 0 ? 3 : 4, {
          mezcla: mezcla, l1: textoLista(l1), l2: textoLista(l2),
          salida: textoLista(salida), salidaDespues: textoLista(nuevaSalida),
          caso: l1.length === 0 ? "(Nil, _)" : "(_, Nil)",
          comparacion: (l1.length === 0 ? "l1" : "l2") + " llegó a Nil",
          devuelve: textoLista(resto),
          expr: conPrefijo(salida, textoLista(resto)),
          opciones: opcionesBase(l1, l2)
        });
        return nuevaSalida;
      }

      m = l1[0];
      n = l2[0];
      if (m < n) {
        nuevaSalida = salida.concat([m]);
        anotar(6, {
          mezcla: mezcla, l1: textoLista(l1), l2: textoLista(l2),
          salida: textoLista(salida), salidaDespues: textoLista(nuevaSalida),
          caso: "(m :: ms, n :: ns)",
          comparacion: "m = " + m + " < n = " + n, sale: m,
          expr: conPrefijo(nuevaSalida, textoMezcla(l1.slice(1), l2)),
          opciones: opcionesCabezas(l1, l2)
        });
        return paso(l1.slice(1), l2, nuevaSalida);
      }

      nuevaSalida = salida.concat([n]);
      anotar(7, {
        mezcla: mezcla, l1: textoLista(l1), l2: textoLista(l2),
        salida: textoLista(salida), salidaDespues: textoLista(nuevaSalida),
        caso: "(m :: ms, n :: ns)",
        comparacion: "m = " + m + " < n = " + n + " es falso", sale: n,
        expr: conPrefijo(nuevaSalida, textoMezcla(l1, l2.slice(1))),
        opciones: opcionesCabezas(l1, l2)
      });
      return paso(l1, l2.slice(1), nuevaSalida);
    }

    var total = paso(pareja.l1, pareja.l2, []);
    anotar(null, {
      mezcla: textoMezcla(pareja.l1, pareja.l2), salida: textoLista(total),
      salidaDespues: textoLista(total), devuelve: textoLista(total),
      expr: textoLista(total)
    });
    return pasos;
  }

  function decisiones(pasos) {
    return pasos.filter(function (p) { return p.opciones !== null; });
  }

  var API = {
    CODIGO: CODIGO, PAREJAS: PAREJAS, simular: simular,
    decisiones: decisiones, textoLista: textoLista, textoMezcla: textoMezcla
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var pareja = PAREJAS[0];
  var pasos = simular(pareja);
  var abiertas = decisiones(pasos);
  var k = 0;
  var errores = 0;

  function indiceDe(paso) {
    var idx = -1;
    pasos.forEach(function (p, i) { if (p === paso) { idx = i; } });
    return idx;
  }

  function construirCodigo() {
    var panel = document.getElementById("panel-codigo");
    panel.innerHTML = "";
    CODIGO.forEach(function (l, idx) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      var cont;
      div.className = "linea";
      div.id = "linea-" + idx;
      num.className = "num";
      num.textContent = l.num === null ? "" : l.num;
      txt.className = "txt";
      txt.textContent = l.txt;
      div.appendChild(num);
      div.appendChild(txt);
      if (l.num !== null) {
        cont = document.createElement("span");
        cont.className = "cont";
        cont.id = "cont-" + l.num;
        cont.textContent = "× 0";
        div.appendChild(cont);
      }
      panel.appendChild(div);
    });
  }

  var CHIPS = [
    { campo: "l1", rotulo: "l1" },
    { campo: "l2", rotulo: "l2" },
    { campo: "salida", rotulo: "salida", clase: "cuenta" }
  ];

  function construirChips() {
    var caja = document.getElementById("chips");
    caja.innerHTML = "";
    CHIPS.forEach(function (c) {
      var span = document.createElement("span");
      var b = document.createElement("b");
      span.className = "chip" + (c.clase ? " " + c.clase : "");
      b.id = "chip-" + c.campo;
      b.textContent = "–";
      span.appendChild(document.createTextNode(c.rotulo + " = "));
      span.appendChild(b);
      caja.appendChild(span);
    });
  }

  function limite() {
    return k === 0 ? 0 : indiceDe(abiertas[k - 1]) + 1;
  }

  function pintarCodigo() {
    var conteos = {};
    pasos.slice(0, limite()).forEach(function (p) {
      if (p.linea === null) { return; }
      conteos[p.linea] = (conteos[p.linea] || 0) + 1;
    });
    CODIGO.forEach(function (l, idx) {
      var div = document.getElementById("linea-" + idx);
      var badge;
      div.classList.remove("actual");
      if (l.num === null) { return; }
      badge = document.getElementById("cont-" + l.num);
      badge.textContent = "× " + (conteos[l.num] || 0);
      badge.className = conteos[l.num] ? "cont activo" : "cont";
    });
    if (k > 0) {
      CODIGO.forEach(function (l, idx) {
        if (l.num === abiertas[k - 1].linea) {
          document.getElementById("linea-" + idx).classList.add("actual");
        }
      });
    }
  }

  function pintarChips() {
    var estado = k < abiertas.length ? abiertas[k] : pasos[pasos.length - 1];
    document.getElementById("chip-l1").textContent =
      k < abiertas.length ? estado.l1 : "Nil";
    document.getElementById("chip-l2").textContent =
      k < abiertas.length ? estado.l2 : "Nil";
    document.getElementById("chip-salida").textContent =
      k < abiertas.length ? estado.salida : estado.salidaDespues;
  }

  function pintarHistoria() {
    var caja = document.getElementById("historia");
    var i;
    caja.innerHTML = "";
    var fila0 = document.createElement("div");
    fila0.className = "termino" + (k === 0 ? " vigente" : "");
    var f0 = document.createElement("span");
    f0.className = "flecha-paso";
    f0.textContent = "   ";
    var c0 = document.createElement("span");
    c0.textContent = textoMezcla(pareja.l1, pareja.l2);
    fila0.appendChild(f0);
    fila0.appendChild(c0);
    caja.appendChild(fila0);

    for (i = 0; i < k; i = i + 1) {
      var fila = document.createElement("div");
      var flecha = document.createElement("span");
      var cuerpo = document.createElement("span");
      fila.className = "termino" + (i === k - 1 ? " vigente" : "");
      flecha.className = "flecha-paso";
      flecha.textContent = "→";
      cuerpo.textContent = abiertas[i].expr;
      fila.appendChild(flecha);
      fila.appendChild(cuerpo);
      caja.appendChild(fila);
    }

    if (k === abiertas.length) {
      var cierre = document.createElement("div");
      var fc = document.createElement("span");
      var cc = document.createElement("span");
      cierre.className = "termino vigente";
      fc.className = "flecha-paso";
      fc.textContent = "→";
      cc.textContent = pasos[pasos.length - 1].expr;
      cierre.appendChild(fc);
      cierre.appendChild(cc);
      caja.appendChild(cierre);
    }
  }

  function pintarMarcador() {
    document.getElementById("marcador").textContent =
      "pasos acertados: " + k + " de " + abiertas.length +
      "    ·    predicciones falladas: " + errores;
  }

  function pintarOpciones() {
    var caja = document.getElementById("opciones");
    var rotulo = document.getElementById("rotulo-opciones");
    var ver = document.getElementById("veredicto");
    caja.innerHTML = "";
    ver.className = "veredicto";
    ver.textContent = "";

    if (k >= abiertas.length) {
      rotulo.textContent = "La mezcla terminó en " + pasos[pasos.length - 1].expr + ".";
      document.getElementById("carta-cierre").classList.remove("bloqueado");
      return;
    }

    var actual = abiertas[k];
    rotulo.textContent = "Con l1 = " + actual.l1 + " y l2 = " + actual.l2 +
      ", ¿qué sale en este paso?";
    actual.opciones.forEach(function (o) {
      var b = document.createElement("button");
      b.textContent = o.txt;
      b.addEventListener("click", function () { elegir(o, b); });
      caja.appendChild(b);
    });
  }

  function elegir(o, boton) {
    var ver = document.getElementById("veredicto");
    if (!o.ok) {
      errores = errores + 1;
      boton.className = "errada";
      boton.disabled = true;
      ver.className = "veredicto mal";
      ver.textContent = o.msg;
      pintarMarcador();
      return;
    }
    k = k + 1;
    pintarCodigo();
    pintarChips();
    pintarHistoria();
    pintarOpciones();
    pintarMarcador();
    ver = document.getElementById("veredicto");
    ver.className = "veredicto bien";
    ver.textContent = o.msg;
  }

  function construirPresets() {
    var caja = document.getElementById("presets");
    PAREJAS.forEach(function (par, i) {
      var b = document.createElement("button");
      b.textContent = textoMezcla(par.l1, par.l2);
      b.id = "preset-" + i;
      b.addEventListener("click", function () {
        document.querySelectorAll("#presets button").forEach(function (o) {
          o.className = "";
        });
        b.className = "primario";
        pareja = par;
        pasos = simular(pareja);
        abiertas = decisiones(pasos);
        k = 0;
        errores = 0;
        document.getElementById("carta-cierre").classList.add("bloqueado");
        pintarCodigo();
        pintarChips();
        pintarHistoria();
        pintarOpciones();
        pintarMarcador();
      });
      caja.appendChild(b);
    });
  }

  construirCodigo();
  construirChips();
  construirPresets();
  document.getElementById("preset-0").className = "primario";
  pintarCodigo();
  pintarChips();
  pintarHistoria();
  pintarOpciones();
  pintarMarcador();
})();
