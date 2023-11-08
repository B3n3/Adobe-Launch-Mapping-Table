# Adobe Launch - Mapping Table

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

## Basic Usage:
Select a **Data Element** to be searched for matches - this can either be a single value such as `%pageName%` or an array, like `%productsInCart%`. 

When an array is given, each element of the array will be searched, and a corresponding mapping given, resulting in an output which is an array, of the same length as the input array.

Click the `+` sign to add a mapping row. Order matters - higher rows will be considered first and the search for a match will end with the first successful match. You can drag and drop rows to change the order.

Within each row choose:
- A **Method** - possible methods are mentioned above
- An **Input** - this is what you are looking to match within the Data Element. 
- An **Output** - this is what you want to transform the Input into

E.g. if the Method is "Contains", the Input is "meaning of life", the Output is "42", and the Data Element is "what is the answer to the meaning of life?" then the output will be "42"

Check the **Default Value** at the top if you want to pass through the original value in the case that no match has been found. If unselected and no match is found, the output value will be `undefined`.

A **detailed walk through** of some use cases can be found in the [Tutorial PDF](doc/mapping-table-tutorial.pdf).


Official implementation of https://www.adobeexchange.com/experiencecloud.details.103136.html.

-------------------------------------------------------------------------------------------------------------------

Please refer to the [Release Notes](ReleaseNotes.md) for an overview of what has changed in the respective version.
