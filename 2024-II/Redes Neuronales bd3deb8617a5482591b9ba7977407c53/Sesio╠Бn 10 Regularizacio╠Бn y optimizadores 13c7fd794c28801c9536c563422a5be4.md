# Sesión 10: Regularización y optimizadores

# Regularización

Que es regularización

1. Son estrategias para ajustar los pesos en el entrenamiento para evitar sobrejuste
2. La regularlización es un factor que se suma a la regla perceptrón

---

Regularización L1 y L2

1. L1 busca que los pesos sean cero, es decir eliminar caracteristicas innecesarias
2. L2 busca que los pesos sean cercanos a cero
3. L1 y L2 combina ambas

$$
w_{t+1} = w_{t}+\eta E n + \alpha sum(abs(w)) + 2*\beta*sum(w^2)
$$