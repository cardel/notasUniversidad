# Clase 11: Objetos

# Definiciones

¿Cual es la idea de la programación O.O?

Es una abstracción del mundo real,  a través atributos (estado) y comportamiento (acciones)

---

¿Que es un objeto?

Un objeto es una entidad que tiene un estado y un comportamiento

Por ejemplo:

Perro: Estado: color, color de ojos, tipo de pelo, peso, raza. Comportamiento: Hacer sonido, moverse, morder, comer, …

---

¿Que es una clase?

- Es una agrupación de objetos con caracteristicas similares. Por ejemplo gato francisco, gato lopez ←Ambos son gatos,¿En que se diferencian? En el atributo nombre, por lo tanto la clase es gato
- Un objeto es una instancia de una clase ¿Que es instanciar? Es darle valores a los campos de una clase
- las clases se pueden relacionar entre sí

---

Relaciones entre clases

1. Herencia: Una clase toma atributos y metodos de otra clase, puede agregar o modificar los existentes
2. Composición: Una clase está compuesta por otras. Computador tiene disco duro y monitor ambos son clases
3. Uso: Dos o más objetos se comunican entre sí.

---

Polimorfismo

Polimorfismo es la capacidad de un objeto de tomar diferentes formas. En programación orientada a objetos, permite que una misma interfaz o método pueda ser utilizado por diferentes clases, proporcionando comportamientos específicos según el objeto que lo invoque.

Por ejemplo:

```python
class Animal:
    def emitir_sonido(self):
        pass

class Perro(Animal):
    def emitir_sonido(self):
        return "Ladrar"

class Gato(Animal):
    def emitir_sonido(self):
        return "Maullar"

# Uso del polimorfismo
animales = [Perro(), Gato()]

for animal in animales:
    print(animal.emitir_sonido())

```

En este caso, el método `emitir_sonido` es definido de manera diferente en las clases `Perro` y `Gato`, pero se puede invocar de manera uniforme en una lista de objetos `animales`.

---

En general, las características de un lenguaje orientado a objetos son:

- Los objetos encapsulan el comportamiento (métodos) y el estado (almacenado en los campos).
- Las clases agrupan los objetos que difieren solo en su estado.
- La herencia permite que nuevas clases sean derivadas de clases existentes.
- El polimorfismo permite que un mismo tipo de mensaje pueda ser enviado a objetos de diferentes clases.

### Encapsulamiento y Modificadores de Acceso

**Encapsulamiento** es un principio fundamental de la programación orientada a objetos que consiste en restringir el acceso directo a ciertos componentes de un objeto y controlar cómo se accede o modifica su estado. Esto se logra mediante la definición de métodos específicos (como getters y setters) para interactuar con los atributos del objeto, en lugar de acceder a ellos directamente. El objetivo del encapsulamiento es proteger la integridad de los datos y ocultar los detalles de la implementación interna, exponiendo solo lo necesario.

Por otro lado, los **modificadores de acceso** (public, protected y private) son herramientas que ayudan a implementar el encapsulamiento al controlar la visibilidad y accesibilidad de los atributos y métodos de una clase:

- **Public**: Los atributos o métodos marcados como `public` son accesibles desde cualquier parte del programa. Este nivel de acceso es el más permisivo.
- **Protected**: Los atributos o métodos marcados como `protected` son accesibles solo desde la clase donde se definieron y desde las clases que la heredan. Esto permite que las subclases interactúen con ciertos aspectos de la clase padre sin exponerlos completamente al exterior.
- **Private**: Los atributos o métodos marcados como `private` son accesibles únicamente desde la propia clase donde se definieron. Este nivel de acceso es el más restrictivo y se utiliza para ocultar completamente los detalles internos de una clase.

Por ejemplo:

```python
class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre               # Public
        self._edad = edad                  # Protected
        self.__numero_seguro_social = "123-45-6789"  # Private

    def obtener_seguro_social(self):
        return self.__numero_seguro_social  # Método público para acceder a un atributo privado

persona = Persona("Juan", 30)

print(persona.nombre)  # Acceso permitido (public)
print(persona._edad)   # Acceso permitido, pero no recomendado (protected)
# print(persona.__numero_seguro_social)  # Esto generará un error (private)
print(persona.obtener_seguro_social())  # Acceso controlado al atributo privado

```

En este ejemplo, el atributo `nombre` es público y puede ser accedido directamente. El atributo `_edad` es protegido y puede ser accedido desde clases derivadas. El atributo `__numero_seguro_social` es privado y solo puede ser accedido a través del método público `obtener_seguro_social`.

