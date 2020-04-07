# 1.0.9

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