1. Repaso de relaciones
2. Composición de relaciones
3. Potencia de relaciones
4. Relaciones n-arias
5. Proyección
6. Join


## Tabla de conceptos principales

| Concepto | Definición | Propiedades clave | Ejemplo conceptual |
|----------|------------|-------------------|---------------------|
| **Proyección** | Operación que transforma una tupla de tamaño $n$ en una tupla de tamaño $m$ ($m \leq n$), seleccionando algunos campos de la tupla original. | - Reduce dimensionalidad<br>- Mantiene solo atributos especificados<br>- Puede eliminar duplicados si se aplica a relación | $P_{1,2}$ aplicada a $(a,b,c,d)$ produce $(a,b)$ |
| **Join ($J_p(R,S)$)** | Operación que integra dos relaciones $R$ (grado $n$) y $S$ (grado $m$) basándose en $p$ atributos comunes. | - Grado resultante: $m+n-p$<br>- $p \leq m$ y $p \leq n$<br>- Combina tuplas con valores iguales en atributos comunes | Join de $R$(Nombre,edad,sexo,salario) y $S$(Nombre,cargo,salario) produce (Nombre,edad,sexo,cargo,Salario) |
| **Atributos comunes ($c_i$)** | Conjunto de $p$ atributos que comparten las relaciones $R$ y $S$, sobre los cuales se realiza el join. | - Deben tener dominios compatibles<br>- Determinan la condición de unión | En ejemplo: Nombre y Salario son atributos comunes ($p=2$) |
| **Grado de relación** | Número de atributos/columnas en una relación. | - $n$: grado de $R$<br>- $m$: grado de $S$<br>- $m+n-p$: grado del resultado del join | $R$ tiene grado 4, $S$ tiene grado 3, join tiene grado $4+3-2=5$ |

## Estructura formal del Join

Para $R$ con tupla: $(a_1,a_2,\ldots,a_{n-p},c_1,c_2,\ldots,c_p)$  
Para $S$ con tupla: $(b_1,b_2,\ldots,b_{m-p},c_1,c_2,\ldots,c_p)$  
Resultado del join: $(a_1,\ldots,a_{n-p},b_1,\ldots,b_{m-p},c_1,\ldots,c_p)$

Donde:
- $a_i$: atributos exclusivos de $R$
- $b_i$: atributos exclusivos de $S$  
- $c_i$: atributos comunes ($p$ elementos)

## Relación con conceptos de [[Relaciones]]
- El join opera sobre relaciones (subconjuntos de productos cartesianos)
- La proyección puede verse como una operación sobre elementos de una relación
- Ambas son operaciones fundamentales en álgebra relacional