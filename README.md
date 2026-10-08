# ReversePrompt AI — Image Prompt & Aesthetic Extractor

**ReversePrompt AI** is a full-stack, multimodal application that forensically deconstructs images into production-ready prompts and visual blueprints for modern AI image generators (Midjourney v6.1, Flux.1, DALL-E 3, and Stable Diffusion).

---

## ✨ Features

- **Multi-Way Image Upload**:
  - Drag-and-drop or file browser picker (PNG, JPEG, WebP, AVIF, GIF, BMP).
  - Global clipboard paste (<kbd>Ctrl+V</kbd> / <kbd>Cmd+V</kbd>) from screenshots or copied image files.
  - Curated sample image gallery for instant one-click testing.
- **Pre-flight Image Optimization**:
  - Automatically resizes and compresses high-resolution images down to a scale of ≤ 1 MB before sending to the Gemini Vision model to maintain rapid response times and stay within payload quotas.
- **Multi-Engine Generator Prompts**:
  - **Master Prompt (1:1)**: Detailed visual reproduction prompt recreating the scene with high fidelity.
  - **Midjourney v6.1**: Parameters included (`--ar`, `--style raw`, `--v 6.1`, `--stylize`).
  - **Flux.1 / SDXL**: Keyword tag clusters and photorealism tokens.
  - **DALL-E 3 / Imagen 3**: Evocative, storytelling natural prose.
- **Modular Dimension Extraction**:
  - **Exact (1:1)**: Full reproduction prompt.
  - **Style Only**: Retains the art medium, brushwork, lighting, and film grain while abstracting the subject to `[YOUR SUBJECT HERE]`.
  - **Subject Only**: Isolates the protagonist, character, or object with pose and attire so you can transplant them into any new scene.
  - **Colors & Lighting**: Isolates the illumination rig, direction, and color harmony.
  - **Camera & Optics**: Isolates lens focal length, perspective angle, depth-of-field, and framing.
  - **Custom Focus**: Ask specific questions or extract bespoke attributes (e.g., historical attire, architecture era).
  - **11 Granular Extractable Dimensions**: Toggle individual layers in the dropdown menu.
- **1:1 Subject Injection & Swap**:
  - Replace the original detected subject with a custom subject (e.g., *"a golden retriever in aviator goggles"*, *"a cybernetic robot cat"*).
  - Generates an exact 1:1 reproduction prompt that preserves 100% of the original background, environment, lighting physics, camera optics, colors, and art style.
  - Available both before extraction and dynamically inside the prompt viewer.
- **Visual Forensic Breakdown**:
  - **Color Palette**: 5–6 extracted colors with real hex codes (`#RRGGBB`), color names, roles (dominant, accent, highlight, shadow), and 1-click copy.
  - **Art Medium & Movement**: Identifies film stock, digital rendering pipeline (Octane, Unreal), or painting medium.
  - **Lighting Rig**: Type (e.g., golden hour, rim light, volumetric fog), direction, and highlight intensity.
  - **Camera Specifications**: Estimated lens (e.g., 85mm f/1.4, 24mm wide angle), sensor, angle, and framing.
  - **Tactile Textures & Atmospheric Particles**: Airborne dust, rain reflections, subsurface scattering, material finishes.
  - **Negative Prompt Shield**: Prevent unwanted generator artifacts (distortion, low-res, extra limbs).
- **Custom Model & API Key Settings**:
  - In-app **Settings Modal** accessible from the header and footer.
  - Configure any Gemini model (default: `gemini-3.5-flash-lite`, with quick buttons for `gemini-3.8-flash`, etc.).
  - Enter your personal Gemini API key when self-hosting or running outside Google AI Studio.
  - All configurations persist locally in browser `localStorage`.
- **Ultra-Compact UI**:
  - Segmented horizontal control bars, popover dimension menus, collapsible accordions, and tabbed prompt studios designed for zero visual clutter.
- **History & Export**:
  - Local browser storage preserves up to 25 recent extractions with thumbnails, aspect ratios, and full prompt breakdowns.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Backend**: Node.js, Express, `tsx`
- **AI Integration**: `@google/genai` TypeScript SDK (Gemini Vision with Structured JSON Schema)
- **Build Tool**: Vite 8

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd reverse-prompt-ai
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Add your Gemini API key in `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

> **Note**: You can also leave this empty in `.env` and enter your API key directly in the app's **Settings** modal, which saves it locally to your browser.

### 3. Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📖 How to Use

1. **Upload an Image**: Drag and drop an image onto the upload zone, paste from your clipboard (<kbd>Ctrl+V</kbd>), or select one of the curated presets.
2. **Choose Extraction Mode**:
   - Select **Full Blueprint** for all 11 forensic layers.
   - Or choose **Exact (1:1)**, **Style Only**, **Subject Only**, **Colors & Light**, or **Camera**.
   - Use the **Dimensions** dropdown to toggle specific forensic layers on/off.
3. *(Optional)* **Inject a New Subject**:
   - Click **Subject Swap** and type the new subject you want in the scene.
4. **Click "Extract Prompt"**:
   - The image is automatically scaled to ≤ 1 MB and forensically analyzed.
5. **Copy & Customize**:
   - Switch between **Master Prompt**, **Midjourney**, **Flux**, **DALL-E**, and isolated layers.
   - Switch aspect ratios, inject boost modifiers (`+ cinematic lighting`, `+ 8k`), or edit prompts inline.
   - Click **Copy Prompt** for 1-click clipboard copy.

---

## 📄 License

Apache-2.0
