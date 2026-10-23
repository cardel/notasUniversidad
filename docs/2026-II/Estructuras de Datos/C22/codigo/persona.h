// Una persona como clave: orden por edad, salario y nombre; igualdad y hash.
#ifndef PERSONA_H
#define PERSONA_H
#include <string>
using std::string;

struct Persona {
  string nombre;
  int edad;
  int salario;

  // edad, luego salario, luego nombre
  bool operator<(const Persona &o) const {
    bool menor;
    if (edad != o.edad) {
      menor = edad < o.edad;
    } else if (salario != o.salario) {
      menor = salario < o.salario;
    } else {
      menor = nombre < o.nombre;
    }
    return menor;
  }

  // la misma persona: los tres campos iguales
  bool operator==(const Persona &o) const {
    return edad == o.edad && salario == o.salario
           && nombre == o.nombre;
  }
};

// El mismo orden, como un struct aparte que se pasa al map
struct CompararPersona {
  bool operator()(const Persona &a, const Persona &b) const {
    bool menor;
    if (a.edad != b.edad) {
      menor = a.edad < b.edad;
    } else if (a.salario != b.salario) {
      menor = a.salario < b.salario;
    } else {
      menor = a.nombre < b.nombre;
    }
    return menor;
  }
};

// Solo mira la edad: dos personas de la misma edad quedan como una
struct SoloEdad {
  bool operator()(const Persona &a, const Persona &b) const {
    return a.edad < b.edad;
  }
};

// Horner en base 31 sobre el nombre, y despues la edad y el salario
struct HashPersona {
  unsigned long long operator()(const Persona &p) const {
    unsigned long long h = 0;
    int i = 0;
    while (i < (int) p.nombre.size()) {
      h = h * 31 + p.nombre[i];
      i = i + 1;
    }
    h = h * 31 + p.edad;
    h = h * 31 + p.salario;
    return h;
  }
};

// Dos combinaciones malas: solo la edad, y la edad mas el salario
struct HashEdad {
  unsigned long long operator()(const Persona &p) const {
    return p.edad;
  }
};

struct HashSuma {
  unsigned long long operator()(const Persona &p) const {
    return p.edad + p.salario;
  }
};
#endif
