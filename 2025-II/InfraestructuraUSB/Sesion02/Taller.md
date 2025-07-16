# Guía de Clase: Servicios IaaS, PaaS y SaaS en AWS y Azure

## 1. Introducción a los Modelos de Servicio en la Nube

### Definiciones
| Modelo | Definición | Ejemplos |
|--------|------------|----------|
| **IaaS** | Infraestructura como servicio: acceso a recursos virtualizados como redes, servidores y almacenamiento. | AWS EC2, Azure VMs |
| **PaaS** | Plataforma como servicio: proporciona entornos de desarrollo y despliegue sin gestionar infraestructura. | AWS Elastic Beanstalk, Azure App Service |
| **SaaS** | Software como servicio: software completo accesible vía web sin gestión técnica del cliente. | Office 365, AWS WorkDocs |

---

## 2. Servicios Representativos por Proveedor

### AWS

| Modelo | Servicio | Descripción |
|--------|----------|-------------|
| IaaS | Amazon EC2 | Servidor virtual en la nube |
| IaaS | Amazon VPC | Redes privadas virtuales |
| PaaS | AWS Elastic Beanstalk | Despliegue automático de apps |
| PaaS | Amazon RDS | Base de datos relacional administrada |
| SaaS | Amazon WorkDocs | Almacenamiento y colaboración de documentos |
| SaaS | Amazon Chime | Videoconferencias y chat |

### Azure

| Modelo | Servicio | Descripción |
|--------|----------|-------------|
| IaaS | Azure Virtual Machines | Servidores virtuales |
| IaaS | Azure Virtual Network | Redes privadas |
| PaaS | Azure App Service | Hospedaje de apps web |
| PaaS | Azure SQL Database | Base de datos relacional como servicio |
| SaaS | Microsoft 365 | Suite de productividad |
| SaaS | Dynamics 365 | CRM y ERP como servicio |

---

## 3. Laboratorio en AWS

### 3.1 IaaS: Lanzar una instancia EC2

