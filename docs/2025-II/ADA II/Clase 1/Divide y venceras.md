# Divide y vencerás

Es un enfoque de solución de problemas, a partir solucionar subproblemas
- Dividir: Divide el problema en subproblemas
- Conquistar: Resuelve un subproblema
- Combinar: Combina las soluciones de los subproblemas hasta llegar a la general

## ¿Como nos damos cuenta si un problema se puede resolver con divide y vencerás?

La solución general está compuesta por soluciones de los suproblemas, ejemplo ordenamiento

```java
int arr[] = {1,2,3,4,5,6,7,8}
/* 
Si yo tomo un subarreglos
arr[1:3] = {2,3,4}
Tambien esta ordenado
```

En el caso del maximo, solo vemos el máximo, pero es el resultado de comparar los maximos de los subproblemas

# Ejemplo

Se divide lógicamente con los indices p,q,r, no divide el arreglo mientras se ejecuta el arreglo, si no que trabajamos con los indices

```python
#T(n) = 2T(n/2)+n
def merge(A, p, q, r):
    left = A[p : q + 1]
    right = A[q + 1 : r + 1]
    left.append(float("inf"))
    right.append(float("inf"))
    i = 0
    j = 0
    for k in range(p, r + 1):
        if left[i] <= right[j]:
            A[k] = left[i]
            i += 1
        else:
            A[k] = right[j]
            j += 1


def mergeSort(A, p, r):
    if p < r:
        q = (p + r) // 2
        mergeSort(A, p, q)
        mergeSort(A, q + 1, r)
        merge(A, p, q, r)


if __name__ == "__main__":
    lst = [2, 23, 1, 4, 9, 12, 12, 1231, 1, 2002, 99, 231, 12]
    mergeSort(lst, 0, len(lst) - 1)
    print(lst)
```

La división para hasta que no se cumpla p < r, ¿Que pasa cuando p = r? El arreglo sólo tiene un elemento **caso trivial o base**

# Divide y vencerás con memorización

1. Los subproblemas independientes, es decir que no importa el orden en que los calcule no se afecta su resultado
2. Los subproblemas están repetidos **clave** 
3. Se utiliza una estructura de datos, su dimensión depende del número de variables que describen un subproblema
	1. Caso fib(n) es un arreglo, solamente tenemos a n
	2. En caso de que el problema tenga 2 variables, necesitamos una matriz
	3. En el caso de más variables, una estructura de número de variables dimensiones
![](attachments/2025-08-21-Note-12-22_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}