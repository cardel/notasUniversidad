# Sesión 10: Tipos

¿Que podemos decir sobre los tipos en un lenguaje de programación?

- Nos ayuda a controlar la memoria mejor (sabemos cuanto espacio van a ocupar)
- Nos permite controlar los errores con operaciones al saber como abordarlas
- Permite evitar operaciones NO DESEADAS

---

Clasificación de lenguajes por tipos

## Lenguajes fuertemente tipados

Un ejemplo de un lenguaje de programación fuertemente tipado es Java. Aquí hay un fragmento de código simple en Java:

```java
public class Main {
    public static void main(String[] args) {
        int numero = 10;
        String texto = "Hola Mundo";
        System.out.println(numero);
        System.out.println(texto);
    }
}

```

En este código, `numero` es un entero y `texto` es una cadena de texto. No se pueden realizar operaciones entre estos dos tipos de datos de manera directa, lo que muestra la tipificación fuerte de Java.

## Lenguaje debilmente tipados

Un ejemplo de un lenguaje de programación débilmente tipado es JavaScript. Aquí hay un fragmento de código simple en JavaScript:

```jsx
var numero = 10;
var texto = "Hola Mundo";
console.log(numero + texto);

```

En este código, `numero` es un número y `texto` es una cadena de texto. Se pueden realizar operaciones entre estos dos tipos de datos de manera directa, lo que muestra la tipificación débil de JavaScript.

## Lenguajes de tipado estático

Debe especificarse el tipo de las variables directamente

Un ejemplo de un lenguaje de tipado estático sería C++. Aquí hay un fragmento de código simple en C++:

```cpp
#include<iostream>
int main() {
   int numero = 10;
   std::cout<<numero;
   return 0;
}

```

## Lenguaje de tipado dinámico

El tipo es determinado en tiempo de ejecución

Claro, aquí tienes un fragmento simple de código en Python:

```python
numero = 10
texto = "Hola Mundo"
print(numero)
print(texto)

```

En este código, `numero` es un número y `texto` es una cadena de texto. Python determina estos tipos en tiempo de ejecución, lo que es característico de los lenguajes de tipado dinámico.

---

¿Como representamos los tipos en nuestro lenguaje? ¿Como manejamos las instrucciones?

Los tipos son atómicos: int y bool

Los tipos valor procedimiento: (t1*t2*t3) → t

```racket
proc(x)
	proc(y)
		+(x,y)
;;Tiene tipo (int->(int -> int))
```

Claro, aquí tienes dos ejemplos más variados:

```racket
proc(x)
	proc(y)
		proc(z)
			*(+(x,y),z)
;;Tiene tipo (int->(int -> (int -> int)))

proc(a)
	proc(b)
		if(=(a,b), "Iguales", "Diferentes")
;;Tiene tipo (int->(int -> string))

```

En el primer ejemplo, se crea una función que toma tres números enteros y devuelve el producto de la suma de los dos primeros con el tercero. Este ejemplo es del tipo (int->(int -> (int -> int))).

En el segundo ejemplo, se crea una función que toma dos números enteros y devuelve un string que indica si los números son iguales o diferentes. Este ejemplo es del tipo (int->(int -> string)).

---

La implementación en lenguaje

- Debemos hacer un chequeo de tipo junto a la evaluación de la expresión
- Tenemos una función que dado un valor o una expresión nos retorna el tipo
- Se valida que los argumentos coincidan con los tipos
- Reglas
    - if <bool> then <t> else <t>
    - Proc: ta*tb*tc*…*tn → t
    - (a1,a2,a3,…*an) los argumentos deben iguales en tipo y en cantidad
    - Primitivas, + (int*int)→int
    - let se crea un ambiente de tipos con las variables y su tipo es el tipo de la expresión (despues del in)
    - letrec es validar los tipos de salida de cada uno de los procedimientos, de otras funciona igual que los proc
- Las variables de tipo solo se pueden asignar una sola vez, si se intenta cambiar (hay un error de tipos)
- Verificamos las expresiones y reglas al haber error de tipos se DETIENE la ejecución