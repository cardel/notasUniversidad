/* Ejercicio interactivo: que jugadas de UVa 732 se pueden y que fallan (clase 17). */
var EJERCICIO = (function () {
  var CASO1 = ["nido", "odin"];
  var CANDIDATAS1 = {
    completa: "i i i i o o o o",
    vacia: "o i i i i o o o",
    tope: "i i i o o o i o",
    corta: "i i i i o o o"
  };
  var CASO2 = ["tela", "elat"];
  var CANDIDATA2 = "i i i o o o i o";
  var PAREJAS3 = {
    cosa: ["cosa", "saco"],
    dado: ["dado", "odad"],
    lata: ["lata", "atal"],
    tela: ["tela", "elat"]
  };

  /* Las secuencias que el programa imprime para un par, en su orden. */
  function analizar(entrada, salida) {
    var largo = entrada.length;
    var pila = [];
    var jugadas = [];
    var secuencias = [];

    function buscar(metidas, escritas) {
      if (escritas === largo) {
        secuencias.push(jugadas.join(" "));
      } else {
        if (metidas < largo) {
          pila.push(entrada.charAt(metidas));
          jugadas.push("i");
          buscar(metidas + 1, escritas);
          jugadas.pop();
          pila.pop();
        }
        if (pila.length > 0 && pila[pila.length - 1] === salida.charAt(escritas)) {
          var letra = pila[pila.length - 1];
          pila.pop();
          jugadas.push("o");
          buscar(metidas, escritas + 1);
          jugadas.pop();
          pila.push(letra);
        }
      }
    }

    if (entrada.length === salida.length) {
      buscar(0, 0);
    }
    return secuencias;
  }

  /* Corre una secuencia candidata con las reglas del programa: la i exige que
     queden letras por meter y la o exige pila no vacia con el tope igual a la
     letra que la salida necesita. Devuelve donde se rompe y por que. */
  function correr(entrada, salida, candidata) {
    var jugadas = candidata.replace(/[^io]/g, "").split("");
    var largo = entrada.length;
    var pila = [];
    var metidas = 0;
    var escritas = 0;
    var falla = null;
    jugadas.forEach(function (j, k) {
      if (falla === null) {
        if (j === "i" && metidas === largo) {
          falla = { motivo: "sin-letras", jugada: k + 1 };
        } else if (j === "i") {
          pila.push(entrada.charAt(metidas));
          metidas = metidas + 1;
        } else if (escritas === largo) {
          falla = { motivo: "salida-llena", jugada: k + 1 };
        } else if (pila.length === 0) {
          falla = { motivo: "pila-vacia", jugada: k + 1 };
        } else if (pila[pila.length - 1] !== salida.charAt(escritas)) {
          falla = { motivo: "tope-distinto", jugada: k + 1,
                    tope: pila[pila.length - 1], toca: salida.charAt(escritas) };
        } else {
          pila.pop();
          escritas = escritas + 1;
        }
      }
    });
    if (falla === null && escritas < largo) {
      falla = { motivo: "incompleta", jugada: jugadas.length };
    }
    return { ok: falla === null, falla: falla, jugadas: jugadas.length,
             escrito: salida.slice(0, escritas),
             pila: pila.slice().reverse() };
  }

  return { caso1: CASO1, candidatas1: CANDIDATAS1, caso2: CASO2,
           candidata2: CANDIDATA2, parejas3: PAREJAS3,
           analizar: analizar, correr: correr };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var logradas = { secuencia: false, motivo: false, vacio: false };
    function revisar() {
      if (logradas.secuencia && logradas.motivo && logradas.vacio) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    function pintarFichas(id, candidata) {
      var caja = document.getElementById(id);
      caja.innerHTML = "";
      candidata.replace(/[^io]/g, "").split("").forEach(function (j, k) {
        var f = document.createElement("span");
        f.className = "ficha";
        f.textContent = (k + 1) + ": " + j;
        caja.appendChild(f);
      });
    }
    /* El motivo exacto con que el programa descarta la candidata. */
    function porQueFalla(entrada, salida, candidata) {
      var r = EJERCICIO.correr(entrada, salida, candidata);
      var f = r.falla;
      var m = "";
      if (f === null) {
        m = "convierte " + entrada + " en " + salida + ".";
      } else if (f.motivo === "pila-vacia") {
        m = "en la jugada " + f.jugada + " la o saca de una pila vacía, y desapilar exige !vacia(), así que esa jugada no existe para el programa.";
      } else if (f.motivo === "tope-distinto") {
        m = "en la jugada " + f.jugada + " el tope es " + f.tope +
            " y la salida necesita " + f.toca + ". Sacar escribiría " + f.tope +
            ", y lo escrito no se borra.";
      } else if (f.motivo === "sin-letras") {
        m = "en la jugada " + f.jugada + " la i mete una letra que no existe, porque las " +
            entrada.length + " letras de " + entrada + " ya están metidas.";
      } else if (f.motivo === "salida-llena") {
        m = "en la jugada " + f.jugada + " la o escribe una letra de más, porque " + salida +
            " ya está completa.";
      } else {
        m = "termina con " + r.jugadas + " jugadas, escribe " + r.escrito +
            " y deja " + r.pila.join(" ") + " en la pila. Toda secuencia válida tiene " +
            entrada.length + " letras i y " + entrada.length + " letras o.";
      }
      return m;
    }

    var CASO1 = EJERCICIO.caso1;
    pintarFichas("fichas-candidata", EJERCICIO.candidata2);

    document.querySelectorAll("#opciones-secuencia button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-secuencia");
        var clave = boton.dataset.op;
        var cand = EJERCICIO.candidatas1[clave];
        var r = EJERCICIO.correr(CASO1[0], CASO1[1], cand);
        if (r.ok) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: " + cand + " " +
            porQueFalla(CASO1[0], CASO1[1], cand) +
            " Es la única, porque " + CASO1[1] + " es " + CASO1[0] +
            " al revés y las cuatro letras son distintas: el tope coincide con la letra que toca en un solo momento, cuando ya están las cuatro metidas.";
          logradas.secuencia = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = "No: " + porQueFalla(CASO1[0], CASO1[1], cand);
        }
      });
    });

    var MOTIVOS = {
      tope: null,
      vacia: "Ningún prefijo de esa candidata lleva más o que i, así que la pila nunca queda vacía cuando llega una o. Ese es otro error, y aquí no es el que ocurre.",
      sinletras: "Tiene exactamente cuatro i, una por cada letra de tela, así que ninguna i mete una letra que no exista.",
      sobra: "El programa descarta la candidata antes de llegar al final, así que no alcanza a dejar nada en la pila: la cuenta de letras es la correcta, cuatro i y cuatro o."
    };
    document.querySelectorAll("#opciones-motivo button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-motivo");
        var m = MOTIVOS[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: " +
            porQueFalla(EJERCICIO.caso2[0], EJERCICIO.caso2[1], EJERCICIO.candidata2) +
            " La única secuencia de ese par es " +
            EJERCICIO.analizar(EJERCICIO.caso2[0], EJERCICIO.caso2[1])[0] +
            ": se para de meter en cuanto la e queda en el tope.";
          logradas.motivo = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    var EXTRAS = {
      cosa: " En cosa la c se mete antes que la o, así que la o queda encima de la c mientras las dos estén dentro. saco pide la c antes de la o, y no hay jugada que saque una letra de debajo de otra.",
      dado: "",
      lata: "",
      tela: ""
    };
    document.querySelectorAll("#opciones-vacio button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-vacio");
        var par = EJERCICIO.parejas3[boton.dataset.op];
        var secs = EJERCICIO.analizar(par[0], par[1]);
        if (secs.length === 0) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: " + par[0] + " contra " + par[1] +
            " no imprime ninguna línea, y aun así imprime los corchetes." +
            EXTRAS[boton.dataset.op];
          logradas.vacio = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = par[0] + " contra " + par[1] + " imprime " +
            (secs.length === 1 ? "una línea: " : secs.length + " líneas: ") +
            secs.join("; ") + ".";
        }
      });
    });
  })();
}
