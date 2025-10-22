# **Problema de programación**

(35 puntos) Se desea agregar al interpretador las listas al estilo Python, es decir, listas que pueden contener cualquier tipo de dato y que se representan como en el siguiente ejemplo: `[1][2][4][5]`, así mismo las primitivas `concat` para concatenar dos o más listas y `nth` para acceder a un elemento. Para esto se deben hacer cambios en la gramática, en la función eval-expression y se debe generar funciones auxiliares para trabajar con las listas.​

```scheme
  let
    x = [1,2,3]
    y = [4,5,6]
    z = concat(x,y)
    in [z, nth(z, 4)]
```


Debe retornar: `[[1,2,3,4,5],5]`

1. (10 puntos) Modifique la gramática para soportar las listas al estilo Python y agregar las primitivas `concat` y `nth`
    
2. (10 puntos) Modifique la función `eval-expression` para representar las listas
    
3. (15 puntos) Implemente las funciones auxiliares necesarias para soportar las primitivas `concat` y `nth`
    

A continuación se muestra la estructura general de lo que usted debe entregar, solo se requiere lo estrictamente necesario para resolver el problema. Solo escriba lo se debe agregar al interpretador.

```scheme
  (define grammar
   '( 
    (expression (....) list-exp) 
    (primitive (....) concat-exp)
    (primitive (....) nth-exp)
   )


  (define eval-expression)
    (lambda (exp env)
     (cases expression exp
      ......
    )
  )

  (define apply-primitive)
    (lambda (prim args)
     (cases primitive prim
      ......
    )
  )
```

# Solución

## Gramática

```scheme

  (define grammar
   '( 
   ; .....
    (expression ("[" (separated-list expression ",") "]") list-exp) 
    (primitive ("concat") concat-exp)
    (primitive ("nth") nth-exp)
    ; ...
   )

```

# Eval-expression

```scheme
  (define eval-expression)
    (lambda (exp env)
     (cases expression exp
      ;......
      (list-exp (lexp) 
        (map (lambda (x) (eval-expression x env)) lexp)
      )
      ; .....
    )
  )
```

# Apply-primitive

```scheme
  (define apply-primitive)
    (lambda (prim args)
     (cases primitive prim
      ; ....
      (concat-exp (append (car args) (cadr args))) 
      (nth-exp () (list-ref (car args) (cadr args)))
      ; ....
    )
  )
```

`(list-ref l a)` es una función de Racket que retorna el elemento en la posición  a de lista l. También se podía crear una función auxiliar que usara un contador y una lista, cuando este contador llegara a cero retornar el primer elemento.