## Introducción teórica

El **algoritmo de Kruskal** construye un **árbol de cobertura mínimo (MST)** para un grafo conexo y ponderado. Su fundamento teórico es la **propiedad de corte** (cut property):

1. Un corte $(S, V \setminus S)$ es una partición de los vértices en dos conjuntos no vacíos.
2. Una arista cruza el corte si sus extremos están en lados diferentes.
3. Un conjunto de aristas $A$ **respeta** el corte si ninguna arista de $A$ lo cruza.
4. Una **arista ligera** es la de menor peso entre todas las que cruzan el corte.

**Teorema de la propiedad de corte:** Si $A$ es un subconjunto de aristas incluido en algún MST y $e$ es una arista ligera de un corte que respeta $A$, entonces $e$ pertenece a algún MST (es segura).

El algoritmo de Kruskal aplica esta propiedad en cada iteración: al considerar las aristas en orden creciente de peso, el corte está dado por las componentes conexas actuales. Como $A$ no contiene aristas que crucen el corte (porque las aristas ya añadidas están dentro de componentes), la arista ligera (la de menor peso entre componentes) es segura.

La implementación usa **Union‑Find** (conjuntos disjuntos) con compresión de camino y unión por rango para gestionar las componentes de forma eficiente.

---

## Código original comentado

```python
def make_set(p, rango, x):
    # Inicializa el conjunto de x: su padre es él mismo y rango 0
    p[x] = x
    rango[x] = 0

def find_set(p, x):
    # Busca la raíz del conjunto que contiene a x, con compresión de camino
    if p[x] != x:
        p[x] = find_set(p, p[x])
    return p[x]

def union(p, rango, x, y):
    # Une los conjuntos de x e y usando unión por rango
    rx = find_set(p, x)
    ry = find_set(p, y)
    if rx != ry:
        if rango[rx] < rango[ry]:
            p[rx] = ry
        elif rango[rx] > rango[ry]:
            p[ry] = rx
        else:
            p[ry] = rx
            rango[rx] = rango[rx] + 1

def kruskal(V, aristas):
    # Ordena aristas por peso (de menor a mayor)
    ordenadas = sorted(aristas, key=lambda e: e[2])
    # Inicializa cada vértice como su propio conjunto
    p = {}
    rango = {}
    for v in V:
        make_set(p, rango, v)
    mst = []          # aristas seleccionadas
    peso = 0          # peso total del MST
    i = 0
    # Recorre aristas hasta tener |V|-1 aristas o no queden más
    while i < len(ordenadas) and len(mst) < len(V) - 1:
        u, v, w = ordenadas[i]
        # Si u y v están en componentes distintas, la arista es segura
        if find_set(p, u) != find_set(p, v):
            union(p, rango, u, v)
            mst.append((u, v, w))
            peso = peso + w
        i = i + 1
    return mst, peso

if __name__ == '__main__':
    V = [0, 1, 2, 3, 4, 5, 6]
    E = [
        (0, 1, 7),
        (0, 3, 5),
        (1, 2, 8),
        (1, 3, 9),
        (1, 4, 7),
        (2, 4, 5),
        (3, 4, 15),
        (3, 5, 6),
        (4, 5, 8),
        (4, 6, 9),
        (5, 6, 11),
    ]
    mst, peso = kruskal(V, E)
    print('MST tiene', len(mst), 'aristas, peso =', peso)
    for a in mst:
        print('  ', a)
```

El factor mas costoso de este algoritmo es el ordenamiento

---

## Tres ejemplos paso a paso que explican la propiedad de corte

### Ejemplo 1: Corte que respeta el conjunto vacío
**Grafo:**  
- Vértices: $A, B, C$  
- Aristas: $A-B$ (peso 3), $A-C$ (peso 1), $B-C$ (peso 4)

**Corte:** $S = \{A\}$, $V \setminus S = \{B, C\}$  
Aristas que cruzan: $A-B$ (3) y $A-C$ (1). Arista ligera: $A-C$ (peso 1).  
$A = \emptyset$ (ninguna arista seleccionada). El corte respeta $A$.  
La propiedad de corte asegura que $A-C$ es segura.  
**Aplicación en Kruskal:** ordenadas: $(A-C,1)$, $(A-B,3)$, $(B-C,4)$.  
Paso 1: toma $A-C$, componentes de $A$ y $C$ distintas, la añade → MST parcial: $\{(A-C,1)\}$.  
Luego $A-B$ une componente $\{A,C\}$ con $\{B\}$ → añade. $B-C$ formaría ciclo, se descarta.  
Resultado MST: $(A-C,1)$ y $(A-B,3)$, peso total 4.

---

