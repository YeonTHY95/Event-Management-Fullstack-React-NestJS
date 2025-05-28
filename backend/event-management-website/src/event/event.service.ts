import { Injectable } from '@nestjs/common';
import { CreateEventDTO } from 'src/DTO/DTO';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {

    constructor(private prismaService: PrismaService) {}

    async addEventToDatabase(createEventDTO: CreateEventDTO, thumbnailFile: Express.Multer.File): Promise<any> {

        console.log('Inside addEventToDatabase, Event data received:', createEventDTO);
        const event = await this.prismaService.event.create({
            data: {
              name: createEventDTO.eventName,
              startDate: new Date(createEventDTO.startDate),
              endDate: createEventDTO.endDate ? new Date(createEventDTO.endDate) : null,
              location: createEventDTO.location,
              thumbnail: thumbnailFile.buffer, // 🟢 This stores image bytes
              ownerId: Number(createEventDTO.ownerId), 
            },
          });

        if (event) {
            console.log('Event added successfully:', event);
            return event;
        }
        throw new Error('Failed to add event');
    }

    async getAllEvents(): Promise<any[]> {
        console.log('Fetching all events from the database');
        const events = await this.prismaService.event.findMany({
            include: {
                owner: true, // Include owner details if needed
            },
        });
        console.log('Events fetched successfully:', events);
        return events;
    }

    convertBufferToBase64(buffer: Uint8Array): string {
        return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
    }
}
