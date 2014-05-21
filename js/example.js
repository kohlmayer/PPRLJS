(function (exports) {
    'use strict';

    exports.example = example;

    function example() {
        var b1 = new RecordLinkage(500, 15, 2, 'secret');
        var b2 = new RecordLinkage(500, 15, 2, 'secret');
        b1.add(document.forms[0].elements['value1'].value);
        b2.add(document.forms[0].elements['value2'].value);
        document.forms[0].elements['dice'].value = b1.dice(b2);
        document.forms[0].elements['serialized'].value = b1.serialize();
    }

})(typeof exports !== "undefined" ? exports : this);