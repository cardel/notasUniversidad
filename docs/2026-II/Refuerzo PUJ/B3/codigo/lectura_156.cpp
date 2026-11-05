// UVa 156 - Ananagrams: solo la lectura, con scanf
// Imprime cada palabra que lee, hasta el #, sin importar en qué línea venga
// ni cuántos espacios la rodeen.
#include <cstdio>
#include <string>
#include <vector>

using namespace std;

int main() {
    char leida[100];
    vector<string> palabras;
    int ok = scanf("%s", leida);
    while (ok == 1 && leida[0] != '#') {
        string p = leida;
        palabras.push_back(p);
        ok = scanf("%s", leida);
    }
    printf("%d palabras\n", (int) palabras.size());
    for (int i = 0; i < (int) palabras.size(); i++) {
        printf("    palabra %d: %s\n", i + 1, palabras[i].c_str());
    }
    return 0;
}
