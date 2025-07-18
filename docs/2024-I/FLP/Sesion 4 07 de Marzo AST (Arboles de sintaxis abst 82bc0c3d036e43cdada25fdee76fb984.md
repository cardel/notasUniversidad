# Sesion 4: 07 de Marzo: AST (Arboles de sintaxis abstracta)

¿Que es un AST?

Es una representación de los datos a partir de la gramática

![Untitled](Sesion%204%2007%20de%20Marzo%20AST%20(Arboles%20de%20sintaxis%20abst%2082bc0c3d036e43cdada25fdee76fb984/Untitled.png)

---

¿Como definimos un AST en racket?

```racket
(define-datatype nombre nombre?
      (caso1 (x tipo?)
                 ...
              (z (list-of tipo?))
       (caso2)
           ....
       (caso n) (...) (...) (..)
 )
```

[https://www.notion.so](https://www.notion.so)

---

¿Como construimos datos?

Usando los constructores provistos por las variantes

```racket
(caso1 arg1 arg2 ... argn)
;;Los argi deben ser de los tipos esperados
```

---

¿Como extraemos información de los AST?

```racket
(cases tipo variable
    (caso1 (arg1 arg2 .. argn) ..)
    ..
    (caso n () ...) )

(cases tipo variable
   (caso1 ( ....) ...)
   (else ...))
```