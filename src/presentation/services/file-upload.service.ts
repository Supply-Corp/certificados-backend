import path from 'path';
import fs from 'fs';
import { UploadedFile } from "express-fileupload";
import { Uuid } from '../../config';
import { CustomError } from '../../domain';

export class FileUploadService {

    constructor(
        private readonly uuid = Uuid.v4
    ) {}

    checkFolder( folder: string ) {
        console.log({ folder })
        console.log(!fs.existsSync( folder ))
        if( !fs.existsSync( folder )) {
            fs.mkdirSync( folder );
        }
    }

    async singleUpload( 
        file: UploadedFile,
        folder: string = 'uploads', 
        extensions: string[] = ['jpg', 'jpeg', 'png']
    ) {

        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';
            if( !extensions.includes(fileExtension) ) { 
                throw CustomError.badRequest(`Extension ${ fileExtension } no permitida`);
            }

            const destination = path.resolve(__dirname, '../../../public/', folder);

            this.checkFolder( destination );
            const fileName = `${ this.uuid() }.${ fileExtension }`;

            file.mv(`${ destination }/${ fileName }`);

            return {
                fileName
            }
        } catch (error) {
            console.log(`${ error }`);
            throw error;
        }
        
    }

}