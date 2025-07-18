# Definiciones

## Recursos
1. Instalar Azure cli https://learn.microsoft.com/es-es/cli/azure/install-azure-cli?view=azure-cli-latest
2. Instalar AWS CLI https://aws.amazon.com/cli/
3. Terraform https://developer.hashicorp.com/terraform 
4. (Windows) WSL https://learn.microsoft.com/es-es/windows/wsl/install Powershell.
## Funciones como servicio

FaaS es un modelo de serverless, no vamos a montar infraestructura, es diferente que PaaS (según algunos autores) ya que no vamos desarrollar código de forma arbitraria, vamos a utilizar un SDK que nos brinda el mismo proveedor. Es orientado a eventos y acciones simples: Retornar una respuesta, montar un EC2, operar con un archivo en un bucket, agregar un registro a una base de datos. El enfoque es de triggers, ante un evento ejecutar una acción definida.

### ¿Cómo se diferencia de otros modelos?

| Modelo     | Gestiona el usuario | Escala automáticamente | Paga por uso                       |
| ---------- | ------------------- | ---------------------- | ---------------------------------- |
| IaaS (VMs) | Sí                  | No                     | No                                 |
| PaaS       | Parcialmente        | Sí                     | Parcialmente                       |
| **FaaS**   | **No**              | **Sí**                 | **Sí** Depende de la capa gratuita |

## Infraestructura como código IAC
