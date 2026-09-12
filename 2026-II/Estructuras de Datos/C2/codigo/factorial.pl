% Paradigma logico: se declaran los hechos y las reglas que definen la relacion
factorial(0, 1).
factorial(N, F) :-
    N > 0,
    M is N - 1,
    factorial(M, G),
    F is N * G.

% Consulta:  ?- factorial(5, F).
%            F = 120.
