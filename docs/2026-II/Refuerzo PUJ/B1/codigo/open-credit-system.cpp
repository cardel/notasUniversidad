// UVa 11078 - Open Credit System
#include <cstdio>
#include <vector>

using namespace std;

int mayor_diferencia(const vector<int>& a) {
    int mayor = a[0];
    int mejor = a[0] - a[1];
    for (int j = 1; j < (int) a.size(); j++) {
        if (mayor - a[j] > mejor) {
            mejor = mayor - a[j];
        }
        if (a[j] > mayor) {
            mayor = a[j];
        }
    }
    return mejor;
}

int main() {
    int t;
    scanf("%d", &t);
    for (int caso = 0; caso < t; caso++) {
        int n;
        scanf("%d", &n);
        vector<int> a(n);
        for (int k = 0; k < n; k++) {
            scanf("%d", &a[k]);
        }
        printf("%d\n", mayor_diferencia(a));
    }
    return 0;
}
