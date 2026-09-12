#include <stdio.h>

/* El paso es la quinta parte de n; suponga n >= 10 */
int paso_grande(int n) {
    int i = 0;
    int cuenta = 0;
    while (i <= n) {
        cuenta = cuenta + 1;
        i = i + n / 5;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d %d %d\n", paso_grande(20), paso_grande(65),
           paso_grande(1000), paso_grande(14));
    return 0;
}
