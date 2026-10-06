// La suma de punto flotante no es asociativa: el orden de acumulacion
// cambia los ultimos digitos del resultado.
#include <cstdio>
#include <vector>
#include <omp.h>

int main() {
    const int n = 10000000;
    std::vector<double> v(n);
    for (int i = 0; i < n; i++)
        v[i] = 1.0 / (i + 1);

    double secuencial = 0.0;
    for (int i = 0; i < n; i++)
        secuencial += v[i];

    double paralela = 0.0;
    #pragma omp parallel for reduction(+ : paralela)
    for (int i = 0; i < n; i++)
        paralela += v[i];

    printf("secuencial = %.17g\n", secuencial);
    printf("paralela   = %.17g\n", paralela);
    printf("diferencia = %.3g\n", paralela - secuencial);
    return 0;
}
