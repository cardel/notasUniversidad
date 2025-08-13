# AWS Service catalog

Permite tener acceso a recursos TI aprobados realizados por terceros
Ejemplo: Imagenes de EC2 o instancias con ciertas configuiraciones

Controlar el acceso a recursos por ejemplo, a que region de AWS puedo lanzar un producto

# Amazon Macie
Proteger la información de identificación personal

# Amazon Inspector
Seguimiento de prácticas recomendadas dentro de la nube, por ejemplo, configuraciones de IAM que se tenga un servicio de doble autenticación

# Amazon GuardDuty
Detección de amenzadas en las cuentas de AWS

Aquí tienes una tabla comparativa detallada entre **AWS Service Catalog**, **Amazon Macie**, **Amazon Inspector**, y **Amazon GuardDuty**, incluyendo sus diferencias, integraciones y casos de uso específicos:

---

### **Tabla Comparativa: AWS Service Catalog vs. Amazon Macie vs. Amazon Inspector vs. Amazon GuardDuty**

| **Característica**           | **AWS Service Catalog**                                                                           | **Amazon Macie**                                                             | **Amazon Inspector**                                                                                    | **Amazon GuardDuty**                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Propósito principal**      | Gestión centralizada de productos y servicios aprobados para uso en AWS (gobernanza).             | Detección y protección de datos sensibles (PII, credenciales) en S3.         | Escaneo automatizado de vulnerabilidades en workloads (EC2, ECR, Lambda).                               | Detección de amenazas en tiempo real mediante inteligencia de amenazas y logs (VPC, DNS, CloudTrail). |
| **Casos de uso**             | - Aprovisionar stacks de CloudFormation preaprobados.<br>- Control de costos y cumplimiento.      | - Identificar datos expuestos accidentalmente.<br>- Cumplimiento GDPR/HIPAA. | - Evaluar parches faltantes en instancias EC2.<br>- Detectar configuraciones inseguras en contenedores. | - Detectar minería de criptomonedas.<br>- Alertar sobre accesos IAM anómalos.                         |
| **Tipo de datos analizados** | Plantillas de CloudFormation, productos IT.                                                       | Metadatos y contenido de objetos en S3.                                      | Configuraciones de OS, librerías, vulnerabilidades CVSS.                                                | Logs de VPC Flow, DNS, CloudTrail, Kubernetes.                                                        |
| **Integración AWS**          | CloudFormation, IAM, Organizations.                                                               | S3, EventBridge, Security Hub.                                               | EC2, ECR, Lambda, Security Hub.                                                                         | CloudTrail, VPC Flow Logs, DNS Logs, EKS Audit Logs.                                                  |
| **Automatización**           | Despliegue de productos con restricciones basadas en IAM.                                         | Alertas automatizadas (ej: via SNS) + clasificación con ML.                  | Escaneos programados o continuos + informe de hallazgos.                                                | Respuestas automatizadas con Lambda o Security Hub (ej: bloquear IP maliciosa).                       |
| **Costo**                    | Gratis (solo costo de recursos aprovisionados).                                                   | $0.10/GB de datos escaneados + $1.00/1k alertas de políticas.                | $0.15/EC2 escaneado/mes + $0.30/instancia ECR escaneada.                                                | $0.10/GB de logs analizados (primeros 30 días gratis).                                                |
| **Ejemplo específico**       | Permitir que solo equipos de DevOps desplieguen máquinas con tipos específicos (ej: `t3.medium`). | Alertar si un bucket S3 contiene números de tarjetas de crédito sin cifrar.  | Reportar una instancia EC2 con CVE-2023-1234 sin parchar.                                               | Detectar un ataque de fuerza bruta a una instancia EC2 desde una IP desconocida.                      |

---

### **Diferencias Clave**:
1. **Enfoque**:  
   - **Service Catalog**: **Gobernanza** (qué servicios pueden usarse).  
   - **Macie**: **Protección de datos** (enfoque en contenido sensible).  
   - **Inspector**: **Seguridad de workloads** (vulnerabilidades técnicas).  
   - **GuardDuty**: **Detección de amenazas** (comportamiento malicioso).  

2. **Profundidad de análisis**:  
   - Macie inspecciona **contenido** (ej: archivos en S3).  
   - Inspector analiza **configuraciones y software** (ej: versiones de librerías).  
   - GuardDuty monitorea **actividad** (ej: tráfico de red sospechoso).  

3. **Automatización de respuestas**:  
   - GuardDuty e Inspector pueden integrarse con **Lambda/Security Hub** para acciones correctivas.  
   - Service Catalog **limita** acciones (ej: evitar despliegues no autorizados).  

4. **Cobertura**:  
   - **Macie**: Solo S3.  
   - **Inspector**: EC2, ECR, Lambda.  
   - **GuardDuty**: Multi-servicio (VPC, IAM, Kubernetes).  

---

### **Escenarios Combinados**:
- **Ejemplo 1**:  
  Usar **Service Catalog** para desplegar instancias EC2 preconfiguradas → **Inspector** para escanear vulnerabilidades → **GuardDuty** para detectar ataques.  
- **Ejemplo 2**:  
  **Macie** identifica datos sensibles en S3 → **GuardDuty** alerta si un usuario IAM accede a ellos de forma anómala.  

