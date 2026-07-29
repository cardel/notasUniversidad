# Semana 8: Intro Cloud y Pipelines CI/CD

# Sistemas distribuidos

¿Que son?

- Son un conjunto maquina/computadores que trabajan concurrente
- Estas son administradas por un midleware que hace que se vean un solo nodo procesamiento
- Sobre este middleware corren aplicaciones que utilizan los recursos del sistema distribuido
- Una o más maquinas pueden fallar sin afectar el rendimiento del sistema

---

Escalabilidad

- Vertical: Actualizar un sola maquina
- Horizontal: Agregar más capacidad de procesamiento (o más nodo) a un sistema distribuido

---

Baja latencia

Sistemas distribuidos permiten tener elementos en diferentes localizaciones, lo que permite que estos puedan atender el tráfico más cercano a ellos

---

## Teorema de CAP

Aquí te presento un ejemplo claro del teorema CAP usando un sistema de base de datos distribuida:

Imagina un sistema de base de datos que tiene tres nodos en diferentes ubicaciones geográficas. Cuando ocurre una partición de red (falla en la comunicación entre nodos), el sistema debe elegir entre:

- Priorizar Consistencia (C) + Tolerancia a particiones (P): En este caso, el sistema rechazará escribir datos hasta que todos los nodos estén sincronizados, sacrificando la Disponibilidad (A).
- Priorizar Disponibilidad (A) + Tolerancia a particiones (P): El sistema seguirá aceptando lecturas y escrituras en cada nodo, pero temporalmente sacrificará la Consistencia (C) ya que los datos pueden estar desactualizados entre nodos.

Este ejemplo ilustra por qué es imposible garantizar las tres propiedades simultáneamente durante una partición de red. Los sistemas distribuidos modernos deben elegir qué propiedades priorizar según sus necesidades específicas.

---

## Sistema base

Aquí te presento algunos ejemplos de sistemas distribuidos que siguen el modelo BASE:

1. Redes Sociales:
- Las actualizaciones de estado pueden no ser inmediatamente visibles para todos los usuarios (Eventual Consistency)
- El sistema sigue funcionando incluso si algunas réplicas están caídas (Basically Available)
- El estado de los "me gusta" o comentarios puede fluctuar (Soft State)
1. Sistemas de Correo Electrónico:
- Los correos pueden tardar algunos minutos en aparecer en todas las carpetas sincronizadas (Eventual Consistency)
- El servicio continúa funcionando aunque algunas réplicas fallen (Basically Available)
- El estado de "leído/no leído" puede variar temporalmente entre dispositivos (Soft State)
1. Sistemas de Comercio Electrónico:
- El inventario mostrado puede no ser exacto en tiempo real (Soft State)
- Las órdenes se procesan aunque haya nodos caídos (Basically Available)
- Las reseñas y calificaciones pueden tomar tiempo en actualizarse en todas las réplicas (Eventual Consistency)
1. Servicios de Streaming:
- El progreso de reproducción puede variar entre dispositivos (Soft State)
- El servicio sigue funcionando aunque algunas regiones tengan problemas (Basically Available)
- Las listas de reproducción se sincronizan eventualmente entre dispositivos (Eventual Consistency)

## Arquitecturas de sistemas distribuidos

**Arquitectura en Capas**

Un ejemplo de arquitectura en capas es una aplicación web típica, como un sistema de gestión de contenido (CMS). En este caso, hay una capa de presentación (interfaz de usuario), una capa lógica (procesamiento de datos y reglas de negocio) y una capa de datos (base de datos).

**Arquitectura Peer-to-Peer (P2P)**

Un ejemplo de arquitectura P2P es BitTorrent, donde los usuarios pueden compartir archivos directamente entre sí sin necesidad de un servidor central.

**Arquitectura Centrada en Datos**

Un ejemplo de arquitectura centrada en datos es Apache Kafka / RabbitMQ, que actúa como un sistema de mensajería donde los datos son el componente central y las aplicaciones leen/escriben datos en función de las necesidades.

**Arquitectura Orientada a Servicios (SOA)**

Un ejemplo de arquitectura SOA es un sistema bancario donde servicios como autenticación, transferencias y generación de estados de cuenta son independientes y se comunican entre sí a través de interfaces estándar.

**Arquitectura Basada en Eventos**

