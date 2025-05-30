import { Bounce, toast } from "react-toastify";

export const toastifyError = (message: string) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    style: {
      zIndex: 100001,
    },
  });
};

export const toastifyWarn = (message: string, id?: string) => {
  if (id && document.getElementById(id)) return;
  toast.warn(message, {
    position: "bottom-right",
    autoClose: 10000,
    toastId: id,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    style: {
      zIndex: 100001,
    },
  });
};

export const toastifySuccess = (message: string) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    style: {
      zIndex: 100001,
    },
  });
};
