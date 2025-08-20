Amazon Relational Database Service

Es un servicio administrado por AWS para la gestión de bases de datos. En general el cliente sólo se preocupa por optimizar la aplicación que usa la base de datos.

# Características de RDS

1. Instancia(s) que gestionan la base de datos, CPU, memoria, rendimiento en red
	1. Instancias bajo demanda cobro por hora
	2. Instancias reservadas (1 o 3 años)
2. Una zona de disponibilidad (one-az) o multiples zonas de disponibilidad (multi-az). En este último hay nodos de respaldo para la base de datos y la sincronización se realiza de forma automática.
3. Motores de BD: MySQL, Amazon Aurora, SQL Server, PostgreSQL, MariaDB y Oracle.
4. Es pensando para cargas de trabajo de lectura intensiva (muchos datos)
5. Optimización de consultas

# Utilizar RDS


| Cuando usar                              | Cuando no usar                                   |
| ---------------------------------------- | ------------------------------------------------ |
| Consultas completas                      | Velocidad de lectura y escritura (No SQL)        |
| Tasa de lectura o escritura media o alta | Partición de los datos (Modelo relacional)       |
| No más de un nodo de trabajo             | Solicitudes consultas GET o PUT simples (No SQL) |
| Alta durabilidad                         | Personalizar el sistema de base de datos (RDBMS) |
# Facturación
- Se cobra por hora de utilización
- Capacidad física del motor de base de datos
- Tipo de instancia
- Replicación: Número de instancias 
- Almacenamiento aprovisionado (dentro de la capacidad) no se cobra el backup pero si el almacenamiento GB por mes
- Almacenamiento adicional: Se cobra por el backup y por GB por mes
- Número de solicitudes
- Tipo implementación: One-AZ o Multi-AZ