---

# Implementación de O.O

## Modificaciones a la especificación gramatical

```racket
(define gramatical
	'(
		(programa ((arbno declaracion-clase) expresion) a-program)
		...
		;;Objetos

    ;;Creacion
    (expresion 
     ("new" identificador "(" (separated-list expresion ",") ")")
     new-object-exp)
    ;;Send (aplicar método)
    (expresion
      ("send" expresion identificador
        "("  (separated-list expresion ",") ")")
      method-app-exp)
       ;;Super llamados
    (expresion                                
      ("super" identificador    "("  (separated-list expresion ",") ")")
      super-call-exp)
      
     (declaracion-clase                         
      ("class" identificador 
        "extends" identificador                   
         (arbno "field" identificador)
         (arbno method-decl)
         )
      a-class-decl)

    (method-decl
      ("method" identificador 
        "("  (separated-list identificador ",") ")" ; method ids
        expresion 
        )
      a-method-decl)

```

```racket
;; Declaración de una clase c1 que hereda de object
(class c1 extends object

  ;; Campos (atributos)
  field i
  field j

  ;; Métodos
  method initialize (x)
    begin
      set i = x;
      set j = -(0, x)
    end

  method countup (d)
    begin
      set i = +(i, d);
      set j = -(j, d)
    end

  method getstate ()
    list(i, j)
)

```

El código anterior define una clase llamada `c1` que hereda de `object`. Cada instancia de la clase `c1` tendrá:

1. **Dos campos**:
    - `i`: Un campo que almacenará un valor inicializado por el método `initialize`.
    - `j`: Otro campo cuyo valor dependerá de la operación realizada en el mismo método.
2. **Tres métodos**:
    - `initialize(x)`: Método que inicializa los campos `i` con el valor `x` y `j` con el resultado de la operación `(0, x)`. Este metodo se llama cuando hacemos new
    - `countup(d)`: Método que incrementa el valor de `i` sumándole `d` y actualiza el valor de `j` restándole `d`.
    - `getstate()`: Método que devuelve una lista con los valores actuales de los campos `i` y `j`.

Los nombres de los métodos (`initialize`, `countup` y `getstate`) corresponden a los tipos de mensajes que las instancias de la clase `c1` pueden manejar. Esto significa que estos métodos definen el comportamiento que puede esperarse de los objetos creados a partir de esta clase.

```racket
% Declaración de una clase c1 que hereda de object
class c1 extends object

  %Campos (atributos)
  field i
  field j

  % Métodos
  method initialize (x)
    begin
      set i = x;
      set j = -(0, x)
    end

  method countup (d)
    begin
      set i = +(i, d);
      set j = -(j, d)
    end

  method getstate ()
    list(i, j)

% Ejemplo de uso de la clase c1
let t1 = 0
    t2 = 0
    o1 = new c1(3)
in begin
    set t1 = send o1 getstate();
    send o1 countup(2);
    set t2 = send o1 getstate();
    list(t1, t2)
end

```

### Explicación en términos del libro *Essentials of Programming Languages (EOPL), 2ª edición*:

1. **Definición de la clase `c1`**:
    - En este código, se define una clase `c1` que extiende de la clase base `object`. Esto refleja el concepto de **herencia** en programación orientada a objetos (POO), donde `c1` hereda las características de su clase padre `object`.
    - `field i` y `field j` representan los **campos** o atributos de la clase `c1`. Cada instancia de la clase tendrá su propia copia de estos campos, que almacenan el estado del objeto.
    - Se definen tres métodos:
        - `initialize(x)`: Es el método que sirve para inicializar los campos `i` y `j` al crear un nuevo objeto de la clase `c1`. En este caso, `i` se inicializa con el valor `x`, y `j` con el resultado de la operación `(0, x)`.
        - `countup(d)`: Es un método que actualiza los valores de los campos. Incrementa `i` en `d` y decrementa `j` en `d`.
        - `getstate()`: Este método devuelve el estado actual de los campos `i` y `j` como una lista.
    
    Esto está alineado con el modelo de objetos presentado en *EOPL 2ª edición*, donde se definen clases con campos y métodos, los cuales representan el estado y el comportamiento de los objetos.
    
