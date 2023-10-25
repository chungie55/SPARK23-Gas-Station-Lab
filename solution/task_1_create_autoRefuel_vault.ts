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
    let vaultName = "Adv Task 1: " + generateUID();
    let { id, name, autoFuel } = await fireblocksApiClient.createVaultAccount(vaultName, undefined, undefined, true, undefined);
    console.log("--- New Vault Created ---");
    console.log("Vault ID: " + id);
    console.log("Vault Name: " + name);
    console.log("Auto Fuel?: " + autoFuel);
    
    // Toggle Auto Fuel to Off
    let { success } = await fireblocksApiClient.setAutoFuel(id, false, undefined);
    console.log("\n -- Autofuel updated success : " + success)

    // Get Updated Vault Info
    let { autoFuel: newautofuel } = await fireblocksApiClient.getVaultAccountById(id);
    console.log("\n--- Updated Vault ---");
    console.log("Vault ID: " + id);
    console.log("Vault Name: " + name);
    console.log("Auto Fuel?: " + newautofuel);


}()).catch(err=> {
    console.log("error", err);
    process.exit(1);
});

function generateUID(): string {
    let firstPartNum = (Math.random() * 46656) | 0;
    let secondPartNum = (Math.random() * 46656) | 0;
    let firstPart = ("000" + firstPartNum.toString(36)).slice(-3);
    let secondPart = ("000" + secondPartNum.toString(36)).slice(-3);
    return firstPart + secondPart;
}

