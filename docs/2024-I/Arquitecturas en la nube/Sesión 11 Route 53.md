# Sesión 11: Route 53, Cloudfront, EC2

# Route 53

¿Que es?

Servicio de resolución de nombres DNS implementado dentro de AWS

---

¿Que nos ofrece?

- Resolución de nombres basados en localización geográfica buscando la menor latencia con el cliente
- Redirección en caso de errores, por ejemplo un nodo caído

---

¿Que ventajas ofrece para mi organización?

- Baja latencia con mis clientes sin importar su ubicación geográfica
- Redireccionar tráfico cuando hay problemas con alguna de las instancias (alta disponibilidad)

# Cloudfront

¿Que es?

Es un servicio de cache de contenido estático, que provee cercanía  a los usuarios, es decir se busca menores latencias

---

¿Que tipos de ubicaciones?

1. Ubicaciones perimetrales: Son cercanos a los clientes, pensado para contenido muy popular
2. Cache permetral regional, son cercanos a los centros de datos, pensado para contenido importante pero no muy popular