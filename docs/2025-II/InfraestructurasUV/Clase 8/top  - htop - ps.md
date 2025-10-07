# top
Es una herramienta de Linux que nos da los procesos que están en ejecución, nos da información

1. PID Identificador único de proceso
2. PR Prioridad del proceso
3. NI: Nice que afecta la prioridad del proceso
4. VIRT: memoria virtual utilizada
5. RES Memoria fisica utilizada (RAM)
6. SHR Memoria compartida con otros procesos
7. S: Estado del proceso (ejecutando, durmiendo o parado)
8. % CPU: Porcentaje utilizado de la CPU
9. % Mem Porcentaje de memoria utilizada

```bash
top

top - 14:18:29 up 10 min,  1 user,  load average: 0,56, 0,57, 0,37
Tasks: 330 total, 1 running, 329 sleep, 0 d-sleep, 0 stopped, 0 zombie
%Cpu(s):  2,4 us,  1,2 sy,  0,0 ni, 95,6 id,  0,0 wa,  0,7 hi,  0,2 si,  0,0 st
MiB Mem :  15800,7 total,  11095,1 free,   2649,4 used,   2475,1 buff/cache
MiB Swap:  12000,7 total,  12000,7 free,      0,0 used.  13151,3 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   2847 cardel    20   0 8172784 554416 430992 S  22,6   3,4   1:36.99 obs
   1317 cardel    20   0  888540 197244 159836 S  11,3   1,2   0:34.94 Hyprland
   2385 cardel    20   0 1411,7g 278988 134712 S   6,6   1,7   0:27.58 electron
   2369 cardel    20   0   32,9g 223836 132768 S   3,7   1,4   0:11.93 electron
   2200 cardel    20   0 1392,4g 212940 136700 S   2,0   1,3   0:05.84 electron
   1400 cardel    20   0 4704504  72184  54304 S   1,7   0,4   0:02.04 waybar
   1616 cardel    20   0  234692   9536   8244 S   1,7   0,1   0:02.41 xdg-desktop-por
   1538 cardel    20   0  389124  66220  47496 S   1,0   0,4   0:02.40 Xwayland
   1645 cardel     9 -11  179928  22756   9712 S   1,0   0,1   0:03.11 pipewire-pulse
   1609 cardel     9 -11  109632  16480  10036 S   0,7   0,1   0:02.65 pipewire
   2525 cardel    20   0  795660 121136  77392 S   0,7   0,7   0:01.58 alacritty
```

Es equivalente a taskmgr de Windows

```bash
top -p 2525,2323
# Ver los procesos 2525, 2323
top -b -p 2525,2323 -n 1
```

Este tipo de salida se volca a stdout (porque es salida 1)  [Tipos de salida S.O](Tipos%20de%20salida%20S.O.md)


# htop

![](attachments/Pasted%20image%2020251007143024.png)

Nos ofrece una interfaz más intuitiva para la gestión de los programas cargados en memoria

# ps

Es una interfaz que nos proporciona información sobre los procesos ejecutando en el sistema.

```bash
ps
```
Muestra los shell cargados en el S.O (estos son la interfaz de linea de comandos)

```bash
ps a | grep obs | more
```

El pipe en Linux permite usar la salida de una comando como entrada de otro

```bash
   ~  ps -p 2525
    PID TTY          TIME CMD
   2525 tty2     00:00:04 alacritty
   ~  ps -p 2525 -o priority,size,cmd,user,pid
PRI  SIZE CMD                         USER         PID
 20 77140 alacritty                   cardel      2525
```
Ps permite conocer el estado de un proceso y seleccionar que campos deseo ver