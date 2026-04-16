# Introducción a sistemas distribuidos

Un **sistema distribuido** es un conjunto de computadoras que trabajan juntas de manera coordinada para lograr un objetivo común, presentándose a los usuarios como un sistema único y coherente.

## Características fundamentales

- **Estado compartido entre nodos**: Los nodos mantienen y acceden a información común
- **Operación concurrente**: Múltiples procesos se ejecutan simultáneamente en diferentes nodos
- **Tolerancia a fallos**: Un nodo puede fallar sin afectar el servicio general del sistema

## Diferencias clave

### Paralelismo vs. Distribución
- **Paralelismo**: Ejecución de varias tareas simultáneas en una misma máquina (multiprocesador, multinúcleo)
- **Distribución**: Ejecución de tareas en varias máquinas coordinadas a través de una red

## Problemas de latencia en sistemas distribuidos

Uno de los mayores desafíos en sistemas distribuidos es la diferencia en los tiempos de acceso a los diferentes componentes:

```
Acceso a la RAM -> nanosegundos (ns)
Acceso a SSD -> microsegundos (μs)
Acceso a la red -> orden de milisegundos (ms)
```

**Relación de magnitudes**:
- La RAM es aproximadamente **1000 veces más rápida** que un SSD
- El SSD es aproximadamente **1000 veces más rápido** que la red

**Conclusión**: En sistemas distribuidos ganamos capacidad de procesamiento y almacenamiento, pero perdemos velocidad debido a la latencia de red.

## Escalabilidad

La escalabilidad se refiere a la capacidad de un sistema para manejar un crecimiento en la carga de trabajo. Existen dos enfoques principales:

1. **Escalabilidad horizontal**: Aumentar el número de nodos (más máquinas)
   - Ventajas: Mayor tolerancia a fallos, límites teóricos más altos
   - Desventajas: Mayor complejidad en coordinación y consistencia

2. **Escalabilidad vertical**: Aumentar la capacidad de un nodo existente (más CPU, RAM, almacenamiento)
   - Ventajas: Más simple de implementar, sin problemas de consistencia distribuida
   - Desventajas: Límites físicos, punto único de fallo

## Tolerancia a fallos

Un **cluster** (grupo de nodos que trabajan juntos) puede sobrevivir a caídas parciales, mientras que un servidor único no puede hacerlo.

### Métricas clave de disponibilidad

1. **MTBF (Mean Time Between Failures)**: Tiempo promedio entre fallas
   - Indica la confiabilidad del sistema
   - MTBF alto = sistema más confiable

2. **MTTR (Mean Time To Recovery)**: Tiempo promedio para recuperación
   - Indica la capacidad de recuperación del sistema
   - MTTR bajo = sistema se recupera rápidamente

3. **Uptime**: Tiempo durante el cual el sistema está operativo
   - Se expresa comúnmente en "nueves" (nines)
   - Ejemplos:
     - 99.9% = "tres nueves" ≈ 8.76 horas de downtime por año
     - 99.99% = "cuatro nueves" ≈ 52.6 minutos de downtime por año
     - 99.999% = "cinco nueves" ≈ 5.26 minutos de downtime por año
     - 99.9999% = "seis nueves" ≈ 31.5 segundos de downtime por año
   - AWS generalmente ofrece "seis nueves" (99.9999%) en sus servicios

## Chaos Engineering

La **ingeniería del caos** es la disciplina de experimentar en un sistema distribuido para construir confianza en su capacidad para resistir condiciones turbulentas en producción.

### Herramientas y conceptos

- **Chaos Monkey**: Apaga instancias al azar para probar la resiliencia del sistema
- **Chaos King**: Simula la caída de una región completa de AWS
- **Simian Army**: Conjunto de herramientas que agrupan todas las anteriores y más
- **Gremlin**: Plataforma para inyectar fallos de manera controlada

**Filosofía**: Un sistema siempre va a fallar eventualmente; debemos asegurarnos de que falle de manera controlada y con gracia (graceful degradation).

## Teorema CAP

El **teorema CAP** establece que es imposible para un sistema distribuido que presenta un fallo parcial (partición de red) garantizar simultáneamente las tres propiedades siguientes:

### Las tres propiedades del teorema CAP

1. **C (Consistency) - Consistencia**: Toda lectura retorna la escritura más reciente o un error
   - Todos los nodos ven los mismos datos al mismo tiempo

2. **A (Availability) - Disponibilidad**: Toda solicitud recibe una respuesta (no necesariamente la más reciente)
   - El sistema siempre responde, incluso si algunos nodos están caídos

3. **P (Partition tolerance) - Tolerancia a particiones**: El sistema sigue funcionando si la red se divide (desconecta parcialmente)
   - El sistema continúa operando a pesar de fallos de comunicación entre nodos

### Implicaciones del teorema

Según el teorema CAP, durante una partición de red, un sistema distribuido solo puede garantizar dos de las tres propiedades:

