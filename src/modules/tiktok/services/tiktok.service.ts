import { Injectable } from "@nestjs/common";
import axios from "axios";
import { TiktokOption } from "../utils/tiktokOptions.util";

@Injectable()
export class TiktokService {
    
    async channelInfo(username: string, options: TiktokOption) {
        options.method = 'GET',
        options.url += 'get-user'
        options.params = {
            username: username
        }
        const response = await axios.request(options);console.log(options);
        return response.data;
    }

    async getFollowingList(sec_user_id: string, pageNum: number, options: TiktokOption) {
        options.method = 'GET',
        options.url += 'list-following'
        options.params = {
            sec_user_id: sec_user_id,
            count: pageNum * 5
        }
        console.log(options);
        const response = await axios.request(options);
        return response.data;
    }
}
