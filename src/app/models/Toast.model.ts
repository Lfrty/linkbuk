export interface ToastData {
    mensaje: string;
    tipo: 'ok' | 'error' | 'info';
    visible: boolean;
}