# Introducción a los sistemas distribuidos · Infra C7

Lo que se vio en la sesión: qué cambia cuando el cómputo deja de caber en una
máquina, cuánto cuesta cruzar la red, cómo se crece hacia arriba o hacia los
lados, qué le queda a un servicio cuando una pieza se cae y qué contesta un
sistema cuando la red se parte en dos. Las diapositivas están en el Campus
Virtual; aquí quedan las mediciones que se hicieron en vivo, los ejemplos que
salieron en el salón y las cuentas.

## Lo que cambia al salir de la máquina

Hasta aquí el curso trabajó dentro de una máquina: varios hilos, una memoria y
un reloj. Un sistema distribuido son varias máquinas que cooperan, cada una con
su memoria y su reloj, unidas por una red que a veces no entrega.

La diferencia que manda es la latencia. Leer de memoria está en nanosegundos y
cruzar la red está en milisegundos, del orden de cientos de miles de veces más
lento. Entre dos continentes, cincuenta milisegundos es una buena cifra, y eso
sobre enlaces privados.

La cuenta que ordena la idea: un millón de enteros de cuatro bytes son 4 MB y
caben en cualquier máquina, así que sumarlos con OpenMP en ocho hilos toma
milisegundos. Mil millones son 4 GB, y repartirlos entre unas cien máquinas
toma segundos. Se pasa de milisegundos a segundos, y aun así vale la pena,
porque el problema ya no cabía en una sola memoria.

> Un sistema distribuido no se monta para ir más rápido. Se monta para poder
> con lo que no cabe, y se paga en latencia y en coordinación.

## Lo que se midió en vivo

La latencia se midió contra dos destinos, uno con presencia cercana y otro sin
ella:

```bash
ping -c 5 google.com
ping -c 5 www.baidu.com
```

En la sesión del martes dieron unos 18 ms contra Google y unos 200 ms contra
Baidu. El jueves, sobre los datos del celular en vez del wifi del salón, 97 ms
y 481 ms. Las cifras cambian con la red; lo que no cambia es la razón entre
ellas: Google atiende desde una ubicación de borde cercana y Baidu responde
desde China.

El camino se vio con la traza de saltos, que salió de Colombia por Telefónica
Global Solutions antes de cruzar. Cada salto es un enrutador que decide por
dónde seguir, y la demora total es la suma de todos ellos más el tiempo de la
luz en la fibra, que no se puede acelerar.

También se consultó a qué dirección resuelve `netflix.com` y dónde queda esa
dirección: salió en California, no en Colombia, mientras que `google.com`
resolvía a Bogotá. Ese contraste es el argumento de las ubicaciones de borde.

El ancho de banda se midió con `iperf3` contra la propia máquina:

```bash
iperf3 -s -1 &
iperf3 -c 127.0.0.1 -t 10
```

Dio del orden de 27,9 Gbit/s, que es el ancho de banda de la memoria y no el de
una red: contra `127.0.0.1` el paquete nunca toca una tarjeta ni un cable. La
medición entre dos máquinas no se pudo hacer porque la red de la universidad
tiene bloqueado el puerto 5201, y la demostración de cambiar de país con una
red privada virtual tampoco conectó. Quedan como ejercicio para quien tenga dos
equipos en la misma red.

Los dos números no se deducen uno del otro: un enlace satelital mueve mucho
caudal con mucha demora, y una conexión de barrio responde rápido con poco
caudal.

## Escalar a lo alto o a lo ancho

Crecer hacia arriba es poner una máquina más grande. Stack Overflow sirvió
millones de usuarios al día con menos de veinte servidores potentes, y las
bases relacionales y los equipos bancarios viven ahí. Es lo más simple, porque
el programa no cambia.

Tiene dos techos. El del precio, que no es lineal: pasar de 64 a 128 GB de
memoria cuesta más de 1.200 dólares, y por encima de 128 GB se habla de más de
5.000. Y el físico, porque la ley de Moore se frenó contra el muro de la
potencia: subir la frecuencia dispara el consumo y el calor.

