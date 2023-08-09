import { Injectable } from "@nestjs/common";
import axios from 'axios';
import { TwitterOption } from "../utils/twitterOptions.util";

@Injectable()
export class TwitterService {

    async channelInfo(username: string, options: TwitterOption) {
        options.method = 'GET';
        options.url += `/by/username/:${username}`;
        options.params = {
            "user.fields": "id,name,username,description,location,url,created_at",
            "expansions": "pinned_tweet_id"
        };
        options.headers.authorization += process.env.TWITTER_BEARER_TOKEN;console.log(options)
        const response = await axios.request(options);
        return response;
    }

    async getFollowingList(userId: string, options: TwitterOption) {
        options.method = 'GET';
        options.url += `/:${userId}/following`;
        options.params = {
            "user.fields": "id, name, username, description, location, url, created_at",
            "expansions": "pinned_tweet_id"
        };
        options.headers.authorization += process.env.TWITTER_BEARER_TOKEN;
        const response = await axios.request(options)
        return response;
    }
}