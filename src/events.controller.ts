import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { identity } from 'rxjs';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'first event' },
      { id: 2, name: 'second event' },
    ];
  }
  @Get(':id')
  findOne(@Param('id') id) {
    return id;
  }
  @Post()
  create(@Body() input) {
    return input;
  }
  @Patch(':id')
  update(@Param('id') id, @Body() input) {}
  @Delete(':id')
  remove(@Param('id') id) {}
}