Crecer hacia los lados es poner más máquinas. No tiene techo de tamaño, y a
cambio aparece todo lo demás: hace falta un balanceador que reparta, software
que coordine y una forma de guardar los datos que tolere estar en varios sitios
a la vez. Ahí entran Cassandra, MongoDB y DynamoDB, y ahí aparece la
consistencia entre réplicas como problema.

Casi todo sistema real combina las dos: la base de datos crece hacia arriba con
sus réplicas, y las regiones crecen hacia los lados.

Dos casos que salieron en clase. El día sin IVA, donde las páginas de las
grandes superficies se cayeron: primero intentaron frenar la entrada desde el
navegador, que se salta fácil, y después pusieron colas de verdad. Y el viernes
negro, donde la capacidad se aprovisiona antes y se suelta después. Una cola no
responde más rápido: acepta la solicitud, la pone en fila y contesta cuando
puede, que es distinto de perderla.

## Cuando una pieza se cae

Un sistema distribuido se diseña contando con que algo va a fallar. Las dos
medidas que lo describen son el tiempo medio entre fallas y el tiempo medio de
reparación, y de ahí sale la disponibilidad, que se cuenta en nueves:

| Disponibilidad | Caída al año | Caída al mes |
|---|---|---|
| 99 % | 87,6 horas | 7,2 horas |
| 99,9 % | 8,8 horas | 43,2 minutos |
| 99,99 % | 52,6 minutos | 4,3 minutos |
| 99,999 % | 5,3 minutos | 26 segundos |

Cada nueve cuesta un orden de magnitud más que el anterior, y por eso la
pregunta no es cuántos nueves se pueden tener sino cuántos hacen falta. Para
una tienda en línea pequeña, tres nueves alcanzan; para un banco o un sistema
de energía, no.

Y hay una trampa que se ve al sumar piezas: tres servicios de tres nueves
encadenados no dan tres nueves, dan $0{,}999^3$, que son unas 2,2 horas de
caída al mes. En serie las disponibilidades se multiplican y la cadena siempre
queda peor que su peor pieza.

Lo que sostiene esa disponibilidad:

- **Replicación y sharding.** Con sharding cada dato vive en un lugar; con
  replicación vive en varios. Casi todo sistema real usa los dos a la vez.
- **Consenso.** Para que las réplicas acuerden un valor se vota por mayoría:
  con $2f+1$ nodos se toleran $f$ caídos. Raft se diseñó para ser entendible y
  es el que más se implementa. Cada decisión cuesta al menos dos rondas de red
  contra la mayoría, así que la ruta común de un sistema no pasa por ahí.
- **Transacciones distribuidas.** El protocolo de dos fases garantiza que una
  operación sobre varias máquinas ocurra completa o no ocurra, y su costo es
  que si el coordinador cae, los participantes quedan bloqueados esperando.
- **Detección de fallos.** Un nodo que no responde puede estar caído, saturado
  o al otro lado de una red rota, y desde afuera se ven igual. Por eso los
  servicios exponen una ruta de salud que contesta 200 y el balanceador deja de
  mandarle tráfico a quien no conteste.

Tres caídas que se citaron: la de 2017, cuatro horas de un servicio de
almacenamiento que se llevó medio internet por delante; la de Google en 2020,
cuarenta y cinco minutos de correo, video y archivos por un error en el sistema
de cuotas; y la de Facebook en 2021, seis horas por un cambio de enrutamiento,
con el detalle de que las herramientas internas para arreglarlo dependían del
mismo sistema caído.

## Los relojes no coinciden

Cada nodo tiene su propio reloj y ninguno coincide con otro. Sin un tiempo
común no se puede decir cuál de dos escrituras ocurrió primero, y de ahí salen
los relojes lógicos y los servicios de sincronización.

En clase se consultó en vivo la hora legal de Colombia, que el Instituto
Nacional de Metrología publica y contra la que se sincronizan los servidores
que necesitan hora confiable, entre ellos los bancarios. El protocolo es NTP y
la consulta se hace con `ntpq` o con `chronyc`, según el cliente instalado.

