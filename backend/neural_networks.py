from torch import nn

class NumbersNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        
        self.flatten = nn.Flatten()
        self.network = nn.Sequential(
            nn.Linear(28*28, 15),  
            nn.ReLU(), 
            nn.Linear(15, 10) 
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.network(x)
        return logits

class EmotionsNetwork(nn.Module):
	def __init__(self):
		super().__init__()

		self.conv1 = nn.Conv2d(in_channels=1, out_channels=8, kernel_size=3, padding='same') 
		self.bn1 = nn.BatchNorm2d(8)
		self.relu1 = nn.ReLU()
		self.pool1 = nn.MaxPool2d(2,2) # reduce a la mitad el alto y ancho

		self.conv2 = nn.Conv2d(in_channels=8, out_channels=16, kernel_size=3, padding='same')
		self.bn2 = nn.BatchNorm2d(16)
		self.relu2 = nn.ReLU()
		self.pool2 = nn.MaxPool2d(2,2)

		self.conv3 = nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding='same')
		self.bn3 = nn.BatchNorm2d(32)
		self.relu3 = nn.ReLU()
		self.pool3 = nn.MaxPool2d(2,2)

		self.conv4 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding='same')
		self.bn4 = nn.BatchNorm2d(64)
		self.relu4 = nn.ReLU()
		self.pool4 = nn.MaxPool2d(2,2)

		self.dropout = nn.Dropout(0.5)
		self.flatten = nn.Flatten()

		self.fc1 = nn.Linear(64 * 3 * 3, 512)
		self.fc2 = nn.Linear(512, 256)
		self.fc3 = nn.Linear(256, 7)
        
	def forward(self, x):
		x = self.conv1(x)
		x = self.bn1(x)
		x = self.relu1(x)
		x = self.pool1(x)
		
		x = self.conv2(x)
		x = self.bn2(x)
		x = self.relu2(x)
		x = self.pool2(x)
		
		x = self.conv3(x)
		x = self.bn3(x)
		x = self.relu3(x)
		x = self.pool3(x)
		
		x = self.conv4(x)
		x = self.bn4(x)
		x = self.relu4(x)
		x = self.pool4(x)

		x = self.dropout(x)
		x = self.flatten(x)
		
		x = self.fc1(x)
		x = self.fc2(x)
		x = self.fc3(x)

		return x