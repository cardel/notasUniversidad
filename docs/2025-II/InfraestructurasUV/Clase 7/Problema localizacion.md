Cuando trabajos estructuras de datos, estas se mapean en memoria, pero para procesarlas necesitamos la memoria cache como puerta de entrada para el procesador

Para este caso

```c++
void initialize(int ** arr, int n) {
  for (int i = 0; i < n; i++) {
    arr[i] = new int[n];
    for(int j = 0; j < n; j++) {
      arr[i][j] = 0;
    }
  }

}

int main() {
  const int size = 1000;
  int **ar = new int*[size];
  initialize(ar,size);
  printf("Elemento 0 %d\n", ar[0][0]);

}
```


![](attachments/Pasted%20image%2020250930142159.png)Cuando hago el recorrido por filas estoy explorando bloques en orden, aqui el mapeo de memoria es cache es directo y tiene pocos miss (choques)

Ahora vamos a recorrerlo por columnas

```c++
int initializev2(int ** arr, int n) {
  for (int i = 0; i < n; i++) {
    arr[i] = new int[n];
  }
  for(int j = 0; j < n; j++) {
    for (int i = 0; i < n; i++) {
      arr[i][j] = 0;
    }
  }
  return arr[0][0];
}

```

![](attachments/Pasted%20image%2020250930142651.png)

Lo que vemos aqui es que el caso de recorrer por columnas hay saltos en memoria, y es mas probable tener choques (miss) en la memoria cache, lo que requiere un tiempo de espera para liberar es posicion de memoria cache antes de escribir el dato y eso nos agrega latencia.

La diferencia en tiempos se debe al **patrón de acceso a memoria** y cómo interactúa con la **jerarquía de memoria** (específicamente la cache).

## Organización de memoria

En C/C++, los arreglos 2D se almacenan en memoria en **orden de filas** (row-major order). Esto significa que los elementos de una fila están en posiciones contiguas de memoria:

```
arr[0][0], arr[0][1], arr[0][2], ..., arr[1][0], arr[1][1], ...
```

## Análisis de los algoritmos

**`initialize` (más rápido):**
```cpp
for (int i = 0; i < n; i++) {
  arr[i] = new int[n];
  for(int j = 0; j < n; j++) {
    arr[i][j] = 0;  // Acceso por filas
  }
}
```

- Accede a: `arr[0][0], arr[0][1], arr[0][2], ...` (contiguo)
- La cache carga bloques de memoria contigua
- Alta tasa de aciertos en cache: cuando se carga `arr[i][j]`, los siguientes elementos `arr[i][j+1], arr[i][j+2]` ya están en cache

**`initializev2` (más lento):**
```cpp
for(int j = 0; j < n; j++) {
  for (int i = 0; i < n; i++) {
    arr[i][j] = 0;  // Acceso por columnas
  }
}
```

- Accede a: `arr[0][0], arr[1][0], arr[2][0], ...` (no contiguo)
- Cada acceso salta `n * sizeof(int)` bytes en memoria
- Baja tasa de aciertos en cache: cada acceso requiere cargar un nuevo bloque de cache
- Genera muchos **cache misses**

## Efecto en el rendimiento

El acceso por columnas causa:
1. **Prefetching ineficiente**: El hardware no puede predecir el patrón de acceso
2. **Cache thrashing**: La cache se llena con datos que no se reutilizan
3. **Mayor latencia**: Cada acceso requiere ir a memoria principal más frecuentemente

Los resultados muestran que el acceso por filas es **más rápido** debido a la localidad espacial que aprovecha mejor la jerarquía de memoria.