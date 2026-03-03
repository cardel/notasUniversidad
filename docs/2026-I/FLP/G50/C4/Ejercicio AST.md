
Dada la gramatica de arbol binario

```ebnf
<arbol-b> ::= <int>         
              leaf(num)
          ::= <symbol> <arbol-b> <arbol-b>
              node(key, left, right)
```

Construir los datatypes, parser y un parser. Además construir el arbol AST de un arbol de al menos profundidad 3.