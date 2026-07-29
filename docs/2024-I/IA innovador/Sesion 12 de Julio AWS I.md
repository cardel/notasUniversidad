# Sesion 12 de Julio AWS I

# Semana 2 de AWS

Tareas de PLN: Reducir al minimo el numero de palabras DIFERENTES

1. Eliminar stepwords: Palabras de uso común
2. Normalización
    1. Eliminar puntuaciones . ! ?
    2. Convertir numeros a texto: 10 → diez, 20 → veinte
    3. Convertir el texto minusculas (porque el sistema diferencia las mayusculas de las minusculas)
3. Stemming: Sacar la raiz de las palabras eliminado gerundios (ando, endo), plurales
4. Lemmatizacion: Convertir las palabras en un sinonimos de uso general:  mejor → bueno, peor → malo
5. Vectorización: Word2Vec, TiDF, CountVectorizer, Hashvectorizer …

La actividad consiste en:

1. Procesar los datos (minusculas, eliminar stepwords, eliminar puntuaciones, stemming)
2. Vectorizacion de datos, se crearon 202 variables numericas, 2 numericas: tiempo, log votacion, 200 variables del texto Para esto se uso un PIPELINE (Es una serie de pasos que se realiza en un proceso)
3. Se creo un modelo lineal de Sagemaker
4. Finalmente, se le aplico deply (estoy teoricamente debe crear un endpoint API) Esto utiliza AWS Lambda (Funciones que se ejecuta en un entorno ya preconfigurado))