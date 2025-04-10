from langchain.chains import RetrievalQA
from langchain.llms import Ollama

def run_rag_chain(vectordb, query):
    llm = Ollama(model="gemma:latest", temperature=0.7)

    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectordb.as_retriever(),
        return_source_documents=True
    )

    return qa(query)
