
Dada la siguiente gramatica
```ebnf
<map> :: '()                         
                empty-map
             :: <symbol> <value> <map>
               non-empty-map(k v m)
<value> ::= <int>
                   value-int(n)
               :: <symbol>
                  value-sym(s)
               :: <int> <value>
                   value-lint(n, l)
               :: <symbol> <value>
                    value-lsym(s,l)
```