**Algoritmo de Dijkstra**  
Encuentra los caminos más cortos desde un nodo origen $s$ a todos los demás nodos en un grafo con pesos **no negativos**.

**Notación:**  
- $G = (V, E)$: grafo con vértices $V$ y aristas $E$.  
- $w(u, v)$: peso de la arista de $u$ a $v$ ($\geq 0$).  
- $d[v]$: distancia acumulada mínima conocida desde $s$ a $v$.  
- $\pi[v]$: predecesor de $v$ en el camino mínimo.  
- $Q$: cola de prioridad (min-heap) de nodos no procesados, keyed by $d[v]$.

**Algoritmo:**  
1. Inicializar:  
   - $d[s] \gets 0$  
   - $d[v] \gets \infty$ para todo $v \neq s$  
   - $\pi[v] \gets \text{null}$ para todo $v$  
   - $Q \gets V$  

2. Mientras $Q \neq \emptyset$:  
   - $u \gets \text{extract-min}(Q)$  
   - Para cada vecino $v$ de $u$:  
        - Si $d[v] > d[u] + w(u, v)$:  
            - $d[v] \gets d[u] + w(u, v)$  
            - $\pi[v] \gets u$  
            - Decrease-key($Q$, $v$, $d[v]$)  

**Complejidad:** $O((V + E) \log V)$ con heap.

---

**Mejora a tu descripción:**  
La idea central es **relajar** aristas: para cada nodo $u$ procesado, actualizar las distancias de sus vecinos $v$ si $d[u] + w(u,v) < d[v]$. El nodo con menor $d[v]$ se procesa next (garantía de optimalidad por pesos no negativos).
![](attachments/djistra.pdf){ type=application/pdf style="min-height:70vh;width:100%"}