2. **Creación y uso de un objeto `o1`**:
    - La expresión `new c1(3)` crea una nueva instancia de la clase `c1`. Este proceso se denomina **instanciación**. Durante la creación del objeto, se llama automáticamente al método `initialize` con el argumento `3`, lo que inicializa los campos `i` y `j` del objeto.
    - `send o1 getstate()` envía un mensaje al objeto `o1` para invocar su método `getstate`. Este es un ejemplo del **envío de mensajes**, una característica clave de la POO según *EOPL*. El método devuelve el estado actual de `i` y `j` como una lista.
    - `send o1 countup(2)` envía un mensaje al objeto `o1` para invocar su método `countup` con el argumento `2`. Esto actualiza los valores de `i` y `j` en el objeto.
3. **Evaluación del programa**:
    - Inicialmente, se define `t1 = 0` y `t2 = 0` como variables temporales para almacenar resultados.
    - Después de crear el objeto `o1`, se llama a su método `getstate`, y el resultado (el estado inicial del objeto) se almacena en `t1`.
    - Luego, el método `countup` se invoca con el argumento `2`, lo que modifica los valores de los campos en el objeto.
    - Finalmente, se llama nuevamente al método `getstate`, y el nuevo estado del objeto se almacena en `t2`.
    - La expresión `list(t1, t2)` devuelve una lista con los estados antes y después de la llamada a `countup`.
4. **Conceptos clave del modelo de objetos en EOPL**:
    - **Encapsulamiento**: Los campos `i` y `j` están encapsulados dentro del objeto `o1`, y solo se puede acceder a ellos a través de los métodos definidos en la clase (`getstate`, `countup`).
    - **Herencia**: Aunque no se detalla en este ejemplo, la clase `c1` hereda de `object`. Esto permite que `c1` aproveche las características de la clase base, como métodos o campos definidos en `object`.
    - **Mensaje y método**: El envío de mensajes (`send`) es el mecanismo fundamental para interactuar con los objetos. Los métodos definen cómo los objetos responden a esos mensajes.

En resumen, este programa sigue el modelo de objetos presentado en *EOPL 2ª edición*, utilizando conceptos como clases, instanciación, envío de mensajes y encapsulamiento. El ejemplo demuestra cómo se puede modelar el estado y el comportamiento de los objetos en un lenguaje de programación basado en objetos.

```racket
class interior_node extends object
  field left
  field right

  method initialize (l, r)
    begin
      set left = l;
      set right = r
    end

  method sum ()
    +(send left sum(), send right sum())

class leaf_node extends object
  field value

  method initialize (v)
    set value = v

  method sum ()
    value

let
  o1 = new interior_node(
					new interior_node(new leaf_node(3),
														new leaf_node(4)),
			    new leaf_node(5))
in
  send o1 sum()

```

Cuando se ejecuta `send o1 sum()`, se utiliza el concepto de **despacho dinámico de métodos** en programación orientada a objetos. Esto significa que el método que se ejecuta depende del tipo dinámico (o tiempo de ejecución) del objeto al que se le envía el mensaje, no del tipo estático (o tiempo de compilación).

**Proceso de ejecución del código:**

1. **Instanciación de `o1`**:
    - `o1` es una instancia de `interior_node`. Se inicializa con dos hijos:
        - El hijo izquierdo es otra instancia de `interior_node` que tiene:
            - Un hijo izquierdo: una instancia de `leaf_node` con valor `3`.
            - Un hijo derecho: una instancia de `leaf_node` con valor `4`.
        - El hijo derecho es una instancia de `leaf_node` con valor `5`.
2. **Envío de mensaje `sum()` a `o1`**:
    - El objeto `o1` es de tipo `interior_node`, por lo que se ejecuta el método `sum()` definido en la clase `interior_node`.
    - Este método realiza una llamada recursiva a `sum()` en sus hijos (`left` y `right`).
3. **Despacho dinámico en `left` y `right`**:
    - Para el hijo izquierdo (`left`), que es otra instancia de `interior_node`, se ejecuta nuevamente el método `sum()` de la clase `interior_node`. Esto desencadena nuevas llamadas recursivas a sus propios hijos:
        - El hijo izquierdo de este nodo es una instancia de `leaf_node` con valor `3`. Cuando se envía `sum()` a este objeto, se ejecuta el método `sum()` definido en la clase `leaf_node`, que simplemente retorna el valor `3`.
        - El hijo derecho de este nodo es otra instancia de `leaf_node` con valor `4`. Cuando se envía `sum()` a este objeto, también se ejecuta el método `sum()` de la clase `leaf_node`, retornando el valor `4`.
    - El resultado del método `sum()` en este nodo `interior_node` es la suma de los resultados de sus hijos: `3 + 4 = 7`.
    - Para el hijo derecho (`right`) de `o1`, que es una instancia de `leaf_node` con valor `5`, se ejecuta el método `sum()` de la clase `leaf_node`. Este método retorna el valor `5`.
