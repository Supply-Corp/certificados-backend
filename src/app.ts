import { envs } from "./config/adapters/envs.adapter";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

function main() {

    const { PORT, PUBLIC_PATH } = envs;

    const server = new Server({
        port: PORT, 
        public_path: PUBLIC_PATH 
    });
    
    server.start();

}