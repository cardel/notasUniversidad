# Sesión 09: Asignación y paso por referencia

# Asignación

Anotaciones

- Toda expresión retorna un valor
- Tenemos ligaduras no variables (inmutables)

---

Paradigma procedural / imperativo

- Programas tienen estado (cambios en las variables)
- Secuencialidad

- Asignación: Posibilidad de cambiar las variables
- Secuencialidad: Posibilidad de ejecutar instrucciones de acuerdo a su orden

---

Cambios en el interpretador

- Introducir las referencias
    - ¿Un valor puede cambiar por si mismo?
    - Necesitamos un apuntador a los valores
    - Referencia: Posición y un vector (referencia al ambiente)

---

Introducir referencias

```racket
(define-datatype referencia referencia?
	(a-ref
		(pos number?)
		(vec vector?)
	)
)
```

---

begin

El begin ejecuta una secuencia de instrucciones y retorna la última

```racket
begin
	set x = 10;
	set y = 20;
	+(x,y)
end

;;Retorna 30
```

---

Asignación

Se hace con set, a la larga modifica el valor que está apuntando la referencia en el vector (vector-set!)

---

¿Que cambia en los ambientes?

Ambiente extendido, ya no contiene una lista de valores si uno vector, este siempre pasa por referencia lo que garantiza que los cambios se vean reflejados

```racket
(define-datatype ambiente ambiente?
	(ambiente-vacio)
	(ambiente-extendido
		(lid (list-of symbol?)
		(vec vector?) ; Aqui está el cambio
		(amb ambiente?)
	)
)
```

## Paso por referencia

¿CUal es el problema de pasar una copia a un función de una estructura de datos compleja?

```racket
let
	a = proc(x,y) ...
	b = [1,2,3,......,]
	in
		letrec
			f(x,y) = ... (a x y)
			...
		in
			(f ... b)
```

El problema es que si copiamos siempre b podemos tener problemas con la memoria, **problema de las colecciones complejas**

---

Que sucede en la siguiente expresión 

```racket
let
    a = 3

    f = proc(x, y)
        begin
            set x = +(x, 1);
            set y = +(y, 2);
            +(x, y)
        end

    in
        let
            b = (f a a)
            c = (f a a)

        in
            +(a, +(b, c))

```

a = 3

f = proc(x,y)

begin

set x = +(x,1);

set y = +(y,2);

+(x,y)

end

in

let

b = (f a a)

c = (f a a)

in