# GPU to TPU Migration Assistant

A developer tool designed to assist Cloud Architects and ML Engineers in assessing and performing the migration of machine learning workloads from GPU to Google Cloud TPU.

## Project Structure & Components

The application is built with React, TypeScript, and Vite, utilizing Tailwind CSS for styling.

### `App.tsx`
The root component that acts as the state manager and orchestrator.
- **State Management**: Tracks the currently selected workload template, the editable GPU code, and the generated TPU code.
- **AI Integration**: Contains the `handleGenerate` function which initializes the Gemini API client and handles the request/response lifecycle.
- **Diff Calculation**: Uses `useMemo` to recalculate the side-by-side differences whenever the code changes.

### `components/DiffViewer.tsx`
The core visualization component.
- **Diff View**: Renders a side-by-side comparison of GPU vs. TPU code using a custom implementation that mimics GitHub's diff UI.
- **Edit Mode**: Allows users to toggle the "GPU Implementation" column into a text editor (`<textarea>`) to paste or write their own custom code.
- **Triggers**: Contains the "Generate TPU Code" button which invokes the AI generation process in the parent component.

### `components/Header.tsx`
Handles application navigation and template selection.
- Allows users to switch between different pre-set scenarios (e.g., PyTorch ResNet, Keras BERT).

### `components/MetricsBanner.tsx`
Displays projected performance and cost metrics.
- Visualizes the "Why Move?" proposition by comparing Throughput (img/sec) and Cost ($/hr) between GPU and TPU.

### `components/AssessmentForm.tsx`
A mock questionnaire component.
- demonstrates how an intake form would look to gather metadata about the user's specific workload (Framework, Model Type, Custom Ops) to tailor the migration advice.

### `utils/diffGenerator.ts`
A utility helper that wraps the `diff` library.
- **Logic**: Takes two strings (old text, new text) and computes line-by-line differences.
- **Alignment**: It implements logic to align "Removed" lines on the left with "Added" lines on the right to create a readable split-view diff.

---

## How the GenAI Integration Works

The application uses the **Google GenAI SDK** (`@google/genai`) to power the code migration feature.

### 1. Initialization
In `App.tsx`, we import the library:
```typescript
import { GoogleGenAI } from "@google/genai";
```
When the user clicks "Generate TPU Code", we instantiate the client using the API key stored in the environment variables:
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

### 2. Prompt Engineering
The prompt is constructed dynamically using the user's current GPU code (`gpuCode` state). We use `gemini-3-pro-preview` for high-quality code reasoning.

The prompt uses **Few-Shot / Instruction prompting** techniques:
- **Role Definition**: "You are an expert AI engineer..."
- **Task**: Convert GPU code to TPU code using specific libraries (`torch_xla`, `tf.distribute.TPUStrategy`).
- **Constraints**: 
  - "Return ONLY the raw code." (No markdown, no conversation).
  - "Keep the code structure similar." (To ensure the diff view looks clean).

### 3. Processing the Response
The model returns the converted code string. We perform a lightweight cleanup regex to remove any potential Markdown code fences (e.g., ` ```python `) that the model might include despite instructions:
```typescript
const cleanCode = generatedCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
```
This string is then set into the `tpuCode` state, triggering the `DiffViewer` to update and show the migration path.

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (or the port shown in your terminal).
