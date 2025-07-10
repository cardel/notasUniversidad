# Laboratorio 1 con AWS Cli

# Archivo de credenciales

<ruta de usuario>/.aws/credentials

```toml
[default]
aws_access_key_id=><>
aws_secret_access_key=<>
aws_session_token = <>

[user1]
aws_access_key_id=<>
aws_secret_access_key=<>
aws_session_token = <>
```

Para cambiar de usuario editamos la variable de entorno AWS_PROFILE

# Archivo de configuración

<ruta de usuario>/.aws/credentials

```bash
[default]
aws_access_key_id=<>
aws_secret_access_key=<>

[user-1]
aws_access_key_id=<>
aws_secret_access_key=<>

[user-2]
aws_access_key_id=<>
aws_secret_access_key=<>

[user-3]
aws_access_key_id=<>
aws_secret_access_key=<>

```

<ruta de usuario>/.aws/config

```toml
[default]
region = us-east-1
output = table

[profile user-1]
region = us-east-1
output = table

[profile user-2]
region = us-east-1
output = table

[profile user-3]
region = us-east-1
output = table
```

# Comandos

```bash
#Listar usuarios
aws iam list-users

#Listar grupos
aws iam list-grupos

#Politicas de cada grupo
aws iam list-attached-group-policies --group-name "S3-Support"
aws iam list-attached-group-policies --group-name "EC2-Admin"
aws iam list-attached-group-policies --group-name "EC2-Support"

#Ver detalles de la politica
aws iam get-policy --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

#Agregar un usuario a un grupo
aws iam add-user-to-group --user-name user-1 --group-name S3-Support
aws iam get-group --group-name S3-Support
aws iam add-user-to-group --user-name user-2 --group-name EC2-Support
aws iam get-group --group-name EC2-Support
aws iam add-user-to-group --user-name user-3 --group-name EC2-Admin
aws iam get-group --group-name EC2-Admin

#Tareas usuario 1
export AWS_PROFILE=user-1
#Windows CMD
#AWS_PROFILE=user-1
aws s3 ls
aws s3 ls --profile user-1
aws ec2 describe-instances --region us-east-1 --profile user-1
aws ec2 stop-instances --instance-ids i-091f8ea9b1a40626f
aws ec2 describe-instances --instance-ids i-091f8ea9b1a40626f
```