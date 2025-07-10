# Sesión 29 de Mayo Redes Convolucionales

# Recursos

- [https://colab.research.google.com/gist/jofsanchezci/83b64031056d5a1c3a0688335e7135da/tutorial_redes-convolucionales.ipynb](https://colab.research.google.com/gist/jofsanchezci/83b64031056d5a1c3a0688335e7135da/tutorial_redes-convolucionales.ipynb)

# Apuntes de clase

Redes preentrenadas

Las redes preentrenadas son aquellas que cargamos y enviamos directamente las imagenes, las cuales deben cumplir el tamaño esperado, tener cuidado con la gestión de memoria (son redes muy grande)

```python
import pytorch
import torchvision

modelo = torchvision.models.resnet50() #Aqui indicar cual va a importar
```

---

Pytorch

Librería para Deep Learning, cumple la misma función que Keras

```python
import pytorch

torch.nn.Sequential( ..) #Modelo secuencia, similar a Keras
torch.nn.Conv2d(..) #Capa convolucional 2D
torch.nn.Tanh(...) Relu() #Funciones de activación
torch.nn.Linear(...) #Capa totalmente conectada
torch.nn.AvgPool2d(..) #Capa pooling

```

![Untitled](Sesio%CC%81n%2029%20de%20Mayo%20Redes%20Convolucionales%20b2309b3567f14942ba0058b63eb22ed5/Untitled.png)

---

¿Que hacemos con estos modelos?

Enviar la(s) imagen(es) y recibir el resultado

```python
output = modelo(imagen) #Imagen es la entrada
```

# Haz tu propio modelo con Pytorch

¿Como estructuro el modelo?

```python
import pytorch
import pytorch.nn as nn
import torch.nn.functional as F

class MiModelo(nn.Module):
	def __init__(self):
		super(MiModelo, self).__init__() #Inicialice el Model de Pytorch
		#Especificación
		
	def forward(self, x):
		#Como conectarlo
		
```

---

Ejemplo

```python
class MiModeloPro(nn.Modelo):
	"""
	¿Como es la estructura de mi modelo?
	"""
	def __init__(self):
		super(MiModeloPro, self).__init__()
		
		self.cv1 = nn.Conv2d(in_channels=1, 
								out_channels=64, 
								kernel_size=3)
		self.cO = nn.Linear(26*26*64, 256)
		self.cS= nn.Linear(256,10) #10 es por las categorías
	
	"""
	Como va a funcionar, llevar in a out
	"""
	def forward(self, in):
		sc1 = self.cv1(in)
		scf1 = F.relu(sc1)
		
		inflatten = scf1.Flatten(start_dim = 1)
		
		sCO = self.c0(inflatten)
		fsc0 = F.relu(sc0)
		
		sCS = self.cS(fsc0)
		out = F.softmax(sCS, dim=1)
		return out
		
```

---

¿Como configuro este modelo?

```python
#Indicamos los hiperparámetros
BATCH_SIZE = 32
learning_rate = 0.001
num_epochs = 5

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu") #Recursos, revisar si tiene NVIDIA/RADEON
model = MiModeloPro() #Cargamos del modelo
model = model.to(device) #QUe usar 
criterion = nn.CrossEntropyLoss() #Función de pérdida
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate) #Algoritmo de optimización
```

---

¿Como entreno el modelo?

```python
for epoch in range(num_epochs):
    train_running_loss = 0.0
    train_acc = 0.0

    model = model.train() #Entrenar el modelo

    ## etapa de formación
    for i, (images, labels) in enumerate(trainloader):

        images = images.to(device) #Imagenes (BATCHSIZE)
        labels = labels.to(device) #Etiquetas

        ## forward + backprop + loss
        logits = model(images)
        loss = criterion(logits, labels) #Perdida
        optimizer.zero_grad() #Aplico el optimizer
        loss.backward() #Aplico la función de perdida

        ## actualizar parámetros del modelo
        optimizer.step() #Actualizar pesos

				#Calcula el valor de la función de pérdida
        train_running_loss += loss.detach().item()
        #Calcula la precisión de entrenamiento
        train_acc += get_accuracy(logits, labels, BATCH_SIZE)

		#Evaluar el modelo (consolidar la función perdida)
    model.eval()
    print('Epoca: %d | Perdida: %.4f | Accuracy Entrenamiento: %.2f' \
          %(epoch, train_running_loss / i, train_acc/i))
```