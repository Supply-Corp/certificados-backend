
enum States {
    ACTIVE,
    DELETED
}

export class TemplateEntity {

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly file: string,
        public readonly state: States,

        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }) {

        const { id, name, file, state, createdAt, updatedAt } = object;
    
        if( !id ) throw 'missing id';
        if( !name ) throw 'missing name';
        if( !file ) throw 'missing file';
        if( !state ) throw 'missing state';
    
        return new TemplateEntity( id, name, file, state, createdAt, updatedAt );
    }

}