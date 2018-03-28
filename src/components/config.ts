import { ILifecycle } from '@labsoft/common-js/components/lifecycle';
export enum ENV {
  dev,
  prod,
  test,
}

export interface IServices {
  auth: string
}

export interface IConfig {
  token: {
    issuer: string,
    audience: string,
    jwtDuration: string,
    bucketName: string,
    publicKeyPath: string,
    privateKeyPath: string,
  }
}

export interface IConfigComponent {
  getConfig(): IConfig
}
export class ConfigComponent implements IConfigComponent, ILifecycle {
  private config: IConfig
  private env: ENV

  constructor(env: ENV) {
    this.env = env
  }

  public getConfig() {
    return this.config
  }

  public start() {
    // TODO: Read from file!
    // TODO: Different configs for different envs
    console.log('[Config] Starting...')
    this.config = {
      token: {
        issuer: 'quack-pack',
        audience: 'user',
        jwtDuration: '30d',
        publicKeyPath: 'test/pubkey.pem',
        privateKeyPath: 'test/privkey.pem',
        bucketName: 'labsoft-secrets',
      },
    }
    console.log('[Config] Ok!')
  }
}