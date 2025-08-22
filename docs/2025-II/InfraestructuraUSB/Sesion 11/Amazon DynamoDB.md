Es una BD NO SQL, que trabaja bajo esquemas de clave valor

Los elementos pueden tener distintos atributos

Consultas de baja latencia

Buen rendimiento de lectura/escritura

# Componentes

- Tablas
- Elementos
- Atributos

## Claves
1. Clave de partición: Dividir los datos en grupos, escalabilidad de los datos
2. Clave de ordenación: Ordena un dato en un grupo

#### Tipos
- Clave única: Clave de partición + atributos
- Clave compuesta: Clave de partición + clave de ordenación + atributos

# Características

1. Almacén de datos clave-valor
2. Replica automáticamente las tablas
3. Ofrece una latencia uniforme
4. No tiene limites de tamaño de tabla ni de rendimiento

# Operaciones

You can use the `Query` API operation in Amazon DynamoDB to find items based on primary key values. You must provide the name of the partition key attribute and a single value for that attribute. `Query` returns all items with that partition key value. Optionally, you can provide a sort key attribute and use a comparison operator to refine the search results.

A `Scan` operation in Amazon DynamoDB reads every item in a table or a secondary index. By default, a `Scan` operation returns all of the data attributes for every item in the table or index.