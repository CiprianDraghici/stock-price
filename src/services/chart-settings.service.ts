import {StockSettings} from "../models/stock.settings";

export class ChartSettingsService {
    private static instance: ChartSettingsService;
    private settings: StockSettings | null = null;

    public static getInstance(): ChartSettingsService {
        if (!ChartSettingsService.instance) {
            ChartSettingsService.instance = new ChartSettingsService();
        }

        return ChartSettingsService.instance;
    }

    public setSpecificProperty(property: keyof StockSettings, value: StockSettings[keyof StockSettings]) {
        // @ts-ignore
        this.settings[property as keyof StockSettings] = value;
    };

    public setSettings(settings: StockSettings) {
        this.settings = {...this.settings, ...settings};
    }

    public getSettings() {
        return {...this.settings} as StockSettings;
    }
}