import React, { useState } from "react";
import Web3 from "web3";

const App = () => {
  // 사용자의 MetaMask 계정 주소
  const [account, setAccount] = useState(null);
  // 현재 MetaMask에서 연결된 블록체인의 네트워크 ID
  const [network, setNetwork] = useState(null);
  // 현재 연결된 계정의 이더리움 잔액
  const [balance, setBalance] = useState(null);

  // MetaMask 지갑 연결
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); // 첫 번째 계정을 저장

        const networkId = await web3.eth.net.getId();
        setNetwork(networkId); // 네트워크 ID 저장

        // 잔액 조회
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        const balanceEther = web3.utils.fromWei(balanceWei, "ether");
        setBalance(balanceEther); // ETH 잔액 저장
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask를 설치해주세요!");
    }
  };

  // 네트워크 ID를 이름으로 변환
  const getNetworkName = (networkId) => {
    const networks = {
      1: "Mainnet",
      3: "Ropsten",
      4: "Rinkeby",
      5: "Goerli",
      42: "Kovan",
    };
    return networks[networkId] || "Unknown";
  };

  // 0.01 ETH 전송
  const sendTransaction = async () => {
    if (window.ethereum && account) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // 트랜잭션 전송
        await web3.eth.sendTransaction({
          from: account, // 연결된 MetaMask 계정 주소
          to: "0xRecipientAddressHere", // 수신자 주소 (변경 필요)
          value: web3.utils.toWei("0.01", "ether"), // 0.01 ETH 전송
        });
        alert("트랜잭션이 성공적으로 전송되었습니다!");
      } catch (error) {
        console.error("트랜잭션 실패:", error);
        alert("트랜잭션 전송에 실패했습니다.");
      }
    } else {
      alert("지갑을 연결해주세요!");
    }
  };

  return (
    <div>
      <h1>Web3.js 프론트엔드 예제</h1>
      {account ? (
        <div>
          <p>지갑 주소: {account}</p>
          <p>네트워크: {getNetworkName(network)}</p>
          <p>잔액: {balance} ETH</p>
          <button onClick={sendTransaction}>0.01 ETH 전송</button>
        </div>
      ) : (
        <button onClick={connectWallet}>지갑 연결</button>
      )}
    </div>
  );
};

export default App;
