PPRL-JS
======

Privacy preserving record linkage with Bloom filters implemented in Javascript

The Javascript file "recordlinkage.js" implements the idea from: 
Schnell, R., Bachteler, T., & Reiher, J. (2009). Privacy-preserving record linkage using Bloom filters. BMC Medical Informatics and Decision Making, 9(1), 41. doi:10.1186/1472-6947-9-41

* The implementation allows the serialization/deserialization of the Bloom filter into/from a JSON Object.
* The Bloom filter implementation is currently quite inefficient.
* As hash functions HMAC-SHA-1 with counter are used. The Forge library (https://github.com/digitalbazaar/forge) is used for calculating the HMAC.

