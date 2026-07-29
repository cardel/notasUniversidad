# Sesión 4: Perceptrón multicapa 06 de Marzo

Perceptron multicapa

- La red tiene una capa de entrada (que no hace nada), capas ocultas y una capa de salida
- Esta red cada capa está conectada totalmente con la anterior

---

Algoritmo de Backpropagation

1. Calcule la salida (paso hacia adelante) tomando enc uenta las netas y la función de activación
2. Calcule los errores en cada capa 

```python
ecS = e*f'(netaCS)
#eci error capa oculta i
#ecin error capa oculta i+1
eci = ecin*f'(netaCi)*wcin
```

1. Corrija los pesos 

```python
wci = wci + n*eci*netaci
```

1. Repita el proceso con todos lo patrones de entrada hasta que se cumpla la condición de PARADA

---

Apuntes sobre el backpropagation

1. Dependemos del factor de aprendizaje (no puede ser muy alto o muy pequeño)
2. Dependemos el numero de neuronas (capacidad de procesamiento)