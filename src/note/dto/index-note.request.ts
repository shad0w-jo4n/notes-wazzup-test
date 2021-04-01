import { IsInt, Min } from 'class-validator';

export class IndexNoteRequest {
  @IsInt()
  @Min(1)
  public page: number = 1;

  @IsInt()
  @Min(1)
  public limit: number = 10;
}
