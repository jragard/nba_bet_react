# Guide To Contributing
<br>
<br>
<br>

#Install Dependencies


#### Solidity Compiler

https://solidity.readthedocs.io/en/v0.5.12/installing-solidity.html

<br>

Solidity is an object-oriented programming language for writing smart contracts. It is used for implementing smart contracts on various blockchain platforms, most notably, Ethereum.

We will use npm to install *solcjs*, a Solidity compiler.

```
npm install -g solc
```
-----

#### Solidity VSCode Extension


Search the VSCode extension marketplace for 'Solidity', and pick one.  I picked the top result with 785k downloads.

-----

#### Truffle Suite

https://trufflesuite.com/docs/truffle/getting-started/installation

<br>

```
npm install -g truffle
```
-----

#### Ganache

https://trufflesuite.com/docs/ganache/quickstart

<br>

First, [Download](https://github.com/trufflesuite/ganache/releases/tag/v2.2.1-alpha.0) the appropriate version for your OS. Then, double click on the downloaded file and follow the prompts.

Mac - `Ganache-*.dmg`

Linux - `Ganache-*.AppImage`

-----

#### Local Tunnel

https://www.npmjs.com/package/localtunnel

<br>

```
npm install -g localtunnel
```
-----

#### Ethereum Bridge

https://npmjs.com/package/ethereum-bridge

<br>

Install via:

npm

```
npm install -g ethereum-bridge
```

Ubuntu

```
sudo apt-get install build-essential -y
```

git

```
git clone https://github.com/oraclize/ethereum-bridge.git
cd ethereum-bridge
npm install
```
-----

#### MetaMask Chrome Extension

Google `metamask chrome extension` and download/set up the extension.  You will need to create a new wallet.  It's not too important to remember your seed phrase because we will be using test blockchain instances to develop.


# 2. Fork And Clone Repositories

There are two repositories you will need to fork/clone for development.  First, fork this repository (nba_bet_react).  Then clone to your local machine.  cd into 'client' and run `npm install`.

Next, fork and clone https://github.com/jragard/nba_bet_server.  Run `npm install`.

# 3. Run Project Locally

#### Start local server in nba_bet_server directory

`cd` into the nba_bet_server directory you previously forked and cloned.  If you have not yet successfully installed all the necessary dependencies, [follow this guide](#install-dependencies) If you have not yet successfully forked/cloned both the nba_bet_server and nba_bet_react repositories, [get them here](2.-fork-and-clone-repositories) 
