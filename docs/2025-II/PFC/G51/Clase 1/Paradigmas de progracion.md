# Imperativo
Es un paradigma de programación enfocado a las variables, procedimientos y secuencialidad
```python
#Variables
width = 10
height = 10

#Procedimientos
def crearMatrix(w, h):
	#Estructuras de control
	
	# Condicional flujos
	if w >= 0 and h >= 0:
		#Estructura de control repetición
		for i in range(0,w):
			for j in range(0,h):
				#Instrucciones

```
El programa está gobernado por la secuencialidad y el estado de las variables

# Paradigma O.O

Se utiliza el objeto como abstracción del mundo real, un objeto tiene propiedades y comportamiento

Un objeto se instancia desde una clase, la cual una plantilla la cual nos ofrece la estructura que tiene un objeto: campos y los métodos

Instanciar es darle valores a los campos

```c++
class Pepito {
	//Atributos
	int atributoA;
	int atributoB;
	
	//Métodos
	//Constructor
	Pepito() {
		atributoA = 1;
		atributoB = 2;
	}
	
	int sumarC(int x) {
		//Instrucciones
		return x + atributoA;
	}
	
	int metodoD(int a, int b, int c = 8)
	//Valores por defecto
	
	int metodoD(...) {
		if(...){
		}
		else {
		}
		
		for(int i=0; i<=n; i++){}
		
		switch(x){
			case 1:
				break;
			
			default:
				break;
		}
		
		while(cnt <= n) {
		}
		
		int a = 0; //32 bits
		short b = 0; //16 bits
		byte c = 0; //8 bits
		boolean d = true; //True o False
		char e = 'c'; //8 bits
		long d = 2L; //64 bits
		float f = 4f; //32 bits
		double x = 3.0; //64 bits
		unsigned int y = 0; //32 bits no **signado**
	}
}
```
En O.O se programa pensando en los objetos y sus relaciones
- Clases: Herencia, uso y composición
- Polimorfismo: Herencia + implementación

# Programación orientada a eventos

El flujo del programa se basa en las interaciones con el usuario.
- Clic del ratón
- Mover el ratón.
- Presionar una tecla
- Etc
Estos originan **eventos** los cuales son capturados y en consecuencia se ejecutan las instrucciones.

## Colecciones

Agrupaciones de datos

- Listas enlazadas (LinkedList)
- Arreglos dinámicos (ArrayList)
- Tablas Hash (HashMap, TreeMap)
- Vectores (Vector) en memoria el vector almacena el doble de los elementos para optimizar la inserción
- Queue / Stacks

# Programación funcional

Está orientada a las funciones y cómo estas interactuan entre sí, desde la matemática tenemos el concepto función: Dominio (valores de entrada), Rango (valores de salida)

$$
f(x,y) = x+y,  D(f) \in \mathbb(N \times N), R(f) \in \mathbb(N)
$$

En computación llevamos esto a un nivel más generico

- Las entradas pueden ser distintos tipos
- Salidas tambien ser de distintos tipos
- Las funciones se consideran ciudadanos de primera clase, se trabaja igual que los valores. Una función se puede **invocar**

En programación funcional tenemos varios hitos

1. El programa se basa en las funciones y no en la secuencialidad. No importa donde este ubicada una función se puede llamar.
2. Hay ligaduras y no variables. Una ligadura es nombrar un valor, estos no pueden cambiar, es decir **no hay asignación**
3. Tampoco hay secuencialidad como consecuencia del punto 1.
4. Se utiliza principalmente la recursión
	1. Caso base: Solución inmediata
	2. Caso recursivo nos debe llevar al caso base
5. Tenemos estrategias de manejo funcional
	1. Funciones de alto orden: filter, map, reduce
	2. reconocimiento de patrones
	3. Expresiones for
6. No se tienen retornos, todo se considera como un valor


```scala
class Perrito {

	def funcion(n:Int):Int = {
		val n2 = Math.pow(n,2).toInt
		val n3 = Math.pow(n,0.5).toInt
		n2 + n3
	}
}

```

## Apunte
---

**La asignación no es funcional. ¿Por qué?**  
Porque no retorna un valor. En programación funcional, las funciones deben ser **expresiones que produzcan un resultado**, no instrucciones que solo ejecutan efectos secundarios.  

Los tipos `void` o `null` no se consideran funcionales en este contexto porque:  
- **No representan un valor útil** para transformaciones o composiciones.  
- **Rompen el principio de transparencia referencial**, ya que no pueden ser sustituidos por su resultado sin alterar el comportamiento del programa.  

En esencia, una función pura siempre debe **mapear entradas a salidas**, y la asignación (como modificar variables externas) viola este principio al carecer de un valor de retorno significativo.


```java
public class Perrito {
    int pesito = 3;
    
    void metodito() {
        // ❌ ASIGNACIÓN NO FUNCIONAL:
        // 1. La expresión `pesito += 3` realiza una asignación (modifica el estado de `pesito`).
        // 2. En programación funcional, las asignaciones mutables están prohibidas porque:
        //    - Rompen la transparencia referencial (el resultado depende del estado externo).
        //    - Generan efectos secundarios (cambian valores fuera de su ámbito local).
        // 3. Además, este código intenta asignar el resultado de la asignación (que es de tipo `int`) 
        //    a la variable `cosita`, pero en un contexto de método `void`, lo cual es inconsistente.
        
        // ❌ ERROR EN JAVA:
        // Java no permite asignar un valor a una variable local si el método es `void`.
        // El operador `+=` devuelve el nuevo valor (en este caso, 6), pero el método 
        // no está diseñado para retornar nada. Esto genera un error de compilación porque:
        // "Unexpected return value from assignment in void method".
        
        int cosita = pesito += 3; // 🚫 Error de compilación: incompatible types
    }
}
```

### Explicación ampliada:
- **No es funcional**: Porque modifica el estado de `pesito` (efecto secundario) y intenta usar el resultado de una asignación como expresión de valor.
- **Falla en Java**: Un método `void` no puede capturar el resultado de una expresión de asignación (como `pesito += 3`) en una variable, ya que eso implica un retorno de valor no permitido en este contexto.

