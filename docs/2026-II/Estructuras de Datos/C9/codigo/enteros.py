import sys

if __name__ == "__main__":
    print(2 ** 100)
    print(sys.getsizeof(0), sys.getsizeof(1000), sys.getsizeof(2 ** 100))
    print(0.1 + 0.2)
    print(sys.getsizeof(1.5))
    lista = [1, 2, 3, 4, 5]
    print(sys.getsizeof(lista))
