
# Como vamos

Hemos visto como especificar datos recursivos

1. Especificación inductiva

    $$
    2 \in S, n \in S \therefore n+2 \in S
    $$

2. Especificación mediante gramáticas
```ebnf
   <list-n> ::= '() | <int> <list-n>
```
3. Diseño de las funciones recursivas, deben seguir la especificación de los datos recursivos
	1. Caso base: Terminación
	2. Caso recursivo: Compone la solución y paulatinamente desglosa la entrada para llegar al caso base (terminación)
4. Alcance y ligadura de variables
	1. let especificaciones en bloque
	2. let* especificaciones en secuencia
	3. letrec especificaciones recursivas: Funciones
5. Aspectos de alcance
	1. Alcance estática: Cada variable vive en su ambito y fuera de el no es accesible
	2. Alcance dinámicoL Cada variable puede ser potencialmente global
	3. Shadowing / Ocultamiento: Cuando una variable en un contexto local oculta una variable global

# Temas

1. [Abstracción de datos](Abstracción%20de%20datos.md)
2. [Ejemplo ambientes](Ejemplo%20ambientes.md)
3. [Ejemplo Expresion Calculo Lambda](Ejemplo%20Expresion%20Calculo%20Lambda.md)
4. [Ejemplo tuplas](Ejemplo%20tuplas.md)
5. [Resumen](Resumen.md)

