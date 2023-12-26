declare const _default$1: {
    viewerConfig: {
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
        baseLayer: boolean;
    };
};

interface MapOptions {
}
declare class CMap {
    private _viewer;
    private _id;
    private _options;
    constructor(id: string | Element, options: MapOptions);
    get viewer(): Cesium.Viewer;
}

interface BaseOptions {
    id?: string;
    minimumLevel?: number;
    maximumLevel?: number;
    name?: string;
}
declare class BaseLayer {
    name: string;
    id: string;
    layerType: string;
    protected layer: Cesium.ImageryLayer;
    private _alpha;
    constructor(options: BaseOptions);
    get opacity(): number;
    set opacity(alpha: number);
    get visible(): boolean;
    set visible(show: boolean);
}

interface TiandituOptions {
    id?: string;
    url?: '';
    name?: string;
    type: string;
    tk: string;
    subdomains?: string | Array<string>;
    minimumLevel?: number;
    maximumLevel?: number;
}
declare class TiandituLayer extends BaseLayer {
    private _provider;
    private _options;
    constructor(options: TiandituOptions);
    initProvider(options: TiandituOptions): Cesium.WebMapTileServiceImageryProvider;
    add(viewer: Cesium.Viewer): Cesium.ImageryLayer;
    remove(viewer: Cesium.Viewer): void;
}

declare class AmapImageryProvider extends Cesium.UrlTemplateImageryProvider {
    private _tilingScheme;
    constructor(options: any);
}

interface AmapOptions {
    id?: string;
    url?: string;
    type: string;
    name?: string;
    subdomains?: string | Array<string>;
    minimumLevel?: number;
    maximumLevel?: number;
}
declare class AmapLayer extends BaseLayer {
    private _provider;
    private _options;
    constructor(options: AmapOptions);
    initProvider(options: AmapOptions): AmapImageryProvider;
    add(viewer: Cesium.Viewer): Cesium.ImageryLayer;
    remove(viewer: Cesium.Viewer): void;
}

declare const _default: {
    TiandituLayer: typeof TiandituLayer;
    AmapLayer: typeof AmapLayer;
};

export { CMap, _default as layerModule, _default$1 as presets };
