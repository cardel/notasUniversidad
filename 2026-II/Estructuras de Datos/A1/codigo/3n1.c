/* The 3n+1 problem: por cada par i j se busca la
   longitud de ciclo mas grande del intervalo. */
#include <stdio.h>

/* Cuantos numeros visita el algoritmo desde n hasta
   llegar a 1, contando los dos extremos. */
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
        /* El intervalo se recorre de menor a mayor;
           i y j se imprimen como llegaron. */
        desde = i;
        hasta = j;
        if (desde > hasta)
        {
            desde = j;
            hasta = i;
        }

        mejor = 0;
        n = desde;
        while (n <= hasta)
        {
            actual = longitud(n);
            if (actual > mejor)
            {
                mejor = actual;
            }
            n = n + 1;
        }

        printf("%lld %lld %lld\n", i, j, mejor);
    }

    return 0;
}
