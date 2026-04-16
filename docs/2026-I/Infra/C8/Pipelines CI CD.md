# Pipelines CI/CD

**CI (Continuous Integration - Integración Continua)**: Práctica de integrar cambios de código frecuentemente en un repositorio compartido, ejecutando automáticamente pruebas y compilación para detectar problemas temprano.

**CD (Continuous Delivery - Entrega Continua)**: El código queda listo para desplegar en cualquier momento, pero requiere aprobación manual antes del despliegue a producción.

**CD (Continuous Deployment - Despliegue Continuo)**: Se despliega automáticamente a producción después de pasar todas las pruebas, sin intervención manual.

## Componentes de un pipeline CI/CD

1. **Control de versiones**: Sistema para gestionar cambios en el código fuente (Git, SVN, Mercurial)
2. **Sistema de build**: Herramienta para compilar y empaquetar la aplicación (Maven, Gradle, npm, Make)
3. **Pruebas automatizadas**: Suite de pruebas que se ejecutan automáticamente (unitarias, integración, end-to-end)
4. **Plataforma CI/CD**: Sistema que orquesta el pipeline (GitHub Actions, Jenkins, GitLab CI, CircleCI)
5. **Entorno de despliegue**: Infraestructura donde se ejecuta la aplicación (Docker, Kubernetes, servidores cloud)

## GitHub Actions

GitHub Actions es una plataforma de CI/CD integrada en GitHub que permite automatizar flujos de trabajo directamente desde el repositorio.

### Estructura básica

Los pipelines se definen en archivos YAML dentro del directorio `.github/workflows/` del repositorio.

```yaml
name: <nombre-del-workflow>           # Nombre descriptivo del workflow
on: <eventos-que-disparan-ejecución>  # Eventos que activan el workflow (push, pull_request, etc.)
jobs:
  <nombre-job>:                       # Identificador único para el job
    runs-on: <sistema-operativo>      # Sistema operativo donde se ejecuta (ubuntu-latest, windows-latest, macos-latest)
    steps:
      - uses: <acción/repositorio>    # Reutiliza una acción predefinida de GitHub Marketplace
      - name: <nombre-paso>           # Nombre descriptivo para el paso
        run: <comando-o-script>       # Comando shell o script a ejecutar
```

### Conceptos clave

- **Jobs**: Unidades de trabajo que se ejecutan en runners. Pueden ejecutarse en paralelo o secuencialmente.
- **Steps**: Pasos individuales dentro de un job. Cada step puede ser una acción reutilizable o un comando personalizado.
- **Dependencias entre jobs**: Se pueden definir dependencias usando `needs` para que un job espere a que otros terminen.
- **Secrets**: Credenciales sensibles que se almacenan cifradas en la configuración del repositorio. Nunca deben incluirse directamente en el código YAML.
- **Runners**: Infraestructura donde se ejecutan los jobs. Pueden ser:
  - **GitHub-hosted runners**: Proporcionados por GitHub (Linux, Windows, macOS)
  - **Self-hosted runners**: Infraestructura propia configurada para ejecutar jobs

## Tabla de resumen

| Concepto | Descripción | Ejemplos/Notas |
|----------|-------------|----------------|
| **CI (Integración Continua)** | Integración frecuente de código con ejecución automática de pruebas | Detección temprana de errores, builds diarios |
| **CD (Entrega Continua)** | Código siempre listo para desplegar con aprobación manual | Control humano sobre despliegues a producción |
| **CD (Despliegue Continuo)** | Despliegue automático a producción tras pasar pruebas | Mayor velocidad de entrega, requiere alta confianza en pruebas |
| **Control de versiones** | Sistema para gestionar cambios en código fuente | Git, GitHub, GitLab, Bitbucket |
| **Sistema de build** | Herramienta para compilar y empaquetar aplicación | Maven, Gradle, npm, yarn, Make |
| **Pruebas automatizadas** | Suite de pruebas que se ejecutan sin intervención humana | Unitarias, integración, E2E, rendimiento |
| **Plataforma CI/CD** | Sistema que orquesta el pipeline de integración y despliegue | GitHub Actions, Jenkins, GitLab CI, CircleCI |
| **Entorno de despliegue** | Infraestructura donde se ejecuta la aplicación | Docker, Kubernetes, AWS, Azure, GCP |
| **GitHub Actions** | Plataforma CI/CD integrada en GitHub | Workflows definidos en YAML, marketplace de acciones |
| **Workflow** | Proceso automatizado definido en YAML | Archivo en `.github/workflows/` |
| **Job** | Conjunto de pasos que se ejecutan en un runner | Puede tener dependencias con otros jobs |
| **Step** | Tarea individual dentro de un job | Acción reutilizable o comando personalizado |
| **Runner** | Infraestructura donde se ejecutan jobs | GitHub-hosted o self-hosted |
| **Secrets** | Credenciales almacenadas cifradas | API keys, tokens, contraseñas |
| **Eventos** | Acciones que disparan la ejecución del workflow | push, pull_request, schedule, workflow_dispatch |

## Comentarios adicionales

1. **Beneficios de CI/CD**:
   - **Calidad**: Detección temprana de errores mediante pruebas automáticas
   - **Velocidad**: Entrega más rápida de características y correcciones
   - **Confianza**: Mayor seguridad en los despliegues
   - **Feedback rápido**: Los desarrolladores reciben retroalimentación inmediata

2. **Mejores prácticas**:
   - **Pipeline como código**: Los pipelines deben versionarse junto con el código
   - **Builds reproducibles**: Mismos inputs deben producir mismos outputs
   - **Fail fast**: Detectar y reportar fallos lo antes posible
   - **Ambientes aislados**: Separación clara entre desarrollo, staging y producción

3. **Patrones comunes**:
   - **Pipeline multietapa**: Build → Test → Deploy to staging → Deploy to production
   - **Blue-green deployment**: Dos ambientes idénticos para despliegues sin downtime
   - **Canary releases**: Liberación gradual a un subconjunto de usuarios
   - **Feature flags**: Activación/desactivación de características sin redeploy

4. **Métricas importantes**:
   - **Lead time**: Tiempo desde commit hasta producción
   - **Deployment frequency**: Cuántas veces se despliega a producción
   - **Change failure rate**: Porcentaje de despliegues que causan incidentes
   - **Mean time to recovery**: Tiempo promedio para recuperarse de fallos

5. **Herramientas complementarias**:
   - **Monitoreo**: Datadog, New Relic, Prometheus
   - **Logging**: ELK Stack, Splunk, CloudWatch Logs
   - **Security scanning**: Snyk, SonarQube, Dependabot
   - **Infrastructure as Code**: Terraform, CloudFormation, Ansible

6. **Consideraciones de seguridad**:
   - **Principio de mínimo privilegio**: Los runners deben tener solo los permisos necesarios
   - **Rotación de credenciales**: Secrets deben rotarse periódicamente
   - **Scanning de dependencias**: Detectar vulnerabilidades en librerías de terceros
   - **Auditoría**: Logs detallados de todas las ejecuciones del pipeline

Los pipelines CI/CD son fundamentales para la entrega moderna de software, permitiendo equipos de desarrollo iterar rápidamente mientras mantienen alta calidad y estabilidad en producción. La implementación efectiva requiere no solo herramientas adecuadas, sino también cambios culturales y organizacionales hacia prácticas DevOps.