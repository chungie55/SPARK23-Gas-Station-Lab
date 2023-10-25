import { 
    FireblocksSDK
} from "fireblocks-sdk";
import * as fs from "fs";

// ***************
// Fireblocks API Client Initialization
// ***************
const apiKey = '55dac946-494d-41b7-87ab-b99587c60106';
const apiSecret = fs.readFileSync("secret/fireblocks_secret.key", "utf8");
const fireblocksApiClient = new FireblocksSDK(apiSecret, apiKey);


// ***************
// MAIN FUNCTION
// ***************
(async function() {

    // Create New Vault with Auto Refuel
    /* ******
    ** 1. Use the appropriate method on Fireblocks SDK to create a new vault with auto refuel enabled
    ** ******
    */
    
    // Toggle Auto Fuel to Off
    /* ******
    ** 1. Toggle auto-refuel OFF for the new vault above
    ** ******
    */

    // Get Updated Vault Info
    /* ******
    ** 1. Verify that Auto-refuel flag is now set to OFF
    ** ******
    */


}()).catch(err=> {
    console.log("error", err);
    process.exit(1);
});

