/* Version que NO pasa: supone que i siempre viene
   antes que j. Pasa el ejemplo del enunciado. */
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
    long long i, j, n, mejor, actual;

    while (scanf("%lld %lld", &i, &j) == 2)
    {
        mejor = 0;
        n = i;
        while (n <= j)
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
