# Sesión 01: Introducción a la nube I

Fecha: 18 de Julio de 2024

## Recursos

- [https://d1.awsstatic.com/es_ES/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Sample-Questions.pdf](https://d1.awsstatic.com/es_ES/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Sample-Questions.pdf) Ejemplo de examen de Cloud practioner
- [https://pokeapi.co](https://pokeapi.co/) Ejemplo API
- [https://www.educalive.com/blog/metodo-cornell-tomar-apuntes](https://www.educalive.com/blog/metodo-cornell-tomar-apuntes) Notas de Cornell
- [https://developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform) Terraform (Infraestructura como codigo)

## Introducción a la nube

¿Que es la nube?

Un conjunto de servicios que pueden accederse desde **cualquier lugar** tenemos “nube” ofrecida por diferentes proveedores: AWS, AZURE, GCLOUD

---

Definiciones de la nube

Aspectos

Su filosofia

1. Bajo demanda: Tengo los recursos cuando los **NECESITO** (escalar necesidad) pensar en picos de solicitudes
2. Se accede a través de internet (Existen nubes privadas) Github/Bitbucket/Gitlab se pueden montar en servidores internos
3. Pago por uso: Bajo demanda, sin embargo esto depende del proveedor, suelen ofrecer planes

---

Modelo de informatica

Tradicional: Consiste en instalar una capacidad de Hardware localmente ← ¿Escalabilidad? ¿Relacion costo beneficio? ¿Mantenibilidad?

Nube: Ver el hardware como software

1. La capacidad local es controlada directamente por la organización, en caso de la nube es controlada por un tercero
2. En el modelo tradicional la organización asume el rol de gestionar la capacidad. personal, mantenimiento, etc,m en el modelo de la nube se delega a un tercero
3. El modelo tradicional requiere una buena planificación de los recursos ¿Cuanto adquirimos? mientras que en el modelo de la nube es delegado al proveedor, además se nos puede proporcionar capacidad flexibile (cambiante)

---

Modelos de servicios

1. IAAS: Infraestructura como servicio: Capacidad almacenamiento o procesamiento
2. PAAS plataforma como servicio, entornos preconfigurados para creación de soluciones en software.
3. SaaS Software como servicio: Es el uso de una aplicación como usuario final

---

Modelos de implementación

- Nube
- Hibrido
- Nube privada

- Nube se encuentra distribuida en diferentes localizaciones fisicas: distribuida y es accesible a lo largo de internet
- Nube privada: Es una infraestructura local (Ejemplo son los servicios de repositorios de archivos)
- Esquema hibrido: Es una combinación de nube publica y privado

---

Diferencias entre el esquema de la nube y el modelo tradicional

1. Seguridad
2. Redes
3. Informática : Recursos
4. Almacenamiento

1. Seguridad: En el esquema tradicional es un personal que tiene acceso directo al hardware y configuración ACL (Capas de acceso: ¿Que Equipos pueden acceder a los recursos y como lo hace?,  Firewalls (Reglas de acceso) en el caso de la nube son directamente desde los servicios de gestion de recurso (IAM)
2. Redes: Modelo tradicional Cables, routers, switches repetidores, etc Modelo de Nube: APlicaciones o servicios para configurar redes virtuales con los componente equivalentes  las redes fisicas.
3. Recursos (Informatica) Modelo Tradicional: Servidores y equipos, Modelo de la nube: Maquinas virtual (Virtualizacion total / paravirtualizacion)
4. Almacenamiento: Modelo tradicional: Discos duros, memorias, cintas, bases de datos Modelo de la nube: Servicios que nos ofrece almacenamiento (archivos, datos estructurados) bases de datos (Relacionales o no relacionales)

### Resumen

- La nube ofrece recursos sobre demanda a diferencia de la tradicional que escala difícilmente
- La nube permite ver la infraestructura como software:  Abstracción
- Modelos: PAAS, SAAS y IAAS
- Implementaciones: Nube publica, esquema hibrido y nube privada
- Casi todo lo que hacemos en DS (Aplicaciones,, API, CRM, etc) podemos tenemos tambien la nube, ya para casos muy especificos necesitamos un esquema hibrido

### Resumen IA

La sesión 01 introduce el concepto de la nube, destacando sus características principales como la disponibilidad bajo demanda, el acceso a través de internet y el pago por uso. Se comparan los modelos de informática tradicional y en la nube, enfatizando la escalabilidad, la gestión de recursos y los costos. Además, se describen los modelos de servicio (IaaS, PaaS, SaaS) y los modelos de implementación (nube pública, híbrida y privada). Finalmente, se destacan las diferencias en seguridad, redes, recursos informáticos y almacenamiento entre el modelo tradicional y el modelo en la nube.

# Ventajas de la nube

Economias de escala

Pagar por demanda, es decir pago lo que uso versus pagar por infraestructura completa quizas subutilizada

---

Escalabilidad

Tener la capacidad de procesamiento y almacenamiento a medida de lo que necesite

Tener la posibilidad de tener recursos en **diferentes localizaciones geograficas**

## Resumen

Las ventajas vienen dadas por el uso de recursos bajo demanda, es decir pago justo por lo que utilizo y la posibilidad de escalar recursos en diferentes localizaciones geográficas

# Servicios en la nube

Servicios Web

- Formato estandarizado para el intercambio de información
- Suele intercambiarse información a través de los APIs

1. Formato estandarizados suelen ser por etiquetas (XML, HTML), JSON (Estructura de mapa clave:valor)  Serializacion (YAML)
2. APIs son servicios que requieren seguridad, mantenimiento, escalación

---

Que son servicios en la nube

- Son servicios seguros ubicados en diferentes localizaciones
- Acceso y pago bajo demanda
- Los servicios trabajan en conjunto (integrar)

---

Categorias

1. Procesamiento
2. Análisis de datos
3. Machine Learning
4. Redes virtuales
5. Multimedia
6. Herramientas para DS
7. Bases de datos
8. Entre otros

Los servicios se ofrecen en diferentes categorías, cada uno ofrece diferentes funcionalidades de acuerdo a lo que se requiere.

![Untitled](Sesio%CC%81n%2001%20Introduccio%CC%81n%20a%20la%20nube%20I%2019d1e89b999f4d66b390bd83ea4473d7/Untitled.png)

## Interacción con los servicios

Consola de administración

Interfaz Web para gestionar los recursos

---

Interfaz de línea de Comandos

Gestiona los recursos desde el interprete de comandos

1. aws cli
2. gcloud
3. az cli

---

SDK

Permiten gestionar recursos desde un entorno de programación que puede gestionar infraestructura y servicios —> Terraform

## Resumen

Los servicios Web utilizan diferentes protocolos para el intercambio de información y requieren microservicios (por ejemplo API) para su funcionamiento.

La nube ofrece servicios seguros en muchas categorias ofreciendo escalabilidad, seguridad, mantenibilidad y diferente localización mediante la gestión usando consola de administración, interfaz de linea de comandos o SDK.