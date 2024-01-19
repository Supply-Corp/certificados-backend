import path from 'path';
import fs from 'fs';
import puppeteer from "puppeteer";
import { CustomError } from "../../domain";
import { envs } from "../../config";
import { UserCoursesModel } from "../../domain/models";
import dayjs from 'dayjs';
import QRCode from 'qrcode'
import 'dayjs/locale/es';
dayjs.locale('es')

export class CertifiedService {

    constructor() {}
    
    async generate(certified: UserCoursesModel) {

        console.log(certified)
        const template = certified.template?.certified;

        const dayInit = dayjs(certified.course?.initialDate).format('DD');
        const monthInit = dayjs(certified.course?.initialDate).format('MMMM');

        const dayEnd = dayjs(certified.course?.endDate).format('DD');
        const monthEnd = dayjs(certified.course?.endDate).format('MMMM');
        const yearEnd = dayjs(certified.course?.endDate).format('YYYY');

        const qr = await QRCode.toDataURL(certified.identifier)

        const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    @import url('https://fonts.googleapis.com/css?family=Great+Vibes');

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
                        font-size: 70px;
                        margin-top: 0;
                        color: #a47517;
                    }
                    .p-one {
                        display: block;
                        max-width: 830px;
                        text-align: justify;
                        margin: -50px auto 0;
                        text-align: left;
                        font-size: 20px;
                    }
                    h2 {
                        font-size: 60px;
                        margin-top: 10px;
                        text-transform: capitalize;
                        font-family: 'Great Vibes';
                    }
                    .p-two {
                        display: block;
                        max-width: 830px;
                        text-align: justify;
                        margin: -50px auto 0;
                        text-align: left;
                        font-size: 20px;
                    }
                    h3 {
                        max-width: 800px;
                        font-size: 45px;
                        margin-top: 0px;
                        margin: auto;
                        height: fit-content;
                    }
                    .p-tree {
                        display: block;
                        max-width: 830px;
                        text-align: justify;
                        margin: 0px auto 0;
                        text-align: left;
                        font-size: 20px;
                    }
                </style>
            </head>
            <body>
                <img src="${ qr }" width="60" height="60" />
                <span class="section">${ certified.identifier.split('-')[4] }</span>
                <h1>DIPLOMA</h1>
                <p class="p-one">Los que suscriben, la Directora Ejecutiva y la Coordinadora Académica del Instituto de Especialización
                Profesional ELEVATE PERÚ, otorgan el presente diploma a</p>
                <h2>${ certified.user?.name } ${ certified.user?.lastName }</h2>
                <p class="p-two">En mérito de haber culminado satisfactoriamente y aprobado el Diploma de Alta Especialización
                Profesional en:</p>
                <h3>${ certified.course?.name }</h3>
                <p class="p-tree">Realizado del ${ dayInit } de ${ monthInit } al ${ dayEnd } de ${ monthEnd } del ${yearEnd}, con una duración total de cien (${ certified.hours })
                horas académicas lectivas, cumpliendo con los requisitos académicos exigidos por el respectivo
                diploma de alta especialización.</p>
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
            headless: false,
         });
        const page = await browser.newPage();
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
}