import { v4 as uuid4 } from 'uuid';

export class Uuid {

    static v4 = () => uuid4()
}