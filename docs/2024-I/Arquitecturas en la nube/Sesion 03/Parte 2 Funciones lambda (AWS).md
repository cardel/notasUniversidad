# Parte 2: Funciones lambda (AWS)

El ejemplo es en Python, se debe utilizar el SDK proporcionado por AWS dependiendo del lenguaje de programación

- El desarrollo de la función lambda es dependiente del SDK
- El punto de ejecución parte del SDK (libreria), por ejemplo, no puedo usar flask como punto de parte, pero puedo usarlo como parte del desarrollo
- Tener en cuenta la situación con dependencias externas
    - En el caso de Python usar el archivo requirements.txt
    - En el caso de Java la librería se agrega en las dependencias de MAVEN/GRADLE del proyecto
- Lo que se suele hacer es:
    - Se tiene el endpoint con la función lambda
    - Se tienen contenedores/aplicación/api internos que conectan que la función lambda
- No sobrecargue las funciones lambda: Son servicios con capacidad **limitada**

## Recursos

- [https://learn.microsoft.com/en-us/azure/azure-functions/](https://learn.microsoft.com/en-us/azure/azure-functions/)

## Ejemplo

```bash
pip install chalice #instalamos la libreria
chalice new-project webapp #creamos una carpeta lista para trabajar
```

Esto tiene la siguiente estructura

```bash
webapp
├── app.py
└── requirements.txt
```

- [app.py](http://app.py) Es donde esta alojada el punto de entrada de la función
- requirements.txt son librerías que se instalan en el contenedor de la función lambdac

[https://gist.github.com/cardel/75d3a09186cf4671056bd9b30fbd771b](https://gist.github.com/cardel/75d3a09186cf4671056bd9b30fbd771b)

```bash
chalice local #probar localmente
chalice deploy #levantar el servicio
chalice delete #detener el servicio
```