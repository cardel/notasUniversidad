/* Ejercicio interactivo: el recorrido con retroceso de UVa 732 (clase 17). */
var EJERCICIO = (function () {
  var ENTRADA = "sala";
  var SALIDA = "alas";
  var LINEAS = [
    ["void buscar(Pila &p, int metidas, int escritas) {", ""],
    ["  if (escritas == largo) {", ""],
    ["    imprimir();", "bloque-3"],
    ["  } else {", ""],
    ["    if (metidas < largo) {", "bloque-1"],
    ["      p.apilar(entrada[metidas]);", "bloque-1"],
    ["      jugadas[metidas + escritas] = 'i';", "bloque-1"],
    ["      buscar(p, metidas + 1, escritas);", "bloque-1"],
    ["      p.desapilar();", "bloque-1"],
    ["    }", ""],
    ["    if (!p.vacia() && p.tope() == salida[escritas]) {", "bloque-2"],
    ["      Elemento letra = p.tope();", "bloque-2"],
    ["      p.desapilar();", "bloque-2"],
    ["      jugadas[metidas + escritas] = 'o';", "bloque-2"],
    ["      buscar(p, metidas, escritas + 1);", "bloque-2"],
    ["      p.apilar(letra);", "bloque-2"],
    ["    }", ""],
    ["  }", ""],
    ["}", ""]
  ];
  var LINEA_I = 7;
  var LINEA_O = 14;
  var LINEA_IMPRIMIR = 2;

  /* El mismo recorrido del programa: la rama de meter se agota antes de abrir
     la de sacar, y la pila es un solo objeto que todas las llamadas comparten.
     Cada llamada deja una foto del estado con que entra. */
  function recorrer(entrada, salida) {
    var largo = entrada.length;
    var pila = [];
    var jugadas = [];
    var pasos = [];
    var profAnterior = -1;

    function anotar(metidas, escritas, letraO) {
      var prof = jugadas.length;
      var tope = pila.length === 0 ? null : pila[pila.length - 1];
      var toca = escritas < largo ? salida.charAt(escritas) : null;
      var puedeI = metidas < largo;
      var puedeO = tope !== null && toca !== null && tope === toca;
      var tipo = "sigue";
      if (escritas === largo) {
        tipo = "imprime";
      } else if (!puedeI && !puedeO) {
        tipo = "callejon";
      }
      var linea = jugadas.length === 0 ? null : (letraO === "i" ? LINEA_I : LINEA_O);
      if (tipo === "imprime") {
        linea = LINEA_IMPRIMIR;
      }
      pasos.push({
        jugada: letraO,
        secuencia: jugadas.slice(),
        pila: pila.slice().reverse(),
        escrito: salida.slice(0, escritas),
        metidas: metidas,
        escritas: escritas,
        porMeter: puedeI ? entrada.charAt(metidas) : null,
        tope: tope,
        toca: toca,
        puedeI: puedeI,
        puedeO: puedeO,
        tipo: tipo,
        linea: linea,
        deshechas: profAnterior < 0 ? 0 : profAnterior - prof + 1
      });
      profAnterior = prof;
    }

    function buscar(metidas, escritas, letraO) {
      anotar(metidas, escritas, letraO);
      if (escritas < largo) {
        if (metidas < largo) {
          pila.push(entrada.charAt(metidas));
          jugadas.push("i");
          buscar(metidas + 1, escritas, "i");
          jugadas.pop();
          pila.pop();
        }
        if (pila.length > 0 && pila[pila.length - 1] === salida.charAt(escritas)) {
          var letra = pila[pila.length - 1];
          pila.pop();
          jugadas.push("o");
          buscar(metidas, escritas + 1, "o");
          jugadas.pop();
          pila.push(letra);
        }
      }
    }

    buscar(0, 0, null);
    return pasos;
  }

  /* Las secuencias que el recorrido imprime, en el orden en que salen. */
  function secuencias(entrada, salida) {
    return recorrer(entrada, salida)
      .filter(function (p) { return p.tipo === "imprime"; })
      .map(function (p) { return p.secuencia.join(" "); });
  }

  function cuantos(entrada, salida, tipo) {
    return recorrer(entrada, salida)
      .filter(function (p) { return p.tipo === tipo; }).length;
  }

  return { entrada: ENTRADA, salida: SALIDA, lineas: LINEAS,
           recorrer: recorrer, secuencias: secuencias, cuantos: cuantos };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      lineas.forEach(function (par, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (par[1] ? " " + par[1] : "");
        linea.id = id + "-l" + i;
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = par[0];
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }
    function normalizar(texto) {
      return texto.toLowerCase().replace(/[^io]/g, "");
    }
    var logradas = { paseo: false, secuencias: false };
    function revisar() {
      if (logradas.paseo && logradas.secuencias) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var PASOS = EJERCICIO.recorrer(EJERCICIO.entrada, EJERCICIO.salida);
    var SECUENCIAS = EJERCICIO.secuencias(EJERCICIO.entrada, EJERCICIO.salida);
    pintarCodigo("codigo-buscar", EJERCICIO.lineas);

    var vista = { i: 0 };
    function chip(padre, rotulo, valor, cuenta) {
      var d = document.createElement("div");
      d.className = "chip" + (cuenta ? " cuenta" : "");
      var b = document.createElement("b");
      b.textContent = rotulo + ": ";
      d.appendChild(b);
      d.appendChild(document.createTextNode(String(valor)));
      padre.appendChild(d);
    }
    function razonI(paso) {
      return paso.puedeI
        ? "sí, mete la " + paso.porMeter
        : "no, las " + EJERCICIO.entrada.length + " letras ya están metidas";
    }
    function razonO(paso) {
      var r = "";
      if (paso.puedeO) {
        r = "sí, el tope " + paso.tope + " es la letra que toca escribir";
      } else if (paso.tope === null) {
        r = "no, la pila está vacía";
      } else if (paso.toca === null) {
        r = "no, la salida ya está completa";
      } else {
        r = "no, el tope es " + paso.tope + " y la salida necesita " + paso.toca;
      }
      return r;
    }
    function pintarVista() {
      var paso = PASOS[vista.i];
      var chips = document.getElementById("chips-paso");
      var sec = document.getElementById("secuencia-paso");
      var pila = document.getElementById("pila-paso");
      chips.innerHTML = "";
      sec.innerHTML = "";
      pila.innerHTML = "";
      chip(chips, "metidas", paso.metidas, true);
      chip(chips, "escritas", paso.escritas, true);
      chip(chips, "escrito", paso.escrito === "" ? "nada" : paso.escrito, false);
      chip(chips, "jugada i", razonI(paso), false);
      chip(chips, "jugada o", razonO(paso), false);

      var rotulo = document.createElement("span");
      rotulo.className = "flecha";
      rotulo.textContent = "jugadas:";
      sec.appendChild(rotulo);
      if (paso.secuencia.length === 0) {
        var ninguna = document.createElement("span");
        ninguna.className = "flecha";
        ninguna.textContent = "ninguna todavía";
        sec.appendChild(ninguna);
      }
      paso.secuencia.forEach(function (j) {
        var f = document.createElement("span");
        f.className = "ficha";
        f.textContent = j;
        sec.appendChild(f);
      });

      var rp = document.createElement("span");
      rp.className = "flecha";
      rp.textContent = "pila, tope a la izquierda:";
      pila.appendChild(rp);
      if (paso.pila.length === 0) {
        var vacia = document.createElement("span");
        vacia.className = "flecha";
        vacia.textContent = "vacía";
        pila.appendChild(vacia);
      }
      paso.pila.forEach(function (letra) {
        var f = document.createElement("span");
        f.className = "ficha";
        f.textContent = letra;
        pila.appendChild(f);
      });

      EJERCICIO.lineas.forEach(function (par, i) {
        var caja = document.getElementById("codigo-buscar-l" + i);
        caja.className = "linea" + (par[1] ? " " + par[1] : "") +
          (paso.linea === i ? " actual" : "");
      });

      var cuenta = "estado " + (vista.i + 1) + " de " + PASOS.length;
      var llegada = "";
      if (paso.jugada === null) {
        llegada = "la primera llamada, con la pila vacía y nada escrito";
      } else {
        llegada = "se llegó con la jugada " + paso.jugada;
        if (paso.deshechas === 1) {
          llegada = "se deshizo una jugada y se tomó la jugada " + paso.jugada;
        } else if (paso.deshechas > 1) {
          llegada = "se deshicieron " + paso.deshechas +
            " jugadas y se tomó la jugada " + paso.jugada;
        }
      }
      var cierre = "";
      if (paso.tipo === "imprime") {
        cierre = " · la salida está completa: se imprime " + paso.secuencia.join(" ");
      } else if (paso.tipo === "callejon") {
        cierre = " · ninguna de las dos jugadas se puede: la llamada devuelve sin imprimir";
      }
      document.getElementById("progreso-paso").textContent = cuenta + " · " + llegada + cierre;
      document.getElementById("btn-paso").disabled = vista.i === PASOS.length - 1;
      if (vista.i === PASOS.length - 1) {
        logradas.paseo = true;
        revisar();
      }
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.i < PASOS.length - 1) { vista.i = vista.i + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.i = 0; pintarVista();
    });
    pintarVista();

    document.getElementById("btn-secuencias").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-secuencias");
      var dadas = [normalizar(document.getElementById("pred-sec1").value),
                   normalizar(document.getElementById("pred-sec2").value)];
      var buenas = SECUENCIAS.map(normalizar);
      var validas = dadas.filter(function (s) { return buenas.indexOf(s) !== -1; });
      if (dadas[0] === buenas[0] && dadas[1] === buenas[1]) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + SECUENCIAS.join(" y ") +
          ". La primera mete las cuatro letras y las saca en bloque, porque alas es sala al revés. La segunda para de meter en cuanto la primera a queda en el tope.";
        logradas.secuencias = true; revisar();
      } else if (dadas[0] === buenas[1] && dadas[1] === buenas[0]) {
        ver.className = "veredicto mal";
        ver.textContent = "Las dos son válidas, en el orden contrario al que el programa las imprime. Entre dos secuencias del mismo caso, la que tiene i en la primera posición donde difieren va antes, y agotar la rama de meter antes de abrir la de sacar las saca ya ordenadas.";
      } else if (validas.length === 1) {
        ver.className = "veredicto mal";
        ver.textContent = "Una de las dos sirve, " + validas[0].split("").join(" ") +
          "; la otra no aparece en el recorrido. Los estados marcados con callejón son los que no llegan a imprimir nada.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Ninguna de las dos. Toda secuencia válida tiene cuatro i y cuatro o, y ningún prefijo puede llevar más o que i. El paso a paso de arriba marca los dos estados donde la salida queda completa.";
      }
    });

    document.getElementById("dato-estados").textContent = String(PASOS.length);
    document.getElementById("dato-callejones").textContent =
      String(EJERCICIO.cuantos(EJERCICIO.entrada, EJERCICIO.salida, "callejon"));
  })();
}
