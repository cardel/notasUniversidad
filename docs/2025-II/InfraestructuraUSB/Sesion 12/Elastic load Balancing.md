Distribuye el trafico entre una o varias zonas de disponibilidad, este escala de acuerdo al tráfico que se recibe.

- Balanceador de carga de aplicaciones: HTTPS, SSH, FTP, HTTP
- Balanceador de carga en Red: TCP, UDP, TLC (protocolos de capa 4 transporte)
- Anterior generación: De acuerdo al tripo de trafico entre instancias de AWS, funciona en capa 7 y capa 4.


Balanceadores de aplicaciones y de red los destinos se registran en grupos de destinos.

Balanceadores de carga clásicos las instancias se registran en él.


Monitoreo:
- CloudWatch para ver que el sistema funciona como está previsto
- Registros de acceso: Solicitudes del balanceador de carga
- AWS CloudTrail: Interacciones del API.