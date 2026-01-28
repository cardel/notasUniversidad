![](attachments/2026-01-28-Note-08-56_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

## Ejemplo de código

```c++
#include <cstdio>

int main() {
  int* arr = new int[5]; //Reserve 5 espacios de 32 bits
  
  for(int i = 0; i<=5; i++){

    arr[i] = i+500;
  }
  printf("%d\n", arr[0]);
  printf("%d\n", *(arr));

  printf("%d\n", arr[1]);
  printf("%d\n", *(arr+1));
}
```