/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService
 *
 * Handles WFS layers' states, for example selected features, top WFS layer, selected WFS layers etc.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */

    function (sandbox) {
        var me = this,
            p;
        
        me.sandbox = sandbox;
        me.WFSFeatureSelections = [];
        me.selectedWFSLayers = [];
        me.selectFromAllLayers;
        me.topWFSLayer;
        //flag for telling mediator's occasional wfs mapclick event that showing the popup is a no-no
        me.selectionToolsActive;

        for (p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.sandbox.registerForEventByName(me, p);
            }
        }

    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: "Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService",
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: "WFSLayerService",
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @public @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         *
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },

        /**
         * @static @property {Object} eventHandlers
         */
        eventHandlers: {
            AfterMapLayerAddEvent: function (event) {
                var me = this,
                    layer = event._mapLayer;
                if (layer._layerType === "WFS") {
                    me.setWFSLayerSelection(layer._id, true);
                }
            },
            AfterMapLayerRemoveEvent: function (event) {
                var me = this,
                    layer = event._mapLayer;
                if (layer._layerType === "WFS") {
                    me.setWFSLayerSelection(layer._id, false);
                }
            }
        },

        /**
         * @method setWFSLayerSelection
         * @param {Object} WFS layer; WFS Layer which is selected or unselected
         * @param {Boolean} status; true if WFS layer is selected and false if WFS layer is removed from selections
         * 
         * Handles the state of selected WFS layers
         */
        setWFSLayerSelection: function (layerId, status) {
            var me = this;
            if (status) {
                me.selectedWFSLayers.push(layerId);
            } else {
                _.pull(me.selectedWFSLayers, [layerId]);
            }
        },

        /**
         * @method getSelectedWFSLayers
         * 
         * @return {Array} this.selectedWFSLayerIds; Ids of selected WFS layers
         */
        getSelectedWFSLayerIds: function () {
            return this.selectedWFSLayerIds;
        },

        /**
         * @method getTopWFSLayer
         * 
         * @return {Number} me.topWFSLayer; Id of the top WFS layer
         */
        getTopWFSLayer: function () {
            var me = this,
                layers = me.sandbox.findAllSelectedMapLayers();

            for (i=0; i < layers.length; i++ ) {
                var layer = layers[i];

                if (layer._layerType === "WFS") {
                    me.topWFSLayer = layer._id;
                }
            }
            return me.topWFSLayer;
        },

        /**
         * @method setWFSFeaturesSelections
         * @param {Number} layeIdr; LayerID whose feature selections are chenged
         * @param {Array} featureIds; featureIds that are selected or removed from selection
         *
         * Handles status of selected features
         */
        setWFSFeaturesSelections: function (layerId, featureIds) {
            var me = this,
                existingFeatureSelections = _.pluck(_.where(me.WFSFeatureSelections, {'layerId': layerId}), 'featureIds');
         
            //no existing selections -> add all
            if (!existingFeatureSelections || existingFeatureSelections.length === 0) {
                existingFeatureSelections.push(featureIds);
            } else {
                //existing selections found -> just add the features that weren't previously selected
                _.each(featureIds, function(featureId) {
                    if (existingFeatureSelections[0].indexOf(featureId) < 0) {
                        existingFeatureSelections[0].push(featureId);
                    }
                });

            }
            //clear old selection
            _.remove(me.WFSFeatureSelections, {'layerId': layerId});
            //add the updated selection
            me.WFSFeatureSelections.push({'layerId' : layerId, 'featureIds': existingFeatureSelections[0]});
        },

        /**
         * @method getWFSFeaturesSelections
         * @param {Number} layerID; ID of layer whose selected featureIds are wanted
         *
         * @return {array} featureIds
         *
         * Returns selected featureIds of the given layer ID. If no layerId is given, returns all the selected featureIds.
         */
        getWFSFeaturesSelections: function (layerId) {
            var me = this,
                featureIds;

            featureIds = _.pluck(_.where(me.WFSFeatureSelections, {'layerId': layerId}), 'featureIds');

            return featureIds[0];
        },

        /**
         * @method emptyWFSFeatureSelections
         * @param {Object} layer; layer whose selected features are going to be removed
         *
         *
         * Changes the values of me.WFSFeatureSelections and sends WFSFeaturesSelectedEvent to notify others about it 
         */
        emptyWFSFeatureSelections: function (layer) {
            var me = this;

            _.remove(me.WFSFeatureSelections, {'layerId': layer._id});
            var event = me.sandbox.getEventBuilder('WFSFeaturesSelectedEvent')([], layer, false);
            me.sandbox.notifyAll(event);
        },
        /**
         * @method setSelectFromAllLayers
         * @param {boolean} selectAll; true if the selection is wanted to be done from all layers and false if not
         *
         * sets the selection mode so that selection is made from all layers on the map
         */
        setSelectFromAllLayers: function (selectAll) {
            var me = this;

            me.selectFromAllLayers = selectAll;
        },
        /**
         * @method isSelectFromAllLayers
         *
         * @return {boolean} me.selectFromAllLayers
         *
         * Tells weather the selection is made from all layers or not 
         */
        isSelectFromAllLayers: function () {
            return this.selectFromAllLayers;
        },
        /**
         * @method setSelectionToolsActive
         * @param {boolean} selectionToolsActive; one or more of the selection tools is active -> gfi not allowed, not even by accident...
         *
         */
        setSelectionToolsActive: function (selectionToolsActive) {
            var me = this;
            me.selectionToolsActive = selectionToolsActive;
        },
        /**
         * @method selectionToolsActive
         *
         * @return {boolean} me.selectionToolsActive
         *
         * Tells the mediator that raising the mapclick is a no-no, because the selection tools are active.
         */
        isSelectionToolsActive: function () {
            return this.selectionToolsActive;
        }
    });
