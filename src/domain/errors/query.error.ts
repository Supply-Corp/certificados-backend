
export class QueryError {

    constructor(
        public readonly path: string,
        public readonly msg: string,
    ) {}


    static fromObject( object: {[key:string]: any}) {

        const { path, msg } = object;
        if( !path ) throw 'missing path error';
        if( !msg ) throw 'missing msg error';

        return new QueryError( path, msg );
    }
}