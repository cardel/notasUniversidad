// UVa 10935 - Throwing cards away I
#include <cstdio>
#include <queue>

using namespace std;

void jugar(int n) {
    queue<int> mazo;
    for (int carta = 1; carta <= n; carta++) {
        mazo.push(carta);
    }
    printf("Discarded cards:");
    bool primera = true;
    while (mazo.size() >= 2) {
        if (primera) {
            printf(" %d", mazo.front());
            primera = false;
        } else {
            printf(", %d", mazo.front());
        }
        mazo.pop();
        mazo.push(mazo.front());
        mazo.pop();
    }
    printf("\nRemaining card: %d\n", mazo.front());
}

int main() {
    int n = 0;
    scanf("%d", &n);
    while (n != 0) {
        jugar(n);
        n = 0;
        scanf("%d", &n);
    }
    return 0;
}
