import * as vscode from 'vscode';
import { ExtenstionSettingsEnum } from './ExtensionSettingsEnum';

export class WireMockInstance {
    private static instance: WireMockInstance;

    constructor(context: vscode.ExtensionContext) { 
        this._extensionContext = context;
    }
    

    public static getInstance(context?: vscode.ExtensionContext): WireMockInstance {
        if (!WireMockInstance.instance && context) {
            WireMockInstance.instance = new WireMockInstance(context);
        }

        return WireMockInstance.instance;
    }

    
    private _outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('WireMock', 'log');
    private _extensionContext : vscode.ExtensionContext;
    private _port : number = 8080;
    private _rootDir: vscode.Uri = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : vscode.Uri.parse(process.cwd());
    
    private _extensionSettingsPrefix: string = "wiremock";

    public getConfiguration<T>(setting: ExtenstionSettingsEnum): T | undefined {
        const config = vscode.workspace.getConfiguration(this._extensionSettingsPrefix);
        return config.get<T>(setting);
    }
    
    public get extensionSettingsPrefix() : string {
        return this._extensionSettingsPrefix;
    }
    
    public get extensionContext() : vscode.ExtensionContext {
        return this._extensionContext;
    }
    public set extensionContext(v : vscode.ExtensionContext) {
        this._extensionContext = v;
    }

    public get outputChannel() : vscode.OutputChannel {
        return this._outputChannel;
    }
    public set outputChannel(v : vscode.OutputChannel) {
        this._outputChannel = v;
    }

    public get port() : number {
        return this._port;
    }
    public set port(v : number) {
        this._port = v;
    }
    
    public get rootDir() : vscode.Uri {
        return this._rootDir;
    }
    public set rootDir(v : vscode.Uri) {
        this._rootDir = v;
    }
    
}