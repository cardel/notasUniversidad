# Sesión 17 de Julio AWS III

# Extracción de información

¿Que tipo de información se extrae?

- Entidades: Son partes del texto con significado: Personas, requerimientos, compañías, fechas, etc
- Los textos tienen frases comunes que se deberían categorizar
- De los textos podemos extraer entidades conocidas (que se ha definido a partir de preguntas)

---

¿Que utilidad tiene?

- Extraer información relevante de textos
- Identificar partes del texto con significado
- Identificar relaciones dentro del texto
- Aplicaciones prácticas:
    - Etiquetado de noticias  Esto es util para facilitar busquedas
    
    ```html
    <meta name="keywords" content="armed forces, brand safety-nsf crime, brand safety-nsf discrimination, brand safety-nsf mature, brand safety-nsf/>
    ```
    
    - Identificar temas en textos: CMS: Joomla, Drupal, Wordpress, Salesforce: Los textos se suelen etiquetar (tags) para facilitar búsquedas, hay módulos que se pueden instalar que hacen PLN y etiquetan automáticamente

---

# Tipos de extracción de información

¿Que se busca?

Es extraer información relevante de los textos e identificar que son:  personas, compañías, fechas, eventos, ubicaciones, etc.

---

Extracción de frases clave (Key phrase extraction KPE)

- Extraer palabras útiles para capturar el contexto general
- Es un proceso de aprendizaje no supervisado
- Se mapean las palabras en un grafo con pesos y se determina:
    - Pesos: Indicadores de la importancia de la palabra
    - Que tan conectada esta una palabra: Indicador de importancia
- Algotimos TF-IDF, KeyBERT

---

Reconocimiento de entidades nombradas (Named Entity Recgnition NER)

- Identificar nombres, ubicaciones, organizaciones, fechas y nombres de productos
- Encontrar relaciones entre las entidades en contextos como evento
- Se usan algoritmos como spaCy y BERT

---

Desambiguación de entidades nombradas (Named entity disambiguation NED)

- Identificar entidades únicas en el texto (es decir eliminar ambigüedades)
- Junto a NER se especifican relaciones en la base de conocimiento (grafo)

---

Extracción de relaciones

Identificar como dos entidades se relacionan, ejemplo Bill Gates: Persona Microsoft: Empresa ¿Relación? Bill Gates es uno de los fundadores de Microsoft

---

Extracción de eventos

- Identificación de entidades nombradas
- Extracción de relaciones: Persona o compañia, evento, fecha, ubicación.