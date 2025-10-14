# Programación funcional

1. Inmutabilidad: Todo es un valor
2. Programación orientada a valores: Toda expresion devuelve un valor
3. Funciones de alto orden: Funciones que reciben funciones o bien retornan funciones
4. Abstracción funcional. Representar datos con clases y aplicar operaciones en notación infija
5. Funciones: map, filter y reduce
6. Reconocimiento de patrones.Integra la condición con la extracción de la información.
7. Expresiones for.
8. Evaluación perezosa

## Resumen de la Clase - Evaluación Perezosa

### Conceptos Clave

| Concepto | Descripción | Ejemplo en Código |
|----------|-------------|-------------------|
| **Evaluación Perezosa** | Cálculo de valores solo cuando se necesitan | `LazyList.cons(min, generador(min+1,max))` |
| **LazyList** | Estructura de datos que evalúa elementos bajo demanda | `generador(1,1000)` retorna `LazyList(<not computed>)` |
| **Generadores** | Funciones que producen secuencias infinitas o grandes | `for { x <- generador(1,1000) ... }` |
| **Filtrado Perezoso** | Aplicación de condiciones sin evaluar toda la secuencia | `if x*x + y*y == z*z` en comprensiones de lista |
| **Memorización** | Los elementos calculados se almacenan para acceso futuro | `println(g(10))` luego `println(g)` muestra elementos computados |

### Ventajas de la Programación Funcional

| Ventaja | Explicación | Ejemplo en la Clase |
|---------|-------------|---------------------|
| **Inmutabilidad** | Los datos no se modifican, se transforman | `LazyList` mantiene estado consistente |
| **Transparencia Referencial** | Misma entrada = misma salida siempre | `generador(1,1000)` siempre produce misma secuencia |
| **Composición** | Funciones pequeñas se combinan para crear comportamientos complejos | `generador` + filtros = `resolverProblema` |
| **Eficiencia en Memoria** | Solo se calcula lo necesario | No genera 1 billón de tripletas, solo las requeridas |
| **Manejo de Secuencias Infinitas** | Posibilidad de trabajar con datos ilimitados | Podría extenderse a rangos infinitos |
| **Expresividad** | Código conciso que describe qué hacer, no cómo | Comprensiones de lista expresan lógica claramente |
| **Paralelización** | Funciones puras facilitan ejecución concurrente | Cada evaluación de tripleta es independiente |

### Aplicación Práctica
- **Problema de tripletas pitagóricas**: Encontrar (x,y,z) donde $x^2 + y^2 = z^2$
- **Problema de tripletas con condiciones**: (i,j,k) con i par, i múltiplo de j, k primo
- **Solución**: Combinación de generadores perezosos con filtros funcionales