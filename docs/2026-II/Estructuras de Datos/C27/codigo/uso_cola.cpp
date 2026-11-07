// La cola de turnos de uso_deque.py, con deque de la STL.
#include <cstdio>
#include <deque>
#include <string>
using std::deque;
using std::string;

int main() {
  deque<string> t;
  t.push_back("Ana");
  t.push_back("Luis");
  t.push_back("Sara");
  printf("%s %d\n", t.front().c_str(),
         (int) t.size());
  string atendido = t.front();
  t.pop_front();
  printf("atiende a %s\n",
         atendido.c_str());
  t.push_back("Juan");
  t.push_front("Eva");
  int i = 0;
  while (i < (int) t.size()) {
    printf(" %s", t[i].c_str());
    i = i + 1;
  }
  printf("\n");
  return 0;
}
