/* Ejercicio de cierre: promedio de n temperaturas y cuantas lo superan */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 0;
    int i;
    int superan = 0;
    double suma = 0.0;
    double promedio;
    double *temperaturas;
    int estado = 0;

    printf("Cuantas temperaturas? ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Cantidad invalida\n");
        estado = 1;
    } else {
        temperaturas = malloc(n * sizeof(double));
        if (temperaturas == NULL) {
            printf("No hay memoria disponible\n");
            estado = 1;
        } else {
            i = 0;
            while (i < n) {
                scanf("%lf", &temperaturas[i]);
                suma = suma + temperaturas[i];
                i = i + 1;
            }
            promedio = suma / n;

            i = 0;
            while (i < n) {
                if (temperaturas[i] > promedio) {
                    superan = superan + 1;
                }
                i = i + 1;
            }

            printf("Promedio: %.2lf\n", promedio);
            printf("La superan: %d\n", superan);

            free(temperaturas);
            temperaturas = NULL;
        }
    }
    return estado;
}
