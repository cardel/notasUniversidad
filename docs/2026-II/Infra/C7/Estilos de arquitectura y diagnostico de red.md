# Estilos de arquitectura y diagnóstico de red · Infra C7

Lo que la sesión deja planteado y aquí queda escrito con calma: los siete
estilos con los que se describe un sistema distribuido, y las dos medidas con
las que se diagnostica un enlace antes de culpar al programa.

## Componentes y conectores

Un **componente** es un módulo con interfaz definida que encapsula una
responsabilidad y se puede reutilizar. Un **conector** es el canal por el que
dos componentes se comunican. Describir una arquitectura es decir qué
componentes hay y por qué conectores hablan; los siete estilos de abajo son
las combinaciones que más se repiten.

## Los siete estilos

### Cliente-servidor

Un componente pide y otro responde. Es el más simple y sigue siendo el más
común: HTTP con el navegador, el correo con SMTP e IMAP, una aplicación contra
su servidor de base de datos.

Funciona hasta que la escala obliga a dividir el servidor, y ahí es donde
empiezan los demás estilos.

### En capas

Cada capa ofrece servicios a la de arriba y consume los de la de abajo:
navegador, servidor web, lógica de negocio, base de datos. Django, Spring MVC
y Laravel se organizan así, y también la banca con su front, su middleware y
su core.

Lo que cuesta: cada solicitud atraviesa todas las capas y cada salto suma
latencia aunque no haga trabajo útil. La capa de abajo atiende a todo lo que
está encima y es la primera en saturarse, y un cambio de contrato entre dos
capas se propaga hacia arriba.

### Microservicios

El sistema se parte en servicios pequeños, cada uno con su despliegue y su
equipo. Netflix pasa de mil, Amazon lo impuso en 2002 con el mandato de que
cada equipo expusiera sus datos como servicio, y Uber migró de monolito a unos
2.200 entre 2014 y 2020.

Lo que cuesta: lo que en un monolito era una llamada a función se vuelve una
llamada por red con latencia, reintentos y errores parciales. Los datos dejan
de estar en la misma transacción, y hacen falta métricas y trazado distribuido
para saber por dónde pasó una solicitud.

**La ley de Conway** explica por qué una organización termina con la
arquitectura que tiene: el sistema copia la estructura de comunicación de
quien lo construye. Para tener servicios que se desplieguen por separado hacen
falta equipos que decidan por separado, y por eso el monolito sobrevive donde
todos comparten un mismo proceso de despliegue.

**La observabilidad** es saber qué pasa adentro a partir de lo que el sistema
emite hacia afuera. Con un monolito basta un registro; con cincuenta servicios
se arma con dos piezas: métricas y monitoreo, con Prometheus guardando series
de tiempo y Grafana graficándolas, y trazado distribuido, con Jaeger o Zipkin
siguiendo una misma solicitud por todos los servicios que tocó.

### Entre pares

No hay nodo central: cada par es cliente y servidor a la vez, y la capacidad
crece con el número de participantes. BitTorrent reparte un archivo grande
entre todos los que lo tienen, cada nodo de Bitcoin guarda su copia de la
cadena, IPFS reparte un sistema de archivos y el Skype original llevaba voz
así.

Lo que cuesta: sin coordinador, encontrar quién tiene un dato exige protocolos
de descubrimiento y tablas de hash distribuidas, y mantenerlos con nodos que
entran y salen es difícil. Y como cualquiera puede unirse, hay que asumir
pares que mienten, que sirven contenido alterado o que inundan la red con
identidades falsas.

### Centrada en datos

Un repositorio central integra los datos y los componentes lo consultan y lo
actualizan. Es la figura de un almacén analítico como Snowflake o BigQuery,
de un lago de datos sobre el que operan varios motores, y de un ERP alrededor
de su base corporativa.

Lo que cuesta: el repositorio recibe el tráfico de todos y se vuelve el cuello
de botella, además del punto donde una caída detiene todo. Crecer suele
significar agrandar esa única pieza, con el techo de la escala vertical.

### Orientada a servicios

