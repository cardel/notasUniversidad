# Objetivos

1. Identificar que son los TAD: Tipo abstracto de datos
2. Construir TADs: Interfaz e implementación
3. Interfaz: Constructores, predicados (observadores) y extractores

# Clase
1. [Tipo abstracto de datos (TAD)](TAD.md)
2. [Estrategias de representacion TAD](Estrategias%20de%20representacion%20TAD.md)
3. [Ambientes](Ambientes.md)

# Resumen

## Resumen de Estrategias de Implementación

| **Aspecto** | **Listas** | **Procedimientos** |
|-------------|------------|-------------------|
| **Representación** | Estructuras con tags | Closures con selectores |
| **Encapsulación** | Baja (acceso directo posible) | Alta (solo mediante interfaz) |
| **Overhead** | Bajo | Moderado (llamadas a procedimientos) |
| **Validación** | Manual (por el programador) | Automática (en selectores) |
| **Flexibilidad** | Limitada | Alta (comportamiento dinámico) |
| **Simplicidad** | Alta | Moderada |

## Componentes Fundamentales de TADs

| **Componente** | **Propósito** | **Ejemplos** |
|----------------|---------------|--------------|
| **Constructores** | Crear instancias válidas | `zero`, `succ`, `var-exp`, `extend-env` |
| **Observadores** | Examinar datos sin revelar implementación | `isZero?`, `var-exp?`, `empty-env?` |
| **Predicados** | Verificar variantes del TAD | `var-exp?`, `lambda-exp?`, `app-exp?` |
| **Extractores** | Obtener componentes específicos | `var-exp->id`, `extend-env->lid` |

## Comparación de Implementaciones Numéricas

| **Implementación** | **Representación** | **Ventajas** | **Desventajas** |
|-------------------|-------------------|--------------|-----------------|
| **Nativa** | Números del lenguaje | Eficiente, simple | Rango limitado |
| **Unaria (Listas)** | Listas de elementos | Sin límite teórico | Ineficiente para números grandes |
| **Bignum (Base 16)** | Listas de dígitos | Balance eficiencia/flexibilidad | Complejidad de implementación |

## Propiedades de Ambientes

| **Propiedad** | **Descripción** | **Importancia** |
|---------------|-----------------|-----------------|
| **Alcance Léxico** | Resolución en entorno de definición | Semántica predecible |
| **Shadowing** | Definiciones recientes ocultan anteriores | Redefinición segura |
| **Extensibilidad** | Capacidad de añadir nuevos bindings | Entornos dinámicos |
| **Búsqueda Jerárquica** | Búsqueda recursiva en ambientes padres | Resolución correcta de variables |

## Principios de EOPL Demostrados

| **Principio** | **Ejemplo** | **Beneficio** |
|---------------|-------------|---------------|
| **Ocultamiento de Información** | Implementación oculta detrás de interfaz | Cambios transparentes |
| **Sustituibilidad** | Mismo código con diferentes implementaciones | Flexibilidad de diseño |
| **Invariantes Preservadas** | Constructores garantizan datos válidos | Corrección del programa |
| **Independencia de Representación** | Interfaz abstracta vs. implementación concreta | Mantenibilidad |

## Complejidad y Eficiencia

| **Operación** | **Complejidad Listas** | **Complejidad Procedimientos** |
|---------------|------------------------|-------------------------------|
| **Construcción** | $O(1)$ | $O(1)$ |
| **Búsqueda (apply-env)** | $O(n)$ | $O(n)$ |
| **Extracción** | $O(1)$ (acceso directo) | $O(1)$ (llamada procedimiento) |
| **Predicado** | $O(1)$ (comparación tag) | $O(1)$ (llamada selector) |

## Trade-offs de Diseño

| **Decisión** | **Ventajas** | **Desventajas** |
|--------------|--------------|-----------------|
| **Listas** | Simple, eficiente, fácil depuración | Poca encapsulación, acoplamiento |
| **Procedimientos** | Buena encapsulación, validación | Mayor overhead, más complejo |
| **Números Nativos** | Máxima eficiencia | Limitaciones de rango |
| **Representación Abstracta** | Flexibilidad ilimitada | Costo de abstracción |

## Aplicaciones Prácticas

| **Concepto** | **Uso en Implementación de Lenguajes** |
|--------------|----------------------------------------|
| **TADs** | Tipos de datos del lenguaje (expresiones, ambientes) |
| **Ambientes** | Tablas de símbolos, entornos de ejecución |
| **Abstracción** | Evaluadores, compiladores, analizadores |
| **Interfaces Abstractas** | Plugins, extensiones, múltiples backends |


