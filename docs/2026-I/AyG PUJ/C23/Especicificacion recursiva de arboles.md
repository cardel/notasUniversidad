# Especificación recursiva de árboles

Las representaciones de arreglo de padres o bien hijo izquierdo, hermano derecho son **estáticas**. Algunos algoritmos requieren conocer tanto los padres como los hijos de manera natural. Podemos usar una combinación de estas representaciones o bien una **representación recursiva**.

## Representación recursiva

Un árbol se define recursivamente como:

$$[\text{raíz} \mid [\text{lista de hijos}]]$$

Donde:
- El primer elemento es la raíz del árbol.
- El segundo elemento es una lista de subárboles (hijos), cada uno con la misma estructura recursiva: cada subárbol es a su vez un `[raíz | [lista de hijos]]`.

Esta definición es recursiva porque cada hijo es un árbol de la misma forma, permitiendo describir árboles de cualquier tamaño y profundidad.

**Ejemplo:** Un árbol con raíz `A` y dos hijos `B` y `C`, donde `B` tiene un hijo `D`, se representa como:

```
[A | [ [B | [ [D | [] ] ]], [C | [] ] ]]
```

- `C` no tiene hijos, por lo que su lista de hijos es vacía `[]`.
- `D` tampoco tiene hijos.
- El árbol completo se construye anidando subárboles.

Esta representación es fácil de implementar en lenguajes de programación funcional (como Lisp, Scheme o incluso en Python con listas anidadas) y permite aplicar algoritmos recursivos de forma directa.

## Casos límite y aclaraciones

1. **Árbol vacío según Cormen:** En el libro de Cormen, el caso base de un árbol se considera como un árbol con **solo la raíz** (sin hijos). Para él, la lista de hijos es vacía: `[raíz | []]` es un árbol válido. No existe un árbol "vacío" como tal (sin vértices).  
   *Nota:* Otras definiciones (como en estructuras de datos) pueden considerar un árbol vacío como `null` o `[]`.

2. **Bosque:** Un bosque es una colección de árboles disjuntos. Si un bosque tiene $k$ componentes conexas (árboles) y $n$ vértices en total, entonces el número de aristas es $n - k$.  
   - Un **árbol libre** es un bosque con $k = 1$.  
   - La representación recursiva de un bosque puede ser una lista de árboles raíz.

3. **Árbol libre no tiene raíz:** Un árbol libre (grafo no dirigido, conexo y acíclico) no tiene una raíz inherente. La raíz es una elección arbitraria que se realiza al transformarlo en un árbol con raíz. De un mismo árbol libre pueden obtenerse diferentes árboles con raíz según el vértice que se elija como raíz.

4. **Altura y profundidad:** En un árbol con raíz, la **altura** se define como el número de aristas en el **camino más largo** desde la raíz hasta alguna hoja.  
   - La **profundidad** de un nodo es el número de aristas desde la raíz hasta ese nodo.  
   - La altura del árbol es la máxima profundidad entre todos los nodos.  
   *Importante:* Se mide en **aristas**, no en vértices. Si se contaran vértices, la altura sería uno más.

## Tabla resumen

| Concepto | Descripción | Observaciones |
|----------|-------------|---------------|
| **Representación recursiva** | `[raíz \| [lista de hijos]]`; cada hijo es un árbol con la misma estructura. | Permite implementar algoritmos recursivos de forma natural. |
| **Árbol vacío (Cormen)** | Árbol con solo la raíz y sin hijos. | No existe la noción de árbol sin vértices; caso base recursivo. |
| **Bosque** | Colección de árboles disjuntos. | Aristas = vértices − componentes ($n-k$). |
| **Árbol libre** | Grafo no dirigido, conexo, acíclico; sin raíz fija. | La raíz se elige arbitrariamente al convertirlo en árbol con raíz. |
| **Altura** | Número de aristas en el camino más largo de la raíz a una hoja. | Medida en aristas (no vértices). |

## Comentarios adicionales

- La representación recursiva es la base para la definición de árboles en lenguajes funcionales y lógicos. Permite implementar recorridos, búsquedas y transformaciones mediante funciones que se llaman a sí mismas.
- La representación estática (arreglo de padres o hijo-izquierdo hermano-derecho) es más eficiente en memoria y tiempo para operaciones específicas, pero la recursiva es más flexible para algoritmos que modifican la estructura.
- La distinción entre altura medida en aristas o vértices varía según la literatura. En la mayoría de los textos de algoritmos (incluyendo CLRS), la altura se define con aristas. Asegúrese de verificar la convención usada en cada contexto.
- El bosque se puede ver como una lista de árboles raíz, lo que permite tratar el conjunto como un solo objeto recursivo.