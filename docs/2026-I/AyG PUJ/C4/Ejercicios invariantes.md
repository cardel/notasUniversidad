# Diapositivas

Se toma lo que se hizo en la clase unicamente, en clase 3 encuentra todos los slides


![](Invariantes_annotatedFinal.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

# Trabajo en código

# Ejercicio 1

Computa

```java
public class Computa{

  //Sum p = 2, i de A
  public int invariante(int i, int A) {
    int sal = 0;
    for (int p = 2; p <= i; p++) {
      sal += A;
    }
    return sal;
  }


  public int Algoritmo(int A, int B) {

    int i, res;

    i = 1;
    res = 0;

    while (i <= B) {
      System.out.println(" i "+i+" res "+res + " inv "+invariante(i,A)+" "+(i-1)*A);
      i++;
      res += A;
    }
    System.out.println(" i "+i+" res "+res + " inv "+invariante(i,A)+" "+(i-1)*A);
    return res;
  }
  public static void main(String[] args) {
    Computa objComputa = new Computa();
    System.out.println(objComputa.Algoritmo(5,8));
  }
}

```


# Ejercicio 2
Computa 3

```python
def invarianteInterna(j, i):
    return i ** (j - 1)


def invarianteExterna(i):
    return (i - 1) ** 2 * i**2 / 4


def computa3(n):
    A = 0
    i = 1

    while i <= n:
        print("Invariante Externa: ", "A", A, invarianteExterna(i))
        B = 1
        j = 1
        while j <= 3:
            print("Invariante Interna: ", "B", B, invarianteInterna(j, i))
            B = B * i
            j = j + 1
        print("Invariante Interna: ", "B", B, invarianteInterna(j, i))
        A = A + B
        i = i + 1
    print("Invariante Externa: ", "A", A, invarianteExterna(i))
    return A


def main():
    print(computa3(5))


if __name__ == "__main__":
    main()

```


