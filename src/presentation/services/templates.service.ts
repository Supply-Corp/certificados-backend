import path from 'path';
import fs from 'fs';
import { CreateTemplateDto, CustomError, PaginationDto, TemplateEntity, UpdateTemplateDto } from "../../domain";
import { FileUploadService } from "./file-upload.service";
import { PaginationService } from './pagination.service';
import { States, TemplatesModel } from '../../domain/models';
import { Op } from 'sequelize';

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

        const { fileName } = await this.fileUploadService.singleUpload( dto.file, 'templates');
        if( !fileName ) throw CustomError.badRequest('No fue posible almacenar el documento');

        try {
            const template = await TemplatesModel.create({
                name: dto.name,
                file: fileName
            });

            return {
                ...TemplateEntity.fromObject(template)
            };

        } catch (error) {
            this.removeFile( fileName );
            throw CustomError.internalServe('Ocurrió un error al registrar el template')
        }

    }

    async updateTemplate( dto: UpdateTemplateDto ) {

        const exist = await TemplatesModel.findOne({ where: { id: dto.id } });
        if( !exist ) throw CustomError.notFound('El template no existe');

        if( exist.state === States.DELETED) throw CustomError.notFound('El template solicitado no existe');

        try {

            if( dto.file) {
                const { fileName } = await this.fileUploadService.singleUpload( dto.file, 'templates');
                if( !fileName ) throw CustomError.badRequest('No fue posible almacenar el documento');

                await this.removeFile(exist.file);

                const update = await exist.update({ where: { id: dto.id }, 
                    name: dto.name,
                    file: fileName
                });
    
                 
                return {
                    ...TemplateEntity.fromObject(update)
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
            
            await this.removeFile( exist.file );

            return {
                ...TemplateEntity.fromObject(update)
            }
        } catch (error) {
            throw CustomError.internalServe(`${ error }`)
        }

    }

    async removeFile( fileName: string  ) {
        const pathFile = path.resolve(__dirname, `../../../public/templates/${ fileName }`);
        console.log({pathFile})
        setTimeout(() => {
            if( fs.existsSync(pathFile) ){
                fs.unlinkSync(pathFile);
            }
        }, 500);

    }

}