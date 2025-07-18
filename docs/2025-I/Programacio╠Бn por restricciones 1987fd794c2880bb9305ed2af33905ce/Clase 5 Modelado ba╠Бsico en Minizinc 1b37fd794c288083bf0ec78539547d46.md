# Clase 5: Modelado básico en Minizinc

# Generalidades

¿Porque usamos Minizinc?

1. Especifico para este tipo de problemas de modelado usando una sintaxis de alto nivel
2. Se encarga de traducir al solver (sintaxis bajo nivel) el modelo que se escribe
3. Nos enfocamos en modelar y no en programar

# Modelado en CSP

Enfoque

1. Problemas de dominio entero o discreto
2. Problemas lineales

---

Carga de datos

- Se coloca una variable int, array, flotante, etc
- Se especifica el archivo dzn cuando se ejecuta el modelo
- modelo.mzn

```prolog
int: n;
array[1..3,1..3] of var int: s;
```

- data.dzn

```prolog
n = 4;
s =array2d(1..3,1..3,[
  1,_,3,
  4,_,6,
  7,_,9]);
```

---

Que tenemos en un modelo

1. Declaraciones de variables de decisión (buscar)
2. Declaraciones de entradas
3. Restricciones
4. Funciones predicado (suma, para todo, existe, implica)
5. Función objetivo: Maximizar o minimizar o satisfacer (aqui colocalos la estrategia de búsqueda o propagación)
6. Comando output

# Generalización de los modelos

Limitaciones de modelos estáticos

1. Solo trabajan para una instancia del problema
2. Si el problema cambia en su tamaño, debemos escribir de nuevo el modelo

---

Como generalizamos

1. Definir entradas con los dzn
2. Vamos a recibir las entradas en variables que no tengan el **var (decisión)**
3. Usamos enumeraciones, conjuntos o arrays

# Ejemplo

```prolog
%Lectura de datos:
int: n;
array[1..n] of float: w;
array[1..n] of float: c;
int: W;

%Variables:
array[1..n] of var bool: x; %  array[1..n] of var 0..1: x; 

%Restricciones:
constraint sum(j in 1..n)( w[j]* x[j] ) <= W;

%Objetivo
var int: utilidad;
constraint utilidad = sum(j in 1..n)( c[j]* x[j] );
solve maximize utilidad;

 
```

1. Se usan arrays para poder recibir un valor arbritario de entradas
2. Vamos a utilizar operaciones como alldiferent, sum, entre otros para aplicar restricciones sobre los arreglos

# Recursos

1. Librería (sin importar modulos) [https://docs.minizinc.dev/en/stable/lib-stdlib.html](https://docs.minizinc.dev/en/stable/lib-stdlib.html) 
2. Librerías adicionales (importar modulos) [https://docs.minizinc.dev/en/stable/lib-globals.html](https://docs.minizinc.dev/en/stable/lib-globals.html) 

# Resumen

Aquí está el resumen de los conceptos básicos de modelado en Minizinc:

**¿Por qué usar Minizinc?**

- Es específico para problemas de modelado con sintaxis de alto nivel
- Traduce el modelo al solver (sintaxis bajo nivel)
- Permite enfocarse en modelar y no en programar

**Componentes de un modelo:**

- Declaraciones de variables de decisión
- Declaraciones de entradas
- Restricciones
- Funciones predicado (suma, para todo, existe, implica)
- Función objetivo (maximizar/minimizar/satisfacer)
- Comando output

**Generalización de modelos:**

- Se usan arrays para recibir valores arbitrarios de entradas
- Se utilizan operaciones como alldiferent, sum y otras para aplicar restricciones sobre los arreglos

**Carga de datos:**

- Se especifican variables (int, array, flotante, etc.)
- Se usa un archivo .dzn para los datos cuando se ejecuta el modelo