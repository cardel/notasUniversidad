EL reduce toma una colección y devuelve un valor, podemos reducir por la izquierda o por la derecha

```scala
val f = Array(1,2,3)
f.foldLeft(0)((acc,x) => acc+x)
//(((0+1)+2)+3)
f.foldRight(0)((acc,x) => acc+x)
// (((0+3)+2)+1)
```

Para paralelizar la operación debe **asociativa** e independiente, por ejemplo la suma

1+2+3+4+5+6  --> Secuencial
(1+2+3)+(4+5+6)  --> Dos hilos

Ambas dan el mismo resultado

1-2-3-4-5-6 = -19 --> Secuencial
(1-2-3)-(4-5-6) = -4-7 = -13 

Esto da un resultado diferente, porque la resta no es asociativa.

![](attachments/Pasted%20image%2020251113083947.png)

Los árboles de operaciones en sus nodos tiene la operación y en sus hojas tienen los valores
