# Demostración que MaxClique es NPC

# Problema
Dado un grafo $G(V,E)$ y un entero $j \leq |V|$ 

¿Existe un clique de $j$ vértices dentro de $G$? Un clique es un grafo completo de tamaño $j$.

![](attachments/Pasted%20image%2020251113113023.png)

Dentro de este grafo existe un clique de tamaño 5.

# ¿MC es NP?

Dada una solución de MaxClique, indicar si existe un grafo completo de tamaño $j$.

Si nos proporcionan los vértices que pertenecen a este grafo, ¿qué debo hacer para saber que es un grafo completo?

Tengo que verificar que existan aristas que conecten con los demás, es decir que para cada vértice debo verificar $j-1$ conexiones. En total debo realizar $j*(j-1)$ verificaciones, por lo que la complejidad de la verificación es $O(j^2)$, esto es polinomial. Dado que $j \leq |V|$, la complejidad en el peor caso es $O(|V|^2)$.

# Demostrar que es NP-HARD

## Selecciono un problema NPC

Voy a seleccionar el Vertex Cover:

$$
VC \leq_p MC
$$

1. Sea $G = (V,E)$ y $V'$ un cubrimiento de vértices de tamaño $k$.
![](attachments/Pasted%20image%2020251113113740.png)

2. Nótese que $V - V'$ es un conjunto independiente, el cual tiene tamaño $|V|-k$.
3. Sea $G=(V,E)$ un grafo y $V'$ un conjunto independiente de vértices de tamaño $k$, se toma $\bar{G} = (V, \bar{E})$ como el grafo complementario. Dado que el VC cubre todas las aristas, si eliminamos los vértices del VC, nos debe quedar un grafo SIN ARISTAS (conjunto independiente). Al obtener el complementario debemos obtener un grafo completo de tamaño $|V|-k$.

# Procedimiento

Dada una instancia $G = (V,E)$ y $k$ en Vertex Cover, construimos un grafo $\bar{G} = (V,\bar{E})$ y $|V|-k$ como instancia de MC.

El procedimiento se reduce a calcular el grafo complementario.

![](attachments/2025-11-13-Note-11-59.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

## Complejidad de la reducción

Si tenemos un grafo $G(V,E)$ para calcular $\bar{G}$ debo obtener las aristas que no están en el grafo. 

El máximo de aristas es $\frac{|V|*(|V|-1)}{2}$. Como el grafo tiene en total $E$ aristas, el cálculo es $E' = \frac{|V|*(|V|-1)}{2} - E$, esto nos da una complejidad $O(|V|^2)$.

1. Debo agregar las aristas que hacen falta
2. Eliminar las actuales
3. En el peor de los casos debo trabajar con $|V|^2$ aristas

# Correctitud

## Instancias positivas de VC son instancias positivas de MC

Tomando en cuenta que si tomamos el grafo complementario se eliminan las aristas del Vertex Cover, en el conjunto independiente (vértices que no son VC) deben quedar totalmente conectados entre sí, lo que genera un grafo completo.

## Instancias negativas de VC son instancias negativas de MC

Si no tenemos un VC, existirá al menos una arista que no esté cubierta y que haga parte del conjunto independiente. Al obtener el grafo complementario, esta arista va a faltar y no tendremos un clique completo.

## Conceptos Teóricos Adicionales

**Vertex Cover (Cubrimiento de Vértices)**: Dado un grafo $G = (V,E)$ y un entero $k$, determinar si existe un subconjunto $V' \subseteq V$ de tamaño a lo más $k$ tal que toda arista en $E$ tiene al menos un extremo en $V'$.

**Conjunto Independiente**: Subconjunto de vértices donde ningún par de vértices está conectado por una arista.

**Grafo Complementario ($\bar{G}$)**: Grafo con el mismo conjunto de vértices que $G$, pero donde dos vértices son adyacentes en $\bar{G}$ si y solo si no son adyacentes en $G$.

**Relación entre Vertex Cover y Conjunto Independiente**: En cualquier grafo, $V'$ es un vertex cover si y solo si $V-V'$ es un conjunto independiente.

**Relación entre Conjunto Independiente y Clique**: Un conjunto $S$ es un conjunto independiente en $G$ si y solo si $S$ es un clique en $\bar{G}$.