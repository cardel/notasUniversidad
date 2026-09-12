/* Version que agota el tiempo: por cada par recorre
   desde 1 y descarta lo que quede por debajo de i.
   Las respuestas son correctas; el costo, no. */
#include <stdio.h>

long long longitud(long long n)
{
    long long cuenta;

    cuenta = 1;
    while (n > 1)
    {
        if (n % 2 == 0)
        {
            n = n / 2;
        }
        else
        {
            n = 3 * n + 1;
        }
        cuenta = cuenta + 1;
    }

    return cuenta;
}

int main(void)
{
    long long i, j, desde, hasta, n, mejor, actual;

    while (scanf("%lld %lld", &i, &j) == 2)
    {
        desde = i;
        hasta = j;
        if (desde > hasta)
        {
            desde = j;
            hasta = i;
        }

        mejor = 0;
        n = 1;
        while (n <= hasta)
        {
            actual = longitud(n);
            if (n >= desde && actual > mejor)
            {
                mejor = actual;
            }
            n = n + 1;
        }

        printf("%lld %lld %lld\n", i, j, mejor);
    }

    return 0;
}
