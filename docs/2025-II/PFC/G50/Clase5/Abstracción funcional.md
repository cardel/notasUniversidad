# ¿Que es ?

Es una técnica para  representa TAD (tipos abstractos de datos) en  un lenguaje de programación, por ejemplo, Python no tiene números, si no objetos que se comportan como numeros

## Ventajas

1. No tienen las limitaciones de tamaño que tienen los tipos nativos o primitivos (CPU)
2. No vemos fenomenos como el desborde o underflow

## Desventaja
1. Las operaciones son más costosas
2. La implementación es más complicada (porque se requiere hacer las operaciones como la suma)
3. Es mas costoso en memoria

[]()# Ejemplo
Un numero racional tiene la forma
$$
\frac{p}{q}, p \in \mathbb{ Z }, q \in \mathbb{N}, q \neq 0
$$
La forma de representar esto, es con números flotantes con decimales, sin embargo, los números tipo float o double tienen limitaciones dada la representación, estos tipos de datos aumentan su error de truncamiento a medida 



que crecen.

![](attachments/Pasted%20image%2020250916082458.png)![](attachments/Pasted%20image%2020250916082527.png)

# Representación usando objetos

Para el caso de los racionales, usar float o double tiene la limitación de que no son siempre precisos (error de truncamiento), podemos usar una representación para siempre tener operaciones entre enteros

## Explicación del código

### 1. Análisis del código

**Clase Racional:**
```scala
class Racional(p:Int, q:Int) {
  // Validación: asegura que el denominador sea positivo
  require(q > 0, "El denominador no puede ser negativo o cero")
  
  // Simplificación automática al crear el racional
  val num = p/mcd(p, q)  // Numerador simplificado
  val dem = q/mcd(p, q)  // Denominador simplificado
  
  // Método privado para calcular máximo común divisor (recursivo)
  private def mcd(a:Int, b:Int):Int = {
    if (b == 0) a else mcd(b, a % b)
  }

  // Suma de racionales: a/b + c/d = (a*d + b*c)/(b*d)
  def +(r:Racional):Racional = {
    new Racional(
      this.num*r.dem + this.dem*r.num,
      this.dem * r.dem
    )
  }

  // Multiplicación de racionales: a/b * c/d = (a*c)/(b*d)
  def *(r:Racional):Racional = {
    new Racional(
      this.num * r.num,
      this.dem * r.dem
    )
  }

  // Representación en string: "numerador/denominador"
  override
  def toString():String = {
    this.num + "/" + this.dem
  }
}
```

**Objeto Main:**
```scala
object Main {
    def main(args: Array[String]): Unit = {
      // Creación de racionales
      val r1 = new Racional(5,6)  // 5/6
      val r2 = new Racional(8,7)  // 8/7
      
      // Suma usando notación de punto
      val r3 = r1.+(r2)
      println(r3)  // (5*7 + 6*8)/(6*7) = (35+48)/42 = 83/42
      
      // Más operaciones
      val r4 = new Racional(4,6)  // Se simplifica a 2/3
      println(r4.+(r1))  // 2/3 + 5/6 = (4+5)/6 = 9/6 = 3/2
      println(r4 + r1)    // Notación infija: mismo resultado
      println(r4 * r1)    // 2/3 * 5/6 = 10/18 = 5/9
      
      val r5 = new Racional(4,3)  // 4/3
      println(r5)
    }
}
```

### 2. Abstracción funcional

**Validación con `require`:**
- Garantiza la integridad del objeto desde su creación
- Previene estados inválidos (denominador $\le 0$)
- Mejor que `assert` porque lanza `IllegalArgumentException` evita la instanciación

**Notación infija:**
- Scala permite `r4 + r1` en lugar de `r4.+(r1)`
- Mejora la legibilidad al emular notación matemática natural
- El compilador transforma `a + b` en `a.+(b)`

**Sobreescritura de `toString`:**
- Proporciona representación legible del objeto
- Esencial para debugging y logging
- Se hereda de `AnyRef` y debe ser override explícito

### 3. Ventajas sobre `double`/`float`

**Precisión exacta:**
- Evita errores de redondeo en operaciones aritméticas
- Ejemplo: $1/3 + 1/3 + 1/3 = 1$ (exacto), no 0.9999999999999999

**Representación exacta de fracciones:**
- Números como $1/7$ son periódicos en binario
- Con Racional: representación exacta como fracción

**Simplificación automática:**
- $4/6$ se convierte automáticamente en $2/3$
- Operaciones mantienen la forma canónica

**Sin pérdida de precisión en operaciones sucesivas:**
- En punto flotante: $(0.1 + 0.2) + 0.3 ≠ 0.1 + (0.2 + 0.3)$
- Con Racional: asociatividad y conmutividad preservadas exactamente

**Ideal para:**
- Sistemas algebraicos
- Cálculos financieros (evita errores de centavos)
- Aritmética simbólica
- Aplicaciones que requieren precisión exacta

56