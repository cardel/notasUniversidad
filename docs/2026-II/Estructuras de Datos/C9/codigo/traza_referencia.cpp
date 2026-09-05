#include <cstdio>

int algo(int &a, int b) {
    int ans = a + b;

    a = a + 1;
    b = b - 1;
    return ans;
}

int main() {
    int x = 10;
    int y = 2;
    int z = 8;
    int *w = &y;

    printf("x = %d y = %d z = %d\n", x, y, z);
    *w = algo(x, y);
    printf("x = %d y = %d z = %d\n", x, y, z);
    return 0;
}
