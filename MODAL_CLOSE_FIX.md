# Fix para Modal de Edición que no se Cierra

## Problema
El modal de edición no se cerraba cuando se presionaba el botón "Cerrar" o "Cancelar" porque la función `onClose` estaba siendo pasada como una función vacía `() => {}`.

## Solución Implementada

### 1. Estado Local para Control del Modal
Se agregó un estado local en `ListCard.tsx` para controlar cuándo mostrar el modal:

```typescript
const [showEditModal, setShowEditModal] = useState(false);
```

### 2. Funciones de Manejo del Modal
Se crearon tres funciones para manejar el ciclo de vida del modal:

```typescript
const handleEditClick = () => {
  setShowEditModal(true);
};

const handleEditClose = () => {
  setShowEditModal(false);
};

const handleEditUpdated = () => {
  setShowEditModal(false);
  if (onEdited) {
    onEdited();
  }
};
```

### 3. Botón de Edición Separado
Se reemplazó el componente `EditButtonBootstrap` inline por un botón simple que abre el modal:

```typescript
<Button
  variant="outline-primary"
  size="sm"
  onClick={handleEditClick}
>
  Editar
</Button>
```

### 4. Modal Condicional
Se agregó el modal de edición al final del componente, que solo se renderiza cuando `showEditModal` es `true`:

```typescript
{showEditModal && (
  <EditButtonBootstrap
    view={variant}
    item={/* lógica para obtener el item correcto */}
    onClose={handleEditClose}
    onUpdated={handleEditUpdated}
  />
)}
```

## Beneficios
- El modal ahora se cierra correctamente al presionar "Cerrar" o "Cancelar"
- Mejor separación de responsabilidades
- Control más granular del estado del modal
- Mejor experiencia de usuario

## Archivos Modificados
- `frontend/src/components/ui/Card/ListCard/ListCard.tsx` 