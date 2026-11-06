#include <cstdio>
#include <functional>
#include <queue>
#include <utility>
#include <vector>

using namespace std;

int main() {
  // La cola saca primero el par menor: instante y, si empatan, número.
  priority_queue<pair<int, int>, vector<pair<int, int> >,
                 greater<pair<int, int> > > cola;
  vector<int> periodo(3001);
  char palabra[10];
  int num, p;
  while (scanf("%s", palabra) == 1 && palabra[0] != '#') {
    scanf("%d %d", &num, &p);
    periodo[num] = p;
    cola.push(make_pair(p, num));
  }
  int k;
  scanf("%d", &k);
  for (int i = 0; i < k; i++) {
    pair<int, int> menor = cola.top();
    cola.pop();
    printf("%d\n", menor.second);
    cola.push(make_pair(menor.first + periodo[menor.second], menor.second));
  }
  return 0;
}
