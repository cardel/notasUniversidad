// stack y queue guardan sus elementos en otro contenedor.
#include <cstdio>
#include <stack>
#include <queue>
#include <vector>
#include <list>
using std::stack;
using std::queue;
using std::vector;
using std::list;

int main() {
  stack<int> a;                    // por debajo, un deque
  stack<int, vector<int> > b;      // por debajo, un vector
  queue<int, list<int> > c;        // por debajo, una list
  int x = 1;
  while (x <= 3) {
    a.push(x);
    b.push(10 * x);
    c.push(100 * x);
    x = x + 1;
  }
  printf("%d %d %d\n", a.top(), b.top(), c.front());
  a.pop();
  b.pop();
  c.pop();
  printf("%d %d %d\n", a.top(), b.top(), c.front());
  return 0;
}
