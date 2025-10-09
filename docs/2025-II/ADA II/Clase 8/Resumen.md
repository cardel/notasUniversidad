1. Simplex no factible: Metodo de las dos fases: Agregar una variable artificial, la cual queremos minimizar (es decir vale 0), posteriormente usamos el sistema modificado para resolver el sistema original usando la función objetivo
2. Branch and bound: Queremos soluciones enterar, entonces.
	1. Tomar una de las variables no enteras, y generar dos problema, se agrega una restriccion menor o igual que el piso del valor y la otra mayor o igual que el techo
	2. Se va evaluando la función objetivo cuando se encuentra una solución entera, este es nuestro z objetivo podemos detener la expansión si y solo si la función objetivo en ese punto es menor a la encontrada

## 📊 Tabla Comparativa: Métodos de Optimización

| Aspecto | **Simplex No Factible** | **Programación Entera** |
|---------|------------------------|------------------------|
| **Problema** | Solución inicial no factible (variables básicas negativas) | Solución óptima no entera cuando se requieren valores enteros |
| **Método** | Variables artificiales (Método de la M grande) | Branch and Bound (Ramificación y Acotamiento) |
| **Objetivo** | Encontrar solución factible inicial | Encontrar solución óptima con valores enteros |
| **Variable clave** | Variable artificial M | Variables de ramificación |
| **Condición éxito** | M = 0 en solución final | Todas las variables de decisión son enteras |
| **Complejidad** | Agrega una variable por restricción no factible | Puede generar múltiples subproblemas |

## 🔑 Puntos Clave Destacados

### **Simplex No Factible:**
- ✅ **Solución existe si M = 0 al final**
- ✅ **Se elimina la variable artificial después de encontrar factibilidad**
- ✅ **Método sistemático para problemas inicialmente no factibles**

### **Programación Entera:**
- ✅ **Divide el problema en subproblemas más pequeños**
- ✅ **Usa cotas para evitar explorar ramas no prometedoras**
- ✅ **Encuentra la mejor solución entera posible**

## 💪 Mensaje de Motivación para Estudiantes

¡Hola guerreros del álgebra! 🌟

Sé que están en un salón caluroso, el aburrimiento acecha y las ecuaciones parecen interminables. Pero piensen en esto: **ustedes están resolviendo problemas que empresas pagan millones para optimizar**.

Cada pivote en el simplex es como dar un paso estratégico hacia la solución. Cada ramificación en programación entera es como explorar caminos hacia el éxito. **El calor de hoy es temporal, pero el conocimiento que construyen es para siempre.**

Recuerden: los grandes matemáticos también sudaron, también se frustraron, pero persistieron. Ustedes están forjando mentes analíticas que resolverán los problemas del mañana.

**¡Sigan adelante!** Cada variable que dominan, cada restricción que entienden, los acerca más a ser los ingenieros y científicos que cambiarán el mundo. El futuro los necesita resolviendo problemas complejos, no solo ecuaciones simples.

**¡Tienen esto!** 🔥📈
