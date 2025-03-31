# Supportly, An AI-driven Customer Support Chatbot - Proof of Concept


This is a proof of concept chatbot built using Node.js, Express, Vue.js, MySQL, and integrates OpenAI’s GPT-3.5 (ChatGPT), Whisper (for audio transcription), and text-embedding-ada-002 (for semantic text embeddings). While the chatbot mimics a customer support interface, it is not intended for real customer service use. This project is built to demonstrate my skills and the potential of using AI models for conversational interactions.

Since this project was built in quite a small timeframe, functionality was prioritized over styling.

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

## FAQs System and Text Embedding

The chatbot uses a text embedding system to match user queries with predefined FAQs. When a user asks a question, the chatbot converts the input text into an embedding and compares it with stored FAQ embeddings. If a close enough match is found, the corresponding FAQ answer is provided.

If you receive an FAQ response, it means that your query had an embedding similar to one of the stored FAQs.



### FAQ List

1. How do I reset my password?
   - Go to the login page, click "Forgot Password", and follow the instructions in the email you receive.
2. Can I cancel my order after placing it?
   - If your order has not yet shipped, you can cancel it in your account under Orders > Cancel Order.
3. How do I request a refund?
   - Visit our Refund Policy page and fill out the refund request form. Refunds are processed within 5-7 business days.
4. What payment methods do you accept?
   - We accept Visa, MasterCard, PayPal, Apple Pay, and Google Pay.
5. How do I update my account details?
   - Log in to your account, go to Settings > Account Information, and update your details.
6. How can I delete my account?
   - To delete your account, go to Settings > Account Preferences and select Delete Account. If you need assistance, contact our support team.
7. What should I do if I receive a damaged product?
   - Contact our support team immediately at supportly@supportly.com with a photo of the damaged item.

## License

This project is licensed under the MIT License.
