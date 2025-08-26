Los sistemas multinucleo permiten tener paralelización real. En este cada nucleo puede tener tareas en paralelo.

En los sistemas mononucleo se aprovecha los tiempos muertos de la CPU para alternar procesos, aqui la paralización es simulada.

# Recursos de PC
```bash
lstopo
```
![](attachments/Pasted%20image%2020250826143344.png)
1. Tenemos procesadores reales, fisicamente separados
2. Cada procesador tiene dos o más hilos
3. Cada hilo tiene su propia cache nivel L1 (32kb)
4. Cada CPU real tiene su propia cache L2 (512kb)
5. Todo el conjunto de CPU tiene su cache L3 (16 MB)

Recuerdos
- Arquitectura Harvard: Más de una memoria
- Arquitectura Von Newman: Una sola memoria para todo el equipo

```bash
cat /proc/cpuinfo | more
cat /proc/meminfo | more
```

![](attachments/Pasted%20image%2020250826150026.png)

A la hora de ejecutar un programa, tenemos que la **memoria cache** es un cuello de botella
- El programa está almacenado en persistente (HDD, USB, SSD)
- Se carga en RAM
- RAM se mapea a memoria cache, el problema es que la RAM esta en GB y la cache en MB
- La CPU procesa la información

Claro, profundicemos en estos conceptos clave para entender mejor cómo la memoria caché y sus limitaciones afectan la paralelización.

---

### 🔍 Ampliación sobre la memoria caché y su impacto en la paralelización

#### 1. **Jerarquía de memoria y el cuello de botella**
La memoria caché actúa como un buffer entre la CPU (extremadamente rápida) y la RAM (más lenta). Su objetivo es reducir el tiempo de acceso a los datos frecuentemente usados. Sin embargo, su tamaño limitado (generalmente en MB frente a los GB de la RAM) implica que no todos los datos pueden almacenarse allí, lo que genera dos fenómenos críticos:

---

#### 2. **Cache Miss (Fallo de caché)**
Ocurre cuando la CPU busca un dato en la caché y no lo encuentra. Esto obliga a acceder a la RAM (o incluso a niveles inferiores de la jerarquía de memoria), lo cual es mucho más lento. Existen varios tipos de *cache miss*:

- **Compulsorio (Compulsory miss)**: Primer acceso a un dato que nunca ha estado en caché.
- **De capacidad (Capacity miss)**: La caché es demasiado pequeña para contener todos los datos necesarios.
- **De conflicto (Conflict miss)**: Varios datos compiten por la misma ubicación en la caché (es común en cachés asociativas por conjuntos).

Cada *cache miss* introduce una **penalización de latencia**, ya que la CPU debe esperar a que los datos sean traídos desde la RAM.

---

#### 3. **Problemas de latencia en programas paralelos**
Cuando un proceso se divide en múltiples hilos (o procesos), estos suelen compartir datos o trabajar en porciones de una estructura común. Aquí surgen dos problemas principales relacionados con la caché:

##### a) **False Sharing (Falso compartimiento)**
Aunque dos hilos trabajen en variables diferentes, si estas residen en la misma línea de caché, cualquier modificación por parte de un hilo invalidará toda la línea de caché para los otros hilos. Esto fuerza actualizaciones constantes de la caché entre núcleos, aunque en realidad no compartan datos.  
**Consecuencia**: Pérdida de rendimiento debido a invalidaciones innecesarias y sincronización implícita.

##### b) **Coherencia de caché (Cache Coherence)**
Sistemas multiprocesador deben garantizar que todas las cachés tengan una vista consistente de la memoria. Protocolos como MESI (Modified, Exclusive, Shared, Invalid) aseguran esto, pero cada actualización o invalidación requiere comunicación entre núcleos, añadiendo latencia.

---

#### 4. **Ejemplo en paralelización**
Imagina un programa que suma un array grande usando múltiples hilos:
- Cada hilo suma una porción del array.
- Si los hilos acceden a datos contiguos pero en diferentes líneas de caché, puede haber *cache misses* frecuentes.
- Si comparten una línea de caché (ej: variables de control o resultados parciales), se puede generar *false sharing*.

Esto limita la escalabilidad: añadir más hilos no siempre acelera el proceso debido a la contención por acceso a memoria y la sobrecarga de mantener la coherencia.

---

#### 5. **Soluciones y mejores prácticas**
- **Alineación de datos**: Estructurar los datos para que cada hilo acceda a líneas de caché independientes.
- **Padding**: Añadir relleno entre variables compartidas para evitar que caigan en la misma línea de caché.
- **Localidad espacial y temporal**: Diseñar algoritmos que aprovechen los datos ya cargados en caché.
- **Uso de memoria local por hilo**: Minimizar el acceso a memoria compartida.

---

### 📌 Conclusión
La memoria caché es fundamental para el rendimiento, pero su tamaño limitado y los mecanismos de coherencia pueden convertirse en un cuello de botella significativo en entornos paralelos. Entender fenómenos como el *cache miss* y el *false sharing* permite diseñar programas más eficientes que aprovechen mejor el paralelismo.