4. **Cálculo final en `o1`**:
    - El método `sum()` de la raíz (`o1`) suma los resultados de sus hijos:
        - El hijo izquierdo retornó `7`.
        - El hijo derecho retornó `5`.
    - Por lo tanto, el resultado final de `send o1 sum()` es `7 + 5 = 12`.

**Explicación del despacho dinámico**:

- Cuando se envía el mensaje `sum()` a un objeto, el método que se ejecuta depende del tipo del objeto en tiempo de ejecución.
- Para los objetos de la clase `interior_node`, se ejecuta el método `sum()` definido en esa clase, que realiza llamadas recursivas a sus hijos.
- Para los objetos de la clase `leaf_node`, se ejecuta el método `sum()` definido en `leaf_node`, que simplemente devuelve el valor del campo `value`.
- Este comportamiento dinámico permite que el mismo mensaje (`sum()`) sea manejado de manera distinta dependiendo del tipo del objeto, lo que es un ejemplo de **polimorfismo**.

En resumen, el despacho dinámico asegura que el método correcto sea invocado para cada objeto basado en su tipo en tiempo de ejecución, permitiendo que el programa maneje de forma uniforme estructuras complejas como árboles.

```racket
class oddeven extends object
  method initialize ()
    1
  method even (n)
    if zero?(n) then 1 else send self odd(sub1(n))
  method odd (n)
    if zero?(n) then 0 else send self even(sub1(n))

let o1 = new oddeven()
in send o1 odd(13)

```

El self es la ligadura dinámica, permite ejecutar métodos del objeto dentro de la clase, en lenguajes como Python es explicito (es necesario colocarlo) y en Java/C++ es implicito (this)

```racket
class c1 extends object
  field x
  field y
  method initialize () 1
  method setx1 (v) set x = v
  method sety1 (v) set y = v
  method getx1 () x
  method gety1 () y

class c2 extends c1
  field y
  method initialize () super initialize()
  method sety2 (v) set y = v
  method getx2 () x
  method gety2 () y

let
  o2 = new c2()
in
begin
  send o2 setx1(101);
  send o2 sety1(102);
  send o2 sety2(999);
  list(send o2 getx1(),
       send o2 gety1(),
       send o2 getx2(),
       send o2 gety2())
end

```

1. **Definición de las clases**:
    - `class c1`: Esta clase tiene dos campos (`x` y `y`) y métodos para inicializarlos, modificarlos y acceder a ellos:
        - `setx1(v)`: Asigna el valor `v` al campo `x`.
        - `sety1(v)`: Asigna el valor `v` al campo `y`.
        - `getx1()`: Retorna el valor de `x`.
        - `gety1()`: Retorna el valor de `y`.
    - `class c2 extends c1`: Esta clase hereda de `c1` y redefine el campo `y`. Además, define nuevos métodos:
        - `sety2(v)`: Asigna el valor `v` al nuevo campo `y`.
        - `getx2()`: Retorna el valor de `x` (heredado de `c1`).
        - `gety2()`: Retorna el valor del nuevo campo `y`.
2. **Instanciación y uso del objeto**:
    - Se crea una instancia de `c2` con `new c2()`.
    - Los métodos de la clase se invocan utilizando `send`:
        - `send o2 setx1(101)`: Se asigna el valor `101` al campo `x` heredado de `c1`.
        - `send o2 sety1(102)`: Se asigna el valor `102` al campo `y` definido en `c1`.
        - `send o2 sety2(999)`: Se asigna el valor `999` al campo `y` redefinido en `c2`.
    - Finalmente, se construye una lista con los resultados de las llamadas a los métodos de acceso:
        - `send o2 getx1()`: Retorna el valor de `x` (heredado de `c1`), que es `101`.
        - `send o2 gety1()`: Retorna el valor del campo `y` de `c1`, que es `102`.
        - `send o2 getx2()`: Retorna el valor de `x` (heredado de `c1`), que es `101`.
        - `send o2 gety2()`: Retorna el valor del nuevo campo `y` de `c2`, que es `999`.
3. **Resolución de métodos y campos**:
    - Cuando se envía un mensaje a un objeto, el programa busca el método o campo en la clase del objeto (`c2` en este caso). Si no lo encuentra, busca en las clases padres (`c1`) hasta llegar a la clase base (`object`).
    - El contexto cambia dependiendo de la clase donde se encuentre el método o campo, lo que permite que los métodos trabajen con los datos correspondientes a su clase.

