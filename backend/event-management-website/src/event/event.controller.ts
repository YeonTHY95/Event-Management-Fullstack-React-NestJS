import { Body, Controller, Post, UploadedFile, UseInterceptors , Get} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEventDTO } from 'src/DTO/DTO';
import { EventService } from './event.service';
import { fileTypeFromBuffer } from 'file-type';

@Controller('event')
export class EventController {

    constructor(private eventService : EventService) {}

    @Post('add')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async addEvent(@UploadedFile() file: Express.Multer.File ,@Body() createEventDTO: CreateEventDTO) {
        // Logic to handle adding an event
        console.log('Event data received:', createEventDTO);
        console.log('Thumbnail Filename:', file.originalname);
        console.log('Thumbnail Info:', file);

        const newEvent = await this.eventService.addEventToDatabase(createEventDTO, file);

        if (!newEvent) {
            throw new Error('Failed to add event');
        }
        return { message: 'Event added successfully' };
    }

    @Get('getAllEvents')
async getAllEvents() {
    const events = await this.eventService.getAllEvents();

    const convertedEvents = await Promise.all(events.map(async event => {
        const mimeType = event.thumbnail ? (await fileTypeFromBuffer(event.thumbnail))?.mime : null;

        return {
            ...event,
            thumbnail: this.eventService.convertBufferToBase64(event.thumbnail as Uint8Array),
            mimeType: mimeType || 'image/png',
        };
    }));

    console.log("Converted Events: ", convertedEvents);

    return convertedEvents;
}
}
