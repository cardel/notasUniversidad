#include <chrono>
#include <cstdio>
#include <omp.h>

using namespace std;

const long N = 1000000000L;      // mil millones de rectangulos

double integrar() {
    double paso = 1.0 / N;
    double suma = 0.0;
    #pragma omp parallel for reduction(+ : suma)
    for (long i = 0; i < N; i++) {
        double x = (i + 0.5) * paso;
        suma += 4.0 / (1.0 + x * x);
    }
    return suma * paso;
}

int main() {
    double mejor = 1e30, pi = 0.0;
    for (int r = 0; r < 3; r++) {
        auto ini = chrono::high_resolution_clock::now();
        pi = integrar();
        auto fin = chrono::high_resolution_clock::now();
        double ms = chrono::duration<double, milli>(fin - ini).count();
        if (ms < mejor) mejor = ms;
    }
    printf("%2d hilos   pi = %.10f   %8.1f ms\n",
           omp_get_max_threads(), pi, mejor);
    return 0;
}
