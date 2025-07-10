# Sesión 05: Perfilado

# Introducción al perfilado

¿Que es perfilado?

- Analizar el código para detectar situaciones de cuellos de botella
- Pruebas ¿El código funciona sin errores?
- Refactorización ¿Está programado correctamente?
- Perfilado Identificado las partes menos eficientes del código
- Es el proceso de recolectar métricas y analizar puntos de ejecución de un programa
    - Uso de CPU
    - Uso de memoria
    - Operaciones de uso E/S

---

Principio de pareto

80% problemas son causados por el 20% del código

---

Herramientas

- Temporizadores: Bibiliotecas para medir los tiempo de ejecución (Benchmarking)
- Perfiladores deterministas: Evaluan la ejecución del código (correr varias veces)
- Perfiladores estadisticos: Evaluan parte del programa y estiman su comportamiento

---

Python

- Temporizadores: time, datatime, timeit, codetiming
- Deterministas: profile, cprofile
- Estadisticos: pyinstrument, perf (linux)

---

# Ambientes en Python

```bash
virtualenv <ruta> # virtualenv venv
source <ruta>/bin/activate #source venv/bin/activate
pip list

#Instalación de librerías
pip install numpy
```

# Resumen

- Ambientes en Python: Asilar dependencias y librerías
- Perfiladores determinista: time, timeit, time toma una sola medida, timeit toma varias medidas y nos permite un promedio
- cProfile permite los componente del programa (funciones, procesos, etc) de forma independiente
- pyinstrument Nos permite estimar la ejecución de una función tomando muestras cada cierto tiempo, pero esto tiene un impacto importante en la ejecución.

# Perf

¿Que es perf?

Es una herramienta de perfilado de Linux que nos permite ver la ejecución de un programa sin necesidad de modificarlo

```bash
perf record ./exe
perf report
```