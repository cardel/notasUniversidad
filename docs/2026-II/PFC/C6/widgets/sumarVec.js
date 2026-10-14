/* sumarVec: la version con tuplas del deck de listas y tuplas, con la traza
   paso a paso que alli aparece en tabla. El codigo sale literal de los frames
   "Solucion: reconocimiento de patrones con tuplas" y "Traza paso a paso:
   sumarVec". La simulacion evalua el (u, v) match en el orden en que estan
   escritos los cuatro casos, de modo que las parejas de distinto tamanio caen
   en los casos (Nil, _) y (_, Nil) y la ejecucion se detiene ahi. */
(function () {

  var CODIGO = [
    { num: null, txt: "def sumarVec(u: List[Int], v: List[Int]): List[Int] =" },
    { num: 2, txt: "  (u, v) match {" },
    { num: 3, txt: "    case (Nil, Nil)           => Nil" },
    { num: null, txt: "    case (Nil, _)             =>" },
    { num: 5, txt: "      throw new Exception(\"Distinto tamanio\")" },
    { num: null, txt: "    case (_, Nil)             =>" },
    { num: 7, txt: "      throw new Exception(\"Distinto tamanio\")" },
    { num: null, txt: "    case (x :: xs, y :: ys)   =>", bloque: 1 },
    { num: 9, txt: "      (x + y) :: sumarVec(xs, ys)", bloque: 1 },
    { num: 10, txt: "  }" }
  ];

  var PARES = [
    { u: [1, 2, 3], v: [10, 20, 30] },
    { u: [4, 7], v: [6, 1] },
    { u: [1, 2, 3], v: [10, 20] },
    { u: [1, 2], v: [5, 6, 7] }
  ];

  function textoLista(xs) {
    return xs.length === 0 ? "Nil" : "List(" + xs.join(", ") + ")";
  }

  function textoTupla(u, v) {
    return "(" + textoLista(u) + ", " + textoLista(v) + ")";
  }

  /* Un paso por cada linea que se evalua. Los casos con throw cortan la
     ejecucion: lo que ya estaba cons-eado al frente nunca llega a ser lista. */
  function simular(par) {
    var pasos = [];
    var sumas = [];
    var estado = { fallo: false };

    function anotar(linea, extra) {
      var p = {
        linea: linea, tupla: null, par: null, suma: null, acum: null,
        caso: null, parcial: null, devuelve: null, resultado: null, falla: null
      };
      Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
      pasos.push(p);
    }

    function parcialCon(pendiente) {
      return sumas.map(String).concat([pendiente]).join(" :: ");
    }

    function visitar(u, v, nivel) {
      var tupla = textoTupla(u, v);
      var x, y, resto, total;
      anotar(2, { tupla: tupla, acum: textoLista(sumas) });

      if (u.length === 0 && v.length === 0) {
        anotar(3, {
          tupla: tupla, caso: "(Nil, Nil)", acum: textoLista(sumas),
          parcial: parcialCon("Nil"), devuelve: "Nil"
        });
        anotar(10, {
          tupla: tupla, acum: textoLista(sumas), devuelve: "Nil",
          resultado: nivel === 0 ? "List()" : null
        });
        return [];
      }

      if (u.length === 0) {
        estado.fallo = true;
        anotar(5, {
          tupla: tupla, caso: "(Nil, _)", acum: textoLista(sumas),
          parcial: "Exception(\"Distinto tamanio\")",
          devuelve: "Exception(\"Distinto tamanio\")",
          falla: "u se acabó y v todavía tiene " + textoLista(v)
        });
        return null;
      }

      if (v.length === 0) {
        estado.fallo = true;
        anotar(7, {
          tupla: tupla, caso: "(_, Nil)", acum: textoLista(sumas),
          parcial: "Exception(\"Distinto tamanio\")",
          devuelve: "Exception(\"Distinto tamanio\")",
          falla: "v se acabó y u todavía tiene " + textoLista(u)
        });
        return null;
      }

      x = u[0];
      y = v[0];
      sumas.push(x + y);
      anotar(9, {
        tupla: tupla, caso: "(x :: xs, y :: ys)",
        par: "x = " + x + ", y = " + y, suma: x + y,
        acum: textoLista(sumas),
        parcial: parcialCon("sumarVec(" + textoLista(u.slice(1)) + ", " +
          textoLista(v.slice(1)) + ")")
      });

      resto = visitar(u.slice(1), v.slice(1), nivel + 1);
      if (resto === null) { return null; }
      total = [x + y].concat(resto);
      anotar(10, {
        tupla: tupla, acum: textoLista(sumas), devuelve: textoLista(total),
        resultado: nivel === 0 ? textoLista(total) : null
      });
      return total;
    }

    visitar(par.u, par.v, 0);
    return pasos;
  }

  /* La lista que devuelve la llamada, o null cuando los tamanios no coinciden. */
  function resultado(par) {
    if (par.u.length !== par.v.length) { return null; }
    return par.u.map(function (x, i) { return x + par.v[i]; });
  }

  var API = {
    CODIGO: CODIGO, PARES: PARES, simular: simular, resultado: resultado,
    textoLista: textoLista, textoTupla: textoTupla
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  function rotuloPar(par) {
    return "sumarVec(" + textoLista(par.u) + ", " + textoLista(par.v) + ")";
  }

  function construirPresets() {
    var caja = document.getElementById("presets");
    PARES.forEach(function (par, i) {
      var b = document.createElement("button");
      b.textContent = rotuloPar(par);
      b.id = "preset-" + i;
      b.addEventListener("click", function () {
        document.querySelectorAll("#presets button").forEach(function (o) {
          o.className = "";
        });
        b.className = "primario";
        document.getElementById("carta-cierre").classList.add("bloqueado");
        Motor.reiniciar(par);
      });
      caja.appendChild(b);
    });
  }

  function filaTabla(celdas, clase) {
    var tr = document.createElement("tr");
    celdas.forEach(function (c, i) {
      var td = document.createElement("td");
      td.textContent = c;
      if (i > 0) { td.className = "expr"; }
      tr.appendChild(td);
    });
    if (clase) { tr.className = clase; }
    return tr;
  }

  function pintarTabla(e) {
    var tabla = document.getElementById("tabla-traza");
    var fila = 0;
    tabla.innerHTML = "";
    tabla.appendChild((function () {
      var tr = document.createElement("tr");
      ["paso", "tupla (u, v)", "caso aplicado", "resultado parcial"]
        .forEach(function (t) {
          var th = document.createElement("th");
          th.textContent = t;
          tr.appendChild(th);
        });
      return tr;
    })());

    e.pasos.slice(0, e.k).forEach(function (p) {
      if (p.caso !== null) {
        fila = fila + 1;
        tabla.appendChild(filaTabla(
          [String(fila), p.tupla, p.caso, p.parcial],
          p.falla === null ? null : "fila-falla"
        ));
        return;
      }
      if (p.resultado !== null) {
        fila = fila + 1;
        tabla.appendChild(filaTabla([String(fila), "–", "–", p.resultado]));
      }
    });

    if (fila === 0) {
      tabla.appendChild(filaTabla(["–", "–", "–", "la traza arranca con el primer paso"]));
    }
  }

  function alPintar(e) {
    var parcial = "–";
    var aviso = document.getElementById("aviso");
    var ultimoFallo = null;
    e.pasos.slice(0, e.k).forEach(function (p) {
      if (p.parcial !== null) { parcial = p.parcial; }
      if (p.falla !== null) { ultimoFallo = p; }
    });
    document.getElementById("parcial").textContent = parcial;
    pintarTabla(e);

    if (ultimoFallo === null) {
      aviso.textContent = "";
      aviso.style.display = "none";
    } else {
      aviso.style.display = "block";
      aviso.textContent = "La tupla llegó a " + ultimoFallo.tupla + ": " +
        ultimoFallo.falla + ". El caso " + ultimoFallo.caso + " lanza la " +
        "excepción, y las sumas de los pasos anteriores se pierden: ninguna " +
        "llegó a quedar en una lista.";
    }

    if (e.terminado && e.k > 0) {
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    }
  }

  construirPresets();
  document.getElementById("preset-0").className = "primario";

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: PARES[0],
    simular: simular,
    chips: [
      { campo: "tupla", rotulo: "(u, v)" },
      { campo: "par", rotulo: "par" },
      { campo: "suma", rotulo: "x + y" },
      { campo: "acum", rotulo: "sumas", clase: "cuenta" }
    ],
    alPintar: alPintar
  });
})();
