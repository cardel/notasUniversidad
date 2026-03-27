
# Como vamos

1. Paralelización: Dividir una tarea en partes que se puedan ejecutar al tiempo, de tal forma podamos obtener una ganancia de tiempo (span)
	1. ¿Como paralelizar? Map-reduce, fork-join, pipelines
	2. Consideraciones de la parelización: tareas deben ser independientes y asociativas, no importa el orden en que se hagan el resultado no cambia, si importa el orden synchronized (orden a los hilos)
	3. Librerias para parelización
		1. C++: lpthread, TBB y openMP
		2. Python: thread (hilos), multiprocessing para procesos
	4. Diferencia hilo: unidad unica de ejecución, proceso: entidad que puede contener uno más hilos los cuales se ejecutan en un espacio de memoria independiente
		1. Hilos estamos la misma CPU (limitación) y concurrencia no es real, si no que se aprovechan los momentos de tiempo idle de la CPU y la memoria es compartida
		2. Procesos: podemos estar en diferentes CPU, el reto es sincronizar los datos: Array, Value, Queue, Pipe, Manager
	5. Profiling:
		1. Perfiladores de tiempo: C++ chrone, Python: time, timeit
		2. Perfiladores deterministas de recursos: CProfile (Python) pero agregan overhead
		3. Perfiladores estadisticos trabajan a través de muestra Pyinstrument

# Temas

Como podemos perfilar programas que ya están en en ejecución usando herramientas del sistema operativo.

1. [Procesos del sistema](Procesos%20del%20sistema.md)
2. [Valgrind](Valgrind.md)
3. [Perf](Perf.md)