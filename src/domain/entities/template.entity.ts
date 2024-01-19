
enum States {
    ACTIVE,
    DELETED
}

export class TemplateEntity {

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly certified: string,
        public readonly certifiedConstancy: string,
        public readonly state: States,

        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }) {

        const { id, name, certified, certifiedConstancy, state, createdAt, updatedAt } = object;
    
        if( !id ) throw 'missing id';
        if( !name ) throw 'missing name';
        if( !certified ) throw 'missing certified';
        if( !certifiedConstancy ) throw 'missing certifiedConstancy';
        if( !state ) throw 'missing state';
    
        return new TemplateEntity( id, name, certified, certifiedConstancy, state, createdAt, updatedAt );
    }

}