### Ejemplo 2: Corte que respeta un conjunto de aristas ya seleccionadas
**Grafo:**  
- Vértices: $1,2,3,4$  
- Aristas: $1-2$ (5), $1-3$ (4), $2-3$ (2), $3-4$ (3), $2-4$ (6)

**Estado intermedio:** Supongamos que ya hemos seleccionado $A = \{(2-3,2)\}$ (arista de peso 2).  
Las componentes actuales son $\{2,3\}$ y $\{1\}$, $\{4\}$.  
**Corte:** $S = \{1\}$, $V \setminus S = \{2,3,4\}$  
El conjunto $A$ no cruza este corte (la arista $2-3$ está dentro de $V \setminus S$).  
Aristas que cruzan: $1-2$ (5) y $1-3$ (4). Arista ligera: $1-3$ (peso 4).  
La propiedad de corte dice que $1-3$ es segura para $A$, y efectivamente en el MST final aparece.

**Aplicación en Kruskal:** ordenadas: $(2-3,2)$, $(3-4,3)$, $(1-3,4)$, $(1-2,5)$, $(2-4,6)$.  
Paso 1: $2-3$ → se añade.  
Paso 2: $3-4$ → conecta componente $\{2,3\}$ con $\{4\}$ → se añade.  
Paso 3: $1-3$ → conecta $\{1\}$ con $\{2,3,4\}$ → se añade.  
Paso 4: $1-2$ formaría ciclo (ya en misma componente) → se descarta.  
Paso 5: $2-4$ también ciclo → se descarta.  
MST: $(2-3,2), (3-4,3), (1-3,4)$ → peso total 9.

---

### Ejemplo 3: Corte con empate en aristas ligeras
**Grafo:**  
- Vértices: $X, Y, Z, W$  
- Aristas: $X-Y$ (2), $X-Z$ (2), $Y-Z$ (3), $Z-W$ (4), $Y-W$ (5)

**Corte:** $S = \{X, Y\}$, $V \setminus S = \{Z, W\}$  
Aristas que cruzan: $X-Z$ (2), $Y-Z$ (3), $Y-W$ (5).  
Hay dos aristas ligeras con peso 2: $X-Z$ y otra? $X-Z$ es la única con peso 2. Pero supongamos que también hubiera otra; aquí solo una.  
$A = \{(X-Y,2)\}$ (arista ya seleccionada). Esta arista está dentro de $S$, no cruza el corte → el corte respeta $A$.  
La propiedad de corte asegura que $X-Z$ (peso 2) es segura.  
**Aplicación en Kruskal:** ordenadas: $(X-Y,2)$, $(X-Z,2)$, $(Y-Z,3)$, $(Z-W,4)$, $(Y-W,5)$.  
Paso 1: $X-Y$ → se añade (componentes: $\{X,Y\}$, $\{Z\}$, $\{W\}$).  
Paso 2: $X-Z$ → cruza componentes $\{X,Y\}$ y $\{Z\}$ → se añade (une $\{X,Y\}$ y $\{Z\}$).  
Paso 3: $Y-Z$ mismo componente → se descarta.  
Paso 4: $Z-W$ → conecta $\{X,Y,Z\}$ con $\{W\}$ → se añade.  
Paso 5: $Y-W$ mismo componente → se descarta.  
MST: $(X-Y,2)$, $(X-Z,2)$, $(Z-W,4)$ → peso total 8.

---

## Tabla resumen de conceptos

| Concepto | Definición | Comentarios adicionales |
|----------|------------|--------------------------|
| **Árbol de cobertura mínimo (MST)** | Subconjunto de aristas que conecta todos los vértices de un grafo conexo con peso total mínimo y sin ciclos. | Puede haber varios MST si hay aristas con el mismo peso. |
| **Propiedad de corte** | Si $A$ está contenido en algún MST y $e$ es la arista más liviana que cruza un corte que respeta $A$, entonces $e$ es segura para $A$. | Es la base teórica de los algoritmos de Kruskal y Prim. |
| **Corte** | Partición de los vértices en dos subconjuntos no vacíos. | Las aristas que lo cruzan conectan las dos particiones. |
| **Arista ligera** | Arista de mínimo peso entre las que cruzan un corte dado. | Si hay empates, cualquiera de ellas es segura. |
| **Union‑Find** | Estructura de datos para manejar conjuntos disjuntos con operaciones de unión y búsqueda. | Usa compresión de camino y unión por rango para casi tiempo constante. |
| **Algoritmo de Kruskal** | Ordena aristas por peso y las añade si no forman ciclo (usando Union‑Find). | Complejidad $O(E \log E)$ dominado por el ordenamiento. Requiere que el grafo sea conexo. |
| **Factor dominante** | El ordenamiento de aristas es la parte más costosa del algoritmo. | Optimizaciones adicionales (e.g., ordenamiento por cubetas) solo aplican en casos especiales. |