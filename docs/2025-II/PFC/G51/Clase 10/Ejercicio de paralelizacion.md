# Ejercicio de Paralelización

## Instrucciones

### Descargar el repositorio plantilla funcional

```bash
git clone git@github.com:cardel/plantilla-funcional.git
```

### Borrar el repositorio de git

```bash
rm -rf .git
```

## Ejercicio: Cálculo de Promedio Ponderado

El **promedio ponderado** va a tomar un arreglo de notas y un arreglo de número de créditos.

### Datos de Ejemplo

$$
\begin{align}
\texttt{notas} = \{4.2, 4.3, 1.2\} \\
\texttt{creditos} = \{4, 3, 2\}
\end{align}
$$

### Proceso de Cálculo

**Primero sacar los intermedios:**

$$
\texttt{intermedio} = \{4.2 \times 4, 4.3 \times 3, 1.2 \times 2\}
$$

**Sumamos los créditos:**

$$
\texttt{sumcreditos} = 4 + 3 + 2 = 9
$$

**Sumamos los intermedios:**

$$
\texttt{sumintermedio} = 4.2 \times 4 + 4.3 \times 3 + 1.2 \times 2 = 32.1
$$

**Finalmente el promedio ponderado:**

$$
\frac{\texttt{sumintermedio}}{\texttt{sumcreditos}} = \frac{32.1}{9} = 3.56667
$$

