DBLess Password Manager
=======================

A hash-based, database-less password manager

Overview
--------

This program takes your master password through a hash function to generate a unique password for any website you visit.


Requirements
------------

* Python 3

Setup
-----

```shell
$ pip3 install pyperclip
```

Usage
-----

```shell
$ python3 run.py
```

`domain name`: the domain name of the website you wish to log into

`username`: the username used to log in

`master password`: your master password

Below is an example on how to use the program:
```shell
domain name: gmail.com
username: my.email@gmail.com
master password: Password123
```
the program then copies the following password to your clipboard:
`]Lza$)GCzOBy/I[LtrR1HRTZ%vEPRjklueZgh?*+`
