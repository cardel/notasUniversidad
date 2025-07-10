# Sesión 04 de Septiembre: Introducción paralelización II

## Rendimiento

1. Es normal pensar que al paralelizar se reduce la cantidad de trabajo computacional porque se parten las tareas, esto no es cierto ya que se tiene que hay una gestión de hilos/memoria/procesos detrás de ello y hay tareas que no se pueden paralelizar
2. Recursos compartidos
    - Memoria: localidad temporal: Acceso a las posiciones de memoria compartidas por hilos
    - Memoria: localidad espacial: Cantidad de memoria gestionada por cada hilo (secuencialidad de los datos)
3. Aciertos y fallos: Como la cache es un mapeo de la memoria RAM, tenemos que hay un porcentaje en el cual el mapeo será exitoso (una posición no utilizada en la cache), pero afecta el rendimiento de las operaciones
    1. Cuando el acceso es simultaneo (memorias cache para cada CPU) $T_{avg} = hT_c+(1-h)T_m$ 
    2. Cuando el acceso es jerarquico (memoria cache compartida) $T_{avg} = hT_c+(1-h)(T_m+T_c)$ 
    3. h: Es la tasa de aciertos, Tavg es el tiempo promedio de acceso a memoria, Tm: Es el tiempo de acceso a memoria RAM Tc: Es el tiempo de acceso a memoria cache
4. Limitaciones relacionadas con el número de procesos / dependencia de tareas, para hacer una tarea T = A,B,C, se tiene que B y C dependen de A, por lo que el programa minimo tardará lo que A tome.
5. Hay tareas secuenciales que no se pueden dividir, tareas que no son independentes $\forall i, V[i] = V[i]+V[i-1]$
6. Ley de Amdahl  T: Tiempo total de la tarea secuencial, p es el porcentaje paralelizable y s es el número de tareas generadas (división)

$$
L = \frac{T}{(1-p)+\frac{p}{s}}
$$

1. Debe tenerse en cuenta en la paralelización
    1. La cantidad de trabajo computacional (profiling)
    2. El span (tiempo del proceso del proceso seq mas largo)
    3. Gestión de hilos y procesos (comunicación)

## Limitaciones

1. Crecimiento de la velocidad del procesador es más rapida que la del acceso a memoria
2. Ley de Moore (cumplio hasta los principios de los 2000) cada dos años teniamos el doble de transistores por procesador
3. Limitaciones
    1. Frecuencia de reloj: Power wall (Consumo de energia)
    2. Memory wall (Limitaciones de velocidad de la memoria)
    3. Nivel de instrucciones (limites al paralelismo a bajo nivel)
4. Patrones de desarrollo en paralelismos
    1. Experiencias en desarrollo
    2. La idea es pensar en soluciones complejos: Paralelismo de tareas y de datos
    3. las soluciones no se enfocan en la paralelización en si misma, si en la algoritmia (como se puede dividir la tarea)
    4. Tener en cuenta problemas con tareas dependientes (no todo se puede paralelizar)