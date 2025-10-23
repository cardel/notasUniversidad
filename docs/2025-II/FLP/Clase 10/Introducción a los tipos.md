# Introducción a los sistemas de tipos

Un sistema de tipos define cómo se almacenan las estructuras de datos y cómo se representa la información en memoria, estableciendo reglas para las operaciones válidas sobre diferentes tipos de datos.

## Tipos primitivos básicos

- **Integer**: Representa números enteros, típicamente almacenado en 32 bits de memoria
- **Char**: Representa caracteres (generalmente ASCII o Unicode), usando 8 bits o más
- **Double**: Representa números de punto flotante de doble precisión, utilizando 64 bits de memoria

## Errores de tipo y clasificación de lenguajes

Un **error de tipo** ocurre cuando se intenta realizar una operación con tipos de datos incompatibles, como multiplicar un booleano con un entero.

### Lenguajes fuertemente tipados vs débilmente tipados

1. **Lenguajes fuertemente tipados**: No permiten operaciones entre tipos incompatibles y generan errores en tiempo de compilación o ejecución. Ejemplos: C++, Java, Scala

2. **Lenguajes débilmente tipados**: Permiten cierta flexibilidad mediante conversiones implícitas (coerciones). Ejemplos: JavaScript, Racket

```javascript
> 1 + "3"        // Coerción numérica a string
'13'
> "0" == 0       // Coerción a número
true
> [] == 0        // Coerción de array a número
true
> "0" == []      // Comportamiento inconsistente
false

// Operadores de comparación estricta evitan coerción
> 0 === "0"
false
> [] === 0
false
```

### Tipado estático vs dinámico

**Lenguajes estáticamente tipados** (C++, Java):
```c++
#include <cstdio>

int main() {
  int a = 3;        // Tipo determinado en compilación
  double b = 2.5;
  printf("%f\n", a + b);  // Promoción automática de int a double
}
```

**Lenguajes dinámicamente tipados** (Python):
```python
>>> a = "hola"      # Tipo string
>>> type(a)
<class 'str'>
>>> a = 2.3         # Reasignación a float
>>> type(a)
<class 'float'>
```

Los lenguajes dinámicamente tipados determinan los tipos en tiempo de ejecución y generalmente no soportan tipos abstractos de datos (TADs) de la misma manera que los lenguajes estáticos.

## Componentes de un intérprete tipado

1. **Sistema de tipos**: Define que un valor $v$ tiene tipo $t$. Toda expresión bien formada tiene un tipo o es considerada incorrecta (ill-typed)

2. **Fases de análisis**:
   - **Análisis de tipos**: Verifica que cada operación use tipos compatibles
   - **Análisis semántico**: Verifica que las expresiones estén correctamente formadas y produzcan valores válidos

3. **Manejo de errores de tipo**:
   - Rechazar la ejecución del programa
   - Aplicar conversiones automáticas (casting/coerción)

## Lenguajes no tipados

En lenguajes no tipados como Assembler, los valores carecen de información de tipo. Un mismo patrón de bits puede interpretarse como entero, carácter o cualquier otro tipo según el contexto.

Estos lenguajes no pueden detectar operaciones inapropiadas a nivel semántico; simplemente ejecutan las operaciones que el hardware permite sobre los patrones de bits dados.

## Ventajas de los sistemas de tipos

Los lenguajes tipados previenen errores mediante:
- Verificación de compatibilidad de tipos en operaciones
- Detección temprana de errores semánticos
- Mejor documentación del código a través de anotaciones de tipo
- Optimizaciones del compilador basadas en información de tipos

El sistema de tipos actúa como una forma de documentación ejecutable y proporciona garantías sobre el comportamiento correcto del programa.