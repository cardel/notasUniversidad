/* El cliente una sola vez. Un TAD cola con su interfaz, tres clientes que
   solo pueden usarla, y después la misma cola en otra representación para
   comprobar que los tres clientes pasan sin cambiar. El código del estudiante
   corre sobre mini-scheme.js. */
var INTERFAZ =
  "(empty-queue)          la cola sin elementos\n" +
  "(empty-queue? q)       #t si no tiene elementos\n" +
  "(enqueue q v)          la cola con v agregado al final\n" +
  "(front q)              el elemento del frente, q no vacía\n" +
  "(dequeue q)            la cola sin su frente, q no vacía";

var REP_A =
  ";; Representación A: la cola es la lista de sus elementos, el frente adelante.\n" +
  "(define (empty-queue) '())\n" +
  "(define (empty-queue? q) (null? q))\n" +
  "(define (enqueue q v) (append q (list v)))\n" +
  "(define (front q) (car q))\n" +
  "(define (dequeue q) (cdr q))\n";

var REP_B =
  ";; Representación B: dos listas, la del frente y la del final al revés.\n" +
  ";; Agregar es cons en la segunda; sacar del frente vacía la primera y,\n" +
  ";; cuando se acaba, voltea la segunda para reponerla.\n" +
  "(define (empty-queue) (list '() '()))\n" +
  "(define (empty-queue? q) (and (null? (car q)) (null? (cadr q))))\n" +
  "(define (enqueue q v) (list (car q) (cons v (cadr q))))\n" +
  "(define (normaliza q)\n" +
  "  (if (null? (car q)) (list (reverse (cadr q)) '()) q))\n" +
  "(define (front q) (car (car (normaliza q))))\n" +
  "(define (dequeue q)\n" +
  "  (let ([n (normaliza q)]) (list (cdr (car n)) (cadr n))))\n";

var PRUEBAS_LARGO = [
  { llamada: "(largo (empty-queue))", esperado: "0" },
  { llamada: "(largo (enqueue (enqueue (empty-queue) 'a) 'b))", esperado: "2" },
  { llamada: "(largo (dequeue (enqueue (enqueue (enqueue (empty-queue) 1) 2) 3)))", esperado: "2" }
];
var PRUEBAS_LISTA = [
  { llamada: "(cola->lista (empty-queue))", esperado: "()" },
  { llamada: "(cola->lista (enqueue (enqueue (enqueue (empty-queue) 1) 2) 3))", esperado: "(1 2 3)" },
  { llamada: "(cola->lista (dequeue (enqueue (enqueue (empty-queue) 'x) 'y)))", esperado: "(y)" },
  { llamada: "(cola->lista (enqueue (dequeue (enqueue (enqueue (empty-queue) 'a) 'b)) 'c))", esperado: "(b c)" }
];
var PRUEBAS_ULTIMO = [
  { llamada: "(ultimo (enqueue (empty-queue) 'solo))", esperado: "solo" },
  { llamada: "(ultimo (enqueue (enqueue (enqueue (empty-queue) 1) 2) 3))", esperado: "3" },
  { llamada: "(ultimo (dequeue (enqueue (enqueue (empty-queue) 'p) 'q)))", esperado: "q" }
];

