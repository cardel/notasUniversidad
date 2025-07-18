# Sesión 06: Condicionales, ligaduras y procedimientos

---

# Condicionales

Que cambios hay en el interprete

1. Valores expresados: Numeros y booleanos
2. Valores denotado: Números y booleanos
3. Introducir booleanos, en el libro los definen como 0 si es falso y en otro caso es verdadero.  

```racket
<expression> ::= "true"
								true-exp()
						 ::= "false"
								false-exp
								
(define evaluar-expresion
	(lambda (exp amb)
		....
		(true-exp () #T)
		(false-exp () #F)
```

1. Definir las primitivas booleanas 

```racket
(define gramatica
'(

		(primitive (">") mayor-prim)
		(primitive ("<") menor-prim)
		(primitive (">=") mayor-igual-prim)
		(primitive ("<=") menor-igual-prim)
		(primitive ("==") igual-prim)
		(primitive ("and") and-prim)
		(primitive ("or") or-prim)
		(primitive ("not") not-prim)
```

---

Condicionales

```racket
<expression> ::= "if" <expresion>
								"then" <expresion>
								"else" <expresion>

(define gramatica
	'(
	
			(expression ("if" expresion "then" expresion "else" expresion) if-exp)
...					
(define evaluar-expresion
	(lambda (exp amb)
	    ....
	    (if-exp (test-exp
					     true-exp
						   false-exp)
						   
				     ....
				    (answer (evaluar-expresion test-exp amb))
				    (if
					    answer
					    (evaluar-expresion true-exp amb)
					    (evaluar-expresion false-exp amb)
					   )
						   
```

# Ligaduras locales

Que son

Permiten generar ligaduras con alcance estático

Tener en cuenta que a la hora de evaluar la expresión se hace sobre un ambiente extendido que contiene las ligaduras creadas

---

Como se implementa

```racket
<expression> ::= "let"
									(<identificador> "=" <expresion)*
									"in"
									<expresion>
									
```

# Procedimiento

¿Que es?

Un conjunto de instrucciones que podemos reutilizar

Procedimientos tiene 0 más entradas (argumentos) y una sola salida (valor)

Programación funcional: Los procedimientos son VALORES

- Valores expresados: Numeros + Booleanos + Procval
- Valores denotados: Numeros + Booleanos + Procval

---

Consistencias de los procedimientos

En programación funcional. No importa donde usted llame un conjunto de instrucciones SIEMPRE deben retornar el MISMO VALOR

```racket
let
	x = 10
	in
		let
			f = proc(a) +(a,x)
			in
				let
				  q = (f 10) % 20
					x = 20
					in
						(f 10) % 20
```

No importa como llame (f 10) siempre me debe retornar el MISMO RESULTADO (Consistencia funcional)

---

Clausura

Es la representación de un procedimiento (lambda)

```racket
(define-datatype procval procval?
	(clousure
		(lid (list-of symbol?))
		(body expression?)
		(env enviroment?)
		)
	)
```