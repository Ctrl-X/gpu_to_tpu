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
  diffRows: [
    {
      left: { lineNumber: 1, content: 'import torch', type: 'unchanged' },
      right: { lineNumber: 1, content: 'import torch', type: 'unchanged' },
    },
    {
      left: { lineNumber: 2, content: 'import torch.nn as nn', type: 'unchanged' },
      right: { lineNumber: 2, content: 'import torch.nn as nn', type: 'unchanged' },
    },
    {
      left: { lineNumber: 3, content: 'import torch.optim as optim', type: 'unchanged' },
      right: { lineNumber: 3, content: 'import torch.optim as optim', type: 'unchanged' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 4, content: 'import torch_xla.core.xla_model as xm', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 5, content: 'import torch_xla.distributed.parallel_loader as pl', type: 'added' },
    },
    {
      left: { lineNumber: 4, content: '', type: 'unchanged' },
      right: { lineNumber: 6, content: '', type: 'unchanged' },
    },
    {
      left: { lineNumber: 5, content: '# Select GPU device', type: 'removed' },
      right: { lineNumber: 7, content: '# Select TPU device', type: 'added' },
    },
    {
      left: { lineNumber: 6, content: 'device = torch.device("cuda" if torch.cuda.is_available() else "cpu")', type: 'removed' },
      right: { lineNumber: 8, content: 'device = xm.xla_device()', type: 'added' },
    },
    {
      left: { lineNumber: 7, content: '', type: 'unchanged' },
      right: { lineNumber: 9, content: '', type: 'unchanged' },
    },
    {
      left: { lineNumber: 8, content: 'model = ResNet50().to(device)', type: 'unchanged' },
      right: { lineNumber: 10, content: 'model = ResNet50().to(device)', type: 'unchanged' },
    },
    {
      left: { lineNumber: 9, content: 'optimizer = optim.SGD(model.parameters(), lr=0.01)', type: 'unchanged' },
      right: { lineNumber: 11, content: 'optimizer = optim.SGD(model.parameters(), lr=0.01)', type: 'unchanged' },
    },
    {
      left: { lineNumber: 10, content: '', type: 'unchanged' },
      right: { lineNumber: 12, content: '', type: 'unchanged' },
    },
    {
      left: { lineNumber: 11, content: 'for data, target in train_loader:', type: 'removed' },
      right: { lineNumber: null, content: '', type: 'empty' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 13, content: '# Wrap loader for TPU parallel processing', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 14, content: 'para_loader = pl.ParallelLoader(train_loader, [device])', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 15, content: 'for data, target in para_loader.per_device_loader(device):', type: 'added' },
    },
    {
      left: { lineNumber: 12, content: '    data, target = data.to(device), target.to(device)', type: 'unchanged' },
      right: { lineNumber: 16, content: '    data, target = data.to(device), target.to(device)', type: 'unchanged' },
    },
    {
      left: { lineNumber: 13, content: '    optimizer.zero_grad()', type: 'unchanged' },
      right: { lineNumber: 17, content: '    optimizer.zero_grad()', type: 'unchanged' },
    },
    {
      left: { lineNumber: 14, content: '    output = model(data)', type: 'unchanged' },
      right: { lineNumber: 18, content: '    output = model(data)', type: 'unchanged' },
    },
    {
      left: { lineNumber: 15, content: '    loss = criterion(output, target)', type: 'unchanged' },
      right: { lineNumber: 19, content: '    loss = criterion(output, target)', type: 'unchanged' },
    },
    {
      left: { lineNumber: 16, content: '    loss.backward()', type: 'unchanged' },
      right: { lineNumber: 20, content: '    loss.backward()', type: 'unchanged' },
    },
    {
      left: { lineNumber: 17, content: '    optimizer.step()', type: 'removed' },
      right: { lineNumber: 21, content: '    xm.optimizer_step(optimizer) # Handles XLA sync', type: 'added' },
    },
  ],
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
  diffRows: [
    {
      left: { lineNumber: 1, content: 'import tensorflow as tf', type: 'unchanged' },
      right: { lineNumber: 1, content: 'import tensorflow as tf', type: 'unchanged' },
    },
    {
      left: { lineNumber: 2, content: 'from transformers import TFBertForSequenceClassification', type: 'unchanged' },
      right: { lineNumber: 2, content: 'from transformers import TFBertForSequenceClassification', type: 'unchanged' },
    },
    {
      left: { lineNumber: 3, content: '', type: 'unchanged' },
      right: { lineNumber: 3, content: '', type: 'unchanged' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 4, content: '# Initialize TPU Strategy', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 5, content: 'resolver = tf.distribute.cluster_resolver.TPUClusterResolver(tpu="")', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 6, content: 'tf.config.experimental_connect_to_cluster(resolver)', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 7, content: 'tf.tpu.experimental.initialize_tpu_system(resolver)', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 8, content: 'strategy = tf.distribute.TPUStrategy(resolver)', type: 'added' },
    },
    {
      left: { lineNumber: 4, content: '', type: 'unchanged' },
      right: { lineNumber: 9, content: '', type: 'unchanged' },
    },
    {
      left: { lineNumber: 5, content: '# Load dataset', type: 'unchanged' },
      right: { lineNumber: 10, content: '# Load dataset', type: 'unchanged' },
    },
    {
      left: { lineNumber: 6, content: 'train_dataset = get_dataset()', type: 'unchanged' },
      right: { lineNumber: 11, content: 'train_dataset = get_dataset()', type: 'unchanged' },
    },
    {
      left: { lineNumber: 7, content: '', type: 'unchanged' },
      right: { lineNumber: 12, content: '', type: 'unchanged' },
    },
    {
      left: { lineNumber: 8, content: 'model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased")', type: 'removed' },
      right: { lineNumber: null, content: '', type: 'empty' },
    },
    {
      left: { lineNumber: 9, content: 'optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5)', type: 'removed' },
      right: { lineNumber: null, content: '', type: 'empty' },
    },
    {
      left: { lineNumber: 10, content: 'loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)', type: 'removed' },
      right: { lineNumber: null, content: '', type: 'empty' },
    },
    {
      left: { lineNumber: 11, content: '', type: 'unchanged' },
      right: { lineNumber: null, content: '', type: 'empty' },
    },
    {
      left: { lineNumber: 12, content: 'model.compile(optimizer=optimizer, loss=loss, metrics=["accuracy"])', type: 'removed' },
      right: { lineNumber: null, content: '', type: 'empty' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 13, content: '# Open Strategy Scope for Model Definition', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 14, content: 'with strategy.scope():', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 15, content: '    model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased")', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 16, content: '    optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5)', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 17, content: '    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)', type: 'added' },
    },
    {
      left: { lineNumber: null, content: '', type: 'empty' },
      right: { lineNumber: 18, content: '    model.compile(optimizer=optimizer, loss=loss, metrics=["accuracy"])', type: 'added' },
    },
    {
      left: { lineNumber: 13, content: '', type: 'unchanged' },
      right: { lineNumber: 19, content: '', type: 'unchanged' },
    },
    {
      left: { lineNumber: 14, content: 'model.fit(train_dataset, epochs=3)', type: 'unchanged' },
      right: { lineNumber: 20, content: 'model.fit(train_dataset, epochs=3)', type: 'unchanged' },
    },
  ]
};

export const TEMPLATES: Template[] = [pytorchDiff, tensorflowDiff];