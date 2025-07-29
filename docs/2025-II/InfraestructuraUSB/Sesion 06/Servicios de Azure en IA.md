# Servicios de IA en Microsoft Azure

Microsoft Azure ofrece un conjunto de servicios cognitivos y de machine learning que permiten a las organizaciones implementar soluciones inteligentes sin necesidad de desarrollar modelos desde cero. A continuación se explican y comparan los equivalentes de **Azure** a los servicios de AWS: **SageMaker, Polly, Textract, Comprehend, Kendra y Lex**.

---

## 1. Azure Machine Learning

### ¿Qué es?
Azure Machine Learning es una plataforma en la nube para crear, entrenar, probar y desplegar modelos de machine learning personalizados, incluyendo modelos de deep learning, automatización ML y MLOps.

### Casos de uso
- **Predicción de riesgo de crédito en bancos.**
- **Detección de anomalías en sensores industriales.**
- **Clasificación de imágenes médicas.**
- **Forecasting de demanda o inventario.**

---

## 2. Azure Text to Speech (parte de Speech Service)

### ¿Qué es?
Servicio de conversión de texto a voz que forma parte de Azure Speech. Ofrece voces neuronales realistas y permite la personalización de voces propias.

### Casos de uso
- **Lectores automáticos para personas con discapacidad visual.**
- **Narradores automáticos en cursos virtuales.**
- **Asistentes virtuales y IVR con voz natural.**
- **Conversión de contenido editorial en audio.**

---

## 3. Azure Form Recognizer

### ¿Qué es?
Servicio de extracción automática de texto, tablas y campos desde documentos escaneados (como PDFs, imágenes o formularios), basado en OCR con IA.

### Casos de uso
- **Extracción de información de facturas, recibos y contratos.**
- **Automatización de ingreso de datos desde formularios.**
- **Procesamiento masivo de archivos administrativos o legales.**
- **Lectura de historiales clínicos o documentos académicos.**

---

## 4. Azure Text Analytics

### ¿Qué es?
Servicio de análisis de texto que identifica sentimientos, entidades, frases clave, idioma y relaciones semánticas. Es parte de Azure Cognitive Services.

### Casos de uso
- **Análisis de comentarios de clientes en e-commerce.**
- **Monitorización de reputación de marca en redes sociales.**
- **Extracción de temas clave en grandes volúmenes de texto.**
- **Identificación de términos legales o técnicos importantes.**

---

## 5. Azure Cognitive Search + Semantic Ranker

### ¿Qué es?
Azure Cognitive Search es un motor de búsqueda inteligente que indexa contenido estructurado y no estructurado. Puede integrar modelos semánticos con **Semantic Ranker** y procesamiento de lenguaje natural.

### Casos de uso
- **Buscador inteligente en portales académicos, legales o técnicos.**
- **Exploración de archivos PDF, Word, Excel o sitios web internos.**
- **Asistente de conocimiento para empresas o call centers.**
- **FAQ inteligente con respuestas basadas en documentos.**

---

## 6. Azure Bot Service + Language Understanding (LUIS)

### ¿Qué es?
Azure Bot Service permite construir, probar e implementar bots conversacionales en múltiples canales. LUIS (Language Understanding) interpreta las intenciones del usuario usando NLP.

### Casos de uso
- **Chatbots para servicio al cliente en canales como Teams o Webchat.**
- **Bots que gestionan reservas, preguntas frecuentes o solicitudes.**
- **Integración de voicebots con Azure Speech para centros de contacto.**
- **Automatización de tareas repetitivas vía conversación natural.**

---

## Comparación de servicios

| Servicio en Azure                 | Equivalente AWS     | Tipo de IA               | ¿Entrenamiento personalizado? |
|----------------------------------|----------------------|--------------------------|-------------------------------|
| Azure Machine Learning           | SageMaker            | ML personalizado         | Sí                            |
| Azure Text to Speech             | Polly                | Conversión texto a voz   | No (pero permite custom voice)|
| Azure Form Recognizer            | Textract             | OCR inteligente          | Sí (modo "trained model")     |
| Azure Text Analytics             | Comprehend           | Procesamiento de texto   | Parcial (con Custom Text)     |
| Azure Cognitive Search           | Kendra               | Búsqueda semántica       | No (pero configurable)        |
| Azure Bot Service + LUIS         | Lex                  | NLP conversacional       | Sí (entrenamiento de intents) |

---

## Combinaciones útiles

- **Bot Service + Text to Speech:** voicebots para atención automatizada con voz realista.
- **Form Recognizer + Text Analytics:** extraer texto y luego analizar sentimientos o entidades.
- **Cognitive Search + Text Analytics:** buscador con ranking semántico e identificación de temas.
- **Azure ML + cualquier otro servicio:** integración de modelos entrenados a medida con servicios cognitivos.


---
