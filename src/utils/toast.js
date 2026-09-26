import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (el) => {
    el.addEventListener("mouseenter", Swal.stopTimer);
    el.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const toastError = (title) => Toast.fire({ icon: "error", title });

export const toastSuccess = (title) => Toast.fire({ icon: "success", title });

export const toastInfo = (title) => Toast.fire({ icon: "info", title });

export default Toast;
