# 🧠🧑‍💼 InfoJobs Plugin for ChatGPT

InfoJobs Plugin for ChatGPT is an innovative plugin for ChatGPT that assist individuals in their job search. Using the ChatGPT, it allows for natural language interaction, make querys to InfoJobs API and return the results to the user directly in the chat.

## 📝 Requirements

- ChatGPT Pro Account
- InfoJobs API Key
- ChatGPT Plugins BETA enabled

## 🚀 Usage

1. Clone the repository

```bash
git clone
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add the following environment variables

```bash
INFOJOBS_CLIENT_ID=xxx
INFOJOBS_CLIENT_SECRET=yyy
```

You can get an Infojobs Client ID and Client Secret [Infojobs API team](https://developer.infojobs.net/).

4. Run the development server

```bash
node --watch index.js
```

5. Create a new plugin in ChatGPT and add the URL of your development server

6. Enjoy!

## 📝 License

This project is [MIT](./LICENSE) licensed.
