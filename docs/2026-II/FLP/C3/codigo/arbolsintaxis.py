import ast


programa = """
x = 10
y = 20
print(x+y)
"""

e = ast.parse(programa)
print(ast.dump(e, indent=4))
