# 3. Método inductivo

| Pregunta | Criterio |
| --- | --- |
| ¿Como funciona el método? | Tenemos una ecuación del estilo T(n) = aT(n/b)+f(n) (limitarlo) y tengo una solución que en termino de una cota O, omega, tetha de g(n) |
| ¿El metodo por donde parte? | Paso inductivo: T(n/b) ≤ c*g(n/b) VERDADERO |
| ¿Como incluyo la hipotesis inductiva en la ecuación T(n)? | Reemplaza T(n/b) con la hipotesis |
| ¿Que hago con las operaciones con las constantes? | Si tiene una suma, resta, multipicación o división de un número por una constante: Pongo una constante nueva que representa la operaicón |
| ¿Porque no importa la constante resultante? | Porque estamos trabajando con COTAS ASINTOTICAS |
| ¿Como demuestro la hipotesis? | Evaluo T(n) desde 1 hasta un valor dado, le doy un valor a la constante y verifco que la desigualdad se CUMPLA |
| ¿Que pasa si la desigualdad no se cumple? | Vario el valor de c |
| ¿COmo me doy cuenta que la relación se va a cumplir habia el infinito? | Miro la diferencia si esta es creciente es una GARANTIA que al infinito va a seguir de la misma forma. |