
# AWS Organizations
Consolida la administración de cuentas de AWS a través unidades organizativas (OU)
Se integra con IAM a través de las políticas de control de servicios (SCP) el usuario percibe la intersección de los permisos (política dominante es negación)

La SCP indican los permisos máximos que se tienen sobre los recursos, permite aplicar directivas sobre grupos de cuentas en las unidades organizativas

Aquí tienes un ejemplo de cómo integrar **AWS IAM (Identity and Access Management)** y **SCP (Service Control Policies)** en **AWS Organizations** para controlar el acceso a recursos en una estructura multi-cuenta:

---
## Ejemplo
### **Escenario**:  
Una empresa tiene una organización en AWS con:  
- **Cuenta maestra (Management Account)**  
- **Cuentas miembro** (ej: `Dev`, `Prod`, `Logs`)  

**Objetivo**:  
- Restringir que las cuentas `Dev` y `Prod` no puedan eliminar registros de CloudTrail.  
- Permitir solo a un grupo de IAM en la cuenta `Logs` administrar buckets S3 de logs.  

---

### **Paso 1: Crear una SCP (Service Control Policy)**  
1. Ve a **AWS Organizations** → **Policies** → **Create policy**.  
2. Usa el siguiente JSON para denegar la acción `DeleteTrail` en cuentas específicas:  

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyCloudTrailDeletion",
      "Effect": "Deny",
      "Action": "cloudtrail:DeleteTrail",
      "Resource": "*"
    }
  ]
}
```
3. **Adjunta la SCP** a las OU (Unidades Organizativas) de `Dev` y `Prod`.  

---

### **Paso 2: Configurar IAM en la cuenta `Logs`**  
1. Crea un **IAM Group** llamado `S3LogsAdmins` con permisos para administrar solo buckets de logs:  

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::logs-company-*"
    }
  ]
}
```
2. Asigna usuarios a este grupo según sea necesario.  

---

### **Resultado**:  
- **SCP**: Bloquea acciones peligrosas (como eliminar CloudTrail) en cuentas no autorizadas.  
- **IAM**: Delega permisos granulares dentro de una cuenta específica (`Logs`).  

---

### **Notas clave**:  
- Las **SCP son deny-by-default**: Solo afectan si hay una política explícita de denegación.  
- **IAM se intersecta con SCP**: Si un usuario tiene un permiso explícito en IAM, la SCP lo anulará con una denegación explícita.  

# AWS KMS
Key management service

- Permite crear y gestionar claves de cifrado
- Permite controlar el uso de cifrado en los servicios de AWS
- La generación de claves sigue los estándares de FIPS


# Amazon cognito

Es una interfaz de control de acceso, permite integrar third-party logins como Google, Facebook, etc.
Así mismo permite integrar con Microsoft Active Directory a través del protocolo SAML 2.0

# AWS Shield

- Ofrece una protección para ataques DDoS (Denegación de servicio)
- Es gratuito en su servicio standard pero es pago en un service advanced.

# AWS WAF

Firewall para aplicaciones Web, nos permite gestionar la seguridad en aplicaciones Web. Por ejemplo, el uso de certificados SSL válidos en conexiones HTTPS, o un certificado de seguridad con el protocolo SFTP

Aquí tienes una tabla comparativa detallada entre **AWS WAF**, **AWS Shield**, **AWS Firewall Manager** y **AWS Network Firewall**, incluyendo casos de uso específicos:

| **Característica**     | **AWS WAF**                                                             | **AWS Shield**                                                                 | **AWS Firewall Manager**                                                                        | **AWS Network Firewall**                                                                           |
| ---------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Tipo de protección** | Protección a nivel de aplicación (capa 7) contra tráfico web malicioso. | Protección contra DDoS (capa 3/4 y capa 7).                                    | Gestión centralizada de reglas de firewall (WAF, Security Groups, etc.).                        | Firewall de red stateful (capa 3-7) con inspección profunda de paquetes.                           |
| **Casos de uso**       | - Bloquear SQLi, XSS, bots maliciosos.<br>- Rate limiting para APIs.    | - Mitigación automática de ataques DDoS.<br>- Protección para ELB, CloudFront. | - Aplicar políticas de seguridad consistentes en múltiples cuentas/regiones.<br>- Cumplimiento. | - Filtrado de tráfico VPC.<br>- Inspección de tráfico saliente/entrante con reglas personalizadas. |
| **Integración**        | CloudFront, ALB, API Gateway, AppSync.                                  | CloudFront, Route 53, ALB, EC2.                                                | WAF, Security Groups, AWS Shield Advanced, Network Firewall.                                    | VPC, Gateway Load Balancer (GWLB).                                                                 |
| **Automatización**     | Reglas personalizadas o administradas (AWS Managed Rules).              | Mitigación automática (Standard) + soporte 24/7 (Advanced).                    | Automatización de políticas en toda la organización.                                            | Reglas basadas en Suricata o propias.                                                              |
| **Escalabilidad**      | Escala automática con tráfico web.                                      | Escala automática frente a DDoS.                                               | Centraliza la gestión para miles de recursos.                                                   | Escala horizontal con GWLB.                                                                        |
| **Costo**              | Pago por reglas y solicitudes procesadas.                               | Shield Standard: gratuito.<br>Shield Advanced: pago + costos por mitigación.   | Gratis (solo pago por servicios gestionados, como WAF).                                         | Pago por horas de firewall y procesamiento de tráfico.                                             |
| **Ejemplo específico** | Bloquear IPs de países específicos en un ALB.                           | Proteger un sitio de eCommerce durante un ataque DDoS de gran escala.          | Asegurar que todos los ALBs en una organización tengan WAF con reglas anti-SQLi.                | Monitorear y bloquear tráfico malicioso entre VPCs en una arquitectura híbrida.                    |

### Observaciones clave:
- **AWS WAF** es ideal para aplicaciones web (HTTP/HTTPS).  
- **AWS Shield** se enfoca en resiliencia ante DDoS (Standard cubre lo básico; Advanced incluye soporte y protección avanzada).  
- **Firewall Manager** es un "orquestador" para aplicar políticas de seguridad de manera centralizada.  
- **Network Firewall** es más granular (nivel de red) y útil para arquitecturas complejas con inspección profunda.  


