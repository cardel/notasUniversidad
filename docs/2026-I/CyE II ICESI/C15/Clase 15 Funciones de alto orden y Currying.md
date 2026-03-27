
# Como vamos

1. En programación funcional hemos visto
	1. Valores son inmutables
	2. Se utiliza recursividad para resolver problemas: lineal, de cola y arbol
	3. Listas como estructura de datos recursiva (inducción estructural)
	4. Reconocimiento de patrones

# Temas

1. [Funciones de alto orden](Funciones%20de%20alto%20orden.md)
2. [Currying](Currying.md)

# Mencion sobre complejidad

En las funciones evaluadas sobre listas usualmente tenemos la R.R $T(n) = T(n-1) + f(n)$ donde $f(n)$ es el costo de aplicar las funciones dentro de la función recursiva, usualmente si son una operación elemental esta nos dará $\Theta(n)$ pero si tienen costo diferente hay que analizar entonces $n*T_f(n)$ donde $T_f(n)$ es el costo de aplicar las funciones.