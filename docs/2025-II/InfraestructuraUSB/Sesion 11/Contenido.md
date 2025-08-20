1. [Elastic block store](EBS.md)
2. [S3](S3.md)
3. [EFS](EFS.md)
4. [S3 Glacier](S3%20Glacier.md)
5. [RDS](RDS.md)
6. [Amazon DynamoDB](Amazon%20DynamoDB.md)
7. [Amazon RedShift](Amazon%20RedShift.md)
8. [Amazon Aurora](Amazon%20Aurora.md)

# Resumen

## Bases de datos



| Requisito                                                                                           | Herramienta Recomendada                   | Descripción                                                               |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------- |
| Base de datos relacional de clase empresarial                                                       | Amazon RDS                                | Base de datos relacional gestionada para aplicaciones empresariales       |
| Servicio de base de datos NoSQL rápido y flexible para cualquier escala                             | Amazon DynamoDB                           | Base de datos NoSQL completamente gestionada y escalable                  |
| Acceso al sistema operativo o funciones de aplicación no compatibles con servicios AWS              | Bases de datos en Amazon EC2              | Bases de datos auto-gestionadas en instancias EC2                         |
| Servicios de bases de datos personalizadas                                                          | Servicios de bases de datos personalizada | Soluciones específicas para necesidades particulares                      |
| Requisitos específicos basados en casos concretos (aprendizaje automático, almacén de datos, grafo) | Servicios especializados AWS              | Soluciones específicas para ML, data warehousing, bases de datos gráficas |
- RDS es de enfoque de mayor fexibilidad en selección de los motores de bases de datos
- Aurora esta limitado a bases de datos compatibles con MySLQ y postgreSQL, ofrece mayor escalabilidad con respecto de cargas de trabajo.

Aquí tienes la tabla organizada de manera clara y compacta:

| Tipo de Base de Datos | Ejemplos de Uso                                                                                                               | Servicio de AWS                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Relacional**        | Aplicaciones tradicionales, ERP, CRM, comercio electrónico, chatbots RAG, búsqueda de similitudes, sistemas de recomendación  | Amazon Aurora<br>Amazon RDS<br>Amazon Redshift |
| **Clave-valor**       | Aplicaciones web de alto tráfico, e-commerce, gaming, búsqueda de similitudes con OpenSearch                                  | Amazon DynamoDB                                |
| **En memoria**        | Caché, gestión de sesiones, ranking de juegos, aplicaciones geoespaciales, chatbots RAG, caché semántico, detección de fraude | Amazon ElastiCache<br>Amazon MemoryDB          |
| **Documento**         | Gestión de contenido, catálogos, perfiles de usuarios, chatbots RAG, búsqueda de similitudes, sistemas de recomendación       | Amazon DocumentDB (MongoDB compatible)         |
| **Grafos**            | Detección de fraude, redes sociales, motores de recomendación, GraphRAG, descubrimiento de respuestas                         | Amazon Neptune                                 |
| **Columna ancha**     | Mantenimiento de equipos industriales, gestión de flotas, optimización de rutas                                               | Amazon Keyspaces                               |
| **Series temporales** | IoT, DevOps, telemetría industrial                                                                                            | Amazon Timestream                              |

