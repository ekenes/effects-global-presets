import esri = __esri;

import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import Legend = require("esri/widgets/Legend");
import Expand = require("esri/widgets/Expand");
import LayerList = require("esri/widgets/LayerList");
import ActionToggle = require("esri/support/actions/ActionToggle");

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

  view.ui.add(new Expand({
    content: new Legend({ view }),
    view,
    expanded: false
  }), "bottom-left");

  const effects = {
    "drop shadow": `drop-shadow(2px, 2px, 2px, rgb(50,50,50))`,
    "grayscale": `grayscale(100%) opacity(50%)`,
    "blur": `blur(6px)`,
    "opacity": `opacity(40%)`,
    "bloom": `bloom(150%, 1px, 0.2)`
  }

  const layerList = new LayerList({
    view,
    listItemCreatedFunction: (event) => {
      const item = event.item as esri.ListItem;

      const finalLayer = view.map.layers.getItemAt(view.map.layers.length-1);
      const showOptions = finalLayer.id === item.layer.id;

      item.actionsOpen = showOptions;

      item.actionsSections = [
        Object.keys(effects).map( (key: string) => new ActionToggle({ id: key, title: key, value: false }))
      ] as any;
    }
  });
  view.ui.add(layerList, "top-right");

  layerList.on("trigger-action", (event) => {
    const { action, item } = event;
    const { id, value } = action as esri.ActionToggle;

    const layer = item.layer as esri.FeatureLayer;
    const actions = item.actionsSections.getItemAt(0);

    actions.forEach(action => {
      (action as ActionToggle).value = (action as ActionToggle).value && action.id === id;
    });

    layer.effect = value && effects[id] ? effects[id] : null;
  });

})();
