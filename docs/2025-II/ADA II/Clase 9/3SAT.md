3SAT es una variante de SAT en el cual todas las clausulas tienen tamaño 3


**Definición**: 3SAT es el problema de satisfacibilidad booleana restringido a fórmulas en forma normal conjuntiva (CNF) donde cada cláusula contiene exactamente 3 literales.

**Formalmente**: Dada una fórmula booleana $\phi$ en CNF con $n$ variables $x_1, x_2, \ldots, x_n$ y $m$ cláusulas, donde cada cláusula $C_i$ es de la forma:
$$C_i = (l_{i1} \lor l_{i2} \lor l_{i3})$$
donde cada $l_{ij}$ es un literal (variable $x_k$ o su negación $\neg x_k$).

**Pregunta**: ¿Existe una asignación de valores de verdad a las variables que haga $\phi$ verdadera?

## Ejemplos

### Ejemplo 1: Fórmula satisfacible
$$\phi_1 = (x_1 \lor x_2 \lor \neg x_3) \land (\neg x_1 \lor x_2 \lor x_3) \land (x_1 \lor \neg x_2 \lor x_3)$$

**Asignación satisfacible**: $x_1 = \text{verdadero}, x_2 = \text{verdadero}, x_3 = \text{verdadero}$

Verificación:
- $(V \lor V \lor F) = V$
- $(F \lor V \lor V) = V$  
- $(V \lor F \lor V) = V$
- $\phi_1 = V \land V \land V = V$

### Ejemplo 2: Fórmula insatisfacible
$$\phi_2 = (x_1 \lor x_2 \lor x_3) \land (x_1 \lor x_2 \lor \neg x_3) \land (x_1 \lor \neg x_2 \lor x_3) \land (x_1 \lor \neg x_2 \lor \neg x_3) \land (\neg x_1 \lor x_2 \lor x_3) \land (\neg x_1 \lor x_2 \lor \neg x_3) \land (\neg x_1 \lor \neg x_2 \lor x_3) \land (\neg x_1 \lor \neg x_2 \lor \neg x_3)$$

Esta fórmula contiene todas las posibles combinaciones de 3 literales con las variables $x_1, x_2, x_3$, por lo que es equivalente a exigir que las variables satisfagan todas las posibles asignaciones simultáneamente, lo cual es imposible.

# Reducción desde SAT

## 1. SAT es NP?

1. Si la entrada es satisfactible entonces existe al menos una asignación que de todas la clausulas son V. Puedo validar reemplazando las variables por los valores encontrados $O(3C)$ entonces es $O(C)$ lineal con respecto al número de clausulas
2. Si la entrada en insatisfactible entonces no existe ninguna entrada que de V, no es posible construir una verificación con la que me puedan engañar.
3. Puedo concluir que 3SAT $\in$ NP. Porque puedo verificar que una solución es correcta en **tiempo polinomial**

# Demostración que 3SAT es NPC

1. ¿3SAT en NP?  Si, porque lo puedo validar en tiempo polinomial
2. Probar que es NP-Hard.
	1. Selecciono un problema NPC conocido (SAT)
	2. Planteo una reducción de ese problema al problema (3SAT)
		1. La reducción en tiempo polinomial
		2. Instancias positivas de SAT son instancias positivas de 3SAT
		3. Instancias negativas de SAT son instancias negativas de 3SAT

# Procedimiento de reducción

$$
SAT \leq_{p} 3SAT
$$
Esto es dificil de demostrar y por ende vamos a asumir que es asi. Esto me dice la dirección de la reducción. A = SAT y B = 3SAT, vamos a transformar una entrada de SAT en una de 3SAT.


## Clausulas de tamaño 1

$$
C = z_1
$$
Vamos a añadir dos variables adicionales $v_1, v_2$ y añadimos 4 clausulas adicionals con las combinaciones de $v_1$ y $v_2$

$$
C = (z_1,v_1,v_2),(z_1,v_1,\bar{v_2}),(z_1,\bar{v_1},v_2),(z_1,\bar{v_1},\bar{v_2})
$$

Notese que la satisfactibilidad depende del valor de $z_1$ las variables adicionales se añaden de tal forma que no **afecten el resultado**

1. ¿Que pasa si z es falso? No hay combinacion de $v_1,v_2$ que haga satisfacer el problema. No importa que valores les demos, va existir una clasula que ambos den F
2. ¿Que pasa si z es verdadero? No hay combinacion de las otras variables de tal forma una clasula de F.

# Clasulas de tamaño 2

Vamos a añadir una variable $v_1$ adicional y creamos dos clasulas

$$
C = (z_1,z_2)
$$
Al convertir

$$
C = (z_1,z_2,v_1),(z_1,z_2,\bar{v_1})
$$

El valor de v1 ¿Afecta el resultado? No, porque en una clasula está sin negar y en la otra esta negado, siempre vamos a tener un F. El resultado dependerá de $z_1$ y $z_2$

# Clasulas de tamaño 3

No hay que hacer nada, pasa directamente

# Clasulas de tamaño mayor que 3

Vamos a crear $k-3$ variables y $k-2$ clasulas.

$$
C = (z_1,z_2,\ldots z_k)
$$
La conversión queda asi:

$$
(z_1,z_2,v_1),(\bar{v_1},z_3,v_2),(\bar{v_2},z_4,v_3) \ldots (\bar{v_{k-3}}
,z_{k-1},z_{k})
$$

Ejemplo k = 4, variables k - 3 = 1 (variable), clasulas k -2 = 2 (clasulas)

