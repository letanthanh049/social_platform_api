import { 
    Controller,
    Get,
    Param,
} from "@nestjs/common";
import { YoutubeSerivce } from "../services/youtube.service";

@Controller('youtube')
export class YoutubeController {
    constructor(private readonly youtubeService: YoutubeSerivce) { }

    @Get('channel/info/:channelId') 
    channelInfo(@Param('channelId') channelId: any) {
        return this.youtubeService.channelInfo(channelId);
    }

    @Get('channel/videos/:channelId') 
    getChannelVideos(@Param('channelId') channelId: any) {
        return this.youtubeService.getChannelVideos(channelId);
    }

    @Get('channel/subscriptions/:channelId/:pageNum?') 
    getChannelSubscriptions(
        @Param('channelId') channelId: any,
        @Param('pageNum') pageNum = 1
    ) {
        return this.youtubeService.getChannelSupscriptions(channelId, pageNum);
    }
}