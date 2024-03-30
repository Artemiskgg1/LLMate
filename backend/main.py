from fastapi import FastAPI, File, UploadFile, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import PyPDF2
from langchain.text_splitter import CharacterTextSplitter
from typing import List
from langchain.embeddings.huggingface import HuggingFaceInstructEmbeddings
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_community.llms import HuggingFaceHub
import websockets  
import json 
from sentence_transformers import SentenceTransformer

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Response(BaseModel):
    result: List[str]

conversation_chain = None

def extract_text_from_pdf(pdf_file):
    text = ""
    with open(pdf_file, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    model_kwargs = {'device': 'cpu'} 
    encode_kwargs = {'normalize_embeddings': True}
    embeddings = HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-xl",model_kwargs=model_kwargs,encode_kwargs=encode_kwargs) 
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    llm = HuggingFaceHub(repo_id="google/flan-t5-xxl" , model_kwargs={"temperature": 0.5, "max_length": 512})
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

def handle_userinput(user_question):
    if not conversation_chain:
        raise HTTPException(status_code=500, detail="Conversation chain not initialized")
    
    response = conversation_chain({'question': user_question})
    print(response)
    if 'result' in response:
        result = response['result']
    else:
        result = None
    if result is not None:
        try:
            result = json.dumps(result)
        except TypeError:
            result = str(result)
    else:
        result = "No result available"
    response_data = {"result": result}
    return response_data
@app.post("/predict", response_model=Response)
async def predict(file: UploadFile = File(...)):
    global conversation_chain
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = extract_text_from_pdf(file.filename)
    text_chunks = get_text_chunks(text)
    vectorstore = get_vectorstore(text_chunks)
    conversation_chain = get_conversation_chain(vectorstore)
    os.remove(file.filename)    
    return {"result": text_chunks}
    
@app.websocket("/chat")
async def chat_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            user_question = await websocket.receive_text()
            if user_question:
                response = handle_userinput(user_question)
                response_data = {"result": response}
                response_json = json.dumps(response_data)
                await websocket.send_text(response_json)
    except websockets.exceptions.ConnectionClosedError:
        print("WebSocket connection closed")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()
