import { 
    FireblocksSDK, 
    PagedVaultAccountsRequestFilters, 
    PagedVaultAccountsResponse, 
    AssetResponse, 
    VaultAccountResponse,
    TransactionOperation,
    PeerType,
    TransactionResponse,
    TransactionStatus,
    AssetTypeResponse
} from "fireblocks-sdk";
import * as fs from "fs";

// ***************
// Fireblocks API Client Initialization
// ***************
const apiKey = '55dac946-494d-41b7-87ab-b99587c60106';
const apiSecret = fs.readFileSync("secret/fireblocks_secret.key", "utf8");
const fireblocksApiClient = new FireblocksSDK(apiSecret, apiKey);

// ***************
// GAS STATION PARAMETERS
// ***************
const asset_name = "SOL_TEST";
const gas_threshold = 0.1;
const gas_cap = 0.5;
const gas_station_vault_id = "1";

// ***************
// MAIN FUNCTION
// ***************
(async function() {
    // Get a list of known SPL Tokens from Fireblocks workspace
    const known_spl = await getSPLTokens();

    // Get List of Vaults with SOL_TEST
    let req_filters: PagedVaultAccountsRequestFilters = {
        assetId: asset_name
    }
    let vault_resp: PagedVaultAccountsResponse = await fireblocksApiClient.getVaultAccountsWithPageInfo(req_filters);
    
    // Filter Vaults with Known SPLs and trigger Gas Station check
    for (var v of vault_resp.accounts) {
        let asset_list: VaultAccountResponse = await fireblocksApiClient.getVaultAccountById(v.id);
        if (asset_list.assets) {
            for (var a of asset_list.assets) {
                if (known_spl.includes(a.id)) {
                    await gasStationRefuel(v.id);
                }
            }
        }        
    }

}()).catch(err=> {
    console.log("error", err);
    process.exit(1);
});


// ***************
// GAS STATION REFUEL FUNCTION
// ***************
async function gasStationRefuel(vaultId: string) {
    let sol_balance: AssetResponse = await fireblocksApiClient.getVaultAccountAsset(vaultId, asset_name);
    let bal_num: number = +sol_balance.total;

    // Check if SOL_TEST balance is below set gas threshold
    if (bal_num < gas_threshold) {
        console.log("Start Refuel to Vault ID " + vaultId);
        let refuel_amount: number = gas_cap - bal_num;

        // Create Transaction to top up SOL_TEST until set gas cap
        let { status, id } = await fireblocksApiClient.createTransaction({
            operation: TransactionOperation.TRANSFER,
            assetId: asset_name,
            source: {
                type: PeerType.VAULT_ACCOUNT,
                id: gas_station_vault_id
            },
            destination: {
                type: PeerType.VAULT_ACCOUNT,
                id: vaultId
            },
            amount: refuel_amount.toString()
        });

        console.log("Created Refuel Tx ID: ", id);
        console.log("Tx Status: ", status);
        
        if(status == TransactionStatus.FAILED) {
            let txInfo: TransactionResponse = await fireblocksApiClient.getTransactionById(id);
            throw "Transaction failed. Substatus: " + txInfo.subStatus;
        }
    }

};

// ***************
// GET SPL TOKENS FUNCTION
// ***************
async function getSPLTokens(): Promise<string[]> {
    let result: string[] = [];
    let supported_assets: AssetTypeResponse[] = await fireblocksApiClient.getSupportedAssets();

    for (var sa of supported_assets) {
        if (sa.nativeAsset === asset_name && sa.type !== "BASE_ASSET"){
            result.push(sa.id);
        }
    }

    return result
}
