# Parte 1: Costos

## 1. Aspectos básicos de los precios

Factores de costo de AW

- Computo: Hora/Segundo
- Almacenamiento: GB
- Transferencia de datos: Salida de datos por GB

---

Modelo de costos

Entre más se utiliza se cobra menos por GB/hora computo.

Se debe examinar si AWS es una buena solución para el tamaño de la compañía, si no buscar opciones que ofrezcan capacidad más limitada a menor precio. Godaddy, bluehost, etc

---

¿Como reducir costos?

- Reservar capacidad: EC2, espacio
- AURI: Pagar por anticipado: Mas ahorro genera
- PURI: Pago parcial
- NURI: Sin pago anticipado (menos ahorro genera)

---

Servicios sin cargo

- VPC
- Elasitc beanstalk
- Escalado automatico
- AWS Cloudformation
- IAM

---

### Resumen

AWS es un servicio que ofrece varias opciones de pago por uso y reservando, tener en cuenta que entre más se utilice el precio por GB o por hora/segundo de procesamiento es menor, es decir, está pensando en grandes clientes.

## Costo de propiedad

Infraestructura tradicional vs nube AWS

- Costos de equipos en la infraestructura tradicional vs costos de uso
- Escalado vertical y horizontal de la nube
- Gastos operativos: Tradicional, requiere contratos inversiones en equipos, etc, vs en la nube que no son necesario
- TCO: Costo total de propiedad
    - Servidores
    - Almacenamiento
    - Redes
    - Mano de obra

---

Calculadora de AWS

[https://calculator.aws](https://calculator.aws/)

- Estimar costos mensuales
- Aplicar planes de reducción de costos: Anuales o a 3 años
- Conocer las estimaciones
- Se debe tener conocimiento de lo que se requiere: Capacidad de cómputo, almacenamiento, consultas a los recursos, etc

---

## Herramientas de AWS para costos

- Calculadora de AWS [https://calculator.aws](https://calculator.aws/)
- AWS Organizations: Crear organizaciones las cuales están ligadas a políticas de acceso y ellas estan asociadas a usuarios, máximo se puede tener profundidad de 5 desde el usuario root.
- Administración de facturas y costos
    - Panel de facturación: Reportes gráficos y en tablas
    - AWS Budgets: Presupuestos en dinero y en uso de los servicios
    - Informe de costos y uso de AWS
    - Explorador de costos de AWS: Estudiar tendencias.
- Soporte técnico: De acuerdo al plan los tiempos de respuesta pueden variar.
    - Basico
    - Developer
    - Business
    - Enterprise