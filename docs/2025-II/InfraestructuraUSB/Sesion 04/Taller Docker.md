
## Como probar

```bash
#Usar postman con las URL
curl -X GET -G localhost:5000/mult -d "a=10" -d "b=40"
curl -X GET -G localhost:5000/mult -d "a=10" -d "b=40"
curl -X POST localhost:5000/div -d "a=10" -d "b=50"
curl -X GET -G localhost:5000/mult -d "a=10" -d "b=40"
curl -X POST localhost:5000/div -d "a=10" -d "b=50"
```

## Implementación local

### Usando ambientes virtuales (python)

Es dependiente de las versiones en el sistema operativa

```bash
#Requiere levantar un ambiente con las dependencias
python -m venv vnev
source venv/bin/activate
pip install pip --upgrade
pip install -r requirements.txt

#Levantamos el servidor
python -m flask --host=0.0.0.0
```

### Implementación usando docker

- Aplicación de Docker https://gist.github.com/cardel/acd9a6dd7eddf608c4674dfe6131376d 
- Archivos de configuración [https://gist.github.com/cardel/84254b214e11fbd15974a7a86a259699](https://gist.github.com/cardel/84254b214e11fbd15974a7a86a259699)

```bash
docker compose up -d #levanta el servidor no-attach (proceso aparte)
docker compose down #quiero bajar el servicio
```

## Imagen de ejemplo

```bash
 docker pull cardel87/ejemplousb
```


## Despliegue en AWS

# Despliegue de Aplicación Flask en AWS con ECS Fargate

Este documento contiene los pasos para desplegar una aplicación Flask contenida en Docker usando **Amazon ECS Fargate** y **Amazon ECR**.

---

## Requisitos Previos

- Docker instalado
- AWS CLI configurado (`aws configure`)
- Imagen local de Docker llamada `ejemplo-web`

---
## Recursos

```bash
#obtener datos de la cuenta
aws sts get-caller-identity --query Account 

#obtener region
aws configure get region

#obtener VPC
aws ec2 describe-vpcs \
  --query "Vpcs[*].{ID:VpcId,CIDR:CidrBlock,IsDefault:IsDefault}" \
  

#obtener subredes
aws ec2 describe-subnets --query "Subnets[*].{ID:SubnetId,CIDR:CidrBlock,AZ:AvailabilityZone}"

#obtener grupo de seguridad
aws ec2 describe-security-groups \
  --query "SecurityGroups[*].{ID:GroupId,Name:GroupName}" \


```

## Despliegue en AWS

### 1. Autenticarse en AWS CLI

```bash
aws configure
```

Ingresa:

- **Access Key ID**
- **Secret Access Key**
- **Región** (por ejemplo, `us-east-1`)
- **Formato**: `json` recomendado

Tener en cuenta que el session token no se puede configurar por aqui

### 1. 2 Alternativa

#### En linux
Editar el archivo de configuración ~/.aws/credentials

No olvidar el archivo
~/.aws/config

#### En windows

En Windows suponiendo que su usuario es pepito

C:/Users/pepito/.aws/ Deben habilitar el explorador de Windows con archivos ocultos y del sistema, puede hacerse con CMD o Powershell

### 2. Crear repositorio en Amazon ECR

```bash
aws ecr create-repository --repository-name flaskapp
```


### 3. Autenticarse en ECR

```bash
aws ecr get-login-password \
  | docker login --username AWS \
    --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
```

_Reemplaza `<account-id>` y `<region>` por los valores de tu cuenta._


### 4. Etiquetar la imagen local

```bash
docker tag ejemplo-web <account-id>.dkr.ecr.<region>.amazonaws.com/flaskapp:latest
```


### 5. Subir la imagen a ECR

```bash
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/flaskapp:latest
```


### 6. Crear un clúster en ECS

```bash
aws ecs create-cluster --cluster-name flask-cluster
```
---

### 7. Crear definición de tarea para Fargate

Guarda lo siguiente como `task-definition.json`:

```json
{
  "family": "flaskapp-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "flaskapp",
      "image": "<account-id>.dkr.ecr.<region>.amazonaws.com/flaskapp:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "essential": true
    }
  ]
}
```

Registrar la definición:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```
### 8. Crear el servicio en ECS con Fargate

> Asegúrate de tener una **subred pública** y un **grupo de seguridad** que permita el puerto 5000 (o 80).

```bash
aws ecs create-service \
  --cluster flask-cluster \
  --service-name flaskapp-service \
  --task-definition flaskapp-task \
  --launch-type FARGATE \
  --desired-count 1 \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxx],securityGroups=[sg-xxxxxxxx],assignPublicIp=ENABLED}"
```

Reemplaza:

- `subnet-xxxxxxxx`: con el ID de tu subred
- `sg-xxxxxxxx`: con el ID de tu grupo de seguridad

### 10. Alternativa: AWS App Runner

Si deseas una forma más sencilla de desplegar desde ECR:

Archivo *apprunner-source.json*

```json
{
  "ImageRepository": {
    "ImageIdentifier": "cardel87/ejemplousb:latest",
    "ImageRepositoryType": "DOCKER_HUB",
    "ImageConfiguration": {
      "Port": "5000"
    }
  },
  "AutoDeploymentsEnabled": true
}
```

```bash
aws apprunner create-service \
  --service-name flaskapp \
  --source-configuration file://apprunner-source.json
```

## Despliegue Microsoft Azure

### Recursos

- AZ CLI https://learn.microsoft.com/es-es/cli/azure/install-azure-cli?view=azure-cli-latest 

### Pasos
```bash
#Autenticarse
az login --use-device-code

# Verificar login
az account show

#Obtener los grupos de rcursos
az group list --query "[].name"

# En caso que no hayan grupos de recursos
# az group create --name <nombre-grupo> --location eastus

#Registrar el servicio
az provider register --namespace Microsoft.ContainerRegistry


#Crear el registro de contenedores (PAAS)
az acr create --resource-group <nombre-grupo> --sku Basic --name flaskapp

#<nombre-grupo> es el grupo de recursos
# flaskapp es el nombre del contenedor

# Revisar que esté creado
az acr list --query "[].name"


#Autenticamos en el ACR (Importante)
az acr login --name flaskapp

#Tag de la imagen en nuestro Docker local
docker image ls #Revisar el nombre (tag)
':
Y aqui buscar el nombre de la imagen, voy a suponer que es ejemplo-web
'
docker tag ejemplo-web flaskapp.azurecr.io/app

#Subimos el repositorio
docker push flaskapp.azurecr.io/app

#Verificamos
az acr repository show --name flaskapp --repository app


#Creamos el plan (asignamos capacidades a nuestro webapp)
az appservice plan create \
	--name basico \
	--resource-group usb20242 \
	--sku B1 \
	--is-linux \
	--number-of-workers 2
	
#Habilito acceso de administrador al ACR
az acr update --name flaskapp --admin-enabled true

#Creo el webapp
az webapp create \
	--resource-group usb20242 \
	--plan basico \
	--name flaskapp-web \
	--deployment-container-image-name flaskapp-azurecr.io/app:latest

#Configuro el webapp

ACR_USERNAME=$(az acr credential show --name flaskapp --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name flaskapp --query "passwords[0].value" -o tsv)

az webapp config container set \
  --name flaskapp-web \
  --resource-group usb20242 \
  --docker-custom-image-name flaskapp.azurecr.io/app:latest \
  --docker-registry-server-url https://flaskapp.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
  
az webapp config appsettings set \
  --resource-group usb20242 \
  --name flaskapp-web \
  --settings WEBSITES_PORT=5000
```