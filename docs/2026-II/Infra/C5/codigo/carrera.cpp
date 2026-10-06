// Suma sin reduction: dos hilos escriben la misma variable.
#include <cstdio>
#include <omp.h>

int main() {
    long suma = 0;
    #pragma omp parallel for
    for (int i = 0; i < 100000; i++)
        suma += i;          // carrera de datos

    printf("suma = %ld (deberia ser 4999950000)\n", suma);
    return 0;
}
