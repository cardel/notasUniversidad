# Protección de datos en reposo
Son datos que están almacenados
- S3
- EBS Elastic block service
- EFS
- Tablas en RDS
Esta información se puede cifrar usando claves secretas en **AWS KMS**, las cuales pueden ser generadas por AWS o bien proporcionadas por el usuario

# Protección de datos en tránsito
Para esto usamos certificados TLS o SSL
El servicios de **AWS Certificate Manager** permite generar y gestionar estas claves
Esto es útil para servicios como HTTPS o sFTP
Puede usarse dentro de la nube de AWS o n esquemas hibridos

# Protección en S3
- Por defecto son privados y sin acceso público
- Es necesario gestionar los permisos
- Usar el principio de privilegio mínimo

Aquí tienes una tabla comparativa detallada entre **AWS KMS (Key Management Service)** y **AWS Certificate Manager (ACM)**, incluyendo casos de uso y diferencias clave:

| **Característica**       | **AWS KMS**                                                                                                 | **AWS Certificate Manager (ACM)**                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Propósito principal**  | Gestión de claves de cifrado (simétricas y asimétricas) para proteger datos.                                | Gestión y despliegue de certificados SSL/TLS para servicios AWS.                                     |
| **Casos de uso típicos** | - Cifrado de datos en S3, EBS, RDS, etc.<br>- Firmas digitales.<br>- Cifrado de secrets en Secrets Manager. | - HTTPS en CloudFront/ALB.<br>- Seguridad en APIs (API Gateway).<br>- Autenticación de dominios web. |
| **Tipo de claves**       | Claves maestras (CMKs), claves de datos (simétricas) y pares de claves (RSA/ECC).                           | Certificados X.509 (SSL/TLS) públicos o privados.                                                    |
| **Integración AWS**      | Amplia integración: S3, EBS, Lambda, RDS, Redshift, etc.                                                    | Servicios web: CloudFront, ALB, API Gateway, EC2 (via ENI).                                          |
| **Automatización**       | Rotación automática de claves (opcional).                                                                   | Renovación automática de certificados (gratis).                                                      |
| **Costo**                | Pago por uso de claves ($0.03/CMK/mes) y operaciones (ej: $0.03/10k encryptions).                           | Certificados públicos: gratis.<br>Certificados privados: $400/mes + costos de CA externa (opcional). |
| **Personalización**      | - Políticas de acceso granulares (IAM).<br>- Claves importadas (trae tu propia clave).                      | - Certificados wildcard (*.dominio.com).<br>- Validación DNS o por email.                            |
| **Ejemplo específico**   | Cifrar un bucket S3 con una CMK y auditar su uso via CloudTrail.                                            | Desplegar un certificado SSL en un ALB para una aplicación web (ej: `app.midominio.com`).            |

### **Diferencias clave**:
1. **Enfoque**:  
   - **KMS** es para **cifrado general** (datos en reposo/tránsito).  
   - **ACM** es exclusivo para **certificados SSL/TLS** (protección de tráfico web).  

2. **Certificados vs. Claves**:  
   - **ACM** usa certificados públicos/privados (autenticación).  
   - **KMS** usa claves criptográficas (confidencialidad e integridad).  

3. **Automatización**:  
   - ACM renueva certificados automáticamente; KMS requiere configuración para rotar claves.  

4. **Costo**:  
   - ACM es gratuito para certificados públicos; KMS tiene costos por operaciones.  

### **Escenarios combinados**:  
Usar **KMS + ACM** juntos:  
- **Ejemplo**: Cifrar tráfico HTTPS (ACM) + cifrar datos almacenados en S3 con una CMK (KMS).  

# Auditoria

## AWS Config

Permite auditar las configuraciones de los diferentes recursos de AWS, esto para que un tercero pueda evaluar si sigue ciertas normas tipo ISO o regulaciones locales

Se pueden evaluar las configuraciones registradas con las deseadas

Permite hacer rastreo de configuraciones


## AWS Artifact

Es una herramienta relacionada con la conformidad, si se sigue una norma o no. Estos son los acuerdos de conformidad (seguimiento de políticas de seguridad, o políticas del país) que se registran en esta herramienta.

- Permite evaluar las certificaciones tipo ISO de AWS
- Permite tener informes sobre estos acuerdos.
Aquí tienes una tabla comparativa detallada entre **AWS Artifact** y **AWS Config**, incluyendo sus diferencias, integraciones y casos de uso específicos:

| **Característica**       | **AWS Artifact**                                                                             | **AWS Config**                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Propósito principal**  | Centraliza **documentación de cumplimiento** (reportes, certificaciones, acuerdos).          | **Auditoría y evaluación de configuración** de recursos AWS en tiempo real.                                                 |
| **Casos de uso típicos** | - Cumplir requisitos regulatorios (SOC, ISO, PCI DSS).<br>- Responder a auditorías externas. | - Detectar cambios no autorizados en recursos.<br>- Evaluar conformidad con reglas guardadas (ej: "S3 sin acceso público"). |
| **Tipo de datos**        | Documentos estáticos (PDF, reports) emitidos por AWS.                                        | Datos dinámicos: historial de cambios, estado actual de recursos.                                                           |
| **Integración AWS**      | Sin integración directa con otros servicios (es un repositorio).                             | Se integra con CloudTrail, Lambda, SNS, Security Hub para automatizar respuestas.                                           |
| **Automatización**       | Descarga manual de documentos.                                                               | - Alertas con SNS.<br>- Corrección automática mediante Lambda (opcional).                                                   |
| **Costo**                | Gratuito.                                                                                    | Pago por recursos monitoreados + almacenamiento de historial.                                                               |
| **Personalización**      | No aplicable (documentación pregenerada por AWS).                                            | - Reglas personalizadas (AWS Config Rules).<br>- Paquetes de reglas gestionadas.                                            |
| **Ejemplo específico**   | Obtener el reporte SOC 2 para demostrar cumplimiento a un cliente.                           | Recibir una alerta cuando un bucket S3 cambia su política a "público".                                                      |

### **Diferencias clave**:
1. **Enfoque**:  
   - **Artifact** es **pasivo**: Proporciona documentación preexistente.  
   - **Config** es **activo**: Monitorea, evalúa y reacciona a cambios en tu entorno AWS.  

2. **Temporalidad**:  
   - Artifact ofrece documentos estáticos (ej: certificaciones anuales).  
   - Config proporciona datos en tiempo real y históricos.  

3. **Automatización**:  
   - Config permite automatizar respuestas (ej: revertir cambios riesgosos). Artifact no.  

4. **Cumplimiento vs. Seguridad**:  
   - Artifact ayuda a **demostrar** cumplimiento.  
   - Config ayuda a **implementar** y **mantener** cumplimiento.  

### **Escenarios combinados**:  
Usar **Artifact + Config** juntos:  
- **Ejemplo**: Descargar el reporte PCI DSS desde Artifact + Usar Config para asegurar que todos los recursos cumplen con las reglas PCI (ej: cifrado en RDS).  



