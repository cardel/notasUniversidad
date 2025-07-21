# Definición
- Hay 3 pasos:
	- Dividir: Dividir el problema hasta llegar a los casos base (solución trivial o inmediata)
	- Conquistar: Resolver recursivamente los subproblemas
	- Combinar: Combinar las soluciones obtenidas hasta llegar a la solución final
- Los subproblemas deben ser **independientes** es decir que resolver uno no afecta a los demás
- La solución debe componerse de solución a subproblemas

## Ventajas
- Se llega a la solución optima
- Son modulares es decir son fáciles de integrar en una aplicación más grande
- Se pueden procesar en paralelo dado que cada subproblema es independiente
- Se pueden escalar fácilmente (por lo anterior)

## Desventajas
- Pueden ser complicados de implementar
- Requieren más memoria
- Pueden tener problemas por stackoverflow por los llamados recursivos

## Ejemplo
Calcular el máximo de un arreglo

### Dividir

![](attachments/Pasted%20image%2020250721172650.png)

## Conquistar y combinar

![](attachments/Pasted%20image%2020250721172808.png)