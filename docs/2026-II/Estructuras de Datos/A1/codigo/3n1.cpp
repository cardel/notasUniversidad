/* The 3n+1 problem, version en C++. Misma idea que
   en C; cambian la lectura y la escritura. */
#include <iostream>

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

int main()
{
    long long i, j, desde, hasta, n, mejor, actual;

    while (std::cin >> i >> j)
    {
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

        std::cout << i << " " << j << " "
                  << mejor << "\n";
    }

    return 0;
}
