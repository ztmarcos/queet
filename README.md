# 🌿 Queet Weed

**Tu compañero para dejar de fumar marihuana de forma saludable**

Queet Weed es una aplicación móvil progresiva (PWA) diseñada para ayudar a las personas a dejar de fumar marihuana de manera efectiva y saludable. La app proporciona seguimiento de progreso, registro de triggers, apoyo personalizado y motivación constante.

## ✨ Características Principales

### 📊 Seguimiento de Progreso
- Contador de días sin fumar
- Racha más larga y estadísticas
- Logros y milestones
- Gráficos de progreso detallados

### 🎯 Gestión de Triggers
- Registro de antojos y triggers
- Categorización por tipo (estrés, aburrimiento, social, etc.)
- Seguimiento de intensidad
- Estadísticas de patrones

### 🤖 Asistente Personal
- Chatbot inteligente con consejos personalizados
- Respuestas a preguntas frecuentes
- Técnicas de relajación y respiración
- Motivación y apoyo 24/7

### 📱 Experiencia Móvil
- Diseño responsive optimizado para móviles
- PWA instalable en dispositivos
- Navegación intuitiva con tabs
- Animaciones suaves y modernas

### 🔐 Seguridad y Privacidad
- Autenticación con Firebase
- Datos sincronizados en la nube
- Exportación de datos personales
- Configuración de privacidad

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore)
- **Deployment**: Heroku
- **PWA**: Service Workers, Manifest
- **UI/UX**: Lucide React Icons, React Hot Toast

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Cuenta de Heroku (para deployment)

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd queet-weed
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `env.example` a `.env.local` y configura tus variables:

```bash
cp env.example .env.local
```

Edita `.env.local` con tus credenciales de Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Configurar Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication con Email/Password
3. Crea una base de datos Firestore
4. Configura las reglas de seguridad
5. Obtén las credenciales y agrégalas a `.env.local`

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Deployment en Heroku

### 1. Preparar para producción
```bash
npm run build
```

### 2. Configurar Heroku
```bash
# Instalar Heroku CLI si no lo tienes
npm install -g heroku

# Login en Heroku
heroku login

# Crear app en Heroku
heroku create your-app-name

# Configurar variables de entorno
heroku config:set NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
heroku config:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# ... configurar todas las variables de Firebase

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 3. Abrir la aplicación
```bash
heroku open
```

## 📱 Uso de la Aplicación

### Primeros Pasos
1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Configuración inicial**: La app automáticamente inicia tu progreso
3. **Explorar funciones**: Navega por las diferentes secciones

### Funcionalidades Principales

#### Dashboard
- Vista general de tu progreso
- Contador de días sin fumar
- Acciones rápidas
- Logros recientes

#### Progreso
- Gráficos detallados de tu progreso
- Objetivos y milestones
- Historial de logros
- Estadísticas avanzadas

#### Triggers
- Registrar cuando sientas ganas de fumar
- Categorizar por tipo e intensidad
- Ver patrones y estadísticas
- Estrategias de manejo

#### Apoyo
- Chat con asistente personal
- Consejos personalizados
- Técnicas de relajación
- Motivación constante

#### Ajustes
- Configuración de notificaciones
- Exportar datos
- Gestión de cuenta
- Ayuda y soporte

## 🔧 Estructura del Proyecto

```
queet-weed/
├── app/                    # Next.js App Router
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── Dashboard.tsx      # Dashboard principal
│   ├── ProgressTracker.tsx # Seguimiento de progreso
│   ├── TriggerLogger.tsx  # Registro de triggers
│   ├── SupportChat.tsx    # Chat de apoyo
│   └── SettingsPanel.tsx  # Panel de configuración
├── hooks/                 # Hooks personalizados
│   ├── useAuth.ts         # Autenticación
│   └── useProgress.ts     # Gestión de progreso
├── lib/                   # Utilidades
│   └── firebase.ts        # Configuración Firebase
├── public/                # Archivos estáticos
│   └── manifest.json      # PWA manifest
├── package.json           # Dependencias
├── tailwind.config.js     # Configuración Tailwind
├── next.config.js         # Configuración Next.js
└── README.md              # Documentación
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

- **Email**: soporte@queetweed.com
- **Documentación**: [Wiki del proyecto]
- **Issues**: [GitHub Issues]

## 🙏 Agradecimientos

- Comunidad de Next.js
- Equipo de Firebase
- Contribuidores de open source
- Usuarios beta que probaron la aplicación

---

**Queet Weed** - Haciendo el camino hacia una vida libre de marihuana más fácil y saludable. 🌿✨
