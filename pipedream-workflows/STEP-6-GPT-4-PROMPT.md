# Step 6: GPT-4 Metadata Enrichment

## Setup

Add: **OpenAI (ChatGPT) - Chat**

## Configuration

- **Model**: `gpt-4o` (or `gpt-3.5-turbo` for cheaper)
- **Temperature**: `0.3`
- **Max Tokens**: `2000`

## System Prompt

```
You are a book and comic book metadata researcher. Extract and format structured metadata from provided API responses. Return valid JSON only with ALL requested fields.
```

## User Message

Copy from: `STEP-6-GPT-4-USER-MESSAGE.txt`

## Export As

`gptResponse`

