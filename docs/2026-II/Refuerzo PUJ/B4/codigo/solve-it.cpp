#include <cmath>
#include <cstdio>

double f(int p, int q, int r, int s, int t, int u, double x) {
  // El lado izquierdo de la ecuacion, evaluado en x.
  return p * exp(-x) + q * sin(x) + r * cos(x) + s * tan(x) + t * x * x + u;
}

int main() {
  int p, q, r, s, t, u;
  while (scanf("%d %d %d %d %d %d", &p, &q, &r, &s, &t, &u) == 6) {
    if (f(p, q, r, s, t, u, 0.0) < 0.0 || f(p, q, r, s, t, u, 1.0) > 0.0) {
      printf("No solution\n");
    } else {
      double lo = 0.0, hi = 1.0;
      for (int vuelta = 0; vuelta < 100; vuelta++) {
        double medio = (lo + hi) / 2.0;
        if (f(p, q, r, s, t, u, medio) > 0.0) {
          lo = medio;
        } else {
          hi = medio;
        }
      }
      printf("%.4f\n", (lo + hi) / 2.0);
    }
  }
  return 0;
}
