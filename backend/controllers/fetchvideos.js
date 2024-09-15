const redis = require("redis");
const Video = require("../models/video");

// Create a Redis client
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

// Connect to the Redis server
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
})();

exports.fetchallvideos = async (req, res) => {
  console.log("API call to fetch all videos");
  const cacheKey = "videos";

  try {
    const cachevideos = await redisClient.get(cacheKey);

    // if (cachevideos) {
    //   console.log("Serving from cache");
    //   return res.status(200).json(JSON.parse(cachevideos)); // Parse the cached string data back to JSON
    // }

    // If cache miss, fetch from the database
    const videos = await Video.find(
      {},
      { thumbnail: 1, title: 1, views: 1, uploadDate: 1 }
    );
    console.log("Fetched from DB: ", videos);

    // Store the fetched data in Redis cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(videos));

    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos: ", error);
    return res.status(500).send("Internal Server Error");
  }
};
