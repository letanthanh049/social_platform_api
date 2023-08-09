import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class YoutubeSerivce {

    async channelInfo(channelId: any) {
        const baseUrl = 'https://www.googleapis.com/youtube/v3/channels';
        const url = `${baseUrl}?part=snippet&id=${channelId}&key=${process.env.GOOGLE_API_SECRET}`;
        const respone = await axios.get(url);
        return respone.data;
    }

    async getChannelVideos(channelId: any) {
        const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
        const url = `${baseUrl}?part=snippet&channelId=${channelId}&key=${process.env.GOOGLE_API_SECRET}`;
        const respone = await axios.get(url);
        return respone.data;
    }

    async getChannelSupscriptions(channelId: string, pageNum: number) {
        const maxResults = pageNum * 5;
        const baseUrl = 'https://www.googleapis.com/youtube/v3/subscriptions';
        const url = `${baseUrl}?part=snippet&channelId=${channelId}&maxResults=${maxResults}&key=${process.env.GOOGLE_API_SECRET}`;
        const ChannelSupscriptions = await axios.get(url);
        return ChannelSupscriptions.data;
    }
}