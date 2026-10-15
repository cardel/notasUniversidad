// Una llamada al sistema write por cada línea: 200.000 cruces al núcleo.
#include <fcntl.h>
#include <unistd.h>
#include <cstdio>

int main() {
  int fd = open("salida.txt",
      O_WRONLY | O_CREAT | O_TRUNC, 0644);
  char linea[32];
  for (int i = 0; i < 200000; i++) {
    int n = snprintf(linea, sizeof(linea),
                     "%d\n", i);
    write(fd, linea, n);
  }
  close(fd);
  return 0;
}
