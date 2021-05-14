define(["require", "exports", "esri/views/layers/support/FeatureEffect", "esri/views/layers/support/FeatureFilter", "esri/widgets/Slider"], function (require, exports, FeatureEffect, FeatureFilter, Slider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createFilterPanelContent(params) {
        var panel = params.panel;
        var fields = panel.listItem.layer.fields;
        var panelContent = document.createElement("div");
        var fieldSelect = document.createElement("select");
        var option = document.createElement("option");
        option.value = "";
        option.text = "";
        fieldSelect.appendChild(option);
        var validFieldTypes = ["double", "integer", "single", "small-integer", "long"];
        fields
            .filter(function (field) { return validFieldTypes.indexOf(field.type) > -1; })
            .forEach(function (field) {
            var option = document.createElement("option");
            option.value = field.name;
            option.text = field.alias;
            fieldSelect.appendChild(option);
        });
        var slider = new Slider({
            min: 0,
            max: 10000,
            container: document.createElement("div"),
            values: [0],
            visibleElements: {
                labels: true,
                rangeLabels: true
            },
            rangeLabelInputsEnabled: true,
            labelInputsEnabled: true,
            disabled: true
        });
        fieldSelect.addEventListener("change", function () {
            slider.disabled = fieldSelect.value === "";
            var layerView = panel.listItem.layerView;
            var field = fieldSelect.value;
            if (layerView.effect) {
                layerView.effect.filter = new FeatureFilter({
                    where: field + " > " + slider.values[0]
                });
            }
            else {
                layerView.effect = new FeatureEffect({
                    filter: new FeatureFilter({
                        where: field + " > " + slider.values[0]
                    })
                });
            }
        });
        slider.watch("values", function (values) {
            var layerView = panel.listItem.layerView;
            var field = fieldSelect.value;
            if (layerView.effect) {
                layerView.effect.filter = new FeatureFilter({
                    where: field + " > " + values[0]
                });
            }
            else {
                layerView.effect = new FeatureEffect({
                    filter: new FeatureFilter({
                        where: field + " > " + values[0]
                    })
                });
            }
        });
        panelContent.appendChild(fieldSelect);
        panelContent.appendChild(slider.container);
        panel.content = panelContent;
    }
    exports.createFilterPanelContent = createFilterPanelContent;
});
//# sourceMappingURL=layerListUtils.js.map