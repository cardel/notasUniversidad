
Los objetos son una abstracción del mundo real que poseen:
- **Estado**: atributos o propiedades del objeto
- **Comportamiento**: métodos o acciones que puede realizar

Por ejemplo, un perro tiene una edad y un peso, que pueden cambiar con el tiempo. El perro tiene comportamientos como ladrar, caminar, morder, etc.

La programación orientada a objetos consiste en pensar las soluciones a problemas como relaciones entre objetos:

- Herencia
- Composición
- Uso

## Clases

Son agrupaciones de objetos del mismo tipo. Por ejemplo:

- Lucas
- Toby

Son perros, ambos comparten las características de un perro, pero se diferencian en su estado. Por ejemplo, Lucas tiene 10 años mientras Toby tiene 5 años. Es decir que ambos son **instancias** de una clase llamada Perro. Una instancia es darle valores específicos a los atributos de una clase.

## Relaciones entre clases

### Herencia

Muchas veces necesitamos definir una clase usando los atributos de otra. Por ejemplo:

- Perro de caza
- Perro doméstico

Ambos son grupos de perros, pero varían en sus propiedades y acciones.

Se dice que perro de caza y perro doméstico heredan características de la clase Perro, pero definen las suyas propias.

### Composición

Una clase puede tener internamente en sus campos valores complejos que pueden ser representados por otras clases.

Un computador tiene un disco duro (capacidad, color, peso, etc.), tiene memoria (con sus características), pantalla (marca, modelo, etc.), etc.

### Uso

Es una relación entre clases en la cual una utiliza métodos de la otra, pero no la compone.

- Persona
- Guitarra

¿Qué hace una persona con una guitarra? Puede tocarla, pero la guitarra no hace parte de la persona.

## Otros tipos de relaciones

### Polimorfismo

En el contexto de herencia significa que una subclase (clase hija) tiene métodos que hereda de una clase padre, pero al invocarlos puede darse un comportamiento diferente.

```python
# Clase padre que define la estructura básica de un animal
class Animal:
    def __init__(self, nombre, edad):
        # Constructor que inicializa los atributos básicos
        self.nombre = nombre
        self.edad = edad

    def emitir_sonido(self):
        # Método que será sobrescrito por las clases hijas
        return "muhaha"

# Clase hija que hereda de Animal
class Reptil(Animal):
    def __init__(self, nombre, edad):
        # Llamada al constructor de la clase padre
        super().__init__(nombre, edad)

    def emitir_sonido(self):
        # Implementación específica para reptiles
        return "grrrr"

# Otra clase hija que hereda de Animal
class Mamifero(Animal):
    def __init__(self, nombre, edad):
        # Llamada al constructor de la clase padre
        super().__init__(nombre, edad)

    def emitir_sonido(self):
        # Implementación específica para mamíferos
        return "auuuuuuuuu"

# Bloque principal de ejecución
if __name__ == "__main__":
    # Creación de instancias de las clases hijas
    animalA = Reptil("Juan", 32)
    animalB = Mamifero("Pedro", 10)

    # Demostración del polimorfismo: mismo método, comportamientos diferentes
    print(animalA.emitir_sonido())  # Output: grrrr
    print(animalB.emitir_sonido())  # Output: auuuuuuuuu
```

Al ejecutar este código vemos lo siguiente:

```bash
grrrr
auuuuuuuuu
```

Vemos que el comportamiento de `emitir_sonido` cambia de acuerdo a la implementación dada por las clases hijas, siendo que ambos objetos son de tipo Animal.

## Características de los objetos

1. **Propiedad de encapsulación**: Puedo controlar la gestión (acceso o modificación) del estado usando los métodos. Dentro de esto aparecen los modificadores de alcance: public, private y protected.

2. **Clases agrupan objetos**: Las clases definen el molde para crear múltiples objetos con las mismas características.

3. **La herencia permite generar nuevas clases a partir de las anteriores**: Facilita la reutilización de código y la creación de jerarquías.

4. **El polimorfismo permite que objetos de la misma clase puedan tener un comportamiento diferente**: Mismo método, diferentes implementaciones.

## Conceptos adicionales importantes

### Abstracción
La capacidad de representar características esenciales de un objeto sin incluir detalles de implementación.

### Encapsulación
El ocultamiento de los detalles internos de implementación de un objeto, exponiendo solo una interfaz pública.

### Modularidad
La división del sistema en partes más pequeñas y manejables (módulos o clases) que pueden ser desarrolladas y mantenidas independientemente.

## Tabla de resumen de conceptos de POO

|Concepto|Definición|Ejemplo|
|---|---|---|
|**Objeto**|Entidad que combina estado y comportamiento|Un perro con edad=5 y método ladrar()|
|**Clase**|Molde o plantilla para crear objetos|Clase Perro define atributos y métodos comunes|
|**Instancia**|Objeto específico creado a partir de una clase|Lucas (perro de 10 años)|
|**Herencia**|Mecanismo para crear nuevas clases basadas en existentes|PerroDeCaza hereda de Perro|
|**Polimorfismo**|Capacidad de objetos de responder al mismo mensaje de forma diferente|emitir_sonido() produce "grrrr" en Reptil y "auuu" en Mamifero|
|**Encapsulación**|Ocultamiento de detalles internos del objeto|Atributos privados con métodos públicos de acceso|
|**Composición**|Relación donde una clase contiene objetos de otras clases|Computador contiene DiscoDuro, Memoria, Pantalla|
|**Abstracción**|Representación simplificada de la realidad|Clase Vehículo sin detalles de motor específico|
|**Modularidad**|División del sistema en partes independientes|Separación en clases distintas para cada responsabilidad|

## Comentarios adicionales

- La programación orientada a objetos mejora la mantenibilidad y reutilización del código
- El principio de responsabilidad única sugiere que cada clase debe tener una única responsabilidad
- Las relaciones entre clases deben diseñarse cuidadosamente para evitar acoplamiento excesivo
- Los patrones de diseño son soluciones recurrentes a problemas comunes en POO
- La sobrecarga de métodos permite múltiples implementaciones con diferentes parámetros
- Las interfaces definen contratos que las clases deben implementar sin especificar cómo
- La cohesión mide cómo se relacionan las responsabilidades dentro de una clase