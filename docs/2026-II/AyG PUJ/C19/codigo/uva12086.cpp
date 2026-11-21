#include <cstdio>
#include <vector>

using std::vector;

// UVa 12086 - Potentiometers
// Un arreglo de N resistencias. Dos acciones, repetidas hasta END:
//   S x r   pone la resistencia x en r ohmios
//   M x y   mide la suma de las resistencias de x a y
// Es el arbol de segmentos de la clase, sin nada encima: update para S
// y query para M.
// Cada resistencia va de 0 a 1000 y N llega a 200 000, asi que la suma de
// todas es a lo sumo 2 * 10^8 y cabe en int.

void build(const vector<int> &A, vector<int> &tree, int v, int l, int r) {
    if (l == r) {
        tree[v] = A[l];
    } else {
        int m = (l + r) / 2;
        build(A, tree, 2 * v + 1, l, m);
        build(A, tree, 2 * v + 2, m + 1, r);
        tree[v] = tree[2 * v + 1] + tree[2 * v + 2];
    }
}

int query(const vector<int> &tree, int v, int l, int r, int ql, int qr) {
    int resultado;
    if (qr < l || r < ql) {
        resultado = 0;                     // disjunto: neutro de la suma
    } else if (ql <= l && r <= qr) {
        resultado = tree[v];               // contenido
    } else {
        int m = (l + r) / 2;               // solapado
        resultado = query(tree, 2 * v + 1, l, m, ql, qr)
                  + query(tree, 2 * v + 2, m + 1, r, ql, qr);
    }
    return resultado;
}

void update(vector<int> &tree, int v, int l, int r, int i, int valor) {
    if (l == r) {
        tree[v] = valor;
    } else {
        int m = (l + r) / 2;
        if (i <= m) {
            update(tree, 2 * v + 1, l, m, i, valor);
        } else {
            update(tree, 2 * v + 2, m + 1, r, i, valor);
        }
        tree[v] = tree[2 * v + 1] + tree[2 * v + 2];
    }
}

int main() {
    int n = 0;
    int caso = 1;
    if (scanf("%d", &n) != 1) {
        n = 0;
    }
    while (n != 0) {
        vector<int> A(n, 0);
        for (int k = 0; k < n; k++) {
            scanf("%d", &A[k]);
        }
        vector<int> tree(4 * n, 0);
        build(A, tree, 0, 0, n - 1);
        if (caso > 1) {
            printf("\n");                  // linea en blanco entre casos
        }
        printf("Case %d:\n", caso);
        char accion[8];
        scanf("%s", accion);
        while (accion[0] != 'E') {
            int x = 0;
            int y = 0;
            scanf("%d %d", &x, &y);
            if (accion[0] == 'S') {
                update(tree, 0, 0, n - 1, x - 1, y);
            } else {
                printf("%d\n", query(tree, 0, 0, n - 1, x - 1, y - 1));
            }
            scanf("%s", accion);
        }
        caso = caso + 1;
        if (scanf("%d", &n) != 1) {
            n = 0;
        }
    }
    return 0;
}