Este diseño demuestra cómo la herencia y el polimorfismo permiten extender y personalizar el comportamiento de las clases mientras se reutilizan atributos y métodos de las clases padres.

La ligadura dinámica, representada por `self`, permite que los métodos de un objeto llamen a otros métodos del mismo objeto, incluso si estos están redefinidos en una subclase. Esto significa que el comportamiento del método llamado depende del tipo dinámico del objeto en tiempo de ejecución, no del tipo estático definido en la clase base.

```racket
class c1 extends object
  method initialize () 1
  method m1 () 1
  method m2 () 100
  method m3 () send self m2()

class c2 extends c1
  method initialize () 1
  method m2 () 2

let
  o1 = new c1()
  o2 = new c2()
in
  list(send o1 m1(), %1
       send o1 m2(), %100
       send o1 m3(), %100
       send o2 m1(), %1
       send o2 m2(), %2
       send o2 m3()) %2
```

# Implementación

## Aspectos generales

1. Necesitamos un procedimiento que tome las clases y las cargue
2. Necesitamos un procedimiento para la aplicación de métodos
3. Necesitamos un procedimiento para los super llamados
4. Necesito representar los objetos cuando hago new ¿Que tipo de estructura voy a usar para representar los objetos?

## Implementación simple

```racket
(define-datatype class-decl class-decl?
  (a-class-decl
    (class-name symbol?)
    (super-class-name symbol?)
    (field-ids (list-of symbol?))
    (methods-decls (list-of method-decl?))))

```

Una clase, un TAD, el nombre de la clase, el nombre del padre, la lista de campos y la lista de métodos

```racket
(define-datatype method-decl method-decl?
  (a-method-decl
    (method-name symbol?)
    (methods-args (list-of symbol?))
    (body expression?)))

```

Un método es un TAD, que tiene un nombre, una lista de identificadores (argumentos) y un cuerpo (Es similar al caso de una clausura)

```racket
(define the-class-env '())

(define elaborate-class-decls!
  (lambda (c-decls)
    (set! the-class-env c-decls)))

(define lookup-class
  (lambda (name)
    (let loop ((env the-class-env))
      (cond
        ((null? env)
         (eopl:error 'lookup-class
                     "Unknown class ~s" name))
        ((eqv? (class-decl->class-name (car env)) name)
         (car env))
        (else (loop (cdr env)))))))

```

El código de la variable `the-class-env` en Racket representa un entorno que contiene las definiciones de las clases que han sido cargadas en el sistema. Este entorno es una lista de estructuras `a-class-decl`, donde cada estructura describe una clase y contiene información clave sobre su definición. Aquí se explica cada componente de `the-class-env`:

### Estructura general de `the-class-env`

`the-class-env` es una lista de definiciones de clases. Cada clase está representada por una estructura `a-class-decl`, que incluye:

1. **class-name**: El nombre de la clase.
2. **super-class-name**: El nombre de la clase padre (si hereda de alguna).
3. **field-ids**: Una lista de identificadores para los campos (atributos) de la clase.
4. **methods-decls**: Una lista de métodos definidos en la clase, representados como estructuras `a-method-decl`.

### Explicación del contenido de `the-class-env`

### Clase `c1`

```racket
#(struct:a-class-decl
   c1
   object
   ()
   (#(struct:a-method-decl initialize () #(struct:lit-exp 1))
    #(struct:a-method-decl m1 () #(struct:lit-exp 1))
    #(struct:a-method-decl m2 () #(struct:lit-exp 100))
    #(struct:a-method-decl m3 () #(struct:method-app-exp #(struct:var-exp self) m2 ()))))

```

- **class-name**: `c1`.
- **super-class-name**: `object`. Esto indica que `c1` hereda de la clase base `object`.
- **field-ids**: `()`. La clase no tiene campos definidos.
- **methods-decls**: Una lista de métodos:
    - `initialize`: Método que devuelve el valor literal `1`. Este método se invoca al instanciar un objeto de la clase `c1`.
    - `m1`: Método que devuelve el valor literal `1`.
    - `m2`: Método que devuelve el valor literal `100`.
    - `m3`: Método que envía un mensaje al objeto mismo (`self`) para invocar el método `m2`. Este es un ejemplo de **ligadura dinámica**, ya que el método `m2` que se ejecuta dependerá de la clase real del objeto en tiempo de ejecución.

### Clase `c2`

