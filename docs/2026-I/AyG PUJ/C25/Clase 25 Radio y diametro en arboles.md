# Enfoque de divide y vencerás

1. Para la altura, se toma el máximo de la altura de los hijos más 1.
2. Para el diámetro, se toman las dos alturas máximas (a1 y a2). El diámetro es a1 + 1 + a2 + 1, porque el camino más largo pasa por la raíz del subárbol.

Aquí nos aprovechamos del hecho de que un árbol está compuesto por subárboles con raíz definida. Sencillamente tratamos los subárboles como si fueran un solo vértice.

Esto se realiza con un recorrido **posorden** (izquierda, derecha, raíz).

## Conceptos teóricos

- **Altura de un árbol**: Es la longitud del camino más largo desde la raíz hasta una hoja. Se calcula recursivamente como `altura(nodo) = 1 + max(altura(hijo_izq), altura(hijo_der))`.
- **Diámetro de un árbol**: Es la distancia más larga entre dos nodos cualesquiera del árbol. Puede pasar o no por la raíz. Para calcularlo, se considera que el diámetro que pasa por un nodo es la suma de las dos alturas más grandes de sus subárboles hijos más 2 (por las aristas que conectan al nodo con esos hijos).
- **Recorrido posorden**: Visita primero el subárbol izquierdo, luego el derecho y finalmente la raíz. Es útil para problemas donde se necesita información de los hijos antes de procesar el padre, como en el cálculo de altura y diámetro.

## Código

```python
# Función que calcula la altura y el diámetro de un árbol binario
# Retorna una tupla (altura, diametro)
def altura_y_diametro(raiz):
    # Caso base: si el nodo es None, altura y diámetro son 0
    if raiz is None:
        return (0, 0)
    
    # Llamadas recursivas a los hijos (recorrido posorden)
    alt_izq, diam_izq = altura_y_diametro(raiz.izquierdo)
    alt_der, diam_der = altura_y_diametro(raiz.derecho)
    
    # La altura del nodo actual es 1 más la máxima altura de sus hijos
    altura_actual = 1 + max(alt_izq, alt_der)
    
    # El diámetro que pasa por el nodo actual es la suma de las alturas de sus dos hijos más 2
    diametro_por_nodo = alt_izq + alt_der + 2
    
    # El diámetro total es el máximo entre el diámetro que pasa por el nodo actual
    # y los diámetros calculados en los subárboles izquierdo y derecho
    diametro_actual = max(diametro_por_nodo, diam_izq, diam_der)
    
    return (altura_actual, diametro_actual)
```

## Diagrama de flujo

```mermaid
flowchart TD
    A[Inicio: nodo raíz] --> B{¿nodo es None?}
    B -->|Sí| C[Retornar (0, 0)]
    B -->|No| D[Calcular altura y diámetro del hijo izquierdo]
    D --> E[Calcular altura y diámetro del hijo derecho]
    E --> F[altura_actual = 1 + max(alt_izq, alt_der)]
    F --> G[diametro_por_nodo = alt_izq + alt_der + 2]
    G --> H[diametro_actual = max(diametro_por_nodo, diam_izq, diam_der)]
    H --> I[Retornar (altura_actual, diametro_actual)]
```

## Tabla de resumen

| Concepto | Definición | Fórmula / Método |
| :--- | :--- | :--- |
| Altura de un árbol | Longitud del camino más largo desde la raíz hasta una hoja | `altura(nodo) = 1 + max(altura(hijo_izq), altura(hijo_der))` |
| Diámetro de un árbol | Distancia más larga entre dos nodos cualesquiera | `diametro = max(diametro_por_nodo, diam_izq, diam_der)` donde `diametro_por_nodo = alt_izq + alt_der + 2` |
| Recorrido posorden | Visita: izquierda, derecha, raíz | Útil cuando se necesita información de los hijos antes de procesar el padre |
| Divide y vencerás | Dividir el problema en subproblemas más pequeños (subárboles) y combinar soluciones | Aplicado recursivamente en cada nodo del árbol |

**Comentarios adicionales**: Este enfoque tiene complejidad O(n), donde n es el número de nodos del árbol, ya que cada nodo se visita exactamente una vez. Es importante notar que el diámetro no necesariamente pasa por la raíz del árbol completo; por eso se debe tomar el máximo entre el diámetro que pasa por el nodo actual y los diámetros de los subárboles.