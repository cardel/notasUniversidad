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