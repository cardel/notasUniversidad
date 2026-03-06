
Es un método para demostrar teoremas o formulas, tiene dos pasos

1. Paso base P(1) el primer elemento o valor (no necesariamente con n = 1)
2. Paso inductivo partiendo de P(k) hacer valido P(k+1)


# Ejemplo $2^n > n$

Paso base n = 1 (Dado que son los $\mathbb{N}$)

$$2^1 > 1$$ Si, esto es correcto

Paso inductivo P(k) y demostramos P(k+1)


Partiendo de $2^k > k$ debemos llegar $2^{k+1} > k+1$

Tomamos $P(k)$ y sumamos 1 a ambos lados, con el objetivo de que tengamos a k+1 en uno de los lados

Para demostrar esto voy a plantear $c > b > a$

1. $2^k > k$ esto es $P(k)$ el problema que no pudo llegar a P(k+1) usando operaciones matematicas..
2. Mi objetivo es $2^{k+1} > k+1$  aqui obtuve $a = k+1$ y $c=2^{k+1}$ 
3. Primer paso: sumamos 1 a ambos lados $2^k + 1 > k+1$, mi $b=2^k + 1$ 
4. Entonces voy a postular lo siguiente $2^k + 1 < 2^{k+1}$ haciendo algebra obtengo $2^k + 1 < 2*2^{k}  = 2^k + 1 < 2^{k} + 2^k$ resto $2^k$ en ambos lados $1 < 2^k$ tomando en cuenta que $k \geq 1$ esto es caso base, por lo tanto acabo de demostrar $2^k + 1 < 2^{k+1}$
5. Por lo tanto, he demostrado lo siguiente $k+1 < 2^k + 1 < 2^{k+1}$ por transitividad demostré $k+1 < 2^{k+1}$ 

Estrategia dos

1. Voy a multiplicar 2 en ambos lados $2^{k+1} > 2k$ 
2. Ahora debo demostrar $2k > k+1$ entonces $k + k > k + 1$ si restamos $k$ ambos lados $k > 1$ 

La estrategia consiste en encontrar un valor intermedio el cual pueda conectar a ambos.

