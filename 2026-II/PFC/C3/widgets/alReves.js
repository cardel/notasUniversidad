/* AlReves: banco de pruebas. Las tres versiones están a la vista; lo que
   se arma es la llamada. Cada corrida dice cuál de los dos errores queda
   al descubierto y cuál pasa sin que se note. Las tres implementaciones
   reproducen 10_errores_parametro.scala. */
(function () {
  function suma(f, prox, a, b) {
    if (a > b) { return 0; }
    return f(a) + suma(f, prox, prox(a), b);
  }
  function sumaSinProx(f, prox, a, b) {
    if (a > b) { return 0; }
    return f(a) + sumaSinProx(f, prox, a + 1, b);
  }
  function sumaBaseUno(f, prox, a, b) {
    if (a > b) { return 1; }
    return f(a) + sumaBaseUno(f, prox, prox(a), b);
  }

  var EFES = [
    { txt: "x => x", fn: function (x) { return x; } },
    { txt: "x => x * x", fn: function (x) { return x * x; } },
    { txt: "x => 1", fn: function () { return 1; } }
  ];
  var PROXES = [
    { txt: "x => x + 1", fn: function (x) { return x + 1; } },
    { txt: "x => x + 2", fn: function (x) { return x + 2; } },
    { txt: "x => x + 3", fn: function (x) { return x + 3; } },
    { txt: "x => x * 2", fn: function (x) { return x * 2; } }
  ];
  var RANGOS = [
    { txt: "1, 1", a: 1, b: 1 },
    { txt: "1, 4", a: 1, b: 4 },
    { txt: "1, 10", a: 1, b: 10 },
    { txt: "2, 7", a: 2, b: 7 }
  ];

  /* Una corrida: los tres resultados y qué error queda al descubierto. */
  function correr(f, prox, rango) {
    var buena = suma(f.fn, prox.fn, rango.a, rango.b);
    var sinProx = sumaSinProx(f.fn, prox.fn, rango.a, rango.b);
    var baseUno = sumaBaseUno(f.fn, prox.fn, rango.a, rango.b);
    return {
      llamada: "X(" + f.txt + ", " + prox.txt + ", " + rango.txt + ")",
      suma: buena,
      sumaSinProx: sinProx,
      sumaBaseUno: baseUno,
      atrapaSinProx: sinProx !== buena,
      atrapaBaseUno: baseUno !== buena
    };
  }

  /* Todas las llamadas que se pueden armar con los menús. */
  function todas() {
    var salida = [];
    EFES.forEach(function (f) {
      PROXES.forEach(function (p) {
        RANGOS.forEach(function (r) { salida.push(correr(f, p, r)); });
      });
    });
    return salida;
  }

  var API = { suma: suma, sumaSinProx: sumaSinProx, sumaBaseUno: sumaBaseUno,
              EFES: EFES, PROXES: PROXES, RANGOS: RANGOS, correr: correr, todas: todas };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var corridas = [];
  var logrado = false;

  function llenarMenu(id, lista) {
    var sel = document.getElementById(id);
    lista.forEach(function (o, i) {
      var op = document.createElement("option");
      op.value = String(i);
      op.textContent = o.txt;
      sel.appendChild(op);
    });
  }

  function celda(texto, clase) {
    var td = document.createElement("td");
    if (clase) { td.className = clase; }
    td.textContent = texto;
    return td;
  }

  function pintarTabla() {
    var cuerpo = document.getElementById("cuerpo-corridas");
    var tr, td;
    cuerpo.innerHTML = "";
    if (corridas.length === 0) {
      tr = document.createElement("tr");
      td = celda("Todavía no ha corrido ninguna llamada.", "pend");
      td.setAttribute("colspan", "6");
      tr.appendChild(td);
      cuerpo.appendChild(tr);
      return;
    }
    corridas.forEach(function (c) {
      var fila = document.createElement("tr");
      if (c.atrapaSinProx && c.atrapaBaseUno) { fila.className = "doble"; }
      fila.appendChild(celda(c.llamada, "llamada"));
      fila.appendChild(celda(String(c.suma)));
      fila.appendChild(celda(String(c.sumaSinProx)));
      fila.appendChild(celda(String(c.sumaBaseUno)));
      fila.appendChild(celda(c.atrapaSinProx ? "sí" : "no", c.atrapaSinProx ? "si" : "no"));
      fila.appendChild(celda(c.atrapaBaseUno ? "sí" : "no", c.atrapaBaseUno ? "si" : "no"));
      cuerpo.appendChild(fila);
    });
  }

  function comentario(c) {
    if (c.atrapaSinProx && c.atrapaBaseUno) {
      return "Esa llamada sirve: las dos versiones con error dan un número distinto al de suma, " +
        c.sumaSinProx + " y " + c.sumaBaseUno + " contra " + c.suma + ".";
    }
    if (c.atrapaBaseUno) {
      return "Atrapa a sumaBaseUno (" + c.sumaBaseUno + " contra " + c.suma +
        "), pero sumaSinProx da " + c.sumaSinProx + ", lo mismo que suma: con esta llamada su error no se ve. " +
        "Mire el prox y el rango que eligió.";
    }
    return "Ninguna de las dos queda al descubierto con esa llamada.";
  }

  document.getElementById("btn-correr").addEventListener("click", function () {
    var f = EFES[parseInt(document.getElementById("sel-f").value, 10)];
    var p = PROXES[parseInt(document.getElementById("sel-prox").value, 10)];
    var r = RANGOS[parseInt(document.getElementById("sel-rango").value, 10)];
    var c = correr(f, p, r);
    var repetida = corridas.some(function (x) { return x.llamada === c.llamada; });
    if (!repetida) { corridas.push(c); }
    pintarTabla();
    document.getElementById("contador").textContent =
      "llamadas corridas: " + corridas.length + " de " + (EFES.length * PROXES.length * RANGOS.length) + " posibles";
    var v = document.getElementById("veredicto");
    v.className = "veredicto " + (c.atrapaSinProx && c.atrapaBaseUno ? "bien" : "mal");
    v.textContent = comentario(c);
    if (c.atrapaSinProx && c.atrapaBaseUno && !logrado) {
      logrado = true;
      document.getElementById("carta-tres").classList.remove("bloqueado");
    }
  });

  document.querySelectorAll("[data-razon]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.getElementById("veredicto-tres");
      document.querySelectorAll("[data-razon]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      if (b.getAttribute("data-razon") === "ok") {
        v.className = "veredicto bien";
        v.textContent = "Eso es. sumaSinProx avanza con a + 1 y descarta prox; cuando prox es justamente x => x + 1, avanzar de uno y usar prox dan el mismo término, y las dos funciones recorren la misma lista.";
        document.getElementById("carta-cierre").classList.remove("bloqueado");
      } else {
        v.className = "veredicto mal";
        v.textContent = b.getAttribute("data-msg");
      }
    });
  });

  llenarMenu("sel-f", EFES);
  llenarMenu("sel-prox", PROXES);
  llenarMenu("sel-rango", RANGOS);
  pintarTabla();
})();
