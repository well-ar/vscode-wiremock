import * as vscode from 'vscode';
import { WireMockInstance } from "./WiremockInstance";
import { commandReset } from './commandReset';

export function configureFileWatcher() {
    const wireMockInstance = WireMockInstance.getInstance();
    
    if(wireMockInstance.fileWatcher) {
        wireMockInstance.fileWatcher.dispose();
        wireMockInstance.fileWatcher = null;
    }
    

    if (wireMockInstance.autoReset) {
        const fileWatcher = vscode.workspace.createFileSystemWatcher(wireMockInstance.rootDir.fsPath + "/**");

        fileWatcher.onDidChange(async () => {
            fileEventReset("changed");
        });

        fileWatcher.onDidCreate(async () => {
            fileEventReset("created");
        });

        fileWatcher.onDidDelete(async () => {
            fileEventReset("deleted");
        });
        
        wireMockInstance.fileWatcher = fileWatcher;
    }
}

async function fileEventReset(event: string) {
    const wireMockInstance = WireMockInstance.getInstance();

    wireMockInstance.outputChannel.appendLine(`File ${event}...`);
    
    await commandReset();
}