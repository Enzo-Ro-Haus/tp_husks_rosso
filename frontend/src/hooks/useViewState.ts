import { useEffect } from 'react';
import { viewStore } from '../store/viewStore';

type AdminView = "Products" | "Users" | "Categories" | "Types" | "Sizes" | "Addresses" | "Orders";
type ClientView = "Client" | "Orders";

export const useAdminView = () => {
  const view = viewStore((s) => s.adminView);
  const setView = viewStore((s) => s.setAdminView);
  const resetView = viewStore((s) => s.resetAdminView);

  useEffect(() => {
    console.log(`🔄 Admin view changed to: ${view}`);
  }, [view]);

  return {
    view,
    setView,
    resetView,
  };
};

export const useClientView = () => {
  const view = viewStore((s) => s.clientView);
  const setView = viewStore((s) => s.setClientView);
  const resetView = viewStore((s) => s.resetClientView);

  useEffect(() => {
    console.log(`🔄 Client view changed to: ${view}`);
  }, [view]);

  return {
    view,
    setView,
    resetView,
  };
};

export const useViewState = () => {
  const adminView = viewStore((s) => s.adminView);
  const clientView = viewStore((s) => s.clientView);
  const setAdminView = viewStore((s) => s.setAdminView);
  const setClientView = viewStore((s) => s.setClientView);
  const resetAllViews = viewStore((s) => s.resetAllViews);

  return {
    adminView,
    clientView,
    setAdminView,
    setClientView,
    resetAllViews,
  };
}; 