Es la capacidad de ofrecer capacidad de acuerdo a la demanda.
- En momentos promedio ofrecer la mínima capacidad
- En momentos pico ofrece la capacidad adecuada para responder a ellos.

Sirve para lanzar o terminar instancias de EC2 de acuerdo a la políticas o condiciones que se definan

También ayuda a recuperarse antes problemas en las instancias de EC2
# Tipos de escalado

- Manual: Mínimo y un máximo
- Programado: De acuerdo a una fecha
- Dinámico: De acuerdo a eventos en CloudWatch
- Predictivo: De acuerdo al historial de demanda de las instancias

# Grupo autoscaling

Colecciones de EC2 que se agrupan para ofrecer capacidad, estas pueden estar gestionadas por AWS Autoscaling.

- Configuración básica: Mínima capacidad
- Escalado ascendente: Aumentar capacidad
- Reducción horizontal: Reducción de capacidad

# AWS Scaling

- Usa las métricas de AWS Cloudwatch para estimar el rendimiento de los recursos de AWS
- Proporciona opciones de configuración intuitivas
- Permite escalado de:
	- Instancias EC2: demanda o sport
	- ECS
	- DynamoDB
	- Amazon Aurora

