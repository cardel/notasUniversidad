# Sesión 04: Árboles de sintaxis abstracta

# Introducción

Motivación

1. Hemos visto representaciones basadas en tipos de datos existentes en el lenguaje, por ejemplo listas y procedimientos
2. Una representación totalmente fiel a la gramática, que permita representar datos pertenecientes a un conjunto y trabajar con ellos

---

Arbol de Sintaxis Abstracta (AST)

1. Es una representación que nace a partir de la gramática
2. Si el tipo de dato esta correctamente construido se puede construir el AST, de lo contrario no es posible
3. AST permiten validar la sintaxis directamente
4. Los compiladores trabajan sobre el AST directamente
5. El flujo de ejecución se hace sobre el AST
6. Son independientes de la representación del lenguaje

---

Operaciones

1. Parser: Transformar de sintaxis concreta a abstracta (lenguaje entendido por humanos a entendido por el inteprete/compilador)
2. Unparser: Transforma de sintaxis abstracta a sintaxis concreta

## Sintaxis concreta y abstracta

Sintaxis concreta, es lo que ve el programador, por ejemplo codigo fuente

```cpp
int main() {
	int a = 8;
	int b = 9;
	int c = 10;
	printf("%d,%d, %d",a,b,c);
}
```

Sintaxis abstracta es lo que el programa ejecuta y es entedido por el interprete o compilador

<funcion> := <tipo> <identificador> <args>* <body>

<body> ::= <expresiones>*

<expresion> ::= <decl variable>

<decl-variable> ::= <tipo> <id> “=” <valor>

<printf-decl> ::= “printf” <string> <args>*