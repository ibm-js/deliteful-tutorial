Deliteful Tutorial - How To 
===========================

This file explains how the `deliteful-tutorial` is structured and how to update it with new releases of delite[ful].

# Introduction

This repository (https://github.com/ibm-js/deliteful-tutorial) contains the example Web application described by
the deliteful tutorial docs, accessible publicly here:
http://ibm-js.github.io/deliteful/docs/master/tutorial/index.html, 
and hosted in the ibm-js/deliteful Github repository:
http://github.com/ibm-js/deliteful/tree/master/docs/tutorial.

# Branches

The `deliteful-tutorial` repository has several branches, each corresponding to a part (or step) of the tutorial:
* `part1`: [Part 1 - Getting Started with Deliteful](http://github.com/ibm-js/deliteful/tree/master/docs/tutorial/Part1GettingStarted.md)
* `part4`: [Part 4 - The Photo List View](http://github.com/ibm-js/deliteful/tree/master/docs/tutorial/Part4ListView.md)
* `part5`: [Part 5 - Enhancing the List View](http://github.com/ibm-js/deliteful/tree/master/docs/tutorial/Part5CustomRenderer.md)
* `part6`: [Part 6 - Adding a Details View](http://github.com/ibm-js/deliteful/tree/master/docs/tutorial/Part6DetailsView.md)
* `part7`: [Part 7 - The Settings View](http://github.com/ibm-js/deliteful/tree/master/docs/tutorial/Part7SettingsView.md)
* `part8-1`: [Part 8.1 - Building the Application for Production - Using Build Versions of Dependency Packages]
(http://github.com/ibm-js/deliteful/blob/master/docs/tutorial/Part8Build.md#using-build-versions-of-dependency-packages)
* `part8-2`: [Part 8.2 - Building the Application for Production - Building the Application Into a Single Layer]
(http://github.com/ibm-js/deliteful/blob/master/docs/tutorial/Part8Build.md#building-the-application-into-a-single-layer)

The `master` branch contains the final step of the tutorial, so it should be the same as `part8-2`.

In addition, the `gh-pages` branch contains runnable versions of each branch above. The `gh-pages` branch is 
automatically published and publicly accessible from
`http://ibm-js.github.io/deliteful-tutorial`,
so for example the runnable version of the part of the tutorial is available here:                                
`http://ibm-js.github.io/deliteful-tutorial/runnable/part1/index.html`. The runnable versions are in the 
`runnable` directory of the repository, in subdirectories with the same name as the branch,
for example `runnable/part1`. The runnable versions are basically a copy of each branch, with the "minimal"
dependency files in `bower_components`, that is, the result of a `bower install` with all files that are not strictly
 necessary for the app to run pruned (all samples, READMEs, tests, samples, docs, etc).

# Updating Dependencies

When a new version of deliteful is released, the tutorial example can (should?) be updated accordingly.
* The `bower.json` file must be updated with the new deliteful dependency (e.g. 0.9.x). This must be done in each 
branch above, plus master.
* Each branch should be tested by removing `bower_components`, running `bower install` and testing the app.
* The runnable versions must be updated: for each part _<n>_, do the following:
  * `git checkout part<n>`
  * remove `bower_components`, then `bower install`
  * for `part8-2` only, additionnally do `grunt build`,
  * `git checkout gh-pages`
  * copy the toplevel `bower_components` into `runnable/part<n>`
  * for `part8-2` only, also copy the `build` directory (output of `grunt build`)
  * commit+push the changes to `gh-pages`: this should update only the useful files, 
as the other files (not necessary for runtime) are not in the Git index. **Of course, 
if new files/modules have been added in a new release, and are necessary for the tutorial to run, 
they must be added in Git and committed/pushed too.**

When all runnable versions are updated, you should cleanup files that have been copied from `bower_components` but 
are not necessary for runtime, the simplest way is probably to remove `runnable` altogether and then checkout again 
from Git.

# Fixing / Updating the Tutorial

As there are multiple branches, if there is a need to fix the example you will have to fix in all the appropriate 
branches (depending in which part the fix is, it may not apply to all the branches). You will also have to copy the 
modified file(s) to the appropriate directories in the runnable versions in the `gh-pages` branch.
