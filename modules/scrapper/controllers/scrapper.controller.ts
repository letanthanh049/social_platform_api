import { 
    Controller,
    Get
} from "@nestjs/common";
import { ScrapperService } from "../services/scrapper.service";

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly scrapperService: ScrapperService) { }

    @Get('fetch-data')
    getDataFromWebsite() {
        return this.scrapperService.getDataFromWebsite();
    }
}