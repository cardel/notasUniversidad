
---

### 🖥️ Limitaciones de Hardware
1. **Jerarquía de memoria limitada**:
   - La caché L1/L2 por núcleo es pequeña (KB-MB) vs. RAM (GB)
   - El tamaño reducido genera *cache misses* (compulsorios, de capacidad, de conflicto)
   
2. **Latencia en acceso a memoria**:
   - Cada *cache miss* obliga a acceder a RAM, mucho más lenta
   - Penalización de latencia afecta directamente el rendimiento paralelo

3. **Problemas de coherencia de caché**:
   - Protocolos como MESI añaden overhead al mantener consistencia entre núcleos
   - Comunicación entre cachés introduce retardos

4. **False Sharing (Falso compartimiento)**:
   - Hilos que acceden a variables distintas en una misma línea de caché se invalidan mutuamente
   - Genera sincronización innecesaria y reduce rendimiento

5. **Recursos físicos compartidos**:
   - Aunque hay múltiples núcleos, comparten caché L3 y bus de memoria
   - Contención por acceso a recursos compartidos limita escalabilidad

---

### 📟 Limitaciones de Software
1. **Ley de Amdahl**:
   - Limitación teórica por la fracción no paralelizable $(1-P)$
   - Máximo speedup acotado incluso con recursos infinitos: $S = \frac{1}{1-P}$
   - Ej: Si solo el 60% es paralelizable, el máximo speedup es 2.5×

2. **Diseño algorítmico**:
   - No todos los algoritmos son paralelizables eficientemente
   - Dependencia de datos entre hilos requiere sincronización (locks, semáforos)

3. **Overhead de gestión de hilos**:
   - Creación, sincronización y comunicación entre hilos añade costo adicional
   - El paralelismo puede volverse contraproducente en cargas pequeñas

4. **Falta de localidad**:
   - Si los hilos no trabajan con datos locales en caché, aumentan los *misses*
   - Algoritmos deben diseñarse con localidad espacial/temporal

---

### 🧠 Conclusión
El hardware impone límites físicos (tamaño de caché, latencia, coherencia), mientras el software tiene límites teóricos (Ley de Amdahl) y prácticos (diseño de algoritmos). La paralelización eficiente requiere optimizar ambos aspectos.