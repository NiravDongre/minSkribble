import { RedisClient } from "redis"



const client = () => {
    const redis = new RedisClient({
        url: "redis://redis:6379"
    })

    
}

export default client;
