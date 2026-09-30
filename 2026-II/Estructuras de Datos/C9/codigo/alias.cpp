#include <cstdio>

int main() {
    int x = 0;
    int y = 10;
    int &z = x;

    printf("x = %d y = %d z = %d\n", x, y, z);
    z = y + x;
    printf("x = %d y = %d z = %d\n", x, y, z);
    return 0;
}
