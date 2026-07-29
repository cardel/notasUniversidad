# Sesión 9: 18 de Abril Asignación

¿Que implica la asignación?

- Ya no tenemos nombres si no VARIABLES, ya no tenemos ligadura (nombrar un valor), asignación (maneja referencias las cuales SI pueden cambiar)
- Incluir referencias las cuales permiten APUNTAR a diferentes valores
- Programación funcional trabaja con funciones (como clausuras) y funciones deteministas (siempre llegan al mismo valor con los mismo argumentos), pero la programación imperativa agrega el concepto de ESTADO, el flujo del programa es el estado (Ciclos)
- Esto implica que aparecen operaciones de EFECTO, hacen algo pero NO tienen retorno, en algunos lenguajes se maneja como void, None, Null, Nil, etc etc etc etc
- Las operaciones de efecto nos obligan a tener SECUENCIALIDAD, para nuestro lenguaje vamos a tomar como valor la ULTIMA
- Programació imperativa trabaja sobre el ESTADO, el programa se describe como una secuencia de ESTADOS, ver tema de Computación iterativa en ADA
- 

```scala
var suma = 0
for i <- 1 to 10:
		suma += i
```

(i,suma) → (0,0) → (1,1) → (2, 3) → (3, 6) → (4,10) …→ (10, ?)

---

¿Que cambios hacemos en nuestro interprete?

- Añaden el set (para cambiar) set <id> = <expr> y el begin, begin <exp>+ end (este va a retornar siempre el ultimo)
- Añado el datatype de referencia, tiene una posición y un vector
- Cambio los ambiente para que los valores sean vectores
- Añador las funciones de deref (extraer el valor de una referencia) y setref (cambia el vector asociado a la referencia)
- Cuando se consulta una variable en apply-env se retorna SIEMPRE la referencia (al convertirlo en valor expresado) se retorna el valor.<exp>

<exp>

<exp>

<exp>

<exp>