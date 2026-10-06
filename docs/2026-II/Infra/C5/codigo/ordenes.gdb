set confirm off
set debuginfod enabled off
break escalado.cpp:14
run
info threads
thread 3
print i
print suma
