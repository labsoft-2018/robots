import { IComponentMap, System } from '@labsoft/common-js/components/system'
import { ConfigComponent, ENV, IConfigComponent } from './components/config'
import { S3Component, IS3Component } from '@labsoft/common-js/components/s3'
import { TokenComponent, ITokenComponent } from '@labsoft/common-js/components/token'
import * as AWS from 'aws-sdk'

export interface IComponents {
  config: IConfigComponent
  s3: IS3Component,
  token: ITokenComponent,
}
const componentMap: IComponentMap = {
  config: {
    instance: new ConfigComponent(ENV.dev),
    dependenciesList: [],
  },
  s3: {
    instance: new S3Component(new AWS.S3()),
    dependenciesList: [],
  },
  token: {
    instance: new TokenComponent(),
    dependenciesList: ['config', 's3'],
  },
}

export const mainSystem = new System<IComponents>(componentMap)
