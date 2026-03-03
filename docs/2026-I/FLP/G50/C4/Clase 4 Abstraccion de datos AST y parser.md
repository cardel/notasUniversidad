
# Como vamos

1. Representación recursiva de datos
	1. Representación inductiva
	   $$
	   '() \in S, n \in \mathbb{N} \wedge l \in S \therefore n :: s \in S
	   $$
	2. Representación en gramáticas BNF
```ebnf
<lst-num> ::= '()
          ::= <int> <lst-num>
```

2. Representación de datos TAD
	1. Estos poseen una implementación e interfaz
	2. El programador usa la interfaz
	3. Para el diseño de los TADs
		1. Diseño de procedimientos constructores: Define un elemento que pertenece al tipo de dato
		2. Diseño de observadores
			1. Predicados: Permiten saber si pertenece al tipo de dato
			2. Extractores: Permiten extraer las partes dentro de un TAD
		3. ¿Como diseñamos TADs?
			1. Incluya un constructor para cada variante en la gramática
			2. Incluya un predicado para variante de la gramática
			3. Incluya un extractor para cada parte en cada variante de la gramática.
	4. Alcance y ligadura: let, let*, letrec. Shadowing.

# Temas

Vamos a dos temas

1. AST Arboles de sintaxis abstracta
2. Parser - Unparser


# Contenido

1. [Define-datatype](Define-datatype.md)