# QUEET WEED - Versión iPhone 📱

## 🍃 Tu compañero para dejar de fumar marihuana

Una **Progressive Web App (PWA)** optimizada específicamente para iPhone con memoria local completa.

## ✨ Características Específicas para iPhone

### 📱 **Optimizaciones Móviles**
- ✅ **Safe Area Support** - Compatible con notch y Dynamic Island
- ✅ **Touch-friendly** - Botones de 44px mínimo para mejor usabilidad
- ✅ **No zoom en inputs** - Prevención de zoom automático en iOS
- ✅ **Smooth scrolling** - Scroll suave optimizado para iOS
- ✅ **Fullscreen mode** - Modo pantalla completa nativo

### 💾 **Memoria Local Completa**
- ✅ **localStorage** - Todos los datos se guardan localmente
- ✅ **Offline-first** - Funciona sin conexión a internet
- ✅ **Service Worker** - Cache inteligente para mejor rendimiento
- ✅ **Persistencia** - Datos se mantienen entre sesiones

### 🎯 **Funcionalidades Principales**
- ✅ **Contadores duales** - Total hits y hits del día
- ✅ **Streak automático** - Se actualiza automáticamente
- ✅ **Achievements** - Logros con validación de tiempo real
- ✅ **Triggers** - Registro de situaciones que provocan fumar
- ✅ **Estadísticas** - Seguimiento detallado del progreso
- ✅ **Idiomas** - Español e Inglés

## 📲 Instalación en iPhone

### **Método 1: Safari (Recomendado)**

1. **Abre Safari** en tu iPhone
2. **Ve a:** `https://tu-dominio.com` (o la URL donde esté deployada)
3. **Toca el botón compartir** (cuadrado con flecha)
4. **Selecciona "Añadir a pantalla de inicio"**
5. **Personaliza el nombre** (ej: "QUEET WEED")
6. **Toca "Añadir"**

### **Método 2: Chrome/Safari**

1. **Abre el navegador** en tu iPhone
2. **Navega a la app**
3. **Toca el menú** (3 puntos o compartir)
4. **Selecciona "Instalar app"** o "Añadir a pantalla de inicio"

## 🚀 Uso de la App

### **Dashboard Principal**
- **Contador grande** - Días sin fumar
- **4 contadores pequeños** - Mejor racha, total días, total hits, hits hoy
- **Botones de acción** - FUMÉ, -1 HIT, Reset Logros, REINICIAR

### **Navegación**
- **Dashboard** - Vista principal con estadísticas
- **Progress** - Gráficos y logros detallados
- **Triggers** - Registro de situaciones
- **Support** - Chat de apoyo
- **Settings** - Configuración e idioma

### **Funcionalidades Clave**

#### **Botón "FUMÉ"**
- Registra un incidente de fumar
- Reinicia el streak a 0
- Incrementa contadores de hits
- Actualiza fecha del último hit

#### **Botón "-1 HIT"**
- Resta un hit del contador
- No afecta el streak
- Útil para correcciones

#### **Botón "Reset Logros"**
- Limpia solo los achievements
- No afecta otros datos
- Acción inmediata

#### **Botón "REINICIAR"**
- Reinicia TODO el progreso
- Requiere confirmación
- Acción irreversible

## 🔧 Configuración Técnica

### **Requisitos del Sistema**
- **iOS 11.3+** - Soporte completo para PWA
- **Safari/Chrome** - Navegadores compatibles
- **Conexión inicial** - Para descargar la app
- **Memoria** - ~50MB de espacio

### **Almacenamiento Local**
```javascript
// Datos que se guardan localmente:
- Progress: streak, hits, achievements
- User: información de usuario
- Settings: idioma, notificaciones
- Language: preferencia de idioma
```

### **Service Worker**
- **Cache automático** - Recursos principales
- **Offline support** - Funciona sin internet
- **Actualizaciones** - Se actualiza automáticamente

## 🎨 Diseño Brutalist

### **Características Visuales**
- **Alto contraste** - Negro y blanco
- **Tipografía monoespaciada** - JetBrains Mono
- **Bordes gruesos** - Estilo brutalist
- **Sombras duras** - Efecto 3D
- **Espaciado consistente** - UX optimizada

### **Responsive Design**
- **Mobile-first** - Diseñado para móviles
- **Touch-friendly** - Botones grandes
- **Safe areas** - Compatible con notch
- **Orientación** - Solo portrait

## 📊 Funcionalidades Avanzadas

### **Sistema de Achievements**
- **Validación de tiempo** - Solo después de días completos
- **Sin duplicados** - Sistema de limpieza automática
- **Logros disponibles:**
  - "Primer día" - Al completar 1 día
  - "Una semana" - Al completar 7 días
  - "Un mes" - Al completar 30 días

### **Lógica de Streak**
- **Auto-update** - Se actualiza automáticamente al final del día
- **Considera hits** - No incrementa si fumó hoy
- **Reset inteligente** - Reinicia cuando corresponde

### **Contadores Duales**
- **Total hits** - Desde el inicio (persistente)
- **Daily hits** - Del día actual (se resetea)

## 🔒 Privacidad y Seguridad

### **Datos Locales**
- ✅ **Sin servidor** - Todo se guarda en tu iPhone
- ✅ **Sin tracking** - No se envían datos externos
- ✅ **Sin anuncios** - App completamente limpia
- ✅ **Sin permisos** - No requiere acceso especial

### **Backup**
- **iCloud** - Se sincroniza automáticamente
- **iTunes** - Backup incluido en respaldos
- **Manual** - Puedes exportar datos

## 🛠️ Desarrollo

### **Tecnologías**
- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **date-fns** - Manejo de fechas

### **Estructura del Proyecto**
```
queet/
├── app/                    # Next.js app directory
├── components/            # Componentes React
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configs
├── public/               # Assets estáticos
└── package.json          # Dependencias
```

## 📱 Compatibilidad

### **Dispositivos Soportados**
- ✅ **iPhone 6s+** - iOS 11.3+
- ✅ **iPhone SE** - Todas las generaciones
- ✅ **iPhone X+** - Con notch/Dynamic Island
- ✅ **iPad** - Modo portrait

### **Navegadores**
- ✅ **Safari** - Soporte completo
- ✅ **Chrome** - Soporte completo
- ✅ **Firefox** - Soporte básico
- ✅ **Edge** - Soporte básico

## 🚀 Deploy

### **Plataformas Recomendadas**
- **Vercel** - Deploy automático
- **Netlify** - Deploy automático
- **GitHub Pages** - Gratuito
- **Firebase Hosting** - Google

### **Variables de Entorno**
```env
# Para desarrollo local
NODE_ENV=development

# Para producción (opcional)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
```

## 📞 Soporte

### **Problemas Comunes**
1. **App no se instala** - Verifica que uses Safari
2. **Datos se pierden** - Verifica iCloud sync
3. **No funciona offline** - Verifica Service Worker
4. **Botones no responden** - Verifica touch events

### **Contacto**
- **GitHub Issues** - Para bugs técnicos
- **Email** - Para soporte general

---

## 🎯 ¡Comienza tu viaje hacia una vida más saludable!

**QUEET WEED** - Tu compañero confiable para dejar de fumar marihuana de forma efectiva y sostenible.

*Desarrollado con ❤️ para la comunidad*
