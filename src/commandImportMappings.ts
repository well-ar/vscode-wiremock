import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';
import * as vscode from 'vscode';

export async function commandImportMappings() {
    const wireMockInstance = WireMockInstance.getInstance();

    const mappings = vscode.window.activeTextEditor?.document.getText();

    if (!mappings) {
        return;
    }

    const requestsUrl = wireMockInstance.wiremockUrl + "/__admin/mappings/import";
    
    let data;
  
    try {
        data = await axios.post(requestsUrl, mappings);
        wireMockInstance.outputChannel.appendLine("Mappings imported");
    } catch (ex: any) {
        vscode.window.showErrorMessage("Error importing mappings");
        wireMockInstance.outputChannel.appendLine("Error importing mappings");
        wireMockInstance.outputChannel.appendLine(JSON.stringify(ex.response?.data || ex.message));
        wireMockInstance.outputChannel.show();
    }
}