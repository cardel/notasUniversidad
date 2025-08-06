# Definiciones
El modelo nos indica que hay unas responsabilidades que son de AWS y otras que son del cliente
- AWS:
	- Relativos a los data centers (seguridad, calidad de la información, calidad de redes, etc)
	- Software de la consola de administración o CLI
	- Seguridad del API
	- Aislamiento de datos entre clientes de AWS
	- Aislamiento de instancias
- Cliente:
	- Sus datos
	- Administración dentro de instancias de EC2
	- Configuración de VPC y subredes
	- Configuración de grupos de seguridad, politicas, ACL de red
	- Uso de IAM (usuarios, politicas, politicas de servicio, roles, autenticación)
	- Protección de los datos acceso a AWS
# De acuerdo al modelo

- IAAS: El cliente es responsable de lo que sucede dentro de los recursos de computación (EC2), AWS es responsable de la infraestructura de virtualización
- PAAS: Cliente es responsable del código o de los datos. AWS es responsable del software, por ejemplo parches de seguridad en las instancias sobre las cuales corren los servicios
- SAAS: AWS es responsable del software en su totalidad, Cliente es responsable solo por su datos.
Tener en cuenta en general que el modelo de responsabilidad varía de acuerdo al tipo de servicio que se esté utilizando

# Ejemplos

## Ejemplo 1!

![](attachments/Pasted%20image%2020250805200921.png)

| Componente/Acción                                  | Responsable                                    |
| -------------------------------------------------- | ---------------------------------------------- |
| Infraestructura global de AWS                      | AWS                                            |
| Seguridad física del centro de datos               | AWS                                            |
| Infraestructura de virtualización                  | AWS                                            |
| Actualizaciones/parches en sistema operativo (EC2) | Cliente                                        |
| Configuración de grupos de seguridad (EC2)         | Cliente                                        |
| Configuración de aplicaciones en instancia EC2     | Cliente                                        |
| Instancia Oracle en EC2                            | Cliente                                        |
| Actualizaciones/parches de Oracle en EC2           | Cliente                                        |
| Actualizaciones/parches de Oracle en RDS           | AWS                                            |
| Configuración de acceso a buckets S3               | Cliente                                        |
| Gestión de Amazon S3                               | Cliente (configuración), AWS (infraestructura) |
| Virtual Private Cloud (VPC)                        | Cliente (configuración), AWS (infraestructura) |
### Explicación de responsabilidades:
1. **AWS es responsable de**:
   - Infraestructura física (centros de datos)
   - Virtualización subyacente
   - Servicios gestionados (RDS, infraestructura base)
   - Disponibilidad global

2. **El cliente es responsable de**:
   - Configuraciones de seguridad (grupos, IAM)
   - Mantenimiento de SO en EC2
   - Aplicaciones y middleware
   - Configuración de servicios (VPC, S3)

## Ejemplo 2

![](attachments/Pasted%20image%2020250805200934.png)

| Componente/Acción                          | Responsable       | Explicación |
|--------------------------------------------|-------------------|-------------|
| **Claves de Secure Shell (SSH)**           | Cliente           | El cliente es responsable de generar, rotar y proteger sus claves SSH |
| **Consola de administración de AWS**       |                   |             |
| - Prevenir hackeo de la consola            | Cliente           | El cliente debe configurar MFA, políticas de IAM y monitoreo |
| **Interfaz de línea de comandos (AWS CLI)**| Cliente           | Seguridad de credenciales y acceso |
| **Gateway de Internet**                    | Cliente           | Configuración y gestión |
| **Virtual Private Cloud (VPC)**            |                   |             |
| - Configurar la VPC                        | Cliente           | Diseño de red, subredes, tablas de ruteo |
| - Configurar subredes                      | Cliente           |             |
| - Aislamiento de red entre clientes        | AWS               | Infraestructura física y virtual |
| **Servidor web en EC2**                    |                   |             |
| - Protección contra interrupciones de red  | AWS               | Disponibilidad de la infraestructura |
| - Latencia red (EC2-S3)                    | AWS               | Backbone de red global |
| **Bucket S3**                              |                   |             |
| - Configuración de acceso                  | Cliente           | Políticas IAM y de bucket |
| **Autenticación Multifactor (MFA)**        | Cliente           | Implementación y gestión |

### Reglas clave:
1. **AWS provee y asegura**:
   - Infraestructura física
   - Aislamiento entre clientes
   - Disponibilidad de red global
   - Hardware y virtualización

2. **Cliente configura y gestiona**:
   - Accesos y credenciales
   - Configuración de red (VPC, subredes)
   - Políticas de seguridad (MFA, IAM)
   - Protección de datos (encriptación, claves)




