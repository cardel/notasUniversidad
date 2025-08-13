# Grupos de seguridad

- Son a nivel de recurso (instancia)
- Por defecto deniegan el tráfico entrante y permite el saliente
- Se evalúan todas las reglas antes de tomar una decisión
- **son con estado** que se recuerda permitir o denegar un paquete de salida de acuerdo al paquete entrante
- Sólo reglas de permiso

# ACL
- Son nivel de subred
- Tienen reglas de entrada y salida independientes
- Por defecto permiten todo el tráfico entrante y saliente
- **Sin estado** el tráfico de salida se debe autorizar explicitamente
- Se evalúan de forma ascendente de acuerdo al número de la red y se aplica la que se encuentre primero.
- Reglas de permiso y denegación