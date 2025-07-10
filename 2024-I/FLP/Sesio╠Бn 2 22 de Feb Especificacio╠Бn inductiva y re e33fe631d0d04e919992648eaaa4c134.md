# Sesión 2: 22 de Feb: Especificación inductiva y recursiva

Especificación inductiva

Utiliza notación de conjuntos y relaciones lógicas (consecuencia)

$$
2 \in S, n \in S \therefore n+2 \in S
$$

---

Especificación mediante gramáticas

```python
<list-S> ::= '()
         ::= <number> <list-S>
```

---

Diseño de programas mediante la especificación

- Sigue la gramática evalua el caso
- Si llega al caso actual extrayendo los valores

```racket
(define funcion
    (lambda (d ....)
      (cond
          [(caso1? d) ...]
          [(caso2? d) ...]
          ..
          [(casoN? d) ...]
          [else (eopl:error ...)
 
```

---

Definición de programa de calculo lambda

Es la definición matemática de lo que es un PROGRAMA

```racket
<lc-exp> ::= <identificador>
         ::= lambda (<identificador>) <lc-exp>
         ::= <lc-exp> <lc-exp>
```

---

Ligadura

Ocurre libre: No existe relación o asignación de la variable

Ocurre ligado: Esta ligado o asignado a un valor

---

Alcance de variables

let (ligadura local)

let* (ligadura procedural/imperativa)

letrec (ligadura recursiva)

---

let

```racket
(let
   (
     ... area definiciones ...
     (variable valor)
    )
    expresion
)

;;En el area de definiciones USAMOS las variables creadas anteriormente
;; Las variables no existe hasta que se terminan de definir
```

---

let*

```racket
(let*
  (
   area definiciones
   (x 1)
   (y x) ;; y ya conoce a x pero no a la inversa
   ;;SECUENCIAL
  )
 expresion
)
```

---

letrec

```racket
(letrec
  (
   ... area definciones ...
    TODOS SE CONONOCEN CON TODOS
    SII SON FUNCIONES
   (x (lambda (..) (y ...))
   (y (lambda (..) (x ...))
 ;;x e y se conocen entre si
;;se conocen a si mismas
  )
 expresion
```