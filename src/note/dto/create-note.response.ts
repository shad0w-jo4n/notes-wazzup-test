import { Note } from '../note.entity';

export class CreateNoteResponse {
  public id!: number;

  public content!: string;

  public isShared!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;

  public static buildFromNote(note: Note): CreateNoteResponse {
    const response = new CreateNoteResponse();

    response.id = note.id;
    response.content = note.content;
    response.isShared = note.isShared;
    response.createdAt = note.createdAt;
    response.updatedAt = note.updatedAt;

    return response;
  }
}
