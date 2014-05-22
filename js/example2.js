(function (exports) {
    'use strict';

    exports.example2 = example2;

    function example2() {
        //read secrets
        var i = 0;
        var secrets = [];
        secrets[i++] = document.forms[0].elements['secretf'].value;
        secrets[i++] = document.forms[0].elements['secretl'].value;
        secrets[i++] = document.forms[0].elements['secretb'].value;
        secrets[i++] = document.forms[0].elements['secretg'].value;

        i = 0;
        var ngramms = [];
        ngramms[i++] = 2;
        ngramms[i++] = 2;
        ngramms[i++] = 1;
        ngramms[i++] = 1;


        //build records
        i = 0;
        var record1 = [];
        record1[i++] = document.forms[0].elements['firstname1'].value;
        record1[i++] = document.forms[0].elements['lastname1'].value;
        record1[i++] = document.forms[0].elements['birthdate1'].value;
        record1[i++] = document.forms[0].elements['gender1'].value;

        i = 0;
        var record2 = [];
        record2[i++] = document.forms[0].elements['firstname2'].value;
        record2[i++] = document.forms[0].elements['lastname2'].value;
        record2[i++] = document.forms[0].elements['birthdate2'].value;
        record2[i++] = document.forms[0].elements['gender2'].value;

        var b1 = new RecordLinkage(1000, 10, 2, 'secret');
        var b2 = new RecordLinkage(1000, 10, 2, 'secret');

        for(var k=0; k < secrets.length; k++) {
            b1.add(record1[k],secrets[k],ngramms[k],10);
            b2.add(record2[k],secrets[k],ngramms[k],10);
        }

        document.forms[0].elements['dice'].value = b1.dice(b2);
    }

})(typeof exports !== "undefined" ? exports : this);