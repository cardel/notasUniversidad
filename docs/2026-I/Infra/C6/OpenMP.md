# OpenMP

OpenMP es una librería de paralelización para memoria compartida para C, C++ y Fortran.

A diferencia de threads y TBB (Threading Building Blocks), utiliza anotaciones (pragmas) sin alterar significativamente el código existente.

```bash
# Compilación con soporte OpenMP en GCC
g++ -o programa programa.cpp -fopenmp
```

OpenMP sigue el modelo **fork-join**: el hilo principal crea un equipo de hilos y luego los reúne al final de la región paralela.

Podemos controlar el número de hilos:

```c++
#include <omp.h>
omp_set_num_threads(4);  // Establece el número de hilos a 4
```

## Directivas

**Paralelizar un bloque de código**:

```c++
#pragma omp parallel
{
    // Código a paralelizar (ejecutado por todos los hilos)
}
```

**Paralelizar un for**:

```c++
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    // Iteraciones distribuidas entre hilos
}
```

**Para reducción** (acumulación de resultados):

```c++
double sal = 0;
#pragma omp parallel for reduction(+:sal)  // Cada hilo tiene su copia local de 'sal'
for (int i = 0; i < n; i++) {
    sal += ...;  // Se suman automáticamente al final
}
```

**Para manejar variables compartidas** usamos `shared` (por defecto las variables fuera de la región paralela son compartidas):

```c++
int x = 10;
#pragma omp parallel shared(x)  // 'x' es compartida entre todos los hilos
{
    #pragma omp parallel for
    for (int i = 0; i < n; i++) {
        // Acceso a x (necesita sincronización si es escritura)
    }
}
```

**`private`** para variables no inicializadas (cada hilo tiene su propia copia sin valor inicial):

```c++
int x = 10;
#pragma omp parallel private(x)  // Cada hilo tiene su propia 'x' sin inicializar
{
    // x no tiene valor inicial aquí
    #pragma omp parallel for
    for (int i = 0; i < n; i++) {
        // ...
    }
}
```

**`firstprivate`** para tomar el valor original como inicialización:

```c++
int x = 10;
#pragma omp parallel firstprivate(x)  // Cada hilo tiene su 'x' inicializada con 10
{
    // x vale inicialmente 10 en cada hilo
    #pragma omp parallel for
    for (int i = 0; i < n; i++) {
        // ...
    }
}
```

**Secciones para ejecuciones paralelas** de bloques independientes:

```c++
#pragma omp parallel sections  // Diferentes secciones ejecutadas en paralelo
{
    #pragma omp section
    {
        // Código 1 (ejecutado por un hilo)
    }
    
    #pragma omp section
    {
        // Código 2 (ejecutado por otro hilo)
    }
    
    // ...
    
    #pragma omp section
    {
        // Código n (ejecutado por otro hilo)
    }
}
```

## Control de ejecución

1. **`single`**: solo un hilo ejecuta el bloque
2. **`master`**: solo el hilo principal ejecuta el bloque
3. **`barrier`**: todos los hilos deben esperar en este punto (punto de sincronización)

```c++
#pragma omp parallel
{
    procesar_fase1();
    #pragma omp barrier  // Todos los hilos esperan aquí hasta que todos terminen fase 1
    #pragma omp single   // Solo un hilo ejecuta este bloque
    { 
        printf("Fase 1 completa\n"); 
    }
    procesar_fase2();
}
```

**`critical`**: solo un hilo a la vez ejecuta el bloque (similar a synchronized):

```c++
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    #pragma omp critical  // Sección crítica: solo un hilo puede ejecutar a la vez
    {
        shared_counter++;  // Incremento seguro de variable compartida
    }
}
```

**`atomic`**: funciona solo para una instrucción (más eficiente que critical para operaciones simples):

```c++
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    #pragma omp atomic  // Operación atómica (más eficiente para operaciones simples)
    shared_counter++;   // Incremento atómico
}
```

## Schedule: distribución de trabajo

Es la forma en que se maneja la distribución de los datos en los hilos:

- **`static`**: bloques fijos e iguales (por defecto)
- **`dynamic`**: bloques asignados bajo demanda
- **`guided`**: como dynamic pero con bloques decrecientes
- **`auto`**: el compilador decide
- **`runtime`**: se define con la variable de entorno `OMP_SCHEDULE`

```c++
// Carga uniforme: static es ideal
#pragma omp parallel for schedule(static)
for (int i = 0; i < n; i++) {
    resultado[i] = dato[i] * 2;  // Todas las iteraciones toman tiempo similar
}

// Carga variable: dynamic balancea mejor
#pragma omp parallel for schedule(dynamic, 2)  // Bloques de 2 iteraciones
for (int i = 0; i < n; i++) {
    resultado[i] = trabajo_variable(i);  // Algunas iteraciones pueden tomar más tiempo
}
```

## Buenas prácticas

1. Usar `reduction` para operaciones acumulativas
2. Elegir el `schedule` más apropiado de acuerdo a la carga de trabajo
3. Preferir `atomic` sobre `critical` para operaciones simples
4. Evitar la **falsa compartición**: cada hilo trabaja en bloques contiguos de memoria para optimizar el uso de caché

