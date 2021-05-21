import esri = __esri;

import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import Legend = require("esri/widgets/Legend");
import Expand = require("esri/widgets/Expand");
import LayerList = require("esri/widgets/LayerList");
import BasemapLayerList = require("esri/widgets/BasemapLayerList");
import ActionToggle = require("esri/support/actions/ActionToggle");
import BasemapGallery = require("esri/widgets/BasemapGallery");

import { getUrlParams } from "./urlParams";

( async () => {

  const { webmap } = getUrlParams();

  const map = new WebMap({
    portalItem: {
      id: webmap
    }
  });

  await map.load();
  await map.loadAll();

  const view = new MapView({
    map: map,
    container: "viewDiv"
  });
  view.ui.add("titleDiv", "top-right");

  view.ui.add(new Expand({
    content: new Legend({ view }),
    view,
    expanded: false
  }), "bottom-left");

  view.ui.add(new Expand({
    content: new BasemapGallery({ view }),
    view,
    expanded: false
  }), "bottom-left");

  const allEffects = {
    "Mid-Century": `grayscale(50%)`,
    "Grayscale": `grayscale(100%)`,
    "Invert Colors": `invert(100%)`,
    "Darken": `brightness(80%) grayscale(15%)`,
    "Saturate": `contrast(155%)`
  };

  const polygonEffects = {
    "Focus (polygons)": `drop-shadow(0px, 0px, 9px, #000000)`
  };

  const pointEffects = {
    "Cluster focus": `bloom(1, 1px, 0.3)`
  };

  const lineEffects = {
    "Focus (lines)": `drop-shadow(1px, 1px, 3px, #000000)`,
    "Firefly": `bloom(1, 0px, 0)`
  };

  const effects = {
    ...allEffects,
    ...polygonEffects,
    ...pointEffects,
    ...lineEffects
  };

  const createActions = (effects:any) => Object.keys(effects).map( (key: string) => new ActionToggle({ id: key, title: key, value: false }));

  const layerList = new LayerList({
    view,
    listItemCreatedFunction: (event) => {
      const item = event.item as esri.ListItem;

      const finalLayer = view.map.layers.getItemAt(view.map.layers.length-1);
      const showOptions = finalLayer.id === item.layer.id;

      item.actionsOpen = showOptions;

      const layer = item.layer as esri.FeatureLayer;

      let effects = {};

      if(layer.geometryType === "point" || layer.geometryType === "multipoint"){
        effects = {
          ...allEffects,
          ...pointEffects
        };
      }

      if(layer.geometryType === "polyline"){
        effects = {
          ...allEffects,
          ...lineEffects
        };
      }

      if(layer.geometryType === "polygon" || layer.geometryType === "multipatch"){
        effects = {
          ...allEffects,
          ...polygonEffects
        };
      }

      item.actionsSections = [
        createActions(effects)
      ] as any;
    }
  });
  view.ui.add(layerList, "top-right");

  function triggerAction (event: esri.LayerListTriggerActionEvent) {
    const { action, item } = event;
    const { id, value } = action as esri.ActionToggle;

    const layer = item.layer as esri.FeatureLayer;
    const actions = item.actionsSections.reduce((p, c) => p.concat(c));

    actions.forEach(action => {
      (action as ActionToggle).value = (action as ActionToggle).value && action.id === id;
    });

    layer.effect = value && effects[id] ? effects[id] : null;
  }

  layerList.on("trigger-action", triggerAction);

  function basemapListItemCreatedFunction (event: any) {
    const item = event.item as esri.ListItem;
    item.actionsSections = [
      createActions(allEffects)
    ] as any;
  }

  const basemapLayerList = new BasemapLayerList({
    view,
    baseListItemCreatedFunction: basemapListItemCreatedFunction,
    referenceListItemCreatedFunction: basemapListItemCreatedFunction
  });
  view.ui.add(basemapLayerList, "top-right");
  basemapLayerList.on("trigger-action", triggerAction);

})();
