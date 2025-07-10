# Clase 2 Abstracción de datos

# Relación entre inducción y recursividad

## Especificación inductiva

¿Para que sirve?

Definir un conjunto de valores (tipo) a partir de un caso base sobre el cual extendemos.

---

¿Como se especifica?

- Especifica el (los) caso base
- Especifica el caso recursivo

$$
'() \in S, n \in \mathbb{N} \wedge l \in S \therefore n :: l \in S
$$

## Especificación recursiva

Backus Nour

- Simbolos terminales
- Simbolos no terminales (producciones)
- Reglas se especifica < > ::=

```jsx
<list> ::= '()
			 ::= <int> <list>
```

## Alcance y ligadura

Tipos de alcance

- Estático: Dentro de los bloques de un lenguaje
- Dinámico: Que depende las reglas del lenguaje de programación