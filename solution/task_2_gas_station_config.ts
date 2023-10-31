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

    // Asset ID to be updated
    let assetId = "ETH_TEST5";

    // Default Gas Configurations
    let default_gasthreshold = "0.005";
    let default_gascap = "0.01";

    // New Gas Configurations
    let new_gasthreshold = "0.006";
    let new_gascap = "0.02";

    // Get Gas Station Configuration for a particular asset
    let { configuration } = await fireblocksApiClient.getGasStationInfo(assetId);
    console.log("Gas Station Configuration for " + assetId);
    console.log("Gas Threshold: " + configuration.gasThreshold);
    console.log("Gas Cap: " + configuration.gasCap);
    console.log("Max Gas Price: " + configuration.maxGasPrice);

    // Updating Gas Station Configuration
    let { success } = await fireblocksApiClient.setGasStationConfiguration(new_gasthreshold, new_gascap, undefined, assetId);
    console.log("\n--- Gas Station Config update success: " + success);

    // Retrieve Gas Station Config
    let { configuration: new_config } = await fireblocksApiClient.getGasStationInfo(assetId);
    console.log("Gas Station Configuration for " + assetId);
    console.log("Gas Threshold: " + new_config.gasThreshold);
    console.log("Gas Cap: " + new_config.gasCap);
    console.log("Max Gas Price: " + new_config.maxGasPrice);

    // Revert Gas Station Config
    await fireblocksApiClient.setGasStationConfiguration(default_gasthreshold, default_gascap, undefined, assetId);

}()).catch(err=> {
    console.log("error", err);
    process.exit(1);
});


