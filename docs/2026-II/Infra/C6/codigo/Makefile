CXX = g++
CXXFLAGS = -g -Wall -Wextra

todo: programa bueno malo lento rapido paralelo programa_secciones

programa: programa.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

bueno: Bueno.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

malo: Malo.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

programa_secciones: programa_secciones.cpp
	$(CXX) $(CXXFLAGS) -o $@ $<

lento: lento.cpp
	$(CXX) $(CXXFLAGS) -O2 -o $@ $<

rapido: rapido.cpp
	$(CXX) $(CXXFLAGS) -O2 -o $@ $<

paralelo: paralelo.cpp
	$(CXX) $(CXXFLAGS) -O2 -fopenmp -o $@ $<

limpiar:
	rm -f programa bueno malo lento rapido paralelo programa_secciones salida.txt
