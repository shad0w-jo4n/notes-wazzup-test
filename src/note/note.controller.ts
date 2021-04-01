import { Body, CurrentUser, Get, JsonController, Post, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { NoteService } from './note.service';
import { User } from '../user/user.entity';
import { CreateNoteRequest } from './dto/create-note.request';
import { CreateNoteResponse } from './dto/create-note.response';
import { IndexNoteRequest } from './dto/index-note.request';
import { IndexNoteResponse } from './dto/index-note.response';

@Service()
@JsonController('/note')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
  ) {}

  @Get()
  public index(
    @QueryParams() indexNoteRequest: IndexNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<IndexNoteResponse> {
    return this.noteService.getUserNotes(user, indexNoteRequest.page, indexNoteRequest.limit);
  }

  @Post()
  public async create(
    @Body() createNoteRequest: CreateNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<CreateNoteResponse> {
    const note = await this.noteService.create(createNoteRequest.content, user, createNoteRequest.isShared);

    return CreateNoteResponse.buildFromNote(note);
  }
}
