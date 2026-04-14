Actualmente la politica del lenguaje es paso por valor, lo quiere decir que cuando se invoca un procedimiento este crea nuevas referencias para los valores que se pasan.

Sin embargo aveces queremos causar un efecto sobre las variables que pasamos un procemiento por ejemplo

```scheme
let
	f = proc(x,y)
			begin
				set x = +(x,1);
				set y = *(y,2);
				+(x,y)
			end
	a = 10
	b = 20
	in
		(f a b)
```

En el esquema de paso por valor, x toma el valor de 10, y el valor de 20, si se modifican x valiendo 11 y vale 40, pero a y b conservan su valor

En el esquema de paso por referencia, x = 11  y = 40, a = 11, b = 40, esto porque x tiene la referencia de a y b tiene la referencia de y.

Para realizar esto debemos modificar el comportamiento del interprete de asignación:

1. Incluir los targets
	1. Target directo: Es el mismo comportamiento de paso por valor
	2. Target indirecto: Es el comportamiento de paso por referencia
2. Definición
	1. Target directo contiene un valor expresado (Numero, boolean o procval)
	2. Target indirecto contiene un target, que debe ser directo, si es indirecto debe de fallar para evitar cadenas de indirectos
3. Cambia el comportamiento
	1. Let: Crea target directos en el ambiente
	2. app-exp: Evaluación de procedimientos
		1. Si llega un var-exp creo un target-indirecto que contiene el target directo de la variable que le paso
		2. Si llega otra cosa, creo un target-directo