// UVa 839 - Not so Mobile: solo la lectura, con scanf
// Imprime cada barra que lee, con sangría según su nivel en el móvil,
// para ver en qué orden llegan las líneas.
#include <cstdio>

// lee una barra y, si de algún lado cuelga un submóvil, lo lee entero
// antes de seguir; nivel es la profundidad de la barra en el móvil
void leerBarra(int nivel) {
    int wl, dl, wr, dr;
    scanf("%d %d %d %d", &wl, &dl, &wr, &dr);
    for (int i = 0; i < nivel; i++) {
        printf("    ");
    }
    printf("barra: Wl=%d Dl=%d Wr=%d Dr=%d\n", wl, dl, wr, dr);
    if (wl == 0) {
        leerBarra(nivel + 1);
    }
    if (wr == 0) {
        leerBarra(nivel + 1);
    }
}

int main() {
    int casos;
    scanf("%d", &casos);
    for (int c = 0; c < casos; c++) {
        printf("caso %d\n", c + 1);
        leerBarra(0);
    }
    return 0;
}
