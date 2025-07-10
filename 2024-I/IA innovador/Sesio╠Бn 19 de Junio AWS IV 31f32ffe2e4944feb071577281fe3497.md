# Sesión 19 de Junio AWS IV

## Recursos

- Certificación AWS https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/?ch=sec&sec=rmg&d=1
- Certificación Google https://cloud.google.com/learn/certification/machine-learning-engineer

- Certificación Microsoft [https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-engineer/?practice-assessment-type=certification](https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-engineer/?practice-assessment-type=certification)
- Recursos laborales
    - [https://jobs.careers.microsoft.com](https://jobs.careers.microsoft.com/)
    - https://www.epam.com/
    - [https://torre.ai/es](https://torre.ai/es)
    - [https://career.globant.com](https://career.globant.com/)

# Modelado de temas

¿Qué es?

¿Para qué se usa?

Encontrar temas en una gran colección de documentos

- Clasificación de documentos
- Etiquetado automático (agilizar búsquedas)
- Creación de resúmenes de documentos
- Recuperación de información
- Recomendaciones de contenido basadas en los temas

---

¿Cómo hacemos modelado de temas?

1. Se limpian los datos
2. Se eliminan las stepwords
3. Se lematiza
4. Se vectoriza/tokeniza
5. Se envían al modelo el cual interpreta los vectores y clasifica por temas, esto es un proceso de clasificación por entrenamiento **no supervisado**

---

¿Que opciones hay?

1. API asíncronos como Amazon Comprehend
2. Algoritmos como LDA/NTM entre otros

---

¿Cómo medimos el performance de los algoritmos?

- Perplexidad: Nos mide la probabilidad de pertenece de un documento a un tema
- Coherencia: Habla de la similaridad de las palabras en un tema

Se busca baja perplexidad que indica que el tema se ajusta al documento y alta coherencia que indica que los temas en el documento son similares, tenemos una categoría clara el documento.