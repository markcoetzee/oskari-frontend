/**
 * Sends data of the open indicators.
 *
 * @class Oskari.statistics.bundle.statsgrid.event.IndicatorSelectedEvent
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.event.IndicatorSelectedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (indicator, datasourceId, indicatorId, selectors) {
        this.indicator = indicator;
        this.indicatorId = indicatorId;
        this.datasourceId = datasourceId;
        this.selectors = selectors;
    }, {
        /**
         * Returns event name
         * @method getName
         * @return {String} The event name.
         */
        getName: function () {
            return 'StatsGrid.IndicatorSelectedEvent';
        },
        /**
         * @method getIndicator
         * @return {Indicator} indicator
         */
        getIndicator: function () {
            return this.indicator;
        },
        /**
         * @method getIndicatorId
         * @return {String} indicator id
         */
        getIndicatorId: function () {
            return this.indicatorId;
        },
        /**
         * @method getIndicatorId
         * @return {String} datasource id
         */
        getDatasourceId: function () {
            return this.datasourceId;
        },
        /**
         * Returns options that user has selected when adding the indicator.
         * @method getOptions
         * @return {Object} selections from user when adding the indicator
         */
        getSelectors: function () {
            return this.selectors;
        },
        // A stable stringify for JSON objects.
        "stringify": function(obj) {
          return ",".join(Object.keys(obj).sort().map(function(key) {return key + ":" + obj[key]}));
        },
        /**
         * Returns unique id for the indicator selections.
         * The same indicator can be added multiple times with different options so datasource and indicatorId alone can't be used
         * to differentiate an added indicator.
         * This should only be used for client side implementation and should not be parsed by user
         * (use other getters to get actual data about selections)
         * @method getKey
         * @return {String} unique key for the indicator selection
         */
        getKey: function() {
            var separator = '||',
                key = this.getDatasourceId() + separator + this.getIndicatorId(),
                opts = this.getSelectors();
            if(opts) {
                key = key + separator + this.stringify(opts);
            }
            return key;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });