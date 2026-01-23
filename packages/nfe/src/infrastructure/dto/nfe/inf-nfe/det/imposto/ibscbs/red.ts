import { Red as IRed } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/red'
import { IsString } from 'class-validator'

export class Red implements IRed {
  @IsString()
  public pAliqEfet!: string

  @IsString()
  public pRedAliq!: string
}
