const { ethers } = require("ethers");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const JSON = require("JSON")



// Setup provider and wallet
const provider = new ethers.JsonRpcProvider("https://polygon-amoy.infura.io/v3/8a9e254066f74f54bb00321801f9e4f1");
const signer = new ethers.Wallet("f733048248f5ed99ae5ed0e6f09668ba96c54e4a7c90c68f45bb42e9ab1c0d85", provider);

// ABI of your contract
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "fetcher",
				"type": "address"
			}
		],
		"name": "RecordFetched",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "saver",
				"type": "address"
			}
		],
		"name": "RecordSaved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "encodedString",
				"type": "string"
			}
		],
		"name": "saveRecord",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "counter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fetchLatestRecord",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			}
		],
		"name": "fetchMultipleRecords",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "fetchRecord",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Address of the deployed contract
const contractAddress = "0xBdb74aD797578Fbcd277F504B9DC45f10a096ab0";

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Create an Express application
const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Function to save a health record
async function saveHealthRecord(record) {
    try {
        if (typeof record !== 'string') {
            throw new Error('Record must be a string.');
        }
        console.log("This is the record ", record);
        const recordString = record.toString();
        
        console.log("This is the recordString ", recordString);
        const tx = await contract.saveRecord(recordString);


        const receipt = await tx.wait();

        console.log("Transaction sent. Waiting for confirmation...");
        
        const savedRecordIdHex = (Number(await contract.getCounter()) -1 );
        console.log(`Record saved successfully with ID: ${savedRecordIdHex}`);
        return savedRecordIdHex;
    } catch (error) {
        console.error("Error saving record:", error);
        throw error;
    }
}

// Function to fetch a health record by ID
async function fetchHealthRecord(recordId) {
    try {
        const record = await contract.fetchRecord(recordId);
        console.log(`Fetched Record for ID ${recordId}: ${record}`);
        return record;
    } catch (error) {
        console.error(`Error fetching record with ID ${recordId}:`, error);
        throw error;
    }
}

// API endpoint to save a health record
app.post('/api/records', async (req, res) => {
    try {
        const { record } = req.body; // Expecting JSON body with { "record": "..." }
        // const stringRecord= JSON.stringify(record);
		console.log("string Records: ", record );
        const savedId = await saveHealthRecord(record);
        res.json({ savedId });
    } catch (error) {
        res.status(500).json({ error: "Error saving record" });
    }
});

// API endpoint to fetch a health record by ID
app.get('/api/records/:id', async (req, res) => {
    try {
        const recordId = parseInt(req.params.id);
        const record = await fetchHealthRecord(recordId);
        res.json({ record });
    } catch (error) {
        res.status(500).json({ error: "Error fetching record" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const { ethers } = require("ethers");
// const readline = require('readline');

// // Setup provider and wallet
// const provider = new ethers.JsonRpcProvider("https://polygon-amoy.infura.io/v3/8a9e254066f74f54bb00321801f9e4f1");
// const signer = new ethers.Wallet("f733048248f5ed99ae5ed0e6f09668ba96c54e4a7c90c68f45bb42e9ab1c0d85", provider);

// // ABI of your contract
// const contractABI = [
// 	{
// 		"inputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "constructor"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": true,
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "fetcher",
// 				"type": "address"
// 			}
// 		],
// 		"name": "RecordFetched",
// 		"type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": true,
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "saver",
// 				"type": "address"
// 			}
// 		],
// 		"name": "RecordSaved",
// 		"type": "event"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "encodedString",
// 				"type": "string"
// 			}
// 		],
// 		"name": "saveRecord",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "counter",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "fetchLatestRecord",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256[]",
// 				"name": "ids",
// 				"type": "uint256[]"
// 			}
// 		],
// 		"name": "fetchMultipleRecords",
// 		"outputs": [
// 			{
// 				"internalType": "string[]",
// 				"name": "",
// 				"type": "string[]"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "fetchRecord",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "getCounter",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "owner",
// 		"outputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ];

// // Address of the deployed contract
// const contractAddress = "0xBdb74aD797578Fbcd277F504B9DC45f10a096ab0";

// // Create a contract instance
// const contract = new ethers.Contract(contractAddress, contractABI, signer);

// // Function to save a health record
// async function saveHealthRecord(record) {
//     try {
//         const tx = await contract.saveRecord(record);
//         console.log("Transaction sent. Waiting for confirmation...");
//         // const receipt = await tx.wait();
        
//         const savedRecordIdHex = (Number(await contract.getCounter()));//receipt.logs[0].data;
//         // savedRecordId = await savedRecordIdHex.wait();
//         console.log("saved record is : ", savedRecordIdHex)
//         // const savedRecordId = ethers.BigNumber.from(savedRecordIdHex);
//         console.log(`Record saved successfully with ID: ${savedRecordId}`);
//         return savedRecordIdHex;
//     } catch (error) {
//         console.error("Error saving record:", error);
//     }
// }

// // Function to fetch a health record by ID
// async function fetchHealthRecord(recordId) {
//     try {
//         const record = await contract.fetchRecord(recordId);
//         console.log(`Fetched Record for ID ${recordId}: ${record}`);
//         return record;
//     } catch (error) {
//         console.error(`Error fetching record with ID ${recordId}:, error`);
//     }
// }

// // Create readline interface
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// // Function to get user input
// function askQuestion(query) {
//     return new Promise(resolve => rl.question(query, resolve));
// }

// // Main function to run the program
// async function main() {
//     while (true) {
//         console.log("\nWhat would you like to do?");
//         console.log("1. Save a new health record");
//         console.log("2. Fetch a health record");
//         console.log("3. Exit");

//         const choice = await askQuestion("Enter your choice (1, 2, or 3): ");

//         switch (choice) {
//             case '1':
//                 const recordToSave = await askQuestion("Enter the health record data to save: ");
//                 const savedId = await saveHealthRecord(recordToSave);
//                 if (savedId !== undefined) {
//                     console.log(`Record saved with ID: ${savedId}`);
//                 }
//                 break;
//             case '2':
//                 const idToFetch = await askQuestion("Enter the ID of the record to fetch: ");
//                 await fetchHealthRecord(parseInt(idToFetch));
//                 break;
//             case '3':
//                 console.log("Exiting the program.");
//                 rl.close();
//                 return;
//             default:
//                 console.log("Invalid choice. Please try again.");
//         }
//     }
// }

// // Run the main function
// main().catch(error => {
//     console.error("An error occurred:", error);
//     rl.close();
// });
