# Clase 6: Introducción a la optimización

[2025-03-20-Note-14-45_annotated.pdf](Clase%206%20Introduccio%CC%81n%20a%20la%20optimizacio%CC%81n%201bc7fd794c288011afb3cd021bb436b6/2025-03-20-Note-14-45_annotated.pdf)

```mathematica
var int: L; %Lechona
var int: T; %Tamales

constraint L>=0;
constraint T>=0;

constraint T+2*L <= 100; %Restricción tiempo
constraint 3*T+4*L <= 180; %Restricción de lombriz
constraint 2*T+L <= 90; %Restricción de frijoles
constraint T+2*L <= 80; %Restricción de arracacha

solve maximize 5*L+3*T;
output [
  "Tamales= ", show(T), " Lechona= ", show(L)];
```

```mathematica
var int: Is;
var int: Ts;
var int: C;
var int: z;

constraint Is >= 0;
constraint Ts >= 0;
constraint C >= 0;

constraint 50*Is + 40*Ts + 60*C <= 1600; %Presupuesto
constraint 20*Is + 25*Ts + 30*C <= 1500; %Tiempo ocupados
constraint 2*Ts - Is >= 0;
constraint Ts + Is - C >= 0;
constraint z =  20*Is + 15*Ts + 25*C;

solve maximize z;

output[
  "Is= ", show(Is), " Ts ", show(Ts), " C ", show(C), " Bloques ", show(z)];
```