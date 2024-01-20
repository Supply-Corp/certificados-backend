export function numeroALetras(num: number): string {
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    const especiales: { [key: string]: string } = { '11': 'once', '12': 'doce', '13': 'trece', '14': 'catorce', '15': 'quince' };

    if (num <= 10) {
        return unidades[num];
    } else if (num <= 20) {
        return especiales[num.toString()] || decenas[Math.floor(num / 10)] + ' y ' + unidades[num % 10];
    } else if (num < 100) {
        return decenas[Math.floor(num / 10)] + (num % 10 !== 0 ? ' y ' + unidades[num % 10] : '');
    } else if (num < 1000) {
        return centenas[Math.floor(num / 100)] + (num % 100 !== 0 ? ' ' + numeroALetras(num % 100) : '');
    } else if (num <= 9999) {
        let mil = Math.floor(num / 1000);
        let resto = num % 1000;
        return unidades[mil] + ' mil ' + (resto !== 0 ? numeroALetras(resto) : '');
    } else {
        return 'Número fuera de rango';
    }
}