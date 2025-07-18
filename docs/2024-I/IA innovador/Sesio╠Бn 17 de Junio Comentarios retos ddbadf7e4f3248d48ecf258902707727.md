# Sesión 17 de Junio Comentarios retos

## Recursos

https://code.visualstudio.com/

[https://www.python.org/downloads/](https://www.python.org/downloads/) 

![Untitled](Sesio%CC%81n%2017%20de%20Junio%20Comentarios%20retos%20ddbadf7e4f3248d48ecf258902707727/Untitled.png)

[https://phoenixnap.com/kb/how-to-install-python-3-windows](https://phoenixnap.com/kb/how-to-install-python-3-windows)  (revisar instalar para todos los usuarios)

https://colab.research.google.com/drive/1hIZIsBRFWCY_ZqV4i90D_J2Of70lqjFj?usp=sharing Reto 1

[https://scikit-learn.org/1.5/modules/generated/sklearn.datasets.load_iris.html#sklearn.datasets.load_iris](https://scikit-learn.org/1.5/modules/generated/sklearn.datasets.load_iris.html#sklearn.datasets.load_iris) Reto 2

Tener presente redondear a 4 decimales  round(out, 4)

## Instalar librerias

Deben hacerlo en una consola con provilegios de administrador (menu inicio - cmd - clic derecho “ejecutar como administrador”

```python
py -m pip install numpy
py -m pip install scikit-learn
py -m pip install tensorflow
```

## Comentarios

Sobre reto 1 (Calificación automatica)

1. Para ingresar en la primera clase hacer clic Simulación
2. Tener presente que las entradas las ingresa el usuario en una sola linea, por ejemplo 1000 0.1
3. Solo imprimir la salida en EXACTAMENTE el formato que piden, por ejemplo para el caso anterior debe ser:
0.4948 0.5003 0.502 0.5063

```python
1000 0.1
0.4948 0.5003 0.502 0.5063

10999 0.1
0.0575 0.9471 0.9473 0.0568

10000 0.1
0.0637 0.9409 0.9411 0.064
```

---

Sobre reto 2 (Calificación automatica)

```python
import numpy as np
from sklearn.datasets import load_iris

# Datos de entrada y salida para el conjunto de datos Iris
iris = load_iris()
X = iris.data
y = iris.target.reshape(-1, 1)
```

Revisar el colab de las funciones activación y obtener el accuracy de Sigmoid y RELU

```python
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

```

Capa oculta RELU/sigmoid con 10 neuronas, capa salida con una sola neurona (neurona de salida) SIGMOIDE

---

Sobre reto 3 (Calificación automatica)

Crear una clase

```python
class AdamOptimizer:
    def __init__(self, learning_rate=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8):
	    pass
	  def update(self, params, grads):
		  pass
		  
l_rate, beta_1, beta_2= input().split()
l_rate_=float(l_rate)
beta_1_=float(beta_1)
beta_2_=float(beta_2)

# Inicialización de parámetros
x = 0  # Valor inicial de x
optimizer = AdamOptimizer(l_rate_,beta_1_,beta_2_)  # Inicialización del optimizador

# Bucle de optimización
for _ in range(100):
    gradient = 2*(x-3)  # Gradiente de la función de pérdida
    optimizer.update([x], [gradient])  # Actualización de los parámetros con el optimizador
    x -= optimizer.learning_rate * gradient  # Actualización de x manualmente (solo para comparación)

# Resultados
print(round(x,4)) 
```

---

Reto 1 (Manual)

Usar minst [https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html) 

Mostrar el classification report: [https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html#classification-report](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html#classification-report)

Entregar el archivo ipynb (Descargado desde colab)

---

Reto 2 (manual)

Si se hace local tener presente si tiene NVIDIA instalar los CUDA y luego probar

Si no en Google Colab esta ya optimizado

---

Reto 3 (manual)

Revisar el colab de PLN