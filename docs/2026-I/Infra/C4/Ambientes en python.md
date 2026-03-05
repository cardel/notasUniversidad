
Los ambientes en Python permiten definir entornos separados del lenguaje con sus propias versiones de librerias, sin embargo, somos dependientes de la versión instalada de Python, pero existen herramientas que permiten gestionar

* Conda
* Microconda
* Anaconda

Para generar el ambiente

```bash
 #crea el ambiente en una carpeta venv sobre la carpeta actual
 python -m venv venv
 
 #Activa el ambiente
 source venv/bin/activate
 
 # En caso de tener problemas con el comando ejecuta
 which python
 which py
 which python3
 
 # Vamos a administrar nuestro entorno
 pip list
 pip install numpy
 
 pip list #vemos numpy instalado
 
 pip install pyinstrument
 pip list #vemos pyinstrument instalado
 
 #Almacenamos nuestro ambiente
 pip freeze
 pip freeze > requirements.txt

#instalar las librerias
pip install -r requirements.txt
```

**Nota** El ambiente virtual debe estar en el gitignore. Solo se archivo el requirements.txt