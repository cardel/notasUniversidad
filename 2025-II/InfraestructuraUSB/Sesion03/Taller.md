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

## 3. Laboratorio en AWS: Lambda

### 3.1 Crear una función Lambda en la consola

1. Ir a consola de AWS en el Sandbox enviroment
2. Navegar a **Lambda > Crear función**
3. Seleccionar "Autor desde cero"
   - Nombre: `helloLambda`
   - Runtime: Python 3.12 (u otro)
4. Crear función

### 3.2 Código de ejemplo (Python)

```python
def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': '¡Hola desde AWS Lambda!'
    }
```
### 3.3 Probar la función

- En la pestaña “Probar”, crear un evento de prueba simple
    
- Ejecutar y observar la salida en consola
    

### 3.4 Invocar vía API Gateway (opcional)

1. Crear un **API REST** en Amazon API Gateway
    
2. Crear un recurso y método GET
    
3. Integrar con Lambda
    
4. Desplegar API y obtener URL pública
    

---

## 4. Laboratorio en Azure: Functions

### 4.1 Crear función HTTP en Azure Portal

1. Ir a [Azure Portal](https://portal.azure.com/)
    
2. Ir a **Funciones > Crear**
    
3. Configurar:
    
    - Nombre: `helloAzure`
        
    - Runtime: Python / Node / C#
        
    - Tipo de desencadenador: **HTTP Trigger**
        
4. Crear y desplegar
    

### 4.2 Código de ejemplo (Python)

python

CopyEdit

`import logging import azure.functions as func  def main(req: func.HttpRequest) -> func.HttpResponse:     return func.HttpResponse("¡Hola desde Azure Functions!", status_code=200)`

### 4.3 Probar la función

- Copiar la URL proporcionada en la pestaña "Código + Prueba"
    
- Pegar en el navegador o usar `curl` para invocarla