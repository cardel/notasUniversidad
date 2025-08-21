Vamos a utilizar gramáticas regulares. Los términales están por la izquierda, por ejemplo
```scala
var x = 10
var y
//Van a producir conflicto, porque inician igual
```
Gramáticas en forma BNC
```bnc
<lista> ::= <empty>
		::= <int> <lista>
```
```bnc
<lista> ::= <int>*

<lista> ::= <int>+
```