$$
C = (z_1,z_2,z_3,z_4)
$$
Convierte en
$$
C = (z_1,z_2,v_1),(\bar{v_1},z_3,z_4)
$$

1. Si alguna de la variables es V, entonces la clausula es V, ¿v afecta?.  (F,F,F,V), ¿Que valor debe tomar v1 para que sea V? debe ser V, entonces satisface.
2. Si todas son F, entonces la clasula es F, ¿Existe algun valor de V1 que de V la clasula?. En alguno de los dos lados va ser F, lo que va a volver la clausula.

k = 5

$$
(z_1,z_2,z_3,z_4,z_5)
$$
Entonces creamos k - 3 variables (2) y k-2 clasulas (3)

$$
C = (z_1,z_2,v_1),(\bar{v_1},z_3,v_2),(\bar{v_2},z_4,z_5)
$$
1. Para que sea verdadero al menos una de las variables debe ser verdadera, notese que la combinación $v_1, v_2$ tiene al menos un valor que vuelve las clausulas verdaderas. Si la clasula 1 verdadera. ¿Que valores de v hacen las otras dos verdederas?. (F,F)
2. Todas las variables z son falsas ¿Existe una combinación de v que haga cambiar ese valor? No improta que valores le coloques a v habrá siempre una clausula falso.

En general la forma

$$
(z_1,z_2,v_1),(\bar{v_1},z_3,v_2),(\bar{v_2},z_4,v_3) \ldots (\bar{v_{k-3}}
,z_{k-1},z_{k})
$$

Hace que
bar
1. Si la clasula es satisfecha, existe una combinación de los v que la haga verdadera ambien.
2. Si la clausula no se satisface, va existir siempre una clausula que se hace falsa, dado que la combinación de los v siempre va hacer que un termino quede falso


## Estrategia correctitud

- Instancias positivas SAT son instancias positivas en 3SAT. Existe una combinación de $z$ y $v$ de tal que da verdadero tambien. Al menos una clasula dará VERDADERO, por como está acomodados los $v$ todas las otras darán VERDADERO. Es es por el encadenamiento de la reducción
- Instancias negativas de SAT son instancias negativas de 3SAT, vamos a tener siempre una clasula FALSA; porque en el encadenamiento e los $v$ uno va siempre a dar Falso, si los $z$ tambien lo son, entonces una clausula va a dar falso.

## Complejidad de la reducción

1. Caso clausulas de tamaño 1. creo dos variables y 4 clasulas. cambio lineal.
2. Caso clausulas de tamaño 2, creo 1 variables y na clausula. cambio lineal.
3. Caso clausulas tamaño 3, pasa igual $O(1)$
4. Caso clausulas tamaño mas que 3, creo $k-3$ variables y $k-2$ clasulas. Relación lineal

Por lo tanto la reducción es lineal en términos de las variables y el número de clausulas $O(C)$


# Ejemplo

$$
C = \{(v_1,v_2),(\bar{v_1}),(v_1,v_2,\bar{v_3}),(v_1,v_2,v_3,v_4,\bar{v_5}) \}
$$

## Reducción de SAT a 3SAT para el conjunto dado

Dado el conjunto de cláusulas:
$$C = \{(v_1,v_2),(\bar{v_1}),(v_1,v_2,\bar{v_3}),(v_1,v_2,v_3,v_4,\bar{v_5})\}$$

### Paso 1: Clausula de tamaño 2 - $(v_1,v_2)$
Se añade una variable auxiliar $a_1$:
$$(v_1,v_2,a_1),(v_1,v_2,\bar{a_1})$$

### Paso 2: Clausula de tamaño 1 - $(\bar{v_1})$
Se añaden dos variables auxiliares $a_2, a_3$:
$$(\bar{v_1},a_2,a_3),(\bar{v_1},a_2,\bar{a_3}),(\bar{v_1},\bar{a_2},a_3),(\bar{v_1},\bar{a_2},\bar{a_3})$$

### Paso 3: Clausula de tamaño 3 - $(v_1,v_2,\bar{v_3})$
Pasa directamente sin cambios:
$$(v_1,v_2,\bar{v_3})$$

### Paso 4: Clausula de tamaño 5 - $(v_1,v_2,v_3,v_4,\bar{v_5})$
Se añaden $k-3 = 2$ variables auxiliares $a_4, a_5$ y $k-2 = 3$ cláusulas:
$$(v_1,v_2,a_4),(\bar{a_4},v_3,a_5),(\bar{a_5},v_4,\bar{v_5})$$

## Resultado final de la reducción

El conjunto transformado en 3SAT es:

$$
\begin{aligned}
&(v_1,v_2,a_1), \\
&(v_1,v_2,\bar{a_1}), \\
&(\bar{v_1},a_2,a_3), \\
&(\bar{v_1},a_2,\bar{a_3}), \\
&(\bar{v_1},\bar{a_2},a_3), \\
&(\bar{v_1},\bar{a_2},\bar{a_3}), \\
&(v_1,v_2,\bar{v_3}), \\
&(v_1,v_2,a_4), \\
&(\bar{a_4},v_3,a_5), \\
&(\bar{a_5},v_4,\bar{v_5})
\end{aligned}
$$

**Variables utilizadas**: $v_1, v_2, v_3, v_4, v_5, a_1, a_2, a_3, a_4, a_5$

**Propiedades de la reducción**:
- Todas las cláusulas tienen exactamente 3 literales
- La fórmula original es satisfacible si y solo si la fórmula transformada es satisfacible
- La reducción se realiza en tiempo polinomial ($O(C)$)
