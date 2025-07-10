# Sesión 08: Sistemas distribuidos

---

¿Que es un sistema distribuido?

Es un conjunto nodos de procesamiento (Computadores, contenedores o máquinas virtuales)

Estos pueden operar de forma independiente están comunicandose entre sí y para un usuario final es un sólo nodo procesamiento

---

¿Porque los sistemas distribuidos son importantes?

- Permiten manejar grandes volumenes de datos y capacidades de procesamiento
- Son escalables
- La complejidad del diseño de las aplicaciones se incrementa, porque es necesario tener en cuenta la distribución tareas y datos

---

Como está compuesto

Diferentes nodos de procesamiento que son gestionados por un middleware sobre el cual corren las aplicaciones

- [https://www.docker.com/](https://www.docker.com/)
- https://podman.io/
- https://kafka.apache.org/
- [https://www.rabbitmq.com/](https://www.rabbitmq.com/)

---

Tipos de escalabilidad

Capacidad de ofrecer mayor procesamiento, almacenamiento, etc

- Vertical: Aumentar recursos en un mismo nodo de procesamiento
- Horizontal: Es agregar más de nodos de procesamiento

---

Tolerancia a fallos

Un cluster puede responder así uno de sus nodos falle

Por otra parte, un cluster puede levantar un instancia de procesamiento adicional cuando sea necesario (fallos, picos de petición)

---

Ejemplo de arquitectura

Tenemos una aplicación Web que se conecta un equilibrador de carga (balanceador de carga) que distribuye las peticiones entre diferentes instancias de backend y tiene servidores en espera que se integran a los disponibles cuando es necesario.

---

# Practica de docker

Pasos previos

```bash
docker ps
#Verificar si tengo los permisos

#Si no funciona toca agregar al usuario actual al grupo docker
sudo usermod -G docker <usuario>
```

---

Construcción de la imagen

Lo primero es generar el Dockerfile

```bash
docker build -t <tag> .
#tag es el nombre que le quiere a la imagina
```

---

EJecutar la imagen

```bash
docker run -p <puerto host>:<puerto cont> <tag>:latest 
```

---

Acceder

```bash
docker exec -it <nombre-docker-ps> /bin/bash
```