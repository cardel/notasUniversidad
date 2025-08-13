Es un servicio de DNS, traducción de nombres a direcciones IP, también sirve para localizar servicios (dirección ARN)

- Enrutamiento simple: Uso en entornos de un solo servidor
- Enrutamiento de Weighted round robin: asigne ponderaciones a conjuntos de
registros de recursos para especificar la frecuencia
- **Enrutamiento de latencia: ayude a mejorar sus aplicaciones globales**
- Enrutamiento de geolocalización: tráfico de ruta en función de la ubicación de los usuarios.
- Enrutamiento de geoproximidad: tráfico de ruta en función de la ubicación de los
recursos.
- **Enrutamiento de conmutación por error: Conmutación por error a un sitio de respaldo si su sitio principal se vuelve inaccesible**
	- Se valida que el recurso responda, si no lo hace se da la ubicacion del respaldo
	- Permite utilizar recursos de forma interregional
- Enrutamiento de respuesta con varios valores: responda a las consultas de DNS con hasta ocho registros con buen estado seleccionados al azar