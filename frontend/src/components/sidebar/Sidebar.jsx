import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { FaFile } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

const Sidebar = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      setLoading(true); 
      const formData = new FormData();
      formData.append("file", selectedFile);
      fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from backend:", data.result);
          const extractedText = data.result;
          setExtractedText(extractedText);
          toast.success("File uploaded successfully!");
        })
        .catch((error) => {
          console.error("Error sending file to backend:", error);
          toast.error("Error processing file!");
        })
        .finally(() => {
          setLoading(false); 
        });
    } else {
      console.log("No file selected");
      toast.error("No file selected!");
    }
  };

  return (
    <div className="hidden bg-zinc-800 h-screen w-96 md:flex flex-col text-white justify-center items-center p-3">
      <div className="m-3">
        <h2 className="font-bold text-lg mb-3">Your document</h2>
        <p className="mb-3">Upload your PDF here and click on "Process"</p>
        <div className="bg-zinc-950 p-6 rounded-lg">
          <p>Drag and drop the file here</p>
          <p className="text-sm text-zinc-500">Limit 200MB per file</p>
          <div className="mt-7">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="bg-zinc-700 p-2 rounded-lg border-zinc-500 border mt-5 hover:bg-green-800 cursor-pointer"
            >
              Browse file
            </label>
            <div className="flex items-center">
              {selectedFile && (
                <div className="flex bg-zinc-700 rounded-lg mt-6">
                  <p className="p-2 ">{selectedFile.name}</p>
                  <FaFile className="ml-2 m-3" />
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleFileUpload}
          className="bg-zinc-700 rounded-lg border border-zinc-500 hover:bg-green-800 mt-4 p-2"
        >
          {loading ? "Processing..." : "Process"}{" "}
        </button>
      </div>
      <div className="overflow-auto">{extractedText}</div>
    </div>
  );
};

export default Sidebar;
