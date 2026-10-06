/* Alcance estático y alcance dinámico sobre el mismo programa. El lenguaje
   usa el estático: el cuerpo de un procedimiento se evalúa en el ambiente
   que la clausura capturó. El dinámico está aquí solo para contrastar: qué
   daría si el cuerpo se evaluara en el ambiente de quien llama. */
var PREDICCIONES = [
  {
    id: "alcance-y",
    titulo: "1. La variable libre del cuerpo",
    alcances: true,
    enunciado:
      "El cuerpo de <code>p</code> menciona <code>y</code>, que no es " +
      "parámetro suyo. Hay dos candidatas: la <code>y</code> del ambiente " +
      "inicial, que vale 2, y la que el <code>let</code> de adentro liga a " +
      "100. Diga qué da con cada regla.",
    programa: "let p = proc(u) +(u,y) in let y = 100 in (p 1)",
    pista:
      "Con alcance estático gana el ambiente donde el proc fue creado; con " +
      "dinámico, el de donde fue llamado. El lenguaje usa el primero."
  },
  {
    id: "alcance-factor",
    titulo: "2. El mismo procedimiento, dos ambientes",
    alcances: true,
    enunciado:
      "Ahora el nombre libre es <code>n</code> y se liga dos veces, antes y " +
      "después de crear el procedimiento.",
    programa: "let n = 2 in let f = proc(k) *(k,n) in let n = 10 in (f 5)",
    pista:
      "La clausura se construyó cuando n valía 2 y guardó ese ambiente. La " +
      "ligadura posterior no la alcanza, por más que esté más cerca en el " +
      "texto."
  },
  {
    id: "alcance-sin-libres",
    titulo: "3. Cuando las dos reglas coinciden",
    alcances: true,
    enunciado:
      "Este cuerpo no menciona ninguna variable que no sea su parámetro. " +
      "Diga qué da con cada regla.",
    programa: "let f = proc(k) *(k,k) in let n = 10 in (f 5)",
    razonIguales:
      "el cuerpo no tiene variables libres, así que da igual en qué " +
      "ambiente se evalúe. La diferencia entre las dos reglas solo se nota " +
      "cuando el cuerpo menciona algo que no es parámetro suyo.",
    pista: "Mire si el cuerpo menciona algo que no sea su parámetro."
  },
  {
    id: "alcance-rechazo",
    titulo: "4. Un programa que una regla acepta y la otra no",
    alcances: true,
    enunciado:
      "El cuerpo menciona <code>w</code>, que no existe donde el " +
      "procedimiento se crea pero sí donde se llama. Este es el caso que " +
      "separa a las dos reglas del todo.",
    programa: "let f = proc(k) +(k,w) in let w = 3 in (f 1)",
    pista:
      "Pregúntese qué nombres hay en cada uno de los dos ambientes " +
      "candidatos. Con uno de ellos la búsqueda de w no encuentra nada."
  }
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES }; }

if (typeof document !== "undefined") {
  MotorClausuras.montar({ predicciones: PREDICCIONES, destino: "predicciones" });
}
