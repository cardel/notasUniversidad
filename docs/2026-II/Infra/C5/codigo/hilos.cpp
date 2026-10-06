// Dos preguntas distintas sobre el numero de hilos.
#include <cstdio>
#include <omp.h>

int main() {
    printf("omp_get_max_threads() = %d\n", omp_get_max_threads());
    #pragma omp parallel
    {
        #pragma omp single
        printf("hilos en la region    = %d\n", omp_get_num_threads());
    }
    return 0;
}
