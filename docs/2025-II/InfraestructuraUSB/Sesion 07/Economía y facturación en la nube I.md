# 1. Aspectos básicos de precios
## Factores de costo
1. Computo: Procesamiento por hora o segundo (Linux) Variable de acuerdo al tipo de instancia: S.O, tipo de instancia o capacidad de la instancia
2. Almacenamiento GB
3. Transferencia de datos
	1. La salida (envío de AWS hacia afuera) se cobra
	2. La entrada (entrada a AWS) no tiene cargo (excepto algunos casos)
	3. Se cobra por GB (aunque algunos lo hacen TB o PB)

## Enfoque de pago de AWS

1. Pague por el uso: Creación de los servicios suele ser gratuita y se cobra es el uso de los mismos
2. Pague menos al reservar
	1. AURI: Pago anticipado obtener mayor descuento
	2. PURI: Pago parcial descuentos menores
	3. NURI: Sin pago anticipado, pocos descuentos
3. A medida que más use el costo por GB o procesamiento es menor
4. AWS se enfoca en reducir costos
5. Se tienen precios personalizados de acuerdo a las necesidades del cliente
6. Nivel Gratuito de AWS: 
	1. Antes del 15 de Julio de 2025 https://aws.amazon.com/es/free/legacy/ aplica para clientes nuevos durante 1 año.
		1. Amazon VPC
		2. Elastic Beanstalk
		3. Escalado automático
		4. AWS CloudFormation
		5. AWS Identity and AccessManagement (AWS IAM
		Los 2,3 y 4 pueden tener cargos por el uso en conjunto con otros servicios.
		
	2. Después del 15 de Julio: https://aws.amazon.com/es/free/ los clientes nuevos obtiene 200 USD de crédito. Gain \$100 USD credits at sign-up and up to \$100 USD more to earn as you explore key AWS services.
# Costo total de propiedad
- Costo de la infraestructura tradicional vs el modelo de AWS
	- Costos de equipos: nube solo pague por lo que usa
	- Infraestructura como autoservicio: nube (software)
	- Reducción del escalado vertical y enfocado al horizotal
		- Escalado vertical: Aumento de capacidad de los equipos de cómputo
		- Escalado horizontal: Aumentar el número de nodos cómputo
-  El costo total de propiedad (TCO) es la estimación
financiera que ayuda a identificar los costos directos e indirectos de un sistema. Comparar el costo de la infraestructura frente a AWS
	- Costos de servidores
	- Costos de almacenamiento
	- Costos de red
	- Costos de mano de obra de TI
- Calculadora de AWS https://calculator.aws/#/estimate
![](attachments/4b4d76f6-ddd1-41d0-9cac-2a9c8ebfe2d7.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

## 3. AWS Organizations
Permite gestionar las AWS a través de:

1. Unidades Organizativas (OU) que agrual usuarios
2. Cuentas de AWS

Seguridad:
1. Control de acceso con AWS Identity
2. Politica de IAM: gestionar acceso a los servicios para usuarios, grupos o roles
3. Politicas de control de servicios: Permite otorgar o denegar acceso a los servicios a cuentas o Unidades Organizativas

### Política de IAM: 

Permite gestionar las acciones que se pueden realizar en una unidad organizativa y relativo a usuarios, roles o grupos de IAM 

#### Política basada de identidad

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::mi-bucket-s3/*"
    },
    {
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::mi-bucket-s3/privado/*",
      "Condition": {
        "StringNotLike": {
          "aws:username": "administrador"
        }
      }
    }
  ]
}
```
En esta politica cualquier usuario que no sea administrador puede obtener y colocar objetos en un s3, pero no puede borrarlo. Esta política se aplica al usuario que no sea administrador.
#### Políticas basadas en recursos


```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/UsuarioEjemplo"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mi-bucket-s3/*"
    }
  ]
}
```
En este caso, vamos a permitir que alguien con el rol (arn) pueda obtener un objeto. Esta se aplica al recurso (s3) pero no directamente usuario.


### Políticas de control de servicios

Limites máximos de permisos que puede tener cualquier entidad que sea usuario o rol. No concede permisos si no que limita lo que se puede hacer y sobrescribe las políticas de IAM.  De entrada estas políticas son de negación de todo (esquema de permiso mínimo) usted activa lo que requiere

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/nombre-de-usuario"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::mi-bucket/*"
    },
    {
      "Effect": "Deny",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/nombre-de-usuario"
      },
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::mi-bucket/archivos-protegidos/*"
    }
  ]
}
```

Aplica el efecto de permitir que el usuario (nombre de usuario) pueda obtener y poner información en un bucket, pero le niega borrarlo.


### Resumen de Contenidos sobre AWS

#### Tabla Comparativa: Modelos de Costos y Gestión en AWS

| **Categoría**               | **Detalles Clave**                                                                 | **Ejemplos/Notas**                                                                 |
|-----------------------------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| **Factores de Costo**       | - Cómputo (por hora/segundo)<br>- Almacenamiento (GB)<br>- Transferencia de datos (solo salida) | Linux tiene costos por segundo. Entrada de datos generalmente gratuita.           |
| **Modelos de Pago**         | - Pago por uso<br>- Reservas (AURI, PURI, NURI)<br>- Descuentos por volumen<br>- Nivel Gratuito | AURI ofrece mayores descuentos con pago anticipado. Nivel gratuito con límites.   |
| **Costo Total de Propiedad (TCO)** | - Comparación infraestructura tradicional vs. AWS<br>- Incluye servidores, almacenamiento, red y mano de obra | Calculadora AWS disponible para estimaciones.                                      |
| **AWS Organizations**       | - Unidades Organizativas (OU)<br>- Cuentas AWS<br>- Políticas de IAM y SCP         | Permite gestión centralizada de múltiples cuentas.                                |
| **Políticas de IAM**        | - Basadas en identidad (usuarios/grupos)<br>- Basadas en recursos (ej. S3)         | Ejemplo: Denegar eliminación en S3 a no administradores.                         |
| **Políticas de Control de Servicios (SCP)** | - Limitan permisos máximos<br>- Sobrescriben políticas de IAM                     | Esquema de permiso mínimo; solo permite lo explícitamente autorizado.            |

#### Elementos Adicionales Importantes:
1. **Nivel Gratuito de AWS**: 
   - Cambios después del 15 de julio de 2025: nuevos clientes reciben \$200 USD en créditos.
   - Servicios incluidos previamente (hasta julio 2025): VPC, Elastic Beanstalk, IAM, etc.

2. **Escalado en AWS**:
   - **Vertical**: Aumentar capacidad de instancias (ej. CPU/RAM).
   - **Horizontal**: Añadir más instancias (ej. Auto Scaling).

3. **Ejemplos de Políticas**:
   - **IAM**: Restricción por nombre de usuario.
   - **SCP**: Bloqueo de acciones específicas (ej. `s3:DeleteObject`).
