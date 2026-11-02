// Los codigos distintos de una lista, de menor a mayor, de tres maneras.
#include <cstdio>
#include <set>
#include <map>
#include <vector>
#include <algorithm>
using std::set;
using std::map;
using std::vector;
using std::sort;
using std::unique;

const int N = 10;
int codigos[N] = {31, 12, 50, 12, 7, 31, 31, 64, 7, 50};

// cada insert busca su lugar en el arbol: O(log d), d los distintos
void conSet() {
  set<int> s;
  int i = 0;
  while (i < N) {
    s.insert(codigos[i]);
    i = i + 1;
  }
  printf("set:          ");
  set<int>::iterator it = s.begin();
  while (it != s.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("   (%d distintos)\n", (int) s.size());
}

// se copian los n, se ordenan y unique deja al frente los distintos
void conVector() {
  vector<int> v(codigos, codigos + N);
  sort(v.begin(), v.end());
  vector<int>::iterator fin = unique(v.begin(), v.end());
  v.erase(fin, v.end());
  printf("sort + unique:");
  int i = 0;
  while (i < (int) v.size()) {
    printf(" %d", v[i]);
    i = i + 1;
  }
  printf("   (%d distintos)\n", (int) v.size());
}

// el mismo arbol que el set, con un valor que nadie consulta
void conMap() {
  map<int, bool> m;
  int i = 0;
  while (i < N) {
    m[codigos[i]] = true;
    i = i + 1;
  }
  printf("map<int,bool>:");
  map<int, bool>::iterator it = m.begin();
  while (it != m.end()) {
    printf(" %d", it->first);
    ++it;
  }
  printf("   (%d distintos)\n", (int) m.size());
}

int main() {
  conSet();
  conVector();
  conMap();
  return 0;
}
