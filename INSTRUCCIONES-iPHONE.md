# 📱 Cómo Abrir QUEET WEED en iPhone

## 🚨 Problema: iPhone no muestra opción de navegador

El iPhone no reconoce archivos HTML como páginas web por defecto. Aquí tienes **3 soluciones**:

## 🔧 Solución 1: Servidor Local (Recomendado)

### En tu Mac/PC:
1. **Abre Terminal** (Mac) o **Command Prompt** (Windows)
2. **Navega** a la carpeta donde está `index.html`
3. **Ejecuta** este comando:
   ```bash
   python3 -m http.server 8000
   ```
4. **Verás** algo como: "Serving HTTP on 0.0.0.0 port 8000"

### En tu iPhone:
1. **Abre Safari**
2. **Ve a:** `http://TU-IP:8000`
   - Reemplaza `TU-IP` con la IP de tu Mac/PC
   - Ejemplo: `http://192.168.1.100:8000`
3. **Toca el botón compartir** (cuadrado con flecha)
4. **Selecciona "Añadir a pantalla de inicio"**
5. **¡Listo!** La app se instala como PWA

### Para encontrar tu IP:
- **Mac:** Ve a Preferencias del Sistema > Red
- **Windows:** Abre CMD y escribe `ipconfig`

## 🔧 Solución 2: GitHub Pages (Gratuito)

### Subir a GitHub:
1. **Crea un repositorio** en GitHub
2. **Sube** el archivo `index.html`
3. **Ve a Settings > Pages**
4. **Selecciona** "Deploy from a branch"
5. **Elige** la rama `main`
6. **Guarda** - GitHub te dará una URL

### En tu iPhone:
1. **Abre Safari**
2. **Ve a** la URL de GitHub Pages
3. **Instala** como PWA

## 🔧 Solución 3: Servicios Gratuitos

### Netlify Drop:
1. **Ve a** https://app.netlify.com/drop
2. **Arrastra** el archivo `index.html`
3. **Espera** a que se suba
4. **Copia** la URL generada
5. **Abre** en Safari en tu iPhone
6. **Instala** como PWA

### Vercel:
1. **Ve a** https://vercel.com
2. **Crea cuenta** gratuita
3. **Sube** el archivo `index.html`
4. **Obtén** URL automáticamente
5. **Abre** en Safari en tu iPhone

## 📱 Instalación como PWA

### Una vez que tengas la URL:
1. **Abre Safari** en tu iPhone
2. **Navega** a la URL
3. **Toca el botón compartir** (cuadrado con flecha)
4. **Selecciona "Añadir a pantalla de inicio"**
5. **Personaliza el nombre** (ej: "QUEET WEED")
6. **Toca "Añadir"**

### La app aparecerá:
- ✅ **En tu pantalla de inicio**
- ✅ **Como una app nativa**
- ✅ **Funciona offline**
- ✅ **Datos persistentes**

## 🎯 Solución Más Fácil: Servidor Local

### Paso a paso:
1. **Conecta** tu iPhone y Mac/PC a la misma WiFi
2. **Abre Terminal** en tu Mac/PC
3. **Navega** a la carpeta del proyecto:
   ```bash
   cd /ruta/a/tu/proyecto
   ```
4. **Ejecuta** el servidor:
   ```bash
   python3 -m http.server 8000
   ```
5. **Encuentra** tu IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
6. **En tu iPhone:**
   - Abre Safari
   - Ve a: `http://TU-IP:8000`
   - Instala como PWA

## 🔍 Verificar que Funciona

### En Safari deberías ver:
- ✅ **Título:** "QUEET WEED - DEJA DE FUMAR MARIHUANA"
- ✅ **Contador grande:** "0 DÍAS"
- ✅ **4 contadores pequeños:** Mejor racha, total días, fumadas, hoy
- ✅ **Botones:** FUMÉ, -1 FUMADA, RESET LOGROS, REINICIAR
- ✅ **Botón ES/EN** en la esquina superior derecha

### Si no funciona:
1. **Verifica** que estás en la misma WiFi
2. **Prueba** la IP en tu Mac/PC primero
3. **Reinicia** el servidor si es necesario
4. **Usa** otra solución (GitHub Pages, Netlify)

## 🎉 ¡Listo!

Una vez instalada, la app:
- ✅ **Funciona offline**
- ✅ **Guarda datos localmente**
- ✅ **Se actualiza automáticamente**
- ✅ **Se ve como una app nativa**
- ✅ **Tiene todas las funcionalidades**

---

**¿Necesitas ayuda?** Prueba primero la **Solución 1 (Servidor Local)** - es la más rápida y confiable.
