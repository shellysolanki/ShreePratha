import Swal from 'sweetalert2';

export async function confirm(options = {}) {
  const {
    title = 'Are you sure?',
    text = '',
    icon = 'warning',
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
    showCancelButton = true
  } = options;
  const res = await Swal.fire({ title, text, icon, showCancelButton, confirmButtonText, cancelButtonText });
  return res.isConfirmed;
}

export function toast(message, variant = 'primary', redirect = null, duration = 1500) {
  window.dispatchEvent(new CustomEvent('toast:show', { detail: { message, variant, redirect, duration } }));
}

export const toastSuccess = (m, r = null) => toast(m, 'success', r);
export const toastError = (m) => toast(m, 'danger');
export const toastInfo = (m) => toast(m, 'primary');


