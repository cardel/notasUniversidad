Los contenedores se especifican en el archivo Dockerfile

Repositorio de Docker https://hub.docker.com

# Ejemplo servidor Web

## Especifica el Dockerfile

```Dockerfile
FROM nginx:1.29.3

WORKDIR /usr/share/nginx/html

COPY html/index.html .

VOLUME [ "/usr/share/nginx/html" ]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Estructura

```bash
├── Dockerfile
└── html
    ├── index.html
    └── styles.css
```

Index.html

```html
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Página Web</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<!-- quiero una pagina con los 10 primeros pokemones con sus stats-->

<h1>Los 10 Primeros Pokémons y sus Stats</h1>

<table border="1">
    <tr>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>HP</th>
        <th>Ataque</th>
        <th>Defensa</th>
        <th>Velocidad</th>
    </tr>
    <tr>
        <td>Bulbasaur</td>
        <td>Planta/Veneno</td>
        <td>45</td>
        <td>49</td>
        <td>49</td>
        <td>45</td>
    </tr>
    <tr>
        <td>Ivysaur</td>
        <td>Planta/Veneno</td>
        <td>60</td>
        <td>62</td>
        <td>63</td>
        <td>60</td>
    </tr>
    <tr>
        <td>Venusaur</td>
        <td>Planta/Veneno</td>
        <td>80</td>
        <td>82</td>
        <td>83</td>
        <td>80</td>
    </tr>
    <tr>
        <td>Charmander</td>
        <td>Fuego</td>
        <td>39</td>
        <td>52</td>
        <td>43</td>
        <td>65</td>
    </tr>
    <tr>
        <td>Charmeleon</td>
        <td>Fuego</td>
        <td>58</td>
        <td>64</td>
        <td>58</td>
        <td>80</td>
    </tr>
    <tr>
        <td>Charizard</td>
        <td>Fuego/Volador</td>
        <td>78</td>
        <td>84</td>
        <td>78</td>
        <td>100</td>
    </tr>
    <tr>
        <td>Squirtle</td>
        <td>Agua</td>
        <td>44</td>
        <td>48</td>
        <td>65</td>
        <td>43</td>
    </tr>
    <tr>
        <td>Wartortle</td>
        <td>Agua</td>
        <td>59</td>
        <td>63</td>
        <td>80</td>
        <td>58</td>
    </tr>
  </table>


</body>
```
styles.css

```css
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}


tr:nth-child(even) {
    background-color: #ccddff;
}

tr:nth-child(odd) {
    background-color: #11ffdd;
}

```

## 2. Logear

Deben estar autenticador en el docker hub

```bash
docker login
# docker logout
```



## 3. Crear imagen

```bash
docker build -t pokemonweb .
```

# 4. Lanzar el contenedor

```bash
docker run -d -p 8080:80 --name pokemon_container -v html:/usr/share/nginx/html pokemonweb:latest
```

Esto permite crear el contenedor y el volumen asociado en la carpeta html dentro de la carpeta

# Publicar

```bash
docker tag <imagen> <usuario>/<imagen>
docker push <usuario>/<imagen>
```

Con esto va quedar publicado la imagen en el repositorio de docker hub