una vez clonado el repositorio:

0 - acceda a la carpeta del proyecto clonado. </br>
1 - instale las dependencias del proyecto ejecutando el comando: npm install </br>
2 - cree un archivo llamado .env y pegue el contenido del archivo .env.template (punto 10 como crear archivo) </br>
2.2 - complete el .env con la información necesaria. </br>
3 - ejecute el comando: npm run build </br>
4 - ejecute el comando: npm run prepare </br>

5 - instale pm2 con el siguiente comando: npm i -g pm2 </br>
6 - asegúrese de que se creó una carpeta /dist en la raíz del proyecto </br>
7 - ejecute el comando: pm2 start dist/app.js </br>
8 - ejecute el comando: pm2 logs </br>
9 - asegúrese de que no haya un error en la consola de logs </br>

</br>
</br>
10 - escriba: nano + "nombre del archivo a crear" ejemplo: nano .env