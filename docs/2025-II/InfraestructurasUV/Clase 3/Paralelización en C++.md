
## Explicación de Paralelización en C++

El enfoque **map-reduce** que describes es excelente para paralelizar operaciones sobre colecciones de datos. En C++ esto se implementa típicamente con la biblioteca `<thread>`.

### Estructura del Código

```c++
#include <vector>
#include <thread>
#include <iostream>

void funcion(int ini, int fin, const std::vector<int>& v, long& salida) {
    for(int i = ini; i < fin; i++) {
        salida += v[i];  // Operación de "map"
    }
}

int main() {
    std::vector<int> datos = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    const int num_hilos = 4;
    const int elementos_por_hilo = datos.size() / num_hilos;
    
    std::vector<std::thread> hilos;
    std::vector<long> resultados_parciales(num_hilos, 0);
    
    // Fase MAP: Crear y ejecutar hilos
    for(int i = 0; i < num_hilos; i++) {
        int inicio = i * elementos_por_hilo;
        int fin = (i == num_hilos - 1) ? datos.size() : inicio + elementos_por_hilo;
        
        hilos.emplace_back(funcion, inicio, fin, std::ref(datos), 
                          std::ref(resultados_parciales[i]));
    }
    
    // Fase REDUCE: Esperar y combinar resultados
    long resultado_final = 0;
    for(int i = 0; i < num_hilos; i++) {
        hilos[i].join();  // Esperar a que cada hilo termine
        resultado_final += resultados_parciales[i];  // Combinar resultados
    }
    
    std::cout << "Resultado final: " << resultado_final << std::endl;
    return 0;
}
```

## Diagrama de Flujo de Hilos

```mermaid
flowchart TD
    A[Hilo Principal] --> B[Inicializar datos y variables]
    B --> C[Crear hilos worker<br>con particiones de datos]
    
    subgraph Hilos_Workers [Fase MAP - Procesamiento Paralelo]
        direction LR
        H1[Hilo 1<br>procesa partición 1]
        H2[Hilo 2<br>procesa partición 2]
        H3[Hilo 3<br>procesa partición 3]
        H4[Hilo 4<br>procesa partición 4]
    end
    
    C --> Hilos_Workers
    
    subgraph Resultados_Parciales [Almacenamiento de Resultados]
        R1[Resultado Parcial 1]
        R2[Resultado Parcial 2]
        R3[Resultado Parcial 3]
        R4[Resultado Parcial 4]
    end
    
    H1 --> R1
    H2 --> R2
    H3 --> R3
    H4 --> R4
    
    A --> D[Esperar con join<br>a todos los hilos]
    D --> E[Combinar resultados<br>parciales reduce]
    E --> F[Resultado Final]
    
    style A fill:#e1f5fe
    style Hilos_Workers fill:#f3e5f5
    style Resultados_Parciales fill:#e8f5e8
    style F fill:#fff3e0
```

## Puntos Clave del Diagrama:

1. **Hilo Principal**: Inicializa todo y coordina el proceso
2. **Fase MAP**: Los hilos trabajan en paralelo sobre diferentes particiones de datos
3. **Join**: El hilo principal espera a que todos los hilos terminen
4. **Fase REDUCE**: Se combinan todos los resultados parciales
5. **Resultado Final**: El producto de la operación paralelizada

Este enfoque es eficiente porque maximiza el uso de CPU mientras mantiene la simplicidad del modelo map-reduce.