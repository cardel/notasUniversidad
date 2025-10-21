# Arquitecturas de Sistemas Distribuidos

## Definiciones Fundamentales

### 🧩 Componente
Unidad modular con **interfaces bien definidas**, reemplazable y reusable.
**Ejemplos**: Servicios de AWS como EC2, S3 Buckets, Lambda Functions

### 🔗 Conectores  
Enlace de comunicación entre módulos que facilita la coordinación.
**Ejemplo**: Amazon VPC (Virtual Private Cloud) que conecta diferentes servicios

## 1. Arquitectura por Capas 🏗️

Sistema organizado en **capas jerárquicas** con responsabilidades específicas:

### 🎨 Capa de Presentación
- **Función**: Interactúa directamente con el usuario
- **Ejemplo**: Frontend de una aplicación web (React, Angular)

### ⚙️ Capa de Aplicación
- **Función**: Contiene la **lógica de negocio**
- **Ejemplo**: Backend con APIs RESTful

### 🔄 Capa de Middleware
- **Función**: Comunica y coordina componentes distribuidos
- **Ejemplo**: Servicios de mensajería como RabbitMQ

### 💾 Capa de Acceso a Datos
- **Función**: Gestión y recuperación de datos
- **Ejemplo**: Bases de datos (PostgreSQL, MongoDB)

## 2. Arquitectura P2P (Peer-to-Peer) 🔄

### Características Principales:
- **Descentralizada**: No existe un nodo central
- **Compartición de recursos**: Los nodos comparten capacidades
- **Escalabilidad fácil**: Se pueden agregar nodos sin problemas

**Ejemplo práctico**: Sistemas de intercambio de archivos como BitTorrent, donde cada participante comparte y descarga fragmentos.

## 3. Arquitectura Centrada en Datos 📊

### Aspectos Clave:
- **Gestión centralizada** de datos
- **Abstracción de datos**: Representación independiente del almacenamiento
- **Datos normalizados**: Todos los nodos comparten el mismo estándar
- **Integración de fuentes múltiples**

**Ejemplo**: Plataformas como Kaggle datasets o Datos Abiertos Colombia que centralizan información para múltiples consumidores.

## 4. SOA (Service-Oriented Architecture) 🧩

Los sistemas se diseñan como **servicios independientes** que se comunican mediante protocolos especializados.

### Principios Fundamentales:
1. **Acoplamiento débil**: Los servicios son independientes
2. **Reutilización de servicios**: Un servicio puede ser usado por múltiples aplicaciones
3. **Interoperabilidad**: Comunicación mediante estándares abiertos
4. **Descubrimiento dinámico**: Los servicios se pueden encontrar automáticamente

**Ejemplo**: Un conjunto de impresoras de red que ofrecen servicios de impresión a toda la organización.

## 5. Arquitectura Basada en Eventos ⚡

### Componentes Esenciales:
- **Productores y consumidores** de eventos (sistemas de colas)
- **Canales** para transmitir mensajes
- **Desacoplamiento** entre productores y consumidores

**Ejemplo**: Un sistema de e-commerce donde la confirmación de pedido genera eventos para inventario, facturación y envío.

## 6. Arquitectura de Microservicios 🧊

### Características Distintivas:
- **Responsabilidad única**: Cada microservicio tiene un propósito específico
- **Comunicación ligera**: APIs livianas entre servicios
- **Autonomía de despliegue**: Cada servicio se despliega independientemente
- **Gestión descentralizada** de datos

**Ejemplo**: Una plataforma de streaming donde servicios separados manejan catálogo, reproducción, recomendaciones y usuarios.

## 7. Arquitectura Cliente-Servidor 👥

### Modelo Clásico con Ventajas Claras:

- **Separación de responsabilidades**: Cliente maneja interfaz, servidor gestiona recursos
- **Gestión centralizada** de recursos
- **Modelo solicitud-respuesta**: Comunicación síncrona
- **Escalabilidad y seguridad centralizada**

**Ejemplo**: Aplicaciones web tradicionales donde el navegador (cliente) solicita páginas a un servidor web.

---

## Comparación Resumida

| Arquitectura | Fortalezas | Casos de Uso Típicos |
|-------------|------------|---------------------|
| **Por Capas** | Organización clara, mantenimiento sencillo | Aplicaciones empresariales tradicionales |
| **P2P** | Escalabilidad, resiliencia | Compartir archivos, blockchain |
| **Centrada en Datos** | Consistencia, integración | Plataformas de datos, analytics |
| **SOA** | Reutilización, interoperabilidad | Sistemas empresariales grandes |
| **Basada en Eventos** | Desacoplamiento, escalabilidad | Sistemas en tiempo real, IoT |
| **Microservicios** | Agilidad, despliegue independiente | Aplicaciones cloud nativas |
| **Cliente-Servidor** | Simplicidad, control central | Aplicaciones web tradicionales |

Cada arquitectura representa un **balance diferente** entre acoplamiento, escalabilidad y complejidad, permitiendo seleccionar la mejor opción según los requisitos específicos del sistema distribuido.