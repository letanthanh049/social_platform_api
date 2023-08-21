import { 
    Controller,
    Param,
    Get,
} from "@nestjs/common";
import { TiktokService } from "../services/tiktok.service";
import { TiktokOption } from "../utils/tiktokOptions.util";

@Controller('tiktok')
export class TiktokController {
    constructor(private readonly tiktokService: TiktokService) { }

    @Get('channel/info/:username')
    channelInfo(@Param('username') username: string) {
        const options = new TiktokOption;
        return this.tiktokService.channelInfo(username, options);
    }

    @Get('channel/following/:sec_user_id/:pageNum?')
    getFollowingList(
        @Param('sec_user_id') sec_user_id: string,
        @Param('pageNum') pageNum = 1
    ) {
        const options = new TiktokOption;
        return this.tiktokService.getFollowingList(sec_user_id, pageNum, options);
    }
}