import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AdminView = "Products" | "Users" | "Categories" | "Types" | "Sizes" | "Addresses" | "Orders";
type ClientView = "Client" | "Orders";

interface IViewStore {
  // Admin views
  adminView: AdminView;
  setAdminView: (view: AdminView) => void;
  
  // Client views
  clientView: ClientView;
  setClientView: (view: ClientView) => void;
  
  // Reset functions
  resetAdminView: () => void;
  resetClientView: () => void;
  resetAllViews: () => void;
}

export const viewStore = create<IViewStore>()(
  persist(
    (set) => ({
      // Admin view state
      adminView: "Products",
      setAdminView: (view) => set({ adminView: view }),
      resetAdminView: () => set({ adminView: "Products" }),
      
      // Client view state
      clientView: "Client",
      setClientView: (view) => set({ clientView: view }),
      resetClientView: () => set({ clientView: "Client" }),
      
      // Reset all views
      resetAllViews: () => set({ 
        adminView: "Products", 
        clientView: "Client" 
      }),
    }),
    {
      name: "view-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        adminView: state.adminView,
        clientView: state.clientView,
      }),
    }
  )
); 