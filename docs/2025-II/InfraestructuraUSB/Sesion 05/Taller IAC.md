
## Introducción  
Terraform es una herramienta de Infraestructura como Código (IaC) que permite definir, gestionar y versionar infraestructura en múltiples proveedores de nube mediante un enfoque declarativo. Este taller aborda los fundamentos para implementar recursos básicos en AWS y Azure.

# Ejemplo de infraestructura como código

```mermaid
graph TD
  subgraph AWS_VPC["AWS VPC (10.0.0.0/16)"]
    direction LR

    subgraph Public_Subnet["Subred Pública (10.0.1.0/24)"]
      direction LR
      ec2[EC2 Instance: App]
    end

    subgraph Private_Subnet["Subred Privada (10.0.2.0/24)"]
      direction LR
      s3_bucket[S3 Bucket]
      ec2_db[EC2 Instance: Postgres]
    end
  end

  ec2 --> s3_bucket
  ec2 --> ec2_db

```
  
## Parte 1: Implementación en AWS  
### Configuración Inicial  
Instalación de Terraform:  https://developer.hashicorp.com/terraform/install

Instalar AWS CLI https://aws.amazon.com/cli/ 

### Estructura
```bash
aws/
├── main.tf
├── variables.tf
├── outputs.tf
├── ec2_user_data.sh
├── api_user_data.sh
└── postgres_user_data.sh
```
  
### Creación de Recursos  
Archivo *main.tf*:  


```hcl  
provider "aws" {
  region = "us-east-1"
  ignore_tags {
    key_prefixes = ["aws:"] # opcional, si hay etiquetas restringidas
  }
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "ec2_sg" {
  name        = "ec2_sg"
  description = "Allow SSH, HTTP and PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP (API)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "PostgreSQL access from app"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_instance" "db_server" {
  ami                         = "ami-0cbbe2c6a1bb2ad63" # Amazon Linux 2
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.private.id
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  key_name                    = "vockey"
  associate_public_ip_address = false
  user_data                   = file("postgres_user_data.sh")

  tags = {
    Name = "PostgreSQL Server"
  }
}

resource "aws_instance" "app_server" {
  ami                         = "ami-0cbbe2c6a1bb2ad63"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true
  key_name                    = "vockey"
  user_data                   = file("api_user_data.sh")

  tags = {
    Name = "API Server"
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "private_data" {
  bucket = var.s3_bucket_name

  force_destroy = true
  lifecycle {
    ignore_changes = [object_lock_configuration]
  }
}

```
### Variables
Archivo *variables.tf*:  
```hcl
variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR de la VPC principal"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR de la subred pública"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR de la subred privada"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_b_cidr" {
  description = "CIDR de la segunda subred privada"
  type        = string
  default     = "10.0.3.0/24"
}

variable "ec2_instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t2.micro"
}

variable "ec2_ami_id" {
  description = "AMI ID para las instancias EC2 (Amazon Linux 2)"
  type        = string
  default     = "ami-0cbbe2c6a1bb2ad63"
}

variable "key_name" {
  description = "Nombre de la clave SSH existente para acceder a las instancias EC2"
  type        = string
  default     = "vockey"
}

variable "s3_bucket_name" {
  description = "Nombre del bucket S3 privado"
  type        = string
  default     = "mi-bucket-privado-terraform"
}


```
### Archivos de debugging
Archivo *outputs.tf*:  
```hcl
variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR de la VPC principal"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR de la subred pública"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR de la subred privada"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_b_cidr" {
  description = "CIDR de la segunda subred privada"
  type        = string
  default     = "10.0.3.0/24"
}

variable "ec2_instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t2.micro"
}

variable "ec2_ami_id" {
  description = "AMI ID para las instancias EC2 (Amazon Linux 2)"
  type        = string
  default     = "ami-0cbbe2c6a1bb2ad63"
}

variable "key_name" {
  description = "Nombre de la clave SSH existente para acceder a las instancias EC2"
  type        = string
  default     = "vockey"
}

variable "s3_bucket_name" {
  description = "Nombre del bucket S3 privado"
  type        = string
  default     = "mi-bucket-privado-terraform"
}
```
### Archivos de configuración
Archivo *ec2_user_data.sh*:  
```bash
#!/bin/bash
yum update -y
yum install -y python3 zip unzip awscli
pip3 install gremlinpython boto3

# Variables de entorno
export REGION=us-east-1
export S3_BUCKET=mi-bucket-privado-terraform

# Archivo de prueba
echo "Consulta de prueba y resultado guardado" > resultado.txt

# Subir a S3
aws s3 cp resultado.txt s3://$S3_BUCKET/

```
Archivo *postgres_user_data.sh**
```bash

#!/bin/bash
yum update -y
amazon-linux-extras enable postgresql14
yum install -y postgresql-server postgresql

# Inicializar y arrancar PostgreSQL
/usr/bin/postgresql-setup initdb
systemctl enable postgresql
systemctl start postgresql

# Crear base y tablas
sudo -u postgres psql <<EOF
CREATE DATABASE empresa;
\c empresa
CREATE TABLE cliente (id SERIAL PRIMARY KEY, nombre VARCHAR(50));
CREATE TABLE vendedor (id SERIAL PRIMARY KEY, nombre VARCHAR(50));
CREATE TABLE factura (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES cliente(id),
  vendedor_id INT REFERENCES vendedor(id),
  total NUMERIC
);
INSERT INTO cliente (nombre) VALUES ('Carlos'), ('Ana');
INSERT INTO vendedor (nombre) VALUES ('Luis'), ('Laura');
INSERT INTO factura (cliente_id, vendedor_id, total) VALUES (1, 1, 100.00), (2, 2, 200.00);
EOF
```
Archivo * *api_user_data.sh*
```bash

#!/bin/bash
yum update -y
yum install -y python3 git python3-pip
pip3 install flask psycopg2-binary

DB_HOST='${aws_instance.db_server.private_ip}'
# Crear API sencilla
cat <<EOF > /home/ec2-user/api.py
from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)
conn = psycopg2.connect(dbname='empresa', user='postgres', host='$DB_HOST', password='')

@app.route("/clientes")
def clientes():
    cur = conn.cursor()
    cur.execute("SELECT * FROM cliente")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

@app.route("/facturas")
def facturas():
    cur = conn.cursor()
    cur.execute("SELECT * FROM factura")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
EOF

chmod +x /home/ec2-user/api.py
nohup python3 /home/ec2-user/api.py &

```
### Ejecución de Comandos  
```bash  

terraform init  
terraform plan  
terraform apply  # Confirmar con 'yes'  
```  
  
