# Sesión 26 y 28 de Junio Autoencoders variacionales / Generative adversarial network

## Recursos

[https://colab.research.google.com/drive/1-slBzkG17yaezNlwKGCOtXG5EULB1gAq?usp=sharing](https://colab.research.google.com/drive/1-slBzkG17yaezNlwKGCOtXG5EULB1gAq?usp=sharing)  Autoencoder variacional

[https://colab.research.google.com/drive/1M5Af6QwGZ135b0AIRiaX-RMD-C2-vHGv?usp=sharing](https://colab.research.google.com/drive/1M5Af6QwGZ135b0AIRiaX-RMD-C2-vHGv?usp=sharing) Generative adversarial network 

[Semana_14_annotated.pdf](Sesio%CC%81n%2026%20y%2028%20de%20Junio%20Autoencoders%20variacionale%207ed6cdd85a2f449fad96962e97f1769e/Semana_14_annotated.pdf)

## Apuntes de clase Autoencoders variacionales

¿Que problemas puede tener la capa de código?

- Existan valores muy negativos o muy positivos que introduzcan ruido en la reconstrucción (decoder)
- Que los datos no sea independentes, es decir unos dependan de otros

Este tipo de problemas reduce la calidad de la capa de código. La idea es que cada posición en la capa de codigo represente una caracteristica (abstractas) de las imagenes

---

¿Que estrategia aplicamos?

Hacemos que la capa de codigo (valores) cumplan que sigue una distribución normal con media 0 y desviación 1, el 66.9% de los datos van a quedar en el rango [-1,1]

---

¿Que ganamos?

1. Los elementos de la capa de codigo son similares entre si (no hay valores muy elevados positivamente o negativamente)
2. Son estadisticamente independientes, es decir no hay dependencias entre ellos.

---

¿Que se obtiene?

1. La capa de codigo es estadisticamente buena (los valores representan caracteristicas de la imagen)
2. La reconstrucción es mucho cercanana a la imagen original (datos)

---

## Apuntes de clase Generative adversarial network

¿Cual es la idea?

Tener un generador de datos a partir de una base real (generar imagenes modificadas o datos modificados) tomando en cuenta que se parezcan a los reales

Por ejemplo, para el caso de la imagen X, tenemos caracteristicas que por ejemplo las esquinas y el centro valen 1, mi imagene generada deberia seguir este patron

Sin embargo, esto no garantiza que se parezcan por lo tanto, se aplica una función de error que comparar ambas imagenes y le saca el logaritmo (comparar pixel por pixel)

---

¿Que tenemos?

1. Generador: Se encarga de generar las imagenes de forma aleatoria, sin embargo, progresivamente se va entrenando
2. Discriminador: Va a evaluar las imagenes generadas en el proceso de entrenamiento, para que el generador ajuste los pesos

---

Generador

Es un red MLP, la cual recibe una entrada(s) y a partir de ellas genera las imagenes. Este lo vamos a entrenar de forma estandar con MLP (Backpropagation), como funcion de perdida vamos a utilizar el binary_crossentripy

---

Discriminador

Debe validar que la imagen generada se perezca a la imagen original, por patrones (que tanto se parecen) y por comparacion (logartimo), la idea es que ambas funciones de error sea minimas, este se entrena de forma PERSONALIZADA.

---

Entrenamiento

### Entrenar un gan

### #Paso 1

1.  Generar el codigo a partir de una distribución normal
2. Generar las imagenes con el generador
3. Tomar la muestra real
4. Entrenar el discriminador tomando en cuenta la entrada como
la imagen real y la salida como la imagen falsa 

### #Paso 2

1. Generamos otro esquema de código
2. Entrenamos generador + discriminador

---

¿QUe pasa con la función de loss? Perdida

Dos componentes

1. Como se parece la imagen en patrones (comparación codigins)
2. Como se parece la imagen pixel por pixel (logaritmo) porque no queremos que tenga un peso determinante, pero si debe ayudar en el entrenamiento