
Monitorear los recursos de AWS de tal forma se sepa por ejemplo si necesito más instancias de EC2, o bien si la disponibilidad de la aplicación está presentado problemas.

- Monitoreo: Recursos de AWS
- Seguimiento: Métricas estándar y personalizadas.
- Alarmas: SNS (para alertas si se cumple cierta condición), para escalar (Auto scaling)
- Eventos: Reglas para definir que AWS generan ciertos eventos

Alarmas:
- Promedio de uso de CPU en EC2
- Conexiones simultaneas en RDS
- Tamaño de bucket mayor que un valor
- Cantidad EC2 en buen estado es menor que un valor
- Si el volumen promedio de lectura en EBS es mayor que un valor en un tiempo determinado