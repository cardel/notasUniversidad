
# Compilación con lpthreads

```bash
# Compilación correcta para programas multi-hilo
g++ -o programa programa.cpp -lpthread
# -std=c++11: Necesario para thread y chrono
# -lpthread: Enlaza la biblioteca de hilos POSIX
```

# Ejemplo

```c++
#include <iostream>
#include <vector>
#include <thread>
#include <chrono>

using namespace std;
using namespace std::chrono;

void funcion(int ini, int fin, const vector<int> &v, long &salida) {
    for(int i = ini; i < fin; i++) {
        salida += v[i] * v[i];  // Ejemplo: suma de cuadrados
    }
}

int main() {
    const int SIZE = 1000000;
    vector<int> datos(SIZE, 1);  // Vector de 1's para prueba
    
    // Crear hilos y variables de resultado
    long salA = 0, salB = 0;
    
    // Iniciar medición de tiempo
    auto inicio = high_resolution_clock::now();
    
    // Crear hilos (forma recomendada)
    thread t1(funcion, 0, SIZE/2, ref(datos), ref(salA));
    thread t2(funcion, SIZE/2, SIZE, ref(datos), ref(salB));
    
    // Esperar a que los hilos terminen
    t1.join();
    t2.join();
    
    // Combinar resultados
    long resultado = salA + salB;
    
    // Finalizar medición de tiempo
    auto fin = high_resolution_clock::now();
    auto duracion = duration_cast<milliseconds>(fin - inicio);
    
    cout << "Resultado: " << resultado << endl;
    cout << "Tiempo de ejecución: " << duracion.count() << " ms" << endl;
    
    return 0;
}
```

## Flujo del ejemplo

```mermaid
flowchart TD
    A[Hilo Principal] --> B[Compilar con -lpthread]
    B --> C[Incluir thread y chrono]
    C --> D[Inicializar datos y variables]
    D --> E[Iniciar profiling con chrono]
    
    subgraph Creacion_Hilos [Creación de Hilos]
        direction TB
        F[thread t1funcion, 0, SIZE/2, refv, refsalA]
        G[thread t2funcion, SIZE/2, SIZE, refv, refsalB]
    end
    
    E --> Creacion_Hilos
    
    subgraph Ejecucion_Paralela [Ejecución Paralela MAP]
        direction LR
        H[Hilo 1: procesa 0 a SIZE/2]
        I[Hilo 2: procesa SIZE/2 a SIZE]
    end
    
    Creacion_Hilos --> Ejecucion_Paralela
    
    Ejecucion_Paralela --> J[Almacenar resultados en salA, salB]
    
    J --> K[t1.join - Esperar hilo 1]
    J --> L[t2.join - Esperar hilo 2]
    
    K & L --> M[Combinar resultados: salA + salB]
    M --> N[Finalizar profiling]
    N --> O[Mostrar resultado y tiempo]
    
    style A fill:#e1f5fe
    style Creacion_Hilos fill:#fff3e0
    style Ejecucion_Paralela fill:#f3e5f5
    style M fill:#e8f5e8
    style O fill:#ffebee

    %% Notas importantes
    P[Nota: Número de hilos<br>recomendado en potencia de 2] --> Q
    R[Nota: Los hilos se alternan<br>en ejecución si exceden núcleos] --> S
```

## Puntos Clave Adicionales:

1. **`std::ref()`**: Es crucial para pasar variables por referencia a los hilos
2. **`.join()`**: Bloquea el hilo principal hasta que el hilo secundario termine
3. **Potencia de 2**: Óptimo para balance de carga en particiones
4. **Chrono profiling**: Esencial para medir ganancias de performance
5. **Gestión de recursos**: Más hilos que núcleos causan *time-slicing* (alternancia)

## Recomendación de Número de Hilos:

```c++
// Óptimo: número de núcleos del sistema
unsigned int num_cores = thread::hardware_concurrency();
vector<thread> hilos(num_cores);
```

Esta implementación te permite medir exactamente la mejora de performance que obtienes con la paralelización.