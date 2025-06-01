import { Injectable } from '@nestjs/common';
import { CreateEventDTO, DeleteEventDTO, UpdateEventDTO } from 'src/DTO/DTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EventService {

    constructor(private prismaService: PrismaService, private userService : UserService) {}

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

    async updateEventToDatabase(updateEventDTO: UpdateEventDTO, thumbnailFile: Express.Multer.File): Promise<any> {

        console.log('Inside update EventToDatabase, Event data received:', updateEventDTO);
        const event = await this.prismaService.event.update({
            where: {
              id : Number(updateEventDTO.eventID),
            },
            data : {
                name: updateEventDTO.eventName,
                startDate: new Date(updateEventDTO.startDate),
                endDate:  new Date(updateEventDTO.endDate),
                status:  updateEventDTO.status,
                location: updateEventDTO.location,
                thumbnail: thumbnailFile.buffer, // 🟢 This stores image bytes
                ownerId: Number(updateEventDTO.ownerId),
            }
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
                owner: false, 
            },
        });
        console.log('Events fetched successfully:');
        return events;
    }

    convertBufferToBase64(buffer: Uint8Array): string {
        return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
    }

    async deleteEvent(deleteEventDTO:DeleteEventDTO): Promise<boolean> {
        console.log('Inside deleteEvent, Event data received:', deleteEventDTO);

        const verifyPasswordResult = await this.userService.verifyPassword(deleteEventDTO.email,deleteEventDTO.password);
        if (!verifyPasswordResult) {
            throw new Error('Invalid email or password');
        }
        console.log('Password verified successfully:', verifyPasswordResult);

        deleteEventDTO.selectedEvents.forEach(async eventID => {
            console.log('Deleting event with ID:', eventID);
            if (isNaN(eventID)) {
                throw new Error(`Invalid event ID: ${eventID}`);
            }
            const deleteAction = await this.prismaService.event.delete({
                where: {
                    id: Number(eventID),
                },
            });

            if (!deleteAction) {
                throw new Error(`Failed to delete event with ID: ${eventID}`);
            }
            console.log(`Event with ID ${eventID} deleted successfully.`);
        });

        return true;
    }
}
