import logo from './adil logo.jpg';
import './App.css';
import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Store used barcodes to prevent duplicates
const usedBarcodes = new Set();

function generateEAN13() {
  let randomNum;
  let barcode;
  const maxAttempts = 100; // Prevent infinite loops

  for (let i = 0; i < maxAttempts; i++) {
    // Generate a random 12-digit number
    randomNum = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    // Calculate checksum
    const digits = randomNum.split('').map(Number);
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7] + digits[9] + digits[11];
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8] + digits[10];
    const total = evenSum * 3 + oddSum;
    const checksum = (10 - (total % 10)) % 10;
    barcode = randomNum + checksum;

    // Check if barcode is unique
    if (!usedBarcodes.has(barcode)) {
      usedBarcodes.add(barcode);
      return barcode;
    }
  }

  // If no unique barcode is found after maxAttempts
  throw new Error('Unable to generate a unique barcode. Too many barcodes generated.');
}

function App() {
    const [barcodeCount, setBarcodeCount] = useState(''); // Make input empty initially
  const [barcodes, setBarcodes] = useState([]);        // No barcode generated initially
  const [error, setError] = useState('');

  useEffect(() => {
    barcodes.forEach((barcode, index) => {
      JsBarcode(`#barcode-${index}`, barcode, {
        format: "EAN13",
        displayValue: true,
        fontSize: 18,
        width: 2,
        height: 70,
        margin: 10,
      });
    });
  }, [barcodes]);

  const handleGenerateBarcodes = () => {
    const count = parseInt(barcodeCount, 10);
    if (isNaN(count) || count < 1 || count > 100) {
      setError('Please enter a number between 1 and 100.');
      setBarcodes([]); // Clear barcodes if invalid input
      return;
    }
    setError('');
    try {
      const newBarcodes = Array.from({ length: count }, () => generateEAN13());
      setBarcodes(newBarcodes);
    } catch (err) {
      setError(err.message);
    }
  };


  const handleCopyBarcodes = () => {
    const barcodeText = barcodes.join('\n');
    navigator.clipboard.writeText(barcodeText).then(() => {
      toast.success('Barcodes copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy barcodes.');
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center p-6">
       <ToastContainer 
        position="top-right"
        autoClose={1000}// Auto-close after 3 seconds
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
       
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
         <img src={logo} alt="" />&nbsp;<br></br>
          Adil Supermarket EAN-13 Generator
        </h1>
         <div className="flex items-center">
      <p className="text-dark-600 italic text-sm select-none " style={{marginLeft:"80%" , marginTop:"-2%"}}>
        Designed by Mohit
      </p>
    </div>
        <div>
          <h3 className="block text-gray-700 font-medium " 
        style={{marginBottom:"1%", marginLeft:"2%"}}>
            Number of Barcodes (1-100): 
          </h3>
          <div style={{marginLeft:"2%"}}>
          <input
            type="number"
            min="1"
            max="100"
            value={barcodeCount}
            onChange={(e) => setBarcodeCount(e.target.value)}
            className=" p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{width:"95%"}}
            placeholder="Enter number of barcodes"
          />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-center gap-4 mb-6 ml-2" >
          <button
            onClick={handleGenerateBarcodes}
            style={{marginLeft:"2%", marginTop:"1%"}}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-md"
          >
            Generate Barcodes
          </button>
          <button
           style={{marginLeft:"1%" ,marginTop:"1%"}}
            onClick={handleCopyBarcodes}
            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold shadow-md"
          >
            Copy All Barcodes
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {barcodes.map((barcode, index) => (
            <div key={index} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
              <svg id={`barcode-${index}`}></svg>
              <p className="text-center text-lg font-mono text-gray-800 mt-2">{barcode}</p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default App;