# Sesión 8: Metricas y procesamiento de salidas

PCA Analisis de componentes principales

Se trata de una estraregia para reducir el número de entradas (o aumentar) la idea es que la correlación de las nuevas columnas sea cercana a CERO, esto indica INDEPENDENCIA

---

Tratamiento de las salidas

Se busca aplicar one-hot encoding, generar una una salida para cada clase, en el caso de problemas de clasificación binaria, se puede tener una sola salida

MLPClassifier lo hace internamente

---

ROC

Nos permite analizar clasificadores binarios, compararlos entre ellos y el caso aleatorio, es un punto (PTR, FTP) (buenos, vs malos), se busca cercano a (1,0) y alejado (0.5,0.5) que es el caso aleatorio