1. Abre el Sandbox Enviroment en el curso de AWS
2. Ir a **EC2 > Instancias**
3. Clic en "Lanzar instancia"
4. Escoger una AMI (Ubuntu, Amazon Linux, etc.)
5. Escoger tipo de instancia (t2.micro)
6. Configurar red y almacenamiento
7. Lanzar y conectar por SSH
8. Seguir esta guia https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Tutorials.WebServerDB.CreateWebServer.html 
9. Tener en cuenta: Configurar el grupo de seguridad para permitir HTTP (80)
10. En el directorio /var/www crear el archivo index.html
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frutas Frescas - Precios</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        
        header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin-bottom: 30px;
        }
        
        h1 {
            margin: 0;
            font-size: 2.2em;
        }
        
        .subtitle {
            font-style: italic;
            margin-top: 5px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            background-color: white;
            border-radius: 0 0 8px 8px;
            overflow: hidden;
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
        }
        
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        
        tr:hover {
            background-color: #e8f5e9;
        }
        
        .price {
            font-weight: bold;
            color: #2e7d32;
        }
        
        footer {
            text-align: center;
            margin-top: 30px;
            padding: 15px;
            background-color: #e8f5e9;
            border-radius: 8px;
            font-size: 0.9em;
        }
        
        .fruit-icon {
            width: 40px;
            height: 40px;
            vertical-align: middle;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <header>
        <h1>🍏 Frutería Fresca 🍓</h1>
        <div class="subtitle">Los mejores precios en frutas de temporada</div>
    </header>
    
    <table>
        <thead>
            <tr>
                <th>Fruta</th>
                <th>Descripción</th>
                <th>Precio por kg</th>
                <th>Disponibilidad</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/415/415733.png" class="fruit-icon" alt="Manzana"> Manzana</td>
                <td>Manzanas rojas crujientes, variedad Fuji</td>
                <td class="price">$2.50</td>
                <td>✅ En stock</td>
            </tr>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/2909/2909653.png" class="fruit-icon" alt="Plátano"> Plátano</td>
                <td>Plátanos de Canarias, maduración perfecta</td>
                <td class="price">$1.80</td>
                <td>✅ En stock</td>
            </tr>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/4069/4069252.png" class="fruit-icon" alt="Naranja"> Naranja</td>
                <td>Naranjas valencianas jugosas</td>
                <td class="price">$1.60</td>
                <td>✅ En stock</td>
            </tr>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/4069/4069251.png" class="fruit-icon" alt="Fresa"> Fresa</td>
                <td>Fresas de Huelva, dulces y aromáticas</td>
                <td class="price">$3.20</td>
                <td>✅ En stock</td>
            </tr>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/2933/2933229.png" class="fruit-icon" alt="Mango"> Mango</td>
                <td>Mangos de Málaga, cremosos y dulces</td>
                <td class="price">$4.50</td>
                <td>⏳ Próximamente</td>
            </tr>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/888/888882.png" class="fruit-icon" alt="Piña"> Piña</td>
                <td>Piñas tropicales, jugosas y dulces</td>
                <td class="price">$3.80</td>
                <td>✅ En stock</td>
            </tr>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/4069/4069275.png" class="fruit-icon" alt="Uva"> Uva</td>
                <td>Uvas blancas sin semillas</td>
                <td class="price">$2.90</td>
                <td>✅ En stock</td>
            </tr>
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/2909/2909768.png" class="fruit-icon" alt="Sandía"> Sandía</td>
                <td>Sandías sin semillas, refrescantes</td>
                <td class="price">$0.99</td>
                <td>✅ En stock</td>
            </tr>
        </tbody>
    </table>
    
    <footer>
        <p>📍 Dirección: Calle Frutal, 123 - Ciudad Jardín</p>
        <p>📞 Teléfono: 555-123-456 | 🕒 Horario: L-V 8:00-20:00</p>
        <p>© 2023 Frutería Fresca - Todos los derechos reservados</p>
    </footer>
</body>
</html>
```

### 3.2 PaaS: Crear aplicación con Elastic Beanstalk

1. Ir a **Elastic Beanstalk**
2. Clic en "Crear nueva aplicación"
3. Elegir plataforma (Node.js, Python, etc.)
4. Cargar el código fuente o usar ejemplo
5. Lanzar ambiente
6. Accede a la URL pública generada
7. Revisar guias https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/tutorials.html Desplegar algun proyecto pequeño que hayan realizado (Web)
8. Amplify: Serverless, no va a lanzar una instancia si no que va  usar la infraestructura de amazon

### 3.3 SaaS
1. Workmail  Servicio de correo (organizaciones)
2. Workspaces Escritorios remotos
3. Chime (Mensajeria)
4. QuickSight (Powerbi)
5. Amazon Connect (VPN a los servicios de amazon) permite conectar la red de la organización (on primeses) a las vpc



---

## 4. Laboratorio en Azure

Registrar en https://azure.microsoft.com/en-us/free/students

### 4.1 IaaS: Crear una VM

1. Inicia sesión en [Azure Portal](https://portal.azure.com/)
2. Ir a **Máquinas virtuales**
3. Clic en "Crear > Máquina virtual"
4. Elegir imagen, tamaño, nombre, credenciales
5. Configurar red y discos
6. Crear y conectarse vía RDP o SSH

### 4.2 PaaS: Publicar una Web App en Azure App Service

Revisar https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore?tabs=net80&pivots=development-environment-vs

1. Ir a Function App y luego **App Services**
2. Crear nuevo recurso
3. Seleccionar plan de hospedaje (consumo gratuito o estándar)
4. Subir app o conectar con GitHub
5. Accede vía la URL generada

### 4.3 SaaS: Usar Microsoft 365

1. Accede a [https://www.office.com](https://www.office.com)
2. Iniciar sesión con cuenta educativa o empresarial
3. Usar Word, Excel, PowerPoint, Teams directamente en la nube

---

