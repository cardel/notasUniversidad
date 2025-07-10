# Teoria redes y seguridad en AWS

```bash
nmap <direccion> #Ver puertos abierto
```

Direcciones IPV4 con 4 octetos XXXX XXXX XXXX XXXX —> 0.0.0.0 hasta 255.255.255.255

Tenemos direcciones privadas

Clase A: 10.0.0.0 hasta 10.255.255.255 usualmente tienen mascara 8, 

XXXXXXXX XXXXXXXX XXXXXXXX XXXXXXXX

Las primeros 8 bits son para codificar la red y el resto para los equipos

XXXXXXXX

2 a la 8 máximo 256 redes

El resto para los computadores

XXXXXXXX XXXXXXXX XXXXXXXX 

2 a la 24 equipos son 16M

Clase B: 172.16.0.0 hasta 172.31.255.255 mascara 16

XXXXXXX XXXXXXX redes y los otros 16 son para computadores 64k computadores

Clase c: 192.168.0.0 hasta 192.168.255.255

Mascara 24, 24 bits para las redes y 8 bits para los computadores

Maximo 256 equipos.

## Ejemplo

Si mi dirección

192.168.3.X con mascara 24, los primeros 24 bits me dicen la red  192.168.3 y los otros 8 me dicen la IP del PC pero tengo direcciones la primera es la dirección de red y la ultima el broadcast

192.168.3.1 —- 192.168.1.254 Porque 192.168.1.0 es direccion de red y 192.168.1.255 es el broadcast

¿Que es una VPC?

Es una reserva de bloques de IPs, vive en una región

¿Que es una subnet?

Es un segmento de bloques que está dentro de un VPC que vive en un area de disponibilidad

¿Que es un grupo de seguridad?

Es un conjunto de reglas que aplica a instancias/recursos de AWS de forma individiual

¿Que es un ACL?

Es un conjunto de reglas con prioridad (entre menor sea el numero, sera leida primero) para subredes (todos los equipos en una subred)

Puertas de enlace a Internet

**Internet Gateway (IGW)**: Permite la comunicación entre instancias en una VPC y la red de Internet.Por ejemplo, un servidor web público que debe recibir solicitudes de los usuarios a través de Internet.

**NAT Gateway**: Ideal para instancias en una subred privada que necesitan acceso a Internet pero no deben ser accesibles desde Internet. Por ejemplo, instancias en una subred privada que necesitan descargar actualizaciones de software o acceder a recursos externos

**Tabla de Rutas**: Debe configurarse para dirigir el tráfico destinado a Internet hacia la puerta de enlace a Internet.

IP Elastica

A diferencia de las direcciones IP públicas asignadas dinámicamente a instancias EC2, una IP elástica es una dirección IP pública fija que no cambia, incluso si se detiene y se inicia una instancia.