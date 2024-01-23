import path from 'path';
import fs from 'fs';
import puppeteer from "puppeteer";
import { CustomError, UserCoursesEntity, numeroALetras } from "../../domain";
import { envs } from "../../config";
import { UserCoursesModel } from "../../domain/models";
import dayjs from 'dayjs';
import QRCode from 'qrcode'
import 'dayjs/locale/es';
import { Op } from 'sequelize';
dayjs.locale('es')


export class CertifiedService {

    constructor() {}

    async generate(certified: UserCoursesModel) {

        const template = certified.template?.certified;

        const dayInit = dayjs(certified.course?.initialDate).format('DD');
        const monthInit = dayjs(certified.course?.initialDate).format('MMMM');

        const dayEnd = dayjs(certified.course?.endDate).format('DD');
        const monthEnd = dayjs(certified.course?.endDate).format('MMMM');
        const yearEnd = dayjs(certified.course?.endDate).format('YYYY');

        const dayNow = dayjs().format('DD');
        const monthNow = dayjs().format('MMMM');
        const yearNow = dayjs().format('YYYY');


        const qr = await QRCode.toDataURL(`${ envs.WEB_SERVICE_URL }/search-certificates?cert=${ certified.identifier }`)
        const hours = numeroALetras(certified.hours);

        const pathFile = path.resolve(__filename, '../vivaldi.font.txt');
        const pathFileGreat = path.resolve(__filename, '../great-vibes.font.txt');

        const vivaldiFont = fs.readFileSync(pathFile, { encoding: 'utf-8' });
        const greatVibesFont = fs.readFileSync(pathFileGreat, { encoding: 'utf-8' });


        const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    @font-face {
                        font-family: 'Vivaldi';
                        src: url(data:font/truetype;charset=utf-8;base64,${vivaldiFont}) format('truetype');
                        font-weight: normal;
                        font-style: normal;
                    }
                    @font-face {
                        font-family: 'Great Vibes';
                        src: url(data:font/truetype;charset=utf-8;base64,${greatVibesFont}) format('truetype');
                        font-weight: normal;
                        font-style: normal;
                    }

                    body {
                        background-image: url('${ envs.WEB_SERVICE_URL }/templates/${ template }');
                        background-size: cover;
                        text-align: center;
                        margin: 0;
                        padding:0;
                    }
                    img {
                        margin-top: 60px;
                    }
                    .section {
                        display: block;
                        font-size: 12px;
                    }
                    h1 {
                        font-size: 68px;
                        margin-top: 0;
                        color: #a47517;
                        font-family: "Times New Roman", Times, serif;
                        font-weight: 100;
                    }
                    .p-one {
                        display: block;
                        max-width: 830px;
                        text-align: justify!important;
                        margin: 100px auto 0;
                        text-align: left;
                        font-size: 16px;
                    }
                    h2 {
                        font-size: 56px;
                        margin-top: 10px;
                        text-transform: capitalize;
                        font-family: 'Vivaldi'!important;
                        font-weight: 300;
                    }
                    .p-two {
                        display: block;
                        max-width: 830px;
                        text-align: justify!important;
                        margin: auto;
                        margin-top: -40px;
                        margin-bottom: 10px;
                        text-align: left;
                        font-size: 16px;
                    }
                    h3 {
                        max-width: 830px;
                        font-size: 40px;
                        margin-top: 20px;
                        margin: auto;
                        height: fit-content;
                        line-height: 50px;
                        font-family: 'Great Vibes';
                        
                    }
                    .p-tree {
                        display: block;
                        max-width: 830px;
                        text-align: justify!important;
                        margin: 10px auto 0;
                        text-align: left;
                        font-size: 16px;
                    }
                    .p-four {
                        max-width: 830px;
                        display: block;
                        margin: 20px auto 0;
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <img src="${ qr }" width="60" height="60" />
                <span class="section">${ certified.identifier.split('-')[4] }</span>
                <h1>${' '}</h1>
                <p class="p-one">Los que suscriben, la Directora Ejecutiva y la Coordinadora Académica del Instituto de Especialización
                Profesional ELEVATE PERÚ, otorgan el presente diploma a</p>
                <h2>${ certified.user?.name } ${ certified.user?.lastName }</h2>
                <p class="p-two">En mérito de haber culminado satisfactoriamente y aprobado el Diploma de Alta Especialización
                Profesional en:</p>
                <h3>${ certified.course?.name }</h3>
                <p class="p-tree">Realizado del ${ dayInit } de ${ monthInit } al ${ dayEnd } de ${ monthEnd } del ${yearEnd}, con una duración total de ${ hours } (${ certified.hours })
                horas académicas lectivas, cumpliendo con los requisitos académicos exigidos por el respectivo
                diploma de alta especialización.</p>

                <p class="p-four">Lima, a los ${ dayNow} días del mes de ${ monthNow } del año ${ yearNow } </p>
            </body>
            </html>`;

        try {
            return await this.generatePDF(htmlContent, `public/certified/${certified.identifier}.pdf`, certified.identifier)
        } catch (error) {
            console.log(`${error}`)

            throw CustomError.internalServe(`${ error }`)
        }
    }

    async generatePDF(htmlContent: string, outputPath: string, identifier: string) {

        const destination = path.resolve(__dirname, '../../../public/certified');

        if(!fs.existsSync( destination )) fs.mkdirSync( destination );
        
        const browser = await puppeteer.launch({ 
            headless: 'new',
            args: [ '--disable-gpu', '--disable-setuid-sandbox','--disable-web-security', '--no-sandbox', '--no-zygote' ] 
        });
        
        const page = await browser.newPage();
        await page.waitForFunction('document.fonts.ready');
        await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
        await page.pdf({ 
            path: outputPath, 
            format: 'A4', 
            printBackground: true, 
            landscape: true 
        });
        await browser.close();

        return `${identifier}.pdf`
    }

    async search( search: string ) {

        const course = await UserCoursesModel.findOne({ 
            where: {
                ...( search.length <= 12 ? {
                    identifier: {
                        [Op.endsWith]: `${ search }`
                    }
                } : {
                    identifier: search
                })
            },
            include: ['user', 'course']
        });
        if( !course ) throw CustomError.notFound('No se encontró ningún certificado');

        try {

            const cleanCourse = course.toJSON();
            const { password, recoveryPassword, role, ...user } = cleanCourse.user;
            cleanCourse.user = user;

            return UserCoursesEntity.fromObject(cleanCourse);
        } catch (error) {
            console.log(`${ error }`);
            throw CustomError.badRequest(`${ error }`);
        }

    }
}