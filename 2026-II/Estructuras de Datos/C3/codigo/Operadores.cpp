#include <stdio.h>

int main() {
  int arr[] = {1, 2, 3, 4};
  int index = 4;

  // EL operador dde cortocircuito && si la primera es falsa no verifica mas
  //  El operador de cortocircuito || si la primera es verdadero no verifica las
  //  demás
  //  //EL operador dde cortocircuito && si la primera es falsa no verifica mas
  //   El operador de cortocircuito || si la primera es verdadero no verifica
  //   las demás
  printf(" Ejemplo %b", index < 4 && arr[index] % 2 == 0);
  printf(" Ejemplo %b", index <= 4 & arr[index] % 2 == 0);
  return 0;
}
