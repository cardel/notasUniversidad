# Sesion 6: Ajuste del BP

Ajuste del factor de aprendizaje

Para esto introducimos dos parametros $\rho$  y $\alpha$, el  $\rho$  es menor a 1 y el $\alpha$ es mayor a 1 pero muy levemente.

$$
\eta = \begin{cases}   \rho *\eta,\texttt{ Si eactual < eanterior} \\\alpha*\eta \texttt{ En otro caso}\end{cases} 
$$

El objetivo es aumentar el factor de aprendizaje si el error DISMINUYE o viceversa.

---

Numero de neuronas por capa

Teorema Hetch-Neilson (Muchos datos)

C1 n, C2 n/2 , C3 n/3

Teorema de Kolgomorov (Pocos datos)

C1 n, C2 2n-1, C3 n/2

---

Datos

- Debemos garantizar que esten normalizados:
    - Eliminamos la media
    - Ajustamos la varianza (la idea es que todos estén cercanos)
    - Normalizamos entre 1 y -1 (66%)

---

Sobreentrenamiento

La red neuronal MEMORIZA los datos y pierde su generalización

A medida que el error de entrenamiento disminuye llega un punto en que el error general

Parta los datos:

- Entrenamiento: 80% ← Función loss
- Prueba: 20% ← métricas

Los datos deben ser BALANCEADOS, el númro de datos que tienen salida 0 debe ser similar al número de datos que tiene salida 1, 35% - 65% (maximo)

---

Regularización

La regla del gradiente descendiente ajusta los pesos con respecto al ERROR

Sin embargo, los pesos se nos pueden descontrolar (desbordar) unos muy eleventos y otros muy bajos

### Regularización L1

¿Que busca? Los pesos deben tener un valor pequeño, el minimo posible se introduce un factor  $\lambda1$ que suele ser pequeño, y ajustamos los pesos así: $\lambda_1 \sum \limits_{w_i \in W} | W_i |$ esto implica que la regla perceptrón

$w = w + \eta (e_c*x_i-\lambda_1*sgn(w))$

 

### Regularización L2

¿Que busca? QUe los pesos sean muy cercanos entre ellos, para evitar ENTRADAS FAVORITAS (entradas con pesos muy altos)

Factor $\lambda_2$  Formula $\sum \limits_{wi \in W} wi^2$ 

Regla perpectrón

$w = w + \eta (e_c*x_i-\lambda_2*2*w)$

### Regularización L1 + L2

Es aplicar ambas regulazaciones. Hay que tener cuidado con los valores de los parámetros $\lambda$