import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateApplicationCommand } from './commands/structs/create-application.command';
import { CreateApplicationRequestDto } from './dto/create-application-request.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateApplicationResponseDto } from './dto/create-application-response.dto';
import { GetApplicationResponseDto } from './dto/get-application-response.dto';
import { UpdateApplicationResponseDto } from './dto/update-application-response.dto';
import { UpdateApplicationRequestDto } from './dto/update-application-request.dto';
import { UpdateApplicationCommand } from './commands/structs/update-application.command';
import { GetApplicationParamsDto } from './dto/get-application-params.dto';
import { DeleteApplicationCommand } from './commands/structs/delete-application.command';
import {
  Flags,
  ModelBinding,
} from '../../../decorators/model-binding.decorator';
import { RestoreApplicationCommand } from './commands/structs/restore-application.command';

@Controller({
  path: 'api/v1/applications',
})
export class ApplicationsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @Get(':application')
  @ApiOkResponse({
    type: GetApplicationResponseDto,
  })
  @ApiNotFoundResponse()
  @ApiParam({ name: 'id', description: 'Application id', required: true })
  @ModelBinding()
  public getApplication(@Param() { application }: GetApplicationParamsDto) {
    return application;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The application has been successfully created.',
    type: CreateApplicationResponseDto,
  })
  public async createApplication(@Body() body: CreateApplicationRequestDto) {
    return await this.commandBus.execute<
      CreateApplicationCommand,
      CreateApplicationResponseDto
    >(new CreateApplicationCommand(body.name));
  }

  @Patch(':application')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'The application has been successfully updated.',
    type: UpdateApplicationResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Application id', required: true })
  @ModelBinding()
  public async updateApplication(
    @Param() { application }: GetApplicationParamsDto,
    @Body() body: UpdateApplicationRequestDto,
  ) {
    return await this.commandBus.execute<
      UpdateApplicationCommand,
      UpdateApplicationResponseDto
    >(new UpdateApplicationCommand(application, body.name));
  }

  @Delete(':application')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The application has been successfully deleted.',
  })
  @ApiParam({
    name: 'application',
    description: 'Application id',
    required: true,
  })
  @ModelBinding()
  public async deleteApplication(
    @Param()
    { application }: GetApplicationParamsDto,
  ) {
    await this.commandBus.execute<DeleteApplicationCommand>(
      new DeleteApplicationCommand(application),
    );
  }

  @Post(':application')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The application has been successfully restored.',
  })
  @ApiParam({
    name: 'application',
    description: 'Application id',
    required: true,
  })
  @ModelBinding(Flags.WITH_DELETED)
  public async restoreApplication(
    @Param()
    { application }: GetApplicationParamsDto,
  ) {
    await this.commandBus.execute<RestoreApplicationCommand>(
      new RestoreApplicationCommand(application),
    );
  }
}
