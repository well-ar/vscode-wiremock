import * as vscode from 'vscode';
import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';

export async function commandReset() {
    const wireMockInstance = WireMockInstance.getInstance();
  
    try {
        await axios.post(wireMockInstance.getApiUrl("__admin/reset"));
        wireMockInstance.outputChannel.appendLine("WireMock reset");
        vscode.window.showInformationMessage('WireMock reset');
    } catch (_ex) {
    }
}