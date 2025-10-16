
# Problemas computacionales.

1. Clasificación de problemas (Decisión, resolución), (tratable o intratable), (decidible o no decidible)
2. Clasificación por complejidad
	1. Tipo P
	2. Tipo NP
	3. Tipo NPC
	4. Tipo NP-Hard
3. Problemas NPC: SAT
4. Estudio de los problemas a partir de la estratategia de demostrar que un problema es NPC
	1. Demostrar que es NP: verificar en tiempo P
	2. Se pueden reducir desde otro NPC
		1. Se hace en tiempo polinomial
		2. Es correcta (Instancias positivas dan instancias positivas e instancias negativas dan instancias negativa)
## Resumen de 3SAT y Reducción SAT→3SAT

### Aspectos Fundamentales

**3SAT**: Problema de satisfacibilidad booleana donde cada cláusula contiene exactamente 3 literales. Es NP-completo.

**Reducción SAT→3SAT**: Transformación polinomial que convierte cualquier instancia de SAT en una instancia equivalente de 3SAT mediante:
- Clausulas tamaño 1: Se expanden a 4 cláusulas usando 2 variables auxiliares
- Clausulas tamaño 2: Se expanden a 2 cláusulas usando 1 variable auxiliar  
- Clausulas tamaño 3: Pasan directamente
- Clausulas tamaño >3: Se dividen en cadena usando k-3 variables auxiliares y k-2 cláusulas

### Aplicaciones Prácticas

1. **Verificación de circuitos digitales**: Validar que un diseño de circuito cumple especificaciones
2. **Planificación y scheduling**: Asignación de recursos con restricciones complejas
3. **Bioinformática**: Análisis de redes de regulación génica
4. **Criptografía**: Análisis de seguridad de protocolos criptográficos
5. **Inteligencia Artificial**: Resolución de problemas de restricciones

### Importancia en Desarrollo de Software

**Comprensión de límites computacionales**: La reducción demuestra que ciertos problemas son inherentemente difíciles. Si un problema puede reducirse a 3SAT, es NP-completo y no existe solución eficiente en el caso general.

**Estimación realista de tiempos**: Al identificar que un requerimiento corresponde a un problema NP-completo, se puede:
- Evitar prometer soluciones óptimas en tiempo polinomial
- Considerar aproximaciones o heurísticas en lugar de soluciones exactas
- Estimar correctamente la escalabilidad del sistema

**Diseño de arquitecturas**: Permite seleccionar estrategias apropiadas:
- Para problemas NP-completos: algoritmos de aproximación, búsqueda local, o restricción del dominio
- Para problemas polinomiales: búsqueda de soluciones óptimas

**Gestión de expectativas**: Entender estas reducciones evita comprometer performance imposible en especificaciones técnicas, permitiendo establecer límites realistas de capacidad de procesamiento y tiempo de respuesta.