public class Enteros {
    public static void main(String[] args) {
        int mayor = Integer.MAX_VALUE;

        System.out.println("Integer.MAX_VALUE     = " + mayor);
        System.out.println("Integer.MAX_VALUE + 1 = " + (mayor + 1));
        System.out.println("Double.MIN_VALUE      = " + Double.MIN_VALUE);
        System.out.println("0.1 + 0.2             = " + (0.1 + 0.2));

        Integer a = Integer.valueOf("127");
        Integer b = Integer.valueOf("127");
        Integer c = Integer.valueOf("128");
        Integer d = Integer.valueOf("128");

        System.out.println("a == b con 127        = " + (a == b));
        System.out.println("c == d con 128        = " + (c == d));
        System.out.println("c.equals(d)           = " + c.equals(d));
    }
}
