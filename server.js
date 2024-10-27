const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;
const { fetchLatestVideos } = require('./fetchVideos');


// Serve static files from 'public' folder
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());


// Function to check if 4 hours have passed since the last fetch
async function checkAndUpdateVideos() {
    return new Promise((resolve, reject) => {
        db.get(`SELECT last_fetch FROM fetch_info WHERE id = 1`, async (err, row) => {
            if (err) return reject('Error fetching last fetch time.');

            const now = new Date();
            let shouldFetch = false;

            if (!row) {
                // If no fetch time exists, initialize the first fetch
                db.run(`INSERT INTO fetch_info (id, last_fetch) VALUES (1, ?)`, [now], (err) => {
                    if (err) return reject('Error initializing fetch time.');
                    shouldFetch = true;
                });
            } else {
                const lastFetchTime = new Date(row.last_fetch);
                const hoursPassed = Math.abs(now - lastFetchTime) / 36e5; // Convert milliseconds to hours
                //console.log(now);
                if (hoursPassed >= 4) {
                    shouldFetch = true;
                    // Update the last fetch time
                  
                    db.run(`UPDATE fetch_info SET last_fetch = ? WHERE id = 1`, [now], (err) => {
                        if (err) return reject('Error updating fetch time.');
                    });
                }
            }
            
            if (shouldFetch) {
                // Fetch the latest videos if 4 hours have passed
                //await fetchLatestVideos();
              try {
                console.log('hi');
                  await fetchLatestVideos();
              } catch (error) {
                  console.error('Error fetching latest videos:', error);
              }

            }
            resolve(); // Resolve the promise after checking/updating
        });
    });
}



// Route to get videos, check fetch time, and return videos
app.get('/api/videos', async (req, res) => {
    try {
      //console.log('hi');
        await checkAndUpdateVideos();
        

        db.all(`SELECT * FROM videos ORDER BY publishDate DESC`, [], (err, rows) => {
            if (err) {
                return res.status(500).send('Error fetching videos.');
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