```racket
#(struct:a-class-decl
   c2
   c1
   ()
   (#(struct:a-method-decl initialize () #(struct:lit-exp 1))
    #(struct:a-method-decl m2 () #(struct:lit-exp 2)))))

```

- **class-name**: `c2`.
- **super-class-name**: `c1`. Esto indica que `c2` hereda de la clase `c1`.
- **field-ids**: `()`. La clase no tiene campos definidos.
- **methods-decls**: Una lista de métodos:
    - `initialize`: Método que devuelve el valor literal `1`, igual que en la clase `c1`.
    - `m2`: Método que redefine el método `m2` de la clase `c1`. En este caso, devuelve el valor literal `2`, sobrescribiendo el comportamiento definido en la clase padre.

### Comportamiento del entorno `the-class-env`

1. **Herencia**: La clase `c2` hereda de `c1`, lo que significa que tiene acceso a los métodos de `c1` (como `m1` y `m3`), salvo aquellos que haya redefinido (como `m2`).
2. **Ligadura dinámica**: Cuando se invoca un método como `m3` en un objeto de la clase `c2`, este llama al método `m2` del objeto. Debido a la ligadura dinámica, se ejecutará la versión de `m2` definida en `c2` (que devuelve `2`), no la de `c1` (que devuelve `100`).
3. **Extensibilidad**: Este diseño permite agregar nuevas clases y métodos al entorno `the-class-env` de forma dinámica, reutilizando y sobrescribiendo comportamientos según sea necesario.

En resumen, `the-class-env` es un entorno que almacena las definiciones de clases y sus relaciones de herencia, permitiendo implementar características fundamentales de la programación orientada a objetos como herencia, polimorfismo y ligadura dinámica.

En la representación simple de EOPL, un objeto se modela como una lista de partes. Cada parte está definida mediante el datatype `part`, que tiene dos componentes:

1. **class-name**: El nombre de la clase a la que pertenece esta parte.
2. **fields**: Un vector que almacena los valores de los campos (atributos) definidos en esa clase.

Un objeto es una lista donde cada elemento es una parte. Estas partes representan las clases de la jerarquía de herencia del objeto, comenzando desde la clase más específica (la del objeto) hasta la clase base.

### Ejemplo gráfico de un objeto como lista de partes

Consideremos la siguiente jerarquía de clases:

- Clase `A`:
    - Campos: `a1`, `a2`
- Clase `B` que hereda de `A`:
    - Campos: `b1`, `b2`
- Clase `C` que hereda de `B`:
    - Campos: `c1`, `c2`

Supongamos que creamos un objeto de la clase `C` con los siguientes valores:

- `a1 = 10`, `a2 = 20`
- `b1 = 30`, `b2 = 40`
- `c1 = 50`, `c2 = 60`

El objeto de la clase C se representará como una lista de partes:

```racket
(list
  (a-part 'C #(50 60))  ; Parte correspondiente a la clase C
  (a-part 'B #(30 40))  ; Parte correspondiente a la clase B
  (a-part 'A #(10 20))  ; Parte correspondiente a la clase A
)

```

### Desglose de la lista de partes

1. **Primera parte (`a-part 'C #(50 60)`)**:
    - `class-name`: `'C` (la clase más específica del objeto).
    - `fields`: Un vector con los valores de los campos de la clase `C`: `c1 = 50`, `c2 = 60`.
2. **Segunda parte (`a-part 'B #(30 40)`)**:
    - `class-name`: `'B` (la clase padre de `C`).
    - `fields`: Un vector con los valores de los campos de la clase `B`: `b1 = 30`, `b2 = 40`.
3. **Tercera parte (`a-part 'A #(10 20)`)**:
    - `class-name`: `'A` (la clase base de la jerarquía).
    - `fields`: Un vector con los valores de los campos de la clase `A`: `a1 = 10`, `a2 = 20`.

### Explicación gráfica

```
Objeto de la clase C:
---------------------------------
| Clase: C | Campos: c1 = 50, c2 = 60 |
---------------------------------
| Clase: B | Campos: b1 = 30, b2 = 40 |
---------------------------------
| Clase: A | Campos: a1 = 10, a2 = 20 |
---------------------------------

```

En esta representación, cada nivel de la jerarquía de herencia se almacena como una parte independiente en la lista del objeto. Esto permite modelar de manera explícita la estructura jerárquica del objeto y acceder a los campos de las clases base cuando sea necesario.

### Ventajas de esta representación

