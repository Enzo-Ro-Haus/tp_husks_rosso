# Persistencia del Estado de Vistas

## Descripción
Sistema que mantiene el estado de la vista actual (Admin/Client) a través de refrescos de página usando Zustand con persistencia en localStorage.

## Problema Resuelto
Antes de esta implementación, al refrescar la página:
- ❌ La vista de Admin volvía a "Products"
- ❌ La vista de Client volvía a "Client"
- ❌ Se perdía el contexto de navegación del usuario

## Solución Implementada

### 1. **ViewStore con Persistencia**
```typescript
// frontend/src/store/viewStore.ts
export const viewStore = create<IViewStore>()(
  persist(
    (set) => ({
      adminView: "Products",
      clientView: "Client",
      setAdminView: (view) => set({ adminView: view }),
      setClientView: (view) => set({ clientView: view }),
      // ... más métodos
    }),
    {
      name: "view-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 2. **Hooks Personalizados**
```typescript
// frontend/src/hooks/useViewState.ts
export const useAdminView = () => {
  const view = viewStore((s) => s.adminView);
  const setView = viewStore((s) => s.setAdminView);
  return { view, setView, resetView };
};
```

### 3. **Integración en Componentes**
```typescript
// Antes (estado local)
const [view, setView] = useState<"Products" | "Users">("Products");

// Después (estado persistente)
const { view, setView } = useAdminView();
```

## Características

### ✅ **Persistencia Automática**
- Las vistas se guardan automáticamente en localStorage
- Se restauran al recargar la página
- Funciona independientemente para Admin y Client

### ✅ **Logs de Debugging**
- Console logs cuando cambian las vistas
- Componente de debug opcional para desarrollo

### ✅ **Funciones de Reset**
- `resetAdminView()`: Vuelve a "Products"
- `resetClientView()`: Vuelve a "Client"
- `resetAllViews()`: Resetea ambas vistas

### ✅ **Tipado Seguro**
- TypeScript con tipos específicos para cada vista
- Prevención de errores en tiempo de compilación

## Uso

### En Componentes Admin
```typescript
import { useAdminView } from '../../../hooks/useViewState';

export const Admin = () => {
  const { view, setView } = useAdminView();
  
  return (
    <AdminSideBar
      view={view}
      onChangeView={setView}
      name={usuario?.nombre}
    />
  );
};
```

### En Componentes Client
```typescript
import { useClientView } from '../../../hooks/useViewState';

export const Client = () => {
  const { view, setView } = useClientView();
  
  return (
    <ClientSideBar
      view={view}
      onChangeView={setView}
      name={usuario?.nombre}
    />
  );
};
```

### Debug Component (Opcional)
```typescript
import { ViewStateDebug } from '../ui/ViewStateDebug/ViewStateDebug';

// En cualquier componente
<ViewStateDebug show={true} />
```

## Estructura de Datos en localStorage

```json
{
  "view-storage": {
    "state": {
      "adminView": "Users",
      "clientView": "Orders"
    },
    "version": 0
  }
}
```

## Beneficios

### 🎯 **Experiencia de Usuario**
- Mantiene el contexto de navegación
- Reduce la frustración al refrescar
- Navegación más fluida

### 🔧 **Desarrollo**
- Fácil debugging con logs
- Componente de debug opcional
- API consistente con hooks

### 🛡️ **Robustez**
- Manejo de errores automático
- Fallback a valores por defecto
- Compatibilidad con SSR

## Consideraciones

### Seguridad
- Los datos se guardan en localStorage del cliente
- No contiene información sensible
- Se puede limpiar fácilmente

### Rendimiento
- Persistencia automática sin impacto en UX
- Carga inicial rápida desde localStorage
- Actualizaciones eficientes

### Mantenimiento
- Fácil de extender para nuevas vistas
- Hooks reutilizables
- Documentación completa

## Casos de Uso

1. **Usuario navega a "Users" en Admin** → Refresca página → Sigue en "Users" ✅
2. **Usuario navega a "Orders" en Client** → Refresca página → Sigue en "Orders" ✅
3. **Cambio de usuario** → Las vistas se mantienen independientes ✅
4. **Limpieza de localStorage** → Vuelve a valores por defecto ✅

## Futuras Mejoras

- [ ] Persistencia de filtros y búsquedas
- [ ] Historial de navegación
- [ ] Sincronización entre pestañas
- [ ] Configuración de vistas favoritas 