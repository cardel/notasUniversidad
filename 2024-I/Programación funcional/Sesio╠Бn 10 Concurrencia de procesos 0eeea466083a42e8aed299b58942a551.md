# Sesión 10: Concurrencia de procesos

## Paralelización

¿Que colecciones son apropiadas para la paralelización?

Vectores, arboles y arreglos

Porque estos se pueden dividir en cualquier tamaño, las listas no son apropiadas porque obliga a que cada elemento sea tenga paralelizar (head, tail)

Las operaciones deben ser INDEPENDIENTES, el orden no ALTERA el resultado (ASOCIATIVAS)

---

¿Que se debe tener en cuenta para paralelizar?

1. La división de la tarea debe tener una profundidad máxima, dado el tamaño de los datos y la capacidad concurrente de la CPU, si superamos ese limite podemos EMPERORAR el rendimiento, la profundad, esta ligada $2^{p}$ si dividimos a la mitad.
2. Debemos tener en cuenta el punto que en una tarea secuencial NO SE PUEDE MEJORAR así la divididamos, esto es el UMBRAL
3. Tener muchos hilos tiene el problema de la PLANIFICACION de RECURSOS

---

¿Como podemos paralelizar con un árbol?

Se construye una estructura tipo arbol (binario), tener en cuenta que partimos el arreglo en mitades hasta llegar al umbral, donde resolvemos secuencialmente

---

QUe podemos decir sobre paralelizar arreglos o usando árboles

Arreglos

- Es necesario partir el arreglo en ciertos puntos evitando se traslapen
- Optimo en memoria, arreglo son reservas de espacio memoria continua
- Costoso de contanear

Arboles

- Son puramente funcionales, los elementos NO SE TRASLAPAN
- Costoso en memoria ya que son un conjunto de objetos
- Eficiente de concatenar

## Resumen

- Para paralelizar una operaciones sobre una colección debe ser ASOCIATIVA, no importa como los operemos debe dar el mismo RESULTADO
- Tenemos que considerar un tamaño minimo (umbral, limite) en el cual no se puede mejorar la operación SECUENCIAL
- Los arreglo y vectores son FACILES de paralelizar, las listas tienen el problema por su estructura de cabeza y cola
- Podemos utilizar arboles como estructura para parelizar, esto nos permite despreocuparnos de la división de la estructura de datos, porque cada arbol divide en segmentos aproximadamente iguales
- Debemos considerar que parelelizar dividiendo la estructura o con arboles tiene sus pro y sus contras
- Operaciones como map se puede paralelizar sin problema, map es independiente por definición, porque se aplica a cada elemento de forma INDEPENDIENTE
- Operaciones reduce/fold si dependen que se la operación a aplicar sea ASOCIATIVA