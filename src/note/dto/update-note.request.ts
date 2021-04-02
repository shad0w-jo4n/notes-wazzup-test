import { IsBoolean, IsOptional, Length } from 'class-validator';

export class UpdateNoteRequest {
  @IsOptional()
  @Length(1, 1000)
  public content?: string;

  @IsOptional()
  @IsBoolean()
  public isShared?: boolean;
}
