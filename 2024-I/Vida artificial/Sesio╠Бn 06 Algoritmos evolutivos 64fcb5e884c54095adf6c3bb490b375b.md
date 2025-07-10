# Sesión 06 Algoritmos evolutivos

¿Que es un algoritmo evolutivo?

Es un conjunto de soluciones que vamos generando aleatoriamente y combinamos de tal manera llegamos a “buenas soluciones” ES UN PROCESO ESTOCÁSTICO

---

¿Que tiene un algoritmo evolutivo?

- Población (conjunto de soluciones)
- Función de fitness (¿Que tan bueno es un individuo?)
- Matting pool (Los seleccionados para reproducción)
- Cruce (Generación de nuevos individuos)
- Mutación (Pequeños cambios a los nuevos individuos)
- Reemplazo (La nueva población)

El algoritmo tiene los parametros de tunning relacionados con el tamaño de la población, el tipo de cruce (ruleta), la función de fitness, el porcentaje de mutación y el tipo de reemplazoQ

---

¿Que debe cumplir un individuo? Un alelo

1. Ser completo: Se mapean todas las posibles soluciones
2. Ser correcto: No se crean individuos NO FACTIBLES

En caso de tener estos problemas, el primero no se puede solucionar y el segundo la población se puede CORREGIR: Fitness o arreglando el cromosoma

---

Genotipo vs fenotipo

Genotipo es la información genetica (cromosoma)

Fenotipo su expresión ¿Que significa?

---

Función fitness

Sirve para darle un puntaje a los individuos

Debe ser coherente con el problema estamos resolviendo

Puede manejar factores de penalización para malos individuos o individuos NO FACTIBLES

---

Explotación vs exploración

- Explotación: Nos quedamos con los mejores individuos sin explorar
- Exploración: Buscamos en el espacio de busqueda sin descartar los malos individuos

Un buen algoritmo genético debería mezclar ambos

---

Teorema fundamental de los GA

- Esquema es una selección de un cromosoma o más y se le busca sobre los otros, de acuerdo al número de cromosomas elegidos se tiene el orden, esto busca reducir la dimensionalidad del problema (orden exponencial)
- Las operaciones de cruce por matting pool introducen los esquemas (buenos genes)
- Los operaciones de mutación puede sacarnos del esquema, esto es bueno porque nos permite ampliar el espacio de busque