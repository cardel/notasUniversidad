# Sesión 24 de Junio: Practica autoencoders

## Recursos

[https://colab.research.google.com/drive/14xvzwYuo03ptfoJ31hMMDPeqAREFpKfO?usp=sharing](https://colab.research.google.com/drive/14xvzwYuo03ptfoJ31hMMDPeqAREFpKfO?usp=sharing) 

## Resumen clase

Aspectos sobre los autoencoders

1. Encoder que transforma la entrada en un codigo (vector de caracteristicas)
2. Decoder toma el codigo y lo transforma en la trada
3. Tenemos diferentes tipos: Dense (MLP), Convolucional, LSTM y optimizaciones

---

Consideraciones sobre el entrenamiento de autoencoders

1. Tener en cuenta que la capa de codigo (vector de caracteristicas) debe ser lo suficientemente grande, 28x28 → 30, si la imagen es mas grande, deberia ser mas grande el vector de caracteristicas
2. Se pueden utilizar tecnicas de para mejorar la capa de codigo, Regularizacion para evitar que los pesos se disparen o bien utilizar tecnicas estadisticas con los pesos, por ejemplo ajustarlos a una distribucion normal para evitar outliers (pesos por fuera rango, muy positivos o muy negativos)

![Untitled](Sesio%CC%81n%2024%20de%20Junio%20Practica%20autoencoders%20ee4c94044a7b4b1db7a9abd5637f2126/Untitled.png)

---

¿Que se busca con las tecnicas?

Se busca que la capa de coding (vector de caracteristicas) sea estadisticamente indepediente, esto es, que cada valor describa una caracteristica de los datos de entrada (compresión pero con significado)