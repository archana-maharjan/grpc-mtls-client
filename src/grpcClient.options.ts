import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as fs from "fs";
import { credentials } from '@grpc/grpc-js';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'hero',
    protoPath: join(__dirname, './hero/hero.proto'),
    credentials: credentials.createSsl(
      fs.readFileSync(join(process.cwd(), "certificates", "ca.cert")))
  },
};
