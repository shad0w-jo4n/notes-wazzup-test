import { Note } from '../note.entity';

export class NoteResponse {
  public id!: number;

  public content!: string;

  public isShared!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;

  public static buildFromNote(note: Note): NoteResponse {
    const response = new NoteResponse();

    response.id = note.id;
    response.content = note.content;
    response.isShared = note.isShared;
    response.createdAt = note.createdAt;
    response.updatedAt = note.updatedAt;

    return response;
  }
}
