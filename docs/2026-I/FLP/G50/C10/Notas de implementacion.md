
# TAD de tipo

```scheme
(define-datatype type type?
  (atomic-type (name symbol?))
  (proc-type
    (arg-types (list-of type?))
    (result-type type?))
  (tvar-type
    (serial-number integer?)
    (container vector?)))
```

Agregamos el caso cuando es ? (variable de tipo)


# Check-equal-type

```scheme
(define check-equal-type!
	...
	((tvar-type? t1) (check-tvar-equal-type! t1 t2 exp))
    ((tvar-type? t2) (check-tvar-equal-type! t2 t1 exp))
    ...
```

Cuando son variables de tipo entonces cambia el comportamiento

```scheme
(define check-tvar-equal-type!
  (lambda (tvar ty exp)
    (if (tvar-non-empty? tvar)
      (check-equal-type! (tvar->contents tvar) ty exp)
      (begin
        (check-no-occurrence! tvar ty exp)
        (tvar-set-contents! tvar ty)))))
```

1. Si no esta vacia, compara los tipos
2. Si esta vacia, asigna uno validando que no existan recursiones.
3. check-no-occurrence!  valida que si es tipo procval, no exista la misma variable de tipo dentro del procedimiento: utilidad lo del numero serial


# Ejemplos

```scheme
(type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in f")))
(tvar3 -> tvar3)
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in f")))
(tvar4 -> tvar4)
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in (f 5)")))
int
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in let k = (f 5) in f")))
(int -> int)
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in let k = (f true) in f")))
(bool -> bool)
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in let k = (f proc(int y) +(y,3)) in f")))
((int -> int) -> (int -> int))
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in let k = (f proc(? y) +(y,3)) in f")))
((int -> int) -> (int -> int))
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in let k = (f proc(? y) y) in f")))
((tvar19 -> tvar19) -> (tvar19 -> tvar19))
(type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in let k = (f proc(? x, ? y) +(x,3) ) in f")))
((int * tvar3 -> int) -> (int * tvar3 -> int))
> (type-to-external-form (type-of-program (scan&parse "let f = proc(? x) x
in let k = (f proc(? x, ? y) (y +(x,3)) ) in f")))
((int * (int -> tvar10) -> tvar10) -> (int * (int -> tvar10) -> tvar10))

```

En los casos que encontramos tvar es que no se puede determinar el tipo con lo que tenemos, a esto se le conoce como **tipo polimorfico**