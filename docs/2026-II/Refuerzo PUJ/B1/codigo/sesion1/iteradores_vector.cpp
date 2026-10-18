// Un vector que se queda sin capacidad se muda a otro bloque del heap; los
// punteros e iteradores al bloque viejo dejan de servir y no se desreferencian.
#include <cstdio>
#include <vector>
using std::vector;

int main() {
  vector<int> cosita = {1, 2, 3, 4};
  vector<int>::iterator it = cosita.begin();
  const int *antes = &*it;
  printf("inicio:      tamano %zu, capacidad %zu, datos en %p\n", cosita.size(),
         cosita.capacity(), (const void *)cosita.data());

  cosita.erase(cosita.begin() + 2); // queda 1, 2, 4
  printf("tras erase:  tamano %zu, capacidad %zu, datos en %p\n", cosita.size(),
         cosita.capacity(), (const void *)cosita.data());

  cosita.push_back(20);
  cosita.push_back(10); // el quinto elemento no cabe en la capacidad 4
  printf("tras 2 push: tamano %zu, capacidad %zu, datos en %p\n", cosita.size(),
         cosita.capacity(), (const void *)cosita.data());

  if (antes == cosita.data()) {
    printf("el bloque es el mismo\n");
  } else {
    printf("el vector se mudo: it y antes apuntan al bloque viejo\n");
  }
  return 0;
}
