# Sesión 11 Problemas computacionales

---

¿Como trabajamos los problemas computacionales?

- Estudio de su complejidad temporal
- Estudio de su complejidad espacial

---

Problemas resolubles y no resolubles

- Resoluble Se puede programar en un computador
- No resoluble: No se puede programar en una maquina de Turing determinista: Ejemplo problema de la parada de Turing

---

Problemas tratables y no tratables

- Tratable: Que se puede solucionar en tiempo polinomial
- No tratable: No se puede solucionar en tiempo polinomial

---

Problemas decibles y no decidibles

Un **problema** es "**decidible**" si existe un algoritmo que siempre puede resolverlo **en** un tiempo finito. Por el contrario, los **problemas** "**indecidibles**" carecen de tal algoritmo, por lo que no tienen solución definitiva.

---

# Proceso de reducción

¿Que es?

Trasformar una instancia de un problema A un problema B 

$$
A \leq_{p} B
$$

---

Que debe de cumplir

1. La reducción debe hacerse en tiempo polinomial determinista
2. Instancias positivas de A son instancia positivas de B
3. Instancias negativas de A son instancias negativas de B