Un ejemplo de arquitectura basada en eventos es un sistema de monitoreo de stock en tiempo real en una tienda en línea, donde se generan eventos (como una compra) que actualizan el inventario y notifican a otros servicios.

**Arquitectura de Microservicios**

Un ejemplo de arquitectura de microservicios es Netflix, donde cada funcionalidad (como recomendaciones, gestión de usuarios, y transmisión de contenido) se implementa como un servicio independiente que interactúa con otros.

**Arquitectura Cliente-Servidor**

Un ejemplo de arquitectura cliente-servidor es un sistema de correo electrónico como Gmail, donde el cliente (navegador o aplicación) se comunica con el servidor para enviar y recibir correos.

# Pipelines CI/CD

Pipeline CI/CD

- Son un conjunto de acciones que se realizan para tener integración continuación (CI) y despligue continuo (CD)
- CI Integración continua: Correr tareas compilación y pruebas
- CD Despligue continuo: Correr tareas para que la aplicación esté disponible

Usualmente se suelen utilizar diferentes ambientes de desarrollo o producción para evaluar las aplicaciones

## Anotaciones sobre CI/CD en ramas

master/main: Rama protegida donde no se puede hacer PUSH directamente, sino a través de pull requests que usualmente requieren aprobaciones.

develop: Rama principal de desarrollo no se puede hacer PUSH desde donde salen los pull requests a main. Es la rama consolidada del proceso de desarrollo.

Ramas de trabajo (issues o features):
• tipo-numeroticket
• tipo-numeroFeature
• issue-1234
• feature-2323
• release → Compendio grande de cambios → develop

CI: Compilación, pruebas y análisis de calidad/seguridad del software con sonarqube

main → Despliegue continuo a producción (CD)
develop → Despliegue continuo a desarrollo (CD)

## Protección de ramas

Se va a configuración y a ruleset (conjunto de reglas), se coloca la rama deseada (default por patrón) y se activa la opción Require a pull request before merging

# Github Actions

Recurso

Que son

Son rutinas que corremos para validar si un software compila y las pruebas son satisfactorias

tambien sirve para despligue continuo

```scala
# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.
# This workflow will build a Java project with Gradle and cache/restore any dependencies to improve the workflow execution time
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-java-with-gradle

name: Java CI with Gradle

on:
  push:
    branches: [ "*" ]  #Corre en todas las ramas
  pull_request:
    branches: [ "main" ] #Corre en main

jobs:
  build:

    runs-on: ubuntu-latest # Sistema operativo 
    permissions:
      contents: read   #Permisos solo de lectura al repo

    steps:
    - uses: actions/checkout@v4  #github.com/actions git clone
    - name: Set up JDK 17
      uses: actions/setup-java@v4  #Instala java  cardel/repo@v1
      with:
        java-version: '17'
        distribution: 'temurin'

    # Configure Gradle for optimal use in GitHub Actions, including caching of downloaded dependencies.
    # See: https://github.com/gradle/actions/blob/main/setup-gradle/README.md
    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@af1da67850ed9a4cedd57bfd976089dd991e2582 # v4.0.0

    - name: Build with Gradle Wrapper
      run: ./gradlew build -x test

    - name: Test with Gradle Wrapper
      run: ./gradlew test

    # NOTE: The Gradle Wrapper is the default and recommended way to run Gradle (https://docs.gradle.org/current/userguide/gradle_wrapper.html).
    # If your project does not have the Gradle Wrapper configured, you can use the following configuration to run Gradle with a specified version.
    #
    # - name: Setup Gradle
    #   uses: gradle/actions/setup-gradle@af1da67850ed9a4cedd57bfd976089dd991e2582 # v4.0.0
    #   with:
    #     gradle-version: '8.9'
    #
    # - name: Build with Gradle 8.9
    #   run: gradle build

  dependency-submission:  #Genera el jar

    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
    - uses: actions/checkout@v4
    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'

    # Generates and submits a dependency graph, enabling Dependabot Alerts for all project dependencies.
    # See: https://github.com/gradle/actions/blob/main/dependency-submission/README.md
    - name: Generate and submit dependency graph
      uses: gradle/actions/dependency-submission@af1da67850ed9a4cedd57bfd976089dd991e2582 # v4.0.0
```

Esto debe estar dentro de la carpeta .github/workflows