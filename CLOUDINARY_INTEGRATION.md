# Integración de Cloudinary

## Descripción
Se ha integrado Cloudinary para el manejo de imágenes en las entidades Producto y Usuario, respetando la arquitectura con genéricos del backend. **Ahora incluye funcionalidad completa de carga de imágenes en formularios de creación y edición.**

## Nuevas Funcionalidades

### ✅ **Formularios de Creación y Edición**
- **Productos**: Campo de carga de imagen incluido automáticamente
- **Usuarios**: Campo de carga de imagen de perfil incluido automáticamente

### ✅ **Componente ImageUpload**
- **Preview local**: Muestra la imagen seleccionada antes de subir
- **Subida directa**: Sube automáticamente a Cloudinary al confirmar
- **Imagen actual**: Muestra la imagen existente si hay una
- **Eliminación**: Permite eliminar la imagen actual
- **Estados de carga**: Muestra indicadores de progreso

## Configuración Requerida

### Upload Preset en Cloudinary
**IMPORTANTE**: Debes configurar un upload preset en tu cuenta de Cloudinary:
1. Ve a Settings > Upload en tu dashboard de Cloudinary
2. Crea un nuevo upload preset
3. Configúralo como "Unsigned" para subidas desde el frontend
4. Actualiza `CLOUDINARY_UPLOAD_PRESET` en `cloudinaryUploadHTTP.ts`

## Uso en Formularios

```tsx
<ImageUpload
  currentImagePublicId={values.imagenPublicId}
  onImageUpload={async (file) => {
    const publicId = await uploadImageToCloudinary(file);
    setFieldValue("imagenPublicId", publicId);
    return publicId;
  }}
  onImageRemove={() => {
    setFieldValue("imagenPublicId", "");
  }}
  label="Imagen del producto"
/>
```

## Flujo Completo

1. **Usuario selecciona imagen** → Preview local se muestra
2. **Usuario confirma subida** → Imagen se sube a Cloudinary
3. **Cloudinary devuelve public ID** → Se almacena en el formulario
4. **Usuario envía formulario** → Public ID se envía al backend
5. **Backend actualiza entidad** → Public ID se guarda en la base de datos

## Cambios Realizados

### Backend

#### Entidades
- **Producto.java**: Agregado campo `imagenPublicId` (String)
- **Usuario.java**: Agregado campo `imagenPerfilPublicId` (String)

#### Servicios
- **ProductoService.java**: Agregado método `updateProductImage(Long id, String imagenPublicId)`
- **ProductoServiceImpl.java**: Implementación del método de actualización de imagen
- **UsuarioService.java**: Agregado método `updateUserProfileImage(Long id, String imagenPerfilPublicId)`
- **UsuarioServiceImpl.java**: Implementación del método de actualización de imagen de perfil

#### Controladores
- **ProductoController.java**: Agregado endpoint `PATCH /producto/{id}/imagen`
- **UsuarioController.java**: Agregado endpoint `PATCH /usuario/{id}/imagen-perfil`

### Frontend

#### Tipos TypeScript
- **IProducto.ts**: Agregado campo `imagenPublicId?: string`
- **IUsuario.ts**: Agregado campo `imagenPerfilPublicId?: string`

#### Componentes
- **CloudinaryImg.tsx**: Componente mejorado para mostrar imágenes de Cloudinary
- **UserProfileImage.tsx**: Componente específico para imágenes de perfil de usuario
- **ImageUpload.tsx**: **NUEVO** - Componente reutilizable para carga de imágenes
- **ClotheCard.tsx**: Modificado para usar CloudinaryImg cuando hay public ID disponible

#### Servicios HTTP
- **cloudinaryHTTP.ts**: Funciones para manejar subida y actualización de imágenes
- **cloudinaryUploadHTTP.ts**: **NUEVO** - Servicio para subida directa a Cloudinary

#### Formularios
- **CreateButton.tsx**: **ACTUALIZADO** - Agregada funcionalidad de carga de imágenes para productos y usuarios
- **EditButton.tsx**: **ACTUALIZADO** - Agregada funcionalidad de carga de imágenes para productos y usuarios

## Uso

### Mostrar imagen de producto
```tsx
import CloudinaryImg from './components/ui/Image/CloudinaryImg';

<CloudinaryImg 
  publicId={producto.imagenPublicId} 
  width={300} 
  height={200} 
  alt={producto.nombre}
/>
```

