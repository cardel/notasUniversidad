Essential of programming languages (EOPL) tiene una librería en Racket EOPL.

https://docs.racket-lang.org/eopl/

Esto contiene funciones para construir interpretes basados en la sintaxis.

Gramaticas LL: Grammar Left language: Gramaticas por la izquierda, el términal está en la izquierda y son lenguajes regulares.

```
var x
var x = 10
```
Si esto sucede les vas aparecer un left shift conflict.

# Frontned

## Scanner

Toma el código fuente y genera unidades léxicas o significativas, esto sirve para extraer las partes importante del código e ignorar cosas como los comentarios.

- Numeros
- Identificadores
- Expresiones


## Parser

Toma un conjunto de unidades significativas y lo traduce en un AST

Si el AST se puede generar entonces el programa está correctamente escrito (sintaxis correcta)

# ¿Que es el interprete?

Es un programa que toma un AST y nos produce un resultado, es decir le damos semántica o significado al código que escribimos

## Analizador léxico

El analizador léxico va a tomar unas reglas sobre lo que son las unidades signicativas en el lenguaje y me va devolver una lista de ellas.

## Gramática

Conjunto de reglas que va tener nuestro lenguaje de programación