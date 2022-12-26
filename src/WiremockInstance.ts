import * as vscode from 'vscode';
import { configureFileWatcher } from './configureFileWatcher';
import { ExtensionSettingsEnum } from './ExtensionSettingsEnum';
import { MemFS } from './fileSystemProvider';

export class WireMockInstance {
    private static instance: WireMockInstance;

    constructor(context: vscode.ExtensionContext) {
        this._extensionContext = context;
    }

    public static getInstance(context?: vscode.ExtensionContext): WireMockInstance {
        if (!WireMockInstance.instance && context) {
            WireMockInstance.instance = new WireMockInstance(context);
            WireMockInstance.instance.init();

            vscode.workspace.onDidChangeConfiguration(() => {
                WireMockInstance.instance.init();
            });
        }

        return WireMockInstance.instance;
    }

    private _outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('WireMock', 'log');
    private _extensionContext: vscode.ExtensionContext;
    private _host: string = "localhost";
    private _port: number = 8080;
    private _useHttps: boolean = false;
    private _autoReset : boolean = true;
    private _started: boolean = false;
    private _rootDir: vscode.Uri = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : vscode.Uri.parse(process.cwd());
    private _memFs: vscode.FileSystemProvider = new MemFS();
    private _fileWatcher : vscode.FileSystemWatcher | null = null;
    
    private _extensionSettingsPrefix: string = "wiremock";

    private init() {
        this.host = this.getConfiguration<string>(ExtensionSettingsEnum.host) || "localhost";
        this.port = this.getConfiguration<number>(ExtensionSettingsEnum.port) || 8080;
        this.useHttps = this.getConfiguration<boolean>(ExtensionSettingsEnum.useHttps) || false;

        let reset = this.getConfiguration<boolean>(ExtensionSettingsEnum.autoReset);
        this.autoReset =  reset === undefined ? true : reset;

        configureFileWatcher();
    }

    public getConfiguration<T>(setting: ExtensionSettingsEnum): T | undefined {
        const config = vscode.workspace.getConfiguration(this._extensionSettingsPrefix);
        return config.get<T>(setting);
    }

    public async setConfiguration<T>(setting: ExtensionSettingsEnum, value: T): Promise<void> {
        const config = vscode.workspace.getConfiguration(this._extensionSettingsPrefix);
        await config.update(setting, value);
    }

    public get wiremockUrl(): string {
        return `${this._useHttps ? "https" : "http"}://${this._host}:${this._port}`;
    }

    public get extensionSettingsPrefix(): string {
        return this._extensionSettingsPrefix;
    }

    public get started(): boolean {
        return this._started;
    }
    public set started(v: boolean) {
        this._started = v;
    }

    public get memFs(): vscode.FileSystemProvider {
        return this._memFs;
    }
    public set memFs(value: vscode.FileSystemProvider) {
        this._memFs = value;
    }

    public get extensionContext(): vscode.ExtensionContext {
        return this._extensionContext;
    }
    public set extensionContext(v: vscode.ExtensionContext) {
        this._extensionContext = v;
    }

    public get outputChannel(): vscode.OutputChannel {
        return this._outputChannel;
    }
    public set outputChannel(v: vscode.OutputChannel) {
        this._outputChannel = v;
    }

    public get host(): string {
        return this._host;
    }
    public set host(v: string) {
        this._host = v;
    }

    public get port(): number {
        return this._port;
    }
    public set port(v: number) {
        this._port = v;
    }

    public get useHttps(): boolean {
        return this._useHttps;
    }
    public set useHttps(v: boolean) {
        this._useHttps = v;
    }

    public get autoReset() : boolean {
        return this._autoReset;
    }
    public set autoReset(v : boolean) {
        this._autoReset = v;
    }

    public get rootDir(): vscode.Uri {
        return this._rootDir;
    }
    public set rootDir(v: vscode.Uri) {
        this._rootDir = v;
    }

    public get fileWatcher() : vscode.FileSystemWatcher | null {
        return this._fileWatcher;
    }
    public set fileWatcher(v : vscode.FileSystemWatcher | null) {
        this._fileWatcher = v;
    }

}