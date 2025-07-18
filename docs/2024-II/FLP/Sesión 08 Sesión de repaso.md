# Sesión 08: Sesión de repaso

# Representación recursiva de datos

¿Que es un tipo de dato recursivo?

Se generan los datos del conjunto a partir un caso de base

Permite tener abstracción de datos: Independencia de la representación interna

Implementación e interfaz

---

¿Que tipos de representación tenemos?

1. Inductiva
2. Gramaticas

Estas representaciones parte de uno o mas casos base para representar los datos

La pertenencia de un elemento DEPENDE de la regla recursiva

# Representación datos y programas

Como podemos representar los datos

- Definición basada en gramaticas BNF
- Tenemos una implementación interna
- Tenemos una interfaz

---

Como podemos implementarlos

- Constructores
- Observadores: Extractores y predicados

---

Reglas de implementación

1. Incluya un constructor para cada variante en cada regla de la gramática
2. Incluiya un extractor para cada parte de cada variante
3. Incluya un predicado para cada variante

---

Implementaciones

- Listas
- Procedimientos
- Datatypes