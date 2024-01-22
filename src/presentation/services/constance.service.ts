import path from 'path';
import fs from 'fs';
import puppeteer from "puppeteer";
import { CustomError, numeroALetras } from "../../domain";
import { envs } from "../../config";
import { UserCoursesModel } from "../../domain/models";
import dayjs from 'dayjs';
import QRCode from 'qrcode'
import 'dayjs/locale/es';
dayjs.locale('es')

export class ConstancyService {

    constructor() {}
    
    async generate(certified: UserCoursesModel) {

        const template = certified.template?.certifiedConstancy;

        const dayNow = dayjs().format('DD');
        const monthNow = dayjs().format('MMMM');
        const yearNow = dayjs().format('YYYY');

        const yearNowText = numeroALetras(+yearNow);

        const pathFileGreat = path.resolve(__filename, '../great-vibes.font.txt');
        const greatVibesFont = fs.readFileSync(pathFileGreat, { encoding: 'utf-8' });

        const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    @import url('https://fonts.institutoelevateperu.com/fuente/fonts.css?family=YugothB');
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
                        margin-top: 200px;
                        color: #a47517;
                        font-family: "Times New Roman", Times, serif;
                        font-weight: 100;
                    }
                    .p-one {
                        display: block;
                        max-width: 620px;
                        text-align: justify!important;
                        margin: auto;
                        margin-top: 280px;
                        text-align: left;
                        font-size: 16px;
                    }
                    h2 {
                        max-width: 650px;
                        font-size: 34px;
                        margin: auto;
                        margin-top: 15px;
                        font-family: "Great Vibes";
                        line-height: 40px;
                    }
                    .p-two {
                        display: block;
                        max-width: 620px;
                        text-align: justify!important;
                        text-align: left;
                        font-size: 18px;
                        margin: auto;
                        margin-top: 18px;
                    }
                    h3 {
                        max-width: 800px;
                        font-size: 30px;
                        margin: auto;
                        margin-top: 30px;
                        height: fit-content;
                        font-weight: 400;
                        text-align: center;
                    }
                    .p-four {
                        max-width: 620px;
                        display: block;
                        margin: 10px auto 0;
                        text-align: right;
                    }
                    .modules-box {
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <h1>${' '}</h1>
                <p class="p-one">La Dirección Académica de Instituto de Especialización Profesional ELEVATE PERÚ, hace constar que ${ certified.user?.name } ${ certified.user?.lastName } con documento de identidad N° ${ certified.user?.documentNumber }, concluyó satisfactoriamente el Diploma de Alta Especialización en:</p>
                <h2>${ certified.course?.name }</h2>

                <div class="modules-box">
                    ${ certified.modules?.map(item => `<p class="p-two"> ${ item.name } </p>`).join('') }
                </div>

                <h3>${ certified.points }</h3>
                <p class="p-four">Lima, a los ${ dayNow} días del mes de ${ monthNow } del año ${ yearNowText } </p>
            </body>
        </html>`;

        try {

            return await this.generatePDF(htmlContent, `public/constancy/${certified.identifier}.pdf`, certified.identifier)

        } catch (error) {
            console.log(`${error}`)

            throw CustomError.internalServe(`${ error }`)
        }
    }

    async generatePDF(htmlContent: string, outputPath: string, identifier: string) {

        const destination = path.resolve(__dirname, '../../../public/constancy');

        if(!fs.existsSync( destination )) fs.mkdirSync( destination );
        
        const browser = await puppeteer.launch({ 
            headless: 'new',
            args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] 
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
        await page.pdf({ 
            path: outputPath, 
            format: 'A4', 
            printBackground: true, 
        });
        await browser.close();

        return `${identifier}.pdf`
    }
}