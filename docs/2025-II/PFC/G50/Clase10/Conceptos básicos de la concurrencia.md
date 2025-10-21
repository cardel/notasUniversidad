# Computación paralela

Es una computación que permite realizar varios calculos al mismo tiempo

- Principio básico: Computación se puede dividir en varias computaciones más pequeñas que se pueden realizar al mismo tiempo
- Suposición: Contamos con hardware paralelo.


# Diseño programas paralelos

- Hay mayor complejidad que en la computación secuencial, se requiere establecer rutinas para dividir las tareas de forma simultanea y posteriormente integrar los resultados
	- Separar la computaciones que en algunas ocasiones no es posible
	- Asegurar que los programas sean correctos: da el resultado esperado.
- Aceleración es la única razón por la cual utilizamos paralelización: **objetivo es acelerar los cómputos de un programa**


# Paralelismo y concurrencia

- Programación en paralelo: Usa hardware en paralelo para ejecutar programas más rapidamente, la eficiencia es su principal preocupación **en esto se enfoca el curso**
- Programación concurrente: Puede o no puede realizar computaciones al mismo tiempo y su principal preocupación es la modularidad, capacidad de respuesta y mantenibilidad.

Tenemos diferentes niveles de granularidad

1. Paralelismo a nivel de bits: Procesamiento de datos en paralelo en la CPU
2. Paralelismo a nivel de instrucciones: Ejecución de instrucciones en diferentes flujos al mismo tiempo
3. Paralelismo a nivel de tareas: Ejecución de flujos de instrucciones separadas en paralelo. **nos enfocamos en este**


| Concepto | Definición |
| - | - |
| Computación paralela | Realización de varios cálculos simultáneamente mediante división en computaciones más pequeñas ejecutadas en hardware paralelo |
| Diseño de programas paralelos | Mayor complejidad que secuencial, requiere división de tareas simultáneas e integración de resultados, con objetivo de aceleración |
| Paralelismo | Uso de hardware paralelo para ejecución más rápida, enfocado en eficiencia |
| Concurrencia | Puede o no ejecutar simultáneamente, enfocado en modularidad, capacidad de respuesta y mantenibilidad |
| Niveles de granularidad | |
| - Paralelismo a nivel de bits | Procesamiento paralelo de datos en CPU |
| - Paralelismo a nivel de instrucciones | Ejecución simultánea de instrucciones en diferentes flujos |
| - Paralelismo a nivel de tareas | Ejecución paralela de flujos de instrucciones separadas (enfoque principal) |

