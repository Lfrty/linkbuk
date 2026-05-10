export interface ApiResponse<T> {
    ok: boolean;
    message: string;
    data: T;          // null en errores
    errors: any;      // null en éxitos
    code: number; // Se puede recoger en event.status
}