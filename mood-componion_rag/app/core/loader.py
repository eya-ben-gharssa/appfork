from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os

def load_documents(data_dir):
    docs = []
    for filename in os.listdir(data_dir):
        if filename.endswith(".txt"):
            loader = TextLoader(os.path.join(data_dir, filename), encoding="utf-8")
            docs.extend(loader.load())
    
    # Chunk the documents into smaller parts for retrieval
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    return splitter.split_documents(docs)
