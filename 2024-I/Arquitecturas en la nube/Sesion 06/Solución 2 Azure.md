# Solución 2: Azure

```bash
#Recordar usar herramienta func
func init apipersonasazure --python

#Crear recurso en azure
az functionapp create \
	--resource-group <grupo> \
	--consumption-plan-location eastus \
	--runtime python \
	--runtime-version 3.11 \
	--functions-version 4 \
	--name <nombre-funcion> \
	--os-type linux \
	--storage-account <storage-account>
:'
Recordar cambiar nombres de los recursos, nombre y storage accout dea cuerdo a su configuración
:'
```

Editar el archivo function_app.py

[https://gist.github.com/cardel/b8b4b52ac1a11b622532c310b976bef3](https://gist.github.com/cardel/b8b4b52ac1a11b622532c310b976bef3)

En el archivo requeriments.txt colocar

```python
azure-functions
azure-storage-blob
azure-core
```

Para pruebas locales editar el archivo local-settings.json asi:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "STORAGE_CONNECTION_STRING": "cadena de conexión obtenida del container storage"
  }
}

```

Pruebas locales

```bash
func start #iniciar pruebas locales
```

```bash
curl -X POST http://localhost:7071/api/upload \
     -H "Content-Type: text/csv" \
     --data-binary @data.csv

curl -X POST http://localhost:7071/api/getPerson \
     -H "Content-Type: application/json" \
     -d '{"cedula": "100000001"}'

curl -X POST http://localhost:7071/api/searchCargo \
     -H "Content-Type: application/json" \
     -d '{"cargo": "Ingeniero"}'

curl -X PUT http://localhost:7071/api/addPerson \
     -H "Content-Type: application/json" \
     -d '{"Cedula": "100000200", "Nombre": "Luis García", "Direccion": "Calle Luna 123", "Telefono": "555-3456", "Cargo": "Doctor"}'

curl -X DELETE http://localhost:7071/api/deletePersona \
     -H "Content-Type: application/json" \
     -d '{"cedula": "100000001"}'
```

## Desplegar

```bash
func azure functionapp publish <nombrefuncioncreada>
```

Cambiar URL localhost.7071 por la dada por Azure