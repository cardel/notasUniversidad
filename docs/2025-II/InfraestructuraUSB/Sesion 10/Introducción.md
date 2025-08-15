# Tipos de servicios
- AWS EC2: Instancias IaaS
- AWS Fargate - AWS EKS - AWS ECR  Contenedores
- AWS Beanstalk - AWS Lightsail Lanzamiento de aplicaciones PaaS
- AWS Lambda funciones FaaS



| Servicio          | Tipo                     | Características                                                                 | Concepto clave                                                                 |
|-------------------|--------------------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Amazon EC2        | Infraestructura (IaaS)   | - Basado en instancias<br>- Máquinas virtuales                                  | Concepto familiar para profesionales de TI. Aprovisione máquinas virtuales.  |
| AWS Lambda        | Cómputo sin servidor     | - Basado en funciones<br>- Bajo costo                                           | Ejecución de código programada o por eventos. Diseñado para la nube.         |
| Amazon ECS/EKS    | Contenedores             | - Basado en instancias                                                         | Opciones para mayor control en gestión de contenedores.                      |
| AWS Fargate       | Contenedores (sin servidor)| - Reduce sobrecarga administrativa                                             | Ideal para enfoque en aplicaciones sin gestión de infraestructura.           |
| Elastic Beanstalk | Plataforma (PaaS)        | - Para aplicaciones web<br>- Vinculación fácil con otros servicios              | Enfoque en el código, rápido inicio.                                          |

**Notas adicionales:**
- [[AWS Lambda]] es recomendado "cuando sea posible" por su diseño optimizado para la nube.
- [[AWS Fargate]] se destaca por reducir la complejidad operativa en contenedores.
- [[Elastic Beanstalk]] es ideal para despliegues rápidos de aplicaciones web.

