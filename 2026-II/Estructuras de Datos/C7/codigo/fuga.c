/* Reserva en cada vuelta y nunca libera: fuga de memoria */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int i = 0;
    int atendidas = 0;

    while (i < 1000) {
        int *pedido = malloc(250 * sizeof(int));
        if (pedido != NULL) {
            pedido[0] = i;
            atendidas = atendidas + 1;
        }
        i = i + 1;   /* el bloque queda reservado para siempre */
    }
    printf("Atendidas: %d\n", atendidas);
    return 0;
}
