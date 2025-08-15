# Introducción

Son un método de virtualización

- Aisla las dependencias del sistema operativo
- Es multiplataforma
- Más rápido que las máquinas virtual

# Docker

Plataforma de gestión de contenedores, esta trabaja a partir de plantillas llamadas imágenes, que tienen todo lo necesario para que una aplicación se ejecute

- Maquinas virtuales tienen un sistema operativo propio el cual corre sobre el hipervisor, este es independiente totalmente del sistema host
- Contenedores son un compendio de librerías que corren de forma aislada dentro del sistema host


# Amazon ECS

- Coordina ejecución de contendores de Docker
- Tiene escalado automático de los contenedores
- Crea la infraestructura automáticamente
- Al igual que EC2 tiene balanceo de carga, grupos de seguridad, volumenes EBS y roles de IAM
- En caso que se no se desee administrar el cluster utilizar la opción de AWS Fargate en otro caso usar EKS

# Kubernetes (Amazon EKS)

- Permite orquestar la ejecución de contenedores a escala
- Complementa a Docker y permite gestionar la ejecución de múltiples hosts
- Este se trabaja a través del servicio de Amazon Elastic Kubernetes Service (Amazon EKS)

# Amazon ECR

Amazon Elastic Container Registry

Funciona como un repositorio de imágenes de Docker, es similar al docker hub pero gestionado directamente por AWS