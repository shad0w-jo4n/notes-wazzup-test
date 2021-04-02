import {
  Body,
  CurrentUser,
  Get,
  HttpCode as HttpCodeResponse,
  HttpError,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams
} from 'routing-controllers';
import { Service } from 'typedi';
import { NoteService } from './note.service';
import { User } from '../user/user.entity';
import { CreateNoteRequest } from './dto/create-note.request';
import { NoteResponse } from './dto/note.response';
import { IndexNoteRequest } from './dto/index-note.request';
import { IndexNoteResponse } from './dto/index-note.response';
import { HttpCode } from '../infrastructure/http-code.enum';
import { UpdateNoteRequest } from './dto/update-note.request';

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

  @Get('/:id')
  public async show(@Param('id') id: number, @CurrentUser() user?: User): Promise<NoteResponse> {
    const note = await this.noteService.getNoteById(id);

    if (!note) {
      throw new HttpError(HttpCode.NOT_FOUND, 'Note not found.');
    }

    if (!note.isShared && note.user.id !== user?.id) {
      throw new HttpError(HttpCode.UNAUTHORIZED, 'You doesn\'t have permissions.');
    }

    return NoteResponse.buildFromNote(note);
  }

  @Post()
  @HttpCodeResponse(HttpCode.CREATED)
  public async create(
    @Body() createNoteRequest: CreateNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<NoteResponse> {
    const note = await this.noteService.create(createNoteRequest.content, user, createNoteRequest.isShared);

    return NoteResponse.buildFromNote(note);
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: number,
    @Body() updateNoteRequest: UpdateNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<NoteResponse> {
    const note = await this.noteService.getNoteById(id);

    if (!note) {
      throw new HttpError(HttpCode.NOT_FOUND, 'Note not found.');
    }

    if (note.user.id !== user.id) {
      throw new HttpError(HttpCode.UNAUTHORIZED, 'You doesn\'t have permissions.');
    }

    return NoteResponse.buildFromNote(await this.noteService.update(note.id, updateNoteRequest));
  }
}
