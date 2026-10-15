# Ejercicios · ST C3

Semana del 16 y 17 de octubre, sesiones 3 y 4: estacionariedad,
diferenciación, ACF y PACF. Cada enlace abre una actividad que se trabaja
en el navegador, sin instalar nada.

Cada actividad empieza con la serie de análisis: su gráfica, un resumen
con los atípicos, el promedio de cada mes, la tabla completa de datos y
unas claves de análisis que sirven para el ejercicio de esa página. Después
viene una pregunta para responder antes de tocar nada,
sigue con un control que se mueve y cierra con la explicación, que aparece
cuando las preguntas quedan resueltas. Cada respuesta muestra su razón, se
acierte o no. Las gráficas y los números salen del cálculo en la página
sobre la serie del curso, con los cuatro meses sin dato de 2019 rellenos por
interpolación lineal, como en los notebooks. Los valores p de la prueba ADF
son la excepción: vienen de statsmodels y se calcularon en la sesión 3.

## La correlación con el pasado

### [El mes contra el de k meses atrás](../../../actividades/series-temporales/autocorrelacion/rezago.html){ target=_blank rel=noopener }

Cada mes frente al de k meses antes, con un deslizador para k entre 1 y 24
y la correlación de la nube encima. En la serie original todo se parece a
todo durante los primeros meses de rezago; en la diferenciada, la
correlación de k = 1 cae casi a cero y el pico que queda está en k = 12. Los
meses de 2020 y 2021 van en otro color, para ver cuánto pesa la pandemia en
la nube.

### [¿De cuál serie es este correlograma?](../../../actividades/series-temporales/autocorrelacion/correlogramas.html){ target=_blank rel=noopener }

Tres ACF en desorden, la de la serie original, la de `diff()` y la de
`diff(12)`, y la tarea de emparejarlas antes de diferenciar a mano. Basta
mirar dos barras, la de k = 1 y la de k = 12, y cada respuesta dice qué
valor tenían. Al final, cuál de los tres queda más cerca de un ruido blanco
y por qué ninguno llega.

## Diferenciar

### [Diferenciar y mirar la ACF](../../../actividades/series-temporales/autocorrelacion/diferencias.html){ target=_blank rel=noopener }

Una casilla para la diferencia regular y otra para la estacional, y con cada
combinación la serie, su ACF hasta k = 36, los datos que quedan y el valor
p de ADF. Se trata de ver qué quita cada diferencia, qué deja a la vista y
cuál es la combinación más pequeña con la que ADF rechaza la raíz unitaria.

### [¿Cuánto mide la banda?](../../../actividades/series-temporales/autocorrelacion/bandas.html){ target=_blank rel=noopener }

La franja de un correlograma mide 1,96/√n. Primero hay que predecir su
ancho con los 110 meses, qué le pasa cuando la diferenciación deja trece datos
fuera y cuántos harían falta para partirla por la mitad. Después, un ruido
blanco con n y semilla en deslizadores, para contar cuántas barras salen
por azar, y la ACF de la serie diferenciada con la banda plana y con la de
Bartlett, que es la que dibuja statsmodels en el notebook.

## Autocorrelación parcial

### [El φ de un AR(1)](../../../actividades/series-temporales/autocorrelacion/ar1.html){ target=_blank rel=noopener }

Un AR(1) simulado con el ruido fijo y un deslizador para φ entre −0,99 y
0,99. La ACF decae despacio o alterna de signo según φ, y la
PACF deja una sola barra fuera de la banda, en k = 1. Es la firma que se
busca en la identificación por correlogramas de la sesión 4.
