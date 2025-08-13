El problema con el acceso a recursos, son los saltos, entre más lejos esté el recurso más enrrutadores debe pasar, implicando mayor latencia.

## Redes entrega de contenido (CND)
- Está distribuido globalmente
- Copias de cache de archivos solicitados populares
- Entrega una copia local del contenido desde una ubicación de borde cache o un punto de presencia
# Estructura
1. Ubicaciones perimetrales: Son para contenido de alta solicitud
2. Cache perimetral regional: Esto para contenido no tan popular

# Apuntes

En general Cloudfront se tiene:

1. La sincronización de los recursos se hace por medio de redes propias de AWS de alta velocidad
2. Las aplicaciones deben considerar el uso de cache y la sincronización, este servicio se integra muy con AWS SQS
3. El trafico saliente se cobra y las solicitudes HTTPS
4. También el tema de invalidación de rutas (sincronización) y por el uso de SSL