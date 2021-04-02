import {
  Body,
  CurrentUser,
  Get,
  HttpCode as HttpCodeResponse,
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
import { NoteAuthorizationService } from './note-authorization.service';

@Service()
@JsonController('/note')
export class NoteController {
  /**
   * NoteController constructor.
   *
   * @param noteService
   * @param noteAuthorizationService
   */
  constructor(
    private readonly noteService: NoteService,
    private readonly noteAuthorizationService: NoteAuthorizationService,
  ) {}

  /**
   * Get list of user's notes.
   *
   * @param indexNoteRequest
   * @param user
   */
  @Get()
  public index(
    @QueryParams() indexNoteRequest: IndexNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<IndexNoteResponse> {
    return this.noteService.getUserNotes(user, indexNoteRequest.page, indexNoteRequest.limit);
  }

  /**
   * Get note.
   *
   * @param id
   * @param user
   */
  @Get('/:id')
  public async show(@Param('id') id: number, @CurrentUser() user?: User): Promise<NoteResponse> {
    const note = await this.noteService.getNoteById(id);

    this.noteAuthorizationService.validateForShowing(note, user);

    return NoteResponse.buildFromNote(note!);
  }

  /**
   * Create note.
   *
   * @param createNoteRequest
   * @param user
   */
  @Post()
  @HttpCodeResponse(HttpCode.CREATED)
  public async create(
    @Body() createNoteRequest: CreateNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<NoteResponse> {
    const note = await this.noteService.create(createNoteRequest.content, user, createNoteRequest.isShared);

    return NoteResponse.buildFromNote(note);
  }

  /**
   * Update note, also make shared.
   *
   * @param id
   * @param updateNoteRequest
   * @param user
   */
  @Patch('/:id')
  public async update(
    @Param('id') id: number,
    @Body() updateNoteRequest: UpdateNoteRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<NoteResponse> {
    const note = await this.noteService.getNoteById(id);

    this.noteAuthorizationService.validateForChanging(note, user);

    return NoteResponse.buildFromNote(await this.noteService.update(note!.id, updateNoteRequest));
  }
}
