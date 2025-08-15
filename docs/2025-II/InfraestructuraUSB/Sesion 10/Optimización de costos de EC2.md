# Modelos de precios
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html

- **Instancias bajo demanda:** Pago por hora, para cargas de trabajo variables que no se pueden detener
- **Instancias reservadas:** Modelo de pago parcial, anticipado o sin pago inicial, maneja modelos de 1 o 3 años, esto es para cargas de trabajo predecibles
- **Instancias de spot:** Utiliza la capacidad sobrante de AWS, pueden interrumpirse y son más económicas, tener en cuenta que en la interrupción se puede hibernar o detener, es para cargas de trabajo variables que se pueden detener
- **Servidores dedicados:** Que es un servidor con capacidad de EC2 dedicado a un cliente, es una plataforma de hardware sobre la cual lanzamos nuestras instancias de EC2: Restricciones asociadas al contrato o dato
- **Instancias reservadas programadas:** Reserva de capacidad en un horario recurrente seleccionado, por ejemplo 8am a 6pm entre semana.
- **Instancias dedicadas:** Se ejecuta en un hardware dedicado al cliente

# Pilares de optimización de costos

## 1. Dimensionamiento adecuado

Aprovisionar las instancias para satisfacer la necesidad minimizando la capacidad sobrante

- Optimizar los recursos CPU, memoria, almacenamiento
- Depende del tipo de instancia: en demanda, spot, reserva, etc.
- Se utiliza Cloudwatch para observar inactividad y con esto estimar el tamaño correcto
- Práctica recomendada: primero lanzar en demanda o en spot, estudiar el comportamiento y posteriormente reservar

## 2. Aumento de elasticidad

- Detener o hibernar usando EBS como respaldo aquellas instancias inactivas
- Utilizar escalado automático para establecer el tamaño correcto

## 3. Modelo de precios óptimo

- Seleccionar el tipo de instancia adecuado para la resolución del problema
- Utilizar instancias en demanda o spot para cargas de trabajo variable
- Usar instancias reservadas para cargas de trabajo predecibles
- Estudiar el uso de otros servicios como AWS Lambda o AWS Beanstalk

## 4. Optimización de las opciones de almacenamiento

- Modificar el tamaño de los EBS
- Optar por HDD en lugar de SSD si es necesario
- Utilizar otras opciones como S3 glacier para contenido de baja consulta