var RETOS = (function () {
  "use strict";
  return [
    {
      id: "a-largo",
      titulo: "1. Cuántos elementos tiene la cola",
      enunciado:
        "Escriba <code>largo</code> usando solamente las cinco operaciones " +
        "de la interfaz. La representación está a la vista, y esa es la " +
        "tentación: <code>length</code> funcionaría. No lo use. Un cliente " +
        "que mira la lista deja de ser un cliente del TAD.",
      gramatica: INTERFAZ,
      esqueleto:
        REP_A + "\n" +
        ";; El cliente. Solo puede usar las cinco operaciones de arriba.\n" +
        "(define (largo q)\n" +
        "  (if ???\n" +
        "      ???\n" +
        "      ???))\n",
      pruebas: PRUEBAS_LARGO,
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(largo (empty-queue))" && obtenido !== "0") {
          return "La cola vacía tiene cero elementos, y ese es el caso base " +
            "que empty-queue? reconoce.";
        }
        return "Si no está vacía, cuenta uno y sigue con lo que queda al " +
          "quitar el frente.";
      },
      cierre:
        "Recorrer una cola por la interfaz es preguntar si está vacía y, si " +
        "no, quitar el frente y seguir. Es la misma recursión sobre listas, " +
        "con dequeue en lugar de cdr."
    },
    {
      id: "a-lista",
      titulo: "2. Los elementos, del frente al final",
      enunciado:
        "Escriba <code>cola-&gt;lista</code>, que devuelve los elementos en " +
        "el orden en que saldrían. Con esta representación el resultado " +
        "coincide con el dato, y devolver <code>q</code> tal cual pasaría " +
        "las pruebas. Escríbalo con la interfaz de todos modos: el reto que " +
        "sigue va a explicar por qué.",
      gramatica: INTERFAZ,
      esqueleto:
        REP_A + "\n" +
        "(define (cola->lista q)\n" +
        "  (if ???\n" +
        "      ???\n" +
        "      (cons ??? ???)))\n",
      pruebas: PRUEBAS_LISTA,
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido.indexOf("no está ligada") !== -1) {
          return "El frente se obtiene con front y el resto con dequeue; no " +
            "hay otras operaciones.";
        }
        return "El frente va adelante del resultado de convertir el resto.";
      },
      cierre:
        "Pasa igual que devolviendo q, y eso es lo que hace peligrosa a esta " +
        "representación: no delata al cliente que hace trampa. La siguiente " +
        "sí lo hará."
    },
    {
      id: "a-ultimo",
      titulo: "3. El último de la cola",
      enunciado:
        "Escriba <code>ultimo</code>, que devuelve el elemento del final. " +
        "La interfaz solo da acceso al frente, así que hay que avanzar hasta " +
        "que quitar el frente deje la cola vacía: en ese momento, el frente " +
        "es el último. Supone una cola con al menos un elemento.",
      gramatica: INTERFAZ,
      esqueleto:
        REP_A + "\n" +
        "(define (ultimo q)\n" +
        "  (if (empty-queue? ???)\n" +
        "      ???\n" +
        "      ???))\n",
      pruebas: PRUEBAS_ULTIMO,
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(ultimo (enqueue (enqueue (enqueue (empty-queue) 1) 2) 3))" && obtenido === "1") {
          return "Devolvió el frente sin avanzar. La pregunta del if no es si " +
            "q está vacía, sino si lo está la cola que queda al quitarle el " +
            "frente.";
        }
        return "Cuando dequeue deja la cola vacía, el frente actual es el " +
          "último; si no, se sigue con la cola sin su frente.";
      },
      cierre:
        "La interfaz no ofrece el último, y el cliente lo consigue " +
        "combinando lo que sí ofrece. Cuesta un recorrido completo, y ese " +
        "costo es visible: es el precio de no saber cómo está guardada la " +
        "cola."
    },
    {
      id: "b-largo",
      titulo: "4. La misma cola, con dos listas",
      enunciado:
        "Otra representación: la cola son dos listas, la del frente y la del " +
        "final al revés. Agregar es un <code>cons</code> en la segunda, y " +
        "cuando la primera se agota se voltea la segunda para reponerla. " +
        "<b>Pegue el mismo <code>largo</code> que escribió en el primer " +
        "reto.</b> Si pasa sin cambios, el cliente no conocía la " +
        "representación.",
      gramatica: INTERFAZ,
      esqueleto:
        REP_B + "\n" +
        "(define (largo q)\n" +
        "  ???)\n",
      pruebas: PRUEBAS_LARGO,
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "2" && esperado !== "2") {
          return "Está contando las dos listas de la representación, no los " +
            "elementos. Ese era el cliente que usaba length.";
        }
        return "El mismo código del primer reto pasa aquí. Si lo cambió, " +
          "revise qué del primero dependía de que la cola fuera una lista.";
      },
      cierre:
        "Ni una letra distinta. La representación cambió de forma, de costo " +
        "y de tamaño, y el cliente no se enteró: solo habló con la interfaz."
    },
    {
      id: "b-lista",
      titulo: "5. Ahora el dato ya no es la respuesta",
      enunciado:
        "<b>Pegue el mismo <code>cola-&gt;lista</code> del segundo reto.</b> " +
        "Con esta representación, devolver <code>q</code> deja de funcionar: " +
        "el dato es un par de listas, no la secuencia de elementos. Si en el " +
        "segundo reto lo escribió por la interfaz, aquí pasa igual.",
      gramatica: INTERFAZ,
      esqueleto:
        REP_B + "\n" +
        "(define (cola->lista q)\n" +
        "  ???)\n",
      pruebas: PRUEBAS_LISTA,
      pistas: function (llamada, esperado, obtenido) {
        if (/^\(\(.*\) \(.*\)\)$/.test(obtenido)) {
          return "Devolvió el dato completo: las dos listas de la " +
            "representación. En la A eso pasaba porque el dato y la " +
            "respuesta coincidían; aquí ya no. El cliente que sobrevive " +
            "saca los elementos uno a uno con front y dequeue.";
        }
        var alReves = "(" + esperado.slice(1, -1).split(" ").reverse().join(" ") + ")";
        if (esperado !== "()" && obtenido === alReves) {
          return "Devolvió la segunda lista, que guarda el final al revés. " +
            "Es la mitad del dato y en el orden equivocado: solo la " +
            "interfaz sabe cómo se juntan las dos partes.";
        }
        if (obtenido === "()" && esperado !== "()") {
          return "Devolvió la primera lista, que está vacía aunque la cola " +
            "no lo esté: los elementos quedaron en la segunda. Mirar una " +
            "sola de las dos es leer la representación a medias.";
        }
        return "El mismo código del segundo reto pasa aquí. Si lo cambió, " +
          "el cambio es la prueba de que el primero dependía de la lista.";
      },
      cierre:
        "Este es el reto que el segundo no podía dar: la representación que " +
        "coincidía con la respuesta escondía a los clientes que miraban el " +
        "dato. Con dos listas, solo sobrevive el que pasó por la interfaz."
    },
    {
      id: "b-ultimo",
      titulo: "6. El último, otra vez",
      enunciado:
        "<b>Pegue el mismo <code>ultimo</code> del tercer reto.</b> Aquí el " +
        "último está al alcance de la mano —es el primero de la segunda " +
        "lista— y aun así el cliente no puede tomarlo: no sabe que esa lista " +
        "existe. Recorre por la interfaz, como antes.",
      gramatica: INTERFAZ,
      esqueleto:
        REP_B + "\n" +
        "(define (ultimo q)\n" +
        "  ???)\n",
      pruebas: PRUEBAS_ULTIMO,
      pistas: function (llamada, esperado, obtenido) {
        return "El mismo código del tercer reto. Si aquí intentó tomar el " +
          "último de la segunda lista, ese cliente no funcionaría en la " +
          "representación A.";
      },
      cierre:
        "Tres clientes, dos representaciones, seis pruebas verdes y ningún " +
        "cliente reescrito. Cuando la representación cambie de nuevo, el " +
        "trabajo será cambiar cinco procedimientos de la interfaz, no cada " +
        "programa que use colas."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorRetos.montar({ retos: RETOS, destino: "retos", cierre: "carta-cierre" });
  MotorRetos.montarConsola();
}
