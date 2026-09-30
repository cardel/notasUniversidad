#include <cstdlib>
#include <string>

using std::string;

string alreves(string s) {
  string r = "";
  for (int i = 0; i < (int)s.size(); i++) {
    r.insert(r.begin(), s[i]);
  }
  return r;
}

int main() {
  string s1 = "estructuras";
  string r1 = alreves(s1);
  printf("La palabra %s al reves es %s\n", s1.c_str(), r1.c_str());

  printf("Son iguales %b\n", s1 == r1);
  string s2 = "reconocer";
  string r2 = alreves(s2);

  printf("La palabra %s al reves es %s\n", s2.c_str(), r2.c_str());
  printf("Son iguales %b\n", s2 == r2);

  return 0;
}
