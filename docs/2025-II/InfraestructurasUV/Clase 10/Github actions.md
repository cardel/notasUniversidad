# GitHub Actions: Automatización de CI/CD Integrada

## ¿Qué es GitHub Actions?

**GitHub Actions** es una **plataforma nativa de CI/CD** integrada directamente en GitHub que permite automatizar flujos de trabajo de desarrollo de software.

### Capacidades Principales:

- 🤖 **Automatizar pruebas de software** de forma continua
- ⚡ **Ejecutar tareas en respuesta a eventos** (push, pull request, issues)
- 📅 **Programar tareas periódicas** (cron jobs)
- 🏗️ **Crear pipelines complejos** con múltiples etapas y dependencias

### Entornos Disponibles:
Proporciona runners preconfigurados con **Linux, Windows y macOS** para ejecutar tus workflows.

## Estructura de Workflows

### 📁 Organización de Archivos
Los workflows se definen en archivos YAML dentro de la carpeta:
```bash
.github/workflows/
```

### 🎯 Ejemplo Básico de Workflow

```yaml
name: Pipeline
on: [push, pull_request]
branches: [main, master, pepito, "*"]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Run tests
        run: npm test
```

### 🔧 Actions Reutilizables
La plataforma permite usar **actions preconstruidas** del marketplace:
```yaml
- uses: actions/checkout@v5
- uses: actions/setup-java@v4
```

**Repositorio oficial de actions**: https://github.com/actions/

---

## Ejemplo Práctico: Pipeline para Proyecto C++ con Gradle

### 🚀 Configuración Inicial del Proyecto

```bash
# Inicializar proyecto Gradle para C++
gradle init

# Configurar repositorio Git
git init
git remote set-url <url>
git add . && git commit -m "mensaje" && git push origin master
```

### 📋 Workflow Completo: Build y Test

```yaml
name: Build and test
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: "temurin"
          java-version: 17
      
      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v5
      
      - name: Build with Gradle
        run: ./gradlew build -x test

  test:
    runs-on: ubuntu-latest
    needs: build  # ⚡ Dependencia: solo ejecuta si build es exitoso
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: "temurin"
          java-version: 17
      
      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4
      
      - name: Test with Gradle
        run: ./gradlew test
```

## 🔒 Protección de Ramas con Rulesets

### Configuración Recomendada para la Rama Principal:

- ✅ **Requerir pull request antes del merge**
- 🚫 **Bloquear force push**
- ✅ **Activar las reglas de protección**

### Flujo de Trabajo Protegido:

```mermaid
graph LR
    A[Rama de Desarrollo] --> B[Pull Request]
    B --> C[Revisión de Código]
    C --> D[Ejecución de CI/CD]
    D --> E[Merge a Main]
```

**Proceso seguro**: Para realizar cambios en la rama principal, es necesario:
1. Crear una **nueva rama** desde main
2. Desarrollar y probar los cambios
3. Crear un **pull request** que activará automáticamente el pipeline CI/CD
4. Después de aprobación y pruebas exitosas, **mergear** a main

---

## Ventajas de GitHub Actions

### 🎯 **Integración Nativa**
- Totalmente integrado con el ecosistema GitHub
- Sin configuración adicional de servidores

### 🔄 **Flexibilidad**
- Soporta múltiples lenguajes y frameworks
- Amplia biblioteca de actions preconstruidas

### 📊 **Visibilidad Completa**
- Logs detallados de cada ejecución
- Estado de pipelines visible en pull requests

### 💰 **Costo-Efectivo**
- Minutos gratuitos para repositorios públicos
- Precios competitivos para repositorios privados

GitHub Actions representa la **evolución moderna de CI/CD**, combinando la potencia de pipelines automatizados con la simplicidad de una plataforma integrada que sigue las mejores prácticas de desarrollo seguro y colaborativo.