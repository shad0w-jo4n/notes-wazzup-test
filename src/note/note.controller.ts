import { Body, CurrentUser, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { NoteService } from './note.service';
import { User } from '../user/user.entity';
import { CreateNoteRequest } from './dto/create-note.request';
import { CreateNoteResponse } from './dto/create-note.response';

@Service()
@JsonController('/note')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
  ) {}

  @Post()
  public async create(
    @Body() createNoteRequest: CreateNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<CreateNoteResponse> {
    const note = await this.noteService.create(createNoteRequest.content, user, createNoteRequest.isShared);

    return CreateNoteResponse.buildFromNote(note);
  }
}
