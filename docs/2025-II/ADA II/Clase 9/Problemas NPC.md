Los problemas NP completos (NPC) son problemas conectados etre sí, es decir que resolver uno de los problemas, a partir de un técnica que se llama **reducción** podemos llevarlo a otro problema NPC.

- NPC aplica a problemas de decisión (verdadero o falso)
- Es posible convertir un problema de optimización en uno de decisión formulando una pregunta que limite de solución. Existe un camino de longitud 7 en el un grafo $G$ que sea de costo mínimo.

# Reducción

![](attachments/Pasted%20image%2020251016110235.png)
1. La reducción de la instancia $\alpha$ de $A$ hacia una instancia $\beta$ de $B$ se hace en tiempo polinomial en un MT determinista.
2. La solución de $B$ es tiempo polinomial en una MT no deteminista (Clase NP)
3. Si la salida de $A$ es $V$ entonces $B$ es $V$, en caso contrario si $A$ es $F$ entonces $B$ es $F$.
4. Se cumple $A \leq_p B$ significa que A reduce a B en tiempo polinomial,  es decir que si un algoritmo resuelve B, tambien puede resolver $A$. Osea que $A$ es tan dificil o duro como $B$.

Esta técnica sirve para probar que un problema NPC
1. Para probar que un problema es NP completo es necesario partir de otro que sea NPC
2. Vamos a partir de un problema base SAT (partir de 3 variables en adelante)