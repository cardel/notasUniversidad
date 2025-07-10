# Balanceo de carga y monitoreo

Balancedores de carga

Distribuir las peticiones (trafico) hacia diferentes nodos de procesamiento

- Balanceador de carga de red (trabaja sobre capa 4 transporte) TCP/UDP
- Balanceador de carga de aplicaciones (trabaja sobre HTTP) capa 7
- Balanceador de carga clasico (que trabaja en varias capas 4 o 7) ofrece capacidades sobre diferentes protocolos.

---

¿Cuando usarlo?

- Balanceadores de carga de red
    - Tráfico impredecible
    - Tenemos sobrecarga de paquetes en red
- Balanceadores de aplicaciones: Peticion HTTP(S)
- Balanceador clásico: Diferentes servicios

1) Carga de aplicaciones: Peticiones que requieren gran capacidad para resolver

2) Número de peticiones.

---

EC2 Auto Scaling

1. Grupos de Auto Scaling es un conjunto de instancias
    1. Capacidad minima
    2. Capacidad deseada
    3. Capacidad maxima
2. Este servicio se comunica con Cloud Watch para leer el estado actual del uso de la infraestructura y de acuerdo a unas reglas aprovisiona capacidad
3. Esta capacidad puede ser EC2, BD, Contenedores, S3, etc
4. Parámetros de aprovisionamiento
    1. Plantilla (capacidad)
    2. Número de instancias
    3. Grupos de seguridad
    4. Bajo que reglas de aprovisiona