Se puede optimizar la ejecución agregando parámetros al g++:

```bash
g++ -fopenmp -O3 -ffast-math -DNDEBUG prog.cpp
```

- **`-O3`**: optimiza el código al máximo nivel
- **`-ffast-math`**: optimiza las operaciones matemáticas (puede afectar precisión)
- **`-DNDEBUG`**: desactiva las aserciones de depuración

## Conceptos teóricos adicionales

**Modelo de programación paralela**: OpenMP utiliza un modelo de memoria compartida donde todos los hilos tienen acceso a la misma memoria global. Esto contrasta con MPI (Message Passing Interface) que usa memoria distribuida.

**Directivas vs Bibliotecas**: OpenMP usa directivas del compilador (`#pragma`) que son ignoradas por compiladores que no soportan OpenMP, permitiendo mantener una versión secuencial del código.

**Variables de entorno de OpenMP**:
- `OMP_NUM_THREADS`: número de hilos por defecto
- `OMP_SCHEDULE`: política de planificación por defecto
- `OMP_DYNAMIC`: permite ajuste dinámico del número de hilos

**Regiones paralelas anidadas**: OpenMP soporta paralelismo anidado, pero generalmente está desactivado por defecto por razones de rendimiento.

**Data races (carreras de datos)**: Ocurren cuando múltiples hilos acceden a la misma variable en memoria sin sincronización adecuada y al menos uno escribe. OpenMP proporciona mecanismos como `critical`, `atomic`, y `reduction` para evitarlas.

**Overhead de creación de hilos**: OpenMP reutiliza hilos entre regiones paralelas para minimizar el overhead de creación/destrucción.

## Tabla de resumen

| Concepto | Descripción | Directiva OpenMP | Uso típico |
|----------|-------------|------------------|------------|
| **Modelo fork-join** | Hilo principal crea equipo de hilos, luego los reúne | Implícito | Estructura básica de OpenMP |
| **Región paralela** | Bloque ejecutado por múltiples hilos | `#pragma omp parallel` | Paralelizar secciones de código |
| **Parallel for** | Paralelización de bucles for | `#pragma omp parallel for` | Distribuir iteraciones entre hilos |
| **Reducción** | Combinación de resultados de cada hilo | `reduction(op:var)` | Sumas, productos, máximos, mínimos |
| **Variables shared** | Variables compartidas entre hilos | `shared(var)` | Compartir datos entre hilos |
| **Variables private** | Variables privadas por hilo | `private(var)` | Datos temporales por hilo |
| **Variables firstprivate** | Privadas con inicialización | `firstprivate(var)` | Copiar valor inicial a cada hilo |
| **Secciones** | Bloques independientes en paralelo | `#pragma omp sections` | Tareas independientes |
| **Single** | Solo un hilo ejecuta el bloque | `#pragma omp single` | Inicialización, I/O |
| **Master** | Solo hilo maestro ejecuta | `#pragma omp master` | Tareas del hilo principal |
| **Barrier** | Punto de sincronización | `#pragma omp barrier` | Sincronizar hilos |
| **Critical** | Sección crítica (exclusión mutua) | `#pragma omp critical` | Acceso seguro a recursos compartidos |
| **Atomic** | Operación atómica | `#pragma omp atomic` | Operaciones simples atómicas |
| **Schedule** | Distribución de iteraciones | `schedule(tipo,chunk)` | Balance de carga |
| **Compilación** | Habilitar OpenMP en GCC | `-fopenmp` | Compilar programas OpenMP |

## Comentarios adicionales

1. **Ventajas de OpenMP**:
   - Fácil de usar (directivas simples)
   - Código secuencial y paralelo en el mismo archivo
   - Portabilidad entre compiladores y plataformas
   - Control granular del paralelismo

2. **Limitaciones**:
   - Solo para memoria compartida (múltiples núcleos en misma máquina)
   - Escalabilidad limitada por número de núcleos
   - No adecuado para clusters o memoria distribuida

3. **Optimizaciones importantes**:
   - Minimizar regiones paralelas para reducir overhead
   - Balancear carga de trabajo entre hilos
   - Reducir sincronización innecesaria
   - Optimizar uso de caché (localidad de datos)

4. **Depuración de programas OpenMP**:
   - Usar herramientas como `gdb` con soporte para threads
   - Verificar condiciones de carrera con herramientas como ThreadSanitizer
   - Perfilar con herramientas como `perf` o `gprof`

5. **Alternativas a OpenMP**:
   - **Pthreads**: más control pero más complejo
   - **C++11 threads**: estándar de C++ pero menos características
   - **Intel TBB**: más características pero dependencia de biblioteca
   - **CUDA/OpenCL**: para paralelismo en GPU

6. **Escalabilidad**: El speedup (aceleración) ideal es lineal con el número de hilos, pero en la práctica está limitado por:
   - Overhead de sincronización
   - Contención por recursos compartidos
   - Parte secuencial del código (Ley de Amdahl)

7. **Aplicaciones típicas**:
   - Procesamiento de imágenes y señales
   - Simulaciones científicas
   - Análisis de datos
   - Renderizado gráfico
   - Cálculos numéricos intensivos
   - Desarrollo de videojuegosd