# Arquitecturas

## Conceptos fundamentales

- **Componente**: Módulo con interfaz definida que se puede reutilizar. Representa una unidad funcional encapsulada con responsabilidades específicas.
- **Conector**: Canal de comunicación entre componentes. Define cómo los componentes interactúan e intercambian información.

## Arquitectura por capas (Layered Architecture)

Sistema organizado en diferentes capas que se comunican entre sí, donde cada capa proporciona servicios a la capa superior y consume servicios de la capa inferior.

**Ejemplo en aplicaciones web**:
```
Navegador (Capa de presentación) -> Servidor web (Capa de aplicación) -> Lógica de negocio (Capa de servicio) -> Base de datos (Capa de persistencia)
```

**Características**:
- Separación clara de responsabilidades
- Facilidad de mantenimiento y testing
- Posible cuello de botella en capas inferiores
- Menor rendimiento debido a múltiples saltos entre capas

## Arquitectura Peer-to-Peer (P2P)

Sistema descentralizado y escalable donde cada nodo (peer) actúa tanto como cliente como servidor. La escalabilidad aumenta con el número de participantes.

**Características**:
- Descentralización: No hay nodo central
- Escalabilidad horizontal automática
- Tolerancia a fallos (no hay punto único de fallo)
- Ejemplos: BitTorrent, blockchain, redes de intercambio de archivos

## Arquitectura centrada en datos (Data-Centered Architecture)

Repositorio central que integra los datos, donde los servicios consultan y actualizan los datos en este repositorio compartido.

**Características**:
- Datos como elemento central del sistema
- Componentes independientes que acceden a datos comunes
- Consistencia de datos más fácil de mantener
- Posible cuello de botella en el repositorio central

## Arquitectura orientada a servicios (SOA - Service-Oriented Architecture)

Servicios independientes con protocolos estandarizados que se comunican entre sí para realizar funciones empresariales.

**Principios**:
- **Acoplamiento débil**: Los servicios son independientes y se comunican mediante interfaces bien definidas
- **Servicios reutilizables**: Cada servicio encapsula lógica de negocio que puede ser reutilizada
- **Descubrimiento dinámico**: Los servicios pueden descubrirse y consumirse dinámicamente

**Nota**: SOA suele ser más pesada que la arquitectura de microservicios debido a su mayor formalismo y uso de estándares empresariales como SOAP, WS-*, ESB (Enterprise Service Bus).

## Arquitectura basada en eventos (Event-Driven Architecture)

Los componentes producen y consumen eventos a través de un canal común (event bus o message broker), permitiendo comunicación asíncrona y desacoplada.

**Características**:
- Desacoplamiento temporal y espacial entre productores y consumidores
- Escalabilidad horizontal
- Mayor resiliencia (los componentes pueden fallar sin afectar todo el sistema)
- Patrones comunes: Publicar-Suscribir (Pub/Sub), Colas de mensajes

## Arquitectura de microservicios

El sistema se divide en servicios pequeños e independientes, cada uno ejecutándose en su propio proceso y comunicándose mediante mecanismos ligeros.

**Principios**:
- **Responsabilidad única**: Cada servicio tiene una única responsabilidad de negocio
- **Autonomía y descentralización**: Los servicios son independientes en desarrollo, despliegue y escalado
- **Comunicación ligera**: Generalmente mediante HTTP/REST, gRPC o mensajería asíncrona
- **Gobernanza descentralizada**: Cada equipo es responsable de su(s) servicio(s)

**Comparación con SOA**:
- Microservicios son más ligeros y ágiles
- SOA tiende a tener servicios más grandes y monolíticos
- Microservicios favorecen la autonomía de equipos
- SOA enfatiza la estandarización empresarial

## Arquitectura Cliente-Servidor

Recursos centralizados en el servidor y consultados por múltiples clientes. Modelo fundamental en computación distribuida.

