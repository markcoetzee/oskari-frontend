/**
 * @class Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundle
 *
 */
Oskari.clazz.define(
    "Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundle",
    function () {}, {
        "create": function() {
            return Oskari.clazz.create(
                "Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance"
            );
        },
        "start": function() {},
        "stop": function() {},
        "update": function(manager, bundle, bi, info) {}
    }, {
        "protocol": [
            "Oskari.bundle.Bundle",
            "Oskari.bundle.BundleInstance",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"
        ],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/instance.js"

            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/service/MetadataLoader.js"

            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/view/MetadataPanel.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/view/MetadataPage.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/Flyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/Tile.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/request/ShowMetadataRequest.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/request/ShowMetadataRequestHandler.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/plugin/MetadataLayerPlugin.js"
            }, {
                "type": "text/css",
                "src": "../../../../bundles/catalogue/metadataflyout/resources/css/style.css"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/resources/locale/fi.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/resources/locale/en.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/catalogue/metadataflyout/resources/locale/sv.js"
            }],
            "resources": []
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "metadataflyout",
                "Bundle-Name": "catalogue.bundle.metadataflyout",
                "Bundle-Author": [{
                    "Name": "jjk",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2012",
                        "End": "2012"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}
            }
        }
    }
);

Oskari.bundle_manager.installBundleClass(
	"metadataflyout",
	"Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundle"
);
