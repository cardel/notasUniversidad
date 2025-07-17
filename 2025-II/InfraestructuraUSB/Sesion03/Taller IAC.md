
## Introducción  
Terraform es una herramienta de Infraestructura como Código (IaC) que permite definir, gestionar y versionar infraestructura en múltiples proveedores de nube mediante un enfoque declarativo. Este taller aborda los fundamentos para implementar recursos básicos en AWS y Azure.

# Estructura de Proyecto  
La organización recomendada para gestionar múltiples proveedores es:  
```  
mi-proyecto/  
├── aws/  
│   ├── [main.tf](http://main.tf)  
│   ├── [variables.tf](http://variables.tf)  
│   └── [outputs.tf](http://outputs.tf)  
└── azure/  
    ├── [main.tf](http://main.tf)  
    ├── [variables.tf](http://variables.tf)  
    └── [outputs.tf](http://outputs.tf)  
```  
  
## Parte 1: Implementación en AWS  
### Configuración Inicial  
Instalación de Terraform:  
```bash  
# Descargar binario y agregar al PATH  
unzip terraform_*.zip  
sudo mv terraform /usr/local/bin/  
terraform version  
```  
  
Configuración de AWS CLI:  
```bash  
aws configure  
# Ingresar credenciales, región y formato de salida  
```  
  
### Definición de Proveedor  
Archivo `[main.tf](http://main.tf)`:  
```hcl  
terraform {  
  required_providers {  
    aws = {  
      source  = "hashicorp/aws"  
      version = "~> 4.0"  
    }  
  }  
}  
  
provider "aws" {  
  region = var.region  
}  
```  
  
### Creación de Instancia EC2  
Archivo `[variables.tf](http://variables.tf)`:  
```hcl  
variable "region" {  
  description = "Región de despliegue"  
  default     = "us-east-1"  
}  
  
variable "tipo_instancia" {  
  description = "Tipo de instancia EC2"  
  default     = "t3.micro"  
}  
```  
  
Archivo `[main.tf](http://main.tf)` (extensión):  
```hcl  
resource "aws_instance" "servidor_web" {  
  ami           = "ami-0c94855ba95c71c99"  # AMI de Ubuntu 22.04 en us-east-1  
  instance_type = var.tipo_instancia  
  tags = {  
    Nombre = "ServidorTerraform"  
  }  
}  
```  
  
### Ejecución de Comandos  
```bash  
cd aws  
terraform init  
terraform plan  
terraform apply  # Confirmar con 'yes'  
```  
  
### Limpieza de Recursos  
```bash  
terraform destroy  # Confirmar con 'yes'  
```  
  
## Parte 2: Implementación en Azure  
### Configuración Inicial  
Autenticación en Azure:  
```bash  
az login  
```  
  
### Definición de Proveedor  
Archivo `[main.tf](http://main.tf)`:  
```hcl  
terraform {  
  required_providers {  
    azurerm = {  
      source  = "hashicorp/azurerm"  
      version = "~> 3.0"  
    }  
  }  
}  
  
provider "azurerm" {  
  features {}  
}  
```  
  
### Creación de Máquina Virtual  
Archivo `[variables.tf](http://variables.tf)`:  
```hcl  
variable "ubicacion" {  
  description = "Región de Azure"  
  default     = "East US"  
}  
  
variable "tamano_vm" {  
  description = "Tamaño de la máquina virtual"  
  default     = "Standard_B1s"  
}  
```  
  
Archivo `[main.tf](http://main.tf)` (extracto):  
```hcl  
resource "azurerm_resource_group" "grupo_recursos" {  
  name     = "rg-demo-terraform"  
  location = var.ubicacion  
}  
  
resource "azurerm_virtual_network" "red_virtual" {  
  name                = "vnet-demo"  
  address_space       = ["[10.0.0.0/16](http://10.0.0.0/16)"]  
  resource_group_name = [azurerm_resource_group.grupo_recursos.name](http://azurerm_resource_group.grupo_recursos.name)  
  location            = azurerm_resource_group.grupo_recursos.location  
}  
# ... (continuación con subnet, interfaz de red y VM)  
```  
  
### Ejecución de Comandos  
```bash  
cd azure  
terraform init  
terraform plan  
terraform apply  # Confirmar con 'yes'  
```  
  
### Limpieza de Recursos  
```bash  
terraform destroy  # Confirmar con 'yes'  
```

## Ejercicios Propuestos  
1. Modificar el tipo de instancia en AWS mediante variables sin alterar código principal.  
2. Implementar un grupo de seguridad básico para la instancia EC2.  
3. En Azure, agregar una dirección IP pública a la máquina virtual.  
4. Explorar el uso de `terraform fmt` para formateo automático de código.