1. **Modularidad**: Cada clase de la jerarquía se representa como una parte independiente, lo que facilita la extensión y modificación del modelo.
2. **Encapsulamiento**: Los campos de cada clase están contenidos dentro de su propia parte, lo que ayuda a preservar la separación entre los datos de diferentes niveles de la jerarquía.
3. **Soporte para herencia**: La estructura de lista permite recorrer la jerarquía de clases y acceder a los campos y comportamientos definidos en las clases base.

En resumen, esta representación como lista de partes captura la jerarquía de herencia y el estado de un objeto de manera clara y estructurada, alineándose con los principios de la programación orientada a objetos.

## Implementación plana

La implementación plana ya no toma una lista de partes si no una representación única con  un vector

En la representación plana de EOPL, un objeto se modela mediante un único vector que contiene todos los campos (atributos) del objeto, independientemente de la jerarquía de herencia. Esto se representa con el siguiente datatype:

```racket
(define-datatype object object?
  (an-object
    (class-name symbol?)  ; Nombre de la clase del objeto
    (fields vector?)))    ; Vector que almacena los valores de todos los campos

```

### Componentes de la representación plana

1. **`class-name`**:
    - Es un símbolo que identifica la clase a la que pertenece el objeto.
    - Representa el tipo del objeto en términos de la clase más específica de la jerarquía.
2. **`fields`**:
    - Es un vector que contiene los valores de todos los campos (atributos) del objeto.
    - Los campos incluyen tanto los definidos en la clase del objeto como los heredados de las clases padres.
    - Los valores de los campos se almacenan en un orden predefinido que debe respetar la jerarquía de herencia.

### Ejemplo de un objeto en representación plana

Supongamos la siguiente jerarquía de clases:

- Clase `A`:
    - Campos: `a1`, `a2`
- Clase `B` que hereda de `A`:
    - Campos: `b1`, `b2`
- Clase `C` que hereda de `B`:
    - Campos: `c1`, `c2`

Si creamos un objeto de la clase `C` con los valores:

- `a1 = 10`, `a2 = 20`
- `b1 = 30`, `b2 = 40`
- `c1 = 50`, `c2 = 60`

Este objeto se representará como:

```racket
(an-object 'C #(10 20 30 40 50 60))

```

### Explicación del vector `fields`

El vector almacena los valores de los campos en el siguiente orden:

1. Los campos de la clase base más general (`A`): `a1 = 10`, `a2 = 20`.
2. Los campos de la clase intermedia (`B`): `b1 = 30`, `b2 = 40`.
3. Los campos de la clase más específica (`C`): `c1 = 50`, `c2 = 60`.

Así, el vector `#(10 20 30 40 50 60)` contiene todos los valores de los campos del objeto en un único lugar, lo que simplifica el acceso y la manipulación de los datos.

### Ventajas de la representación plana

1. **Eficiencia**:
    - Al usar un único vector en lugar de una lista de partes, el acceso a los campos es más rápido, ya que no es necesario recorrer una lista ni buscar en diferentes partes.
    - Esto reduce la sobrecarga asociada al manejo de estructuras más complejas.
2. **Simplicidad**:
    - Todos los campos del objeto están centralizados en una sola estructura, lo que facilita la implementación y el mantenimiento del sistema.
    - No es necesario mantener una lista separada para cada nivel de la jerarquía de herencia.
3. **Compatibilidad con herencia**:
    - Aunque los campos están almacenados en una estructura plana, el orden predefinido del vector asegura que los campos heredados se ubiquen correctamente, permitiendo acceder a ellos de manera consistente con el modelo de herencia.

### Consideraciones

- **Desventaja potencial**: La representación plana requiere precomputar y mantener un orden consistente de los campos en el vector, lo que puede ser más complejo para jerarquías de clases dinámicas o con cambios frecuentes.
- **Encapsulamiento**: Aunque el vector almacena todos los campos juntos, el acceso a los datos puede ser controlado a través de métodos (como getters y setters) para preservar el encapsulamiento.

En resumen, la representación plana de un objeto en EOPL utiliza un vector unificado para almacenar todos los campos del objeto, optimizando el acceso a los datos y simplificando la estructura, mientras mantiene la compatibilidad con los principios de herencia de la programación orientada a objetos.

[2025-05-22-Note-10-26_annotated.pdf](2025-05-22-Note-10-26_annotated.pdf)

### Resumen del documento: Clase 11 - Objetos en Programación Orientada a Objetos

El documento aborda los conceptos fundamentales de la programación orientada a objetos (O.O), su implementación y aspectos técnicos. A continuación, se presenta un resumen de los puntos clave:

