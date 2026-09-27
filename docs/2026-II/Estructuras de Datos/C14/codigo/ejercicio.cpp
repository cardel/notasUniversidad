#include <algorithm>
#include <cstdio>
#include <vector>
using std::vector;

void interseccion(vector<int> &a, vector<int> &b, vector<int> &res) {

  vector<int>::iterator ita = a.begin();
  vector<int>::iterator itb = b.begin();

  while (ita != a.end() && itb != b.end()) {
    if (*ita == *itb) {
      res.push_back(*ita);
      ita++;
      itb++;
    } else {
      if (*ita < *itb) {
        ita++;
      } else {
        itb++;
      }
    }
  }
  vector<int>::iterator finres = std::unique(res.begin(), res.end());
  res.erase(finres, res.end());
}

int main() {

  vector<int> a = {1, 3, 3, 3, 4, 7, 9};
  vector<int> b = {2, 3, 3, 3, 3, 3, 7, 8, 9};
  vector<int> res = {};

  interseccion(a, b, res);

  vector<int>::iterator itres = res.begin();

  while (itres != res.end()) {
    printf("%d ", *itres);
    itres++;
  }
  printf("\n");
}
