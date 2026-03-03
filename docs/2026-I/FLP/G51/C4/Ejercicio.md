Generar una definicion de datos para arboles bajo esta definición

```ebnf
<arbol-t> :: <int>   
			leaf-int(num)
			<symbol>
			leaf-symbol(sym)
			<symbol> <arbol-t> <arbol-t> <arbol-t>
			node-sym(key,h1,h2,h3)
			<int> <arbol-t> <arbol-t> <arbol-t>
			node-int(key,h1,h2,h3)
```

Hacer el define-datatype, definir un arbol de almenos profundidad 2 balanceado combinando los tipos de nodos y hojas, y hacer las funciones
1. arbol-t->listsym
2. arbol-t->num (suma de los numeros)