# 🚀 Deploy QUEET WEED en Heroku

## 📋 Configuración para Heroku

### **App Name:** `queet-ztmarcos`

## 🔧 Pasos para Deploy

### **1. Instalar Heroku CLI**
```bash
# Mac
brew tap heroku/brew && brew install heroku

# Windows
# Descarga desde: https://devcenter.heroku.com/articles/heroku-cli
```

### **2. Login a Heroku**
```bash
heroku login
```

### **3. Crear App en Heroku**
```bash
heroku create queet-ztmarcos
```

### **4. Configurar Buildpacks**
```bash
heroku buildpacks:set heroku/nodejs
```

### **5. Configurar Variables de Entorno**
```bash
heroku config:set NODE_ENV=production
```

### **6. Deploy**
```bash
git add .
git commit -m "Heroku deployment ready"
git push heroku main
```

### **7. Abrir la App**
```bash
heroku open
```

## 📱 URL de la App

Una vez deployada, la app estará disponible en:
**https://queet-ztmarcos.herokuapp.com**

## 🎯 Instalación en iPhone

### **Pasos:**
1. **Abre Safari** en tu iPhone
2. **Ve a:** `https://queet-ztmarcos.herokuapp.com`
3. **Toca el botón compartir** (cuadrado con flecha)
4. **Selecciona "Añadir a pantalla de inicio"**
5. **Personaliza el nombre** (ej: "QUEET WEED")
6. **Toca "Añadir"**

## 🔍 Verificar Deploy

### **Comandos útiles:**
```bash
# Ver logs
heroku logs --tail

# Ver estado de la app
heroku ps

# Reiniciar app
heroku restart

# Ver variables de entorno
heroku config
```

## 🛠️ Troubleshooting

### **Si el deploy falla:**
1. **Verifica logs:**
   ```bash
   heroku logs --tail
   ```

2. **Verifica buildpacks:**
   ```bash
   heroku buildpacks
   ```

3. **Reinicia la app:**
   ```bash
   heroku restart
   ```

### **Si la app no carga:**
1. **Verifica el puerto:**
   - Heroku asigna automáticamente el puerto
   - El archivo `server.js` maneja esto

2. **Verifica variables de entorno:**
   ```bash
   heroku config
   ```

## 📊 Monitoreo

### **Heroku Dashboard:**
- Ve a: https://dashboard.heroku.com/apps/queet-ztmarcos
- Monitorea logs, métricas y estado

### **Logs en tiempo real:**
```bash
heroku logs --tail
```

## 🔄 Actualizaciones

### **Para actualizar la app:**
```bash
git add .
git commit -m "Update description"
git push heroku main
```

## 💰 Costos

### **Plan Gratuito:**
- ✅ **Gratis** para uso personal
- ✅ **Funciona perfectamente** para la app
- ✅ **Sin límites** de uso

### **Si necesitas más:**
- **Hobby:** $7/mes
- **Standard:** $25/mes

## 🎉 ¡Listo!

Una vez deployada:
- ✅ **URL pública:** https://queet-ztmarcos.herokuapp.com
- ✅ **Funciona en iPhone** como PWA
- ✅ **Memoria local** completa
- ✅ **Offline** después de la primera carga
- ✅ **Datos persistentes** en el dispositivo

---

**¡La app estará disponible globalmente!** 🌍✨
