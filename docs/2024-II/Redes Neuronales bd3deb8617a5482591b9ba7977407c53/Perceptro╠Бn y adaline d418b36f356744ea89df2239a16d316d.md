# Perceptrón y adaline

# Perceptrón

¿Que es?

1. Algoritmo de aprendizaje SUPERVISADO esto significa que los datos están etiquedos y queremos que la RN los aprenda
2. Se calcula el error: diferencia entre la salida esperada y la salida obtenida
3. Se actualizan los pesos buscando que la salida sea igual a la esperada
4. Algoritmo de clasificación binaria: 0 o 1

---

¿Que tipo de problemas resuelve perceptrón?

Problemas que sean linealmente separables, que una función lineal nos permita separarlos

![image.png](Perceptro%CC%81n%20y%20adaline%20d418b36f356744ea89df2239a16d316d/image.png)

---

¿Como funciona perceptrón?

1. Asigna valores aleatorios a los pesos (-1 y 1) en una DISTRIBUCIÓN UNIFORME
2. Generamos la salida para los patrones de entrada
3. Calculamos el error $e = t_u - y_u$
4. Aplicamos la regla perceptrón 

$$
w_{t+1} = w_{t} + \eta e x
$$

## Adaline

Descripción de algoritmo

1. Tiene salidas continuas
2. Se hace la siguiente:
    1. Se calcula el error cuadrático medio $e = \frac{1}{2}\sum \limits_{i=1}^n (t_i - y_i)²$
    2. (Supongamos una red neuronal con dos entradas) Calculamos la derivada parcial con respecto a los pesos $e = \frac{1}{2}\sum \limits_{i=1}^n (t_i - f(w_1*x_1j+w_2*x_2j + b))²$
    3. Derivamos con respecto al peso e igualamos a cero, el objetivo es encontrar el peso que hace que la derivada sea cero, es decir el ERROR ES MINIMO $\frac{\partial e}{\partial w_i} = -\frac{1}{2}*2*(t - f(\bar{X}))f'(\bar{X})*x_i$ 
    4. $\frac{\partial e}{\partial w_i} = -e*(1)*x_i$
    5. El cambio de pesos es el siguiente $w_{t} = w_{t-1} - \eta*\Delta e$
    6. Finalmente $w_{t} = w_{t-1} + \eta*e*x$
    7. Se aplica el mismo procedimiento que en perceptrón nuestra condición de parada es un error minimo o bien un número de iteraciones

# Factor de aprendizaje

¿Que es?

- Es un hiperparametro del algoritmo de aprendizaje
- Controla la velocidad de aprendizaje
- Si el factor es muy elevado el algoritmo es muy rapido tiene el problema que oscila,el error sube y bajo
- Si el factor es muy pequeño, el algoritmo es muy lento y la convergencia tarda mucho