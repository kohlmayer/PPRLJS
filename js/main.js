(function(exports) {
    'use strict';

    exports.test = test;

    function test() {
        var b1 = new RecordLinkage(500, 15, 2, 'secret');
        var b2 = new RecordLinkage(500, 15, 2, 'secret');
        b1.add('Mayer');
        b2.add('Meyer');
        var ser = JSON.stringify(b1);
        console.log(ser);
        console.log(deserializeRL(ser).dice(b2));
    }

})(typeof exports !== "undefined" ? exports : this);