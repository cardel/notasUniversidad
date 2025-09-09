# Ambientes virtuales

Los ambientes virtuales en Python permiten aislar dependencias y librerías en versiones específicas.

```python
# El comando globals() muestra el diccionario de variables globales del intérprete
>>> globals()
{'__name__': '__main__', '__doc__': None, '__package__': '_pyrepl', '__loader__': None, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, '__file__': '/usr/lib/python3.13/_pyrepl/__main__.py', '__cached__': '/usr/lib/python3.13/_pyrepl/__pycache__/__main__.cpython-313.pyc'}

# Accediendo al módulo de built-ins del contexto global
>>> globals()['__builtins__']
<module 'builtins' (built-in)>
```

Python es un lenguaje interpretado que al iniciar carga un contexto global:

1. \_\_name\_\_ es la variable principal del programa, y cuando vale `'__main__'` indica que es el punto de entrada
2. \_\_builtins\_\_ son los módulos que carga por defecto; esto es lo que cambia cuando usamos ambientes virtuales

## Creación y activación de ambientes virtuales

```bash
# Crear un ambiente virtual llamado 'venv'
python -m venv venv

# Activar el ambiente virtual en sistemas Unix/Linux
source venv/bin/activate
```

En el prompt de bash debe aparecer `(venv)`, lo que significa que se ha cargado el ambiente virtual. Esto proporciona independencia de las librerías de Python del sistema operativo.

## Gestión de paquetes en el ambiente virtual

```bash
# Ver la lista de paquetes instalados y sus versiones
pip list

# Instalar una librería específica
pip install <libreria>

# Crear archivo de requerimientos con las dependencias actuales
pip freeze > requirements.txt

# Instalar todas las dependencias desde un archivo de requerimientos
pip install -r requirements.txt
```

Esto es importante para conservar las versiones específicas de las librerías sobre las cuales funciona una aplicación.

## Consideraciones importantes

Los ambientes virtuales no deben copiarse y pegarse directamente entre dispositivos porque:

1. Contienen muchos archivos
2. Son pesados en tamaño
3. Tienen versiones específicas para el sistema operativo
4. Son dependientes de la versión de Python utilizada

## Pasos adicionales recomendados

```bash
# Desactivar el ambiente virtual cuando ya no se necesite
deactivate

# Crear el ambiente virtual con una versión específica de Python
python3.9 -m venv venv

# Actualizar pip dentro del ambiente virtual
pip install --upgrade pip

# Verificar la ubicación del Python que se está usando
which python

# Verificar la versión de Python dentro del ambiente virtual
python --version
```