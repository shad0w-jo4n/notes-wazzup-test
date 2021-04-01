import { IsBoolean, Length } from 'class-validator';

export class CreateNoteRequest {
  @Length(1, 1000)
  public content!: string;

  @IsBoolean()
  public isShared: boolean = false;
}
