// Lo que las variables de entorno le dicen a la biblioteca de OpenMP.
#include <cstdio>
#include <omp.h>

const char* nombre(omp_sched_t s) {
    switch (s & 0xF) {
        case omp_sched_static:  return "static";
        case omp_sched_dynamic: return "dynamic";
        case omp_sched_guided:  return "guided";
        default:                return "auto";
    }
}

int main() {
    omp_sched_t politica;
    int trozo;
    omp_get_schedule(&politica, &trozo);

    printf("omp_get_max_threads() = %d\n", omp_get_max_threads());
    printf("omp_get_dynamic()     = %d\n", omp_get_dynamic());
    printf("omp_get_schedule()    = %s, trozo %d\n", nombre(politica), trozo);
    return 0;
}