**Características**:
- Separación clara entre proveedor (servidor) y consumidor (cliente) de recursos
- Centralización de lógica y datos en el servidor
- Clientes ligeros que solo manejan presentación
- Posible cuello de botella y punto único de fallo en el servidor

## Tabla de resumen

| Arquitectura | Descripción | Ventajas | Desventajas | Casos de uso |
|--------------|-------------|----------|-------------|--------------|
| **Capas** | Sistema organizado en niveles jerárquicos | Separación clara, fácil mantenimiento | Rendimiento, acoplamiento entre capas | Aplicaciones empresariales tradicionales |
| **Peer-to-Peer** | Nodos iguales que actúan como clientes y servidores | Escalable, sin punto único de fallo | Complejidad, seguridad | Compartir archivos, blockchain |
| **Centrada en datos** | Repositorio central compartido por componentes | Consistencia de datos, reutilización | Cuello de botella, escalabilidad limitada | Sistemas de información empresarial |
| **SOA** | Servicios independientes con estándares empresariales | Reutilización, integración empresarial | Complejidad, overhead de protocolos | Integración de sistemas legacy |
| **Basada en eventos** | Componentes se comunican mediante eventos asíncronos | Desacoplamiento, escalabilidad | Complejidad en seguimiento, consistencia eventual | Sistemas en tiempo real, IoT |
| **Microservicios** | Servicios pequeños e independientes | Agilidad, escalabilidad independiente | Complejidad operativa, latencia de red | Plataformas digitales, aplicaciones nativas en la nube |
| **Cliente-Servidor** | Recursos centralizados en servidor, clientes consumen | Simplicidad, control centralizado | Punto único de fallo, escalabilidad vertical | Aplicaciones web tradicionales |

## Comentarios adicionales

1. **Patrones híbridos**: En la práctica, muchas arquitecturas combinan múltiples estilos. Por ejemplo, una arquitectura de microservicios puede usar comunicación basada en eventos entre servicios.

2. **Consideraciones de selección**:
   - **Requisitos de escalabilidad**: P2P y microservicios para alta escalabilidad
   - **Tiempo de desarrollo**: Capas y cliente-servidor para desarrollo rápido
   - **Integración empresarial**: SOA para integración con sistemas legacy
   - **Tolerancia a fallos**: Basada en eventos y P2P para alta disponibilidad

3. **Evolución histórica**:
   - **Década 1990**: Cliente-servidor dominante
   - **Década 2000**: SOA y arquitectura por capas
   - **Década 2010**: Microservicios y basada en eventos
   - **Década 2020**: Serverless y arquitecturas nativas en la nube

4. **Métricas de calidad arquitectónica**:
   - **Acoplamiento**: Grado de interdependencia entre componentes (bajo es mejor)
   - **Cohesión**: Grado en que las responsabilidades de un componente están relacionadas (alta es mejor)
   - **Modularidad**: Capacidad de descomponer el sistema en partes independientes
   - **Escalabilidad**: Capacidad de manejar crecimiento en carga de trabajo

5. **Herramientas y tecnologías**:
   - **API Gateways**: Kong, Apigee, AWS API Gateway
   - **Service Mesh**: Istio, Linkerd, Consul
   - **Message Brokers**: Kafka, RabbitMQ, AWS SNS/SQS
   - **Orquestadores**: Kubernetes, Docker Swarm, Nomad

6. **Tendencias emergentes**:
   - **Arquitecturas serverless**: Ejecución sin gestión de infraestructura
   - **Arquitecturas basadas en células**: Aislamiento de fallos mediante particionamiento
   - **Arquitecturas de malla de servicios**: Comunicación segura y observable entre servicios
   - **Arquitecturas de edge computing**: Procesamiento cerca del origen de datos

La selección de una arquitectura adecuada depende de múltiples factores incluyendo requisitos funcionales y no funcionales, restricciones organizacionales, habilidades del equipo y contexto del dominio del problema. No existe una arquitectura "mejor" universal, sino la más apropiada para cada situación específica.