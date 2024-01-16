

export class ValidateDateMiddleware {

    static get( value: string ) {

        const date = new Date( value );
        if( !isNaN(date.getTime())) return date;

        throw new Error('La fecha es inválida');
    }

}