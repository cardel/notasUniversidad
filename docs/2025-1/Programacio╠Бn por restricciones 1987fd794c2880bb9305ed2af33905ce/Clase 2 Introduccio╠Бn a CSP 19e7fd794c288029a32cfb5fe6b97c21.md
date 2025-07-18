# Clase 2: Introducción a CSP

# Características de la CSP

Como es un problema de satisfacción de restricciones

- Conjunto de variables
- Cada una de estas variable tiene un Dominio **finito**
- Estas variables están sujetas de **restricciones**

---

Ejemplo

  SEND +
  MORE

MONEY

Escribir:

1000*S+E*100+N*10+D+M*1000+O*100+R*10+E = M*10000+O*1000+N*100+E*10+Y

Incluyendo variables de acarreo C1,..C4 cuyo dominio es binario

D + E = 10*C1+Y

C1 + N + R = 10*C2 + E

C2 + E + O = 10*C3 + N

C3 + S + M = 10*C4 + O

C4 = M

---

Otra forma programación entera

Creamos un conjunto de variables adicional para verificar que una variable mayor que la otra, por ejemplo $z_{S,E}$ si S es mayor que E, toma el valor 0 y si es E es mayor que S entonces toma el valor de 1, se garantiza que S es diferente que E

![image.png](Clase%202%20Introduccio%CC%81n%20a%20CSP%2019e7fd794c288029a32cfb5fe6b97c21/image.png)