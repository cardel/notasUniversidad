// TAD Diccionario sobre una tabla de direccionamiento directo (CLRS, 11.1).
// Las claves van de 0 a m - 1 y la casilla k guarda el registro de clave k.
#ifndef TABLA_DIRECTA_H
#define TABLA_DIRECTA_H
#include <cassert>
#include <cstdio>
#include <cstring>

struct Registro {
  int clave;
  char nombre[20];
};

class TablaDirecta {
private:
  Registro **T;      // T[k] apunta al registro de clave k, o vale NULL
  int m;             // tamano del universo de claves

public:
  // Theta(m): todas las casillas empiezan vacias
  TablaDirecta(int tam) {
    m = tam;
    T = new Registro*[m];
    int k = 0;
    while (k < m) {
      T[k] = NULL;
      k = k + 1;
    }
  }

  // Theta(m): se revisan todas las casillas
  ~TablaDirecta() {
    int k = 0;
    while (k < m) {
      delete T[k];
      k = k + 1;
    }
    delete[] T;
  }

  // exige 0 <= clave < m; si la clave ya estaba, cambia el nombre
  void insertar(int clave, const char *nombre) {
    assert(clave >= 0 && clave < m);
    if (T[clave] == NULL) {
      T[clave] = new Registro;
      T[clave]->clave = clave;
    }
    strcpy(T[clave]->nombre, nombre);
  }

  // exige 0 <= clave < m; devuelve NULL si no hay registro
  Registro *buscar(int clave) {
    assert(clave >= 0 && clave < m);
    return T[clave];
  }

  // exige 0 <= clave < m
  void eliminar(int clave) {
    assert(clave >= 0 && clave < m);
    delete T[clave];
    T[clave] = NULL;
  }

  void imprimir() {
    int k = 0;
    while (k < m) {
      if (T[k] == NULL) {
        printf(" %d:-", k);
      } else {
        printf(" %d:%s", k, T[k]->nombre);
      }
      k = k + 1;
    }
    printf("\n");
  }
};
#endif
