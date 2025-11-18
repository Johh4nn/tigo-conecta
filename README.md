Tigo Conecta
Descripción
Tigo Conecta es una aplicación móvil desarrollada en Ionic con Angular para la gestión de contrataciones de planes móviles. La aplicación permite a los usuarios consultar planes, realizar contrataciones y mantener comunicación en tiempo real a través de un sistema de chat integrado.

Características Principales
🎯 Funcionalidades del Usuario
Autenticación segura con Supabase Auth

Catálogo de planes móviles con información detallada

Sistema de contratación con múltiples estados (pendiente, aprobada, rechazada, cancelada)

Chat en tiempo real entre usuarios y asesores

Gestión de perfiles de usuario

Seguimiento de contrataciones

💬 Sistema de Chat
Mensajería en tiempo real con WebSockets

Soporte para mensajes de texto y del sistema

Indicadores de mensajes leídos

Historial de conversaciones por contratación

Validación de permisos por usuario

🛠️ Características Técnicas
Frontend: Ionic 7 con Angular

Backend: Supabase (PostgreSQL + Auth + Realtime)

Base de datos: PostgreSQL con tablas optimizadas

Autenticación: Sistema seguro con perfiles de usuario

Tiempo real: Suscripciones a cambios con Postgres Changes

Estructura de la Base de Datos
Tablas Principales
contrataciones
Gestión del ciclo completo de contrataciones

Estados: pendiente, aprobada, rechazada, cancelada

Relaciones con usuarios y planes móviles

Campos de seguimiento y auditoría

mensajes_chat
Almacenamiento de mensajes del sistema de chat

Tipos: texto y sistema

Indicadores de estado de lectura

Relación con contrataciones y usuarios

perfiles
Información extendida de usuarios

Integración con sistema de autenticación

Datos personales y de contacto

planes_moviles
Catálogo de planes disponibles

Información detallada de cada plan

Precios y características

Instalación y Configuración
Prerrequisitos
Node.js 16+

Ionic CLI

Cuenta de Supabase

Pasos de Instalación
Clonar el repositorio

bash
git clone https://github.com/Johh4nn/tigo-conecta.git
cd tigo-conecta
Instalar dependencias

bash
npm install
Configurar variables de entorno
Crear archivo src/environments/environment.ts:

typescript
export const environment = {
  production: false,
  supabaseUrl: 'TU_URL_DE_SUPABASE',
  supabaseKey: 'TU_LLAVE_DE_SUPABASE'
};
Ejecutar la aplicación

bash
ionic serve
Configuración de Supabase
Crear un nuevo proyecto en Supabase

Ejecutar los scripts SQL para crear las tablas

Configurar las políticas de RLS (Row Level Security)

Configurar autenticación y usuarios

Scripts Disponibles
ionic serve - Servidor de desarrollo

ionic build - Build de producción

ionic cap add android/ios - Añadir plataforma nativa

ionic cap run android/ios - Ejecutar en dispositivo/emulador

Estructura del Proyecto
text
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── supabase.service.ts
│   │   │   └── auth.service.ts
│   │   └── guards/
│   ├── pages/
│   │   ├── chat/
│   │   ├── contrataciones/
│   │   └── planes/
│   └── shared/
├── assets/
└── environments/
Desarrollo
Servicios Principales
SupabaseService: Conexión y configuración con Supabase

AuthService: Gestión de autenticación y perfiles

ChatService: Funcionalidades del sistema de chat

ContratacionesService: Gestión de contrataciones

Componentes Clave
ChatPage: Interfaz de mensajería en tiempo real

PlanesPage: Catálogo de planes móviles

ContratacionesPage: Gestión de contrataciones del usuario

Despliegue
Build de Producción
bash
ionic build --prod
Despliegue en Android
bash
ionic cap add android
ionic cap build android
Despliegue en iOS
bash
ionic cap add ios
ionic cap build ios
