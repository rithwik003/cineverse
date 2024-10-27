const fetch = require('node-fetch');
const db = require('./database');

const API_KEY = 'AIzaSyABe4Nr4isDly6AXGxgkMDxxNjnN3d8bRo'; // Replace with your YouTube API key
const API_KEY1='AIzaSyDcvEAUNRgeM_Bcuo8zwt81cCq8Wqj_aJI';
const CHANNEL_IDS = [
    'UCgHmVF2DHE6JI90x0NwESuQ',
    'UCIIIR-lkJcM6Pi2N7-TxbRA',
    'UCs55OZ6PkvIjwtyyqEFk8JQ',
    'UC7ZEIf22kp0AEpvx3OLiX-g',
    'UC1RIUWZZ2QCk-jRz3FGvhag',
    'UCRvTQgaKQ4AKsxKf0rZUtuQ',
    'UC-qTldS8DNIGOfIVc0G8t-w',
    'UCo1oi6iPsxjo84aVkq7XjhA'
];
const MAX_RESULTS = 5;

async function fetchLatestVideos() {
    console.log('function');
    const videoPromises = CHANNEL_IDS.map(async (channelId) => {
        try {
            const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;
            const response = await fetch(url);
            const data = await response.json();
            
            // Check if the response contains the items array
            if (data.items && Array.isArray(data.items)) {
                console.log('fetched');
                return data.items.map(item => ({
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                    publishDate: item.snippet.publishedAt
                }));
            } else {
                console.error(`No videos found for channelId: ${channelId}`, data);
                return []; // Return an empty array if no items found
            }
        } catch (error) {
            console.error(`Failed to fetch videos for channelId: ${channelId}`, error);
            return []; // Return an empty array if there's an error
        }
    });

    const newVideos = (await Promise.all(videoPromises)).flat();

    // Filter videos with "review" in the title
    const reviewVideos = newVideos.filter(video => 
        video.title.toLowerCase().includes('review')
    );

    // Store videos in the database
    for (const video of reviewVideos) {
        await storeVideo(video);
    }
}
module.exports = { fetchLatestVideos };

async function storeVideo(video) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT OR IGNORE INTO videos (videoId, title, publishDate) VALUES (?, ?, ?)`, [video.videoId, video.title, video.publishDate], function(err) {
            if (err) {
                return reject(err);
            }
            // Check if we need to remove the oldest video if limit exceeds
            removeOldestIfNeeded();
            resolve();
        });
    });
}

// function removeOldestIfNeeded() {
//     db.all(`SELECT COUNT(*) AS count FROM videos`, [], (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             return;
//         }
//         const count = rows[0].count;

//         if (count >= 40) {
//           console.log('check');
//             db.run(`DELETE FROM videos ORDER BY publishDate ASC LIMIT 1`, (err) => {
//                 if (err) {
//                     console.error(err.message);
//                 }
//             });
//         }
//     });
// }
function removeOldestIfNeeded() {
    db.all(`SELECT COUNT(*) AS count FROM videos`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        const count = rows[0].count;

        if (count >= 40) {
            db.get(`SELECT id FROM videos ORDER BY publishDate ASC LIMIT 1`, [], (err, row) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                if (row) {
                    db.run(`DELETE FROM videos WHERE id = ?`, [row.id], (err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                }
            });
        }
    });
}




