import esri = __esri;

import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import Legend = require("esri/widgets/Legend");
import Expand = require("esri/widgets/Expand");
import LayerList = require("esri/widgets/LayerList");
import ActionToggle = require("esri/support/actions/ActionToggle");
import FeatureEffect = require("esri/views/layers/support/FeatureEffect");

import { getUrlParams } from "./urlParams";
import { createFilterPanelContent } from "./layerListUtils";


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
    "drop shadow": {
      includedEffect: `drop-shadow(2px, 2px, 2px, rgb(50,50,50))`,
      excludedEffect: ` blur(2px) opacity(50%)`
    },
    "grayscale": {
      includedEffect: ``,
      excludedEffect: `grayscale(100%) opacity(50%)`
    },
    "blur": {
      includedEffect: ``,
      excludedEffect: `blur(10px) opacity(60%)`
    },
    "opacity": {
      includedEffect: ``,
      excludedEffect: `opacity(40%)`
    },
    "bloom": {
      includedEffect: "bloom(150%, 1px, 0.2)",
      excludedEffect: "blur(1px) brightness(65%)"
    }
  }

  const layerList = new LayerList({
    view,
    listItemCreatedFunction: (event) => {
      const item = event.item as esri.ListItem;

      item.visible = item.layer.type === "feature";
      if(!item.visible){
        return;
      }
      const featureLayers = view.map.allLayers
        .filter( layer => layer.type === "feature");
      const finalFeatureLayer = featureLayers.getItemAt(featureLayers.length-1);
      const showOptions = finalFeatureLayer.id === item.layer.id;

      item.actionsOpen = showOptions;

      item.actionsSections = [
        Object.keys(effects).map( (key: string) => new ActionToggle({ id: key, title: key, value: false }))
      ] as any;

      item.panel = {
        className: "esri-icon-filter",
        open: showOptions,
        title: "Filter data",
        listItem: item
      } as esri.ListItemPanel;

      createFilterPanelContent({
        panel: item.panel
      })
    }
  });
  view.ui.add(layerList, "top-right");

  layerList.on("trigger-action", (event) => {
    const { action: { id }, item } = event;

    const layerView = item.layerView as esri.FeatureLayerView;

    const actions = item.actionsSections.getItemAt(0);

    actions.forEach(action => {
      (action as ActionToggle).value = action.id === id;
    });

    const filter = layerView.effect && layerView.effect.filter ? layerView.effect.filter.clone() : null;

    layerView.effect = new FeatureEffect({
      filter,
      ...effects[id]
    });
  });

})();
