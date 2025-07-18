# Sesión 04: Ejemplo PaaS

## Aws EC2

Se crea una instancia con acceso a Internet

Tener en cuenta los IDS de los diferentes servicios son diferentes si ustedes lo prueba, tambien la IP elastica

**Warning:** Estos pasos puede generar costos en su tarjeta de crédito (por ello borrar al terminar)

```bash
#Crear una llave
aws ec2 create-key-pair --key-name miclave --query 'KeyMaterial' --output text > miclave.pem

#Verificar la llave
aws ec2 describe-key-pairs --key-name miclave

#Crear una asignación de IPs dentro de EC2
aws ec2 create-vpc --cidr-block 10.0.0.0/24 --query Vpc.VpcId --output text

#Crear una subred dentro de EC2
aws ec2 create-subnet --vpc-id vpc-0871404eb422aa65a --cidr-block 10.0.0.0/24 --availability-zone us-east-1a

#Crear el grupo de seguridad
aws ec2 create-security-group --group-name my-sg --description "My security group" --vpc-id vpc-0871404eb422aa65a

#Observa el grupo de seguridad
aws ec2 describe-security-groups --group-ids sg-044b93314a381ee40

#Autorizo el puerto 22 a cualquiera (MALA PRACTICA, solo a IPs especificas)
aws ec2 authorize-security-group-ingress --group-id sg-044b93314a381ee40 --protocol tcp --port 22 --cidr 0.0.0.0/0

#Buscar imagenes basadas en Debina
aws ec2 describe-images --filters "Name=name,Values=debian*" --query 'Images[*].[ImageId,Name,Description]' --output table | more

#Crear la instancia
aws ec2 run-instances --image-id ami-00062ffa9431e3217 --count 1 --instance-type t2.micro --key-name miclave --security-group-ids sg-044b93314a381ee40 --subnet-id subnet-0ec32fb7ee6e1c7e8

#Crear la IP elastica (IP publica)
aws ec2 allocate-address --domain vpc

#Colocar la IP publica a la instancia
ec2 associate-address --instance-id i-0a91384e959d040c0 --allocation-id eipalloc-12345678

#Dar acceso internet a la VPC
aws ec2 attach-internet-gateway --internet-gateway-id igw-0dfb11919a95503c8 --vpc-id vpc-0871404eb422aa65a

#Observar tablas de ruteo
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-0871404eb422aa65a" --query 'RouteTables[*].{ID:RouteTableId}' --output table

#Acceso al puerto 80
aws ec2 create-route --route-table-id rtb-0bdec64caaec69c34 --destination-cidr-block 0.0.0.0/0 --gateway-id igw-0dfb11919a95503c8

#Acceder a la instancia
ssh -i miclave.pem admin@52.3.57.178

```