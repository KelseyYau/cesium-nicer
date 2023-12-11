declare const _default$1: {
    viewer: {
        animation: boolean;
        baseLayerPicker: boolean;
        fullscreenButton: boolean;
        vrButton: boolean;
        geocoder: boolean;
        homeButton: boolean;
        InfoBox: boolean;
        sceneModePicker: boolean;
        selectionIndicator: boolean;
        timeline: boolean;
        navigationHelpButton: boolean;
    };
};

declare enum TiandituType {
    Vec = "vec",
    Img = "img",
    Ter = "ter",
    Cia = "cia",
    Cva = "cva",
    Cta = "cta",
    Ibo = "ibo"
}
interface TiandituOptions {
    id?: string;
    url?: '';
    type: TiandituType;
    tk: string;
    subdomains?: string | Array<string>;
}
declare class TiandituLayer {
    private _provider;
    private _options;
    private _layer;
    id: string;
    constructor(options: TiandituOptions);
    initProvider(options: TiandituOptions): Cesium.WebMapTileServiceImageryProvider;
    add(viewer: Cesium.Viewer): Cesium.ImageryLayer;
    remove(viewer: Cesium.Viewer): void;
}

declare const _default: {
    TiandituLayer: typeof TiandituLayer;
};

export { _default as layerModule, _default$1 as presets };
