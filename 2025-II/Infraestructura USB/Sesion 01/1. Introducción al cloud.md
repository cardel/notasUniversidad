
# Introducción

1. Poder representar dispositivos fisicos en la nube (computadores, discos duros, redes, switches, routers, gateways, firewalls) de forma virtual
2. Podemos configurar estos recursos a través de diferentes medios: Consola Web, CLI (consola), SDK (librerías en lenguajes), Infraestructura como código (Terraform)
3. Para cada necesidad hay un servicio que presta la solucion

## Computo
1. EC2: Máquinas virtuales: hay varios tipos de acuerdo a la necesidad (reservadas, spot, en demanda, programadas)
2. Volumenes. Almacenamiento de instancia, EBS (bloques), EFS (unidades de red)
3. Configuración de las redes (VPC, ACL, grupos de seguridad)

## Bases de datos
1. Relacionales: SQL. Redshift (provisión, servidores, replicas, protección contra errores). Aurora: Postgres, Mysql
2. No SQL: Dynamo DB
3. Otros tipos: Grafos Neptuno, Datawarehouse Redshift
## Seguridad
1. Identiidades / Roles: AIM
2. VPC: Grupos de seguridad, ACL (configuración puertos y servicios )