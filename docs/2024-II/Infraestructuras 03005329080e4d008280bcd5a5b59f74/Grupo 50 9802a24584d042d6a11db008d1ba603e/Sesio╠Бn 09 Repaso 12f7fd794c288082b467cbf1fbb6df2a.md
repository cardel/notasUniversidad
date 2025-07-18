# Sesión 09: Repaso

# Acuerdos

- Parcial 13 de Noviembre: Teorico + Práctico

# Aspectos general del paralelismo

¿Que es el paralelismo?

Capacidad de hacer varias tareas al mismo tiempo

En programacion es más complejo que la programación secuencial: tener en cuenta los recursos compartidos, lo que se puede paralelizar y la gestión de procesos concurrentes/hilos

---

¿Porque el paralelismo toma fuerza hoy en día?

Contamos CPUs con varios nucleos/hilos que nos permite de forma REAL correr varios procesos al tiempo

---

¿Que limitaciones presenta el paralelismo?

1. Recursos compartidos
2. memoria cache (por el tema de fallos al mapear)
3. Dependencias entre tareas / datos
4. Control de procesos o hilos requiere tiempo
5. Cada proceso o hilo requiere su propio espacio de memoria

## Recursos

```bash
#Visualizar esquema del procesador
lstopo 

#Ver tasas de fallo y escritura a la cache
perf stat -B dd if=/dev/zero of=/dev/null count=1000000 
```

# Profiling

Medicíón de recursos y tiempo

- time
- timeit Permite tomar con repeticiones
- cprofiling
- pyinstrument
- perf Es una utilidad de linux

# Multithreading / Multiprocessing

QUe es un proceso y que es un hilo

Un proceso está compuesto uno o más hilos

Cuando hacemos multithreading estamos lanzando hilos sobre el mismo proceso (PID)

Cuando hacemos multiprocessing estamos procesos independientes que se comunican

---

¿Que sucede en la ejecución?

Cuando estamos con multiples hilos compartimos un contexto global

Cuando estamos en multiprocessing necesitamos comunidar los procesos dado que cada uno tiene un contexto INDEPENDIENTE