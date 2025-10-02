
# Modificaciones a la gramática

Vamos a incluir la directiva letrec

```
<expression> ::= "letrec"
			 (
				<identificador> "(" (<identificador>)* (,)")" "=" <expression>
			)*
			"in"
			<expression>
```
Se van a poder escribir cosas como:

```scheme
letrec
	f(x,y) = if >(x,0) then g(-(x,1),y) else y
	g(a,b) = if >(a,0) then +(b, f(-(x,y),y)) else y
	in
		(f 10 2) 
```

La modificación a la gramática es:

```scheme
;; Modificación a la gramática para soportar letrec
(expression 
 ("letrec" 
  (arbno                            ; Permite cero o más definiciones recursivas
   identifier "(" 
   (separated-list identifier ",")  ; Lista de parámetros separados por comas
   ")" 
   "=" expression)                  ; Cuerpo del procedimiento
  "in" 
  expression) 
 letrec-exp)                        ; Constructor: letrec-exp
```

## Comentarios Detallados sobre la Modificación

### Estructura General
```scheme
letrec
  proc1(param1, param2, ...) = cuerpo1
  proc2(arg1, arg2, ...)    = cuerpo2
  ...
in
  expresión-cuerpo
```

### Componentes Clave

1. **`letrec` - Palabra clave**
   - Indica que se trata de un bloque de definiciones recursivas mutuas
   - Diferenciador clave frente a `let` o `let*`

2. **`(arbno ...)` - Múltiples definiciones**
   - Permite definir **cero o más** procedimientos recursivos
   - Cada definición sigue el patrón: `nombre(param1, param2, ...) = cuerpo`

3. **`(separated-list identifier ",")` - Parámetros formales**
   - Lista de identificadores separados por comas
   - Define la firma del procedimiento
   - Ejemplo: `f(x, y, z)` crea un procedimiento con tres parámetros

4. **`expression` después de `=` - Cuerpo del procedimiento**
   - Define la implementación del procedimiento
   - Puede hacer referencia a otros procedimientos definidos en el mismo `letrec`

5. **`expression` después de `in` - Cuerpo principal**
   - Expresión donde las definiciones recursivas están en scope
   - Es el contexto de ejecución del bloque `letrec`

### Ejemplo de Uso
```scheme
;; Definición de procedimientos mutuamente recursivos
(letrec
  es-par?(n)  = if =(n,0) #t (es-impar? -(n,1))
  es-impar?(n) = if =(n,0) #f (es-par? -(n,1))
in
  (es-par? 4))  ; → #t
```

### Características Importantes

- **Recursión mutua**: Los procedimientos pueden referenciarse entre sí
- **Ámbito extendido**: Las definiciones son visibles en todos los cuerpos
- **Evaluación perezosa**: Las clausuras se crean con el ambiente extendido recursivo
- **Consistencia**: No hay problemas de referencias circulares gracias al mecanismo de ambientes recursivos

```scheme
;; Manejo de expresiones letrec en eval-expression
(letrec-exp
 (procnames llargs bodies expn)     ; Componentes de la expresión letrec
 (eval-expression
  expn                             ; Expresión del cuerpo principal (después de "in")
  (extend-recursively-env          ; Extender el ambiente con definiciones recursivas
   procnames                       ; Lista de nombres de procedimientos
   llargs                          ; Lista de listas de argumentos (parámetros formales)
   bodies                          ; Lista de cuerpos de los procedimientos
   env)))                          ; Ambiente actual (base para la extensión)
```

## Comentarios Detallados sobre la Modificación

### Flujo de Ejecución

1. **Parseo de la expresión**:
   - `procnames`: Lista de identificadores de los procedimientos
   - `llargs`: Lista de listas, donde cada sublista son los parámetros de un procedimiento
   - `bodies`: Lista de expresiones que definen el cuerpo de cada procedimiento
   - `expn`: Expresión principal después de la palabra clave `in`

2. **Extensión del ambiente**:
   ```scheme
   (extend-recursively-env procnames llargs bodies env)
   ```
   - Crea un **nuevo ambiente** que contiene las definiciones recursivas
   - El ambiente resultante permite referencias mutuas entre los procedimientos

3. **Evaluación del cuerpo**:
   ```scheme
   (eval-expression expn nuevo-ambiente)
   ```
   - Evalúa la expresión `expn` en el contexto del ambiente extendido
   - Las definiciones de `letrec` están disponibles durante esta evaluación


### Características Clave

1. **Evaluación Pospuesta**:
   - Los cuerpos de los procedimientos **no se evalúan inmediatamente**
   - Se crean clausuras que se evaluarán solo cuando se invoquen

2. **Ambiente Recursivo**:
   - El `extend-recursively-env` garantiza que cada clausura tenga acceso a todas las definiciones
   - Resuelve el problema de la referencia circular

Esta implementación es elegante porque delega toda la complejidad de la recursión mutua al mecanismo de ambientes, manteniendo `eval-expression` simple y consistente.


