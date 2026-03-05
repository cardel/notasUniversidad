
Es una herramienta que permite evaluar el código en términos

1. Gasto de memoria
2. Tiempo de ejecución
3. Uso de recursos

Permite identificar areas de mejora del código, sin embargo, tener en cuenta que **no siempre se puede** aveces dependemos de factores externos (API externas, hardware, etc)

Usualmente se hacen las mejoras en el código que hace llamados a memoria

El creador de Earlang dice una frase interesante: Si lo haces bonito (buenas prácticas) usualmente ya es optimo.

- Profiler de tiempo: Que miden el tiempo
- Profiler determinista: Evalua todo el código y extrae la información
- Profiler estadistico: Solo toma ciertos momentos e infiere el comportamiento

**Nota:** El profiler agrega carga al programa ya que necesita evaluarlo en tiempo de ejecución.