export class TwitterOption {
    method?: string
    url = 'https://api.twitter.com/2/users'
    params?: object
    headers: {
        'User-Agent': string;
        'authorization': string;
    } = {
        'User-Agent': 'v2TweetLookupJS',
        'authorization': 'Bearer '
    }
}