# Sesión 12: Computo II almacenamiento (datos y bd)

# Computo II

¿Que es AWS Elastik Beanstalk?

Es un servicio de PAAS para el despliegue de aplicaciones Web, nos ofrece ambientes en diferentes Frameworks: Python, .net, java (EJS, Tomcat), Ruby, etc

Simplemente subimos la aplicación con una configuración específica y esta será desplegada

¿Qué limitaciones?

Es una instancia de EC2 preconfigurada y que no controlamos su estructura interna

¿Ventajas?

Facil despliegue de aplicaciones, fácil escalabilidad y fácil de monitorear

# Almacenamiento

EBS

- Volúmenes (unidades de disco lógicas)
- Se pueden montar en instancias de EC2
- Ofrece servicio de seguridad (encriptación)
- Puede ser SSD que se cobra por lo que tenga almacenado mensualmente
- Puede ser HDD que se compra es la transferencia de dato
- Los volúmenes no se pueden compartir

---

S3

- Almacena son OBJETOS no archivos
- Los objetos son una encapsulación que tienen los archivos
- Se manejan políticas de acceso que puede ser también por ACL
- Es altamente configurable
- Es económico frente a otros servicios de AWS
- Actualizar un archivo debe sobreescribir completamente
- Tenemos modos de uso frecuencia y de poco uso

---

EFS

- Sistema de archivos en red
- Se puede montar para manejarlo como si fuera una unidad de disco
- Puede estar en varias zonas de disponibilidad (backups y sincronización)
- Se puede acceder por URL o por IP con el puerto de NFS habilitado
- Ofrece opciones de backups automáticos y verificación de archivos
- Espacio ajusta a las necesidades
- A diferencia de EBS varias instancias (acceso publico) lo pueden compartir

---

S3 glacier

- Papelera de reciclaje
- Es lento para las operaciones
- Se utiliza como medio para almacenar datos que no se utilizan pero se deben almacenar por razones de conservación

# Bases de datos

RDS

- Soporte para bases de datos relacionales
- Ofrece una capacidad media de procesamiento y almacenamiento de datos
- Nos permite gestionar la base de datos a nivel de software
- AWS se encarga de la parte infraestructura (disponibilidad, seguridad física, etc)
- AWS se encarga de la parte de S.O y aplicación (actualizar la base de datos y el sistema operativo que la soporta)
- Existen alternativas
    - Base de datos local: Trae consigo los costos relacionados con el mantenimiento
    - Base de datos en EC2: Instalar el gestor de bases de datos y habilitar el puerto correspondiente en el grupo de seguridad, recuerden tener IP publica/elástica y el internet gateway para conectar la VPC al internet. Deben configurar el gestor de BD para permitir acceso remoto por defecto está bloqueado en el gestor. **Son más económicas.**