# Dependencias en sistemas paralelos

## Concepto fundamental

Los sistemas pueden tener un número diferente de procesadores, los cuales influyen en la cantidad de procesos paralelos que se pueden ejecutar simultáneamente. Sin embargo, es crítico reconocer que hay procesos que pueden paralelizarse y otros que no. Esta distinción es fundamental para estimar la ganancia real de la paralelización.

## Paralelizabilidad: ejemplo de construcción de una casa

Consideremos la construcción de una casa como ejemplo ilustrativo:

**Procesos no paralelizables (secuenciales)**:

1. **Creación de los planos**: no puedo paralelizar este proceso. Por más personas que contrate, los planos deben ser diseñados secuencialmente por los arquitectos. Contratar más arquitectos no reduce significativamente el tiempo total, ya que hay dependencias lógicas (el diseño del techo depende del diseño de las paredes, que depende de la cimentación, etc.).

2. **Obtención de permisos**: es un proceso administrativo que debe completarse antes de comenzar la construcción. No se puede paralelizar fácilmente.

**Procesos paralelizables**:

1. **Construcción de la casa**: sí puedo paralelizar este proceso. Una vez que los planos están listos, diferentes cuadrillas de trabajadores pueden trabajar en diferentes áreas simultáneamente:
   - Cuadrilla A: cimentación y estructura
   - Cuadrilla B: instalación eléctrica
   - Cuadrilla C: instalación de tuberías
   - Cuadrilla D: acabados interiores

   Sin embargo, hay **dependencias implícitas**: la cuadrilla B no puede instalar electricidad hasta que la estructura esté lista (dependencia de datos). La cuadrilla D no puede hacer acabados hasta que las instalaciones estén completas.

**Conclusión**: aunque la construcción es paralelizable en principio, las dependencias limitan qué tareas pueden ocurrir realmente en paralelo.

## Ley de Amdahl

La ley de Amdahl es una fórmula que permite estimar cuál es la ganancia si paralelizamos un programa, suponiendo que existe una parte que se puede paralelizar y otra parte que es inherentemente secuencial. **Esta ley supone que no hay latencias asociadas a dependencias de memoria o comunicación entre procesos** (es un modelo ideal).

### Fórmula de la Ley de Amdahl

$$L = \frac{T}{(1-p) + \frac{p}{s}}$$

Donde:
- $L$ = latencia (tiempo relativo de ejecución)
- $T$ = tiempo total de ejecución secuencial (normalmente normalizado a 1)
- $p$ = fracción del programa que es paralelizable (entre 0 y 1)
- $s$ = factor de paralelización (número de procesadores usados)

### Interpretación de la fórmula

La fórmula establece que:
- $(1-p)$ es la fracción **no paralelizable** del programa (siempre se ejecuta secuencialmente)
- $\frac{p}{s}$ es la fracción paralelizable **dividida entre el número de procesadores**

El tiempo total es la suma de:
1. Tiempo secuencial: $(1-p) \times T$
2. Tiempo paralelizado: $\frac{p}{s} \times T$

### Caso con recursos infinitos

Si tuviéramos recursos infinitos (es decir, $s \rightarrow \infty$), entonces $\frac{p}{s} \rightarrow 0$, y la latencia sería:

$$L_{\infty} = \frac{T}{1-p}$$

Esto significa que **incluso con infinitos procesadores, no podemos ejecutar el programa más rápido que $(1-p)$ veces el tiempo original**, porque la parte secuencial es un límite infranqueable.

### Ejemplos numéricos

**Ejemplo 1: Programa con 90% paralelizable ($p = 0.9$)**

Con diferentes números de procesadores:

$$L(s=1) = \frac{1}{1-0.9 + \frac{0.9}{1}} = \frac{1}{0.1 + 0.9} = \frac{1}{1} = 1.0 \text{ (línea base)}$$

