// UVa 156 - Ananagrams
#include <algorithm>
#include <cctype>
#include <cstdio>
#include <map>
#include <string>
#include <vector>

using namespace std;

// las letras en minúscula y ordenadas: dos anagramas dan la misma clave
string clave(const string& palabra) {
    string k = palabra;
    for (int i = 0; i < (int) k.size(); i++) {
        k[i] = tolower(k[i]);
    }
    sort(k.begin(), k.end());
    return k;
}

int main() {
    char leida[100];
    vector<string> palabras;
    map<string, int> cuenta;
    int ok = scanf("%s", leida);
    while (ok == 1 && leida[0] != '#') {
        string p = leida;
        cuenta[clave(p)] = cuenta[clave(p)] + 1;
        palabras.push_back(p);
        ok = scanf("%s", leida);
    }
    sort(palabras.begin(), palabras.end());
    for (int i = 0; i < (int) palabras.size(); i++) {
        if (cuenta[clave(palabras[i])] == 1) {
            printf("%s\n", palabras[i].c_str());
        }
    }
    return 0;
}
