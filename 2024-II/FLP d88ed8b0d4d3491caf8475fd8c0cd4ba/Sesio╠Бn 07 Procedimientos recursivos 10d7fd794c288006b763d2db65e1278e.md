# Sesión 07: Procedimientos recursivos

---

Procedimientos recursivos

Son procedimientos se llaman a sí mismos

```lisp
let
	x = proc(a,b) if >(a,0) then 
			(x -(a,1) b) else b
in
	(x 2 3)
```

![Untitled-2024-09-26-0829.png](Sesio%CC%81n%2007%20Procedimientos%20recursivos%2010d7fd794c288006b763d2db65e1278e/Untitled-2024-09-26-0829.png)

x no puede conocerse a sí mismo, sin embargo NO podemos modificar el let porque podriamos tener problemas de consistencias

---

Letrec

- Entorno únicamente para la declaración de procedimientos
- Este nos va ofrecer la posibilidad de generar procedimientos
- letrec
    - lid: Lista de los id procedimientos
    - llarg: Lista de listas de argumentos
    - lbody Lista de cuerpos de procedimientos
    - exp: Expresión vamos a evaluar
    
    ```lisp
    <expression> ::= "letrec" (<identificdor> "(" (<identificador> ",")* ")"
    		                 = <expression>)* "in" <expression>
    		                 
    
    letrec
    		f(x,y) = if >(x,0) then (g -(x,1) y) else y
    		g(a,b) = if >(a,0) then (f -(a,1) b) else b
    		in
    			(f 4 3)
    			
    ;;Evaluar expresión
    (letrec
    	  (lid llarg lexp body)
    	      .....
    )
    
    lid = '(f g)
    llarg = '( (x y) (a b))
    lexp = '(if >(x,0) ....   if >(a,0) ....)
    exp = (f 4 3)
    ```
    

---

Ambiente extendido recursivo

- Es un ambiente únicamente para procedimientos
- No vamos a almacenar clausuras
- Vamos a almcenar
    - lid: lista de los nombres los procedimientos
    - llargs: lista de lista argumentos
    - lbody: lista de cuerpos
    - body: Expresión que estamos evaluando
    
    Esto implica modifica ambiente/environment
    
    ```lisp
    (define-datatype enviroment enviroment?
    	(empty-env)
    	(extend-env
    		(lid (list-of symbol?))
    		(lval (list-of value?))
    		(old-env enviroment?)
    	)
    	(recursively-extend-env
    		(proc-names (list-of symbol?))
    		(larg (list-of (list-of symbol?))(
    		(lbody (list-of expression?))
    		(old-env enviroment?)
    	)
    	)
    		
    ```
    

---

Modificar la función apply-env

- Cuando es ambiente vacio da un error
- Cuando es ambiente extendido busca la varible y la retorna si la encuentra, si no la encuentra busca en el ambiente anterior
- Cuando es ambiente extendido recursivo:
    - Si la encuentra: **genera una clausura conteniendo el mismo ambiente**
    - Si no la encuentra busca en el ambiente anterior