$$L(s=2) = \frac{1}{0.1 + \frac{0.9}{2}} = \frac{1}{0.1 + 0.45} = \frac{1}{0.55} = 1.82 \text{ (speedup de 1.82x)}$$

$$L(s=4) = \frac{1}{0.1 + \frac{0.9}{4}} = \frac{1}{0.1 + 0.225} = \frac{1}{0.325} = 3.08 \text{ (speedup de 3.08x)}$$

$$L(s=10) = \frac{1}{0.1 + \frac{0.9}{10}} = \frac{1}{0.1 + 0.09} = \frac{1}{0.19} = 5.26 \text{ (speedup de 5.26x)}$$

$$L(s \rightarrow \infty) = \frac{1}{0.1} = 10 \text{ (speedup máximo teórico: 10x)}$$

Observación: aunque el 90% es paralelizable, con 10 procesadores solo obtenemos 5.26x speedup, muy lejos del 10x teórico. La parte secuencial (10%) limita severamente la mejora.

**Ejemplo 2: Programa con 50% paralelizable ($p = 0.5$)**

$$L(s=2) = \frac{1}{0.5 + \frac{0.5}{2}} = \frac{1}{0.5 + 0.25} = \frac{1}{0.75} = 1.33 \text{ (speedup de 1.33x)}$$

$$L(s=4) = \frac{1}{0.5 + \frac{0.5}{4}} = \frac{1}{0.5 + 0.125} = \frac{1}{0.625} = 1.6 \text{ (speedup de 1.6x)}$$

$$L(s=10) = \frac{1}{0.5 + \frac{0.5}{10}} = \frac{1}{0.5 + 0.05} = \frac{1}{0.55} = 1.82 \text{ (speedup de 1.82x)}$$

$$L(s \rightarrow \infty) = \frac{1}{0.5} = 2 \text{ (speedup máximo teórico: 2x)}$$

Observación: aunque agregamos más procesadores, el speedup máximo es 2x. La mitad secuencial es un límite duro.

### Speedup lineal vs. sublineal

- **Speedup lineal**: speedup = $s$ (ideal pero raro). Esto requiere $p \approx 1$ (casi todo es paralelizable) y sin overhead.
- **Speedup sublineal**: speedup < $s$ (realidad). Esto es lo que predice la Ley de Amdahl.

## Conceptos teóricos clave para paralelización

Cuando se paraleliza un programa, hay tres factores críticos a considerar:

### 1. Cantidad de trabajo (Work)

La cantidad total de operaciones que el programa debe realizar. Se mide típicamente mediante **profiling** (análisis de rendimiento).

```scala
// Ejemplo: bucle con cantidad de trabajo bien definida
def procesarDatos(datos: Array[Int]): Long = {
  var suma = 0L
  // Cantidad de trabajo: 100,000 iteraciones
  for (i <- 0 until 100000) {
    // Cada iteración: lectura, suma, escritura (O(1))
    suma += datos(i % datos.length)
  }
  suma
}

// El profiling revelaría que la mayoría del tiempo se gasta en este bucle
// Este es el candidato principal para paralelización
```

Para estimar si vale la pena paralelizar, se calcula qué porcentaje del tiempo total se gasta en la sección paralelizable:

$$p = \frac{\text{Tiempo en sección paralelizable}}{\text{Tiempo total}}$$

Si $p < 0.8$, generalmente no vale la pena el esfuerzo de paralelización.

### 2. El span (camino crítico)

El **span** es el tiempo mínimo que tarda en completarse el programa incluso con paralelización infinita. Es determinado por la **cadena más larga de dependencias** en el programa.

