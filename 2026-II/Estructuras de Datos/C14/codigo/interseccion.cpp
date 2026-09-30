// Interseccion de dos vectores ordenados con dos iteradores que avanzan.
#include <cstdio>
#include <vector>
using std::vector;

vector<int> interseccion(vector<int> &a, vector<int> &b) {
  vector<int> r;
  vector<int>::iterator i = a.begin();
  vector<int>::iterator j = b.begin();
  while (i != a.end() && j != b.end()) {
    if (*i < *j) {
      ++i;
    } else if (*j < *i) {
      ++j;
    } else {
      r.push_back(*i);
      ++i;
      ++j;
    }
  }
  return r;
}

int main() {
  vector<int> a = {1, 3, 4, 7, 9};
  vector<int> b = {2, 3, 7, 8, 9};
  vector<int> r = interseccion(a, b);
  vector<int>::iterator it = r.begin();
  while (it != r.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
  return 0;
}
