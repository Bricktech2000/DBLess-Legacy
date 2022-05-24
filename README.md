# DBLess Password Manager

A hash-based, database-less password manager

## Overview

This program takes your master password through a hash function to generate a unique password for any website you visit.

## Requirements

- Python 3

## Setup

```bash
pip3 install cryptography pyperclip
```

## Usage

Before running the program, create a file called `.token` in the root of the repository and put any token you wish in it. It is used to prevent attacks from keyloggers.

```bash
python3 run.py
```

`Service`: the name of the service you wish to log into

`Username`: the username used to log in

`Master Password`: your master password

`[C]opy, [P]rint, [A]bort:`: the action you wish to take

### Example

Below is an example on how to use the program.

```bash
Warning: Token file is empty.
Service: google
Username: my.email@gmail.com
Master Password: Password123
[C]opy, [P]rint, [A]bort: c
```

the program then copies the following password to your clipboard:
`^zLPrWepdR%mXnb<i[3%Nm?EDW[6d>D#QJS{eBrh`
