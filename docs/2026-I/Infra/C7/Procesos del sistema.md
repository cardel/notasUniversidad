# Top y HTOP

Estas herramientas permiten visualizar los procesos del sistema operativo en tiempo real, filtrarlos y obtener información útil sobre su consumo de recursos.

```bash
> top

# Encabezado del sistema:
# - Hora actual y tiempo de actividad (uptime)
# - Número de usuarios conectados
# - Promedio de carga del sistema (load average) para los últimos 1, 5 y 15 minutos
top - 10:35:35 up  3:18,  1 user,  load average: 1,19, 1,28, 1,17

# Resumen de tareas (procesos):
# - Total de procesos
# - Estados: running (ejecutándose), sleep (en espera), d-sleep (sueño profundo), stopped (detenidos), zombie (procesos terminados pero no liberados)
Tasks: 349 total, 1 running, 347 sleep, 0 d-sleep, 0 stopped, 1 zombie

# Uso de CPU:
# - us: porcentaje de CPU usado por procesos de usuario
# - sy: porcentaje usado por el kernel del sistema
# - ni: porcentaje usado por procesos con prioridad modificada (nice)
# - id: porcentaje de CPU inactiva
# - wa: porcentaje de CPU esperando operaciones de E/S
# - hi/si: interrupciones hardware/software
# - st: tiempo robado por virtualización
%Cpu(s):  8,9 us,  1,3 sy,  0,0 ni, 88,8 id,  0,1 wa,  0,6 hi,  0,3 si,  0,0 st

# Uso de memoria (MiB = Mebibytes):
# - total: memoria física total
# - free: memoria libre sin usar
# - used: memoria en uso por procesos
# - buff/cache: memoria usada para caché y búferes del kernel
MiB Mem :  15800,0 total,   2953,6 free,   4322,3 used,   9047,1 buff/cache

# Uso de memoria de intercambio (swap):
# - total: espacio total de swap
# - free: swap libre
# - used: swap en uso
# - avail Mem: memoria disponible estimada para nuevos procesos
MiB Swap:  12000,7 total,  12000,7 free,      0,0 used.  11477,7 avail Mem

# Lista de procesos (columnas principales):
# - PID: ID del proceso
# - USER: usuario propietario
# - PR: prioridad del proceso
# - NI: valor nice (ajuste de prioridad)
# - VIRT: memoria virtual total usada
# - RES: memoria residente (física) en uso
# - SHR: memoria compartida
# - S: estado del proceso (S=sleep, R=running, Z=zombie, etc.)
# - %CPU: porcentaje de uso de CPU
# - %MEM: porcentaje de uso de memoria física
# - TIME+: tiempo total de CPU consumido
# - COMMAND: nombre del comando/proceso
    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  30576 cardel    20   0 1409,7g 861704 198936 S 103,7   5,3  17:04.11 vivaldi-bin
   3090 cardel    20   0   49,2g 681644 430060 S  15,0   4,2  22:45.41 vivaldi-bin
  10046 cardel    20   0 7613408 621756 404188 S  11,3   3,8  17:38.47 obs
  35890 cardel    20   0   48,4g 103072  87988 S   7,3   0,6   1:18.69 vivaldi-bin
   1474 cardel    20   0 1008892 157560 122372 S   6,6   1,0  12:53.62 Hyprland
   4129 cardel    20   0   48,5g 104272  87448 S   5,0   0,6   7:45.32 vivaldi-bin
   3154 cardel    20   0   48,5g 141756 109392 S   3,0   0,9   3:18.39 vivaldi-bin
   1721 cardel     9 -11  199548  43500  12336 S   2,7   0,3   5:02.19 pipewire-pulse
   3150 cardel    20   0   49,2g 364192 221428 S   2,3   2,3   7:34.34 vivaldi-bin
   1678 cardel     9 -11  772332  46884  32136 S   1,7   0,3   2:32.88 wireplumber
   1668 cardel    20   0  234944  10180   8812 S   1,3   0,1   1:46.22 xdg-desktop-por
```

Aquí podemos observar los procesos del sistema operativo con su respectivo consumo de CPU y memoria.

En general, podemos filtrar por un proceso específico utilizando su PID (Process ID):

```bash
# Opciones usadas:
# -b: modo batch (salida no interactiva, útil para scripting)
# -p: filtrar por PID específico
# -n: número de iteraciones antes de finalizar
top -b -p 1668 -n 1

# Salida filtrada que muestra únicamente el proceso con PID 1668
top - 10:36:56 up  3:19,  1 user,  load average: 2,82, 1,69, 1,32
Tasks: 1 total, 0 running, 1 sleep, 0 d-sleep, 0 stopped, 0 zombie
%Cpu(s):  9,7 us,  0,9 sy,  0,0 ni, 88,8 id,  0,0 wa,  0,3 hi,  0,3 si,  0,0 st
MiB Mem :  15800,0 total,   2864,7 free,   4349,9 used,   9108,5 buff/cache
MiB Swap:  12000,7 total,  12000,7 free,      0,0 used.  11450,1 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1668 cardel    20   0  234944  10180   8812 S   0,0   0,1   1:46.69 xdg-desktop-por
```

