import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { PaginationResult } from '../infrastructure/pagination.result';

@Service()
export class NoteService {
  /**
   * NoteService constructor.
   *
   * @param noteRepository
   */
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
  ) {}

  /**
   * Get note by id.
   *
   * @param id
   */
  public getNoteById(id: number): Promise<Note | undefined> {
    return this.noteRepository.findOne(id, {
      relations: ['user'],
      loadEagerRelations: true,
    });
  }

  /**
   * Get user's notes.
   *
   * @param user
   * @param page
   * @param limit
   */
  public async getUserNotes(user: User, page: number = 1, limit: number = 10): Promise<PaginationResult<Note>> {
    const [ items, count ] = await this.noteRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        user,
      },
    });

    return new PaginationResult<Note>(count, items);
  }

  /**
   * Create note.
   *
   * @param content
   * @param author
   * @param isShared
   */
  public create(content: string, author: User, isShared: boolean): Promise<Note> {
    const note = this.noteRepository.create();

    note.content = content;
    note.user = author;
    note.isShared = isShared;

    return this.noteRepository.save(note);
  }

  /**
   * Update note.
   *
   * @param id
   * @param values
   */
  public update(id: number, values: Partial<Note>): Promise<Note> {
    return this.noteRepository.save({
      id,
      ...values,
    });
  }
}
