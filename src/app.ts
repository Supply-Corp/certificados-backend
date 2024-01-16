import { envs } from "./config";
import { DatabaseConfig } from "./data/database";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

function main() {

    const { PORT, PUBLIC_PATH } = envs;

    DatabaseConfig.testConnection()
    
    const server = new Server({
      port: PORT, 
      public_path: PUBLIC_PATH 
    });
    
    server.start();

}