import { Service } from 'typedi';
import { Note } from './note.entity';
import { User } from '../user/user.entity';
import { HttpError } from 'routing-controllers';
import { HttpCode } from '../infrastructure/http-code.enum';

@Service()
export class NoteAuthorizationService {
  /**
   * Validate for showing
   *
   * @param note
   * @param user
   *
   * @throws {HttpError}
   */
  public validateForShowing(note: Note | undefined, user: User | undefined): void {
    NoteAuthorizationService.checkForNoteExisting(note);

    if (!note!.isShared && note!.user.id !== user?.id) {
      throw new HttpError(HttpCode.UNAUTHORIZED, 'You doesn\'t have permissions.');
    }
  }

  /**
   * Validate for PATCH and DELETE requests.
   *
   * @param note
   * @param user
   *
   * @throws {HttpError}
   */
  public validateForChanging(note: Note | undefined, user: User): void {
    NoteAuthorizationService.checkForNoteExisting(note);

    if (note!.user.id !== user.id) {
      throw new HttpError(HttpCode.UNAUTHORIZED, 'You doesn\'t have permissions.');
    }
  }

  /**
   * Check for note existing.
   *
   * @param note
   */
  private static checkForNoteExisting(note: Note | undefined): void {
    if (!note) {
      throw new HttpError(HttpCode.NOT_FOUND, 'Note not found.');
    }
  }
}