```scala
// Ejemplo 1: Sin dependencias (paralelizable)
def calcularParalelo(a: Int, b: Int, c: Int): Int = {
  val x = a + 1          // Tarea 1: O(1)
  val y = b + 2          // Tarea 2: O(1) - puede ejecutarse en paralelo con 1
  val z = c + 3          // Tarea 3: O(1) - puede ejecutarse en paralelo con 1 y 2
  x + y + z              // Tarea 4: O(1) - requiere x, y, z (dependencia)
}
// Span: 2 (primero 3 tareas en paralelo, luego suma final)
// Work: 4 (total de operaciones)
// Máximo speedup teórico: 4/2 = 2x

// Ejemplo 2: Con dependencias (secuencial)
def calcularSecuencial(n: Int): Int = {
  var resultado = 0
  for (i <- 0 until n) {
    // Cada iteración depende del resultado anterior
    // resultado[i] = resultado[i-1] + i
    resultado += i
  }
  resultado
}
// Span: O(n) (cada iteración requiere resultado anterior)
// Work: O(n)
// Máximo speedup teórico: n/n = 1x (no se puede paralelizar)
```

El span es el **límite inferior absoluto** del tiempo de ejecución. No importa cuántos procesadores tengamos, no podemos ejecutar más rápido que el span.

### 3. Comunicación entre procesos

La cantidad y costo de comunicación entre procesos paralelos es crítico. Cuando un proceso necesita esperar a que otro complete para obtener datos, eso introduce **latencias de sincronización**.

```scala
// Ejemplo 1: Baja comunicación (eficiente)
def procesarParaleloEficiente(datos: Array[Int]): Array[Int] = {
  // Cada hilo procesa su partición independientemente
  datos.par.map { valor =>
    // Procesamiento independiente: sin dependencias entre hilos
    valor * 2 + 1
  }.toArray
}
// Comunicación: mínima (solo cuando se recolectan resultados al final)

// Ejemplo 2: Alta comunicación (ineficiente)
def procesarParaleloIneficiente(datos: Array[Int]): Int = {
  var resultado = 0
  // Cada hilo debe esperar a que el anterior termine
  for (i <- 0 until datos.length) {
    // Barrera de sincronización: todos los hilos esperan aquí
    barrier()
    // Cada hilo actualiza resultado (causa contención)
    synchronized {
      resultado += datos(i)
    }
  }
  resultado
}
// Comunicación: altísima (sincronización en cada iteración)
// Overhead domina, paralelización es contraproducente
```

**Latencia de comunicación**: es el tiempo que tarda en:
1. Enviar un mensaje de un proceso a otro
2. Esperar sincronización
3. Recopilar resultados

En arquitecturas multinúcleo compartiendo memoria, este es principalmente el costo de acceso a memoria compartida. En sistemas distribuidos, incluye latencia de red.

## Relación entre Ley de Amdahl y los tres factores

La Ley de Amdahl combina implícitamente estos tres factores:

1. **Work** ($W$): número total de operaciones
2. **Span** ($S$): cadena más larga de dependencias
3. **Comunicación** ($C$): costo de sincronización

La latencia real es:

$$L_{\text{real}} = \max\left(\frac{(1-p) \times W}{1}, \frac{p \times W}{s} + C\right)$$

Donde $C$ incluye el costo de comunicación y sincronización entre procesos.

## Tabla de resumen

