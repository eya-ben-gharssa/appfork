from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from app.core.loader import load_documents
from app.core.index import create_vectorstore
from langchain.chains import RetrievalQA

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
qa_chain = RetrievalQA.from_chain_type(
    llm=Ollama(model="gemma3:latest", temperature=0.7),
    chain_type="stuff",
    retriever=retriever,
    memory=memory
)

def get_bot_response(feeling: str):
    # First, retrieve relevant documents based on the input
    retrieved_docs = retriever.get_relevant_documents(feeling)
    context = "\n".join([doc.page_content for doc in retrieved_docs])
    
    template = """
    You are a kind and emotionally intelligent companion, offering thoughtful and supportive responses.
    Here is the chat history between you and the user:
    {chat_history}
    
    Here is relevant context from our knowledge base:
    {context}
    
    The user just said: "{feeling}"
    If the user's feeling is simple or the situation doesn't require much explanation, respond briefly (max 1-2 sentences).
    If the situation requires deeper understanding or guidance, feel free to elaborate and provide a more detailed response.
    Keep your response helpful, supportive, and tailored to the user's emotional state.
    """
    
    prompt = PromptTemplate(template=template, input_variables=["feeling", "chat_history", "context"])
    
    llm = Ollama(model="gemma3:latest", temperature=0.3)
    
    # Attach memory to the chain
    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        memory=memory
    )
    
    # Get the response from the chain
    response = chain.run(feeling=feeling, context=context)
    
    memory.save_context(inputs={"feeling": feeling}, outputs={"response": response})
    
    # Return both the response and the context
    return {
        "response": response,
        "context": context,
        "retrieved_docs": retrieved_docs  # Optional: return the raw retrieved documents
    }
