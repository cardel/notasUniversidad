# Código de la sesión

Los seis programas de la sesión: tres sobre hilos y tres sobre procesos.

| Archivo | Qué muestra |
|---|---|
| `suma_hilos.py` | La suma de cien millones repartida entre 2 y 16 hilos, y por qué empeora |
| `suma_hilos_numpy.py` | La misma suma con `slice.sum()`, que suelta el bloqueo global |
| `cupos.py` | Doscientos hilos peleando por cien cupos, con cerrojo y sin él |
| `saldo.py` | La actualización perdida y lo que el intérprete hace con `saldo += 1` |
| `cuadrados_procesos.py` | Lo que el padre ve y lo que no, con `Array` y `Value` |
| `mecanismos.py` | Memoria compartida contra `Pipe` y `Queue`, cronometrados |

## El ambiente

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Solo `suma_hilos_numpy.py` necesita NumPy; los demás usan la biblioteca
estándar.

## Correr

```bash
python suma_hilos.py 20000000      # el tamaño es opcional; el de la sesión es 100000000
python suma_hilos_numpy.py
python cupos.py
python saldo.py
python cuadrados_procesos.py
python mecanismos.py
```

## Lo que salió en la máquina donde se prepararon

```text
suma_hilos.py 20000000      secuencial 1,43 s · 2 hilos 1,58 s · 16 hilos 1,70 s
suma_hilos_numpy.py         secuencial 143,9 ms · 8 hilos 55,1 ms (2,61x)
cupos.py                    sin cerrojo: cupos -2, inscritos 102 · con cerrojo: 0 y 100
saldo.py                    sin cerrojo: 319 444 de 400 000 · con cerrojo: 400 000
cuadrados_procesos.py       lista normal [0, 0, 0, 0] · Array [1, 4, 9, 16] · Value 30
mecanismos.py               compartida 0,26 s · Pipe 3,65 s · Queue 3,94 s
```

Los tiempos cambian con la máquina; lo que se repite es el orden. Dos cosas
que conviene mirar al correrlos.

`suma_hilos.py` con un tamaño menor sigue dando hilos más lentos que el
secuencial, porque el bloqueo global no depende del tamaño. Y `cupos.py` y
`saldo.py` dan cifras distintas en cada corrida: conviene correrlos varias
veces, porque una carrera que aparece a veces se caza repitiendo.

`mecanismos.py` manda los doscientos mil enteros de a uno, y por eso la
brecha entre memoria compartida y los canales sale más grande que la de la
tabla de la sesión, donde el envío va por bloques. El orden de los tres es el
mismo.
