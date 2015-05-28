/**
 * @class Oskari.mapframework.bundle.featuredata2.PopupHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.PopupHandler",

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance} instance
     */

    function (instance) {
        this.instance = instance;
        this.localization = instance.getLocalization('popup');

        var me = this,
            selectionPlugin = me.instance.getSelectionPlugin(),
            p;

        this.WFSLayerService = this.instance.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        this.buttons = {
            'point': {
                iconCls: 'selection-point',
                tooltip: me.localization.tools.point.tooltip,
                sticky: false,
                callback: function () {
                    selectionPlugin.startDrawing({
                        drawMode: 'point'
                    });
                }
            },
            'line': {
                iconCls: 'selection-line',
                tooltip: me.localization.tools.line.tooltip,
                sticky: false,
                callback: function () {
                    selectionPlugin.startDrawing({
                        drawMode: 'line'
                    });
                }
            },
            'polygon': {
                iconCls: 'selection-area',
                tooltip: me.localization.tools.polygon.tooltip,
                sticky: false,
                callback: function () {
                    selectionPlugin.startDrawing({
                        drawMode: 'polygon'
                    });
                }
            },
            'square': {
                iconCls: 'selection-square',
                tooltip: me.localization.tools.square.tooltip,
                sticky: false,
                callback: function () {
                    selectionPlugin.startDrawing({
                        drawMode: 'square'
                    });
                }
            },
            'circle': {
                iconCls: 'selection-circle',
                tooltip: me.localization.tools.circle.tooltip,
                sticky: false,
                callback: function () {
                    selectionPlugin.startDrawing({
                        drawMode: 'circle'
                    });
                }
            }
        };

        /* templates */
        this.template = {};
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
    }, {

        __templates: {
            "wrapper": '<div></div>',
            "toolsButton": '<div style= "display: inline-block; border: 1px solid;"></div>',
            "instructions": '<div class="instructions" style="padding: 20px 0px 0px 0px;"></div>',
            "selectAll": '<div class="selectAllFeatures">' +
                '  <label>' +
                '    <input type="checkbox" name="selectAll" />' +
                '    <span></span>' +
                '  </label>' +
                '</div>',
            "link": '<div class="link"><a href="javascript:void(0);"></a></div></div>'
        },

        /**
         * @method showSelectionTools
         * Handles tool button click -> opens selection tool dialog
         */
        "showSelectionTools": function (singleSelection) {
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                popupLoc = this.localization.title,
                content = me.template.wrapper.clone(),
                buttonName;;

            // Safety check at not show more than one popup
            if(jQuery('.tools_selection').is(':visible')) {
                return;
            }

            //Hacky... Set the flag for the mediator to know that no gfi-popups are allowed until the popup is closed...
            me.WFSLayerService.setSelectionToolsActive(true);

            // close popup so we can update the selection geometry
            // this is done so we can optimize grid updates on normal updateExtensionRequests.
            // if the selection show wouldn't use this request but a custom one, this wouldn't be needed
            me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);

            var closureMagic = function (tool) {
                return function () {
                    me.buttons[tool].callback();
                    if (!singleSelection) {
                        me._selectionStarted();
                    }
                };
            };

            for (buttonName in this.buttons) {
                if(this.buttons.hasOwnProperty(buttonName)) {
                    var btnContainer = me.template.toolsButton.clone(),
                        button = this.buttons[buttonName];
                    btnContainer.attr("title", button.tooltip);
                    btnContainer.addClass(button.iconCls);
                    btnContainer.bind('click', closureMagic(buttonName));
                    content.append(btnContainer);
                }
            }

            var instructions = me.template.instructions.clone();
            instructions.append(this.localization.instructions);
            content.append(instructions);

            var selectAll = me.template.selectAll.clone();
            selectAll.find('span').html(this.localization.selectAll);
            selectAll.bind('click', function () {
                if (selectAll.find('input').prop('checked') === true) {
                    me.WFSLayerService.setSelectFromAllLayers(true);
                } else {
                    me.WFSLayerService.setSelectFromAllLayers(false);
                }
            });
            content.append(selectAll);

            var controlButtons = [];
            var emptyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            emptyBtn.setTitle(this.localization.button.empty);
            emptyBtn.setHandler(function () {
                // Remove selections
                var sandbox = me.instance.getSandbox();
                var layers = sandbox.findAllSelectedMapLayers();
                for (var i = 0; i < layers.length; ++i) {
                    if (layers[i].hasFeatureData()) {
                        me.WFSLayerService.emptyWFSFeatureSelections(layers[i]);
                    }
                }
                this.blur();
            });
            emptyBtn.blur();
            controlButtons.push(emptyBtn);
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.localization.button.cancel);
            cancelBtn.setHandler(function () {
                me.WFSLayerService.setSelectionToolsActive(false);
                //destroy the active sketch, disable the selected control
                var selectionPlugin = me.instance.getSelectionPlugin();
                selectionPlugin.drawLayer.removeAllFeatures();
                selectionPlugin._toggleControl();
                dialog.close(true);
            });
            cancelBtn.addClass('primary');
            cancelBtn.blur();
            controlButtons.push(cancelBtn);

            dialog.addClass('tools_selection');
            dialog.show(popupLoc, content, controlButtons);
            dialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'top');

            //tick the select from all layers - checkbox, if it was on previously
            if (me.WFSLayerService.isSelectFromAllLayers()) {
                jQuery('input[type=checkbox][name=selectAll]').prop('checked', true);
            }

        },

        /**
         * @method _editDialog
         * This method triggers when the selection starts
         * @private
         **/
        _selectionStarted: function () {
            var me = this,
                editDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                title = me.localization.title,
                dialogContent = me.template.wrapper.clone(),
                templateButtons = me.template.wrapper.clone(),
                editButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

            editButton.setTitle(me.localization.button.edit);
            editButton.setHandler(function () {
                editDialog.close();
                me.showSelectionTools();
                me.instance.getSelectionPlugin().startDrawing({
                    drawMode: 'modify'
                });
            });

            templateButtons.append(editButton.getElement());

            var closeButton = editDialog.createCloseButton(me.localization.button.close);
            templateButtons.append(closeButton.getElement());
            closeButton.setHandler(function () {
                editDialog.close();
                me.instance.getSelectionPlugin().stopDrawing();
                me.showSelectionTools();
            });
            dialogContent.append(templateButtons);

            var addMoreLink = me.template.link.clone();
            addMoreLink.append(me.localization.link.title);
            addMoreLink.bind('click', function () {
                editDialog.close();
                me.showSelectionTools();
            });
            dialogContent.append(addMoreLink);

            var showSelectionsBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            showSelectionsBtn.setTitle(me.localization.button.show);
            showSelectionsBtn.addClass('primary showSelection');
            showSelectionsBtn.setHandler(function () {
                var features = me.instance.getSelectionPlugin().getFeaturesAsGeoJSON();
                me.instance.getSelectionPlugin().stopDrawing();

                // throw event to new wfs
                var event = me.instance.sandbox.getEventBuilder("WFSSetFilter")(features);
                me.instance.sandbox.notifyAll(event);

                me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'detach']);
                editDialog.close();
            });

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.localization.button.cancel);
            cancelBtn.setHandler(function () {
                editDialog.close();
                me.instance.getSelectionPlugin().stopDrawing();
            });

            editDialog.show(title, dialogContent, [cancelBtn, showSelectionsBtn]);
            editDialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'top');
        }
    });
