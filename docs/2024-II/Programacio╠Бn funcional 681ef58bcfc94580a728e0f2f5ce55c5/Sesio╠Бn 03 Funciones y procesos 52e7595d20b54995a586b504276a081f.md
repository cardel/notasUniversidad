# Sesión 03: Funciones y procesos

Cual es la diferencia entre función y proceso

- Función es la codificación
- Procesos es cómo se ejecuta

---

Funciones recursivas

- Funciones que se llaman a sí mismas
- Poseen caso uno (o más) caso base
- Poseen uno o más casos recursivos (llamado a sí misma) paulatinamente la entrada debe llevarnos al caso BASE

---

Procesos y funciones recursivas

- Se espera que una función recursiva tenga un proceso recursivo, PERO NO SIEMPRE ES ASI
- Normalmente se deben guardar los llamados en la pila

![image.png](Sesio%CC%81n%2003%20Funciones%20y%20procesos%2052e7595d20b54995a586b504276a081f/image.png)

![image.png](Sesio%CC%81n%2003%20Funciones%20y%20procesos%2052e7595d20b54995a586b504276a081f/image%201.png)

---

Recursión de árbol

- Involucra dos o más llamados
- Está pensada para trabajar con estructuras de datos tipo árbol
- Es díficil de optimizar

```jsx
def f(n:Int):Int = {
	if (n==0) 0
	else {
		if (n==1) 1
		else f(n-1) + f(n-2)
	}
}

```

![image.png](Sesio%CC%81n%2003%20Funciones%20y%20procesos%2052e7595d20b54995a586b504276a081f/image%202.png)

# Resumen

- Función es un segmento de código que realiza una tarea, en el caso de las funciones recursivas, se llaman a si mismas y deben tener al menos un caso base
- Proceso es cómo se ejecuta una función, una función recursiva usualmente necesita varios procesos que se apilan en la pila del programa, pero NO SIEMPRE ES ASI
- Optimización de recursión de cola, se conserva siempre un llamado, se utilizan uno más parametros de entrada par ACUMULAR la respuesta
- Usamos @tailrec en Scala para indicar que vamos optimizar por recursión de COLA
- NO todos los lenguajes de programación tiene optimización de recursión de cola
- [https://en.wikipedia.org/wiki/Tail_call](https://en.wikipedia.org/wiki/Tail_call)
- Recursión de arbol es dificil o imposible de optimizar, se utilizan es otras técnicas: volverlo imperativo o usar programación dinámica