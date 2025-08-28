Para introducir secuencialidad en la PF, vamos a utilizar los bloques
```scala
{
 ... instruccion 1 ...
 ... instruccion 2....
 ...
 ... instruccion n ....
}
```
Los bloques retornan el último valor como resultado, respetando el hecho de que PF toda expresión debe convertirse en un valor
![](attachments/Pasted%20image%2020250828085951.png)

En este caso caso x sólo existe dentro del bloque, por fuera el no existe, las ligaduras creadas dentro de un bloque sólo existen dentro de el.
![](attachments/Pasted%20image%2020250828090350.png)
Imprimir el 10 porque está dentro del contexto (es el primer x que encuentra), y el bloque como valor es 22
```scala
val s = {
    val s = {
        val s = 10
        println(s)  // Imprime 10 (s interno)
        s + 18      // Retorna 28
    }
    println(s)      // Imprime 28 (s del scope medio)
    s + 32          // Retorna 60
}
println(s) // Imprime 60
```

**Alcance léxico de la variable s:**
- `s = 10`: Scope más interno, visible solo dentro de su bloque
- `s = 28`: Scope medio, visible en su bloque y el bloque exterior
- `s = 60`: Scope externo, resultado final asignado a la variable

Cada declaración `val s` crea una nueva ligadura que **oculta** la anterior dentro de su scope, sin afectar las variables del mismo nombre en scopes externos.