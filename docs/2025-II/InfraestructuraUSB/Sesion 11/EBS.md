Es un sistema almacenamiento por bloques.

¿Cual es la diferencia con almacenamiento por objetos que nos ofrece s3?

En el almacenamiento por bloques si un archivo cambia un pequeño bloque, sólo se actualiza ese bloque, pero en objetos es necesario actualizar todo.

# Funciones
- Proporciona volúmenes de almacenamiento individuales que se pueden adjuntar a una instancia de EC2
- Se pueden realizar copias de seguridad por medio de instantáneas, se que se almacenan un buckets de s3
- Se pueden utilizar como volumenes de arranque (SO) y de almacenamiento

# Tipos

## SSD

Maximo es 16TB.

| Tipo                | Caracteristicas                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uso general         | Pensadas para aplicaciones cotidianas en la que la latencia no es importante . Pueden ser volumenes de arranque (SO)                               |
| IOPS aprovisionadas | Pensadas para aplicaciones donde se requiere una alta velocidad de escritura y lectura. Aunque pueden ser volúmenes de arranque su uso no es común |
|                     |                                                                                                                                                    |
## HDD

Máximo es 16TB y son más económicos que los SSD


| Tipo                   | Caracteristicas                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Rendimiento optimizado | Para almacenamiento de datos grandes que requiere velocidad de escritura y lectura. No puede ser un volumen de arranque. |
| HDD en frio            | Para almacenamiento de datos grandes por largo tiempo. No puede ser un volumen de arranque.                              |
# Otras características

1. Instancias son backups del volumen y se pueden usar para crear otro volumen.
2. Cifrado sin costo adicional
3. Elásticas: Aumentar la capacidad y cambiar el tipo
4. Tipos
	1. Volúmenes persisten de forma independiente de la instancia, estos se cobran según lo que se almacene al mes
	2. IOPS:
		1. SSD: Se cobra según la cantidad de GB que aprovisiones
		2. HDD: Por número de solicitudes al volumen
		3. SSD IOPS aprovisionadas: Se cobra por GB y el tiempo que se aprovisionen.
5. Las transferencias de datos salientes son las que se cobran.
