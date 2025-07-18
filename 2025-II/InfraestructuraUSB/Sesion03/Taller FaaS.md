# FaaS (Function as a Service) en AWS y Azure

## 1. ¿Qué es FaaS?

### Definición

**Function as a Service (FaaS)** es un modelo de computación sin servidor que permite ejecutar funciones (bloques de código) en respuesta a eventos, sin gestionar servidores o infraestructura.

### Características Clave

- Escala automática por demanda
- Pago por ejecución (duración y cantidad)
- Sin mantenimiento de servidores
- Integración con eventos (HTTP, colas, cron, etc.)

---

## 2. Servicios FaaS por Proveedor

| Plataforma | Servicio FaaS | Lenguajes soportados | Activadores |
|------------|----------------|-----------------------|-------------|
| AWS        | AWS Lambda     | Python, Node.js, Java, Go, etc. | API Gateway, S3, SNS, DynamoDB, EventBridge |
| Azure      | Azure Functions| Python, C#, JavaScript, Java, PowerShell | HTTP, Timer, Blob, Event Hub, Cosmos DB |

---

## 3. Ejercicio Práctico: AWS Lambda  
  
### 3.1 Implementación de función básica  
1. Acceder a la consola de AWS en el entorno educativo  
2. Navegar a **Servicios > Lambda > Crear función**  
3. Configurar parámetros básicos:  
   - Plantilla: "Autor desde cero"  
   - Nombre: `funcionSaludo`  
   - Entorno de ejecución: Python 3.12  
4. Confirmar creación  
  
### 3.2 Desarrollo de código de ejemplo  
```python  
def lambda_handler(event, context):  
    # Implementar lógica de respuesta básica  
    return {  
        'statusCode': 200,  
        'body': 'Ejecución exitosa desde Lambda'  
    }  
```  
En este ejemplo vamos a consultar los detalles de la cuenta de usuario
```python
import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)
client = boto3.client('lambda')

  

def lambda_handler(event, context):

	# TODO implement
	
	logger.info("Capturando evento en AWS Lambda")
	
	response = client.get_account_settings()
	
	logger.info("Respuesta de get_account_settings: %s", response)	
	return {	
		'statusCode': 200,	
		'body': json.dumps(response)
	}
```

### Pequeño ejercicio 1

Crear un nueva función lambda

- Crear un bucket en s3 
- Subir un archivo local (o creado) a el


```python
import json
import logging
import boto3

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Obtener el cliente de S3
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    """Manejador de Lambda para crear bucket y subir archivo."""
    logger.info("Received event: %s", json.dumps(event))
    
    bucket_name = 'usb20252subirarchivosalvaje'
    file_path = 'cuento.txt'
    
    try:
        # Verificar si el bucket existe
        if bucket_name in [b['Name'] for b in s3_client.list_buckets()['Buckets']]:
            logger.info(f"Bucket {bucket_name} ya existe.")
        else:
            logger.info(f"Creando bucket {bucket_name}.")
            s3_client.create_bucket(Bucket=bucket_name)
        
        # Subir archivo al bucket
        s3_client.upload_file(file_path, bucket_name, 'cuento.txt')
        logger.info(f"Archivo {file_path} subido al bucket {bucket_name}.")
        
    except Exception as e:
        logger.error(f"Error en bucket {bucket_name}: {str(e)}")
        raise  # Re-lanza la excepción para que AWS Lambda la registre
    
    return {
        'statusCode': 200,
        'body': json.dumps('¡Archivo subido exitosamente!')
    }
```

### Pequeño ejercicio 2

Crear una nueva función lambda

Revisar https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-examples.html

- Capturar evento GET y retorna una información
- Capturar evento POST y retornar una información
- Rutas /hora da la hora actual
- Rutas /saludo que me saluda

```bash
curl -X GET https://ejemplo.com/api/recurso
curl -X POST https://ejemplo.com/api/recurso
```

```python
import json
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Received event: %s", json.dumps(event))
    
    method = event["requestContext"]["http"]["method"]
    path = event["requestContext"]["http"]["path"]
    logger.info(f"Received request: {method} {path}")

    if path == '/saludo' and method == 'GET':
        return {
            'statusCode': 200,
            'body': json.dumps('¡Hola te saludo desde get!')
        }
    elif path == '/saludo' and method == 'POST':
        return {
            'statusCode': 200,
            'body': json.dumps('¡Hola te saludo desde post!')
        }
    elif path == '/hora' and method == 'GET':
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return {
            'statusCode': 200,
            'body': json.dumps(f'La hora actual en GET es: {current_time}')
        }
    elif path == '/hora' and method == 'POST':
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return {
            'statusCode': 200,
            'body': json.dumps(f'La hora actual en POST es: {current_time}')
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps('Otra ruta de la función Lambda')
    }
```
### 3.3 Validación funcional  
- Utilizar la pestaña "Pruebas" para generar evento de prueba estándar  
- Ejecutar y verificar registros en CloudWatch Logs  
- Observar métricas de ejecución (duración, memoria)  
  
### 3.4 Integración con API Gateway (Avanzado)  
1. Crear nueva API REST en servicio API Gateway  
2. Establecer método GET en recurso raíz  
3. Configurar integración con función Lambda existente  
4. Desplegar API y validar endpoint público  
  
---  
  
## 4. Ejercicio Práctico: Azure Functions  
  
### 4.1 Configuración inicial  

Guía Visual Studio Code https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-python

Guía desde la consola de Administración
1. Acceder a [Azure Portal]([https://portal.azure.com/](https://portal.azure.com/))  
2. Crear nuevo recurso en **Funciones > Crear**  
3. Especificar parámetros:  
   - Tipo de función: "Desencadenador HTTP"  
   - Stack de ejecución: Python  
   - Plan de hospedaje: Consumo (sin servidor)  

### Creación y configuración de las funciones

![](guia.pdf)  
### 4.2 Implementación de función HTTP  
```python  
import azure.functions as func  
  
def main(req: func.HttpRequest) -> func.HttpResponse:  
    # Implementar respuesta básica  
    return func.HttpResponse(  
        "Función ejecutada correctamente",  
        status_code=200  
    )  
```