# Sistema de Gestión de Usuarios

Un sistema ABM (Alta, Baja, Modificación) completo para gestionar usuarios con backend Express/MongoDB y frontend React.

## Características

- API REST completa para operaciones CRUD
- Interfaz moderna y responsiva
- Validación de formularios
- Manejo de errores
- Diseño profesional con Tailwind CSS

## Configuración

1. **Base de datos**: Actualiza la variable `MONGODB_URI` en el archivo `.env` con tu conexión a MongoDB Atlas.

2. **Ejecutar el backend**:
   ```bash
   npm run dev:server
   ```

3. **Ejecutar el frontend** (en otra terminal):
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── services/           # Servicios para API
├── types/              # Definiciones TypeScript
server/
├── models/             # Modelos de MongoDB
├── routes/             # Rutas de Express
└── index.js           # Servidor principal
```

## API Endpoints

- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario