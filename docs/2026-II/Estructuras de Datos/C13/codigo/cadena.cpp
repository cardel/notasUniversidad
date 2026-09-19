// string como contenedor de caracteres.
#include <cstdio>
#include <string>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::string;

int vocales(string s) {
  int c = 0;
  int i = 0;
  while (i < (int) s.size()) {
    if (s[i] == 'a' || s[i] == 'e' || s[i] == 'i' || s[i] == 'o' || s[i] == 'u') {
      c = c + 1;
    }
    i = i + 1;
  }
  return c;
}

string alReves(string s) {
  string r;
  int i = (int) s.size() - 1;
  while (i >= 0) {
    r.push_back(s[i]);
    i = i - 1;
  }
  return r;
}

int main() {
  string s = "estructura";
  string t = s + " de datos";
  printf("%s tiene %d caracteres\n", t.c_str(), (int) t.size());
  printf("vocales de %s: %d\n", s.c_str(), vocales(s));
  printf("al reves: %s\n", alReves(s).c_str());
  printf("reconocer al reves es %s\n", alReves("reconocer") == "reconocer" ? "igual" : "distinto");
  printf("%s < %s: %d\n", "cola", "pila", (int) (string("cola") < string("pila")));
  return 0;
}
