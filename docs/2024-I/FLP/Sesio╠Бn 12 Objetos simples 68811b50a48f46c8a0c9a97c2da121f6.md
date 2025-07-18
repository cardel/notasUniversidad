# Sesión 12: Objetos simples

## Conceptos

¿Que conceptos son importantes para entender objetos?

- ¿Que es una clase?
- ¿Que es un objeto?
- ¿Cual es la diferencia entre clase y objeto?
- ¿Cuales son las relaciones entre clases?
    - Herencia
    - Composición
    - USO
- ¿Que es polimorfismo?
- Despacho dinamico de métodos
- Encapsulación
- Modificadores de acceso: public, private, protected

---

¿Que modificamos en el interpretador?

- Agregamos que un programa cero o más clases seguidas de una expresión
- Agregamos una expresión para declarar de clases
- Agregamos una expresión para declarar métodos
- Agregamos una expresión para instanciar (new)
- Agregamos una expresión para llamar métodos (send)
- Agregar una expresión para llamados super (super) SOLO APLICA DENTRO DE OBJETOS

---

¿Como representamos un objeto?

Una lista de partes, cada parte tiene el nombre de la clase y los valores de los atributos, object se representa como la lista vacia

---

¿Que sucede cuando instanciamos un objeto?

1. Se crea la lista de partes con los campos en 0
2. Se ejecuta el método initialize

---

¿Que sucede cuando instanciamos un método?

Se construye un ambiente que tiene super, self, y los argumentos el cual extiende de un ambiente generado a partir de la LISTA DE PARTES, esto sucede PARA CADA LLAMADO, tenemos la propiedad de encapsulación