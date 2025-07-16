# Que son
Nos permiten tener aplicaciones aisladas dentro del sistema operativo: docker

# Orquestación

Generar configuraciones y acciones para que un conjunto de contenedores trabajen en conjunto

## Servicios
- AWS Containter register: un repositorio de contenedores, docker hub
- AWS Fargate: Orquestación de contenedores serveless (sin configuración de servidor)
- AWS EKS: orquestación
	- Generan instancias de EC2 que gestionar un cluster con Kubernetes (kubeadm)
	- Configurar las redes y politicas para conenctar los componentes
![[images/Pasted image 20250710204647.png]]