- **CP (Consistencia + Tolerancia a particiones)**: Prioriza consistencia sobre disponibilidad
  - Ejemplo: Bases de datos relacionales distribuidas
- **AP (Disponibilidad + Tolerancia a particiones)**: Prioriza disponibilidad sobre consistencia
  - Ejemplo: DynamoDB, Cassandra
- **CA (Consistencia + Disponibilidad)**: Solo posible en sistemas no distribuidos o sin particiones

## Modelos de consistencia

### ACID (Atomicity, Consistency, Isolation, Durability)
- **Prioriza consistencia** sobre disponibilidad
- Propiedades:
  - Atomicidad: Las transacciones son completas o no ocurren
  - Consistencia: Las transacciones llevan la base de datos de un estado válido a otro
  - Aislamiento: Las transacciones concurrentes no interfieren entre sí
  - Durabilidad: Los cambios persisten después de confirmados

### BASE (Basically Available, Soft state, Eventually consistent)
- **Prioriza disponibilidad** sobre consistencia inmediata
- Propiedades:
  - Básicamente disponible: El sistema responde incluso durante fallos
  - Estado suave: El estado puede cambiar con el tiempo sin nuevas entradas
  - Consistencia eventual: El sistema se volverá consistente con el tiempo si no hay nuevas escrituras

## Tabla de resumen

| Concepto | Descripción | Ejemplos/Notas |
|----------|-------------|----------------|
| **Sistema distribuido** | Conjunto de computadoras que trabajan coordinadamente | Cluster, grid computing, cloud |
| **Paralelismo** | Varias tareas en una máquina | Multiprocesador, multihilo |
| **Distribución** | Varias tareas en varias máquinas coordinadas en red | Microservicios, sistemas en cluster |
| **Latencia** | Tiempo de acceso a diferentes componentes | RAM: ns, SSD: μs, Red: ms |
| **Escalabilidad horizontal** | Aumentar número de nodos | Más máquinas, mayor complejidad |
| **Escalabilidad vertical** | Aumentar capacidad de un nodo | Más CPU/RAM, límites físicos |
| **MTBF** | Tiempo promedio entre fallas | Indicador de confiabilidad |
| **MTTR** | Tiempo promedio para recuperación | Indicador de resiliencia |
| **Uptime** | Tiempo de operación del sistema | Expresado en "nueves" (99.9...%) |
| **Chaos Engineering** | Experimentar con fallos para construir confianza | Chaos Monkey, Gremlin |
| **Teorema CAP** | Limitación fundamental de sistemas distribuidos | Solo 2 de 3: C, A, P |
| **Consistencia (C)** | Todas las lecturas ven la escritura más reciente | Prioridad en sistemas CP |
| **Disponibilidad (A)** | Toda solicitud recibe respuesta | Prioridad en sistemas AP |
| **Tolerancia a particiones (P)** | Funciona durante fallos de red | Requerida en sistemas distribuidos |
| **ACID** | Modelo que prioriza consistencia | Bases de datos relacionales |
| **BASE** | Modelo que prioriza disponibilidad | Bases de datos NoSQL distribuidas |

## Comentarios adicionales

1. **Patrones de diseño distribuido**:
   - **Leader election**: Selección de un nodo coordinador
   - **Sharding**: Particionamiento de datos entre nodos
   - **Replicación**: Copia de datos en múltiples nodos
   - **Consenso distribuido**: Algoritmos como Paxos, Raft

2. **Desafíos adicionales**:
   - **Relojes distribuidos**: Sincronización de tiempo entre nodos
   - **Transacciones distribuidas**: Atomicidad a través de múltiples nodos
   - **Detección de fallos**: Identificar nodos caídos de manera confiable
   - **Balanceo de carga**: Distribución equitativa del trabajo

3. **Tendencias modernas**:
   - **Service Mesh**: Capa de infraestructura para comunicación entre servicios
   - **Serverless**: Ejecución de código sin gestión de servidores
   - **Edge Computing**: Procesamiento cerca del origen de los datos
   - **Kubernetes**: Orquestación de contenedores a escala

4. **Consideraciones prácticas**:
   - **Ley de Amdahl**: El paralelismo tiene límites debido a las partes secuenciales
   - **Ley de Moore**: Ya no es sostenible para escalabilidad vertical
   - **Ley de Conway**: La arquitectura de software refleja la estructura organizacional

5. **Herramientas comunes**:
   - **Monitoreo**: Prometheus, Grafana, Datadog
   - **Tracing**: Jaeger, Zipkin
   - **Mensajería**: Kafka, RabbitMQ
   - **Orquestación**: Kubernetes, Docker Swarm

Los sistemas distribuidos son fundamentales en la computación moderna, permitiendo construir aplicaciones escalables, resilientes y de alto rendimiento, aunque introducen complejidades significativas que deben ser cuidadosamente gestionadas.