
En los sistemas operativos, especialmente en sistemas Unix/Linux, existen varios tipos de salida estándar para los procesos. Los principales son:

## Tipos de salida estándar

### 1. **stdout** (Standard Output - Salida estándar)
- **File descriptor**: 1
- Es el canal por defecto donde los programas envían su salida normal
- Por defecto se muestra en la terminal/consola
- Ejemplo: `echo "Hola mundo"` envía el texto a stdout

### 2. **stderr** (Standard Error - Error estándar)
- **File descriptor**: 2
- Canal separado para mensajes de error y diagnósticos
- Permite separar la salida normal de los errores
- Ejemplo: `ls archivo_inexistente 2> errores.txt`

### 3. **stdin** (Standard Input - Entrada estándar)
- **File descriptor**: 0
- Canal de entrada por defecto para los programas
- Normalmente proviene del teclado o de otro programa

## Redirecciones comunes

```bash
# Redirigir stdout a un archivo
comando > archivo.txt

# Redirigir stderr a un archivo
comando 2> errores.txt

# Redirigir ambos a archivos separados
comando > salida.txt 2> errores.txt

# Redirigir ambos al mismo archivo
comando > todo.txt 2>&1

# Redirigir stderr a stdout
comando 2>&1

# Descarta stdout (envía a /dev/null)
comando > /dev/null
```

## Propósito de la separación

La separación entre stdout y stderr permite:
- **Filtrar errores** sin afectar la salida normal
- **Logging diferenciado** de información y errores
- **Pipe eficiente** entre comandos sin mezclar errores
- **Debugging más fácil** al aislar los mensajes de error

Esta arquitectura es fundamental en sistemas Unix/Linux y se mantiene en sistemas modernos para mantener la compatibilidad y eficiencia en el manejo de salidas de programas.