Este comando permite obtener una vista actualizada de procesos específicos en el sistema operativo.

Adicionalmente, `htop` es una interfaz más amigable que `top` y permite navegar con mayor facilidad mediante una interfaz interactiva con colores y soporte para mouse.

# ps

A diferencia de `top`, que muestra procesos en tiempo real, `ps` (process status) ofrece una captura estática (instantánea) de los procesos en un momento dado y proporciona información adicional como el número de hilos activos.

Por ejemplo, para listar los primeros 5 procesos de todos los terminales:

```bash
# a: muestra procesos de todos los usuarios y terminales
# | head -n 5: limita la salida a las primeras 5 líneas
ps a | head -n 5

# Salida:
# - PID: ID del proceso
# - TTY: terminal asociado al proceso
# - STAT: estado del proceso (S=sleep, Sl=sleep multihilo, +=en primer plano, etc.)
# - TIME: tiempo total de CPU consumido
# - COMMAND: comando que inició el proceso
    PID TTY      STAT   TIME COMMAND
   1420 tty2     Ssl+   0:00 /usr/bin/start-hyprland
   1474 tty2     Sl+   13:02 Hyprland --watchdog-fd 4
   1510 tty2     S+     0:00 /bin/sh -c /usr/bin/lxqt-policykit-agent >/dev/null
   1514 tty2     Sl+    0:00 /usr/bin/lxqt-policykit-agent
```

Podemos obtener información específica sobre el número de hilos de un proceso:

```bash
# -p: especifica el PID del proceso a consultar
# -o thcount: formato de salida que muestra solo el número de hilos (thread count)
ps -p 1420 -o thcount

# Salida:
# THCNT: cabecera de la columna (thread count)
# 2: número de hilos que ejecuta el proceso con PID 1420
THCNT
    2
```

## Tabla de resumen

| Herramienta | Propósito principal | Modo de operación | Información clave proporcionada | Ventajas | Comandos útiles |
|-------------|---------------------|-------------------|--------------------------------|----------|-----------------|
| **top** | Monitoreo en tiempo real de procesos y recursos del sistema | Interactivo (por defecto) o batch | Uso de CPU, memoria, estados de procesos, tiempo de actividad, carga del sistema | Actualización continua, ordenamiento dinámico, opciones de filtrado | `top`, `top -b -p [PID] -n 1`, `top -u [usuario]` |
| **htop** | Monitoreo interactivo mejorado de procesos | Interactivo con interfaz visual | Misma que `top` pero con visualización mejorada | Interfaz amigable, navegación con teclas y mouse, colores, árbol de procesos | `htop`, `htop -u [usuario]` |
| **ps** | Instantánea estática de procesos | No interactivo (por defecto) | Lista de procesos, PID, terminal, estado, tiempo de CPU, número de hilos, prioridad | Flexibilidad en formato de salida, útil para scripting, información detallada por proceso | `ps aux`, `ps -ef`, `ps -p [PID] -o thcount`, `ps a \| head -n 5` |

## Comentarios adicionales

- **Estados de procesos**: Es crucial entender los diferentes estados que muestra `top`/`ps` (running, sleep, zombie, stopped). Un proceso zombie (defunct) indica que ha terminado pero su entrada aún no ha sido liberada de la tabla de procesos, generalmente por un error en la recolección por parte del proceso padre.
- **Prioridad y nice**: Los valores PR (prioridad) y NI (nice) determinan la atención que recibe un proceso del planificador de CPU. Un valor NI negativo (como -11) indica mayor prioridad, mientras que valores positivos (hasta 19) indican menor prioridad.
- **Memoria virtual vs residente**: VIRT representa toda la memoria que el proceso puede acceder (incluyendo bibliotecas compartidas y memoria asignada pero no usada), mientras que RES es la memoria física realmente utilizada en ese momento.
- **Load average**: Representa el promedio de procesos en estado ejecutable o en espera ininterrumpida. Un valor igual al número de núcleos del CPU indica uso completo; valores más altos sugieren saturación.
- **Uso combinado**: En la práctica, `top`/`htop` se usan para diagnóstico en tiempo real, mientras que `ps` es más útil para obtener información específica para scripts o documentación.
- **Alternativas modernas**: Herramientas como `btop`, `glances` y `nmon` ofrecen interfaces aún más avanzadas con métricas adicionales de red, disco y temperaturas.