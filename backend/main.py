from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import PyPDF2
from langchain.text_splitter import CharacterTextSplitter
from typing import List
from langchain.embeddings import OpenAiEmbeddings
from langchain.vectorstores import FAISS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a response model
class Response(BaseModel):
    result: List[str]

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
# Update the response model to accept a list of strings
def get_vectorstore(text_chunks):
    embeddings = OpenAiEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore


@app.post("/predict", response_model=Response)
async def predict(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from the PDF file
    text = extract_text_from_pdf(file.filename)

    # get the text chunks
    text_chunks = get_text_chunks(text)
    vectorstore = get_vectorstore(text_chunks)
    # Delete the temporary PDF file 
    os.remove(file.filename)

    # Return the list of text chunks
    return {"result": text_chunks}

# Define a route for the root path
@app.get("/")
async def root():
    return {"message": "Hello World"}
