# Ejemplo 2: SDK con Azure container

# Apuntes

1. Instalar las librerias azure-identity azure-storage-blob
2. Conectarse con el cli, az login esto crea en el sistema un directorio .azure (ubicado en el home del usuario) el cual contiene la información de sesión

Autenticación* pendiente

```python
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()
```

---

Conexión con el servicio de storage (Cliente)

```python
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
account_url = "https://<container-storage>.blob.core.windows.net"
blob_service_client = BlobServiceClient(account_url=account_url, credential=credential)
```

---

Acciones

1. Crear contenedor 

```python
container_client = blob_service_client.create_container(container_name, public_access="container")
```

1. Listar contenedores 

```python
containers = blob_service_client.list_containers()
```

1. Subir archivo

```python
container_client = blob_service_client.get_container_client(container_name)
blob_client = container_client.get_blob_client(blob_name)
blob_client.upload_blob(data, overwrite=True)
```

1. Descargar archivo 

```python
container_client = blob_service_client.get_container_client(container_name)
blob_client = container_client.get_blob_client(blob_name)
data = blob_client.download_blob()data = blob_client.download_blob()
data = blob_client.download_blob()
```

1. Eliminar contenedor

```python
container_client = blob_service_client.get_container_client(container_name)
container_client.delete_container()

```