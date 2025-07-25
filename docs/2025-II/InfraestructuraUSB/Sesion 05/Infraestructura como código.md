


## **1. Infraestructura como Código (IaC)**
**Definición ampliada:**  
La IaC permite definir y gestionar infraestructura de TI mediante archivos de configuración (código), en lugar de procesos manuales. Esto brinda **reproducibilidad**, **automatización** y **control de versiones** sobre recursos como servidores, redes y políticas de seguridad.

**Beneficios clave:**  
✔ **Consistencia:** Elimina errores humanos en despliegues.  
✔ **Escalabilidad:** Permite replicar entornos rápidamente (ej.: Dev, QA, Prod).  
✔ **Auditoría:** Cambios rastreables mediante Git.  

**Ejemplo de uso:**  
- Definir una **VPC** con **subredes públicas/privadas**, **NAT Gateway** y **grupos de seguridad** en un archivo reutilizable.  

---

## **2. Terraform (by HashiCorp)**

Herramienta de IaC **multinube** que usa el lenguaje **HCL (HashiCorp Configuration Language)**. Gestiona el **ciclo de vida completo** de recursos (crear, modificar, eliminar) mediante proveedores (*providers*).

**Características avanzadas:**  
- **Estado (State File):**  
  - Almacena el estado actual de la infraestructura en un archivo (local o remoto en S3).  
  - Permite detectar *drifts* (diferencias entre lo definido y lo desplegado).  

- **Módulos:**  
  - Plantillas reutilizables para arquitecturas comunes (ej.: módulo de EKS, módulo de RDS).  
  - Ejemplo:  
    ```hcl
    module "vpc" {
      source = "terraform-aws-modules/vpc/aws"
      cidr = "10.0.0.0/16"
    }
    ```

- **Planificación (`terraform plan`):**  
  - Simula cambios antes de aplicarlos (evita sorpresas).  

**Ejemplo de uso en AWS:**  
```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "ServidorWeb"
  }
}
```

**Ventajas vs CloudFormation:**  

| Terraform                  | CloudFormation        |
| -------------------------- | --------------------- |
| Soporte multi-nube         | Solo AWS              |
| Sintaxis más legible (HCL) | JSON/YAML más verboso |
| Comunidad activa y módulos | Menos flexibilidad    |

---
https://developer.hashicorp.com/terraform
## **3. Ansible**

Herramienta de **automatización de configuración** (no es un gestor de infraestructura como Terraform). Usa **YAML** para definir *playbooks* que configuran servidores post-despliegue.

**Casos de uso típicos:**  
- Instalar paquetes (`apt`, `yum`).  
- Configurar servicios (Nginx, Docker).  
- Aplicar parches de seguridad.  

**Ejemplo de Playbook:**  
```yaml
- name: Instalar Nginx
  hosts: webservers
  tasks:
    - name: Actualizar apt
      apt: update_cache=yes
    - name: Instalar Nginx
      apt: name=nginx state=latest
```

**Diferencias clave con Terraform:**  

| Terraform                | Ansible                       |
| ------------------------ | ----------------------------- |
| Gestiona infraestructura | Configura sistemas existentes |
| Estado centralizado      | Sin estado (idempotente)      |
| HCL                      | YAML                          |

---
## **4. CloudFormation**

CloudFormation es un servicio **nativo de AWS** que permite modelar, aprovisionar y gestionar recursos de AWS mediante **plantillas declarativas** en formato **JSON o YAML**. A diferencia de Terraform (multinube), CloudFormation está **optimizado para AWS** y ofrece integración profunda con otros servicios.  

---

### **Características Clave**  

#### **1. Plantillas Declarativas**  
- **Estructura:**  
  ```yaml
  Resources:
    MyEC2Instance:
      Type: AWS::EC2::Instance
      Properties:
        ImageId: ami-0c55b159cbfafe1f0
        InstanceType: t2.micro
  ```  
- **Ventajas:**  
  - **Sintaxis estándar** (YAML/JSON).  
  - **Documentación integrada** en AWS.  

#### **2. Gestión de Estados**  
- **Stack (Pila):** Grupo lógico de recursos que se despliegan juntos.  
- **Eventos y Rollback:** Si falla un recurso, CloudFormation revierte los cambios automáticamente.  

#### **3. Drift Detection**  
- Detecta diferencias entre la plantilla y los recursos desplegados.  

#### **4. Componentes Reutilizables**  
- **Plantillas anidadas (Nested Stacks):** Dividir infraestructura en módulos.  
- **Macros:** Personalizar plantillas con lógica custom (ej.: generar nombres dinámicos).  

---

### **Ejemplo de Uso**  
**Escenario:** Desplegar una **VPC + EC2 + Security Group**.  

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  MyVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
  MySecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: "Permitir SSH y HTTP"
      VpcId: !Ref MyVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t2.micro
      SecurityGroupIds:
        - !Ref MySecurityGroup
```

---

### **Comparación: Terraform vs. CloudFormation**  

| **Criterio**         | **Terraform**                          | **CloudFormation**                     |
|----------------------|----------------------------------------|----------------------------------------|
| **Lenguaje**         | HCL (más legible)                      | JSON/YAML (verboso)                    |
| **Multi-nube**       | Sí (AWS, Azure, GCP, etc.)            | Solo AWS                               |
| **Estado**           | Guardado en backend (ej.: S3 + DynamoDB)| Gestionado por AWS (no accesible directamente) |
| **Velocidad**        | Más rápido en despliegues complejos    | Más lento con stacks grandes           |
| **Extensibilidad**   | Módulos de comunidad (Terraform Registry)| Macros y plantillas anidadas           |
| **Costo**            | Gratis (solo costos de recursos AWS)   | Gratis (solo costos de recursos AWS)   |

---

### **Ventajas de CloudFormation**  
✔ **Integración nativa** con servicios AWS (ej.: IAM, CloudTrail).  
✔ **Soporte oficial** de AWS (actualizaciones simultáneas a nuevos servicios).  
✔ **Rollback automático** en errores.  

### **Desventajas**  
✖ **Aprendizaje complejo** en plantillas grandes (YAML/JSON verboso).  
✖ **Sin soporte para otros clouds**.  

---
### **¿Cuándo Usar CloudFormation?**  
- **Entornos 100% AWS** (sin necesidad de multi-nube).  
- **Cumplimiento empresarial** (ej.: políticas de seguridad estrictas).  
- **Automatización nativa** con CodePipeline y Service Catalog.  

**¿Necesitas un ejemplo avanzado (ej.: EKS + RDS con CloudFormation)?**

### **Tabla Comparativa: IaC en AWS**
| Herramienta       | Lenguaje | Enfoque                | Integración AWS           | Escenario Ideal          |
|-------------------|----------|------------------------|---------------------------|--------------------------|
| **Terraform**     | HCL      | Infraestructura multi-nube | Todos los servicios      | Entornos híbridos o multi-nube |
| **CloudFormation**| JSON/YAML| Infraestructura AWS nativa | Soporte nativo           | Entornos 100% AWS        |
| **Ansible**       | YAML     | Configuración y automatización | Módulos para EC2, IAM   | Post-despliegue y orquestación |

---

