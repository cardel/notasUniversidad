# Clase 2. Elementos de programación funcional

# Introducción

Paradigmas de programación

Técnica para resolver problemas en un lenguaje programación

Paradigma: Como lo resuelvo

Lenguaje: Forma en que lo resuelvo

Los lenguajes de programación pueden manejar uno o más paradigmas de programación

C++: Imperativo y O.O

Java: O.O y eventos

Ruby: Imperativo. O.O, funcional, concurrente.

---

Imperativo

- Estado: Variables y asignación
- Secuencialidad: Orden en las operaciones

```python
def f(x):
	return x

f(10)

g(10) #Debe conocer la función
def g(x):
	return x**2
```

- Imperativos: ciclos for, while (asignación), control de flujo: continue, break, return

---

Orientado a objetos

- Abstracción del mundo real: propiedades y métodos
- Clase: Plantilla para la construcción de objetos que son instancias de ella
- Instanciación: Darle valores a los atributos
- Encapsulación: Controlo como se puede ver o modificar los valores de una clase, usando modificadores: public, private y protected (depende)
- Relaciones: composición, herencia y uso
- Polimorfismo: Forma de cambiar el comportamiento de los objetos (herencia, sobrecarga)
- Clases abstractas (polimorfismo) e interfaces

---

Eventos

Acción ejecutada por el usuario: presionar una tecla, cualquier cosa con el mouse

---

Funcional

- Variables inmutables
- Funciones como ciudadanos de primera clase
- La ejecución está basada en las funciones
- Toda expresión devuelve un valor
- Scala

# Estrategias de evaluación

Evaluación por valor

- Se conoce evaluación ansiosa (se toman los valores de inmediato)
- Se evalua de izquierda a derecha hasta reducir a un único valor