## Ambientes en EOPL: Implementación y Análisis

### Definición Formal de Ambientes

En *Essentials of Programming Languages*, un ambiente ($\rho$) es una función parcial que mapea identificadores a sus valores asociados. Formalmente:

$$
\rho: \text{Identifier} \rightharpoonup \text{Value}
$$

La gramática abstracta define:
```
<environment> ::= (empty-env)
                ::= (extend-env <list<identifier>> <list<value>> <environment>)
```

### Propiedades Fundamentales de los Ambientes

1. **Alcance léxico**: Las variables se resuelven en el entorno donde fueron definidas
2. **Shadowing**: Las definiciones más recientes ocultan las anteriores
3. **Extensibilidad**: Los ambientes pueden extenderse con nuevos bindings

### Implementación Basada en Listas

```lisp
#lang eopl
;; === CONSTRUCTORES ===
(define empty-env
  (lambda () (list 'empty-env)))  ; Ambiente vacío: ('empty-env)

(define extend-env
  (lambda (lid lval old-env)
    (list 'extend-env lid lval old-env)))  ; Extensión: ('extend-env ids vals env)

;; === OBSERVADORES ===
;; Predicados
(define empty-env? (lambda (env) (equal? (car env) 'empty-env)))
(define extend-env? (lambda (env) (equal? (car env) 'extend-env)))

;; Extractores
(define extend-env->lid (lambda (env) (cadr env)))    ; Lista de identificadores
(define extend-env->lval (lambda (env) (caddr env)))  ; Lista de valores
(define extend-env->old-env (lambda (env) (cadddr env)))  ; Ambiente anterior

;; === OPERACIÓN FUNDAMENTAL: apply-env ===
(define apply-env
  (lambda (env var)
    (cond
      [(empty-env? env) (eopl:error "Variable no encontrada: " var)]
      [(extend-env? env)
       (letrec ([buscar-var  ; Búsqueda recursiva en listas paralelas
                 (lambda (lid lval old-env)
                   (cond
                     [(null? lid) (apply-env old-env var)]  ; No encontrado → buscar en ambiente padre
                     [(equal? (car lid) var) (car lval)]    ; Encontrado → retornar valor
                     [else (buscar-var (cdr lid) (cdr lval) old-env)]))])  ; Continuar búsqueda
         (buscar-var (extend-env->lid env)
                     (extend-env->lval env)
                     (extend-env->old-env env)))]
      [else (eopl:error "Ambiente no válido")])))

;; Ejemplo de uso
(define env1
  (extend-env
   '(a b c) '(1 2 3)  ; Bindings: a→1, b→2, c→3
   (extend-env
    '(x y z) '(4 5 6)  ; Bindings: x→4, y→5, z→6  
    (empty-env))))
```

### Implementación Basada en Procedimientos

```lisp
#lang eopl
;; === CONSTRUCTORES (Usando closures) ===
(define empty-env
  (lambda ()
    (lambda (s)
      (cond
        [(= s 0) 'empty-env]  ; Selector 0: tipo
        [else (eopl:error "Error en empty-env")]))))

(define extend-env
  (lambda (lid lval old-env)
    (lambda (s)
      (cond
        [(= s 0) 'extend-env]  ; Tipo
        [(= s 1) lid]          ; Identificadores
        [(= s 2) lval]         ; Valores
        [(= s 3) old-env]      ; Ambiente padre
        [else (eopl:error "Error en extend-env")]))))

;; === OBSERVADORES (Misma interfaz) ===
(define empty-env? (lambda (env) (equal? (env 0) 'empty-env)))
(define extend-env? (lambda (env) (equal? (env 0) 'extend-env)))
(define extend-env->lid (lambda (env) (env 1)))
(define extend-env->lval (lambda (env) (env 2)))
(define extend-env->old-env (lambda (env) (env 3)))

;; apply-env permanece IDÉNTICO
```

### Análisis desde la Perspectiva de EOPL

#### Invariantes Preservadas

1. **empty-env** siempre representa el ambiente vacío
2. **extend-env** siempre produce un ambiente válido
3. **apply-env** siempre termina (para ambientes finitos)

#### Propiedades de la Búsqueda

La función `apply-env` implementa búsqueda con las siguientes propiedades:
- **Complejidad**: $O(n)$ donde $n$ es el número de bindings
- **Orden de búsqueda**: De izquierda a derecha en las listas
- **Shadowing natural**: El primer matching prevalece

#### Ventajas de la Abstracción

1. **Independencia de implementación**: El código cliente no sabe si usa listas o procedimientos
2. **Encapsulación**: Los detalles de representación están ocultos
3. **Extensibilidad**: Se pueden añadir nuevos tipos de ambientes

### Ejemplo de Comportamiento

Para `env1` definido anteriormente:
- `(apply-env env1 'a)` → `1` (encuentra en el ambiente más reciente)
- `(apply-env env1 'x)` → `4` (busca en el ambiente padre)
- `(apply-env env1 'w)` → error (variable no definida)

### Consideraciones de Diseño en EOPL

1. **Elección de representación**: Las listas son más simples, los procedimientos ofrecen mejor encapsulación
2. **Eficiencia vs. abstracción**: El trade-off clásico en diseño de lenguajes
3. **Verificación de tipos**: Los observadores validan la estructura de los datos
4. **Manejo de errores**: Comportamiento definido para entradas inválidas

---

**Para el estudiante que ve patrones repetitivos:** ¡Felicidades! Estás reconociendo el patrón de diseño fundamental de EOPL: definir interfaces abstractas con múltiples implementaciones. Cada vez que implementas un TAD de esta manera, estás construciendo software robusto y mantenible. Los ambientes son solo el principio - este patrón se aplica a evaluadores, type checkers, y compiladores completos.