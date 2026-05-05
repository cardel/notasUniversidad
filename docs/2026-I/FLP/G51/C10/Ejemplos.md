```scheme

> (type-to-external-form (type-of-program (scan&parse "let x = 3 in x")))
int
> (type-to-external-form (type-of-program (scan&parse "let x = proc(int x, int y) +(x,y) in x")))
(int * int -> int)
> (type-to-external-form (type-of-program (scan&parse "let x = proc(int x, int y) +(x,y) in (x 10 3)")))
int
> (type-to-external-form (type-of-program (scan&parse "let x = proc(? x, ? y) x in (x 10 3)")))
int
> (type-to-external-form (type-of-program (scan&parse "let x = proc(? x, ? y) x in x")))
(tvar9 * tvar10 -> tvar9)
> (type-to-external-form (type-of-program (scan&parse "let x = proc(? x, ? y) x in let f = (x 2 3) in x")))
(int * int -> int)
> (type-to-external-form (type-of-program (scan&parse "let x = proc(? x, ? y) *(x,y) in x")))
(int * int -> int)
```

## Ejercicio en clase

```scheme
 (type-of-program (scan&parse "let func = proc(? f, ? x) (f +(x,1) >(x,0)) in let res = (func proc(? a, ? b) a 10) in res"))
#(struct:tvar-type
  24
  #(#(struct:atomic-type int)))
> (type-to-external-form (type-of-program (scan&parse "let func = proc(? f, ? x) (f +(x,1) >(x,0)) in let res = (func proc(? a, ? b) a 10) in res")))
> 
> (type-to-external-form (type-of-program (scan&parse "let func = proc(? f, ? x) (f +(x,1) >(x,0)) in let res = (func proc(? a, ? b) a 10) in func")))
((int * bool -> int) * int -> int)
```