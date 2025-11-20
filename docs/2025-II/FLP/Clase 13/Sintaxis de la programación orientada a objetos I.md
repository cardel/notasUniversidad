# Sintaxis de la programación orientada a objetos I

Se va a modificar el lenguaje para manejar:

1. **Valores denotados** = ref(valor expresado)
2. **Valores expresados** = Número, booleano, procVal y objeto

```scheme
% Definición de una clase c1 que hereda de object
class c1 extends object
    field i    % Campo para almacenar un valor
    field j    % Campo para almacenar otro valor
    
    % Método constructor que inicializa los campos
    method initialize(x)
        begin
            set i = x;          % Asigna x al campo i
            set j = -(0,x)      % Asigna -x al campo j
        end
        
    % Método que incrementa i y decrementa j
    method countup(d)
        begin
            set i = +(i,d);     % Incrementa i en d
            set j = -(j,d)      % Decrementa j en d
        end
        
    % Método que retorna el estado actual como lista
    method getstate() list(i,j)
```

En este punto declaramos una clase, tiene campos i e j. Cuando se instancia, i toma el valor de x, y j toma -x. Tenemos dos métodos llamados countup y getstate.

```scheme
% Ejemplo de uso de la clase c1
let
    t1 = 0      % Variable temporal 1
    t2 = 0      % Variable temporal 2
    o1 = new c1(3)  % Creación de instancia de c1 con valor inicial 3
in
    begin
        set t1 = send o1 getstate();  % Obtiene estado inicial: list(3,-3)
        send o1 countup(2);           % Modifica el estado: incrementa en 2
        set t2 = send o1 getstate();  % Obtiene estado modificado: list(5,-5)
        list(t1,t2)                   % Retorna lista con ambos estados
    end
```

Cuando inicializo o1 los valores de i y j son 3 y -3 respectivamente. Cuando hago getstate() obtengo list(3,-3). Cuando hago countup(2), el valor de i es 5 y el de j -5, y ahora t2 vale list(5,-5). El valor de retorno sería la list(list(3,-3), list(5,-5)).

```scheme
% Definición de una estructura de árbol usando POO
class node extends object
    field left   % Hijo izquierdo del nodo
    field right  % Hijo derecho del nodo
    field val    % Valor del nodo
    
    % Constructor del nodo
    method initialize(l,r,v)
        begin
            set left = l;   % Asigna hijo izquierdo
            set right = r;  % Asigna hijo derecho
            set val = v     % Asigna valor del nodo
        end
        
    % Método que calcula la suma recursiva del árbol
    method sum()
        +(send left sum(),   % Suma del subárbol izquierdo
          send right sum(),  % Suma del subárbol derecho
          val                % Valor del nodo actual
        )

% Definición de una hoja del árbol
class leaf extends object
    field val    % Valor de la hoja
    
    % Constructor de la hoja
    method initialize(v)
        begin
            set val = v     % Asigna valor a la hoja
        end
        
    % Método que retorna el valor de la hoja
    method sum() val

% Construcción de un árbol de ejemplo
let
    tree = new node(
        new node(
            new leaf(3),    % Hoja con valor 3
            new leaf(5),    % Hoja con valor 5
            3               % Valor del nodo interno
        ),
        new node(
            new node(
                new leaf(4),    % Hoja con valor 4
                new leaf(3),    % Hoja con valor 3
                10              % Valor del nodo interno
            ),
            new leaf(20),   % Hoja con valor 20
            19              % Valor del nodo interno
        ),
        14                  % Valor del nodo raíz
    )
in
    send tree sum()         % Calcula la suma total del árbol
```

Al ejecutar el método sum este puede ejecutarse en un objeto tipo node o un objeto tipo leaf, pero a priori no lo sabemos.

A esto se le conoce como **despacho dinámico de métodos** porque el comportamiento se determina en tiempo de ejecución.

## Conceptos teóricos adicionales

### Despacho dinámico
El despacho dinámico permite que el método a ejecutar se determine en tiempo de ejecución basado en el tipo real del objeto, no en el tipo declarado. Esto es fundamental para el polimorfismo.

### Jerarquía de clases
Las clases pueden organizarse en jerarquías donde las clases hijas heredan y extienden el comportamiento de las clases padre.

### Mensajes y métodos
- **Mensaje**: La solicitud enviada a un objeto para ejecutar una operación
- **Método**: La implementación específica que responde a un mensaje

## Tabla de resumen de conceptos de sintaxis POO

| Concepto | Definición | Ejemplo en Scheme |
|----------|------------|-------------------|
| **Clase** | Plantilla para crear objetos | `class c1 extends object` |
| **Campo** | Variable de instancia del objeto | `field i` |
| **Método** | Función asociada a un objeto | `method sum() val` |
| **Constructor** | Método que inicializa el objeto | `method initialize(x)` |
| **Instanciación** | Creación de un objeto a partir de una clase | `new c1(3)` |
| **Envío de mensaje** | Invocación de un método en un objeto | `send o1 getstate()` |
| **Herencia** | Relación entre clases padre e hijas | `extends object` |
| **Despacho dinámico** | Selección del método en tiempo de ejecución | `send left sum()` |
| **Composición** | Objetos que contienen otros objetos | Nodos que contienen hojas |

## Comentarios adicionales

- El despacho dinámico es esencial para implementar polimorfismo en lenguajes orientados a objetos
- La herencia permite reutilizar código y establecer relaciones de tipo entre clases
- Los constructores son responsables de inicializar el estado interno de los objetos
- La composición de objetos permite construir estructuras complejas como árboles
- El envío de mensajes es el mecanismo fundamental para la comunicación entre objetos
- La encapsulación protege el estado interno de los objetos mediante campos privados
- La sobreescritura de métodos permite que las clases hijas proporcionen implementaciones específicas
- La recursión en métodos es común cuando se trabaja con estructuras de datos jerárquicas