### Limpieza de Recursos  
```bash  
terraform destroy  # Confirmar con 'yes'  
```  
  
## Parte 2: Implementación en Azure  
### Recursos
1. Instalación Azure CLI  https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest 
2. Loguearse con *az login*

### Estructura
```bash
azure/
├── main.tf
├── variables.tf
├── outputs.tf
└── vm_user_data.sh

```

```mermaid
graph TD
  subgraph Azure_VNet["Azure VNet (10.0.0.0/16)"]
    direction LR

    subgraph Public_Subnet["Subred Pública (10.0.1.0/24)"]
      direction TB
      vm["VM Linux (App)"]
    end

    subgraph Private_Subnet["Subred Privada (10.0.2.0/24)"]
      direction LR 
      blob_storage["Blob Storage"]
      cosmos_db["Cosmos DB (Gremlin)"]

    end
  end

  vm --> blob_storage
  vm --> cosmos_db

```
### `main.tf`
```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "rg-gremlin-app"
  location = var.location
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-app"
  address_space       = [var.vnet_cidr]
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "public" {
  name                 = "public-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.public_subnet_cidr]
}

resource "azurerm_subnet" "private" {
  name                 = "private-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.private_subnet_cidr]
}

resource "azurerm_network_interface" "vm_nic" {
  name                = "vm-nic"
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "vm-ipconfig"
    subnet_id                     = azurerm_subnet.public.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.vm_public_ip.id
  }
}

resource "azurerm_public_ip" "vm_public_ip" {
  name                = "vm-public-ip"
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Dynamic"
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "app-vm"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  size                = var.vm_size
  admin_username      = var.admin_username
  network_interface_ids = [
    azurerm_network_interface.vm_nic.id
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = file(var.public_key_path)
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  custom_data = filebase64("vm_user_data.sh")
}

resource "azurerm_storage_account" "private_storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "private_container" {
  name                  = "private-container"
  storage_account_name  = azurerm_storage_account.private_storage.name
  container_access_type = "private"
}

resource "azurerm_cosmosdb_account" "gremlin" {
  name                = var.cosmosdb_account_name
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableGremlin"
  }
}

```

### Variables.tf

```hcl
variable "location" {
  default = "East US"
}

variable "vnet_cidr" {
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  default = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  default = "10.0.2.0/24"
}

variable "vm_size" {
  default = "Standard_B1s"
}

variable "admin_username" {
  default = "azureuser"
}

variable "public_key_path" {
  description = "Path to your public SSH key"
  default     = "~/.ssh/id_rsa.pub"
}

variable "storage_account_name" {
  default = "privatestorageacc123"
}

variable "cosmosdb_account_name" {
  default = "gremlinaccount123"
}

```
### Outputs.tf
```hcl
output "vm_public_ip" {
  value = azurerm_public_ip.vm_public_ip.ip_address
}

output "storage_account_name" {
  value = azurerm_storage_account.private_storage.name
}

output "cosmosdb_endpoint" {
  value = azurerm_cosmosdb_account.gremlin.endpoint
}

```
### vm_user_data.sh
```bash
#!/bin/bash
sudo apt-get update -y
sudo apt-get install -y python3-pip
pip3 install azure-storage-blob gremlinpython

# Simula una consulta y escribe a blob
echo "Consulta de prueba a Cosmos DB" > result.txt

```