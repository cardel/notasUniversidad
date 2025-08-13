Permite gestionar redes virtuales
- Reservar un rango de IPs
- Creación subredes
- Configuración de tablas de enrrutamiento
- Podemos controlar el acceso externo con los NAT Gateways (privado) y Internet Gateway (publico)
- Controlar la seguridad: grupos de seguridad y las network ACL
# VPC
1. Son aisladas para cada cuenta de AWS
2. Son de alcance regional
3. Se asigna un rango de IPs mascara maxima es 16 y la minima es 28
4. Admite IPV4 o IPV6
5. No se puede cambiar el rango de IPs después de creada
6. Tener en cuenta las 5 IPs reservadas en cada subrted

# Subredes

1. Son de alcance por zona de disponibilidad
2. Aquí gestionamos los recursos
3. Pueden ser publicas o privadas
4. Son particiones de una VPC
5. No se puede tener que dos subredes tengan IPs superpuestas

# Tipos de IPs publicas

1. Publica: Asignación manual a través de una dirección elástica (que puede cambiar) Asignación automática al crear un recurso en nivel de subred
2. IP elástica: Asociada a una cuenta de AWS, se puede asignar o quitar de un recurso, suele tener costo

# Interfaces de redes y tablas de enrrutamiento

- Interfaces de redes estan asociadas a instancias, funcionan con las reales, una instancia puede tener mas de una red interfaz red
- Tablas de enrrutamiento indican como se mueven los paquetes en la VPC. Cada subred solo tiene una y sólo una tabla de enrrutamiento.