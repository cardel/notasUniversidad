# Perf

Es una herramienta del kernel de Linux que permite acceder directamente a los contadores de rendimiento del hardware (Performance Monitoring Counters, PMCs). Podemos medir ciclos de CPU, instrucciones ejecutadas, fallos de caché y muchas otras métricas de bajo nivel.

A diferencia de Valgrind, que simula la caché en software, `perf` lee los contadores reales del hardware. Esto lo hace mucho más rápido y con menor overhead, pero proporciona mediciones estadísticas basadas en muestreo, no una traza completa de cada acceso.

`perf stat` permite monitorear las estadísticas de rendimiento de un proceso durante toda su ejecución.

```bash
# --repeat 10: Ejecuta el programa 10 veces y muestra el promedio y desviación.
# -e cycles:u: Cuenta ciclos de CPU en modo usuario (no kernel).
# -e instructions:u: Cuenta instrucciones ejecutadas en modo usuario.
# -e l1-dcache-loads:u: Cuenta cargas (lecturas) desde la caché L1 de datos.
# -e l1-dcache-load-misses:u: Cuenta fallos en esas cargas (cuando el dato no estaba en L1).
perf stat --repeat 10 -e cycles:u \
-e instructions:u -e l1-dcache-loads:u \
-e l1-dcache-load-misses:u ./bueno

 Performance counter stats for './bueno' (10 runs):

     1.177.787.894      cycles:u                                                                ( +-  0,15% )
     3.504.983.954      instructions:u                                                          ( +-  0,00% )
     1.108.892.990      l1-dcache-loads:u                                                       ( +-  0,00% )
        13.219.995      l1-dcache-load-misses:u                                                 ( +-  0,14% )

           0,43538 +- 0,00164 seconds time elapsed  ( +-  0,38% )
```

En este caso se detectaron 3.5 mil millones de instrucciones y aproximadamente 13 millones de fallos de lectura de caché L1. La tasa de fallos es baja (~1.2%), indicando un buen uso de la caché.

```bash
# Mismo análisis para el programa con patrón de acceso ineficiente
perf stat --repeat 10 -e cycles:u \
-e instructions:u -e l1-dcache-loads:u \
-e l1-dcache-load-misses:u ./malo

 Performance counter stats for './malo' (10 runs):

     2.796.626.915      cycles:u                                                                ( +-  0,22% )
     3.504.984.293      instructions:u                                                          ( +-  0,00% )
     1.111.367.503      l1-dcache-loads:u                                                       ( +-  0,01% )
       120.227.697      l1-dcache-load-misses:u                                                 ( +-  0,02% )

           0,79385 +- 0,00108 seconds time elapsed  ( +-  0,14% )
```

Estamos viendo que pasamos de ~1.177 millones de ciclos de CPU a ~2.796 millones (más del doble). Los fallos de caché pasaron de ~13 millones a ~120 millones (casi 10 veces más), lo cual explica directamente el aumento en los ciclos y el tiempo de ejecución, confirmando el problema de acceso a memoria.

Con `perf record` podemos generar perfiles detallados (archivos de datos) para analizar posteriormente en diferentes herramientas de visualización.

```bash
# -g: Habilita la captura del grafo de llamadas (call graph).
# -e ...: Especifica los eventos a muestrear.
# -F 99: Establece la frecuencia de muestreo a 99 Hz (muestras por segundo).
perf record -g -e cycles:u \
-e instructions:u -e l1-dcache-loads:u \
-e l1-dcache-load-misses:u -F 99 ./bueno
999900000000
[ perf record: Woken up 2 times to write data ]
[ perf record: Captured and wrote 0,031 MB perf.data (276 samples) ]

# Perfilamos el programa ineficiente
perf record -g -e cycles:u \
-e instructions:u -e l1-dcache-loads:u \
-e l1-dcache-load-misses:u -F 99 ./malo
999900000000
[ perf record: Woken up 2 times to write data ]
[ perf record: Captured and wrote 0,044 MB perf.data (397 samples) ]
```

En ambos casos se generará un archivo llamado `perf.data` el cual podemos revisar.

```bash
# Abre un reporte interactivo en la terminal basado en los datos capturados.
perf report
```

También podemos generar un reporte visual en el navegador usando el formato compatible con Firefox Profiler.

```bash
# Convierte el archivo perf.data a un formato JSON y lo abre en Firefox Profiler.
perf script report gecko
Staring Firefox Profiler on your default browser...
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
Opening in existing browser session.
127.0.0.1 - - [26/Mar/2026 12:05:22] "GET /gecko_profile.json HTTP/1.1" 200 -
[ perf gecko: Captured and wrote into gecko_profile.json ]
```

Por ejemplo, para monitorear con una configuración específica (nota: el comando original tiene eventos duplicados):

