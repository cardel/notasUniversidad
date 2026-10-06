// Una region paralela dentro de otra: cuantos hilos tiene la interna.
#include <cstdio>
#include <omp.h>

int main() {
    omp_set_num_threads(3);
    printf("niveles activos permitidos = %d\n", omp_get_max_active_levels());

    #pragma omp parallel
    {
        int externo = omp_get_thread_num();
        #pragma omp parallel
        {
            #pragma omp single
            printf("  hilo externo %d abrio un equipo de %d\n",
                   externo, omp_get_num_threads());
        }
    }
    return 0;
}
