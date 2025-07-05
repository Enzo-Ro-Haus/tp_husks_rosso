# Usuario Administrador por Defecto

## Descripción
El sistema crea automáticamente un usuario administrador por defecto al iniciar la aplicación backend.

## Credenciales por Defecto
- **Email**: `admin@email.com`
- **Password**: `123456`
- **Rol**: `ADMIN`
- **Nombre**: `Administrador`
- **Estado**: `Activo`
- **Imagen**: `user_img` (imagen por defecto)

## Funcionamiento

### Creación Automática
- Se ejecuta al iniciar la aplicación Spring Boot
- Utiliza `CommandLineRunner` para ejecutarse después de que la aplicación esté lista
- Verifica si el usuario ya existe antes de crearlo
- Maneja errores de forma robusta

### Verificación
- **Logs**: Se muestran mensajes detallados en la consola
- **Endpoint**: `/usuario/admin-status` (requiere autenticación ADMIN)
- **Base de datos**: Se puede verificar directamente en la tabla `Usuario`

### Características de Seguridad
- ✅ **Password encriptado**: Se usa `PasswordEncoder` para encriptar la contraseña
- ✅ **Verificación de duplicados**: No crea usuarios duplicados
- ✅ **Manejo de errores**: Captura y reporta errores detalladamente
- ✅ **Estado activo**: El usuario se crea con estado activo
- ✅ **Rol protegido**: El rol ADMIN no se puede cambiar desde el frontend

## Logs de Ejecución

### Usuario Creado Exitosamente
```
🚀 Iniciando creación de usuario administrador por defecto...
📝 Creando usuario administrador por defecto...
✅ Usuario administrador creado exitosamente:
   - ID: 1
   - Nombre: Administrador
   - Email: admin@email.com
   - Rol: ADMIN
   - Activo: true
   - Imagen: user_img
🔑 Credenciales de acceso:
   - Email: admin@email.com
   - Password: 123456
```

### Usuario Ya Existe
```
🚀 Iniciando creación de usuario administrador por defecto...
✅ Usuario administrador por defecto ya existe:
   - ID: 1
   - Email: admin@email.com
   - Rol: ADMIN
   - Activo: true
```

### Error en la Creación
```
🚀 Iniciando creación de usuario administrador por defecto...
❌ Error al crear usuario administrador por defecto:
   - Error: [descripción del error]
   - Tipo: [tipo de excepción]
   - Causa: [causa del error si existe]
```

## Endpoint de Verificación

### GET `/usuario/admin-status`
**Requerimientos**: Autenticación con rol ADMIN

**Respuesta Exitosa**:
```json
{
  "exists": true,
  "id": 1,
  "nombre": "Administrador",
  "email": "admin@email.com",
  "rol": "ADMIN",
  "activo": true,
  "imagenPerfilPublicId": "user_img"
}
```

**Respuesta si no existe**:
```json
{
  "exists": false
}
```

## Consideraciones

### Seguridad
- ⚠️ **Cambiar credenciales**: Se recomienda cambiar la contraseña después del primer login
- ⚠️ **Ambiente de producción**: Considerar deshabilitar en producción o usar variables de entorno
- ⚠️ **Logs sensibles**: Los logs muestran información del usuario creado

### Mantenimiento
- El usuario se crea solo una vez
- Si se elimina manualmente, se recreará al reiniciar la aplicación
- El campo `activo` se hereda de la clase `Base` con valor por defecto `true`

### Personalización
Para cambiar las credenciales por defecto, modificar en `BackendApplication.java`:
```java
.email("tu-email@dominio.com")
.password(passwordEncoder.encode("tu-password"))
.nombre("Tu Nombre")
``` 