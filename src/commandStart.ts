import * as vscode from 'vscode';
import { Uri } from "vscode";
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";
import { WireMockInstance } from './WiremockInstance';
import { ExtensionSettingsEnum } from './ExtensionSettingsEnum';
import { commandShutdown } from './commandShutdown';
import { configureFileWatcher } from './configureFileWatcher';
import { loadParams } from './loadParams';

export async function commandStart() {
    const wireMockInstance = WireMockInstance.getInstance();

    if(wireMockInstance.started){
        await commandShutdown();
    }
    
    if(!await loadParams()) {
        return;
    }

    const wiremockUri = await getWireMock(wireMockInstance);
    wireMockInstance.outputChannel.show();
    
    const additionalCommandArgs = (wireMockInstance.getConfiguration<string>(ExtensionSettingsEnum.additionalCommandArgs) || "").split(" ");

    let wireMockParams = [
        '-jar ', `"${wiremockUri.fsPath}"`, 
        '--root-dir', `"${wireMockInstance.rootDir.fsPath}"`,
        '--port', wireMockInstance.port.toString(),
    ].concat(additionalCommandArgs);

    wireMockInstance.outputChannel.clear();
    wireMockInstance.outputChannel.appendLine("spawn java " + wireMockParams.join(" "));

    const { spawn } = require('child_process');
    const child = spawn('java', wireMockParams, {shell: true});
    
    child.stderr.on('data', (data: any) => {
        wireMockInstance.outputChannel.appendLine("[error] " + data);
    });

    child.stdout.on('data', (data: any) => {
        wireMockInstance.outputChannel.appendLine(data);
        if(data && data.indexOf("port:") > -1) {
            const assignedPort = (data + "").match(/\d+/g)?.pop() || "0";
            wireMockInstance.port = parseInt(assignedPort);
            wireMockInstance.started = true;
            
            vscode.window.showInformationMessage(new vscode.MarkdownString(`WireMock started on: [${wireMockInstance.wiremockUrl}](${wireMockInstance.wiremockUrl})`).value);

            configureFileWatcher();
        }
    });
}

async function getWireMock(wireMockInstance: WireMockInstance): Promise<Uri> {
    const fileDownloader: FileDownloader = await getApi();
    const downloadedFiles: Uri[] = await fileDownloader.listDownloadedItems(wireMockInstance.extensionContext);
    let wiremockUri = downloadedFiles.filter(x => x.path.endsWith("wiremock.jar"))[0];

    if (!wiremockUri) {
        wireMockInstance.outputChannel.appendLine("Downloading WireMock...");
        wiremockUri = await fileDownloader.downloadFile(
            Uri.parse("https://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-jre8-standalone/2.35.0/wiremock-jre8-standalone-2.35.0.jar"),
            "wiremock.jar",
            wireMockInstance.extensionContext
        );
    }

    return wiremockUri;
}