Servicios independientes con contratos formales, que se descubren y se
consumen entre dependencias distintas. Se ve en bancos con un bus empresarial
que conecta sistemas heredados, en aseguradoras con servicios para cotización
y reclamos, y en integraciones entre entidades del Estado.

Lo que cuesta: el formalismo de SOAP, WSDL y los estándares WS-\* pesa en cada
llamada, y el bus central concentra enrutamiento y transformación hasta
volverse una pieza que nadie se atreve a tocar.

**La diferencia con microservicios**, que es la pregunta de todos los
semestres: la orientada a servicios es más pesada y sus piezas son más
grandes; los microservicios son más livianos, hablan por HTTP o gRPC y
favorecen que cada equipo despliegue el suyo.

### Basada en eventos

Los componentes producen y consumen eventos por un canal común, sin
conocerse entre ellos. Uber publica cada cambio de ubicación en Kafka y
decenas de servicios reaccionan; LinkedIn movió su plataforma a Kafka en 2011;
los sensores de IoT emiten en flujo; una tienda publica que se creó un pedido
y el inventario, la facturación y las notificaciones reaccionan en paralelo.

Lo que cuesta: el orden de los eventos y la entrega repetida pasan a ser
problema de quien consume, y seguir una operación completa exige reconstruir
la cadena de eventos que la compuso.

## Los siete, lado a lado

| Estilo | Dónde vive el estado | Qué cuesta |
|---|---|---|
| Cliente-servidor | en el servidor | el servidor es el techo |
| En capas | en la capa de persistencia | cada salto suma latencia y la capa de abajo se satura |
| Microservicios | repartido, uno por servicio | despliegues, contratos y red por todas partes |
| Entre pares | en todos los pares | descubrimiento, y pares en los que no se puede confiar |
| Centrada en datos | en el repositorio | el repositorio recibe todo y crece hacia arriba |
| Orientada a servicios | en cada servicio, con contrato | el formalismo y el bus central |
| Basada en eventos | en el registro de eventos | el orden y la entrega repetida los resuelve quien consume |

Los estilos no son cajones excluyentes: lo normal es que un sistema combine
dos o tres. Microservicios que se comunican por eventos, o una aplicación en
capas cuyo almacenamiento es compartido, son las mezclas más frecuentes.

## Diagnosticar un enlace antes de culpar al programa

La latencia y el ancho de banda son dos números que no se deducen uno del
otro, y cada uno tiene su herramienta.

### Lo que se espera de cada enlace

| Enlace | Throughput | Demora de respuesta |
|---|---|---|
| Gigabit cableado | 900 a 940 Mbit/s | bajo 1 ms |
| Wifi de 5 GHz con buena señal | 200 a 400 Mbit/s | 2 a 10 ms, con `mdev` alto |
| Salida a internet | lo contratado con el proveedor | 10 a 60 ms a la región |
| Loopback | decenas de Gbit/s | cerca de 0,03 ms |

Una transferencia real siempre queda por debajo de esa cifra. Medido con
`curl` sobre un archivo de 50 MB:

```bash
curl -s -o /dev/null -w 'total: %{time_total} s  velocidad: %{speed_download} B/s\n' \
     'https://speed.cloudflare.com/__down?bytes=52428800'
```

```
total: 1.512595 s  velocidad: 34661538 B/s
```

Son 34,7 MB/s, unos 277 Mbit/s. La brecha contra el número de `iperf3` se
explica sola: un solo flujo TCP descubre la ventana desde cero y se frena con
cada pérdida, mientras que `iperf3 -P 4` reparte ese riesgo entre cuatro; TLS
agrega el saludo inicial y cifra cada byte; y si el archivo se escribe en vez
de irse a `/dev/null`, el límite pasa a ser el disco.

Contra la propia máquina la brecha se ve en limpio: `iperf3` informó
27,9 Gbit/s y ese mismo loopback, sirviendo un archivo de 300 MB por HTTP con
un solo flujo, dio 1.317.789.276 B/s, unos 10,5 Gbit/s. Mismo camino, un
tercio del número.
