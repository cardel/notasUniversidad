object Mezcla {

  def msort(xs: List[Int]): List[Int] = {
    def merge(l1: List[Int], l2: List[Int]): List[Int] =
      (l1, l2) match {
        case (Nil, _) => l2
        case (_, Nil) => l1
        case (m :: ms, n :: ns) =>
          if (m < n) m :: merge(ms, l2)
          else       n :: merge(l1, ns)
      }
    val n = xs.length / 2
    if (n == 0) xs
    else {
      val (izq, der) = xs.splitAt(n)
      merge(msort(izq), msort(der))
    }
  }

  def sumarVec(u: List[Int], v: List[Int]): List[Int] =
    (u, v) match {
      case (Nil, Nil)         => Nil
      case (Nil, _)           => throw new Exception("Distinto tamanio")
      case (_, Nil)           => throw new Exception("Distinto tamanio")
      case (x :: xs, y :: ys) => (x + y) :: sumarVec(xs, ys)
    }

  def main(arr: Array[String]): Unit = {
    println(msort(List(3, 9, 5, 1, 2)))
    println(msort(List(5, 4, 6, 1, 2, 3)))
    println(sumarVec(List(1, 2, 3), List(4, 5, 6)))
  }

}
