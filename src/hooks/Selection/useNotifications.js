import { toast } from 'react-toastify';

export const useNotifications = () => {
  const notifySuccess = (message) => {
    toast.success(message, { position: 'top-center', autoClose: 3000 });
  };

  const notifyError = (message) => {
    toast.error(message, { position: 'top-center', autoClose: 3000 });
  };

  return {
    notifySuccess,
    notifyError
  };
};