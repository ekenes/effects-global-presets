import esri = __esri;

import FeatureEffect = require("esri/views/layers/support/FeatureEffect");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import Slider = require("esri/widgets/Slider");

interface CreateFilterPanelParams {
  fields?: esri.Field[];
  panel: esri.ListItemPanel;
}

export function createFilterPanelContent(params: CreateFilterPanelParams){
  const { panel } = params;
  const fields = (panel.listItem.layer as esri.FeatureLayer).fields;

  const panelContent = document.createElement("div");
  const fieldSelect = document.createElement("select");

  const option = document.createElement("option");
  option.value = "";
  option.text = "";
  fieldSelect.appendChild(option);

  const validFieldTypes: esri.Field["type"][] = [ "double", "integer", "single", "small-integer", "long" ];

  fields
    .filter(field => validFieldTypes.indexOf(field.type) > -1)
    .forEach( field => {
      const option = document.createElement("option");
      option.value = field.name;
      option.text = field.alias;
      fieldSelect.appendChild(option);
    });

  const slider = new Slider({
    min: 0,
    max: 10000,
    container: document.createElement("div"),
    values: [ 0 ],
    visibleElements: {
      labels: true,
      rangeLabels: true
    },
    rangeLabelInputsEnabled: true,
    labelInputsEnabled: true,
    disabled: true
  });

  fieldSelect.addEventListener("change", () => {
    slider.disabled = fieldSelect.value === "";

    const layerView = panel.listItem.layerView as esri.FeatureLayerView;
    const field = fieldSelect.value;

    if(layerView.effect){
      layerView.effect.filter = new FeatureFilter({
        where: `${field} > ${slider.values[0]}`
      });
    } else {
      layerView.effect = new FeatureEffect({
        filter: new FeatureFilter({
          where: `${field} > ${slider.values[0]}`
        })
      });
    }
  });

  slider.watch("values", (values) => {
    const layerView = panel.listItem.layerView as esri.FeatureLayerView;
    const field = fieldSelect.value;

    if(layerView.effect){
      layerView.effect.filter = new FeatureFilter({
        where: `${field} > ${values[0]}`
      });
    } else {
      layerView.effect = new FeatureEffect({
        filter: new FeatureFilter({
          where: `${field} > ${values[0]}`
        })
      });
    }
  });

  panelContent.appendChild(fieldSelect);
  panelContent.appendChild(slider.container as HTMLElement);

  panel.content = panelContent;
}