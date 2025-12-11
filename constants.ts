import { Template } from './types';

// Scenario A: PyTorch ResNet Training
const pytorchDiff: Template = {
  id: 'pytorch-resnet',
  name: 'ResNet-50 Training (PyTorch)',
  description: 'Standard ImageNet training loop migration to PyTorch XLA.',
  filename: 'train_resnet.py',
  language: 'python',
  metrics: {
    throughputGpu: '1,200 img/sec',
    throughputTpu: '4,800 img/sec',
    costGpu: '$2.48/hr',
    costTpu: '$1.20/hr',
    effort: 'Low',
  },
  tips: [
    "Use `xm.optimizer_step(optimizer)` to handle TPU core synchronization automatically.",
    "Ensure your DataLoader uses `DistributedSampler` to split data across TPU cores.",
    "Tip: XLA compiles your graph. The first few steps might be slow (lazy execution) before speeding up."
  ],
  gpuCode: `import torch
import torch.nn as nn
import torch.optim as optim

# Select GPU device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = ResNet50().to(device)
optimizer = optim.SGD(model.parameters(), lr=0.01)

for data, target in train_loader:
    data, target = data.to(device), target.to(device)
    optimizer.zero_grad()
    output = model(data)
    loss = criterion(output, target)
    loss.backward()
    optimizer.step()`,
  tpuCode: `import torch
import torch.nn as nn
import torch.optim as optim
import torch_xla.core.xla_model as xm
import torch_xla.distributed.parallel_loader as pl

# Select TPU device
device = xm.xla_device()

model = ResNet50().to(device)
optimizer = optim.SGD(model.parameters(), lr=0.01)

# Wrap loader for TPU parallel processing
para_loader = pl.ParallelLoader(train_loader, [device])
for data, target in para_loader.per_device_loader(device):
    data, target = data.to(device), target.to(device)
    optimizer.zero_grad()
    output = model(data)
    loss = criterion(output, target)
    loss.backward()
    xm.optimizer_step(optimizer) # Handles XLA sync`
};

// Scenario B: TensorFlow Keras
const tensorflowDiff: Template = {
  id: 'tf-keras-bert',
  name: 'BERT Fine-Tuning (Keras)',
  description: 'Migrating a Keras fit() loop to use TPUStrategy.',
  filename: 'fine_tune_bert.py',
  language: 'python',
  metrics: {
    throughputGpu: '340 seq/sec',
    throughputTpu: '2,100 seq/sec',
    costGpu: '$3.06/hr',
    costTpu: '$1.85/hr',
    effort: 'Medium',
  },
  tips: [
    "Instantiate the `TPUStrategy` at the very beginning of your script.",
    "Model creation and compilation MUST happen inside the `strategy.scope()`.",
    "Ensure your batch size is divisible by the number of TPU cores (usually 8 or 128) for max efficiency."
  ],
  gpuCode: `import tensorflow as tf
from transformers import TFBertForSequenceClassification

# Load dataset
train_dataset = get_dataset()

model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased")
optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5)
loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)

model.compile(optimizer=optimizer, loss=loss, metrics=["accuracy"])

model.fit(train_dataset, epochs=3)`,
  tpuCode: `import tensorflow as tf
from transformers import TFBertForSequenceClassification

# Initialize TPU Strategy
resolver = tf.distribute.cluster_resolver.TPUClusterResolver(tpu="")
tf.config.experimental_connect_to_cluster(resolver)
tf.tpu.experimental.initialize_tpu_system(resolver)
strategy = tf.distribute.TPUStrategy(resolver)

# Load dataset
train_dataset = get_dataset()

# Open Strategy Scope for Model Definition
with strategy.scope():
    model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased")
    optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5)
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
    model.compile(optimizer=optimizer, loss=loss, metrics=["accuracy"])

model.fit(train_dataset, epochs=3)`
};

export const TEMPLATES: Template[] = [pytorchDiff, tensorflowDiff];