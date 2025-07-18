# Sesión 05: Interpretador

# Conceptos

Interpretar vs Compilar

- Compilación requiere hacer una traducción del código a un lenguaje intermedio (código binario/maquina): Ventaja es más rapido PERO tenemos que preocuparnos por aspectos de bajo nivel y el lenguaje suele ser más complicado de entender. Transforma a lenguaje bytecode
- Intrepretar linea por linea y va resolviendo. ← mas sencillo para escribir codigo, desarrollador no se preocupe por cosas de bajo nivel. Desventaja: Más lento que los compilados

---

Pasos de la interpretación/compilación

- Frontend (Analizador y el traductor)
- Parser

1. Scanner: Extracción unidades significativas (numeros, palabras reservadas, cosas de la gramática, etc) ignoran cosas como los comentarios
2. Parser: A partir de lo obtenido en el scanner lo transformamos a un AST
    1. Si se va a compilar en este paso podemos transformar al lenguaje intermedio
    2. Interpretar ya tenemos el medio para extraer la información y ejecutar las operaciones

---

Scanner

Identifica unidades léxicas, estas usualmente van con lo identificado, una etiqueta y su posición en el código

```racket
x = 10
( ('x identificador 1)
  ('= identificador 1)
   (10 numero 1)
 )
```

---

# SLLGEN: Scheme Left Language Generator

```racket
;;Limitación es que las expresiones NO pueden iniciar por la igual por la izquierda
var x;
var x = 10;
```

[https://plt.cs.northwestern.edu/snapshots/current/doc/eopl/index.html#(form._((lib._eopl%2Feopl..rkt)._sllgen~3amake-string-scanner))](https://plt.cs.northwestern.edu/snapshots/current/doc/eopl/index.html#%28form._%28%28lib._eopl%2Feopl..rkt%29._sllgen~3amake-string-scanner%29%29) 

# Apuntes

1. Valores expresados: Son aquellos que el programador ve en el lenguaje, por el momento son sólo numeros
2. Valores denotados: Son aquellos que están almacenados en MEMORIA (ambientes)