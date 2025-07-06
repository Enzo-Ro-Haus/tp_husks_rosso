# Solución al Error 403 en Registro

## 🔍 Problema Identificado

El error 403 en el endpoint `/public/register` indica que el backend no está preparado para manejar el campo `direcciones` en el registro de usuarios.

### Error Original:
```
AxiosError: Request failed with status code 403
```

## 💡 Solución Implementada

### 1. **Manejo Robusto de Errores**
- **Detección automática**: El frontend detecta cuando el backend no soporta direcciones
- **Fallback inteligente**: Intenta registro sin direcciones si falla con direcciones
- **Feedback al usuario**: Informa claramente sobre la situación

### 2. **Flag de Control Temporal**
```typescript
const ENABLE_ADDRESSES = false; // Cambiar a true cuando el backend esté listo
```

### 3. **Flujo de Registro Mejorado**

#### Opción A: Con direcciones habilitadas
1. Usuario llena formulario con direcciones
2. Frontend envía payload completo
3. Si backend soporta direcciones → ✅ Éxito
4. Si backend no soporta direcciones → Pregunta al usuario si continuar sin direcciones

#### Opción B: Con direcciones deshabilitadas (actual)
1. Usuario llena formulario básico
2. Frontend envía solo datos básicos
3. ✅ Registro exitoso
4. Mensaje informativo sobre futura disponibilidad de direcciones

## 🛠️ Implementación Técnica

### Frontend Changes:

1. **usuarioHTTP.ts**:
   ```typescript
   // Manejo de errores con fallback
   try {
     // Intentar con direcciones
   } catch (error) {
     if (error.response?.status === 403) {
       // Preguntar al usuario si continuar sin direcciones
     }
   }
   ```

2. **Register.tsx**:
   ```typescript
   const ENABLE_ADDRESSES = false; // Control flag
   direcciones: ENABLE_ADDRESSES ? (values.direcciones || []) : []
   ```

3. **errorHandler.ts**:
   ```typescript
   // Manejo específico para cancelación de usuario
   if (error.message === "Registro cancelado por el usuario") {
     return { title: "Registro cancelado", icon: 'info' };
   }
   ```

## 🎯 Beneficios de la Solución

### ✅ **Inmediato**
- Registro funciona sin problemas
- No bloquea a los usuarios
- Mantiene funcionalidad básica

### ✅ **Futuro**
- Fácil activación cuando backend esté listo
- Código preparado para direcciones
- UI ya implementada

### ✅ **Experiencia de Usuario**
- Mensajes claros y informativos
- No hay errores confusos
- Opción de continuar o cancelar

## 🚀 Cómo Activar Direcciones

### Cuando el Backend esté listo:

1. **Cambiar flag en Register.tsx**:
   ```typescript
   const ENABLE_ADDRESSES = true; // Cambiar a true
   ```

2. **Verificar backend**:
   - Endpoint `/public/register` debe aceptar campo `direcciones[]`
   - Crear entidades `Direccion` y `UsuarioDireccion`
   - Manejar validaciones apropiadas

3. **Testing**:
   - Probar registro con direcciones
   - Verificar que se creen las relaciones correctamente
   - Confirmar que el usuario puede loguearse inmediatamente

## 📋 Checklist para Backend

Para que el backend soporte direcciones en registro:

- [ ] Endpoint `/public/register` acepta campo `direcciones[]`
- [ ] Crear entidad `Direccion` para cada dirección
- [ ] Crear relación `UsuarioDireccion` para cada dirección
- [ ] Validaciones apropiadas para campos de dirección
- [ ] Manejo de errores específicos para direcciones
- [ ] Transacciones para asegurar consistencia de datos

## 🔄 Flujo de Datos Esperado

### Payload al Backend:
```json
{
  "nombre": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "imagenPerfilPublicId": "cloudinary_id",
  "direcciones": [
    {
      "calle": "123 Main St",
      "localidad": "New York",
      "cp": "10001"
    }
  ]
}
```

### Respuesta del Backend:
```json
{
  "token": "jwt_token_here",
  "usuario": {
    "id": 1,
    "nombre": "John Doe",
    "email": "john@example.com",
    "rol": "CLIENTE",
    "direcciones": [...]
  }
}
```

## 🎉 Estado Actual

- ✅ **Registro básico funciona**
- ✅ **UI de direcciones implementada**
- ✅ **Manejo de errores robusto**
- ✅ **Preparado para activación futura**
- ⏳ **Esperando soporte del backend para direcciones** 