```bash
# Comando con eventos duplicados (ciclos:u, instructions:u, etc. aparecen dos veces).
# En la práctica, se especificaría cada evento una sola vez.
perf record -g -e cycles:u -e cycles:u \
-e instructions:u -e l1-dcache-loads:u \
-e l1-dcache-load-misses:u  \
-e instructions:u -e l1-dcache-loads:u \
-e l1-dcache-load-misses:u -F 99 ./malo
```

Para visualizar el reporte generado en el navegador:

```bash
perf script report gecko
```

## Tabla de Resumen

Concepto | Descripción | Comando/Opción Clave | Diferencia Clave con Herramientas Similares
--- | --- | --- | ---
**`perf` (Linux Perf)** | Herramienta de profiling de sistema integrada en el kernel Linux. Accede a contadores de hardware (PMCs) para medición de rendimiento. | `perf` | Bajo overhead, mediciones reales de hardware. Parte del kernel.
**Contadores de Hardware (PMCs)** | Registros especiales en la CPU que cuentan eventos como ciclos, instrucciones, fallos de caché, predicciones erróneas de branch, etc. | Especificados con `-e` (ej: `cycles:u`, `cache-misses`) | Proporcionan datos precisos de lo que ocurre en el CPU, no una simulación.
**`perf stat`** | Muestra un resumen agregado de contadores para la ejecución completa de un comando. | `perf stat <comando>` | Ideal para obtener métricas globales (totales, promedios) y comparar versiones de código.
**`perf record`** | Realiza un muestreo basado en eventos y guarda los datos en un archivo (`perf.data`) para análisis posterior. | `perf record <comando>` | Permite análisis detallado *post-mortem* y generación de perfiles de llamadas (flame graphs).
**`perf report`** | Analiza interactivamente el archivo de datos (`perf.data`) generado por `perf record`. | `perf report` | Navegación por funciones y código fuente donde se consumen más muestras/eventos.
**`perf script`** | Convierte el archivo `perf.data` a otros formatos de salida (texto, JSON para visualizadores). | `perf script report gecko` | Facilita la integración con herramientas de visualización externas como Firefox Profiler.
**Modo Usuario (`:u`)** | Filtro para contar eventos que ocurren solo mientras la CPU ejecuta código en espacio de usuario (user-space). | `-e cycles:u` | Aísla el comportamiento de la aplicación, excluyendo el tiempo gastado en el kernel.
**Frecuencia de Muestreo (`-F`)** | Controla cuántas muestras por segundo se toman durante el `perf record`. | `-F 99` (99 Hz) | Mayor frecuencia da más resolución pero genera archivos más grandes. 1000 Hz es común para profiling detallado.
**Grafo de Llamadas (`-g`)** | Habilita la captura de la pila de llamadas (call stack) en cada muestra. | `perf record -g` | Esencial para crear flame graphs y entender la cadena de llamadas que causa los eventos.

## Comentarios Adicionales

*   **Overhead Mínimo:** `perf` tiene un overhead mucho menor que Valgrind porque utiliza el soporte de hardware del CPU para el muestreo. Esto permite perfilar aplicaciones en producción o con cargas reales.
*   **Muestreo vs. Trazado Completo:** `perf` generalmente funciona por muestreo (ej: interrumpe el programa cada X eventos para registrar una muestra). Esto da una visión estadística representativa, no un registro de cada instrucción. Valgrind/Callgrind, en cambio, hace un trazado completo (instrumentación), lo cual es más lento pero puede ser más preciso para conteos exactos de ciertos eventos en código pequeño.
*   **Eventos Disponibles:** La lista de eventos que se pueden medir (`perf list`) es extensa y depende del modelo específico de CPU. Incluye eventos para caché, memoria, branch prediction, estancamientos de pipeline (stalls), etc.
*   **Análisis Jerárquico:** Combinando `perf record` con `perf report` o visualizadores como **FlameGraph**, se puede identificar no solo *qué función* es costosa, sino *por qué camino de llamadas (call path)* se llega a ella, lo que es crucial para optimizaciones.
*   **Perf para el Sistema:** Además de perfilar un comando específico, `perf` puede monitorear todo el sistema (`perf stat -a`), un proceso específico en tiempo real, o incluso hacer tracing de eventos del kernel (con `tracepoints`).
*   **Requisitos de Permisos:** Para acceder a todos los contadores de hardware, `perf` a menudo necesita ejecutarse con capacidades especiales (como `CAP_SYS_ADMIN`) o como root. En muchos sistemas, se puede habilitar el acceso para usuarios no privilegiados configurando `kernel.perf_event_paranoid` (ej: `sudo sysctl -w kernel.perf_event_paranoid=1`).
*   **Integración con Desarrollo:** `perf` se integra bien con compiladores como GCC y Clang. Compilar con información de depuración (`-g`) y sin eliminar símbolos permite que `perf report` muestre los nombres de las funciones y, con las herramientas adecuadas, incluso las líneas de código fuente responsables.