| Concepto | Descripción | Importancia en paralelización |
|----------|-------------|-------------------------------|
| Paralelizabilidad | Fracción del programa que se puede ejecutar en paralelo | Determina el límite máximo de speedup |
| No paralelizable | Secciones que deben ejecutarse secuencialmente | Limita ganancia según Ley de Amdahl |
| Ley de Amdahl | $L = \frac{T}{(1-p) + \frac{p}{s}}$ | Predice speedup máximo alcanzable |
| Factor de paralelización ($p$) | Porcentaje del programa paralelizable | Mayor $p$ = mayor speedup potencial |
| Factor de procesadores ($s$) | Número de procesadores disponibles | Aumentar $s$ da retornos decrecientes |
| Speedup | $\text{Speedup} = \frac{T_{\text{secuencial}}}{T_{\text{paralelo}}}$ | Medida de mejora real obtenida |
| Speedup lineal | Speedup = $s$ (ideal) | Requiere $p \approx 1$ y cero overhead |
| Speedup sublineal | Speedup < $s$ (realidad) | Ley de Amdahl predice esto |
| Work | Cantidad total de operaciones | Medida por profiling, es constante |
| Span | Cadena más larga de dependencias | Límite inferior de tiempo de ejecución |
| Máximo speedup teórico | $\frac{\text{Work}}{\text{Span}}$ | Límite absoluto incluso con infinitos procesadores |
| Comunicación | Costo de sincronización entre procesos | Mayor comunicación = mayor overhead |
| Latencia de sincronización | Tiempo esperando en barreras o locks | Reduce speedup real comparado con teoría |
| Profiling | Medición empírica de tiempo por sección | Necesario para estimar $p$ correctamente |
| Caso con recursos infinitos | $L_{\infty} = \frac{1}{1-p}$ | El span determina límite: speedup máximo = $\frac{1}{1-p}$ |

## Comentarios adicionales

### Implicaciones prácticas de la Ley de Amdahl

1. **No vale la pena paralelizar si $p < 0.8$**: la fracción secuencial domina y el overhead no compensa la ganancia.

2. **El número de procesadores tiene rendimientos decrecientes**: pasar de 1 a 2 procesadores típicamente da ~1.8x speedup con $p=0.9$. Pasar de 100 a 101 procesadores da ganancia negligible.

3. **La realidad es peor que la teoría**: la Ley de Amdahl no cuenta costos reales como:
   - Contención de caché
   - Overhead de sincronización
   - Desbalanceo de carga
   - Latencia de memoria NUMA
   
   Por eso el speedup observado es típicamente menor que el predicho.

### Estimación de $p$ en práctica

```scala
// Pseudocódigo para estimar p

val tiempoTotal = medirTiempoTotal()

// Medir tiempo de sección secuencial
val tiempoSecuencial = medirTiempoSeccion("sección critica")

// Calcular p
val p = (tiempoTotal - tiempoSecuencial) / tiempoTotal

// Si p < 0.8, no paralelizar. Si p > 0.9, paralelización es prometedora
if (p < 0.8) println("No vale la pena paralelizar")
else if (p > 0.9) println("Paralelización muy prometedora")
else println("Paralelización moderada, necesita optimización")
```

### El span es el enemigo

Cualquier dependencia aumenta el span. En programas paralelos, identificar y minimizar dependencias es crítico:

```scala
// Malo: muchas dependencias
def sumaSecuencial(arr: Array[Int]): Int = {
  var suma = 0
  // Cada iteración depende de la anterior
  for (i <- 0 until arr.length) suma += arr(i)
  // Span: O(n), no se puede paralelizar
  suma
}

// Mejor: reduce en paralelo
def sumaParalelo(arr: Array[Int]): Int = {
  // Divide array en mitades, suma cada mitad, suma resultados
  // Span: O(log n), se puede paralelizar mucho
  arr.par.sum
}
```

### Escalabilidad fuerte vs. débil

- **Escalabilidad fuerte**: cómo mejora speedup al aumentar procesadores para **tamaño fijo** de problema. Limitada por Ley de Amdahl.
- **Escalabilidad débil**: cómo mejora speedup al aumentar procesadores **y tamaño de problema juntos**. Generalmente mejor que escalabilidad fuerte.

En muchos sistemas prácticos, la escalabilidad débil es más alcanzable.

### Overhead de paralelización

El overhead incluye:
- Creación y destrucción de hilos: ~1-10 microsegundos
- Sincronización (locks, barreras): ~10-1000 ciclos de CPU
- Contención de caché: ~100-1000 ciclos por miss
- Context switching: ~1000+ ciclos de CPU

Si el trabajo por tarea es muy pequeño (<1000 ciclos), el overhead domina.