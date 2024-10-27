# Telugu Movie Reviews 🎬📽️

An automated web application that provides Telugu movie reviews by top Telugu reviewers. The application retrieves review details from YouTube channels using the YouTube API and displays them in an iframe format. To minimize API calls, review data is periodically updated and stored in a database, ensuring efficient data access and updated content for users.

## Features

- **Automated Data Retrieval**: Uses the YouTube API to fetch review videos from top Telugu movie reviewers.
- **Periodic Data Update**: Minimizes API calls by storing review data in a database, with periodic updates to ensure fresh content.
- **Embedded Reviews**: Displays reviews in iframe format for a seamless user experience.
- **Beautiful CSS Design**: Crafted with custom CSS to provide a visually appealing and interactive interface.
- **Efficient Database Management**: Stores and updates data periodically, reducing dependency on frequent API calls.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js
- **Database**: SQLite (or your chosen database)
- **API**: YouTube Data API v3

## Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up API Key**:
    - Obtain your [YouTube Data API key](https://developers.google.com/youtube/v3/getting-started).
    - Create a `.env` file in the root directory:
      ```plaintext
      YOUTUBE_API_KEY=your_youtube_api_key
      ```

4. **Configure Database**:
    - The application uses an SQLite database by default.
    - Initialize the database if necessary (specific instructions here based on setup).

5. **Run the Application**:
    ```bash
    npm start
    ```

6. **Access the Application**:
    - Visit `http://localhost:3000` to view the app.

## Usage

1. **Homepage**: Displays reviews of the latest Telugu movies by top reviewers.
2. **Search**: Allows users to search for specific movies or reviewers.
3. **Update Interval**: Data is refreshed in the database periodically (customizable in the code), ensuring fresh content without excessive API calls.

## Contributing

Feel free to submit pull requests or open issues to help improve this application. Contributions are welcome!

## License

This project is licensed under the MIT License.

## Acknowledgments

- [YouTube Data API](https://developers.google.com/youtube/v3) for review content.
- Inspiration and feedback from the Telugu movie-watching community.

---

Happy viewing! 🎬
