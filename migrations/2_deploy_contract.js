
require("dotenv").config({path:"../.env"});

//Define how our smart contract is going to be deployed
var MyToken = artifacts.require("MyToken.sol");
var MyTokenSale = artifacts.require("MyTokenSale");
var MyKycContract = artifacts.require("KycContract");

//Function that gets called through deploy contract 
module.exports = async function (deployer){
    let address = await web3.eth.getAccounts();
    await deployer.deploy(MyToken,process.env.INITIAL_TOKEN);

    await deployer.deploy(MyKycContract);

    //rate, wallet,tokenaddr
    await deployer.deploy(MyTokenSale,1000000,address[0],MyToken.address,MyKycContract.address);
    //Here the address is got from line 8 .... whenever deploy is completed we get address of out token 

    let instance = await MyToken.deployed();
    await instance.transfer(MyTokenSale.address,process.env.INITIAL_TOKEN);
    //We take the instance... and transfer 
}