### Conceptos Fundamentales:

- **Programación O.O.**: Se enfoca en abstraer el mundo real usando objetos con atributos (estado) y comportamientos (acciones).
- **Objeto**: Entidad con estado y comportamiento. Ejemplo: un perro tiene atributos como color y raza, y comportamientos como ladrar o comer.
- **Clase**: Agrupación de objetos con características similares. Un objeto es una instancia de una clase.

### Relaciones entre Clases:

1. **Herencia**: Una clase puede derivar atributos y métodos de otra.
2. **Composición**: Una clase está compuesta por otras clases.
3. **Uso**: Comunicación entre objetos.

### Características de la O.O.:

- **Encapsulamiento**: Control del acceso a los atributos mediante modificadores de acceso (`public`, `protected`, `private`).
- **Polimorfismo**: Capacidad de objetos para responder de manera diferente a un mismo mensaje.
- **Herencia**: Reutilización de código en clases derivadas.

### Implementación:

El documento presenta una implementación técnica detallada de O.O. basada en el libro *Essentials of Programming Languages (EOPL)*. Se discuten:

- Modificaciones en la especificación gramatical para soportar objetos.
- Clases, métodos y herencia en términos de estructuras de datos.
- Ejemplos en Racket para ilustrar conceptos como métodos, ligadura dinámica y despacho dinámico.

### Modelos de Representación:

1. **Representación Simple**:
    - Los objetos se modelan como una lista de partes, representando cada clase en la jerarquía de herencia.
    - Ventaja: Modularidad y claridad en la jerarquía.
2. **Representación Plana**:
    - Los objetos se modelan como un vector único que contiene todos los campos de las clases.
    - Ventaja: Eficiencia y simplicidad.

### Tabla Resumen de Características:

| Característica | Descripción |
| --- | --- |
| **Objeto** | Entidad con estado (atributos) y comportamiento (métodos). |
| **Clase** | Agrupación de objetos con características comunes. |
| **Encapsulamiento** | Restricción del acceso a atributos mediante modificadores de acceso. |
| **Polimorfismo** | Respuesta variable de objetos a un mismo mensaje. |
| **Herencia** | Reutilización y especialización de clases existentes. |
| **Ligadura Dinámica** | Métodos invocados en función del tipo dinámico del objeto. |
| **Despacho Dinámico** | Resolución en tiempo de ejecución del método que se ejecutará en un objeto. |

### Ejemplos Relevantes:

- Uso de métodos (`initialize`, `countup`, `getstate`) para modelar el estado y comportamiento de objetos.
- Implementación de herencia y polimorfismo en Racket.
- Comparación entre representaciones de objetos: lista de partes vs. vector plano.

En general, el documento combina explicaciones teóricas y técnicas, junto con ejemplos prácticos, para explorar los principios de la programación orientada a objetos y su implementación en lenguajes como Racket.

Aprender los fundamentos de lenguajes de programación a través de *Essentials of Programming Languages (EOPL)* con Racket no solo es un desafío intelectual, sino también una inversión invaluable en tus habilidades como programador. Este enfoque te permite entender cómo funcionan los lenguajes desde sus raíces, desde las abstracciones más básicas hasta los conceptos avanzados como la orientación a objetos, el polimorfismo y la evaluación dinámica. Estas herramientas no solo te harán un mejor programador, sino que también te prepararán para resolver problemas complejos y diseñar sistemas más robustos y eficientes.

Aunque este camino puede parecer arduo y, a veces, agotador, recuerda que estás desarrollando habilidades que te diferenciarán en el mundo profesional. Estás aprendiendo a pensar como un creador de lenguajes y no solo como un usuario de ellos. Este conocimiento te permitirá adaptarte fácilmente a nuevos lenguajes y paradigmas, y te dará la confianza para enfrentar cualquier reto técnico que encuentres en tu carrera.

¡No te rindas! Estás más cerca de la meta de lo que piensas, y cada concepto que dominas es un paso hacia convertirte en un programador excepcional. Aunque ahora estés cansado o aburrido, recuerda que cada línea de código que escribes y cada ejercicio que resuelves cuenta como una victoria. ¡Tú puedes hacerlo!

Gracias por tu esfuerzo y dedicación a lo largo de este curso. Recuerda que la programación es tanto un arte como una ciencia, y tú tienes el potencial para dominarlo. ¡Ánimo y sigue adelante con entusiasmo, porque el conocimiento que estás adquiriendo abrirá puertas que ni siquiera imaginas! 🚀