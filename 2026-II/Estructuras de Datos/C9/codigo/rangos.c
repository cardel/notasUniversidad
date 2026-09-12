#include <stdio.h>
#include <limits.h>

int main(void) {
    printf("char           %d byte   [%d, %d]\n",
           (int) sizeof(char), CHAR_MIN, CHAR_MAX);
    printf("unsigned char  %d byte   [0, %d]\n",
           (int) sizeof(unsigned char), UCHAR_MAX);
    printf("int            %d bytes  [%d, %d]\n",
           (int) sizeof(int), INT_MIN, INT_MAX);
    printf("unsigned int   %d bytes  [0, %u]\n",
           (int) sizeof(unsigned int), UINT_MAX);
    printf("long           %d bytes  [%ld, %ld]\n",
           (int) sizeof(long), LONG_MIN, LONG_MAX);
    printf("float          %d bytes\n", (int) sizeof(float));
    printf("double         %d bytes\n", (int) sizeof(double));
    return 0;
}
