# 1. Definiciones
- Informática en la nube es la entrega de recursos (procesamiento, almacenamiento u otros) a través de internet con un sistema de precios de **pago por uso**
- El enfoque es dejar de ver la infraestructura cómo hardware si no como software
	- Aspectos flexibilidad
	- Requerimientos (personal, seguridad, etc)
	- Aprovisionamiento de la capacidad
- Tenemos los 3 modelos
	- **IaaS** Infraestructura como servicio: EC2, VPC
	- **PaaS** Plataforma como servicio: Lambda, ECS, App Runner, Amplify
	- **SaaS** Software como servicio: Marketplace, API Gateway, SNS, SQS, Evenbridge
- Modelos implementación
	- **Nube**: Totalmente cloud
	- **Híbrido**: Parte local (on-premises) y parte en la nube <-- El más común por sus beneficios
	- **Privado**: Infraestructura local
- ![](attachments/Pasted%20image%2020250731185142.png)

# 2. Ventajas de la nube
1. Gastos variables: Pagamos por lo que vamos a utilizar y no tenemos los problema de estimación: subestimación que implica recursos no utilizados o sobre estimación que nuestros recursos no responden a los requerimientos
2. Economías de escala masiva: El uso de todos los clientes de AWS puede lograr que el costo por GB, unidad de procesamiento, entre otros sea menor para cada cliente. El ahorro está en que se usa una gran capacidad compartida, cada usuario obtendrá un ahorro.
3. Agilidad: Un entorno on-premises tarda en obtener recursos (burocracia) en AWS es lanzar la capacidad requerida.
4. Adquirir escala mundial en cuestión de minutos: Aprovechar las localizaciones de borde y Cloudfront
# 3. Servicios de AWS
Los servicios de AWS se manejan a través de un API, tiene 3 tipos de clientes
- Consola de administración (Interfaz Web)
- SDK Que es una librería para diferentes lenguajes de programación
- CLI que es una herramienta basada en consola
El acceso es bajo demanda y el pago es por **uso**
Elección del servicio depende de lo que se vaya a realizar
![](attachments/Pasted%20image%2020250731190616.png)

# 4. AWS WAF Well-Architectured Framework

Este framework tiene 6 pilares

**Enfocados a las capacidad empresariales**
- Negocio (Business)
- Gente (People)
- Gobernanza (Governance)
**Enfocado a capacidades ténicas**
- Plataforma (Platform)
- Seguridad (Security)
- Operaciones (operations)

## Perspectiva de negocio
- ¿La inversión en la nube responde a las necesidades?
- ¿Que beneficios comerciales se pueden obtener con pasar al cloud?
- Areas que están implicadas
	- Finanzas
	- Estrategia
	- Beneficios
	- Riesgos empresariales
- Roles: Gerentes comerciales, directores de finanzas, responsables del presupuesto y partes interesadas en la estrategia
## Perspectiva de personal
- ¿Cómo formar al personal para el uso de tecnologías cloud?
- ¿Como puedo dotar a mi personal para que haga sus laborales eficientemente?
- Áreas implicadas
	- Administración de recursos
	- Incentivos y cultura organizacional
	- Formación técnica y operativa
	- Cambios en la organización (funciones o roles)
- Roles: Directores de RRHH y personal
## Perspectiva de gobernanza

- ¿Como adaptar los procesos de la organización al cloud?
- ¿Como estos procesos ayudan a maximizar el valor de negocio y reducir los riesgos?
- Áreas implicadas
	- Gestión de Portafolios
	- Gestión de proyectos
	- Medición de rendimiento
	- Administración de licencias
- En general, es cómo se hacen los procesos en la organización considerando el cloud
- Roles: Directores de información, directores de programas, arquitectos empresariales, analistas de negocios y administradores de portafolio

## Perspectiva de la plataforma
- ¿Cómo se gestiona los recursos e infraestructura en el cloud?
- ¿Como se entienden los recursos TI en la creación de soluciones?
- Áreas implicadas
	- Capacidad de procesamiento o almacenamiento
	- Capacidad de red
	- Sistemas y soluciones de arquitectura
	- Desarrollo de aplicaciones
- Roles:  Directores de tecnología, directores de TI y arquitectos de soluciones
## Perspectiva de Seguridad
Es buscar que las aplicaciones cumplan con los objetivos de seguridad
- Accesos correctos a la información
- Protección de la información
- Buenas prácticas de seguridad en las aplicaciones
- La seguridad de cada una de las capas de la aplicación debe responder a las necesidades (uso de servicios en cada capa)
- Roles: Directores de seguridad, administradores de seguridad y analistas de seguridad

## Perspectiva de operaciones
- Como respaldamos las operaciones de negocio
- Cómo se realizan los negocios del día a día de la organización
- Como las operaciones dentro de la compañía se alienan a los objetivos de negocio
- Que cambios operativos se necesitan para alinearse con la nube
- Roles: Directores de operaciones y directores de soporte

## Tabla Comparativa: Pilares del AWS Cloud Adoption Framework (CAF)

| **Pilar**       | **Enfoque**                                                                 | **Preguntas Clave**                                                                 | **Áreas Implicadas**                                                                 | **Roles Principales**                                                                 |
|----------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| **Negocio (Business)** | Alinear la adopción de la nube con los objetivos estratégicos y financieros de la organización. | - ¿La inversión en la nube responde a las necesidades?<br>- ¿Qué beneficios comerciales ofrece la nube? | - Finanzas<br>- Estrategia<br>- Beneficios<br>- Riesgos empresariales | Gerentes comerciales, CFOs, responsables de presupuesto. |
| **Personas (People)** | Preparar al personal para trabajar eficientemente en un entorno cloud. | - ¿Cómo capacitar al equipo en tecnologías cloud?<br>- ¿Cómo adaptar roles y cultura organizacional? | - Gestión de talento<br>- Capacitación técnica<br>- Cambios organizacionales | Directores de RRHH, líderes de equipos. |
| **Gobernanza (Governance)** | Adaptar procesos organizacionales para maximizar el valor y reducir riesgos en la nube. | - ¿Cómo adaptar los procesos al cloud?<br>- ¿Cómo gestionar portafolios y proyectos? | - Gestión de proyectos<br>- Medición de rendimiento<br>- Administración de licencias | CIOs, arquitectos empresariales, administradores de portafolio. |
| **Plataforma (Platform)** | Gestionar la infraestructura y recursos TI en la nube para crear soluciones efectivas. | - ¿Cómo gestionar recursos cloud?<br>- ¿Qué arquitectura TI se necesita? | - Cómputo y almacenamiento<br>- Redes<br>- Desarrollo de aplicaciones | CTOs, directores de TI, arquitectos de soluciones. |
| **Seguridad (Security)** | Garantizar que las aplicaciones cumplan con estándares de seguridad y protección de datos. | - ¿Cómo proteger la información?<br>- ¿Qué controles de acceso implementar? | - Control de accesos<br>- Cifrado de datos<br>- Seguridad por capas | CISOs, administradores de seguridad. |
| **Operaciones (Operations)** | Asegurar que las operaciones diarias estén alineadas con los objetivos de negocio en la nube. | - ¿Cómo optimizar operaciones en la nube?<br>- ¿Qué cambios operativos son necesarios? | - Soporte técnico<br>- Monitoreo<br>- Automatización | Directores de operaciones, equipos de soporte. |

