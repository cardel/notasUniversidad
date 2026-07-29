# Clase 3: Funciones y procesos

Función vs proceso

- Función recursiva: Es una función que se llama a sí misma
    - Caso base: Solución trivial (inmediata)
    - Caso recursivo: Nos lleva paulatinamente al caso base
- Proceso recursivo: Es la forma en que se ejecuta (recursión o iteración)

---

DIseño de funciones con optimización de cola

- Se agrega un acumulador que va ir “acumular” el resultado final
- Al llegar al caso base retornamos el acumulador
- El valor por defecto del acumulador es el caso base
- En scala usamos @tailrec es una anotación para aplicar optimización de cola (tail recursion)