# LLMate

## Introduction

PDF Chatbot is a project aimed at assisting users in extracting information from PDF files using a chatbot interface. This project utilizes React for the frontend and FastAPI for the backend. Additionally, it leverages free Large Language Models (LLMs) from Hugging Face to enhance natural language understanding.

## Features

- Upload PDF files
- Extract information from uploaded PDF files
- Chatbot interface for interacting with the system
- Utilizes state-of-the-art language models for enhanced understanding

## Installation

1. Clone the repository:

```bash
git clone <repository_url>
```

2. Create a virtual environment using conda:

```
conda create --name chatbot
```

3. Activate the virtual environment:

```
conda activate chatbot
```

4. Install the dependencies from the requirements.txt file:

```
pip install -r requirements.txt
```

## Running the Backend Server

1. Navigate to the backend directory:

```
cd backend
```

2. Launch the backend server:
   `uvicorn main:app --reload`

The server will start at http://127.0.0.1:8000/.

## Running the frontend

Navigate to the frontend directory and Install frontend dependencies:

```
npm install
```

```
npm run dev
```

## Usage

1. Once both the backend server and frontend app are running, visit http://localhost:3000/ in your web browser.
2. Upload your PDF files using the provided interface.
   Interact with the chatbot to extract information from the uploaded PDF files.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License.
