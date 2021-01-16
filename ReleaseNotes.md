# 1.1.1

* Added `is true` and `is false` matching methods.
* Added the option to edit the Mapping Table as JSON and CSV directly from within the data element.
  This is useful for importing and exporting data.
* Improved error handling: \
  In case of an error during the matching process, the data element default value or the given (faulty) input value is returned, depending on the mapping table configuration.

# 1.1.0

* Added a new matching method: **regular expression (matching)**. \
This allows you to use the results of your matching groups in the output with the common syntax of `$1`, `$2`, etc. \
You cannot use the matching `$1`, etc. within a data element name in the output. e.g. `%my element $1%` is not supported and will throw an error upon saving the mapping table data element.

# 1.0.8

* Drag-and-drop improvements:
  * Elements are now re-ordered instead of swapped.
  * Mouse selection in input fields works now as expected.


# 1.0.7

* Regex support
* Added configuration screen
* Refactoring


# 1.0

* Initial Version