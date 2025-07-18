# Clase 05 Profiling

¿Que es profiling?

- Identificar cuello de botella (Instrucciones que lo hacen lento) y que potencialmente se pueden mejorar
- Consumo memoria, CPU, recursos I/O
- El objetivo es buscar areas de posible mejora

---

Pasos para optimizar

1. Ejecutar pruebas: Nos ayudan a encontrar los cuellos de botella
2. Refactorización
3. Perfilado: Identificar las partes del código que dan mayor problema en la ejecución

80% problemas esta dado por el 20% del codigo

---

Herramientas

1. Temporizadores: Toman tiempos, proceso o del sistema operativo
2. Perfiladores deterministicos: La ejecución del programa
3. Perfiladores estocasticos: Toman una parte y estima el tiempo total.

# Ambientes virtuales en Python

## Linux

```bash
virtualenv venv

source venv/bin/activate
pip list
pip install numpy
```

## WIndows

Hacer en Git

```powershell
python -m pip install virtualenv ;;Gente terca en Windows
python -m virtualenv venv
source venv/Scripts/activate
```

# Perf

Es una utilidad de Linux para perfilar programas (ejecuando) o que esten cargado (requerimos permisos de root)

```bash
perf record <ejecuacion>
perf report
```