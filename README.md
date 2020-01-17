# Guide To Contributing

[1. Install Dependencies](#<-install-dependencies>)<br>
[2. Get Repositories](#<-fork-and-clone-repositories>)<br>
[3. Run Locally](#<-run-project-locally>)

<br>
<br>
<br>
<br>
<br>
<br>
<br>

# Install Dependencies


#### Solidity Compiler

https://solidity.readthedocs.io/en/v0.5.12/installing-solidity.html

<br>

Solidity is an object-oriented programming language for writing smart contracts. It is used for implementing smart contracts on various blockchain platforms, most notably, Ethereum.

We will use npm to install *solcjs*, a Solidity compiler.

```
npm install -g solc
```
-----

<br>

#### Solidity VSCode Extension


Search the VSCode extension marketplace for 'Solidity', and pick one.  I picked the top result with 785k downloads.

-----

<br>

#### Truffle Suite

https://trufflesuite.com/docs/truffle/getting-started/installation

<br>

```
npm install -g truffle
```
-----

<br>

#### Ganache

https://trufflesuite.com/docs/ganache/quickstart

First, [Download](https://github.com/trufflesuite/ganache/releases/tag/v2.2.1-alpha.0) the appropriate version for your OS. Then, double click on the downloaded file and follow the prompts.

Mac - `Ganache-*.dmg`

Linux - `Ganache-*.AppImage`

-----

<br>

#### ngrok

In order to expose our local NBA Bet server, we will download ngrok.  You'll need to sign up for an account, but it's free and you can easily sign up through Github or Google.

https://dashboard.ngrok.com/signup

Once you've created your account and signed in, follow the setup and installation instructions and peruse the docs if you would like.  The part that primarily concerns us under the "How Do I...?" section is first: "Expose a local web server".

-----

<br>

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

<br>

#### MetaMask Chrome Extension

Google `metamask chrome extension` and download/set up the extension.  You will need to create a new wallet.  For development purposes it's not critical to remember your wallet seed phrase, so you can skip that step if you like. We will be using test blockchain instances to develop our application, with testcoins in place of real ETH tokens.

-----

<br>
<br>
<br>
<br>
<br>

# Fork And Clone Repositories

There are two repositories you will need to fork/clone for development.  First, fork this repository (nba_bet_react).  Then clone to your local machine.  `cd` into nba_bet_react/client and run `npm install`.

Next, fork and clone https://github.com/jragard/nba_bet_server
`cd` into the nba_bet_server directory and run `npm install`.

-----

<br>
<br>
<br>
<br>
<br>

# Run Project Locally

#### Start local server in nba_bet_server directory

`cd` into the nba_bet_server directory you previously forked and cloned.  If you have not yet successfully installed all the necessary dependencies, [follow this guide](#<-install-dependencies>) If you have not yet successfully forked/cloned both the nba_bet_server and nba_bet_react repositories, [get them here](#<-fork-and-clone-repositories>).




