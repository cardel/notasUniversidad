
# Como vamos

1. Repaso Python y C++. Conceptos de redes basicos: IP, puerto, mascara.
2. Teoria de paralelismo
	1. Foco: Span (tiempo)
	2. Limitaciones
		1. Memoria cache: Esta es pequeña en comparacion de la RAM y es la entrada a la CPU
		2. Ley ahmdal
			1. Parte paralelizable
			2. Parte no paralelizable
			3. El rendimiento maximo suponiendo numero de hilos infito la parte no paralelizable
		3. Barreras
			1. Fisica: Tamaño de los transitores y el problema de la eficiencia de energia
			2. Frecuencia de reloj: Limite usable, por esta razón hoy en dia es muy aro encontrar procesadores mas alla de los 4GHz
			3. Memoria tiene una frecuencia y el procedor otra, requiere sincronización
			4. PRogramación: El acceso a memoria es lo más lento que tiene un programa (20% de las operaciones)
			5. Limites del parelismo: El el numero de hilos dentro de una Core (sincronización y evitar situaciones de deadlock)
				1. Ejecución especulativa Cargar previamente las instrucciones que se creen se van a ejecutar
				2. Pipeline: Aprovechar los ciclos de instruccion que se encuentran disponibles para no tener que esperar a que una instrucción finalice para ejecutar otra

# Temas

1. [Usando Thread](Usando%20Thread.md)
2. [Ejercicio Thread](Ejercicio%20Thread.md)
3. [Libreria TBB](Libreria%20TBB.md)
4. [Ejercicio TBB](Ejercicio%20TBB.md)
5. [Resumen](Resumen.md)