int conexiones;
int caso = 0;
while (scanf("%d", &conexiones) == 1 && conexiones != 0) {
  for (int i = 0; i < conexiones; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    /* aquí va el diccionario de número a índice */
  }
  int nodo, ttl;
  while (scanf("%d %d", &nodo, &ttl) == 2 && (nodo != 0 || ttl != 0)) {
    caso = caso + 1;
    /* aquí va el recorrido en amplitud */
  }
}
