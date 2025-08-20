# Introducción

Es un sistema de archivos en red, se utiliza conectandose a este como unidad de red y se utiliza como un volumen normal.

Diferencia con EBS, no se adjunta a las instancia de EC2. También tienen snapshots (backups)

| Categoría                       | Tipo                   | Descripción                                                      | Características                                                                                                                                     | Recomendación                                    |
| ------------------------------- | ---------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Tipo de Sistema de Archivos** | Regional (Recomendado) | Almacena datos redundantes en múltiples AZs dentro de una región | - Alta disponibilidad continua<br>- Resistente a fallos de AZ<br>- Datos distribuidos geográficamente                                               | Recomendado para la mayoría de cargas de trabajo |
|                                 | One Zone               | Almacena datos en una sola Availability Zone                     | - Disponibilidad continua en AZ única<br>- Riesgo de pérdida de datos si falla la AZ<br>- Misma durabilidad (99.999999999%) en condiciones normales | Para datos recreables o menos críticos           |
| **Modo de Rendimiento**         | General Purpose        | Ideal para aplicaciones sensibles a la latencia                  | - Web serving<br>- Content management systems<br>- Home directories<br>- File serving general                                                       | Modo por defecto recomendado                     |
|                                 | Elastic                | Escala automáticamente el throughput según la carga              | - Ajuste automático de rendimiento<br>- Adaptable a la actividad de la carga de trabajo                                                             | Para cargas variables o impredecibles            |
| **Características Generales**   | Escalabilidad          | Crece hasta escala de petabytes                                  | - Crecimiento automático<br>- Alto throughput<br>- Acceso masivamente paralelo                                                                      | Ideal para big data y analytics                  |
|                                 | Durabilidad            | 99.999999999% (11 nueves)                                        | - Protección contra fallos de disco/host/rack<br>- Diseño de ingeniería robusto                                                                     | Confiable para datos críticos                    |

**Puntos clave:**
- Los sistemas Regionales ofrecen máxima resiliencia ante fallos de Availability Zones
- Los sistemas One Zone son más económicos pero con riesgo de pérdida de datos en caso de desastre en la AZ
- Ambos tipos mantienen la misma durabilidad de 11 nueves en condiciones operativas normales
- Los modos de rendimiento se adaptan a diferentes necesidades de latencia y throughput
- Escala automáticamente para manejar cargas de trabajo desde pequeñas hasta petabytes