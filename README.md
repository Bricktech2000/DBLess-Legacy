# DBLess Password Manager

A hash-based, database-less password manager

## Overview

This program takes your master password through a hash function to generate a unique password for any website you visit.

## Requirements

- Python 3

## Setup

```bash
pip3 install pyperclip
```

## Usage

```bash
$ python3 run.py
```

`Service`: the name of the service you wish to log into

`Username`: the username used to log in

`Master Password`: your master password

### Example

Below is an example on how to use the program.

```bash
Service: google
Username: my.email@gmail.com
Master Password: Password123
```

the program then copies the following password to your clipboard:
`N>j}33P[6[F?a{fQ$5{gn{<F#z8hJ7B=u<.E1p!J`
