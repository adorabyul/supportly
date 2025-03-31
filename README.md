# An AI-driven Customer Support Chatbot - Proof of Concept


This is a proof of concept chatbot built using Node.js, Express, Vue.js, MySQL, and integrates OpenAI’s GPT-3.5 (ChatGPT), Whisper (for audio transcription), and text-embedding-ada-002 (for semantic text embeddings). While the chatbot mimics a customer support interface, it is not intended for real customer service use. This project is built to demonstrate my skills and the potential of using AI models for conversational interactions.

## Features

  * Chatbot Powered by OpenAI: The chatbot utilizes OpenAI's ChatGPT API to provide intelligent and natural conversation flow with users.

  * Audio Transcription with Whisper: Users can send audio recordings, which are transcribed using OpenAI’s Whisper model.

  * FAQ Integration: Frequently asked questions are stored in the MySQL database. The chatbot checks new user queries against these stored FAQs using text embeddings before calling OpenAI's API.

  * Efficiency: By leveraging text embeddings, the chatbot reduces unnecessary API calls for common questions, improving efficiency and lowering token costs.

## Technologies Used

  * Node.js & Express: Backend server.

  * Vue.js: Frontend user interface.

  * MySQL: Database for storing FAQs and their corresponding text embeddings.

  * OpenAI APIs:

     * ChatGPT: For generating responses to user queries.

     * Whisper: For transcribing audio recordings to text.

     * text-embedding-ada-002: For converting text into vectors and comparing user input with stored FAQ vectors.
       
  * WebSockets: For quick, real-time communication.

## License

This project is licensed under the MIT License.
