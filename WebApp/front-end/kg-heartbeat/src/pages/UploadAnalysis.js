import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../api';
import { useNavigate } from 'react-router-dom';


function UploadAnalysis({selectedKGs, setSelectedKGs}){
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setFileError('');
      } else {
        setFileError('Select a valid CSV file');
      }
    } else {
      setFileError('Select a file');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validazione del file
    if (!file) {
      setFileError('Select a csv file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${base_url}knowledge_graph/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.data.length > 0){
        setSelectedKGs(response.data)
        navigate('/pages/QualityData')
      }
    } catch (error) {
      console.error('Error during the the file upload:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-3">
        <div className="col-6">
            <p>Upload here the csv file obtained with our analysis tool to view all the quality data on the graphs.<br/>
             <b>NB:</b> the file must retain its original name (the date of the analysis) and must not be modified in any way.</p>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                Analysis result file (<b>*.csv</b>):
              </label>
              <input
                type="file"
                className={`form-control ${fileError ? 'is-invalid' : ''}`}
                id="file"
                onChange={handleFileChange}
              />
              {fileError && <div className="invalid-feedback">{fileError}</div>}
            </div>
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadAnalysis;
