import Swal from "sweetalert2";

export interface ErrorInfo {
  title: string;
  message: string;
  icon?: 'error' | 'warning' | 'info' | 'success';
}

export const getErrorMessage = (error: any, defaultTitle: string = "Error"): ErrorInfo => {
  let errorMessage = "Error inesperado. Intente nuevamente.";
  let errorTitle = defaultTitle;
  
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        errorTitle = "Datos inválidos";
        errorMessage = "Los datos ingresados no son válidos.";
        break;
      case 401:
        errorTitle = "No autorizado";
        errorMessage = "Su sesión ha expirado. Inicie sesión nuevamente.";
        break;
      case 403:
        errorTitle = "Access denied";
        errorMessage = "Some data is not correct.";
        break;
      case 404:
        errorTitle = "No encontrado";
        errorMessage = "El recurso solicitado no existe.";
        break;
      case 409:
        errorTitle = "Conflicto";
        errorMessage = "Ya existe un elemento con esos datos.";
        break;
      case 422:
        errorTitle = "Datos inválidos";
        errorMessage = "Los datos ingresados no cumplen con los requisitos.";
        break;
      case 500:
        errorTitle = "Error del servidor";
        errorMessage = "Error interno del servidor. Intente más tarde.";
        break;
      default:
        errorMessage = `Error ${status}: ${error.response.data?.message || 'Error desconocido'}`;
    }
  } else if (error.request) {
    errorTitle = "Error de conexión";
    errorMessage = "No se pudo conectar con el servidor. Verifique su conexión a internet.";
  } else {
    errorMessage = error.message || "Error inesperado";
  }
  
  return {
    title: errorTitle,
    message: errorMessage,
    icon: 'error'
  };
};

export const showErrorAlert = (error: any, defaultTitle: string = "Error") => {
  const errorInfo = getErrorMessage(error, defaultTitle);
  
  Swal.fire({
    icon: errorInfo.icon || 'error',
    title: errorInfo.title,
    text: errorInfo.message,
    confirmButtonText: "Entendido",
  });
};

export const showSuccessAlert = (title: string, message?: string, timer: number = 2000) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: message,
    timer: timer,
    showConfirmButton: false,
  });
};

export const showWarningAlert = (title: string, message: string) => {
  Swal.fire({
    icon: "warning",
    title: title,
    text: message,
    confirmButtonText: "Entendido",
  });
};

export const showInfoAlert = (title: string, message: string) => {
  Swal.fire({
    icon: "info",
    title: title,
    text: message,
    confirmButtonText: "Entendido",
  });
}; 