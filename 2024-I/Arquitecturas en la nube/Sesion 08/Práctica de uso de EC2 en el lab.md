# Práctica de uso de EC2 en el lab

1. En el curso buscar la opción Sandbox
2. Dar en la opción iniciar laboratorio (Iniciar lab) esto tarda unos 5 minutos: Esto nos crea un entorno de pruebas, tener en cuenta como estudiantes tenemos un budget de 100 USD y el laboratorio dura unas 2 o 3 horas, después de ello TODO es borrado.
3. Haciendo clic en la opción detalles y luego en Detalles se obtienen las llaves y datos conexión

![[2024-I/Arquitecturas en la nube/Sesion 08/Practica EC2 Lab/Untitled.png]]

1. Alli tienen los parámetros de conexión  

![[2024-I/Arquitecturas en la nube/Sesion 08/Practica EC2 Lab/Untitled 1.png]]
1. Se conecta por ssh con la llave, ejemplo 

```bash
ssh -i "vockey.pem" ec2-user@ec2-18-212-62-42.compute-1.amazonaws.com
#la llave solo puede tener permisos 400
# chmod 400 vockey.pem
```

1. Fuimos al servicio de EC2, vimos la instancia
    1. Ya tiene una IP publica
    2. La llave esta disponible desde los detalles, la cual podemos usar para conectarnos
    3. Se ejecutó 
    
    ```bash
    sudo yum install httpd
    sudo systemctl enable httpd --now
    cd /var/www/html
    sudo nano index.html
    #ctrl + x para guardar
    ```
    
    d. En el grupo de seguridad habilitar el puerto 80 para la IP 0.0.0.0
    
    e. Visitar la IP publica con http (puerto 80)
    
2. Ejemplo de base de datos
    1. Se instalo maria db 
    
    ```bash
    sudo dnf install mariadb105-server-3:10.5.16-1.amzn2023.0.7.x86_64
    sudo systemctl enable mariadb --now
    
    ```
    
    b. Configuracion
    
    ```bash
    sudo mysql_secure_installation
    ':
    Switch to unix_socket authentication [Y/n] y
    
    You already have your root account protected, so you can safely answer 'n'.
    
    Change the root password? [Y/n] y
    
    Remove anonymous users? [Y/n] y
    
    Disallow root login remotely? [Y/n] n
    Remove test database and access to it? [Y/n] n
    
    Reload privilege tables now? [Y/n] y
    :'
    ```
    
    c. Apertura de la base de datos a acceso remoto 
    
    ```bash
    sudo nano /etc/my.cnf.d/mariadb-server.cnf 
    ':
    Descomentar linea
    #
    bind-address=0.0.0.0
    #
    Para guardar ctrl + x
    ':
    sudo systemctl restart mariadb.service
    ```
    
    d. Entrar a la base de datos 
    
    ```bash
    mysql -h localhost -u root -p
    ```
    
    e. Ejecutar lo siguiente, cambiando nombres y password a su elección:
    
    ```sql
    create database ejemplo;
    use ejemplo;
    create table usuarios(id INT, nombre char(200), apellido char(200));
    select * from usuarios;
    insert into usuarios values (1,'carlos', 'ramirez');
    select * from usuarios;
    create user 'cardel'@'%' identified by 'cardel';
    grant all privileges on ejemplo.* to cardel@'%' identified by 'cardel';
    flush privileges;
    ```
    
    f. Conectarse
    
    IP: <amazon>
    
    Puerto: 3306
    
    Usuario: <creado>
    
    Contraseña: <creado>
    
    Base de datos: ejemplo