# Sesión 7: Ciclos while

Ciclo while

Es un ciclo que se repite hasta que la condición sea falsa

```python
i = 0 #Control
while i <= n: #Condición
	...
	...
	i+=1 #Cambio
```

Debe tenerse en cuenta que el cambio de la variable de control debe llevar la condición a FALSO, en caso contrario se queda en un BUCLE INFINITO

---

Tipos de variables en los ciclos

- Variables de control: Controlan cuantas veces se hace el ciclo, deben estar inicializadas antes del while, deben estar en la condición Y deben cambiar dentro del ciclo
- Variables contadoras: Se incrementan/decrementan/concatenan (en general cambian) dentro del ciclo de acuerdo a alguna condición, por ejemplo, contar el número de pares en un rango entre 1 y n.

---

Pseudcodigo

```python
inicializo la variable de control
inicializo variables contadoras
mientras <condicion> haga
   ...
   ...
   incluir cambio de la variable contadora
   incluir cambio de la variable de control
fin mientras
```

Las variables de control son OBLIGATORIAS