import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Service()
export class NoteService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
  ) {}

  public create(content: string, author: User, isShared: boolean): Promise<Note> {
    const note = this.noteRepository.create();

    note.content = content;
    note.user = author;
    note.isShared = isShared;

    return this.noteRepository.save(note);
  }
}
