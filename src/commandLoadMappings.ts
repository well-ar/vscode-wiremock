import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';
import * as vscode from 'vscode';
import { loadParams } from './loadParams';

export async function commandLoadMappings() {
    if(!await loadParams(false, true)) {
        return;
    }

    const wireMockInstance = WireMockInstance.getInstance();
    const fileUri = vscode.Uri.parse(`wiremock:/mappings.json`);
    const requestsUrl = wireMockInstance.getApiUrl("__admin/mappings");

    let data;
    wireMockInstance.loadingMappings = true;
  
    try {
        if (vscode.window.activeTextEditor?.document.uri.toString() === fileUri.toString()) {
            await vscode.window.activeTextEditor?.document.save();
        }

        data = await axios.get(requestsUrl);
        wireMockInstance.memFs.writeFile(fileUri, Buffer.from(JSON.stringify(data.data, null, 4)), { create: true, overwrite: true });
    } catch (ex) {
        wireMockInstance.memFs.writeFile(fileUri, Buffer.from(`/*\r\nError getting mappings from: ${requestsUrl}\r\n${ex}\r\n*/`), { create: true, overwrite: true });
    }
    
    setTimeout(() => {
        wireMockInstance.loadingMappings = false;
    }, 1000);
    
    const doc = await vscode.workspace.openTextDocument(fileUri);
    await vscode.languages.setTextDocumentLanguage(doc, "jsonc");
    await vscode.window.showTextDocument(doc, { preview: false });
}