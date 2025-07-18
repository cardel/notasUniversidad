# Clase 8: Asignación, paso por referencia

Enlace para diversión: [https://haveibeenpwned.com/](https://haveibeenpwned.com/)

¿Porque necesitamos asignación?

- Nos da la posibilidad de tener variables, valores mutables
- Esto implica que hay operaciones que no retornan un valor, por ejemplo una asignación (pero los lenguajes lo manejan como un valor exito C++, None python, void en el caso Java)
- La asignación necesariamente implica secuencialidad
    - ¿Que es secuencialidad? Se ejecutan las instrucciones en **orden**, porque el orden de la ejecucion de las instrucciones puede alterar el resultado (estado)
    - Tenemos operaciones de efecto, es decir que no devuelven un valor (no es compatible con la programación funcional)
    - Efecto pueden local o global

---

¿Como se implementa asignación?

1. En paradigma funcional sólo tenemos **valores** los cuales no **cambian**
2. Ahora las variables almacenan referencias que son punteros hacia valores

![image.png](Clase%208%20Asignacio%CC%81n,%20paso%20por%20referencia%201d17fd794c2880748fd2d6282ea59d96/image.png)

3. Necesitamos implementar las referencias, las cuales apuntadores a valores, cuando esta cambia, no cambiamos el valor, cambiamos la referencia

---

Implementación en el lenguaje

1. Construir la referencia como datatype
2. Ahora los valores denotados son referencias a valores expresados
3. Ahora los ambientes contienen son vectores, los cuales son mutables y al pasarlos pasan por referencia (para que los cambios los pueden ver todas la referencia)
4. Esto implica ciertos cambios en la implementación
    1. agregar a set como operación de asignación
    2. begin como secuencialidad

---

# Paso por referencia

Cual es la diferencia entre paso por valor y por referencia

- Paso por valor se pasa una copia del valor cuando se llama una función o procedimiento

```yaml
let 
   f = proc(a,b) +(a,b)
   x = 2
   y = 3
   in (f x y)
   #Se pasa una copia de x y y
```

En lenguajes de programación, usualmente los valores de tipo primitivo (integer, float, double, chat, bool) se pasan por valor, ya que hacer una copia es facil, pero datos complejos (estructuras, arreglos, listas, objetos) se pasan por referencia

- Paso por valor/referencia explicito: C++
- Paso por valor/referencia implicito: Java, Python, Javascript, etc aplica únicamente para estructuras de datos complejas (colecciones, secuencias, objetos)

---

¿Como se implementa paso por referencia en el lenguaje?

Modificar el comportamiento,

- Targets: Directo (valor), Indirecto (paso por referencia)
- Un target directo contiene un referencia
- Un target indirecto contine un target directo
- Se crea un target indirecto cuando pasamos una variable a un procedimiento (f x 2) x es un target indirecto y 2 es un target directo (valor)
- Cuando intento modificar un target indirecto, se extrae el target directo y se modifica su referencia
- Cuando interno modificar un target directo, se modifica su referencia

# Ejercicios

[2025-04-10-Note-09-59_annotated.pdf](Clase%208%20Asignacio%CC%81n,%20paso%20por%20referencia%201d17fd794c2880748fd2d6282ea59d96/2025-04-10-Note-09-59_annotated.pdf)

[2025-04-10-Note-10-52_annotated.pdf](Clase%208%20Asignacio%CC%81n,%20paso%20por%20referencia%201d17fd794c2880748fd2d6282ea59d96/2025-04-10-Note-10-52_annotated.pdf)