const TokenSale = artifacts.require("MyTokenSale.sol");
const Token = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");
const assert = require('assert');
const chai = require('./setupTest');
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Sales Test", async(accounts)=>{

    const [deployerAccount,recipient,anotherAccount] = accounts;
    console.log("DeployerAccount 2 ",deployerAccount);
    it("Deployer should have 0 token",async()=>{
        let instance = await Token.deployed();
        //console.log("Deployed instance ",instance );
        let balanceOfDeployer= await instance.balanceOf(deployerAccount);
        console.log("balanceOfDeployer",balanceOfDeployer)
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));

    })

    it("All tokens should be in the tokensale contract by default",async()=>{
        let instance = await Token.deployed();
        //console.log("Deployed instance ",instance );
        let balanceOfContract= await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balanceOfContract).to.be.a.bignumber.equal(totalSupply)

    });

    it("Should be able to buy tokens ",async()=>{
        let tokenInstance = await Token.deployed();
        let tokenSalesInstance = await TokenSale.deployed();
        let balanceBeforeTokenSalesContract = await tokenInstance.balanceOf(TokenSale.address);

        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        let KycInstance = await KycContract.deployed();

        await KycInstance.setKycCompleted(deployerAccount, {from:deployerAccount})
        console.log("Balance before ," ,balanceBefore )
        try{
            await tokenSalesInstance.sendTransaction({from:deployerAccount,value:web3.utils.toWei("19","wei")});
            assert(true);
        } 
        catch(err){
            console.log(err)
            assert(false);
        }
        balanceAfter = await tokenInstance.balanceOf(deployerAccount);
        console.log("Balance after ," ,balanceAfter );
        console.log("Balance balanceBeforeTokenSalesContract ," ,balanceBeforeTokenSalesContract );
        
        balanceInTokenSalesContract = await tokenInstance.balanceOf(TokenSale.address);
        // assert.equal(balanceAfter,balanceBefore.add(new BN(1)));
        // assert.equal(BN(balanceInTokenSalesContract),balanceBeforeTokenSalesContract.sub(new BN(1)));
        expect(balanceAfter).to.be.a.bignumber.equal(balanceBefore.add(new BN(19)));
        expect(balanceInTokenSalesContract).to.be.a.bignumber.equal(balanceBeforeTokenSalesContract.sub(new BN(19)))
    })

}
);