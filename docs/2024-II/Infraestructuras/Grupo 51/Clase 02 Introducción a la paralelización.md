# Clase 02: Introducción a la paralelización

# Introducción a la paralelización

¿Para que programar en paralelo?

1. Tenemos sistemas multinucleo, que nos permite en TIEMPO REAL tener tareas paralelas
2. Cuando programamos lo hacemos de forma secuencial 1,2,3,4,…n, En ciertas situaciones las instrucciones son INDEPENDIENTES ¿Porque no aprovechar que tenemos un sistema multinúcleo?
3. Paralelización objetivo: Reducir el tiempo de ejecución al partir tareas independientes
4. Ley Amdahl hasta que punto puedo paralelizar, hasta la tarea secuencial que no se puede partir más grande 

```cpp
int arr[] = new int[100000]
for (int i = 0; i<=100000, i++) {
	arr[i] = i;
}

for (int i = 1; i<=100000, i++) {
	arr[i] = arr[i-1]+arr[i];
}
```

1. Ley moore: Numero de transistores por año cumplio bien hasta principios de los 2000
2. Otros aspectos: Frecuencia (generación de la señal y eficiencia energética), aspectos físicos aislamiento
3. Cuello de botella: Persistente → Ram → Cache → Registros (CPU)

---

Sistemas paralelos

1. Las aplicación en la nube suelen ser naturalmente paralelas
2. Sistemas de hardware son limitados, no puede crecer a necesidad (estamos limitados por el número de hilos que puede atender un sistema)
3. Cloud: Los sistemas de hardware son elásticos (es decir pueden cambiar a necesidad)
4. Determinismo: En paralelización las tareas se ejecutan en cualquier orden, es necesario garantizar que todas las tareas se ejecuten y den el mismo resultados 

```python
lst = [1,2,3,4]
#ls = [1,3,6,10]

for i in range(1,4):
	lst[i] += lst[i-1]
	
[1,4,6,10]

[1,3,5,9]
[1,2,6,7]
```

---

Programación en paralelo

- Trabajamos de forma secuencial, no se aprovecha la capacidad multinucleo de los sistemas
- Programación en paralelo (paradigma)
    - Partición de tareas: Mapeo: División de tareas
    - Unificación de las tareas reduce la combinación de los resultados
    - Estructuras para garantizar determinismo

---

# Paralelización C++

## Recursos

1. Instalar en Windows [https://www.mingw-w64.org](https://www.mingw-w64.org/)  en Linux/MAC build-essential/gcc
2. Visual Studio Code:
    - **C/C++ Microsoft**
    - **C/C++ Extension Pack Microsoft**

## Librerías

1. Archlinux [https://archlinux.org/packages/extra/x86_64/onetbb/](https://archlinux.org/packages/extra/x86_64/onetbb/) y https://archlinux.org/packages/extra/x86_64/clthreads/
- Debian/Ubuntu [https://packages.debian.org/source/sid/onetbb](https://packages.debian.org/source/sid/onetbb) [https://packages.debian.org/buster/libboost-thread-dev](https://packages.debian.org/buster/libboost-thread-dev)
- Windows [https://www.intel.com/content/www/us/en/docs/onetbb/get-started-guide/2021-6/install-onetbb-on-windows-os.html](https://www.intel.com/content/www/us/en/docs/onetbb/get-started-guide/2021-6/install-onetbb-on-windows-os.html) y https://github.com/GerHobbelt/pthread-win32

### **Paralelización C++**

thread Lanzar hilos con un proceso, debemos partir este proceso por ende es necesario utilizar variables de inicio y fin, nosotros definimos cómo lo manejamos.

```bash
gcc -o exe archivo.cpp -lthread
```

bb Lanzar hilos con respecto a una colección for o reduce (datos) o tareas, la librería se encarga de la gestión de hilos, variable de inicio y final de recorrido de la colección.

```bash
gcc -o exe archivo.cpp -ltbb
```

[https://gist.github.com/cardel/8fce3ebe2eff97479877d3083471217b](https://gist.github.com/cardel/8fce3ebe2eff97479877d3083471217b)