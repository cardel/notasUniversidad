#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <stack>
#include <string>

using std::fgets;
using std::stack;
using std::string;

#define SIZE 1024

bool cierre(char a, char b) {
  return (a == '(' && b == ')') || (a == '[' && b == ']');
}

int main() {
  int n;
  scanf("%d", &n);
  while (getchar() != '\n')
    ;
  for (int i = 0; i < n; i++) {
    char linea[SIZE];
    fgets(linea, SIZE, stdin);
    int j = 0;
    bool ok = true;
    stack<char> p;

    while (linea[j] != '\n' && linea[j] != '\0') {
      char s = linea[j];
      if (s == '(' || s == '[') {
        p.push(s);
      } else {
        if (p.empty()) {
          ok = false;
        } else {
          char c = p.top();
          if (!cierre(c, s)) {
            ok = false;
          }

          p.pop();
        }
      }
      j++;
    }
    string sal = (ok && p.empty()) ? "Yes" : "No";
    printf("%s\n", sal.c_str());
  }
}
