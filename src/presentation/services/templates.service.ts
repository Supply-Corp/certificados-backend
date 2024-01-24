import path from 'path';
import fs from 'fs';
import { CreateTemplateDto, CustomError, PaginationDto, TemplateEntity, UpdateTemplateDto } from "../../domain";
import { FileUploadService } from "./file-upload.service";
import { PaginationService } from './pagination.service';
import { States, TemplatesModel } from '../../domain/models';
import { Op } from 'sequelize';
import { UploadedFile } from 'express-fileupload';


export class TemplatesService {

    constructor(
        private fileUploadService: FileUploadService,
    ) {}

    async listTemplate( dto: PaginationDto ) {

        const { page, limit, search } = dto;

        const { count: total, rows: templates } = await TemplatesModel.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['id', 'DESC']],
            where: {
                state: States.ACTIVE,
                [Op.and]: [
                    {
                        ...(search && {
                            name: {
                                [Op.like]: `%${ search }%`
                            }
                        }),
                    },
                ],
            }
        })

        const pagination = PaginationService.get(page, limit, total, '/api/templates');

        return {
            ...pagination,
            templates: templates.map(TemplateEntity.fromObject)
        }
    }

    async allTemplate() {

        const data = await TemplatesModel.findAll({
            order: [['id', 'DESC']],
            where: { state: States.ACTIVE }
        });

        return {
            templates: data.map(TemplateEntity.fromObject)
        }
    }

    async getTemplate( id: number ) {

        const exist = await TemplatesModel.findOne({ where: { id } });
        if( !exist ) throw CustomError.notFound('El template solicitado no existe');

        if( exist.state === States.DELETED ) throw CustomError.notFound('El template solicitado no existe');

        return {
            ...TemplateEntity.fromObject(exist)
        }

    }

    async createTemplate( dto: CreateTemplateDto )  {
        
        const fileNames = await Promise.all(
            dto.files.map(item=> this.fileUploadService.singleUpload(item.file, 'templates'))
        );
        if( !fileNames ) throw CustomError.badRequest('Ocurrió un error al almacenar los templates')

        try {
            const template = await TemplatesModel.create({
                name: dto.name,
                certified: fileNames[0].fileName,
                certifiedConstancy: fileNames[1].fileName
            });

            return {
                ...TemplateEntity.fromObject(template)
            };

        } catch (error) {
            console.log(`template error = ${ error }`)
            fileNames.map(item => this.removeFile(item.fileName));
            throw CustomError.internalServe('Ocurrió un error al registrar el template')
        }

    }

    async updateTemplate( dto: UpdateTemplateDto ) {

        const exist = await TemplatesModel.findOne({ where: { id: dto.id } });
        if( !exist ) throw CustomError.notFound('El template no existe');

        if( exist.state === States.DELETED) throw CustomError.notFound('El template solicitado no existe');

        try {
            if( dto.files && dto.files?.length > 0 ) {

                if(dto.files.length === 1) {
                    const fileNm = dto.files[0].inputName;

                    const { fileName } = await this.fileUploadService.singleUpload( dto.files[0].file, 'templates');
                    if( !fileName ) throw CustomError.badRequest('No fue posible almacenar el documento');

                    if( fileNm === 'file' ) {
                        await this.removeFile(exist.certified);
                    } else if ( fileNm === 'file2' ) {
                        await this.removeFile(exist.certifiedConstancy);
                    }

                    const update = await exist.update({ where: { id: dto.id }, 
                        name: dto.name,
                        ...(fileNm === 'file' ? {
                            certified: fileName
                        } : {
                            certifiedConstancy: fileName
                        })
                    });

                    return {
                        ...TemplateEntity.fromObject(update)
                    }
                } else if ( dto.files.length === 2 ) {
                    const fileNames = await Promise.all(
                        dto.files.map(item=> this.fileUploadService.singleUpload(item.file, 'templates'))
                    );
                    if( !fileNames ) throw CustomError.badRequest('Ocurrió un error al almacenar los templates');

                    await this.removeFile(exist.certified);
                    await this.removeFile(exist.certifiedConstancy);

                    const template = await exist.update({
                        name: dto.name,
                        certified: fileNames[0].fileName,
                        certifiedConstancy: fileNames[1].fileName
                    });

                    return {
                        ...TemplateEntity.fromObject(template)
                    }
                }
            }
    
            const { id, ...template } = dto;
    
            const update = await exist.update({ where: { id: dto.id }, 
                name: template.name
            });
    
            return {
                ...TemplateEntity.fromObject(update)
            }
    
        } catch (error) {
            console.log(error)
            throw CustomError.internalServe('Ocurrió un error al actualizar el template');
        }

    }

    async deleteTemplate ( id: number ) {

        const exist = await TemplatesModel.findOne({ where: { id} });
        if( !exist ) throw CustomError.notFound('El template solicitado no existe');

        if( exist.state === States.DELETED) throw CustomError.notFound('El template solicitado no existe');

        try {
            const update = await exist.update({ 
                where: { id }, 
                state: 'DELETED'
            });
            
            return {
                ...TemplateEntity.fromObject(update)
            }
        } catch (error) {
            throw CustomError.internalServe(`${ error }`)
        }

    }

    async removeFile( fileName: string  ) {
        const pathFile = path.resolve(__dirname, `../../../public/templates/${ fileName }`);
        setTimeout(() => {
            if( fs.existsSync(pathFile) ){
                fs.unlinkSync(pathFile);
            }
        }, 500);

    }

}