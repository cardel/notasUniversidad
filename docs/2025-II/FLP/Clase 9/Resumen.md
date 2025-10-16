# Clase

1. Asignación: Introdujeron las referencias como mecanismo para cambiar los valores de la variable cambiando donde apuntamos en memoria
2. Paso por referencia: Se introducen los targets (blancos) para manejar el hecho de que una variable puede ser modificada en un procedimiento.

## Resumen: Asignación y Paso por Referencia (EOPL)

### Conceptos Clave

**1. Asignación (Mutation)**
- Modificación *in-place* de valores almacenados
- Introduce **efectos secundarios** en programas funcionales
- Requiere **tiempo de vida extendido** para las ubicaciones de almacenamiento

**2. Paso por Referencia vs. Paso por Valor**
- **Paso por valor**: Se copia el valor del parámetro
- **Paso por referencia**: Se pasa la *ubicación* donde está almacenado el valor
- Permite modificar variables del llamador desde dentro de procedimientos

**3. Referencias y Alias**
- Múltiples referencias pueden apuntar a la misma ubicación
- Crea **aliasing**: modificar por una referencia afecta a todas las demás
- Introduce complejidad en el razonamiento sobre programas

### Cambios en el Intérprete

**Estructuras de Datos Nuevas:**
- `Ref` tipo explícito para representar referencias
- `Store` estructura para manejar ubicaciones de memoria
- `Location` identificadores únicos para posiciones en el store

**Semántica Modificada:**
- **Operador `newref`**: Crea nueva ubicación en el store
- **Operador `deref`**: Obtiene valor de una referencia
- **Operador `setref`**: Modifica valor en una ubicación existente
- **Operador `begin`**: Para secuenciar efectos secundarios


### Para los que se quedaron (el 20% estratégico)

Mirenlo así: mientras el 80% se fue pensando que esto era aburrido, ustedes están entendiendo por qué Python, Java y C++ se comportan como lo hacen cuando modifican listas o objetos. 

Ese `setref` que implementamos es literalmente lo que pasa cuando hacen `lista[0] = 5` en Python. El `newref` es el `malloc` de C pero con seguridad de tipos. 

El profesor sigue feliz porque sabe que los que se quedaron van a poder:
- Debuggear bugs de aliasing que rompen programas
- Entender por qué modificar un objeto afecta múltiples variables
- Diseñar APIs que eviten efectos secundarios inesperados

Cuando en el próximo examen pregunten sobre por qué modificar un objeto en JavaScript afecta todas las referencias, ustedes van a tener la respuesta desde la implementación del intérprete, no solo de memoria.

**Bottom line:** Implementaron paso por referencia desde cero. Eso vale más en una entrevista técnica que saber usar `=` en diez lenguajes diferentes.