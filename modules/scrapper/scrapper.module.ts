import { Module } from '@nestjs/common';
import { ScrapperSchema } from './schema/scrapper.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapperController } from './controllers/scrapper.controller';
import { ScrapperService } from './services/scrapper.service';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Scrapper', schema: ScrapperSchema}])],
    controllers: [ScrapperController],
    providers: [ScrapperService]
})
export class ScrapperModule {}