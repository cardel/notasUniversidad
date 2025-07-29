# Servicios de IA en AWS

Amazon Web Services (AWS) ofrece una suite de servicios de Inteligencia Artificial (IA) diseñados para resolver tareas específicas como el procesamiento de lenguaje natural, la síntesis de voz, el análisis de documentos y la creación de modelos de machine learning. A continuación se explican y comparan seis servicios destacados: **SageMaker, Polly, Textract, Comprehend, Kendra y Lex**.

---

## 1. Amazon SageMaker

### ¿Qué es?
Amazon SageMaker es una plataforma completamente gestionada para crear, entrenar y desplegar modelos de machine learning a escala.

### Casos de uso
- **Detección de fraude:** entrenar un modelo para identificar transacciones sospechosas.
- **Clasificación de imágenes:** modelo para identificar objetos o patrones en imágenes médicas.
- **Predicción de demanda:** modelo de series temporales para prever ventas futuras.
- **Machine learning personalizado:** cualquier caso donde necesites entrenar un modelo con tus propios datos.

---

## 2. Amazon Polly

### ¿Qué es?
Amazon Polly convierte texto en voz natural mediante tecnología de texto a voz (TTS). Soporta múltiples idiomas y ofrece voces realistas (neural TTS).

### Casos de uso
- **Lectores para personas con discapacidad visual.**
- **Asistentes virtuales con voz.**
- **Generación automática de narraciones para videos o cursos.**
- **Anuncios hablados en dispositivos IoT o kioscos.**

---

## 3. Amazon Textract

### ¿Qué es?
Amazon Textract extrae texto, tablas y campos de formularios desde documentos escaneados o imágenes utilizando OCR (Reconocimiento Óptico de Caracteres) con inteligencia artificial.

### Casos de uso
- **Digitalización de facturas o recibos con extracción automática de valores.**
- **Procesamiento de formularios de seguros o bancarios.**
- **Lectura masiva de documentos legales o contratos.**
- **Automatización de ingreso de datos desde PDFs.**

---

## 4. Amazon Comprehend

### ¿Qué es?
Amazon Comprehend es un servicio de procesamiento de lenguaje natural (NLP) que extrae información y relaciones desde texto. Puede identificar sentimientos, entidades, temas y frases clave.

### Casos de uso
- **Análisis de opiniones de clientes (review mining).**
- **Detección de sentimiento en redes sociales.**
- **Clasificación automática de correos electrónicos.**
- **Extracción de entidades como nombres, lugares o fechas en noticias.**

---

## 5. Amazon Kendra

### ¿Qué es?
Amazon Kendra es un motor de búsqueda empresarial inteligente que utiliza IA para responder preguntas usando contenido interno como documentos, wikis y sitios.

### Casos de uso
- **Sistema de búsqueda inteligente en intranet empresarial.**
- **Asistente virtual para bases de conocimiento internas.**
- **Acceso rápido a documentos legales, técnicos o administrativos.**
- **Motor de búsqueda en portales de soporte técnico.**

---

## 6. Amazon Lex

### ¿Qué es?
Amazon Lex permite construir interfaces de conversación (chatbots y voicebots) usando los mismos modelos que Alexa. Integra reconocimiento de voz, lenguaje natural y gestión de diálogos.

### Casos de uso
- **Chatbots para atención al cliente.**
- **Asistentes virtuales para reserva de citas o pedidos.**
- **Integración con sistemas como Slack o Facebook Messenger.**
- **Voicebots en centros de llamadas (IVR inteligente).**

---

## Comparación de servicios

| Servicio       | Tipo de IA                 | Tarea principal                        | ¿Entrenamiento personalizado? |
|----------------|----------------------------|----------------------------------------|-------------------------------|
| SageMaker      | Machine Learning completo  | Entrenamiento y despliegue de modelos  | Sí                            |
| Polly          | Text-to-Speech             | Convertir texto en voz                 | No                            |
| Textract       | Computer Vision + OCR      | Extraer texto estructurado             | No                            |
| Comprehend     | NLP                        | Análisis de texto                      | Sí (limitado)                 |
| Kendra         | NLP + Búsqueda semántica   | Búsqueda inteligente                   | No (configuración asistida)  |
| Lex            | NLP + Diálogos             | Chatbots / Interfaces conversacionales | Sí (con intents personalizados) |

---

## Combinaciones útiles

- **Lex + Polly:** chatbot con voz natural para atención telefónica automatizada.
- **Textract + Comprehend:** extracción de texto + análisis semántico de documentos legales.
- **Kendra + Comprehend:** motor de búsqueda que entiende el contenido y clasifica automáticamente.
- **SageMaker + cualquier otro:** modelos personalizados integrados con otros servicios IA.

---
