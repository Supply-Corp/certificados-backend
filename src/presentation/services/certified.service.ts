import puppeteer from "puppeteer";
import { CustomError } from "../../domain";
import path from 'path';
import { envs } from "../../config";


export class CertifiedService {

    constructor() {}
    

    async generate() {

        const pathFile = path.resolve(__dirname, '../../../uploads/templates/1752e0b5-1aa0-4b1d-bfd3-1ce08c69c4a3.jpeg');
        console.log({ pathFile })
        const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    body {
                        background-image: url('${ envs.WEB_SERVICE_URL }/templates/1bd853cc-fb4a-4e60-b4df-afc445b11097.jpeg');
                        background-size: cover;
                    }
                </style>
            </head>
            <body>
                <div class="section">Some text</div>
            </body>
            </html>`;

        try {
            return await this.generatePDF(htmlContent, 'certified.pdf')
        } catch (error) {
            throw CustomError.internalServe(`${ error }`)
        }
    }


    async generatePDF(htmlContent: string, outputPath: string) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: outputPath, format: 'A4', printBackground: true, landscape: true });
        await browser.close();
    }
}