### Mostrar imagen de perfil de usuario
```tsx
import UserProfileImage from './components/ui/Image/UserProfileImage';

<UserProfileImage 
  imagenPerfilPublicId={usuario.imagenPerfilPublicId}
  size="medium"
  alt={usuario.nombre}
/>
```

### Cargar imagen en formularios
```tsx
import ImageUpload from './components/ui/Image/ImageUpload';

<ImageUpload
  currentImagePublicId={values.imagenPublicId}
  onImageUpload={async (file) => {
    const publicId = await uploadImageToCloudinary(file);
    setFieldValue("imagenPublicId", publicId);
    return publicId;
  }}
  onImageRemove={() => {
    setFieldValue("imagenPublicId", "");
  }}
  label="Imagen del producto"
/>
```

### Actualizar imagen de producto
```tsx
import { updateProductImage } from './http/cloudinaryHTTP';

// Después de subir la imagen a Cloudinary y obtener el public ID
await updateProductImage(productoId, publicId);
```

### Actualizar imagen de perfil
```tsx
import { updateUserProfileImage } from './http/cloudinaryHTTP';

// Después de subir la imagen a Cloudinary y obtener el public ID
await updateUserProfileImage(usuarioId, publicId);
```

## Funcionalidades de Formularios

### ✅ **Formularios de Creación**
- **Productos**: Campo de carga de imagen incluido automáticamente
- **Usuarios**: Campo de carga de imagen de perfil incluido automáticamente

### ✅ **Formularios de Edición**
- **Productos**: Campo de carga de imagen con preview de imagen actual
- **Usuarios**: Campo de carga de imagen de perfil con preview de imagen actual

### ✅ **Características del Componente ImageUpload**
- **Preview local**: Muestra la imagen seleccionada antes de subir
- **Subida directa**: Sube automáticamente a Cloudinary al confirmar
- **Imagen actual**: Muestra la imagen existente si hay una
- **Eliminación**: Permite eliminar la imagen actual
- **Estados de carga**: Muestra indicadores de progreso
- **Validación**: Integrado con Formik para validación de formularios

## Configuración de Cloudinary

### Variables de Entorno
El componente CloudinaryImg está configurado con el cloud name `'drro36ctw'`. Para cambiar la configuración:

1. **Modificar cloudinaryUploadHTTP.ts**:
```typescript
const CLOUDINARY_CLOUD_NAME = 'tu-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = 'tu-upload-preset';
```

2. **Modificar CloudinaryImg.tsx**:
```typescript
const cld = new Cloudinary({cloud: {cloudName: 'tu-cloud-name'} });
```

### Upload Preset
**IMPORTANTE**: Debes configurar un upload preset en tu cuenta de Cloudinary:
1. Ve a Settings > Upload en tu dashboard de Cloudinary
2. Crea un nuevo upload preset
3. Configúralo como "Unsigned" para subidas desde el frontend
4. Actualiza `CLOUDINARY_UPLOAD_PRESET` en `cloudinaryUploadHTTP.ts`

## Notas Importantes

1. **Subida de imágenes**: La subida directa a Cloudinary está implementada y funcional
2. **Seguridad**: Configura las políticas de Cloudinary apropiadamente
3. **Migración**: Si tienes imágenes existentes, necesitarás migrarlas a Cloudinary
4. **Base de datos**: Ejecuta las migraciones necesarias para agregar los nuevos campos
5. **Upload Preset**: **Requerido** - Configura un upload preset en Cloudinary

## Endpoints del Backend

- `PATCH /api/producto/{id}/imagen` - Actualizar imagen de producto
- `PATCH /api/usuario/{id}/imagen-perfil` - Actualizar imagen de perfil de usuario

Ambos endpoints requieren autenticación JWT y reciben el public ID en el body de la petición.

## Flujo Completo de Carga de Imágenes

1. **Usuario selecciona imagen** → Preview local se muestra
2. **Usuario confirma subida** → Imagen se sube a Cloudinary
3. **Cloudinary devuelve public ID** → Se almacena en el formulario
4. **Usuario envía formulario** → Public ID se envía al backend
5. **Backend actualiza entidad** → Public ID se guarda en la base de datos
6. **Imagen disponible** → Se puede mostrar usando CloudinaryImg 