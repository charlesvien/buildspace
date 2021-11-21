import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ReactLoading from 'react-loading';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import BirdNFT from './utils/BirdNFT.json';

const TWITTER_HANDLE = 'CharlesVien';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/birbnft-i8lqrn2rra';
const TOTAL_MINT_COUNT = 50;

const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [loading, setLoading] = useState(false);
    
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account)
      } else {
          console.log("No authorized account found")
      }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    setLoading(true);

    const CONTRACT_ADDRESS = "0x0e0072988189CB1c65c152b88184a378eF00678A";
    try {
      const { ethereum } = window;

      if (ethereum) {
        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

        const rinkebyChainId = "0x4"; 
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
          setLoading(false);
          return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, BirdNFT.abi, signer);

        connectedContract.on("NewBirbNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`)
        });


        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mintNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
  
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const openOpenSea = () => {
    window.open(OPENSEA_LINK, '_blank');
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src="https://pbs.twimg.com/profile_images/1399816906585083904/_97zXEa2_200x200.jpg"
              alt="Logo"
              width="100px"
            />
          </div>
          <p className="header gradient-text">Birb Collection</p>
          <p className="sub-text">
            Mint your very own Birb on the blockchain now!
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '30px',
            }}
          >
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '60px',
                }}
              >
                <ReactLoading type="bars" color="black" height={15} width={70} />
              </div>
            ) : (
              <>
                {currentAccount === "" ? (
                  <button onClick={connectWallet} className="cta-button connect-wallet-button">
                    Connect to Wallet
                  </button>
                ) : (
                  <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                    Mint NFT
                  </button>
                )}
              </>
            )}
            <button onClick={openOpenSea} className="cta-button connect-wallet-button">
              View Collection on OpenSea
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;