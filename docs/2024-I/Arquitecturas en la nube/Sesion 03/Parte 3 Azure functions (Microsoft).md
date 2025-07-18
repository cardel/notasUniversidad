# Parte 3 Azure functions (Microsoft)

- Se deben instalar utilidades en la linea de comandos a usando las extensiones de Visual Studio Code
- Revisar documentacion [https://learn.microsoft.com/en-us/azure/azure-functions/](https://learn.microsoft.com/en-us/azure/azure-functions/)

## Ejemplo Python

En el caso debe ejecutar

```bash
func new --name azurefun --template "HTTP trigger" --authlevel "anonymous"
```

O crear desde el visual studio code

Editar el archivo function_app.py asi:

[https://gist.github.com/cardel/d9966c08a88dd2635dc4dac3124e1231](https://gist.github.com/cardel/d9966c08a88dd2635dc4dac3124e1231)

```bash
#probar localmente
func start
```

Si todo sale bien debe salir un mensaje asi

```bash
Functions:

	div_numbers: [POST] http://localhost:7071/api/div

	hello_world:  http://localhost:7071/api/hello

	mult_numbers:  http://localhost:7071/api/mult

	sub_numbers: [POST] http://localhost:7071/api/sub

	sum_numbers:  http://localhost:7071/api/sum
```

Crear recursos y deploy

```bash

#crear grupo si tiene problemas
az group create --name ejemplito --location eastus

#crear storage
az storage account create --name usb20242storage --location "eastus" --resource-group usb20242 --sku Standard_LRS

#crear funcion
az functionapp create 
--os-type linux \
--resource-group usb20242 --consumption-plan-location "eastus" \
--runtime python --runtime-version 3.11 --functions-version 4 --name cardelwebappfunc --storage-account cardelstorage

#ubicarse en el directorio donde esta la función y ejecutar
func azure functionapp publish usb20242funcionapp
```

Si todo sale bien debe salir un mensaje asi:

```bash
Functions in usb20242funcionapp:
    div_numbers - [httpTrigger]
        Invoke url: https://usb20242funcionapp.azurewebsites.net/api/div

    hello_world - [httpTrigger]
        Invoke url: https://usb20242funcionapp.azurewebsites.net/api/hello

    mult_numbers - [httpTrigger]
        Invoke url: https://usb20242funcionapp.azurewebsites.net/api/mult

    sub_numbers - [httpTrigger]
        Invoke url: https://usb20242funcionapp.azurewebsites.net/api/sub

    sum_numbers - [httpTrigger]
        Invoke url: https://usb20242funcionapp.azurewebsites.net/api/sum

```