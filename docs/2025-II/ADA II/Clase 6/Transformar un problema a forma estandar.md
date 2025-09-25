
Un problema en forma estándar tiene:

1. Función objetivo debe maximizarse
2. Las variables de decisión deben ser estrictamente positivas
3. Las restricciones deben ser $\leq$ (menor o igual)

## Función objetivo

```
minimize -2x1 + 3x2

subject to
	x1 + x2 = 7
	x1 - 2x2 <= 4
	x1 >= 0
```

Función objetivo se multiplica por -1

```
maximize 2x1 - 3x2

subject to
	x1 + x2 = 7
	x1 - 2x2 <= 4
	x1 >= 0
```

## Restricciones de no negatividad

La variable x2 es irrestricta, puede ser positiva o negativa, tenemos que partirla en dos variables $x_2 = (x_2^+ - x_2^-)$

```
maximize 2x1 - 3(x2⁺ - x2⁻)

subject to
	x1 + (x2⁺ - x2⁻) = 7
	x1 - 2(x2⁺ - x2⁻) <= 4
	x1 >= 0, x2⁺ >= 0, x2⁻ >= 0
```

```
maximize 2x1 - 3x2⁺ - 3x2⁻

subject to
	x1 + x2⁺ - x2⁻ = 7
	x1 - 2x2⁺ - 2x2⁻ <= 4
	x1 >= 0, x2⁺ >= 0, x2⁻ >= 0
```

## Desigualdades

Queremos que las restricciones sean de la forma $\leq$ , resulta que una $=$ puede verse como $\leq$ y $\geq$ , para cada restricciones de igualdad vamos a agregar dos una mayor o igual y la otra menor o igual

```
maximize 2x1 - 3x2⁺ - 3x2⁻

subject to
	x1 + x2⁺ - x2⁻ <= 7
	x1 + x2⁺ - x2⁻ >= 7
	x1 - 2x2⁺ - 2x2⁻ <= 4
	x1 >= 0, x2⁺ >= 0, x2⁻ >= 0
```

Para convertir un $\geq$ en un $\leq$ multiplicamos ambos lados por -1

```
maximize 2x1 - 3x2⁺ - 3x2⁻

subject to
	x1 + x2⁺ - x2⁻ <= 7
	-x1 - x2⁺ + x2⁻ <= -7
	x1 - 2x2⁺ - 2x2⁻ <= 4
	x1 >= 0, x2⁺ >= 0, x2⁻ >= 0
```

Ya con esto hemos transformado el problema en su **forma estándar**

