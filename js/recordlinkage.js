(function (exports) {
    'use strict';
    exports.RecordLinkage = RecordLinkage;
    exports.deserializeRL = deserializeRL;

    // implementing: Schnell, R., Bachteler, T., & Reiher, J. (2009).
    // Privacy-preserving record linkage using Bloom filters. BMC Medical
    // Informatics and Decision Making, 9(1), 41. doi:10.1186/1472-6947-9-41

    // inspired by:
    // - https://github.com/jasondavies/bloomfilter.js,
    // - https://github.com/magnuss/java-bloomfilter
    // - http://spyced.blogspot.de/2009/01/all-you-ever-wanted-to-know-about.html

    function RecordLinkage(bitLength, numHashes, ngramSize, key) {
        if (typeof bitLength !== "undefined") {
            this.bitLength = bitLength;
            this.numHashes = numHashes;
            this.key = key;
            this.ngramSize = ngramSize;
            this.buckets = [];
            for (var i = 0; i < bitLength; i++) {
                this.buckets[i] = 0;
            }
        }
    }

    RecordLinkage.prototype.parse = function (jsonString) {
        var o = JSON.parse(jsonString);
        this.bitLength = o.bitLength;
        this.numHashes = o.numHashes;
        this.key = o.key;
        this.ngramSize = o.ngramSize;
        this.buckets = o.buckets;
    };

    RecordLinkage.prototype.locations = function (value, key, ngramSize, numHashes) {
        var ngrams = this.ngrams(value, ngramSize);
        var locations = [];
        for (var i = 0; i < ngrams.length; i++) {
            var h = this.hashes(ngrams[i], key, numHashes);
            locations = locations.concat(h);
        }
        return locations;
    };

    RecordLinkage.prototype.add = function (value, key, ngramSize, numHashes) {
        var localKey;
        if (typeof key !== "undefined") {
            localKey = key;
        } else {
            localKey = this.key;
        }

        var localngram;
        if (typeof ngramSize !== "undefined") {
            localngram = ngramSize;
        } else {
            localngram = this.ngramSize;
        }

        var localnumHashes;
        if (typeof numHashes !== "undefined") {
            localnumHashes = numHashes;
        } else {
            localnumHashes = this.numHashes;
        }

        var l = this.locations(this.normalize(value), localKey, localngram, localnumHashes);
        for (var i = 0; i < l.length; i++) {
            this.buckets[l[i] % this.bitLength] = 1;
        }
    };

    RecordLinkage.prototype.test = function (value) {
        var localKey;
        if (typeof key !== "undefined") {
            localKey = key;
        } else {
            localKey = this.key;
        }
        var l = this.locations(this.normalize(value), localKey);
        for (var i = 0; i < l.length; i++) {
            if (this.buckets[l[i] % this.bitLength] === 0) {
                return false;
            }
        }
        return true;
    };

    RecordLinkage.prototype.normalize = function (value) {
        // Uppercase, replace some non-alphanumeric characters and all whitespaces
        return value.toUpperCase().replace(/[-'`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/\s]/g, '');
    };

    RecordLinkage.prototype.dice = function (bloomFilter) {
        var common = 0;
        var thisBloom = 0;
        var otherBloom = 0;
        for (var i = 0; i < this.buckets.length; i++) {
            if (this.buckets[i] === 1 && this.buckets[i] === bloomFilter.buckets[i]) {
                common++;
            }
            if (this.buckets[i] === 1) {
                thisBloom++;
            }
            if (bloomFilter.buckets[i] === 1) {
                otherBloom++;
            }
        }
        return 2 * common / (thisBloom + otherBloom);
    };

    RecordLinkage.prototype.hashes = function (value, key, numHashes) {
        var hashes = [];
        var counter = 0;
        var i = 0;

        var hmac = forge.hmac.create();
        hmac.start('sha1', key);

        while (i < numHashes) {
            hmac.update(counter + value + counter);
            var digestValue = hmac.digest();
            counter++;
            while (digestValue.length() > 0 && i < numHashes) {
                var intValue = digestValue.getInt32();
                hashes.push(intValue);
                i++;
            }
        }
        return hashes;
    };

    RecordLinkage.prototype.size = function () {
        var bits = 0;
        for (var i = 0; i < this.buckets.length; i++) {
            if (this.buckets[i] === 1) {
                bits++;
            }
        }
        return bits;
    };

    RecordLinkage.prototype.serialize = function () {
        return JSON.stringify(this);
    };

    RecordLinkage.prototype.ngrams = function (value, ngramSize) {
        var ngramValues = [];
        var n = ngramSize;
        for (var i = 0; i < n - 1; i++) {
            value = '_' + value + '_';
        }
        for (var j = 0; j < value.length - n + 1; j++) {
            var ngramValue = value.substr(j, n);
            ngramValues.push(ngramValue);
        }
        return ngramValues;
    };

    function deserializeRL(value) {
        var rl = new RecordLinkage();
        rl.parse(value);
        return rl;
    }

})(typeof exports !== "undefined" ? exports : this);
