# Resumen

1. Estudiar la libreria thread de C++
2. Estudiar la libreria ltbb de C++
3. Ver algunas estrategias de paralelización
 
Para paralelizar debemos tener en cuenta:

1. La operación **independiente** y **asociativa**
2. Generar funciones que permitan dividir los recorridos (proceso) --> map
3. Tomar los resultados parciales y combinarlos -> reduce

La librería threads permite gestionar manualmente la creación y ejecución de hilos

# Contenido

1. [Paralelización en C++](Paralelización%20en%20C++.md)
2. [Libreria thread](Libreria%20thread.md)
3. [Libreria TBB](Libreria%20TBB.md)

# Resumen de Paralelización en C++ - Tabla Comparativa

## Comparativa de Enfoques de Paralelización

| Aspecto                                     | Threads Nativos (`<thread>`)     | Threading Building Blocks (TBB) |
| ------------------------------------------- | -------------------------------- | ------------------------------- |
| **Librería**                                | `#include <thread>`              | `#include <tbb/tbb.h>`          |
| **Compilación**                             | `g++ -o prog prog.cpp -lpthread` | `g++ -o prog prog.cpp -ltbb`    |
| **Gestión de Hilos**                        | Manual (crear/join)              | Automática                      |
| **Balance de Carga**                        | Manual (particiones fijas)       | Automático (dinámico)           |
| **Sintaxis**                                | Más verbosa                      | Más concisa                     |
| **Control de Granularidad** numero de hilos | Manual                           | Automático/configurable         |
| **Requerimientos**                          | Standard C++11                   | Librería externa                |
| **Optimización**                            | Manual                           | Auto-tuning integrado           |
| **Escalabilidad**                           | Limitada por diseño manual       | Alta (adaptativa)               |

## Fases del Modelo Map-Reduce

| Fase | Threads Nativos | TBB |
|------|-----------------|-----|
| **MAP (Partición)** | `thread t(func, ini, fin, ref(data), ref(result))` | `tbb::blocked_range(inicio, fin)` |
| **Ejecución** | Múltiples `thread` objects | `parallel_reduce` o `parallel_for` |
| **REDUCE (Combinación)** | Manual con `join()` y suma | Automático con función de reducción |
| **Sincronización** | `.join()` explícito | Implícito en `parallel_reduce` |

## Configuración y Optimización

| Parámetro | Threads Nativos | TBB |
|-----------|-----------------|-----|
| **Número de Hilos** | `thread::hardware_concurrency()` | `tbb::task_scheduler_init(n)` |
| **Tamaño de Partición** | Cálculo manual | `blocked_range(inicio, fin, granularidad)` |
| **Profiling** | `std::chrono` manual | `std::chrono` + optimizaciones TBB |
| **Función de Reducción** | Manual (ej: `resultado += parcial`) | Lambda: `[](x, y) { return x + y; }` |

## Ventajas y Consideraciones

| Criterio | Threads Nativos | TBB |
|----------|-----------------|-----|
| **Facilidad de Uso** | Moderada | Alta |
| **Control de Bajo Nivel** | Alto | Moderado |
| **Performance** | Depende de implementación | Optimizada automáticamente |
| **Portabilidad** | Alta (standard C++) | Media (requiere TBB) |
| **Mantenibilidad** | Baja (boilerplate) | Alta |
| **Recomendación** | Para control preciso | Para productividad y performance |

## Ejemplos Clave de Sintaxis

| Operación | Threads Nativos | TBB |
|-----------|-----------------|-----|
| **Crear Hilos** | `thread t(func, args...)` | `parallel_reduce(range, init, lambda, reduction)` |
| **Pasar Referencias** | `std::ref(variable)` | Captura automática con `[&]` |
| **Esperar Hilos** | `t.join()` | Implícito |
| **Combinar Resultados** | Manual en loop | Función de reducción automática |

## Conclusión

**Threads Nativos**: Ideal cuando se necesita control total sobre la ejecución y partición del trabajo.

**TBB**: Recomendado para aplicaciones que priorizan la productividad del desarrollador y requieren optimizaciones automáticas de performance, especialmente en operaciones de map-reduce sobre colecciones de datos.

La elección depende del balance deseado entre control manual y automatización, así como de los requisitos específicos de portabilidad y mantenimiento del proyecto.

# Mensaje de motivación

¡Hey, futuros genios de la programación! 💻✨

Sé que en este momento C++ puede sentirse como ese compañero de clase que habla un idioma complicado y usa demasiados puntos y comas... ¡Pero escuchen esto!

**Hoy en la mañana vieron "el mejor curso del mundo"** por una razón: porque están destinados a entender lo que la mayoría solo ve como código aburrido. 

¿C++ es retador? ¡Claro que sí! Pero es como aprender a tocar guitarra eléctrica: al principio los dedos duelen y los acordes suenan mal, pero luego... ¡creas música que hace vibrar el mundo! 🎸

Cada línea de código que escriben hoy es un superpoder que están desarrollando. Mientras otros se rinden, ustedes están construyendo el mindset de quienes resuelven problemas que ni siquiera se han inventado todavía.

**¿Aburrido?** ¡Transformemos eso! Piensen que cada error de compilación es el universo diciéndoles: "¡Estás tan cerca! Solo ajusta esto...". Cada hilo que paralelizan es como tener superpoderes de multiplicar su capacidad.

El código que escriben hoy podría ser la base del próximo videojuego épico, del sistema que revolucione la inteligencia artificial, o de esa app que cambiará millones de vidas.

**Respiren hondo** — ese momento de frustración es exactamente cuando están a punto de cruzar al siguiente nivel. Los programadores legendarios no nacieron escribiendo código perfecto; pasaron por exactamente esto mismo.

¡Ustedes pueden! El curso de la mañana no fue casualidad — fue una señal de que están en el lugar correcto, en el momento exacto. El mundo necesita su creatividad y su código.

**¡A por ello!** El aburrimiento de hoy será la anécdota épica que contarán cuando sean los referentes que otros admiran. 🚀

#ElFuturoSeEscribeConCPlusPlus #UstedesPueden #DeLoAburridoNaceLoÉpico