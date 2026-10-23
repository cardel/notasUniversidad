// Las mismas 2000 personas con tres funciones hash: cubetas usadas y lista mas larga.
#include <cstdio>
#include <string>
#include <unordered_map>
#include "persona.h"
using std::unordered_map;

const int N_NOMBRES = 10;
const char *NOMBRES[N_NOMBRES] = {"ana", "beto", "carla", "dario", "eva",
                                  "fabio", "gina", "hugo", "ines", "juan"};

int modo;   // 0: solo edad, 1: edad + salario, 2: los tres campos

// Llama a la funcion hash que diga modo
struct HashSegunModo {
  unsigned long long operator()(const Persona &p) const {
    unsigned long long h;
    if (modo == 0) {
      h = HashEdad()(p);
    } else if (modo == 1) {
      h = HashSuma()(p);
    } else {
      h = HashPersona()(p);
    }
    return h;
  }
};

// 10 nombres, edades de 20 a 39 y salarios de 1000 a 1090 de 10 en 10
void medir(int m, const char *nombre) {
  modo = m;
  unordered_map<Persona, int, HashSegunModo> u;
  int a = 0;
  while (a < N_NOMBRES) {
    int e = 20;
    while (e < 40) {
      int s = 1000;
      while (s < 1100) {
        Persona p;
        p.nombre = NOMBRES[a];
        p.edad = e;
        p.salario = s;
        u[p] = 1;
        s = s + 10;
      }
      e = e + 1;
    }
    a = a + 1;
  }
  int usadas = 0;
  int mayor = 0;
  int b = 0;
  while (b < (int) u.bucket_count()) {
    int largo = (int) u.bucket_size(b);
    if (largo > 0) {
      usadas = usadas + 1;
    }
    if (largo > mayor) {
      mayor = largo;
    }
    b = b + 1;
  }
  printf("%-9s n = %d, cubetas = %d, usadas = %d, lista mas larga = %d\n",
         nombre, (int) u.size(), (int) u.bucket_count(), usadas, mayor);
}

int main() {
  medir(0, "edad");
  medir(1, "edad+sal");
  medir(2, "completo");
  return 0;
}
