# Sesión 8: Arreglos unidimensionales

¿Que es un arreglo?

Es una colección de elementos del mismo TIPO, ejemplo

1,2,3,4

“Hola”, “adios”, “jajaj”,”mundo”

1.2,2.3,4.4

True,False,True,False

Estos se indexan desde 0 (siendo este la PRIMERA POSICION), los arreglos tiene dos cosas

- Indice: Posición contando desde 0
- Elemento: Valor contenido en la posición

---

Instalación de la librería

```bash
#Instalar la libreria
py -m pip install numpy
#Asegurarse que el Python esté en el PATH
#Preferiblemente en CMP (Simbolo del sistema)

#Linux
#Instalar el paquete python-numpy
#Ubuntu / Debina
sudo apt-get install python-numpy
#Fedora / Centeros
sudo yum install python-numpy
#Archlinux / Derivados
sudo pacman -Sy python-numpy
#Otras dis
sudo pip install numpy
sudo python -m pip install numpy
```

---

Creación de arreglos en Python

```python
import numpy as np

arr1 = np.array([1,2,3,4]) #Arreglo con elementos
arr2 = np.ones(10) #Un arreglo de tamaño 10 lleno de 1
arr3 = np.zeros(100) #Un rreglo de tamaño 100 lleno de 0
arr4 = np.full(100,""*100) #Un arreglo de tamaño 100 lleno de String
```

---

Accedemos a un elemento del arreglo

```python
import numpy as np

arr1 = np.zeros(100) #Creando un arreglo de tamaño 100 lleno de 0
print(arr1[29]) #Me retorna el elemento de posición 30
#Recordar que los arreglos inician en 0

for i in range(0, tamaño):
	...
	arr1[i] #Acceder a la posición
	...
```

---

Cambiamos un elemento en un arreglo

```python
import numpy as np

arr1 = np.zeros(100) # Creando un arreglo de tamaño 100 lleno de 0
arr1[29] = 1 # Cambiando el elemento de la posición 30 a 1

for i in range(0, tamaño):
    ...
    arr1[i] = nuevo_valor # Cambiar el valor en la posición i a nuevo_valor
    ...

```