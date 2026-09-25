/* Puntero sin inicializar: el compilador lo anuncia con -Wall */
int main(void) {
    int *p;
    *p = 5;
    return 0;
}
