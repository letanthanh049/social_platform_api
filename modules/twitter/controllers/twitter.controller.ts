import { 
    Controller,
    Param,
    Get,
} from "@nestjs/common";
import { TwitterService } from "../services/twitter.service";
import { TwitterOption } from "../utils/twitterOptions.util";

@Controller('twitter')
export class TwitterController {
    constructor(private readonly twitterService: TwitterService) { }

    @Get('channel/info/:username')
    channelInfo(@Param('username') username: string) {
        const options = new TwitterOption;
        return this.twitterService.channelInfo(username, options);
    }

    @Get('channel/following/:userId')
    getFollowingList(@Param('userId') userId: string) {
        const options = new TwitterOption;
        return this.twitterService.getFollowingList(userId, options);
    }
}