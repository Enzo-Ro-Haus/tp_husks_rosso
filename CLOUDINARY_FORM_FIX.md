# Fix: Integración de Cloudinary en Formularios de Creación y Edición

## Problema Identificado
El componente de drag and drop de Cloudinary (`ImageUpload`) estaba fuera del formulario en los componentes de creación y edición, lo que significaba que las imágenes no se estaban enviando correctamente con los datos del formulario.

## Solución Implementada

### 1. Componente de Creación (`CreateButtonBootstrap.tsx`)

#### Agregado manejo específico para campo de imagen de productos:
```typescript
// Manejar campo de imagen para productos
if (view === "Products" && key === "imagenPublicId") {
  return (
    <Col md={12} key={key}>
      <BootstrapForm.Group>
        <BootstrapForm.Label><strong>Imagen del producto</strong></BootstrapForm.Label>
        <ImageUpload
          label=""
          currentImagePublicId={values.imagenPublicId}
          onImageUpload={async (file) => {
            const publicId = await uploadImageToCloudinary(file, "productos");
            setFieldValue("imagenPublicId", publicId);
            return publicId;
          }}
          onImageRemove={() => setFieldValue("imagenPublicId", "")}
        />
      </BootstrapForm.Group>
    </Col>
  );
}
```

### 2. Componente de Edición (`EditButtonBootstrap.tsx`)

#### Agregado el mismo manejo específico para campo de imagen de productos:
```typescript
// Manejar campo de imagen para productos
if (view === "Products" && key === "imagenPublicId") {
  return (
    <Col md={12} key={key}>
      <BootstrapForm.Group>
        <BootstrapForm.Label><strong>Imagen del producto</strong></BootstrapForm.Label>
        <ImageUpload
          label=""
          currentImagePublicId={values.imagenPublicId}
          onImageUpload={async (file) => {
            const publicId = await uploadImageToCloudinary(file, "productos");
            setFieldValue("imagenPublicId", publicId);
            return publicId;
          }}
          onImageRemove={() => setFieldValue("imagenPublicId", "")}
        />
      </BootstrapForm.Group>
    </Col>
  );
}
```

## Campos ya Configurados

### Valores Iniciales
- ✅ `CreateButtonBootstrap`: Campo `imagenPublicId: ""` incluido en `initialValuesMap`
- ✅ `EditButtonBootstrap`: Campo `imagenPublicId` incluido en `getInitialValues()`

### Esquemas de Validación
- ✅ `CreateButtonBootstrap`: Campo `imagenPublicId: yup.string().optional()` incluido en `schemaMap`
- ✅ `EditButtonBootstrap`: Campo `imagenPublicId: yup.string().optional()` incluido en `schemaMap`

## Funcionalidades Implementadas

### ✅ **Formularios de Creación**
- **Productos**: Campo de carga de imagen integrado en el formulario
- **Usuarios**: Campo de carga de imagen de perfil ya funcionando

### ✅ **Formularios de Edición**
- **Productos**: Campo de carga de imagen integrado en el formulario
- **Usuarios**: Campo de carga de imagen de perfil ya funcionando

### ✅ **Características del Componente ImageUpload**
- **Preview local**: Muestra la imagen seleccionada antes de subir
- **Subida directa**: Sube automáticamente a Cloudinary al confirmar
- **Imagen actual**: Muestra la imagen existente si hay una (en edición)
- **Eliminación**: Permite eliminar la imagen actual
- **Estados de carga**: Muestra indicadores de progreso
- **Integración con Formik**: Usa `setFieldValue` para actualizar el formulario

## Flujo Completo de Carga de Imágenes

1. **Usuario selecciona imagen** → Preview local se muestra
2. **Usuario confirma subida** → Imagen se sube a Cloudinary
3. **Cloudinary devuelve public ID** → Se almacena en el formulario via `setFieldValue`
4. **Usuario envía formulario** → Public ID se envía al backend junto con otros datos
5. **Backend actualiza entidad** → Public ID se guarda en la base de datos

## Archivos Modificados

- `frontend/src/components/ui/Buttons/CreateButton/CreateButtonBootstrap.tsx`
- `frontend/src/components/ui/Buttons/EditButton/EditButtonBootstrap.tsx`

## Beneficios

- ✅ **Integración completa**: Las imágenes ahora se envían correctamente con los formularios
- ✅ **Experiencia de usuario mejorada**: Preview y estados de carga claros
- ✅ **Validación integrada**: El campo de imagen está incluido en la validación del formulario
- ✅ **Consistencia**: Mismo comportamiento en creación y edición
- ✅ **Mantenibilidad**: Código organizado y reutilizable

## Notas Importantes

1. **Carpeta de Cloudinary**: Las imágenes de productos se suben a la carpeta "productos"
2. **Carpeta de Cloudinary**: Las imágenes de usuarios se suben a la carpeta "usuarios"
3. **Campo opcional**: El campo de imagen es opcional en ambos casos
4. **Validación**: El campo está incluido en los esquemas de validación de Yup
5. **Estado del formulario**: Las imágenes se manejan correctamente en el estado de Formik 