from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from app.core.loader import load_documents
from app.core.index import create_vectorstore
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFaceHub
import requests

HUGGINGFACE_API_TOKEN = "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"

# Setup memory
memory = ConversationBufferMemory(
    memory_key="chat_history", 
    input_key="feeling",  # Ensure input_key matches the variable used in the prompt
)

# Load documents and create vectorstore
documents = load_documents("data")
vectordb = create_vectorstore(documents)  # Assuming this returns a vectorstore like Chroma

# Initialize the retriever from the vectorstore
retriever = vectordb.as_retriever()

# Set up the RetrievalQA chain
def get_bot_response(feeling: str):
    # First, retrieve relevant documents based on the input
    retrieved_docs = retriever.get_relevant_documents(feeling)
    context = "\n".join([doc.page_content for doc in retrieved_docs])

    # Prepare prompt
    template = """
    You are a compassionate and emotionally attuned virtual psychiatrist. Your role is to provide thoughtful, supportive, and clinically-informed responses grounded in therapeutic principles.

    Here is the chat history between you and the user:
    {chat_history}

    Here is relevant context from our psychiatric knowledge base:
    {context}

    The user just shared this : {feeling}

    Respond in a natural, empathetic tone without using prefixes like "AI:" or "Assistant:".
    - If the user’s feeling is straightforward or they simply need emotional support, offer a concise, validating response (1–2 sentences).
    - If the user’s emotional state suggests deeper distress or invites exploration, respond with more depth. Use reflective listening, validate their experience, and gently guide them toward insight or coping strategies.
    - Avoid offering medical diagnoses or advice. Instead, foster self-awareness, emotional safety, and encouragement to seek professional help if needed.

    Your goal is to create a safe and non-judgmental space that mirrors a therapeutic interaction, while staying grounded in psychiatric understanding and ethics.
    """

    
    # Fill in the prompt
    raw_chat_history = memory.load_memory_variables({}).get("chat_history", "")
    chat_history = raw_chat_history.replace("AI:", "").replace("User:", "").strip()

    final_prompt = f"<s>[INST] {template.format(chat_history=chat_history, context=context, feeling=feeling).strip()} [/INST]"


    # Call Hugging Face Inference API
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": final_prompt,
        "parameters": {
            "temperature": 0.3,
            "max_new_tokens": 512,
            "top_p": 0.95,
            "repetition_penalty": 1.1,
            "return_full_text": False
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"Hugging Face API error: {response.status_code}, {response.text}")

    response_text = response.json()[0]['generated_text'].strip()


    # Save interaction to memory
    memory.save_context(inputs={"feeling": feeling}, outputs={"response": response_text})

    return {
        "response": response_text,
        "context": context,
        "retrieved_docs": retrieved_docs
    }