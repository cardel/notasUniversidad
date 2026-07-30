Es un algoritmo de divide y vencerás
1. Dividir hasta caso base, arreglo de tamaño 1 (está ordenado)
2. Conquistar bajo la idea de combinar dos arreglos ordenados, el costo es n y ahi está la ganancia
Este algoritmo opera bajo la idea de tener dos arreglos ordenados

## Ejemplo
Aquí tienes un diagrama **Mermaid** que muestra el proceso de **Merge Sort** para ordenar un arreglo de tamaño 8 (ejemplo con `[38, 27, 43, 3, 9, 82, 10, 16]`):

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffd8d8', 'edgeLabelBackground':'#ffffff'}}}%%
graph TD
    A["Merge Sort: [38, 27, 43, 3, 9, 82, 10, 16]"] --> B["Dividir"]
    B --> C1("[38, 27, 43, 3]")
    B --> C2("[9, 82, 10, 16]")
    C1 --> D1("[38, 27]")
    C1 --> D2("[43, 3]")
    C2 --> D3("[9, 82]")
    C2 --> D4("[10, 16]")
    D1 --> E1("[38]")
    D1 --> E2("[27]")
    D2 --> E3("[43]")
    D2 --> E4("[3]")
    D3 --> E5("[9]")
    D3 --> E6("[82]")
    D4 --> E7("[10]")
    D4 --> E8("[16]")
    E1 & E2 --> F1["Merge: [27, 38]"]
    E3 & E4 --> F2["Merge: [3, 43]"]
    E5 & E6 --> F3["Merge: [9, 82]"]
    E7 & E8 --> F4["Merge: [10, 16]"]
    F1 & F2 --> G1["Merge: [3, 27, 38, 43]"]
    F3 & F4 --> G2["Merge: [9, 10, 16, 82]"]
    G1 & G2 --> H["Merge: [3, 9, 10, 16, 27, 38, 43, 82]"]
    style H fill:#a1e0a1,stroke:#333
```

### **Explicación del diagrama:**
1. **Dividir (Split):**  
   - El arreglo original se divide recursivamente en mitades hasta obtener subarreglos de tamaño 1 (hojas del árbol).

2. **Merge (Combinar):**  
   - Los subarreglos se fusionan en orden ascendente:
     - `[38]` y `[27]` → `[27, 38]`  
     - `[43]` y `[3]` → `[3, 43]`  
     - Luego, `[27, 38]` y `[3, 43]` → `[3, 27, 38, 43]` (y así sucesivamente).

3. **Resultado final:**  
   - El último merge combina `[3, 27, 38, 43]` y `[9, 10, 16, 82]` para obtener el arreglo ordenado.

### **Características clave:**
- **Complejidad:** Siempre $O(n \log n)$ (estable en todos los casos).  
- **Espacio adicional:** Requiere memoria auxiliar para los subarreglos ($O(n)$).  

## Complejidad
Tenemos:
1. Se divide el problema en 2
2. Cada subproblema tiene tamaño n/2
3. Posteriormente combinar cuesta n

$$ T(n) = 2T(\frac{n}{2})+n$$

Al resolverla nos da $O(nlog(n))$ **método de árbol**