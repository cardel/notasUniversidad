# Sesión 9: 18 de Abril: Paso por referencia

¿Cual es la motivacion para no pasar valores directamente?

Cuando tenemos colecciones o datos que son dificiles/costosos de copiar

Cuando queremos directamente que un variable se pueda modificar dentro de un procedimiento

---

¿Como implementamos paso por referencia?

Introducimos los targets, target-directo apunta a un valor directamente, target-indirecto apunta a un target-directo

Los targets indirectos existe sii es un paso de parametros con variables, en otro caso es target-directo

Cuando intentamos pasar un target-indirecto a un procedimiento, se genera un target-indirecto pero que contiene el target-directo interno

---

¿Que cambio en el interpretador?

Toda declaración de valor es un target-directo

Los targets indirecto se generan cuando pasamos un var-exp (variable) a un procedimiento (f x y)

---

¿Que cambio en el funcionamiento?

Tener en cuenta que los cambios son SECUENCIALES en el orden de EJECUCIOn

casos como set x = <exp> resuelven primero lo de la DERECHA

casos como +(….) primitivas, se resuelven a izquierda a derecha, el resultado PUEDE CAMBIAR si evaluamos en viceversa