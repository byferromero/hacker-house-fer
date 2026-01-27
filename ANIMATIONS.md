# 🎬 Animaciones del Terminal - Hacker House

## ✨ Efectos Implementados

### 1. Loading Dots (Pensando...)
**Qué hace:** Tres puntos que parpadean uno tras otro (como cuando un chat está escribiendo)

**Cuándo se usa:**
- Al inicializar el terminal (mientras carga)
- Entre preguntas (mientras "piensa" la siguiente pregunta)
- Al enviar el formulario (mientras procesa)

**Código CSS:**
```css
.loading-dots span {
  animation: dotPulse 1.4s infinite;
}
```

Cada punto tiene un delay diferente (0s, 0.2s, 0.4s) para el efecto de ola.

---

### 2. Typing Effect (Letra por Letra)
**Qué hace:** Las preguntas aparecen letra por letra, como si alguien las estuviera escribiendo.

**Velocidad:** 30ms por carácter (ajustable en línea 158 de Terminal.tsx)

**Ejemplo:**
```
> N
> No
> Nom
> Nomb
> Nombr
> Nombre completo:
```

**Durante el typing:**
- El input está deshabilitado
- No puedes escribir hasta que termine
- El cursor parpadea esperando

---

### 3. Secuencia de Boot (Al abrir)

Cuando abres el terminal, pasa esto:

```
[300ms] > Inicializando sistema de registro...
[800ms] > ...                                    ← Loading dots
[Remove]
[200ms] > ✓ Conexión establecida
[400ms] > Hacker House Registration System v2.0
[100ms] >
[600ms] > Responde las siguientes preguntas...
[300ms] >
[Typing] > Nombre completo:                      ← Letra por letra
```

Total: ~3 segundos de intro antes de poder escribir.

---

### 4. Flujo Entre Preguntas

Cuando respondes una pregunta:

```
> Tu respuesta                                   ← Tu input
[200ms] >
[400ms] > ...                                    ← Loading dots (pensando)
[Remove]
[Typing] > ¿Email:                               ← Nueva pregunta letra por letra
```

---

### 5. Cursor Parpadeante

**Qué hace:** Un cursor verde (`▋`) que parpadea al final del input

**Código CSS:**
```css
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## ⚙️ Ajustar Velocidades

Si quieres cambiar la velocidad de las animaciones, edita [Terminal.tsx](app/components/Terminal.tsx):

### Velocidad del typing (letra por letra)
**Línea 158:**
```typescript
await new Promise(resolve => setTimeout(resolve, 30)); // 30ms por letra
```

Cambios:
- `20` = Más rápido (casi instantáneo)
- `30` = Velocidad actual (natural)
- `50` = Más lento (más dramático)
- `80` = Muy lento (para efecto especial)

### Delays de la secuencia de boot
**Líneas 108-115:**
```typescript
await addLine({ type: 'system', text: '...' }, 300); // El número es el delay en ms
```

### Loading dots (tiempo que "piensa")
**Línea 203:**
```typescript
await addLine({ type: 'loading', text: '> ' }, 400); // 400ms de dots
```

Cambios:
- `200` = Más rápido
- `400` = Actual (natural)
- `800` = Más lento (más suspenso)

---

## 🎨 Personalizar Mensajes de Loading

### Cambiar el texto de loading
**Línea 109:**
```typescript
await addLine({ type: 'loading', text: '> ' }, 800);
```

Puedes cambiarlo por:
- `'> Cargando'`
- `'> Procesando'`
- `'> Pensando'`

Los tres puntos se agregan automáticamente.

---

## 🔥 Experiencia Completa

### Primera impresión (0-3s)
1. Se abre el terminal con efecto fade
2. Aparecen mensajes del sistema
3. Loading dots mientras "carga"
4. Primera pregunta se escribe letra por letra

### Durante el formulario (por pregunta ~5-8s)
1. Usuario escribe respuesta
2. Presiona ENTER
3. Muestra la respuesta
4. Loading dots (pensando...)
5. Nueva pregunta letra por letra
6. Usuario puede escribir

### Al finalizar (2-3s)
1. Loading dots más largo (procesando)
2. Mensaje de éxito
3. Resumen de datos
4. Instrucción de cerrar (ESC)

---

## 💡 Tips de UX

**Balance perfecto:**
- Las animaciones están pensadas para ser rápidas pero notables
- No se siente lento ni frustrante
- Da sensación de terminal "real" sin hacerlo tedioso

**Si quieres hacerlo MÁS DRAMÁTICO:**
- Aumenta todos los delays un 50%
- Cambia velocidad typing a `50ms`

**Si quieres hacerlo MÁS RÁPIDO:**
- Reduce delays a la mitad
- Cambia velocidad typing a `15ms`
- Reduce loading dots a `200ms`

---

**Los valores actuales están optimizados para un buen balance entre espectáculo y usabilidad.**
