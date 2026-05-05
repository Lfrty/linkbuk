export function resolverPortada(portada: string | number | undefined): string {
    if (!portada) return 'assets/img/no-cover.jpg';

    const portadaStr = portada.toString();

    // Si es solo un número (ID de OpenLibrary)
    if (/^\d+$/.test(portadaStr)) {
        return `https://covers.openlibrary.org/b/id/${portadaStr}-L.jpg`;
    }

    return portadaStr;
}