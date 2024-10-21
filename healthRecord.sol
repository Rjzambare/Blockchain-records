//SPDX-License-Identifier: MIT 

pragma solidity ^0.8.6;

contract healthrecord {

    uint256 counter; 
    address owner;
    mapping(uint256 => string) healthRecord;
    constructor () {
        counter=0;
        owner=msg.sender;
    }


    function saveRecord(string memory encodedString) public returns (uint256) {
        healthRecord[counter] = encodedString;
        uint256 savedId = counter;
        counter++;
        
        return savedId;
    }

    function fetchRecord(uint256 id) public view returns (string memory ) {
        return healthRecord[id];
    }
}