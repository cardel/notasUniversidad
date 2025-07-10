# Sesión 07: Optimización

# Recursos

[https://www.minizinc.org/](https://www.minizinc.org/) 

# Apuntes

¿QUe es un problema de optimización?

- Problema donde queremos maximizar o minimizar una función objetivo
- Estamos sujetos a restricciones ≤ ≥ =

---

Pasos para solucionar un problema

1. Formulación del problema
2. Modelo matemático (Max/Min restricciones)
3. Resolver (Solver Gecode)
4. Verificación de la solución
5. Decisión a tomar

---

Problema de programación no lineal 

```makefile
maximize f(x)
subject to
	constraint f1(x) <= b
	and
	contraint f2(x) >= b
	and
	...
```

---

Caracteristicas de un problema de optimización

- Existen un area factible donde buscamos el maximo o el minimo
- El area factible se arma a partir de las restricciones
- El area factible puede ser finita o infinita (acotado o no acotado) nuestro objetivo son areas acotadas

---

Caracteristicas de problemas de optimización

1. Hay una función a maximizar o minimiar
2. Hay un conjunto de restricciones

```makefile
maximize f(x1,x2,...,n)
x1,x2,x3,xn son variables enteras

x1,x2,...xn >= 0 (acotado, cerrado)

REstricciones
h(x1,x2,..,xn) <= b1
...
hn(x1,x2,..,xn)<= bn

Conjunto que genera debe existir (evitar intersección nula)
Debe ser acotado (finito)

```

/