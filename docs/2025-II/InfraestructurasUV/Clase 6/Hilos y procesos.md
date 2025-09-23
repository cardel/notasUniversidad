Un hilo es una unidad de ejecución concurrente que se separa del hilo principal del programa y se aterriza en este.

1. Start() lanzamiento del hilo separandolo del hilo principal
2. Join() unificarlo con el hilo principal

Tener presente el tema de compartición de recursos:
- Hardware: Impresoras, teclado, etc
- Software: variables (tener cuidado con la consistencia)
Para este problema se maneja sincronización: dar un orden de ejecución a los hilos, garantiza determinismo sacrificando rendimiento.

Un proceso, es un entorno independiente en el sistema operativo el cual tiene su propio contexto de variables y este contiene uno o más hilos.

```bash
cardel@portatil-gamer  ~  ps au
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
cardel      1322  4.1  0.9 822512 161432 tty2    Ssl+ 13:52   0:56 Hyprland
cardel      1388  0.0  0.0  10240  6848 tty2     S+   13:52   0:00 /bin/sh -c /usr/bin/lxqt-policykit-agent >/dev/null
cardel      1389  0.0  0.3 817876 50532 tty2     Sl+  13:52   0:00 /usr/bin/lxqt-policykit-agent
cardel      1392  0.0  0.4 3055488 68688 tty2    Sl+  13:52   0:01 waybar
cardel      1395  0.0  0.1 115348 28924 tty2     Sl+  13:52   0:00 mako
cardel      1398  0.0  0.0  13816  4552 tty2     S+   13:52   0:00 wbg /home/cardel/.cache/current_wallpaper.png
cardel      1400  0.0  0.0   2840  1480 tty2     S+   13:52   0:00 wl-paste --type text --watch cliphist store
cardel      1408  0.0  0.0  10240  7228 tty2     S+   13:52   0:00 /bin/sh /home/cardel/.local/bin/battery_notify.sh
cardel      1440  0.4  1.2 1500360 201372 tty2   Sl+  13:52   0:06 /tmp/.mount_pcloudSax9CI/pcloud
```

Otro comando

```bash
htop
```

![](attachments/Pasted%20image%2020250923141841.png)