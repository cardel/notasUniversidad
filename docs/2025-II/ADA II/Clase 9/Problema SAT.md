Problema de satisfactibilidad booleana, este problema fue demostrado por Stephen Cook en 1971, este problema es uno de los retos del milenio en computación.

SAT es NP y cualquier problema NPC puede ser reducido a SAT en tiempo polinomial

**Por lo tanto, resolver SAT en tiempo polinomial IMPLICA que todos lo problemas NPC se resuelven en tiempo polinomial**

# Descripción

Es un conjunto de clausulas binarias en forma normal conjuntiva (FNC) que son conjunciones de disyunciones

$$
(v_1  \vee v_2 \vee \bar{v_3}) \wedge (v_1 \vee v_2) \wedge (v_1 \vee v_2 \vee v_3 \vee \bar{v_4})
$$

¿ Existe una combinación de valores para las variables binarias de tal forma la formula se satisfaga, es decir sea VERDADERA?

# Demostracion

## 1. ¿Porque este problema es NP-duro?

- Dada una MTND cualquiera que resuelva un problema NPC produce una formula FNC de SAT de tal forma 1) si la maquina acepta la entrada entonces es satisfactible 2) SI la maquina no acepta la entrada no es satisfactible ($2^n$ estado al tiempo)
- El numero de variables necesarias para codificar en la maquina es polinomial con respecto al tamaño de la maquina.
- El numero de clasulas es polinomial con respecto al tamaño de la maquina
- SI se llega a demostrar que SAT se puede hacer en tiempo polinomial en una MTD por ende cualquier problema NPC puede ser resuelto en tiempo polinomial en una MTD