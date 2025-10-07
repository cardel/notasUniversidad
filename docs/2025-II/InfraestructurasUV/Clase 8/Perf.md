Es una herramienta que permite analizar procesos en el sistema operativo, esta herramienta es parte del kernel. Este lo utiliza para monitorear los procesos, usualmente este es un API para poderlo utilizar debemos instalarlo en el sistema operativo

```bash
sudo apt-get install perf
sudo yum install perf
sudo pacman -Sy perf
```

Perf requiere permisos para poder visualizar los procesos del S.O, tener en cuenta entonces que solo podemos perfilar los procesos asociados al usuario o grupo al que pertenece.

Este este un instrumentador que evalua como hace las operaciones el proceso cargado en la memoria, uso de CPU, uso de memoria, uso de memoria cache

```bash
ps -a | grep obs
   2563 tty2     00:13:19 obs
   8333 tty2     00:00:00 obs-ffmpeg-mux
```

Busque el proceso que tiene obs, procedo a perfilarlo con perf
```bash
perf stat -p 2563 sleep 5

 Performance counter stats for process id '2563':

          1.292,47 msec task-clock:u                     #    0,258 CPUs utilized
                 0      context-switches:u               #    0,000 /sec
                 0      cpu-migrations:u                 #    0,000 /sec
                 0      page-faults:u                    #    0,000 /sec
     1.757.832.365      instructions:u                   #    1,64  insn per cycle
                                                  #    0,19  stalled cycles per insn
     1.073.534.542      cycles:u                         #    0,831 GHz
       328.381.072      stalled-cycles-frontend:u        #   30,59% frontend cycles idle
       176.994.651      branches:u                       #  136,943 M/sec
         8.642.462      branch-misses:u                  #    4,88% of all branches

       5,003397546 seconds time elapsed
```

Ahora quisiera guardar el reporte

```bash
perf record -g -p 2563 sleep 5
```

Esto genera un archivo llamado perf.data que almacena la información recolectada

```bash
file perf.data
perf.data: Linux perf recording, version 2. little endian
```
Este archivo nos va ayudar a perfilar la aplicación que estamos siguiente.

```bash
perf report
```

Esto nos muestra un reporte de cada una de las llamadas que ha realizado el programa a diferentes componente del sistema operativo, esto nos permite saber por ejemplo si hay un bug o alguna falla que no podamos encontrar directamente en el código fuente.

![](attachments/Pasted%20image%2020251007162125.png)

En general me da información de que rutinas está ejecutando la aplicación

# Firefox profiler

Este nos permite tener el perf report en un navegador, este utiliza el formato gecko, despues de haber generado el perf.data (perf report)

```bash
perf script report gecko
```

![](attachments/Pasted%20image%2020251007163039.png)

