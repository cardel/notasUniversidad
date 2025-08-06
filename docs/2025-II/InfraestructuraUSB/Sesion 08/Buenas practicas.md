
Prácticas recomendadas para proteger una
cuenta de AWS:
- Proteja los inicios de sesión con Multi-Factor
Authentication (MFA).
 - Elimine las claves de acceso de usuario raíz
de la cuenta.
 - Cree usuarios de IAM individuales y otorgue
permisos de acuerdo con el principio de
mínimo privilegio.
 - Utilice grupos para asignar permisos a
usuarios de IAM.
- Configure una política de contraseñas sólida.
 - Delegue el uso de roles en lugar del uso
compartido de credenciales.
- Monitoree la actividad de la cuenta mediante CloudTrail


# CloudTrail

Permite llevar logs de lo que hacen los usuarios de IAM en AWS, por defecto almacena los registros por 90 días

Si se desea más tiempo entonces hay que hacer una política de seguimiento que está ligada a un bucket s3 donde almacena los logs

Tener presente que este servicio tiene capacidades limitadas de acuerdo al plan de soporte.