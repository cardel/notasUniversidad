# Código de la sesión

Los dos programas que se corrieron en clase. Escriben la misma matriz de
1000 × 1000 enteros y se diferencian en el orden de los dos ciclos.

## Compilar

```bash
gcc -g -o arr_filas arr_filas.c
gcc -g -o arr_columnas arr_columnas.c
```

La bandera `-g` no es opcional aquí. Sin información de depuración,
`cg_annotate` no sabe a qué línea del fuente pertenece cada fallo y el reporte
sale sin atribuir.

## Medir

```bash
valgrind --tool=cachegrind --cache-sim=yes \
         --cachegrind-out-file=filas.out ./arr_filas

valgrind --tool=cachegrind --cache-sim=yes \
         --cachegrind-out-file=columnas.out ./arr_columnas
```

`--cache-sim=yes` tampoco es opcional: desde Valgrind 3.25 cachegrind solo
cuenta instrucciones si no se le pide la simulación de caché, y el reporte sale
sin una sola cifra de fallos.

## Leer el detalle

```bash
cg_annotate --auto=yes columnas.out
```

Con `--auto=yes` el reporte trae el fuente anotado línea por línea. La columna
que interesa es `D1mw`, los fallos de escritura en la caché de datos de primer
nivel, sobre la línea de la asignación.

## Lo que devuelve

| | Por filas | Por columnas |
|---|---:|---:|
| Instrucciones | 16 160 926 | 16 160 940 |
| Accesos a datos | 10 052 911 | 10 052 919 |
| Fallos en L1 de datos | 64 326 | 1 001 821 |
| Tasa de fallo en escritura | 6,2 % | 98,7 % |

Y sobre la línea `arr[i * cols + j] = i * j;`, que es la misma en los dos
archivos:

| Recorrido | Escrituras | `D1mw` |
|---|---:|---:|
| Por filas | 1 000 000 | 62 500 |
| Por columnas | 1 000 000 | 999 999 |

Un `int` ocupa 4 bytes y una línea de caché son 64: caben dieciséis. Por filas
se falla una vez cada dieciséis escrituras, y un millón entre dieciséis da
62 500 exacto. Por columnas falla cada escritura.

## Para seguir jugando

Cambiar el tipo del arreglo y predecir el número de fallos antes de medirlo. En
una línea de 64 bytes caben sesenta y cuatro `char`, dieciséis `int` u ocho
`double`, así que el millón de escrituras del recorrido por filas debería
fallar un millón dividido entre ese número.

| Tipo | Caben por línea | Predicción | Medido |
|---|---:|---:|---:|
| `char` | 64 | 15 625 | 16 032 |
| `int` | 16 | 62 500 | 62 907 |
| `double` | 8 | 125 000 | 125 407 |

Los 407 de más son los mismos en los tres casos: son las escrituras del resto
del programa, que no dependen del tipo del arreglo.
