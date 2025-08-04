import { toast } from 'react-toastify';

const defaultOptions = {
  position: 'top-right' as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (message: string) => {
  toast.success(message, defaultOptions);
};

export const showError = (message: string) => {
  toast.error(message, defaultOptions);
};

export const showWarning = (message: string) => {
  toast.warning(message, defaultOptions);
};

export const showInfo = (message: string) => {
  toast.info(message, defaultOptions);
};

export const flightToast = {
  searchSuccess: (count: number) =>
    showSuccess(`Found ${count} flights matching your search! 🛫`),
  searchError: (message = 'Failed to search flights') =>
    showError(`${message} ❌`),
  noFlightsFound: () =>
    showWarning('No flights found for your search criteria 🔍'),
  locationFound: (city: string) => showInfo(`Found your location: ${city} 📍`),
  locationError: () =>
    showWarning('Location access denied. Using default location 📍'),
  formIncomplete: () => showWarning('Please fill in all required fields ✈️'),
  showError: (message: string) => showError(message),
  showInfo: (message: string) => showInfo(message),
  showSuccess: (message: string) => showSuccess(message),
  showWarning: (message: string) => showWarning(message),
};
