Redes son estructuras que permiten comunicar computadoras
- Cableado (UTP, Fibra optica, coaxial)
- Dispositivos: Enrrutadores, switch, firewalls, etc

## Direcciones IPs
Permite identificar individualmente un equipo de una red, tenemos dos tipo

- IPV4: 32 bits, representamos en 4 decimales (0-255) separados por puntos
- IPV6: 128 bits representación hexadecimal, bloques de 4 hexadecimales, 8 bloques de 32 bits.

## Mascara de bits

Permite identificar dos partes de la dirección IP

- Dirección de red: Identificar el grupo de computadores
- Dirección individual: Identificación del equipo

Ejemplo

192.0.2.0 / 24
Esto quiere decir que los primeros 24 bits se utilizaran para identificar la red

192.0.2 <-- Direccion de red
.0 <-- Direccion de equipo

Esto quiere decir que las direcciones para los equipos van a ser

192.0.2.0 Direccion reservada de red
192.0.0.1 Direccion  comunicaciones internas AWS
192.0.0.2 AWS Route 53
192.0.0.3 Reservada
192.0.0.4  hasta 192.0.0.254
192.0.0.255 Broadcast

# Capas del modelo OSI

1. Capa física: Cableado estructurado
2. Cada de enlace datos: Transferencia en la misma red Swtich, Routers, dirección MAC
3. Capa de red: Enrrutamiento de paquetes IP
4. Capa de transporte: Protocolos de como se intercambia la información UDP y TCP
5. Capa de sesión Permite dar un orden al intercambio de datos,dados que los paquetes no necesariamente llegan en el mismo orden de emisión NetBIOS, RPC
6. Capa de presentation Conexion con la capa de aplicación y maneja el cifrado ASCI, ICA
7. Aplicación el tipo de datos que se esta intercambiando HTTP, FTP, DHCP, LDAP