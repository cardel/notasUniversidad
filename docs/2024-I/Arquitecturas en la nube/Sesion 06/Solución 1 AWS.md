# Solución 1: AWS

```bash
aws configure #credenciales
chalice new-project ejercicio #crear proyecto
```

En archivo requirements.txt colocar 
***boto3***

Editar archivo [app.py](http://app.py) de esta forma, cambiar **usb20242ejemplo2** con el bucket que haya creado en s3

[https://gist.github.com/cardel/33bedd47f5515291a3274e9ad4790a60](https://gist.github.com/cardel/33bedd47f5515291a3274e9ad4790a60)

```bash
chalice start #probar en local
chalice deploy #subir a aws
```

Pruebas locales, cambiar la URL por la dada por aws

```bash
curl -X POST http://127.0.0.1:8000/upload \
     -H "Content-Type: text/csv" \
     --data-binary @data.csv

curl -X POST http://127.0.0.1:8000/getPerson \
     -H "Content-Type: application/json" \
     -d '{"cedula": "100000001"}'

curl -X POST http://127.0.0.1:8000/searchCargo \
     -H "Content-Type: application/json" \
     -d '{"cargo": "Ingeniero"}'

curl -X PUT http://127.0.0.1:8000/addPerson \
     -H "Content-Type: application/json" \
     -d '{"Cedula": "100000200", "Nombre": "Luis García", "Direccion": "Calle Luna 123", "Telefono": "555-3456", "Cargo": "Doctor"}'

curl -X DELETE http://127.0.0.1:8000/deletePersona \
     -H "Content-Type: application/json" \
     -d '{"cedula": "100000001"}'

```