import { Note } from '../note.entity';
import { PaginationResult } from '../../infrastructure/pagination.result';

export class IndexNoteResponse extends PaginationResult<Note> {}
