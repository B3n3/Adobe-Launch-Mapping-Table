Adobe Launch - Mapping Table
============================

Provides a rich and versatile mapping table data element.

Supports eight different methods:
* Regular Expression (with and without matching)
* Exact matches
* Case insensitive matches
* Starts with
* Contains
* Is True
* Is False

Further the output can be static or another data element to offer even more flexibility.  
E.g. ideal for implementing multiple marketing pixels.  

Support of Drag-and-Drop for re-ordering the entries.  
JSON & CSV import and export supported directly from within the data element.

If you are using the *regex with matching*, you can use the results of your matching groups in the output with the common syntax of `$1`, `$2`, etc. \
You cannot use the matching `$1`, etc. within a data element name in the output. e.g. `%my element $1%` is not supported and will throw an error upon saving the mapping table data element. 

A **detailed walk through** of some use cases can be found in the [Tutorial PDF](doc/mapping-table-tutorial.pdf).


Official implementation of https://www.adobeexchange.com/experiencecloud.details.103136.html.

-------------------------------------------------------------------------------------------------------------------

Please refer to the [Release Notes](ReleaseNotes.md) for an overview of what has changed in the respective version.