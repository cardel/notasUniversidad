- Servicio nos ofrece máquinas virtuales en la nube
- Permite configurar las redes y forma de acceso a la máquina virtual
- Seleccionar la capacidad que tendrá la máquina virtual: CPU, memoria, disco, etc
- Podemos ubicarlas en cualquier zona de disponibilidad de la región

# Variables de lanzamiento

## 1. AMI
Imágen que contiene el sistema operativo y algunas configuraciones
- Linux
- Windows
- MAC
Existen diferentes fuentes de AMI
- AWS por defecto
- Marketplace: Plantillas configuradas por terceros
- Mis AMI: Propias
- Comunidad: No están bajo verificación de AWS
Se pueden crear AMI a partir de la modificación de existentes
https://docs.aws.amazon.com/es_es/AWSEC2/latest/UserGuide/finding-an-ami.html

## 2. Tipo de instancia

- Memoria: cantidad y características
- CPU: Cantidad y tipo: Por fabricante, por arquitectura (ARM o X86)
- Disco
- Interfaz de red

Por ejemplo T3.micro: Familia T, generación 3, micro es el tamaño, con variaciones:

https://aws.amazon.com/ec2/instance-types/


### Instancias de Propósito General  
Diseñadas para ofrecer un equilibrio entre cómputo, memoria y recursos de red. Ideales para cargas de trabajo diversas como:  
- Servidores web  
- Repositorios de código  

**Ejemplo:** Amazon EC2 M4  

#### Características  
- Procesador Intel Xeon Scalable hasta 2.4 GHz (Broadwell/Haswell)  
- Optimizado para EBS sin costo adicional  
- Soporta redes mejoradas  

**Casos de uso:**  
Bases de datos pequeñas/medianas, procesamiento de datos con alta demanda de memoria, servidores backend para SAP/SharePoint.  

---

### Instancias Optimizadas para Cómputo  
Ideales para aplicaciones intensivas en procesamiento:  
- Procesamiento por lotes  
- Transcodificación de medios  
- HPC, inferencia de ML  

**Ejemplo:** AWS Graviton4 (C8gd)  

#### Características  
- Procesadores Graviton4 personalizados  
- Hasta 3x más vCPUs/memoria que C7g  
- Memoria DDR5-5600  
- Soporta EFA en instancias grandes  

**Casos de uso:**  
Modelado científico, servidores de juegos, motores de anuncios.  

---

### Instancias Optimizadas para Memoria  
Para cargas que procesan grandes conjuntos de datos en memoria:  

**Casos de uso destacados:**  
- Bases de datos SAP HANA en la nube  
- Entornos certificados para SAP S/4HANA  

---

### Instancias de Computación Acelerada  
Usan aceleradores hardware (ej. GPUs) para tareas especializadas:  

#### Características 
- (ej. Grace Blackwell Superchips)  
- Hasta 72 GPUs Blackwell + 360 petaflops FP8  
- 13.4 TB de memoria HBM3e  
- Ancho de banda de red: 28.8 Tbps  

**Casos de uso:**  
Entrenamiento de modelos de IA a escala trillón (generación de código/imagen, reconocimiento de voz).  

---

### Instancias Optimizadas para Almacenamiento  
Diseñadas para alto rendimiento en lectura/escritura secuencial:  

#### Características  
- Procesadores Intel Xeon Cascade Lake (3.1 GHz)  
- Hasta 336 TB de almacenamiento HDD  
- 75 Gbps de ancho de banda  

**Casos de uso:**  
Sistemas de archivos distribuidos (Lustre, GPFS), data lakes.  

---

### Instancias Optimizadas para HPC  
Mejor relación precio-rendimiento para cargas HPC:  

#### Características  
- 64 núcleos Graviton3E + 128 GiB RAM  
- Red EFA hasta 200 Gbps  
- (hardware dedicado + hipervisor ligero).  



![](attachments/Pasted%20image%2020250814182737.png)

## 3. Configuración de red

- VPC
- Grupo de seguridad
- IP publica
	- IP asignada directamente, esta cambia cada vez que e se reinicia la instancia
	- Elástica: Que se es propia del usuario y se debe crear y luego asignar

## 4. Rol de IAM

Los permisos que tiene la instancia sobre otros de recursos de AWS

## 5. Datos de usuarios

Son scripts que se ejecutan una sola vez al crear la instancia, por ejemplo, instalación de paquetes

## 6. Opciones de almacenamiento

Como se va a configurar el almacenamiento en la instancia de EC2
- Instance store: Efimero, este se pierde al terminar la instancia
- EBS: Que es externo, es como un disco duro que se conecta a la instancia y que no depende si la instancia está activa o no

Estos pueden ser volumen raíz (donde está el S.O)

Se puede configurar

- Tipo: SSD o HDD
- Tamaño en GB
- Si es cifrado
- Si no es el volumen raíz se puede utilizar en S3 o - EFS: Que es un sistema de archivos compartidos

## 7. Etiquetas

Son metadatos que tiene la instancia, el más importante es **name** es el nombre de la instancia

## 8. Grupo de seguridad
Son las reglas de entrada y salida que va a tener la máquina virtual, por regla general, debe permitirse el puerto 22 SSH en el caso de Linux y en el caso de Windows el de escritorio remoto

## 9 Claves de seguridad

- Linux es una clave tipo RSA o otro formato para conectarse por SSH
- En el caso de Windows es la clave que se utiliza para conectarse por escritorio remoto.

# Estados de las instancias

![](attachments/Pasted%20image%2020250814183718.png)


Tener presente que terminar significa desactivar la instancia y no es reversible, es diferente a detener (stop)

# Monitoreo

Cloudwatch es la herramienta que utilizamos para monitorear la actividad de las instancias, es la base para tomar decisiones, como escalar

![](attachments/Pasted%20image%2020250814183941.png)