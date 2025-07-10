# Parte 1 despliegue app

# Notas

1. PAAS: Plataforma como servicio: Es un servicio sobre el cual podemos construir servicios
2. IAAS: Infraestructura como servicio: Nos permite tener procesamiento o almacenamiento como servicio
3. SAAS: Software como servicio: Es una aplicativo que nos provee servicios

# Ejemplo

## Aplicación local

Vamos a construir una aplicación local en flask que nos provee unos endpoints sencillos

[https://gist.github.com/cardel/acd9a6dd7eddf608c4674dfe6131376d](https://gist.github.com/cardel/acd9a6dd7eddf608c4674dfe6131376d)

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

[https://gist.github.com/cardel/84254b214e11fbd15974a7a86a259699](https://gist.github.com/cardel/84254b214e11fbd15974a7a86a259699)

```bash
docker compose up -d #levanta el servidor no-attach (proceso aparte)
docker compose down #quiero bajar el servicio
```

## Ejemplo de despliegue en Microsoft Azure

```bash
Autenticarse
az login --use-device-code

#Creamos el grupo de recursos
az acr create --resource-group usb20242 --sku Basic

#Crear el registro de contenedores (PAAS)
az acr create --resource-group usb20242 --sku Basic --name flaskapp

#Autenticamos en el ACR
az acr login --name flaskapp

#Tag de la imagen en nuestro Docker local
docker ps -a #Revisar el nombre
':
El nombre suele ser
<carpeta> "-" web
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

[Sesión 03: PAAS/IAAS/SAAS I](Parte%201%20despliegue%20app%20cc8e1098f6c54c96b3c0df7c2d4915a6/Sesio%CC%81n%2003%20PAAS%20IAAS%20SAAS%20I%2003f8d6a3ddb842cab5aa7760ccb778f9.md)