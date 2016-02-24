# ProDocs
Document Management System

[![Test Coverage](https://codeclimate.com/github/andela-eakinyele/dms-fs/badges/coverage.svg)](https://codeclimate.com/github/andela-eakinyele/dms-fs/coverage) 

[![Code Climate](https://codeclimate.com/github/andela-eakinyele/dms-fs/badges/gpa.svg)](https://codeclimate.com/github/andela-eakinyele/dms-fs)

[![Coverage Status](https://coveralls.io/repos/github/andela-eakinyele/dms-fs/badge.svg?branch=master)](https://coveralls.io/github/andela-eakinyele/dms-fs?branch=master)


# Description
Prodocs is a document management application built on the MEAN stack. It is used to manage sharing of files in a group, consisting of various
roles, and therefore access privileges.

## Tools
A number of tools were used in the development of this application including continuous integration and deployment services

### Pivotal Tracker
Pivotal Tracker was used as a toolf for mangaing the development process, by creating stories that ties to the features on the application. It provides a means of estimating and assessing the velocity of development. ProDocs pivotal tracker board link is provided below.

[Prodocs - Pivotal Tracker Board](https://www.pivotaltracker.com/n/projects/1520757)

## Installation
Open a Terminal and clone the repo
```bash
$ git clone https://github.com/andela-eakinyele/dms-fs.git
```

### Requirements
 [**node.js**](http://node.org) [**mongodb**](http://mongodb.org)

#### Dependencies
Install the application dependencies by running the _npm install_ in the applications root directory

#### Launch
```
Start mongodb service _$mongodb_
npm launch
```

## Usage
The usage of the application is as follows:

###  Users and Group 
1.  Users are required to signup to use the application
2.  On signup, a user is promped to either join a group or create one
3.  Joining a group requires thepassphrase for the group set by group Admin user
4.  A group is created by filling in details of the group, including setting a passphrase
```
Note : Group creator is assigned Admin User privileges
            Admin user then creates roles
```
5.  Others users can then join the group by selecting their roles
6.  Users can also update their profile


### User Priviliges
1.   Users can belong to more than one group 
2.  Users can create documents and assign access roles
3.  Users can view documents with user role defined
4.  Users can delete documents with sole access (i.e user and Admin)
5.  Users cannot delete documents with shared access
6.  Document owners can modify shared roles


##  Contributing
I'd love if you contribute to the source code and make the application even better than it is
If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to the [GitHub Repository](https://github.com/andela-eakinyele/dms-fs/issues). Even better you can submit a Pull Request with a fix.
