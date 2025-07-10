# Sesión 21 de Agosto: Introducción a la paralelización

# ¿Porque programar en paralelo?

¿Que ventajas nos ofrece programar el paralelo?

1. Aprovechar las arquitecturas multinúcleo disponibles actualmente
2. Los procesadores tienen núcleos reales e hilos
3. Ley Amdahl (máxima ganancia paralela) el proceso más grande secuencial que no podemos paralelizar
4. Ley de Moore: Capacidad de procesamiento (tamaño del transistor) número de transistores en el procesador 5 nm
    1. Número de transistores
    2. Frecuencia de reloj (2Ghz, 3GHz)
    3. Eficiencia energética (recalentamiento)
5. Cuello de botella es la memoria: RAM, Cache

---

Limitaciones de la parelelización

1. Si tenemos recursos de hardware limitados, podemos paralelizar hasta la capacidad disponible (hilos de un servidor Web)
2. Sistemas de hardware elásticos (Cloud) que pueden incrementar la capacidad de hardware y responden mejorar a sobrecargas de trabajos (Amazon en Blackfriday)
3. Determinismo: Sin importa como se ejecute debo dar el mismo resultado 

```cpp
a = 3
b = 2
c = 3

c = a + b + c  //Tarea 1
c = 2*c //Tarea 2

/**
Tarea 1
Tarea 2
**/
c = 8
c = 16

/**
Tarea 2
Tarea 1
**/
c = 6
c = 11
```

---

Programación paralelo

- Solemos programar de forma secuencial, pero no se aprovecha la capacidad de los equipos de cómputo
- Programar en paralelo nos permite concentrarnos en la forma en que se resuelve
    - Partición de tareas: Mapeo: División y posible ejecución
    - Unificación de tarea: Reduce: Combinación de resultados
    - Estructurar para garantizar determinismo

---

## Ejemplos

### Recursos

- Instalar en Windows [https://www.mingw-w64.org](https://www.mingw-w64.org/)  en Linux/MAC build-essential/gcc
- Visual Studio Code:
    - **C/C++ Microsoft**
    - **C/C++ Extension Pack Microsoft**

### Librerías

- Archlinux [https://archlinux.org/packages/extra/x86_64/onetbb/](https://archlinux.org/packages/extra/x86_64/onetbb/) y https://archlinux.org/packages/extra/x86_64/clthreads/
- Debian/Ubuntu [https://packages.debian.org/source/sid/onetbb](https://packages.debian.org/source/sid/onetbb) [https://packages.debian.org/buster/libboost-thread-dev](https://packages.debian.org/buster/libboost-thread-dev)
- Windows [https://www.intel.com/content/www/us/en/docs/onetbb/get-started-guide/2021-6/install-onetbb-on-windows-os.html](https://www.intel.com/content/www/us/en/docs/onetbb/get-started-guide/2021-6/install-onetbb-on-windows-os.html) y https://github.com/GerHobbelt/pthread-win32

## Paralelización C++

1. thread Lanzar hilos con un proceso, debemos partir este proceso por ende es necesario utilizar variables de inicio y fin, nosotros definimos cómo lo manejamos. 

```cpp
gcc -o exe archivo.cpp -lpthread
```

1. tbb Lanzar hilos con respecto a una colección for o reduce (datos) o tareas, la librería se encarga de la gestión de hilos, variable de inicio y final de recorrido de la colección.

```cpp
gcc -o exe archivo.cpp -ltbb
```

[https://gist.github.com/cardel/77035919625313f84a49392b21c78a73](https://gist.github.com/cardel/77035919625313f84a49392b21c78a73)