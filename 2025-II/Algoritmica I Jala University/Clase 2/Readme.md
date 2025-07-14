# Fundamentos de algoritmos

## Problemas

-Especificación de datos de entrada: Tipo, el rango como se puede mapear: int, double, long, string, int[], vector, 
-  Especificación de lo que se busca de salida: tipo de la salida
- Los problemas puede ser de diversos tipo
	- Optimización: Buscar el mejor valor (solución)
	- Búsqueda: Encontrar un valor dentro de muchos
	- Ordenamiento: Reordenar la entrada de acuerdo a algún criterio


## Instancia
Es un conjunto de entrada válidas para el algoritmo con su correspondiente salida

## Dominio de un problema
Son los valores que son validos para las entradas, dominios finitos o infinitos

$$
D \in \mathbb{N}
$$
Este seria el caso de los números naturales que es un dominio infinito

## Tamaño de un problema
Es la cantidad de datos que ingresan como entrada, por ejemplo, en el caso de un arreglo, sería el número de elementos
En el caso de una matriz tendrías filas por columnas (es el número de elementos)

## Sucesiones

Secuencia de números
- Artimetica cuando se suma un valor constante (d = 3) 1,4,7, 10, ...
- Geometrica cuando se multiplica un valor constante (r = 2) 3,6,12,24,48,...
- Lo que tenemos son términos a1,a2,a3,a4,...   1,4,7, 10 => a1 = 1, a2 = 4, ...

Sumatorias
Suma de una serie: geometrica o aritmetica
![[Pasted image 20250714165857.png]]


# Calculo de complejidad

Notaciones
$$O$$ Sirve para el peor caso
$$ \Omega $$ Se usa para el mejor caso
$$ \Theta $$ Caso promedio
## Calculo de complejidad
Operaciones elementales (toman tiempo 1)
- Operaciones artimeticas
- Asignaciones a variables
- Llamadas a funciones
- Retornos, captura de datos, prints
- Comparaciones lógicas
- Acceso a estructuras de datos (arreglo)
### Condicionales
Se toma como mejor caso la bifurcación que menos se demore (menos pasos tenga) y el otro caso es el peor. **Recordar** El programa sólo se irá por una de las dos (true o else)
## Ciclos
- Inicialización int i = ..
- Repetición: comparación i<=n, incremento i++, instrucciones esto se repite tantas veces el ciclo se hace
- Salida la ultima comparación (esta da falso)
![[Pasted image 20250714173022.png]]
![[Pasted image 20250714173131.png]]![[Pasted image 20250714173142.png]]