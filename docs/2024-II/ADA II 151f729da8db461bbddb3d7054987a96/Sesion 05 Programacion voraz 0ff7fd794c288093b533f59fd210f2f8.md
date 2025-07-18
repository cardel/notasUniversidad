# Sesion 05: Programacion voraz

# Definiciones

¿Que debe cumplir un problema para poder ser resuelto con programación voraz?

1. Propiedad de escogencia voraz: Poder tomar la decisión rapidamente de forma local
2. Subestructura optima (puede ser resuelto con programación diinámica)

---

Sobre solución optima

- Dinámica. Garantiza la optima global
- Voraz: No garantiza la optima global, pero encuentra una “buena” solución.

---

¿Cuando utiliza programación voraz?

1. Cuando hay pocos problemas REPETIDOS (Superpuestos)
2. Hay casos donde programación dinamica es muy complicado.

# Ejemplos

## Selección de actividades

¿Que es?

- Se tiene un recurso
- Se tiene conjunto de actividades con un tiempo inicial y un tiempo final
- Se debe programar las actividades para HACER el mayor número de actividad (Optimización)
- El recurso es de uso exclusivo

$$
 \{(ti_0, tf_0),(ti_1,tf_1), \cdots (ti_n, tf_n)\}
$$

---

Propiedad de escogencia voraz

1. Usar el recurso lo mejor posible
2. ¿Que promete tener el recurso el mayor tiempo libre? Las actividades que terminan primero
3. Ordenar las actividades de acuerdo al tiempo de finalización (Escogencia voraz)
4. Insertar en ese orden siempre que sea posible
5. Se busca maximizar utilizando la idea de que al colocar las tareas que finalizan primero tendré espacio para más actividades

---

## Mochila 0/1

Solución voraz

- En la mochila busco maximizar la ganancia sin exceder el peso, cada item tiene un peso y una ganancia
- ¿Cual es la propiedad de escogencia voraz?  La relación entre ganancia y peso, quiero maximizar la ganancia y minimizar el peso
- Solución: cada item va a tener ganancia/peso (relación) y procedo a ordenar de mayor a menor