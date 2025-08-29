# Ocurrencia
- Variable ocurre libre siempre y cuando no esté ligada a un valor
- Ocurre ligada cuando está ligada a un valor

## Calculo $\lambda$ 

Especificación matemática de programas en un paradigma funcional, se utiliza para demostrar matematicamente que un programa es correcto con respecto a una especificación (funcionamiento y escritura)

```bnc
<lc-exp> :: <identificador> 
             var-exp(id)
        ::= "lambda" "(" <identificador> ")" <lc-exp)
	        lambda-exp(id, exp)
        :: "(" <lc-exp> <lc-exp> ")"
           app-exp(rator, rands)

```

1. Caso 1: Aplica para variables (asignación)
2. Caso 2: Para funciones o procedimientos
3. Caso 3: Evaluación de funciones, métodos o procedimientos.

```lisp
'x ; Identificador caso 1
'(lambda (x) (x y)) ; Caso 2 dentro caso 3 (caso 1)
'(x y) ; Caso 3 --> Caso 1 y Caso 1

```

1. Si es caso 1, entonces es igual que la variable
2. Si es caso 2, tiene que ser diferente del id y ocurrir libre en la exp
3. Si es caso 3, debe ocurrir libre en el rator o en el rand
**Análisis de occurs-free?:**

```scheme
(define occurs-free?
  (lambda (exp var)
    (cond
      [(symbol? exp) (eqv? exp var)]          ; Caso variable
      [(eqv? (car exp) 'lambda)               ; Caso lambda
       (and
        (not (eqv? (caadr exp) var))          ; Verifica que var no sea el parámetro
        (occurs-free? (caddr exp) var))]      ; Busca en el cuerpo
      [else                                   ; Caso aplicación
       (or
        (occurs-free? (car exp) var)          ; Busca en el operador
        (occurs-free? (cadr exp) var))])))    ; Busca en el operando
```

**Evaluación por casos gramaticales:**

1. **Variable (`symbol? exp`)**: 
   - Retorna `#t` si la variable es igual a `var`
   - Ej: `(occurs-free? 'x 'x)` → `#T`

2. **Abstracción lambda (`(eqv? (car exp) 'lambda)`)**:
   - `(caadr exp)` extrae el parámetro formal
   - Si `var` es el parámetro formal → `#F` (variable ligada)
   - Si no, busca recursivamente en el cuerpo `(caddr exp)`
   - Ej: `(occurs-free? '(lambda (x) (x y)) 'x)` → `(and (not #T) ...)` → `#F`

3. **Aplicación (caso else)**:
   - Busca recursivamente en both el operador y el operando
   - Retorna `#t` si aparece libre en cualquiera de los dos
   - Ej: `(occurs-free? '(x (lambda (x) x)) 'x)` → `(#T or #F)` → `#T`

**Análisis de las expresiones:**

**exp1 = 'x**
- `(occurs-free? 'x 'y)` → `(eqv? 'x 'y)` → `#F` (y no aparece)
- `(occurs-free? 'x 'x)` → `(eqv? 'x 'x)` → `#T` (x aparece libre)

**exp2 = '(lambda (x) (x y))**
- `(occurs-free? exp2 'x)` → `(and (not (eqv? 'x 'x)) (occurs-free? '(x y) 'x))` → `(and #F ...)` → `#F` (x está ligado por el lambda)
- `(occurs-free? exp2 'y)` → `(and (not (eqv? 'x 'y)) (occurs-free? '(x y) 'y))` → `(and #T (#T or #T))` → `#T` (y aparece libre en el cuerpo)

**exp3 = '(x (lambda (x) (lambda (y) x)))**
- `(occurs-free? exp3 'x)` → `(or (occurs-free? 'x 'x) (occurs-free? '(lambda (x) ...) 'x))` → `(or #T #F)` → `#T` (x libre en el operador)
- `(occurs-free? exp3 'y)` → `(or (occurs-free? 'x 'y) (occurs-free? '(lambda (x) ...) 'y))` → `(or #F #F)` → `#F` (y está ligado en el lambda interno y no aparece libre)