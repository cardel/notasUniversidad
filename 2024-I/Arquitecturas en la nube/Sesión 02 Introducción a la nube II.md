# Sesión 02: Introducción a la nube II

Fecha 23 de Julio de 2024

Tener presente: [https://learn.microsoft.com/es-es/windows/wsl/install](https://learn.microsoft.com/es-es/windows/wsl/install) 

[semana1_annotated.pdf](Sesio%CC%81n%2002%20Introduccio%CC%81n%20a%20la%20nube%20II%20d60dcf232d744bc9a81064ae124ffd60/semana1_annotated.pdf)

# Aspectos teóricos I parte

¿Que aspectos se deben considerar para prestar un servicio de software?

- Recursos hardware
- Inversiones infraestructura
- Debemos considerar picos de uso y cómo responder a ellos

Se realizó una discusión sobre las ventajas y desventajas de la nube, la nube nos ofrece capacidad variable de almacenamiento y procesamiento pero perdemos el control de dónde se almacenan los datos y ejecutan los proceso, por esta razón muchas organizaciones prefieren **esquemas híbridos**

---

Tipos de almacenamiento

- Bloques: Se referenciados por un ID
- Objetos: Se utilizan las URL (s3)
- Archivos: Sistemas de archivos enfocados a la red (HPFS, NFS, directorio activo)

---

Bases de datos

- Bases de datos de series temporales
- Bases de documentos: Firestore
- Bases de datos relacionales: Optimización de consultas
- Bases de datos no relacionales: Flexibilidad en el modelo de datos
- Bases de datos en memoria: Cache, vistas, requieren mecanismos para mantener la persistencia
- Bases de datos orientadas a grafos: Enfocadas a consultas complejas
- Bases de datos clave valor: JSON

---

Contenedores

- Paravirtualización: Aisla procesos pero los recursos son gestionados por el sistema anfitrión
- Permite aislar aplicaciones de forma efectiva
- Son livianos y fácilmente escalables

# Servicios de la nube: Consola de administración y desde los CLIs

## Contenedores locales

[https://www.docker.com/](https://www.docker.com/)

```bash
:'
Ejemplo de contenedores que contengan bases de datos
'
docker login 
docker pull postgres:latest
docker run --name psql-cont -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -p postgres -d

docker exec -it psql-cont bash #ingresar al bash del contenedor

docker stop psql-cont #detener el contenedor
docker rm psql-cont #borra el contenedor
docker image rm postgres

docker system prune -a #Si esta seguro de que esta todo
```

```yaml
services:
  db:
    image: mysql:latest
    restart: always
    environment:
      MYSQL_DATABASE: 'db'
      # So you don't have to use root, but you can if you like
      MYSQL_USER: 'user'
      # You can use whatever password you like
      MYSQL_PASSWORD: 'password'
      # Password for root access
      MYSQL_ROOT_PASSWORD: 'password'
    ports:
      # <Port exposed> : <MySQL Port running inside container>
      - '3306:3306'
    expose:
      # Opens port 3306 on the container
      - '3306'
    volumes:
      - my-db:/var/lib/mysql
volumes:
  my-db:

```

```bash
:'
esto debe ejecutar en el directori que contenga el archivo docker-compose.yaml
'
docker compose up -d #levanta los servicios
docker compose down #baja los servicios
```

## Aws cli

[https://aws.amazon.com/es/cli/](https://aws.amazon.com/es/cli/) 

```bash
#conectamos
aws configure

: '
Para hacer esto en la consola de administración ir al servicio IAM y buscar Manage Access Key y crear una
Tener en cuenta que la clave secreta solo se muestra una vez, si la pierde, debe generar otra llave
AWS Access Key ID [None]:  <id>
AWS Secret Access Key [None]: <id>
Default region name [None]: us-east-1
Default output format [None]: table
'

#Ejemplo con s3 (bucket)
#cambiar nombre-unico por uno pesado por usted
aws s3api create-bucket --bucket nombre-unico  --region us-east-1
aws s3 ls
aws s3api put-object --bucket nombre-unico --key nombre-nube --body nombre-archivo-local
aws s3api delete-bucket --bucket nombre-unico --region us-east-1
```

## Google cloud

gcloud [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install) 

```bash
gcloud auth login #Abre un navegador, se antentica por cuenta de google

gcloud projects list #Lista los proyectos

gcloud projects create usb20242 #crear un nuevo proyecto

#Gestionar la cuenta de facturación, debe crearse en la pagina
gcloud billing accounts list
gcloud billing projects link usb20242c --billing-account=<ID de la cuenta>

gcloud config set project usb20242c #Conectamos al proyecto

:'
Generamos un bucket, subimos un archivo y luego lo borramos
'

gcloud storage buckets create gs://storageusb20242 --location=us-east1
gcloud storage ls

echo "hola,que mas" >> hola.txt #Crea un archivo

gcloud storage cp hola.txt gs://storageusb20242 #Subo el archivo

:'
Reviso el archivo y el bucket
'
gcloud storage ls gs://storageusb20242
gcloud storage ls gs://storageusb20242/hola.txt
gcloud storage objects describe gs://storageusb20242/hola.txt

gcloud storage cp gs://storageusb20242/hola.txt hola2.txt #Descarga el archivo

:'
Borramos los buckets
'
gcloud storage rm gs://storageusb20242/hola.txt
gcloud storage rm gs://storageusb20242 --recursive

#Cerramos sesión
gcloud auth revoke
```

## Microsoft azure

[https://learn.microsoft.com/es-es/cli/azure/install-azure-cli](https://learn.microsoft.com/es-es/cli/azure/install-azure-cli) 

```bash
az login --use-device-code

az group create --name usb20242 --location eastus

az storage account create \
	--name mystorageusb20242 \ 
	--resource-group usb20242 \
	--location eastus \ 
	--sku Standard_RAGRS \
	--kind StorageV2 \
	--min-tls-version TLS1_2 \
	--allow-blob-public-access false
az storage container list --account-name mystorageusb20242 --subscription <id>
az resources list #Listar recursos

az storage account delete --name mystorageusb20242

az resource list #Listas recursos

az logout

```