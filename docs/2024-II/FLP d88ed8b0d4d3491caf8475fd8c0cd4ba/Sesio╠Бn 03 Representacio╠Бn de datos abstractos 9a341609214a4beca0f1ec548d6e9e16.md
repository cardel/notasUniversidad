# Sesión 03: Representación de datos abstractos

# TAD

¿Que es un TAD?

- Tipo abstracto de dato
- Es cualquier tipo de dato que podamos reresentar con una especificación RECURSIVA

$$
\lceil 0 \rceil \in \mathbb{N}
$$

```racket
pred(n) = n - 1
succ(n) = n + 1
```

---

Partes de un TAD

1. Implementación: Cómo están estructurados los datos
2. Interfaz: Operaciones que nos ofrece el tipo de dato

---

Interfaz

1. Procedimientos constructores: Me permite construir un tipo de dato
2. Procedimientos observadores:
    1. Predicados: Consultar si el dato corresponde a una variante
    2. Extractores: me permite entraer información de mi TAD

---

Receta para diseño de TAD

1. Incluya un constructor para cada variante
2. Incluya un predicado para cada variante
3. Incluya un extracto para cada parte de cada variante