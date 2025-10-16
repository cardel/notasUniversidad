
# Clasificación de maquinas de Turing
- Maquinas Turing Deterministas: Son aquellas que hacen un solo paso ante un simbolo de entrada
- Maquina de Turing no deterministas: Hacen una ramificación pueden tener hasta $O(2^n)$ estados al mismo tiempo


# Clasificación por su solución

1. Problemas de solucion: Dan una solución numerica, cadena de texto, etc
2. Problemas de decisión: Dan verdadero o falso de acuerdo a una pregunta ¿Existe un camino de longitud 7 en el grafo $G$? 

# Tipos de problemas

1. Clase P: la clase son los problemas que se pueden resolver en tiempo polinomial en una **maquina de turing determinista**
2. Clase NP.
	1. Son aquellos que se pueden resolver en tiempo polinomial en una **maquina de Turing no determinista**
	2. Son aquellos que se **pueden verificar** es decir que una solución es correcta, en tiempo polinomial en una **maquina de turing determinista**

![](attachments/Pasted%20image%2020251016104841.png)

# ¿P = NP?

Esto quiere decir que si existen algoritmos que resuelvan problemas NP en tiempo polinomial, muchos problemas que tenemos en la vida real se podrian solucionar rapidamente evitando algoritmo de aproximación (heuristicas).

# NPC

No polinomiales completos

- Hasta el momento no han podido ser resueltos en tiempo polinomial en una maquina de Turing deterministas
- Si se pueden resolver en tiempo polinomial en una maquina de Turing no determinista
- Todo problema NPC puede ser convertido a otro problema NPC, si resuelves uno, resuelves todos.



