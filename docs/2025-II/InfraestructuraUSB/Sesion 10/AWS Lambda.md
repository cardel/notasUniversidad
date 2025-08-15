# Introducción
Es una opción de cómputo serverless (sin servidor)
- Cargue el código
- Configure la función (disparadores, roles, etc)
- Pague por el tiempo de ejecución

Tiene escalado automático y tiene tolerancia fallas.

# Fuentes de eventos

- Recursos de AWS
	- Amazon S3
	- DynamoDB
	- SNS o SQS
	- API Gateway
	- EC2
	- etc ...
- Externos
	- Peticiones HTTP

Las funciones lambda se pueden supervisar a través de Amazon Cloudwatch

Por ejemplo podemos tener funciones

1. Función para detener instancias de EC2 en un horario determinado (un entorno de pruebas por fuera radel horario laboral)
2. Función para arrancar instancias de EC2 en un horario de laboral
3. Procesar datos de un bucker S3 y almacenarlos en otro

En general lambda tiene cuotas de acuerdo a la región