# Sesión 08: Automatas celulares

¿Que es una automata celular?

Es una tupla de elementos mapeados en un espacio n dimensional, 1D, 2D, 3D …., cada uno de estados depende de la regla de transición de datos, un ejemplo es el ejemplo de la vida

El Juego de la Vida opera en una cuadrícula de células cuadradas que se extiende hasta el infinito en todas las direcciones. Cada célula tiene dos estados: viva o muerta.

Aquí hay un ejemplo sencillo de cómo podría funcionar en una cuadrícula de 3x3:

1. Estado inicial (X representa una célula viva, O una célula muerta):
    
    O X O
    
    O X O
    
    O X O
    
2. Después de un paso de tiempo, las células cambian de estado según las siguientes reglas:
    - Una célula viva con menos de dos vecinos vivos muere (por soledad).
    - Una célula viva con más de tres vecinos vivos muere (por superpoblación).
    - Una célula viva con dos o tres vecinos vivos sobrevive.
    - Una célula muerta con exactamente tres vecinos vivos se convierte en una célula viva (por reproducción).
    
    Entonces después del primer paso, la cuadrícula se vería así:
    
    O O O
    
    X X X
    
    O O O
    

Este es un ejemplo sencillo y visual de cómo funciona el Juego de la Vida como un autómata celular.

---

Aplicaciones de los automatas celulares

1. Podemos realizar simulaciones de sistemas usando reglas
2. Podemos realizar computación, ejemplo de la bandera francesa