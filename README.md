# Hacker House Sevilla 2026 - V2 Terminal Interactivo

Landing page con terminal de registro interactivo estilo hacker retro.

## 🎯 Diferencias con la V1

| Característica | V1 (Google Form) | V2 (Terminal Interactivo) |
|---------------|------------------|---------------------------|
| **Registro** | Link a Google Form | Terminal interactivo en la página |
| **Experiencia** | Formulario estándar | Experiencia hacker/terminal |
| **Datos** | Google Sheets automático | Necesitas backend para guardar |
| **Setup** | Solo cambiar link | Configurar envío de datos |

## ✨ Características del Terminal

- **Terminal fullscreen** con estética hacker retro
- **Preguntas una por una** con efecto de typing
- **Validación en tiempo real**
- **Cursor parpadeante** y efectos visuales
- **Teclas:**
  - `ENTER` para enviar respuesta
  - `ESC` para cerrar terminal

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
open http://localhost:3000
```

Haz click en "Aplicar ahora" para abrir el terminal.

## 📝 Configurar Envío de Datos

**Por defecto, los datos NO se envían a ningún sitio.** Solo se muestran en consola.

Tienes 3 opciones para guardar los registros:

### Opción 1: Web3Forms (Gratis, más fácil)

1. Crea cuenta en [web3forms.com](https://web3forms.com)
2. Copia tu Access Key
3. Edita `app/components/Terminal.tsx` línea 195:

```typescript
const response = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    access_key: 'TU_WEB3FORMS_KEY_AQUÍ',
    subject: 'Nuevo registro - Hacker House',
    from_name: 'Hacker House Registration',
    ...formData
  })
});

if (!response.ok) throw new Error('Error al enviar');
```

Los datos llegarán a tu email automáticamente.

### Opción 2: Crear API Route en Next.js

1. Crea `app/api/register/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  // Aquí puedes:
  // - Guardar en Supabase
  // - Enviar email con Resend
  // - Guardar en base de datos
  // - Etc.

  console.log('Nuevo registro:', data);

  return NextResponse.json({ success: true });
}
```

2. Edita `Terminal.tsx` línea 195:

```typescript
const response = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

if (!response.ok) throw new Error('Error al enviar');
```

### Opción 3: Google Sheets con Apps Script

1. Crea un Google Sheet
2. Extensions > Apps Script
3. Pega este código:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone,
    data.project,
    data.experience,
    data.accommodation,
    data.dietary,
    data.referral,
    data.days,
    data.loom,
    data.comments
  ]);

  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy > New deployment > Web app
5. Copia la URL
6. Edita `Terminal.tsx` línea 195:

```typescript
const response = await fetch('TU_URL_DE_APPS_SCRIPT', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
  mode: 'no-cors'
});
```

## 📋 Preguntas del Terminal

El terminal hace 11 preguntas:

1. Nombre completo
2. Email (con validación)
3. Teléfono / WhatsApp
4. Proyecto en el que trabaja
5. Experiencia técnica (opciones múltiples)
6. ¿Necesita alojamiento? (Sí/No)
7. Restricciones alimentarias
8. ¿Cómo nos conociste? (opcional)
9. ¿Qué días puede venir? (checkboxes)
10. **Link de Loom (<2 min)** explicando por qué deberían elegirte
11. Comentarios adicionales (opcional)

Para editar las preguntas, modifica el array `questions` en `app/components/Terminal.tsx` línea 13.

## ✏️ Personalizar el Terminal

### Cambiar colores
Edita `app/globals.css`:

```css
:root {
  --neon-green: #86efac;
  --neon-blue: #93c5fd;
  /* etc */
}
```

### Cambiar mensajes del sistema
Edita `Terminal.tsx` líneas 28-36:

```typescript
const [lines, setLines] = useState<TerminalLine[]>([
  { type: 'system', text: '> Tu mensaje aquí' },
  // ...
]);
```

### Cambiar mensaje de éxito
Edita `Terminal.tsx` líneas 216-226.

## 🎨 Efectos Visuales del Terminal

- **Typing effect** automático para las preguntas
- **Cursor parpadeante** al final del input
- **Colores por tipo de mensaje:**
  - Verde (`neon-green`) → Preguntas
  - Azul (`neon-blue`) → Sistema
  - Blanco → Respuestas del usuario
  - Rosa (`neon-pink`) → Errores
- **Validación en tiempo real**
- **Auto-scroll** hacia abajo

## 🚨 Errores Comunes

### El terminal no se abre
- Verifica que `showTerminal` state esté funcionando
- Revisa la consola del navegador

### Los datos no se envían
- Por defecto solo se muestran en `console.log`
- Configura una de las 3 opciones arriba

### Build falla
```bash
rm -rf node_modules .next
npm install
npm run build
```

## 📦 Deploy en Vercel

```bash
vercel

# O para producción
vercel --prod
```

**Importante:** Si usas la Opción 2 (API Route), funciona automáticamente en Vercel.

## 🆚 ¿Qué versión usar?

### Usa V1 (Google Form) si:
- ✅ Quieres algo rápido y sin backend
- ✅ No te importa la experiencia estándar de Google Forms
- ✅ Prefieres simplicidad

### Usa V2 (Terminal) si:
- ✅ Quieres una experiencia única y memorable
- ✅ Estás OK configurando el envío de datos
- ✅ Quieres impresionar con la estética hacker

---

**Built with ❤️ by Fer**

Para más info, revisa el [README principal del proyecto](../../README.md).
