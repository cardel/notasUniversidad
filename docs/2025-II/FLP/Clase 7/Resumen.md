
## Conceptos Fundamentales

### Problema de la Recursión en Ambientes Convencionales
- Los procedimientos regulares no pueden referenciarse a sí mismos porque almacenan el ambiente **anterior** a su definición
- Esto impide la **recursión directa** y la **recursión mutua**

### Solución: Ambientes Extendidos Recursivos
- Nuevo tipo de ambiente que permite definiciones recursivas mutuas
- Solo contiene definiciones de procedimientos (no variables simples)
- Resuelve el problema de referencias circulares mediante clausuras que apuntan al ambiente actual

## Tabla de Resumen de Conceptos

| Concepto | Descripción | Propósito | Ejemplo |
|----------|-------------|-----------|---------|
| **Ambiente Extendido Recursivo** | Nuevo caso en el datatype de ambientes que almacena procedimientos mutuamente recursivos | Permitir referencias circulares entre procedimientos | `(extend-recursively-env '(f g) '((x) (y)) bodies old-env)` |
| **letrec** | Constructo sintáctico para definir procedimientos recursivos mutuos | Crear ámbito donde procedimientos pueden referenciarse entre sí | `(letrec (f(x)=...g...) (g(y)=...f...) in (f 10))` |
| **Clausura Recursiva** | Clausura que apunta al ambiente recursivo actual, no al anterior | Garantizar que las referencias encuentren las definiciones correctas | `(closure params body env-recursivo)` |
| **Búsqueda en Paralelo** | Algoritmo que busca en listas paralelas de nombres, argumentos y cuerpos | Encontrar la definición correcta de un procedimiento | `search-proc` en `apply-env` |
| **Evaluación Pospuesta** | Los cuerpos de procedimientos no se evalúan hasta su invocación | Evitar evaluación infinita en definiciones recursivas | Cuerpos se almacenan como expresiones, no valores |
| **Consistencia de Referencias** | Mecanismo que garantiza que todas las referencias encuentren sus definiciones | Prevenir errores de "unbound variable" en recursión mutua | Ambiente recursivo contiene todas las definiciones |

## Mecanismo de Funcionamiento

### Flujo de Ejecución
1. **Parseo**: La expresión `letrec` se descompone en listas paralelas
2. **Extensión**: Se crea un ambiente recursivo con las definiciones
3. **Búsqueda**: `apply-env` busca en el ambiente recursivo usando `search-proc`
4. **Clausura**: Cuando se encuentra, se crea una clausura con el ambiente actual
5. **Evaluación**: El cuerpo principal se evalúa en el ambiente extendido

### Ventajas del Diseño
- **Separación de responsabilidades**: La complejidad recae en `apply-env`, no en `eval-expression`
- **Extensibilidad**: Fácil agregar más procedimientos recursivos
- **Mantenibilidad**: El mecanismo es genérico y reutilizable

## Casos de Uso Típicos

1. **Recursión simple**: Procedimientos que se llaman a sí mismos
2. **Recursión mutua**: Múltiples procedimientos que se referencian entre sí
3. **Funciones matemáticas recursivas**: Factorial, Fibonacci, etc.
4. **Algoritmos de divide y vencerás**: Búsquedas, ordenamientos

Este diseño sigue los principios de EOPL de crear lenguajes con semántica clara y mecanismos de implementación elegantes.
