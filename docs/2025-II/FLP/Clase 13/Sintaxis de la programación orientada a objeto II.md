# Sintaxis de la programación orientada a objetos II

La herencia nos permite tomar clases y definir nuevas a partir de ellas.

Es importante que las clases hijas ejecuten el método initialize de su padre y eso lo vamos a hacer con un **super llamado**, que consiste en que una clase hija invoca métodos de su padre.

```scheme
% Clase padre con campos x e y
class c1 extends object
    field x
    field y
    method initialize() 1
    method setx1(a) set x = a
    method sety1(a) set y = a
    method getx1() x
    method gety1() y
    
% Clase hija que hereda de c1 y define su propio campo y
class c2 extends c1
    field y
    method initialize() super initialize()
    method sety2(a) set y = a
    method getx2() x
    method gety2() y
    
% Ejemplo de uso de las clases
let
    o1 = new c1()  % Instancia de la clase padre
    o2 = new c2()  % Instancia de la clase hija
in
    begin
        send o1 setx1(30);      % Establece x de o1 a 30
        send o1 sety1(200);     % Establece y de o1 a 200
        send o2 setx1(100);     % x de c1 vale 100
        send o2 sety1(20);      % y de c1 vale 20
        send o2 sety2(30);      % y de c2 vale 30
        list(
            send o1 getx1(),    % 30
            send o1 gety1(),    % 200
            send o2 getx1(),    % 100
            send o2 gety1(),    % 20
            send o2 getx2(),    % 100
            send o2 gety2()     % 30
        )
    end
```

Cuando el método initialize no setea los campos, estos por defecto valen 0.

En c2 cuando seteo x, seteo x de c1 porque c2 no tiene x, pero si seteo y en c2, seteo al campo y de c2.

## Variable de instancia de objeto

Los métodos van a tener un parámetro implícito llamado **self** el cual contiene la instancia del objeto. Este permite invocar métodos en el mismo objeto y permite, por ejemplo, desde clase padre llamar métodos de las clases hijas.

```scheme
% Declaración de clase padre
class c1 extends object
    method initialize() 1
    method m1() 1
    method m2() 2
    method m3() send self m2()  % Uso de self para llamar m2
    
% Clase hija que sobrescribe el método m2
class c2 extends c1
    method initialize() 1
    method m2() 3
    
% Ejemplo de uso con self
let
    o1 = new c1()  % Instancia de clase padre
    o2 = new c2()  % Instancia de clase hija
in
    list(
        send o1 m1(),  % Retorna 1
        send o1 m2(),  % Retorna 2
        send o1 m3(),  % Retorna 2
        send o2 m1(),  % Retorna 1
        send o2 m2(),  % Retorna 3
        send o2 m3()   % Retorna 3
    )
```

El uso de self permite invocar el objeto dentro de los métodos. En el caso de:

1. En o1, `send self m2()` es como invocar `send o1 m2()` e invoca la versión en c1
2. En o2, `send self m2()` es como invocar `send o2 m2()` e invoca la versión en c2

En este caso se dice que hay **despacho dinámico de métodos**, dependiendo de la instanciación del objeto se ejecuta una versión de m2 u otra.

## Conceptos teóricos adicionales

### Shadowing de campos
Cuando una clase hija define un campo con el mismo nombre que la clase padre, el campo de la clase hija "oculta" al de la clase padre. Esto se conoce como shadowing.

### Llamada a super
La palabra clave `super` permite acceder a métodos de la clase padre desde la clase hija, manteniendo la funcionalidad base mientras se extiende el comportamiento.

### Referencia self
La referencia `self` es fundamental para el polimorfismo, ya que permite que los métodos llamen a otros métodos del mismo objeto sin conocer su tipo específico en tiempo de compilación.

### Encadenamiento de constructores
Es una práctica recomendada que los constructores de las clases hijas llamen al constructor de la clase padre para garantizar la inicialización completa del objeto.

## Tabla de resumen de conceptos avanzados de POO

| Concepto | Definición | Ejemplo en Scheme |
|----------|------------|-------------------|
| **Herencia** | Mecanismo para crear clases basadas en existentes | `class c2 extends c1` |
| **Super llamado** | Invocación de métodos de la clase padre | `super initialize()` |
| **Shadowing** | Ocultamiento de campos/métodos de la clase padre | `field y` en c2 oculta `field y` en c1 |
| **Self** | Referencia implícita a la instancia actual | `send self m2()` |
| **Despacho dinámico** | Selección de método basada en tipo real del objeto | `send o2 m3()` ejecuta m2 de c2 |
| **Jerarquía de campos** | Acceso a campos heredados vs. propios | `send o2 gety1()` vs `send o2 gety2()` |
| **Inicialización** | Proceso de preparación de objetos | `method initialize()` |
| **Encadenamiento** | Llamadas secuenciales entre métodos | `m3()` llama a `m2()` vía `self` |
| **Polimorfismo** | Capacidad de objetos de responder al mismo mensaje de forma diferente | `m3()` produce diferentes resultados según la instancia |

## Comentarios adicionales

- El shadowing de campos puede causar confusión y debe usarse con precaución
- La llamada a super en constructores es esencial para garantizar la inicialización completa
- La referencia self es fundamental para implementar el polimorfismo en tiempo de ejecución
- El despacho dinámico permite que el comportamiento se adapte al tipo real del objeto
- La herencia múltiple no está soportada en este esquema de clases simple
- Los métodos privados pueden implementarse mediante convenciones de nomenclatura
- La composición a menudo es preferible a la herencia para reducir el acoplamiento
- El principio de sustitución de Liskov debe guiar el diseño de jerarquías de herencia
- La inicialización por defecto de campos a 0 puede causar errores si no se maneja adecuadamente
- El uso de self permite implementar patrones como el Template Method
- La sobreescritura de métodos debe mantener la semántica esperada por la clase padre