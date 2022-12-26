import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';
import * as vscode from 'vscode';

export async function commandRequestLogs() {
    const wireMockInstance = WireMockInstance.getInstance();
    const fileUri = vscode.Uri.parse(`wiremock:/requests.json`);
    const requestsUrl = wireMockInstance.wiremockUrl + "/__admin/requests";
    
    let data;
  
    try {
        data = await axios.get(requestsUrl);
        wireMockInstance.memFs.writeFile(fileUri, Buffer.from(JSON.stringify(data.data, null, 4)), { create: true, overwrite: true });
    } catch (ex) {
        wireMockInstance.memFs.writeFile(fileUri, Buffer.from(`/*\r\nError getting requests from: ${requestsUrl}\r\n${ex}\r\n*/`), { create: true, overwrite: true });
    }

    const doc = await vscode.workspace.openTextDocument(fileUri);
    await vscode.languages.setTextDocumentLanguage(doc, "jsonc");
    await vscode.window.showTextDocument(doc, { preview: false });
}