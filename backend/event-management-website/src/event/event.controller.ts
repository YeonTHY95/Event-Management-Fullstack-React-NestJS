import { Controller, Post } from '@nestjs/common';

@Controller('event')
export class EventController {

    @Post('add')
    async addEvent() {
        // Logic to handle adding an event
        return { message: 'Event added successfully' };
    }
}
