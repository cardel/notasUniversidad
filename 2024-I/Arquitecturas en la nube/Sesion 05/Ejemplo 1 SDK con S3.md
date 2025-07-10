# Ejemplo 1: SDK con S3

# Adminstración de recursos de storage usando SDK

Las credenciales se guardan en

C:\Users\Pepito\.aws\credentials <Windows>
/home/<usuario>/.aws/credenciales <Linux>
/Users/<usuario>/.aws/credenciales <Mac>

Configurar primero la conexión con az configure (credenciales IAM)

¿Como nos conectamos?

En el caso de Python usamos la librería boto3

```python
s3 = boto3.client('s3',
    aws_access_key_id='<ID>',
    aws_secret_access_key='<>',
    #aws_session_token='TU_SESSION_TOKEN' # Opcional
)
```

---

¿Como creamos un storage?

```python
s3.create_bucket(Bucket=bucket_name)
```

---

¿Como listamos los buckets?

```python
response = s3.list_buckets()
#response tipo diccionario
```

---

¿Como subimos un archivo al bucket?

```python
s3.upload_file(file_name, bucket_name, object_name)
"""
file_name = ruta en el disco, relativa
object_name = ruta que va tener el objeto dentro de s3
"""
```

---

¿Como podemos descargar un archivo desde un bucket?

```python
s3.download_file(bucket_name, object_name, file_name)
"""
file_name = ruta en el disco, relativa
object_name = ruta que va tener el objeto dentro de s3
"""
```

---

¿Como podemos eliminar un objeto y un bucket?

```python
s3.delete_bucket(Bucket=bucket_name)
s3.delete_object(Bucket=bucket_name, Key=object_name)
"""
key = url del objeto dentro del s3
Para borrar un bucket se necesita que esté vacio
"""
```

---

[https://gist.github.com/cardel/d8364f80d17a2fd0572c2be409f0bf9e](https://gist.github.com/cardel/d8364f80d17a2fd0572c2be409f0bf9e)