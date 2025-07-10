# Sesion 3: 29 de Feb Representación de datos

TAD

Tipo abstracto de datos

- Implementación
- Interfaz

Los programadores sólo se entienden con la interfaz

Interfaz: Constructores y observadores

- Constructor: Permite definir un elemento que pertence al TAD
- Observadores. Permite observa dentro del TAD
- Dos tipo: PRedicados (saber si pertenece a un caso) Extractores (extraer datos dentro del TAD)

---

Estrategias para diseño de TAD

- Debe incluir un constructor para cada variante
- Debe incluir un predicado para cada variante
- Se debe implementar un extractor para cada campo para cada variante

---

Ventajas de los TAD

1. El programador sólo se entiende con la interfaz
2. Si la implementación cambia (listas, proced, etc) no afecta a las funciones que haga el programador
3. El programador sólo debe usar las funciones provistas por la interfaz (Constructores y observadores)