Para implementar los ambiente recursivos necesitamos modificar la noción de ambiente, vamos a incluir un nuevo caso que se refiere a los ambientes recursivos, estos únicamente van a permitir definir procedimientos.


# Modificación a los ambientes
Vamos a agregar un nuevo caso al datatype de ambientes el cual va a incluir el ambiente extendido recursivo

```scheme
  (extend-recursively-env
   (procname (list-of symbol?))
   (argss (list-of (list-of symbol?)))
   (bodies (list-of expression?))
   (old-env environment?))   
```

1. procname Lista de los procedimientos (nombres)
2. argss lista de lista de los argumentos
3. bodies cuerpos de los procedimientos
4. old-env ambiente de donde extiende


# Modificación a apply-env

```scheme
(extend-recursively-env
       (procnames llargs bodies old-env)
       (letrec
           (
            ;; Definición local de la función de búsqueda
            (search-proc
             (lambda (procs args bodies)
               (cond
                 ;; Caso 1: Si no se encuentra el procedimiento en la lista actual
                 [(null? procs) 
                  ;; Buscar en el ambiente anterior (old-env)
                  (apply-env old-env var)]
                 
                 ;; Caso 2: Se encuentra el procedimiento buscado
                 [(eqv? (car procs) var)
                  ;; Crear una clausura con el ambiente recursivo actual
                  (closure (car args)         ; Parámetros formales
                           (car bodies)       ; Cuerpo del procedimiento
                           env)]              ; Ambiente actual (¡clave importante!)
                 
                 ;; Caso 3: Continuar buscando en el resto de la lista
                 [else (search-proc (cdr procs) (cdr args) (cdr bodies))]
                 )
               )
             )
            )
         ;; Iniciar la búsqueda con las listas completas
         (search-proc procnames llargs bodies)
         )
       )
```

## Explicación Detallada

### Funcionamiento de la Búsqueda

La función `search-proc` realiza una búsqueda lineal a través de tres listas paralelas:
- `procnames`: Nombres de los procedimientos definidos recursivamente
- `llargs`: Listas de argumentos formales para cada procedimiento  
- `bodies`: Cuerpos de cada procedimiento

### Punto Clave: La Clausura y el Ambiente

Cuando se encuentra un procedimiento (`(eqv? (car procs) var)`), se crea una clausura con:

```scheme
(closure (car args)        ; Parámetros del procedimiento
         (car bodies)      ; Cuerpo del procedimiento  
         env)              ; Ambiente actual
```

**La clave fundamental** es que `env` se refiere al **ambiente que está siendo construido actualmente**, no al `old-env`. Esto es lo que permite la recursión mutua.

### Garantía de Consistencia

El mecanismo garantiza consistencia porque:

1. **No hay ligaduras duplicadas**: Solo se almacenan definiciones de procedimientos en el ambiente extendido recursivo
2. **Autorreferencia**: Cuando un procedimiento dentro del grupo recursivo referencia a otro procedimiento del mismo grupo, la búsqueda encontrará la definición en el ambiente actual (`env`)
3. **Encapsulación**: Las definiciones recursivas están contenidas en su propio ámbito sin contaminar el ambiente exterior


