/* polimorfico: el merge sort generico de los frames "Merge Sort generico:
   parametrizacion de tipos" y "Merge Sort polimorfico". El codigo es el del
   deck, con [T] en la firma y menorQue como segunda lista de parametros. La
   simulacion corre ese mismo cuerpo con la comparacion que se le pase, y de
   ahi salen las respuestas de la ultima pregunta: ninguna esta escrita a mano.
   Las tres corridas del frame de uso se muestran con el resultado que devuelve
   la simulacion. */
(function () {

  var CODIGO = [
    { num: null, txt: "def msort[T](xs: List[T])(menorQue: (T, T) => Boolean): List[T] = {", bloque: 1 },
    { num: null, txt: "  def merge(l1: List[T], l2: List[T]): List[T] =" },
    { num: 3, txt: "    (l1, l2) match {" },
    { num: 4, txt: "      case (Nil, _) => l2" },
    { num: 5, txt: "      case (_, Nil) => l1" },
    { num: null, txt: "      case (m :: ms, n :: ns) =>" },
    { num: 7, txt: "        if (menorQue(m, n)) m :: merge(ms, l2)", bloque: 2 },
    { num: 8, txt: "        else                n :: merge(l1, ns)", bloque: 2 },
    { num: null, txt: "    }" },
    { num: 10, txt: "  val n = xs.length / 2" },
    { num: 11, txt: "  if (n == 0) xs" },
    { num: null, txt: "  else {" },
    { num: 13, txt: "    val (izq, der) = xs.splitAt(n)" },
    { num: 14, txt: "    merge(msort(izq)(menorQue), msort(der)(menorQue))", bloque: 3 },
    { num: 15, txt: "  }" },
    { num: null, txt: "}" }
  ];

  var COMPARACIONES = {
    menor: {
      txt: "(x: Int, y: Int) => x < y",
      fn: function (x, y) { return x < y; }
    },
    mayor: {
      txt: "(x: Int, y: Int) => x > y",
      fn: function (x, y) { return x > y; }
    },
    menorTexto: {
      txt: "(x: String, y: String) => x < y",
      fn: function (x, y) { return x < y; }
    }
  };

  var USOS = [
    { xs: [5, 2, 4, 1], comp: "menor", tipo: "List[Int]" },
    { xs: [5, 2, 4, 1], comp: "mayor", tipo: "List[Int]" },
    { xs: ["banana", "avena", "cereza"], comp: "menorTexto", tipo: "List[String]" }
  ];

  function textoLista(xs) {
    return xs.length === 0 ? "Nil" : "List(" + xs.join(", ") + ")";
  }

  /* Un String se escribe entre comillas en el codigo fuente y sin ellas en lo
     que imprime el interprete, igual que en el frame de uso del deck. */
  function textoFuente(xs) {
    var piezas = xs.map(function (x) {
      return typeof x === "string" ? "\"" + x + "\"" : String(x);
    });
    return piezas.length === 0 ? "Nil" : "List(" + piezas.join(", ") + ")";
  }

  function textoLlamada(uso) {
    return "msort(" + textoFuente(uso.xs) + ")(" + COMPARACIONES[uso.comp].txt + ")";
  }

  /* Un paso por cada linea que se evalua, con la comparacion que llego por
     parametro. El cuerpo es el mismo para cualquier tipo: lo unico que cambia
     entre una corrida y otra es menorQue. */
  function simular(uso) {
    var menorQue = COMPARACIONES[uso.comp].fn;
    var pasos = [];

    function anotar(linea, extra) {
      var p = {
        linea: linea, llamada: null, nivel: null, mezcla: null,
        comparacion: null, sale: null, salida: null, caso: null,
        devuelve: null, resultado: null
      };
      Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
      pasos.push(p);
    }

    function mezclar(l1, l2, nivel, salida) {
      var mezcla = "(" + textoLista(l1) + ", " + textoLista(l2) + ")";
      var m, n, resto;
      anotar(3, { nivel: nivel, mezcla: mezcla, salida: textoLista(salida) });

      if (l1.length === 0) {
        anotar(4, {
          nivel: nivel, mezcla: mezcla, caso: "(Nil, _)",
          devuelve: textoLista(l2), salida: textoLista(salida.concat(l2))
        });
        return l2;
      }
      if (l2.length === 0) {
        anotar(5, {
          nivel: nivel, mezcla: mezcla, caso: "(_, Nil)",
          devuelve: textoLista(l1), salida: textoLista(salida.concat(l1))
        });
        return l1;
      }

      m = l1[0];
      n = l2[0];
      if (menorQue(m, n)) {
        anotar(7, {
          nivel: nivel, mezcla: mezcla, caso: "(m :: ms, n :: ns)",
          comparacion: "menorQue(" + m + ", " + n + ") es true", sale: m,
          salida: textoLista(salida.concat([m]))
        });
        resto = mezclar(l1.slice(1), l2, nivel, salida.concat([m]));
        return [m].concat(resto);
      }
      anotar(8, {
        nivel: nivel, mezcla: mezcla, caso: "(m :: ms, n :: ns)",
        comparacion: "menorQue(" + m + ", " + n + ") es false", sale: n,
        salida: textoLista(salida.concat([n]))
      });
      resto = mezclar(l1, l2.slice(1), nivel, salida.concat([n]));
      return [n].concat(resto);
    }

    function ordenar(xs, nivel) {
      var n = Math.floor(xs.length / 2);
      var izq, der, mezclada;
      anotar(10, { nivel: nivel, llamada: textoLista(xs) });
      if (n === 0) {
        anotar(11, {
          nivel: nivel, llamada: textoLista(xs), devuelve: textoLista(xs),
          resultado: nivel === 0 ? textoLista(xs) : null
        });
        return xs.slice();
      }
      anotar(11, { nivel: nivel, llamada: textoLista(xs) });
      anotar(13, {
        nivel: nivel, llamada: textoLista(xs),
        mezcla: "(" + textoLista(xs.slice(0, n)) + ", " + textoLista(xs.slice(n)) + ")"
      });
      izq = ordenar(xs.slice(0, n), nivel + 1);
      der = ordenar(xs.slice(n), nivel + 1);
      anotar(14, {
        nivel: nivel, llamada: textoLista(xs),
        mezcla: "(" + textoLista(izq) + ", " + textoLista(der) + ")"
      });
      mezclada = mezclar(izq, der, nivel, []);
      anotar(15, {
        nivel: nivel, llamada: textoLista(xs), devuelve: textoLista(mezclada),
        resultado: nivel === 0 ? textoLista(mezclada) : null
      });
      return mezclada;
    }

    ordenar(uso.xs, 0);
    return pasos;
  }

  function resultado(uso) {
    var pasos = simular(uso);
    return pasos[pasos.length - 1].devuelve;
  }

  /* Las cuatro preguntas. La ultima arma sus opciones con lo que devuelve la
     simulacion de cada comparacion. */
  function preguntas() {
    var conMenor = resultado(USOS[0]);
    var conMayor = resultado(USOS[1]);
    return [
      {
        titulo: "¿Qué hace falta para que msort ordene listas de cualquier tipo?",
        opciones: [
          {
            txt: "Parametrizar el tipo con msort[T] y recibir la comparación como " +
              "una segunda lista de parámetros: (menorQue: (T, T) => Boolean).",
            ok: true,
            msg: "Eso es. El tipo deja de estar fijo en Int y la operación que no " +
              "existe para un T cualquiera entra por parámetro, escrita por quien llama."
          },
          {
            txt: "Escribir msort[T](xs: List[T]) y dejar el if (m < n) como estaba.",
            ok: false,
            msg: "El parámetro de tipo solo cambia la firma. Adentro sigue estando " +
              "m < n, y < no está definido para un T arbitrario: el compilador rechaza " +
              "esa comparación."
          },
          {
            txt: "Escribir una versión de msort por cada tipo que se quiera ordenar.",
            ok: false,
            msg: "Eso ordena, con un cuerpo repetido por tipo. Y el cuerpo de msort no " +
              "depende del tipo: lo único que cambia entre ordenar enteros y ordenar " +
              "textos es cómo se comparan dos elementos."
          },
          {
            txt: "Convertir los elementos a Int antes de ordenar y devolverlos al tipo " +
              "original.",
            ok: false,
            msg: "No hay forma de convertir un String a Int conservando el orden " +
              "alfabético, y la lista que se devuelve dejaría de ser List[T]. Lo que se " +
              "recibe es la comparación, no los datos convertidos."
          }
        ]
      },
      {
        titulo: "Si msort[T] se queda con el if (m < n) y sin el parámetro menorQue, " +
          "¿qué pasa?",
        opciones: [
          {
            txt: "No compila: el operador < no está definido para un tipo T cualquiera.",
            ok: true,
            msg: "Eso es. Para Int el < existe; para un T abierto el compilador no tiene " +
              "ninguna comparación que llamar, y el error aparece al compilar, no al ordenar."
          },
          {
            txt: "Compila, y falla al correr cuando llegan dos elementos que no se pueden " +
              "comparar.",
            ok: false,
            msg: "El error es anterior. El compilador revisa el cuerpo con el tipo " +
              "declarado en la firma, y ahí ya no hay un < para T, así que la función " +
              "nunca llega a correr."
          },
          {
            txt: "Compila y ordena por la posición en que venían los elementos.",
            ok: false,
            msg: "Sin comparación no hay criterio de orden, y el compilador no pone uno " +
              "por su cuenta. El cuerpo pide comparar dos elementos y esa operación tiene " +
              "que existir para T."
          },
          {
            txt: "Compila, y solo falla si se le pasa una lista que no es de enteros.",
            ok: false,
            msg: "El cuerpo se revisa una sola vez, con el T de la firma, y no otra vez " +
              "por cada lista que se ordene. Con T abierto no hay <, y da igual qué se " +
              "liste después."
          }
        ]
      },
      {
        titulo: "La línea 14 dice merge(msort(izq)(menorQue), msort(der)(menorQue)). " +
          "¿Qué pasa si se escribe merge(msort(izq), msort(der))?",
        opciones: [
          {
            txt: "No compila: a msort(izq) le falta la segunda lista de parámetros, así " +
              "que no es una List[T].",
            ok: true,
            msg: "Eso es. Con dos listas de parámetros, msort(izq) es una función que " +
              "todavía espera la comparación. La misma que recibió la llamada baja por " +
              "la recursión, y hay que escribirla en cada llamada."
          },
          {
            txt: "Compila, y cada mitad se ordena con la comparación por omisión del tipo.",
            ok: false,
            msg: "No hay comparación por omisión. La única que existe en esa función es la " +
              "que llegó por parámetro, y si no se pasa no queda nada que el compilador " +
              "pueda usar en su lugar."
          },
          {
            txt: "Compila, y solo ordena el primer nivel de la recursión.",
            ok: false,
            msg: "Las mitades no quedan a medio ordenar, porque la expresión no llega a " +
              "compilar: sin la segunda lista de parámetros, msort(izq) no es una lista y " +
              "merge no la puede recibir."
          },
          {
            txt: "Da igual, porque menorQue ya está en el ámbito donde se escribe la línea.",
            ok: false,
            msg: "merge sí ve menorQue, por estar escrita dentro de msort. La llamada " +
              "recursiva es a msort, que tiene su propia lista de parámetros, y esa hay " +
              "que llenarla."
          }
        ]
      },
      {
        titulo: "¿Qué responde msort(List(5, 2, 4, 1))((x: Int, y: Int) => x > y)?",
        opciones: [
          {
            txt: conMayor,
            ok: true,
            msg: "Eso es: " + conMayor + ". msort no define qué es estar ordenado; lo " +
              "define la función que recibe, y con x > y la cabeza que sale primero es " +
              "la mayor de las dos."
          },
          {
            txt: conMenor,
            ok: false,
            msg: "Esa es la respuesta con (x: Int, y: Int) => x < y. El cuerpo de msort " +
              "es el mismo en las dos corridas: lo único que cambió es la función que " +
              "decide cuál cabeza sale."
          },
          {
            txt: textoLista(USOS[1].xs),
            ok: false,
            msg: "La lista no sale como entró. merge compara las dos cabezas con la " +
              "función recibida en cada paso, y con x > y el resultado queda de mayor a " +
              "menor."
          },
          {
            txt: "No compila, porque x > y no compara por menor.",
            ok: false,
            msg: "El parámetro pide una función (T, T) => Boolean, y x > y lo es. El " +
              "nombre menorQue dice cómo se usa el resultado, no obliga a que la función " +
              "signifique menor que."
          }
        ]
      }
    ];
  }

  var API = {
    CODIGO: CODIGO, COMPARACIONES: COMPARACIONES, USOS: USOS,
    simular: simular, resultado: resultado, preguntas: preguntas,
    textoLista: textoLista, textoFuente: textoFuente, textoLlamada: textoLlamada
  };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var PREGUNTAS = preguntas();
  var acertadas = {};

  function construirCodigo() {
    var panel = document.getElementById("panel-codigo");
    panel.innerHTML = "";
    CODIGO.forEach(function (l) {
      var div = document.createElement("div");
      var num = document.createElement("span");
      var txt = document.createElement("span");
      div.className = "linea" + (l.bloque ? " bloque-" + l.bloque : "");
      num.className = "num";
      num.textContent = l.num === null ? "" : l.num;
      txt.className = "txt";
      txt.textContent = l.txt;
      div.appendChild(num);
      div.appendChild(txt);
      panel.appendChild(div);
    });
  }

  function construirUsos() {
    var tabla = document.getElementById("tabla-usos");
    var cab = document.createElement("tr");
    tabla.innerHTML = "";
    ["llamada", "tipo", "devuelve"].forEach(function (t) {
      var th = document.createElement("th");
      th.textContent = t;
      cab.appendChild(th);
    });
    tabla.appendChild(cab);
    USOS.forEach(function (uso) {
      var tr = document.createElement("tr");
      [textoLlamada(uso), uso.tipo, resultado(uso)].forEach(function (c, i) {
        var td = document.createElement("td");
        td.textContent = c;
        if (i !== 1) { td.className = "expr"; }
        tr.appendChild(td);
      });
      tabla.appendChild(tr);
    });
  }

  function marcador() {
    var hechas = Object.keys(acertadas).length;
    document.getElementById("marcador").textContent =
      "preguntas resueltas: " + hechas + " de " + PREGUNTAS.length;
    if (hechas === PREGUNTAS.length) {
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    }
  }

  function construirPreguntas() {
    var caja = document.getElementById("preguntas");
    caja.innerHTML = "";
    PREGUNTAS.forEach(function (p, i) {
      var bloque = document.createElement("div");
      var titulo = document.createElement("h3");
      var opciones = document.createElement("div");
      var veredicto = document.createElement("div");
      bloque.className = "pregunta";
      bloque.id = "pregunta-" + i;
      titulo.textContent = (i + 1) + ". " + p.titulo;
      opciones.className = "opciones-apiladas";
      veredicto.className = "veredicto";
      veredicto.id = "veredicto-" + i;

      p.opciones.forEach(function (o) {
        var b = document.createElement("button");
        b.textContent = o.txt;
        b.addEventListener("click", function () {
          var v = document.getElementById("veredicto-" + i);
          if (o.ok) {
            b.className = "primario";
            v.className = "veredicto bien";
            v.textContent = o.msg;
            bloque.className = "pregunta listo";
            acertadas[i] = true;
            marcador();
            return;
          }
          b.className = "errada";
          b.disabled = true;
          v.className = "veredicto mal";
          v.textContent = o.msg;
        });
        opciones.appendChild(b);
      });

      bloque.appendChild(titulo);
      bloque.appendChild(opciones);
      bloque.appendChild(veredicto);
      caja.appendChild(bloque);
    });
  }

  construirCodigo();
  construirUsos();
  construirPreguntas();
  marcador();
})();