## Cuarenta y tres segundos

La sesión del jueves abrió con un caso y lo dejó como pregunta: el 21 de
octubre de 2018, GitHub reemplazaba un equipo óptico entre su centro de datos
de la costa este y el nodo de red que lo conecta. El enlace estuvo caído
**43 segundos**. El servicio quedó degradado **24 horas y 11 minutos**.

La respuesta llegó con el teorema CAP. Durante esos 43 segundos las dos costas
siguieron aceptando escrituras que no alcanzaron a replicarse. Al volver la
red, ninguna copia era la buena: las dos tenían datos de clientes reales.
Reconciliarlas sin perder nada fue lo que tomó el día, y GitHub lo explicó
diciendo que prefería degradar el servicio antes que arriesgar la consistencia
de los datos de sus usuarios.

## El teorema CAP

Tres propiedades, de las cuales un sistema distribuido no puede garantizar las
tres a la vez:

- **Consistencia**: toda lectura ve la última escritura confirmada.
- **Disponibilidad**: toda solicitud recibe respuesta.
- **Tolerancia a particiones**: el sistema sigue funcionando aunque la red se
  parta en dos.

La tercera no se elige. La red se parte sola, y por eso la decisión real
aparece cuando ya pasó: o se responde con datos que pueden estar viejos, o se
rechaza la operación. Un sistema sin tolerancia a particiones solo tiene
sentido en un solo nodo, que es donde están PostgreSQL o MySQL cuando no se
replican.

El escenario que se trabajó: dos nodos con `x = 3` y la red partida. Un cliente
escribe `x = 5` en un nodo y otro cliente lee `x` en el otro. Un sistema
consistente contesta que no está disponible; uno disponible contesta 3, que es
un dato viejo pero es una respuesta.

El mismo dilema en un cajero aislado de la red: la opción consistente es decir
fuera de servicio, que es lo que hacen los bancos acá; la opción disponible es
entregar hasta cierto monto y reconciliar después, asumiendo el riesgo de un
sobregiro.

| Se prefiere consistencia | Se prefiere disponibilidad |
|---|---|
| matrícula universitaria | carrito de compras |
| reserva de vuelos | red social |
| registro civil | chat |
| transferencia bancaria | nombres de dominio |

Y lo que el teorema no dice: que haya que escoger de una vez y para siempre. La
elección es por operación, no por sistema; el mismo producto puede ser estricto
en el pago y laxo en el catálogo.

## ACID y BASE

ACID describe lo que promete una transacción clásica, y se entiende con una
transferencia de 100 pesos entre dos cuentas: o se resta de una y se suma a la
otra, o no pasa nada. Restar sin sumar pierde el dinero del cliente, y sumar
sin restar quiebra al banco.

BASE es la otra forma: básicamente disponible, estado blando y consistencia
eventual. El sistema contesta siempre y promete que las copias convergen. El
ejemplo que quedó en el salón es el mensaje que alguien publica, borra a los
segundos y otros alcanzaron a ver, porque la red social es distribuida y el
borrado tarda en propagarse.

## Para seguir

- Las **diez actividades** de la sesión están en la página de ejercicios y
  piden una predicción antes de destapar cada número.
- El detalle de los siete estilos de arquitectura, con dónde se ve cada uno y
  qué cuesta, quedó en
  [Estilos de arquitectura y diagnóstico de red](./Estilos%20de%20arquitectura%20y%20diagnostico%20de%20red.md),
  junto con lo que se espera de cada tipo de enlace.
- El **proyecto final** se presentó al cierre: procesamiento de imágenes por
  lotes, con motor en C++, servicio repartido en contenedores y despliegue en
  la nube. El enunciado está en el Campus Virtual, los equipos son de tres o
  cuatro, la entrega es el domingo 13 de diciembre y la sustentación es
  presencial, el martes 15 y el jueves 17.
- El **curso de AWS** son diez módulos y conviene no dejarlo para el final.
