// src/toast.js
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const toast = {
    success: (message, title = 'Success') => {
        iziToast.success({
            title,
            message,
            position: 'topRight',
            timeout: 3000,
        });
    },

    error: (message, title = 'Error') => {
        iziToast.error({
            title,
            message,
            position: 'topRight',
            timeout: 3000,
        });
    },

    info: (message, title = 'Info') => {
        iziToast.info({
            title,
            message,
            position: 'topRight',
            timeout: 3000,
        });
    },

    warning: (message, title = 'Warning') => {
        iziToast.warning({
            title,
            message,
            position: 'topRight',
            timeout: 3000,
        });
    },
};

export default toast;
