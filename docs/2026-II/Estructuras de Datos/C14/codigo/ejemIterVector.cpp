#include <cstdio>
#include <vector>

using std::vector;

int main() {
  vector<int> v = {1, 2, 3, 4, 5};
  vector<int>::iterator it = v.begin() + 2;
  printf("%p\n", v.begin());
  printf("%p\n", it);
  printf("%d\n", *it);
  v.insert(v.begin(), 30);

  printf("%p\n", it);
  printf("%d\n", *it); // EL vector se ha movido a otra seccion de memoria
  it = v.begin() + 2;

  printf("%p\n", it);
  printf("%d\n", *it);
}
