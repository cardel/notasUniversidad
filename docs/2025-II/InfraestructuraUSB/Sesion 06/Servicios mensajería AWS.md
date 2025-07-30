# Servicios de Mensajería en AWS

AWS proporciona múltiples servicios de mensajería que permiten a las aplicaciones comunicarse de forma **asíncrona**, **fiable**, **escalable** y **segura**. Estos servicios permiten desacoplar componentes, manejar cargas variables y garantizar la entrega de mensajes.

---

## 1. Amazon Simple Queue Service (SQS)

### ¿Qué es?
Amazon SQS es un servicio de colas de mensajes completamente gestionado que permite enviar, almacenar y recibir mensajes entre componentes de software sin necesidad de que estén conectados al mismo tiempo.

### Tipos
- **SQS Standard:** Alta escalabilidad, orden no garantizado, entrega al menos una vez.
- **SQS FIFO:** Orden estricto, entrega exactamente una vez, ideal para procesamiento secuencial.

### Casos de uso
- **Desacoplar microservicios en una arquitectura distribuida.**
- **Procesar pedidos de e-commerce en segundo plano.**
- **Control de trabajos por lotes (batch jobs).**
- **Buffer entre sistemas que producen y consumen a velocidades distintas.**

---

## 2. Amazon Simple Notification Service (SNS)

### ¿Qué es?
Amazon SNS es un servicio de **publicación/suscripción (pub/sub)** para enviar notificaciones a múltiples suscriptores simultáneamente (email, SMS, HTTP, SQS, Lambda, etc.).

### Casos de uso
- **Enviar alertas a administradores vía SMS o correo.**
- **Notificar a microservicios sobre un evento (por ejemplo, carga de archivo).**
- **Enviar notificaciones push a dispositivos móviles.**
- **Conectar múltiples colas SQS o lambdas a un solo evento fuente.**

---

## 3. Amazon EventBridge (antes CloudWatch Events)

### ¿Qué es?
Amazon EventBridge es un bus de eventos que permite conectar aplicaciones mediante eventos en tiempo real. Admite fuentes de eventos tanto de AWS como de aplicaciones personalizadas y SaaS (como Zendesk, Auth0, etc.).

### Casos de uso
- **Reaccionar a eventos del sistema (por ejemplo, creación de un recurso EC2).**
- **Integración sin código entre AWS y servicios de terceros.**
- **Orquestar flujos de trabajo sin necesidad de polling.**
- **Automatizar acciones de seguridad o despliegue CI/CD.**

---

## 4. AWS AppSync (basado en GraphQL)

### ¿Qué es?
AWS AppSync permite crear APIs en tiempo real basadas en GraphQL. Soporta suscripciones para notificaciones push a clientes cuando cambian los datos.

### Casos de uso
- **Aplicaciones móviles que requieren datos en tiempo real (chat, colaboraciones).**
- **Dashboards en vivo que actualizan métricas al instante.**
- **Interfaces frontend reactivas con sincronización automática.**

---

## 5. AWS MQ

### ¿Qué es?
AWS MQ es un servicio gestionado que permite usar **brokers de mensajes tradicionales** como **ActiveMQ o RabbitMQ**, ideal para aplicaciones que ya utilizan estos protocolos (AMQP, MQTT, STOMP, JMS).

### Casos de uso
- **Migrar aplicaciones on-premise a la nube sin reescribir lógica de mensajería.**
- **Integración de aplicaciones legacy.**
- **Comunicación fiable con soporte de transacciones y enrutamiento avanzado.**

---

## Comparación de servicios

| Servicio      | Modelo                 | Ordenamiento | Protocolos soportados     | Uso ideal                                  |
|---------------|-------------------------|--------------|----------------------------|---------------------------------------------|
| **SQS**       | Cola (point-to-point)   | FIFO (opcional) | Nativo AWS                | Procesos en segundo plano, desacoplamiento  |
| **SNS**       | Pub/Sub                | No garantiza orden | HTTP, Email, SMS, SQS     | Notificaciones masivas, disparo de eventos  |
| **EventBridge** | Bus de eventos        | No aplica     | JSON, SaaS, AWS events     | Automatización, integración de servicios    |
| **AppSync**   | GraphQL + tiempo real   | Sí (cliente)  | WebSocket, HTTP            | Apps móviles, datos en tiempo real          |
| **AWS MQ**    | Broker tradicional      | Sí            | AMQP, STOMP, JMS, MQTT     | Integración de aplicaciones legacy          |

---

## Casos de uso comparativos

### E-commerce
- **Pedidos:** los pedidos se colocan en una cola **SQS FIFO** para mantener el orden.
- **Notificaciones:** el evento de pedido genera notificaciones por **SNS** a los clientes (email) y sistemas internos (SQS o Lambda).
- **Monitoreo:** cada evento se emite en **EventBridge** para activar flujos de auditoría o dashboards.

### Hospital 
- **Alarmas de pacientes:** se transmiten por **SNS** a múltiples subsistemas.
- **Mensajes entre dispositivos médicos:** se enrutan por **AWS MQ** usando protocolos industriales.
- **App médica en tiempo real:** recibe actualizaciones a través de **AppSync** con suscripciones GraphQL.

### Sistema de procesamiento de datos
- **Procesamiento de datos crudos:** se envían a través de **SQS** para workers distribuidos.
- **Reacciones a cargas de datos:** **EventBridge** detecta el evento y activa procesos de transformación.
- **Resultados al usuario:** se actualizan en el frontend en tiempo real vía **AppSync**.

---

## Conclusión

Los servicios de mensajería de AWS cubren distintos estilos de comunicación:
- **Colas (SQS)** para desacoplamiento y control de flujo.
- **Notificaciones (SNS)** para distribución masiva de eventos.
- **Eventos (EventBridge)** para automatización e integración.
- **Mensajería avanzada (MQ)** para sistemas existentes.
- **Tiempo real (AppSync)** para aplicaciones modernas reactivas.

Cada servicio puede usarse de forma aislada o combinada según la arquitectura deseada.

---
# Ejercicio
1. En amazon SNS crear un topic  https://us-east-1.console.aws.amazon.com/sns/v3/home?region=us-east-1#/dashboard
2. Posteriormente en el topic agrega su dirección de correo electrónico
3. Aceptar el request en el correo electrónico
4. En Amazon Eventbridge https://us-east-1.console.aws.amazon.com/events/home?region=us-east-1#/ crear la regla
5. En la regla enviar a Amazon SNS y seleccionar el tópico creado
6. Posteriormente en eventos capturar algun servicio S3 o EC2