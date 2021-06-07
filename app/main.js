var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/widgets/Legend", "esri/widgets/Expand", "esri/widgets/LayerList", "esri/widgets/BasemapLayerList", "esri/support/actions/ActionToggle", "esri/widgets/BasemapGallery", "./urlParams"], function (require, exports, WebMap, MapView, Legend, Expand, LayerList, BasemapLayerList, ActionToggle, BasemapGallery, urlParams_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        function triggerAction(event) {
            var action = event.action, item = event.item;
            var _a = action, id = _a.id, value = _a.value;
            var layer = item.layer;
            var actions = item.actionsSections.reduce(function (p, c) { return p.concat(c); });
            actions.forEach(function (action) {
                action.value = action.value && action.id === id;
            });
            layer.effect = value && effects[id] ? effects[id] : null;
        }
        function basemapListItemCreatedFunction(event) {
            var item = event.item;
            item.actionsSections = [
                createActions(allEffects)
            ];
        }
        var webmap, map, view, allEffects, polygonEffects, pointEffects, lineEffects, effects, createActions, layerList, basemapLayerList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    webmap = urlParams_1.getUrlParams().webmap;
                    map = new WebMap({
                        portalItem: {
                            id: webmap
                        }
                    });
                    return [4 /*yield*/, map.load()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, map.loadAll()];
                case 2:
                    _a.sent();
                    view = new MapView({
                        map: map,
                        container: "viewDiv"
                    });
                    view.ui.add("titleDiv", "top-right");
                    view.ui.add(new Expand({
                        content: new Legend({ view: view }),
                        view: view,
                        expanded: false,
                        group: "bottom-left"
                    }), "bottom-left");
                    view.ui.add(new Expand({
                        content: new BasemapGallery({ view: view }),
                        view: view,
                        expanded: false,
                        group: "bottom-left"
                    }), "bottom-left");
                    allEffects = {
                        "Mid-Century": "grayscale(50%)",
                        "Grayscale": "grayscale(100%)",
                        "Invert Colors": "invert(100%) hue-rotate(180deg)",
                        "Darken": "brightness(80%) grayscale(15%)",
                        "Saturate": "contrast(155%)",
                        "Vintage": "brightness(90%) grayscale(50%)",
                        "Dramatic": "contrast(200%) grayscale(19%)",
                        "Enhance": "brightness(80%) contrast(200%)"
                    };
                    polygonEffects = {
                        "Focus (polygons)": "drop-shadow(0px, 0px, 9px, #000000)"
                    };
                    pointEffects = {
                        "Focus (points)": "drop-shadow(2px, 3px, 2px, #3D3D3D)",
                        "Cluster focus": "bloom(1, 1px, 0.3)"
                    };
                    lineEffects = {
                        "Focus (lines)": "drop-shadow(1px, 1px, 3px, #000000)",
                        "Firefly": "bloom(1, 0px, 0)"
                    };
                    effects = __assign(__assign(__assign(__assign({}, allEffects), polygonEffects), pointEffects), lineEffects);
                    createActions = function (effects) { return Object.keys(effects).map(function (key) { return new ActionToggle({ id: key, title: key, value: false }); }); };
                    layerList = new LayerList({
                        view: view,
                        listItemCreatedFunction: function (event) {
                            var item = event.item;
                            var finalLayer = view.map.layers.getItemAt(view.map.layers.length - 1);
                            var showOptions = finalLayer.id === item.layer.id;
                            item.actionsOpen = showOptions;
                            var layer = item.layer;
                            var effects = {};
                            if (layer.geometryType === "point" || layer.geometryType === "multipoint") {
                                effects = __assign(__assign({}, allEffects), pointEffects);
                            }
                            if (layer.geometryType === "polyline") {
                                effects = __assign(__assign({}, allEffects), lineEffects);
                            }
                            if (layer.geometryType === "polygon" || layer.geometryType === "multipatch") {
                                effects = __assign(__assign({}, allEffects), polygonEffects);
                            }
                            item.actionsSections = [
                                createActions(effects)
                            ];
                        }
                    });
                    view.ui.add(new Expand({
                        view: view,
                        content: layerList,
                        expanded: true,
                        group: "top-right"
                    }), "top-right");
                    layerList.on("trigger-action", triggerAction);
                    basemapLayerList = new BasemapLayerList({
                        view: view,
                        baseListItemCreatedFunction: basemapListItemCreatedFunction,
                        referenceListItemCreatedFunction: basemapListItemCreatedFunction
                    });
                    view.ui.add(new Expand({
                        view: view,
                        content: basemapLayerList,
                        expanded: false,
                        group: "top-right"
                    }), "top-right");
                    basemapLayerList.on("trigger-action", triggerAction);
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map