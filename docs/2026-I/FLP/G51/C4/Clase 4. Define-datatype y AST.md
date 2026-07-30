# Como vamos

1. Representación de datos recursivos
	1. Inductiva: $5 \in S,\; n \in S \therefore n+5 \in S$
	2. Gramaticas
```ebnf
	   <lst-sym> ::= '()
		         ::= <symbol> <lst-sym>
```
2. TADs
	1. Tipo abstracto de datos
	2. Interfaz (uso del programador) e implementación (interna del lenguaje)
	3. Interfaz:
		1. Constructores: Inicializar un dato perteneciente al tipo
		2. Observadores
			1. Predicados: Para consultar a que tipo de dato pertenece
			2. Extractores: Extraen la información dentro de los tipos
		3. Diseño de TADs
			1. Implemente un constructor para cada variante en la gramática
			2. Implemente un predicado para cada variante en la gramática
			3. Implemente un extractor para cada parte de cada variante en la gramática.
	4. Alcance y ligadura
		1. Alcance en bloque: let (solo se toma lo anterior)
		2. Alcance secuencial: let* se toma el valor generado anteriormente
		3. Alcance recursivo: letrec* los valores se conocen entre sí y asi mismos (usar solo para procedimientos recursivos)
	5. Diseño TADs, volvemos independiente de la representación interna, nos da igual si son listas, procedimientos u otra estructura.

# Temas

El día de hoy tenemos las temáticas de define-datatype para arboles de sintaxis abstracta

1. [Define-datatype](Define-datatype.md)
2. [Ejercicio](Ejercicio.md)
3. [Ejemplo ambientes](Ejemplo%20ambientes.md)
4. [Sintaxis abstract y concreta](Sintaxis%20abstract%20y%20concreta.md)
5. [Ejercicio parser-unparser](Ejercicio%20parser-unparser.md)
6. [Resumen](Resumen.md)