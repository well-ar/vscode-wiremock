import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';
import * as vscode from 'vscode';
import { loadParams } from './loadParams';

export async function commandImportMappings(prompt: boolean = true) {
    if(prompt && !await loadParams(false, true)) {
        return;
    }
    
    const wireMockInstance = WireMockInstance.getInstance();

    const mappings = vscode.window.activeTextEditor?.document.getText();

    if (!mappings) {
        return;
    }

    const requestsUrl = wireMockInstance.getApiUrl("__admin/mappings/import");
    
    try {
        await axios.post(requestsUrl, mappings);
        wireMockInstance.outputChannel.appendLine("Mappings imported");
    } catch (ex: any) {
        vscode.window.showErrorMessage("Error importing mappings");
        wireMockInstance.outputChannel.appendLine("Error importing mappings");
        wireMockInstance.outputChannel.appendLine(JSON.stringify(ex.response?.data || ex.message));
        wireMockInstance.outputChannel.show();
    }
}