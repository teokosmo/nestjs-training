import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository, Like } from 'typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    private readonly eventsService: EventsService
  ) {}

  @Get()
  async findAll() {
    this.logger.log(`findAll route`);
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get('practice2')
  async practice2() {
    const event = await this.repository.findOne({
      where: { id: 1 },
      relations: ['attendees'],
    });

    const attendee = new Attendee();
    attendee.name = 'Attende using cascade';

    event.attendees.push(attendee);
    await this.repository.save(event);

    return event;
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-01T10:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2,
      // skip: 1,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    console.log(typeof id);
    // const event = await this.repository.findOneBy({ id });
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException();
    }

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.repository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException();
    }

    await this.repository.remove(event);
  }
}
