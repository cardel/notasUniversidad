// Cuantos hilos arranca el programa. Compila con y sin -fopenmp.
#include <cstdio>

#ifdef _OPENMP
#include <omp.h>
#endif

int main() {
#ifdef _OPENMP
    printf("compilado con OpenMP\n");
    #pragma omp parallel
    {
        #pragma omp critical
        printf("  hola desde el hilo %d de %d\n",
               omp_get_thread_num(), omp_get_num_threads());
    }
#else
    printf("compilado sin OpenMP: un solo hilo\n");
    printf("  hola desde el hilo 0 de 1\n");
#endif
    return 0;
}
