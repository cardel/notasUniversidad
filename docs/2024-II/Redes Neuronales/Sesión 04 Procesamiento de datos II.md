# Sesión 04: Procesamiento de datos II

# Generalidad

¿Que problematica hay con los textos?

- Necesitamos convertirlos a números (vectores)
- Suelen ser dificiles de procesar
    - Diferencias entre mayusculas y minusculas: CASA , Casa, CAsA
    - Puntuaciones
    - Números o datos geograficos
    - Raices de las palabras: caminar, caminó, caminamos ⇒ representan lo mismo (caminar)

---

Pasos para procesar texto

1. Borrar los caracteres no ASCII
2. Borrar las puntuaciones
3. Normalizar en minusculas
4. Eliminar las palabras comunes (stopword)
5. Steamming (Extraer la raiz) — caminar, caminando, —> camin (No tiene contexto) / Lematización (Toma en cuenta la función de la palabra dentro de la oración)
6. Vectorización
    1. CountVectorizer*
    2. TDIf Vectorizer*
    3. WordtoVec**
7. *  Forma la bolsa de palabras a partir de la entrada ** Forma la bolsa de palabras desde el conocimiento de lenguaje

Ejemplo:

“hola yo soy goku”

“hola yo peque”

[hola,yo, soy, goku, peque]

[1 1 1 1 0]

[1 1 0 0 1] Countvectorizer

TF-IDF

[0.2 0.2 1 1 0]

[0.2 0.2 0 0 1]

Gramas, bigramas o trigramas

1. Grama: 1 palabra
2. Bigrama: 2 palabras
3. Trigrama: 3 palabras

[”hola hola”, “hola yo” “hola soy” hola goku” “hola peque” “yo hola” “yo soy” “yo yo” “yo goku” ….. “peque peque”]

[0 1 0 0 0 0 1 ….]