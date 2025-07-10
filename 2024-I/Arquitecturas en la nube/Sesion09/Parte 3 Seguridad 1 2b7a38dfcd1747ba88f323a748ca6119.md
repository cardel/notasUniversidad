# Parte 3: Seguridad 1

# Modelo compartido

¿Que es?

AWS y el cliente son responsables de la seguridad de las aplicaciones y datos

- AWS: Infraestructura física y software de virtualización
- Cliente. Todo lo que pueda configurar directamente

| Servicio | Responsable |
| --- | --- |
| Actualización Servidor POSTGRES en EC2 | Cliente |
| Actualización Servidor POSTGRES en Amazon RedShift | AWS |
| Actualización software servidor de archivos en una instancia de EC2 | Cliente |
| Actualización software de Amazon S3 | AWS |

# IAM

¿Cuales son sus componentes?

- Personas o aplicaciones: Usuarios de AWS
- Grupos: Colección de usuarios o grupos
- Politica de IAM: Define a que puede tener acceso y su nivel
- Rol de IAM: Es un mecanismo para proveer permisos a servicios de AWS

---

Tipos de acceso

- Acceso mediante CLI / SDK: Mediante las llaves
- Acceso consola: ID Cuenta o alias, contraseña, puede factor de autenticación múltiple

---

## Resumen

- Autorización: Asigna permisos para una política de IAM
- Permisos determinan qué recursos y operaciones se pueden realizar
- Politica: Todo está negado por defecto, para habilitarlo se debe permitir en una regla. Denegación implicita, se determina mediante un archivo de JSON. Tienes dos tipos:
    - Basadas en identidad: Más comunes
    - Basadas en recursos: Se asocian a un recurso y no a un usuario, no todos los servicios permiten esta forma de política
- Práctica recomendada: Minimo privilegio.
- Grupos de IAM: No permiten anidamiento, no hay grupo predeterminado y un usuario puede pertenecer a varios grupos.
- En el caso que exista solapamiento de política, prevalece la DENEGACIÓN EXPLÍCITA.